import os

from autogen_core.models import ModelFamily
from autogen_ext.models.openai import OpenAIChatCompletionClient
import dotenv

#  加载环境变量
dotenv.load_dotenv(r"E:\BaiduSyncdisk\.env")
names = ["zhipu", "hug", "bailian", "huoshan", "mota", "xunfei", "gemini", "router", "qik", "moli", "guiji", "deepseek"]


def get_model_client(llm_name="mota"):
    if llm_name not in names:
        llm_name = "mota"

    return OpenAIChatCompletionClient(
        model=os.getenv(f'model_{llm_name}'),
        base_url=os.getenv(f'base_url_{llm_name}'),
        api_key=os.getenv(f'api_key_{llm_name}'),
        model_info={
            "vision": False,
            "function_calling": True,
            "json_output": True,
            "family": ModelFamily.UNKNOWN,
            "structured_output": True,
            "multiple_system_messages": True,
        },
    )


# 单例设计模式
model_client = get_model_client()
