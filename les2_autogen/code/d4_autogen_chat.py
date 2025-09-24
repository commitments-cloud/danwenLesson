import asyncio

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import ModelClientStreamingChunkEvent
from autogen_agentchat.ui import Console

from d3_llms import model_client

agent = AssistantAgent(
    name="reporter_agent",
    model_client=model_client,
    system_message="你擅长编写古诗",
    model_client_stream=True,  # 支持流式输出
)


# await 不能直接写在模块中
# 如果函数中调用了协程函数，那么当前函数必须声明为协程函数
async def main():
    result = await agent.run(task="编写一首5言古诗")  # 等待run方法执行完成后返回结果
    print(type(result), result)
    # 结果是一个TaskResult的对象 message = [TextMessage-用户的问题,TextMessage-回答的问题]
    # TextMessage（id,source,models_usage,metadata,created_at,content,type）

    print(result.messages[1].content)


async def main_stream():
    # 获取协程对象
    result = agent.run_stream(task="编写一首4言古诗")  # 当前代码不会执行run_stream()中的代码,直接返回协程对象
    # 结果是一个协程对象 async_generator  循环之后每个迭代都会返回一个对象
    # 用户的问题对象类型是TextMessage，回答的对象类型是TModelClientStreamingChunkEvent
    # （id,source,models_usage,metadata,created_at,content,type）
    print(type(result))

    async for item in result:
        print(type(item), item)
        if isinstance(item, ModelClientStreamingChunkEvent):
            print(item.content, end="", flush=True)


async def main_console():
    await Console(agent.run_stream(task="编写一首4言古诗"))


# asyncio.run(main())
asyncio.run(main_stream())
# asyncio.run(main_console())
