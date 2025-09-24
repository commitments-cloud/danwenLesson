"""
数据库配置和连接管理
"""
import asyncio
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.config import settings

# 创建数据库引擎
if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite配置
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False},
        echo=settings.DEBUG
    )
else:
    # 其他数据库配置
    engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()

def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def init_db():
    """初始化数据库表"""
    # 导入所有模型以确保它们被注册
    from app.models import ChatSession, ChatMessage
    
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
