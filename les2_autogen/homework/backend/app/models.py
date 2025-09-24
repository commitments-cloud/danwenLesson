"""
数据库模型定义
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class ChatSession(Base):
    """聊天会话模型"""
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, default="新对话")
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # 会话配置
    model_name = Column(String(100), default="mota", nullable=False)
    system_message = Column(Text, default="你是一个有用的AI助手。")
    temperature = Column(String(10), default="0.7")
    max_tokens = Column(Integer, default=2000)
    
    # 关联消息
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")
    
    def to_dict(self):
        """转换为字典"""
        # 只统计用户消息的数量
        user_message_count = len([msg for msg in self.messages if msg.role == 'user']) if self.messages else 0

        # 获取第一条用户消息的时间作为问问题开始时间
        first_user_message = next((msg for msg in self.messages if msg.role == 'user'), None) if self.messages else None
        first_question_time = first_user_message.created_at if first_user_message else self.created_at

        return {
            "id": self.id,
            "title": self.title,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "first_question_time": first_question_time.isoformat() if first_question_time else None,
            "is_active": self.is_active,
            "model_name": self.model_name,
            "system_message": self.system_message,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "message_count": user_message_count
        }

class ChatMessage(Base):
    """聊天消息模型"""
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # 消息元数据
    message_metadata = Column(JSON, default={})
    token_count = Column(Integer, default=0)
    
    # 关联会话
    session = relationship("ChatSession", back_populates="messages")
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "session_id": self.session_id,
            "role": self.role,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "metadata": self.message_metadata,
            "token_count": self.token_count
        }
