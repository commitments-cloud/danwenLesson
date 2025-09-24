# Please install OpenAI SDK first: `pip3 install openai dotenv`

from openai import OpenAI
import dotenv
import os

# 加载环境变量
dotenv.load_dotenv(r"E:\BaiduSyncdisk\.env")
names = ["zhipu", "hug", "bailian", "huoshan", "mota", "xunfei", "gemini", "router", "qik", "moli", "guiji", "deepseek"]
"""
model=os.getenv(f'model_{llm_name}'),
base_url=os.getenv(f'base_url_{llm_name}'),
api_key=os.getenv(f'api_key_{llm_name}'),
"""
client = OpenAI(api_key=os.getenv('api_key_zhipu'), base_url=os.getenv('base_url_zhipu'))

# response = client.chat.completions.create(
#     model=os.getenv('model_zhipu'),
#     messages=[
#         {"role": "system", "content": "你是鲁迅，擅长以鲁迅的风格编写文章"},
#         {"role": "user", "content": "帮我写一篇关于机器学习的文章"},
#     ],
#     stream=False
# )
#
# print(response.choices[0].message.content)


# 流式输出
response = client.chat.completions.create(
    model=os.getenv('model_zhipu'),
    messages=[
        {"role": "system", "content": "你是鲁迅，擅长以鲁迅的风格编写文章"},
        {"role": "user", "content": "帮我写一篇关于机器学习的文章"},
    ],
    stream=True
)

for chunk in response:
    # 海象运算符  先赋值 后判断
    if content := chunk.choices[0].delta.content:
        print(content, end="")
