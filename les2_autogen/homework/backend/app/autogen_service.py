"""
AutoGen服务模块
"""
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_ext.models.openai import OpenAIChatCompletionClient

from app.d3_llms import get_model_client


class AutoGenService:
    """AutoGen对话服务"""

    def __init__(self):
        self.agents: Dict[str, AssistantAgent] = {}
        self.model_clients: Dict[str, OpenAIChatCompletionClient] = {}

    async def get_or_create_agent(
            self,
            session_id: int,
            model_name: str = "mota",
            system_message: str = """
    你是一个有趣的AI助手,会使用比较幽默的方式回答用户的问题，如果用户问题不清晰的时候，你可以询问下或者猜测他想问的问题，引导他怎么问问题。
    """,
            temperature: float = 0.7,
            max_tokens: int = 2000
    ) -> AssistantAgent:
        """获取或创建代理"""
        agent_key = f"session_{session_id}"

        if agent_key not in self.agents:
            # 使用 d3_llms 中的方法创建模型客户端
            model_client = get_model_client(
                llm_name=model_name,
                temperature=temperature,
                max_tokens=max_tokens,
                model_client_stream=True
            )

            # 创建助手代理
            agent = AssistantAgent(
                name=f"assistant_{session_id}",
                model_client=model_client,
                system_message=system_message,
                model_client_stream=True  # 启用流式输出
            )

            self.agents[agent_key] = agent
            self.model_clients[agent_key] = model_client

        return self.agents[agent_key]

    async def chat_stream(
            self,
            session_id: int,
            message: str,
            model_name: str = "mota",
            system_message: str = """
    你是一个有趣的AI助手,会使用比较幽默的方式回答用户的问题，如果用户问题不清晰的时候，你可以询问下或者猜测他想问的问题，引导他怎么问问题。
    """,
            temperature: float = 0.7,
            max_tokens: int = 2000
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """流式聊天"""
        try:
            # 获取或创建代理
            agent = await self.get_or_create_agent(
                session_id=session_id,
                model_name=model_name,
                system_message=system_message,
                temperature=temperature,
                max_tokens=max_tokens
            )

            # 发送消息并获取流式响应
            response_content = ""

            # 使用AutoGen进行对话
            async for event in agent.run_stream(task=message):
                if hasattr(event, 'content'):
                    if hasattr(event, 'type'):
                        if event.type == 'ModelClientStreamingChunkEvent':
                            # 流式内容块
                            chunk_content = event.content
                            response_content += chunk_content
                            yield {
                                "type": "chunk",
                                "content": chunk_content,
                                "full_content": response_content
                            }
                        elif event.type == 'TextMessage' and hasattr(event, 'source') and event.source == 'assistant':
                            # 最终完整消息
                            yield {
                                "type": "complete",
                                "content": event.content,
                                "usage": getattr(event, 'models_usage', None)
                            }
                            return
                    else:
                        # 处理TaskResult
                        if hasattr(event, 'messages') and event.messages:
                            last_message = event.messages[-1]
                            if hasattr(last_message, 'content'):
                                yield {
                                    "type": "complete",
                                    "content": last_message.content,
                                    "usage": getattr(last_message, 'models_usage', None)
                                }
                                return

            # 如果没有收到完成信号，发送最后的内容
            if response_content:
                yield {
                    "type": "complete",
                    "content": response_content,
                    "usage": None
                }

        except Exception as e:
            yield {
                "type": "error",
                "content": f"对话过程中发生错误: {str(e)}",
                "error": str(e)
            }

    async def chat_simple(
            self,
            session_id: int,
            message: str,
            model_name: str = "mota",
            system_message: str = """
    你是一个有趣的AI助手,会使用比较幽默的方式回答用户的问题，如果用户问题不清晰的时候，你可以询问下或者猜测他想问的问题，引导他怎么问问题。
    """,
            temperature: float = 0.7,
            max_tokens: int = 2000
    ) -> Dict[str, Any]:
        """简单聊天（非流式）"""
        try:
            # 获取或创建代理
            agent = await self.get_or_create_agent(
                session_id=session_id,
                model_name=model_name,
                system_message=system_message,
                temperature=temperature,
                max_tokens=max_tokens
            )

            # 发送消息并获取响应
            result = await agent.run(task=message)

            if result.messages:
                last_message = result.messages[-1]
                return {
                    "success": True,
                    "content": last_message.content,
                    "usage": getattr(last_message, 'models_usage', None)
                }
            else:
                return {
                    "success": False,
                    "content": "未收到有效响应",
                    "error": "No valid response received"
                }

        except Exception as e:
            return {
                "success": False,
                "content": f"对话过程中发生错误: {str(e)}",
                "error": str(e)
            }

    async def clear_session(self, session_id: int):
        """清除会话"""
        agent_key = f"session_{session_id}"

        if agent_key in self.agents:
            # 关闭模型客户端
            if agent_key in self.model_clients:
                try:
                    # 某些客户端可能没有close方法
                    if hasattr(self.model_clients[agent_key], 'close'):
                        await self.model_clients[agent_key].close()
                except Exception as e:
                    print(f"关闭模型客户端时出错: {e}")
                finally:
                    del self.model_clients[agent_key]

            # 删除代理
            del self.agents[agent_key]

    async def cleanup(self):
        """清理所有资源"""
        for client in self.model_clients.values():
            try:
                await client.close()
            except:
                pass

        self.agents.clear()
        self.model_clients.clear()


# 创建全局服务实例
autogen_service = AutoGenService()
