// 基础响应类型
export interface BaseResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// 聊天会话类型
export interface ChatSession {
  id: number
  title: string
  created_at: string
  updated_at: string
  first_question_time?: string
  is_active: boolean
  model_name: string
  system_message: string
  temperature: string
  max_tokens: number
  message_count: number
}

// 聊天消息类型
export interface ChatMessage {
  id: number
  session_id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
  metadata?: Record<string, any>
  token_count?: number
}

// 聊天请求类型
export interface ChatRequest {
  message: string
  session_id?: number
  stream?: boolean
}

// 会话创建请求
export interface CreateSessionRequest {
  title?: string
  model_name?: string
  system_message?: string
  temperature?: string
  max_tokens?: number
}

// 会话更新请求
export interface UpdateSessionRequest {
  title?: string
  model_name?: string
  system_message?: string
  temperature?: string
  max_tokens?: number
}

// 搜索请求
export interface SearchRequest {
  query: string
  limit?: number
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// SSE事件类型
export interface SSEEvent {
  event: 'session' | 'chunk' | 'complete' | 'error'
  data: any
}

// 聊天状态
export type ChatStatus = 'idle' | 'typing' | 'waiting' | 'error'

// 模型配置
export interface ModelConfig {
  name: string
  display_name: string
  max_tokens: number
  temperature_range: [number, number]
  description: string
}
