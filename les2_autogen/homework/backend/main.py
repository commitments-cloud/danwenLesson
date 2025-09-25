"""
FastAPI主应用程序入口
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import chat, sessions


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用程序生命周期管理"""
    # 启动时初始化数据库
    await init_db()
    yield
    # 关闭时的清理工作
    pass


# 创建FastAPI应用实例
app = FastAPI(
    title="AI Chat System",
    description="基于AutoGen的智能对话系统",
    version="1.0.0",
    lifespan=lifespan
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(sessions.router, prefix="/api/v1", tags=["sessions"])


@app.get("/")
async def root():
    """根路径健康检查"""
    return {"message": "AI Chat System API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "message": "Service is running normally"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
