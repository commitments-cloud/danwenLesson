"""
应用程序配置模块
"""
import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """应用程序设置"""

    
    # 数据库配置
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./chat_system.db")
    
    # 应用程序配置
    APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.getenv("APP_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS配置
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    class Config:

        case_sensitive = True


# 创建全局设置实例
settings = Settings()
