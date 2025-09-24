"""
聊天相关API路由
"""
import json
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse

from app.database import get_db
from app.models import ChatSession, ChatMessage
from app.schemas import ChatRequest, BaseResponse
from app.autogen_service import autogen_service

router = APIRouter()

@router.get("/chat/stream")
async def chat_stream(
    message: str,
    session_id: int = None,
    stream: bool = True,
    db: Session = Depends(get_db)
):
    """流式聊天接口"""
    try:
        # 获取或创建会话
        if session_id:
            session = db.query(ChatSession).filter(
                ChatSession.id == session_id,
                ChatSession.is_active == True
            ).first()
            if not session:
                raise HTTPException(status_code=404, detail="会话不存在")
        else:
            # 创建新会话
            session = ChatSession(title="新对话")
            db.add(session)
            db.commit()
            db.refresh(session)

        # 保存用户消息
        user_message = ChatMessage(
            session_id=session.id,
            role="user",
            content=message
        )
        db.add(user_message)
        db.commit()

        # 如果是第一条用户消息且会话标题是"新对话"，则使用用户消息作为标题
        if session.title == "新对话":
            # 检查是否是第一条用户消息
            user_message_count = db.query(ChatMessage).filter(
                ChatMessage.session_id == session.id,
                ChatMessage.role == "user"
            ).count()

            if user_message_count == 1:
                # 截取前30个字符作为标题
                new_title = message[:30] + "..." if len(message) > 30 else message
                session.title = new_title

        # 更新会话时间
        session.updated_at = user_message.created_at
        db.commit()

        # 在生成器外部提取会话信息，避免DetachedInstanceError
        session_id = session.id
        user_message_id = user_message.id
        model_name = session.model_name
        system_message = session.system_message
        temperature = float(session.temperature)
        max_tokens = session.max_tokens

        async def generate_response():
            """生成流式响应"""
            assistant_content = ""

            # 发送会话信息
            yield {
                "event": "session",
                "data": json.dumps({'session_id': session_id, 'user_message_id': user_message_id})
            }

            try:
                # 获取流式响应
                async for chunk in autogen_service.chat_stream(
                    session_id=session_id,
                    message=message,
                    model_name=model_name,
                    system_message=system_message,
                    temperature=temperature,
                    max_tokens=max_tokens
                ):
                    if chunk["type"] == "chunk":
                        # 发送内容块
                        yield {
                            "event": "chunk",
                            "data": json.dumps({'content': chunk['content'], 'full_content': chunk['full_content']})
                        }
                        assistant_content = chunk["full_content"]
                    
                    elif chunk["type"] == "complete":
                        # 完成响应
                        assistant_content = chunk["content"]
                        
                        # 保存助手消息（使用新的数据库会话）
                        from app.database import SessionLocal
                        with SessionLocal() as new_db:
                            # 处理usage对象，转换为可序列化的字典
                            usage_data = chunk.get("usage")
                            if usage_data and hasattr(usage_data, '__dict__'):
                                usage_dict = {
                                    "prompt_tokens": getattr(usage_data, 'prompt_tokens', 0),
                                    "completion_tokens": getattr(usage_data, 'completion_tokens', 0),
                                    "total_tokens": getattr(usage_data, 'total_tokens', 0)
                                }
                            else:
                                usage_dict = usage_data

                            assistant_message = ChatMessage(
                                session_id=session_id,
                                role="assistant",
                                content=assistant_content,
                                message_metadata={}
                            )
                            new_db.add(assistant_message)
                            new_db.commit()
                            new_db.refresh(assistant_message)
                            assistant_message_id = assistant_message.id
                        
                        # 发送完成事件
                        yield {
                            "event": "complete",
                            "data": json.dumps({'assistant_message_id': assistant_message_id, 'content': assistant_content, 'usage': chunk.get('usage')})
                        }
                        break
                    
                    elif chunk["type"] == "error":
                        # 发送错误事件
                        yield {
                            "event": "error",
                            "data": json.dumps({'error': chunk['error'], 'content': chunk['content']})
                        }
                        break
                        
            except Exception as e:
                yield {
                    "event": "error",
                    "data": json.dumps({'error': str(e), 'content': f'处理请求时发生错误: {str(e)}'})
                }
        
        return EventSourceResponse(generate_response())
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"服务器错误: {str(e)}")

@router.post("/chat")
async def chat_simple(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """简单聊天接口（非流式）"""
    try:
        # 获取或创建会话
        if request.session_id:
            session = db.query(ChatSession).filter(
                ChatSession.id == request.session_id,
                ChatSession.is_active == True
            ).first()
            if not session:
                raise HTTPException(status_code=404, detail="会话不存在")
        else:
            # 创建新会话
            session = ChatSession(title="新对话")
            db.add(session)
            db.commit()
            db.refresh(session)
        
        # 保存用户消息
        user_message = ChatMessage(
            session_id=session.id,
            role="user",
            content=request.message
        )
        db.add(user_message)
        db.commit()

        # 如果是第一条用户消息且会话标题是"新对话"，则使用用户消息作为标题
        if session.title == "新对话":
            # 检查是否是第一条用户消息
            user_message_count = db.query(ChatMessage).filter(
                ChatMessage.session_id == session.id,
                ChatMessage.role == "user"
            ).count()

            if user_message_count == 1:
                # 截取前30个字符作为标题
                new_title = request.message[:30] + "..." if len(request.message) > 30 else request.message
                session.title = new_title
                db.commit()
        
        # 获取AI响应
        response = await autogen_service.chat_simple(
            session_id=session.id,
            message=request.message,
            model_name=session.model_name,
            system_message=session.system_message,
            temperature=float(session.temperature),
            max_tokens=session.max_tokens
        )
        
        if response["success"]:
            # 处理usage对象，转换为可序列化的字典
            usage_data = response.get("usage")
            if usage_data and hasattr(usage_data, '__dict__'):
                usage_dict = {
                    "prompt_tokens": getattr(usage_data, 'prompt_tokens', 0),
                    "completion_tokens": getattr(usage_data, 'completion_tokens', 0),
                    "total_tokens": getattr(usage_data, 'total_tokens', 0)
                }
            else:
                usage_dict = usage_data

            # 保存助手消息（暂时不保存usage信息以避免序列化问题）
            assistant_message = ChatMessage(
                session_id=session.id,
                role="assistant",
                content=response["content"],
                message_metadata={}
            )
            db.add(assistant_message)
            db.commit()
            
            return BaseResponse(
                data={
                    "session_id": session.id,
                    "user_message": user_message.to_dict(),
                    "assistant_message": assistant_message.to_dict()
                }
            )
        else:
            raise HTTPException(status_code=500, detail=response["content"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"服务器错误: {str(e)}")
