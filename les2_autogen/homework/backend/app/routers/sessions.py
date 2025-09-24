"""
会话管理相关API路由
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from sqlalchemy.sql import func

from app.database import get_db
from app.models import ChatSession, ChatMessage
from app.schemas import (
    ChatSessionCreate, 
    ChatSessionUpdate, 
    ChatSessionResponse,
    ChatMessageResponse,
    BaseResponse,
    SearchRequest,
    PaginatedResponse
)
from app.autogen_service import autogen_service

router = APIRouter()

@router.post("/sessions", response_model=BaseResponse)
async def create_session(
    session_data: ChatSessionCreate,
    db: Session = Depends(get_db)
):
    """创建新会话"""
    try:
        session = ChatSession(
            title=session_data.title,
            model_name=session_data.model_name,
            system_message=session_data.system_message,
            temperature=session_data.temperature,
            max_tokens=session_data.max_tokens
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return BaseResponse(
            message="会话创建成功",
            data=session.to_dict()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建会话失败: {str(e)}")

@router.get("/sessions", response_model=BaseResponse)
async def get_sessions(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """获取会话列表"""
    try:
        # 计算偏移量
        offset = (page - 1) * size
        
        # 查询会话
        sessions_query = db.query(ChatSession).filter(
            ChatSession.is_active == True
        ).order_by(desc(ChatSession.updated_at))
        
        total = sessions_query.count()
        sessions = sessions_query.offset(offset).limit(size).all()
        
        # 转换为响应格式
        session_list = [session.to_dict() for session in sessions]
        
        return BaseResponse(
            data={
                "items": session_list,
                "total": total,
                "page": page,
                "size": size,
                "pages": (total + size - 1) // size
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取会话列表失败: {str(e)}")

@router.get("/sessions/{session_id}", response_model=BaseResponse)
async def get_session(
    session_id: int,
    db: Session = Depends(get_db)
):
    """获取单个会话详情"""
    try:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.is_active == True
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在")
        
        return BaseResponse(data=session.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取会话详情失败: {str(e)}")

@router.put("/sessions/{session_id}", response_model=BaseResponse)
async def update_session(
    session_id: int,
    session_data: ChatSessionUpdate,
    db: Session = Depends(get_db)
):
    """更新会话"""
    try:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.is_active == True
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在")
        
        # 更新字段
        update_data = session_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(session, field, value)
        
        db.commit()
        db.refresh(session)
        
        return BaseResponse(
            message="会话更新成功",
            data=session.to_dict()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"更新会话失败: {str(e)}")

@router.delete("/sessions/{session_id}", response_model=BaseResponse)
async def delete_session(
    session_id: int,
    db: Session = Depends(get_db)
):
    """删除会话"""
    try:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.is_active == True
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在")
        
        # 删除相关消息
        db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).delete()

        # 软删除会话
        session.is_active = False
        db.commit()
        
        # 清理AutoGen会话
        await autogen_service.clear_session(session_id)
        
        return BaseResponse(message="会话删除成功")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除会话失败: {str(e)}")

@router.get("/sessions/{session_id}/messages", response_model=BaseResponse)
async def get_session_messages(
    session_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """获取会话消息"""
    try:
        # 验证会话存在
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.is_active == True
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在")
        
        # 计算偏移量
        offset = (page - 1) * size
        
        # 查询消息
        messages_query = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.created_at)
        
        total = messages_query.count()
        messages = messages_query.offset(offset).limit(size).all()
        
        # 转换为响应格式
        message_list = [message.to_dict() for message in messages]
        
        return BaseResponse(
            data={
                "items": message_list,
                "total": total,
                "page": page,
                "size": size,
                "pages": (total + size - 1) // size
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取会话消息失败: {str(e)}")

@router.post("/sessions/search", response_model=BaseResponse)
async def search_sessions(
    search_request: SearchRequest,
    db: Session = Depends(get_db)
):
    """搜索会话"""
    try:
        query = search_request.query
        limit = search_request.limit
        
        # 搜索会话标题和消息内容
        sessions = db.query(ChatSession).join(ChatMessage, isouter=True).filter(
            ChatSession.is_active == True,
            or_(
                ChatSession.title.contains(query),
                ChatMessage.content.contains(query)
            )
        ).distinct().order_by(desc(ChatSession.updated_at)).limit(limit).all()
        
        # 转换为响应格式
        session_list = [session.to_dict() for session in sessions]
        
        return BaseResponse(
            data={
                "sessions": session_list,
                "total": len(session_list),
                "query": query
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"搜索会话失败: {str(e)}")

@router.delete("/sessions/{session_id}/clear", response_model=BaseResponse)
async def clear_session_messages(
    session_id: int,
    db: Session = Depends(get_db)
):
    """清空会话消息"""
    try:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.is_active == True
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在")
        
        # 删除所有消息
        db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).delete()

        # 更新会话的updated_at时间戳
        session.updated_at = func.now()
        db.commit()
        
        # 清理AutoGen会话
        await autogen_service.clear_session(session_id)
        
        return BaseResponse(message="会话消息清空成功")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"清空会话消息失败: {str(e)}")
