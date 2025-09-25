import asyncio
import os
from typing import Optional

from autogen_agentchat.agents import AssistantAgent
from autogen_core.models import ModelFamily
from autogen_ext.models.openai import OpenAIChatCompletionClient
import dotenv

# 加载环境变量
dotenv.load_dotenv(r"E:\BaiduSyncdisk\.env")

# 支持的模型名称
names = ["zhipu", "hug","gf", "bailian", "huoshan", "mota", "xunfei", "gemini", "router", "qik", "moli", "guiji", "deepseek",
         "openai"]


def get_model_client(
        llm_name: str = "mota",
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        model_client_stream: bool = True
) -> OpenAIChatCompletionClient:
    """
    获取模型客户端

    Args:
        llm_name: 模型名称，支持多种大模型
        temperature: 温度参数
        max_tokens: 最大token数
        model_client_stream: 是否支持流式输出

    Returns:
        OpenAIChatCompletionClient: 模型客户端
    """
    # 如果模型名称不在支持列表中，使用默认模型
    if llm_name not in names:
        llm_name = "mota"

    # 使用其他模型配置
    model = os.getenv(f'model_{llm_name}')
    base_url = os.getenv(f'base_url_{llm_name}')
    api_key = os.getenv(f'api_key_{llm_name}')

    # 构建客户端参数
    client_kwargs = {
        "model": model,
        "base_url": base_url,
        "api_key": api_key,
        "model_info": {
            "vision": False,
            "function_calling": True,
            "json_output": True,
            "family": ModelFamily.UNKNOWN,
            "structured_output": True,
            "multiple_system_messages": True,
        },
    }

    # 添加可选参数
    if temperature is not None:
        client_kwargs["temperature"] = temperature
    if max_tokens is not None:
        client_kwargs["max_tokens"] = max_tokens

    return OpenAIChatCompletionClient(**client_kwargs)


# 默认模型客户端（单例模式）
default_model_client = get_model_client("gf")

if __name__ == '__main__':
    default_model_client = get_model_client("gf")

    agent = AssistantAgent(
        name="reporter_agent",
        model_client=default_model_client,
        system_message="你擅长编写古诗",
        model_client_stream=True,  # 支持流式输出
    )


    async def main():
        result = await agent.run(task="编写一首5言古诗")  # 等待run方法执行完成后返回结果
        # print(type(result), result)
        # 结果是一个TaskResult的对象 message = [TextMessage-用户的问题,TextMessage-回答的问题]
        # TextMessage（id,source,models_usage,metadata,created_at,content,type）

        print(result.messages[1].content)


    asyncio.run(main())

