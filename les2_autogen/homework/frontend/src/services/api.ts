import axios from 'axios'
import type {
  BaseResponse,
  ChatSession,
  ChatMessage,
  ChatRequest,
  CreateSessionRequest,
  UpdateSessionRequest,
  SearchRequest,
  PaginatedResponse
} from '@/types'

// 创建axios实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.detail || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

// 会话相关API
export const sessionAPI = {
  // 创建会话
  create: (data: CreateSessionRequest): Promise<BaseResponse<ChatSession>> =>
    api.post('/sessions', data),

  // 获取会话列表
  list: (page = 1, size = 10): Promise<BaseResponse<PaginatedResponse<ChatSession>>> =>
    api.get('/sessions', { params: { page, size } }),

  // 获取会话详情
  get: (id: number): Promise<BaseResponse<ChatSession>> =>
    api.get(`/sessions/${id}`),

  // 更新会话
  update: (id: number, data: UpdateSessionRequest): Promise<BaseResponse<ChatSession>> =>
    api.put(`/sessions/${id}`, data),

  // 删除会话
  delete: (id: number): Promise<BaseResponse> =>
    api.delete(`/sessions/${id}`),

  // 获取会话消息
  getMessages: (id: number, page = 1, size = 20): Promise<BaseResponse<PaginatedResponse<ChatMessage>>> =>
    api.get(`/sessions/${id}/messages`, { params: { page, size } }),

  // 清空会话消息
  clearMessages: (id: number): Promise<BaseResponse> =>
    api.delete(`/sessions/${id}/clear`),

  // 搜索会话
  search: (data: SearchRequest): Promise<BaseResponse<{ sessions: ChatSession[], total: number, query: string }>> =>
    api.post('/sessions/search', data),
}

// 聊天相关API
export const chatAPI = {
  // 简单聊天（非流式）
  simple: (data: ChatRequest): Promise<BaseResponse> =>
    api.post('/chat', data),

  // 流式聊天（返回EventSource）
  stream: (data: ChatRequest): EventSource => {
    // 使用POST方式发送数据到SSE端点
    const url = new URL('/api/v1/chat/stream', window.location.origin)

    // 将数据作为查询参数传递（EventSource只支持GET）
    url.searchParams.append('message', data.message)
    if (data.session_id) {
      url.searchParams.append('session_id', data.session_id.toString())
    }
    if (data.stream !== undefined) {
      url.searchParams.append('stream', data.stream.toString())
    }

    return new EventSource(url.toString())
  },
}

export default api
