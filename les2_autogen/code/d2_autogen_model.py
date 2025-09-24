# pip install -U "autogen-agentchat"  "autogen-ext[openai]"

import asyncio
import dotenv
import os

from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_core.models import UserMessage, SystemMessage, ModelFamily

# 加载环境变量
dotenv.load_dotenv(r"E:\BaiduSyncdisk\.env")
names = ["zhipu", "hug", "bailian", "huoshan", "mota", "xunfei", "gemini", "router", "qik", "moli", "guiji", "deepseek"]

openai_model_client = OpenAIChatCompletionClient(
    model=os.getenv('model_zhipu'),
    api_key=os.getenv('api_key_zhipu'),
    base_url=os.getenv('base_url_zhipu'),
    model_info={
        "vision": False,
        "function_calling": True,
        "json_output": True,
        "family": ModelFamily.UNKNOWN,
        "structured_output": True,
        "multiple_system_messages": True,
    }
)


# 定义一个协程函数
async def main():
    result = await openai_model_client.create([UserMessage(content="编写一段冒泡排序", source="user"),
                                               SystemMessage(content="你是python编程高手")])
    print(result.content)
    await openai_model_client.close()


asyncio.run(main())
