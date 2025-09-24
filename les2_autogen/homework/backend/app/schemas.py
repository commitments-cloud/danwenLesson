"""
Pydantic模式定义
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# 基础响应模式
class BaseResponse(BaseModel):
    """基础响应模式"""
    success: bool = True
    message: str = "操作成功"
    data: Optional[Any] = None

# 聊天会话相关模式
class ChatSessionCreate(BaseModel):
    """创建聊天会话请求"""
    title: Optional[str] = "新对话"
    model_name: Optional[str] = "mota"
    system_message: Optional[str] = "你是一个有用的AI助手。"
    temperature: Optional[str] = "0.7"
    max_tokens: Optional[int] = 2000

class ChatSessionUpdate(BaseModel):
    """更新聊天会话请求"""
    title: Optional[str] = None
    model_name: Optional[str] = None
    system_message: Optional[str] = None
    temperature: Optional[str] = None
    max_tokens: Optional[int] = None

class ChatSessionResponse(BaseModel):
    """聊天会话响应"""
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    is_active: bool
    model_name: str
    system_message: str
    temperature: str
    max_tokens: int
    message_count: int = 0

    class Config:
        from_attributes = True

# 聊天消息相关模式
class ChatMessageCreate(BaseModel):
    """创建聊天消息请求"""
    content: str = Field(..., min_length=1, max_length=10000)
    role: str = Field(default="user", pattern="^(user|assistant|system)$")

class ChatMessageResponse(BaseModel):
    """聊天消息响应"""
    id: int
    session_id: int
    role: str
    content: str
    created_at: datetime
    message_metadata: Dict[str, Any] = {}
    token_count: int = 0

    class Config:
        from_attributes = True

# 聊天请求和响应
class ChatRequest(BaseModel):
    """聊天请求"""
    message: str = Field(..., min_length=1, max_length=10000)
    session_id: Optional[int] = None
    stream: bool = True

class ChatResponse(BaseModel):
    """聊天响应"""
    session_id: int
    message: ChatMessageResponse
    assistant_message: ChatMessageResponse

# 搜索请求
class SearchRequest(BaseModel):
    """搜索请求"""
    query: str = Field(..., min_length=1, max_length=200)
    limit: int = Field(default=10, ge=1, le=50)

# 分页响应
class PaginatedResponse(BaseModel):
    """分页响应"""
    items: List[Any]
    total: int
    page: int = 1
    size: int = 10
    pages: int = 1
