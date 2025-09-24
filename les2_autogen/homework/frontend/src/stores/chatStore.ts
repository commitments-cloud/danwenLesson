import { create } from 'zustand'
import type { ChatSession, ChatMessage, ChatStatus } from '@/types'

interface ChatStore {
  // 状态
  currentSession: ChatSession | null
  sessions: ChatSession[]
  messages: ChatMessage[]
  status: ChatStatus
  isLoading: boolean
  error: string | null

  // 会话操作
  setCurrentSession: (session: ChatSession | null) => void
  setSessions: (sessions: ChatSession[]) => void
  addSession: (session: ChatSession) => void
  updateSession: (id: number, updates: Partial<ChatSession>) => void
  removeSession: (id: number) => void

  // 消息操作
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  updateMessage: (id: number, updates: Partial<ChatMessage>) => void
  clearMessages: () => void

  // 状态操作
  setStatus: (status: ChatStatus) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // 重置
  reset: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // 初始状态
  currentSession: null,
  sessions: [],
  messages: [],
  status: 'idle',
  isLoading: false,
  error: null,

  // 会话操作
  setCurrentSession: (session) => set({ currentSession: session }),
  
  setSessions: (sessions) => set({ sessions }),
  
  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions]
  })),
  
  updateSession: (id, updates) => set((state) => ({
    sessions: state.sessions.map(session =>
      session.id === id ? { ...session, ...updates } : session
    ),
    currentSession: state.currentSession?.id === id
      ? { ...state.currentSession, ...updates }
      : state.currentSession
  })),
  
  removeSession: (id) => set((state) => ({
    sessions: state.sessions.filter(session => session.id !== id),
    currentSession: state.currentSession?.id === id ? null : state.currentSession
  })),

  // 消息操作
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(message =>
      message.id === id ? { ...message, ...updates } : message
    )
  })),
  
  clearMessages: () => set({ messages: [] }),

  // 状态操作
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // 重置
  reset: () => set({
    currentSession: null,
    sessions: [],
    messages: [],
    status: 'idle',
    isLoading: false,
    error: null
  })
}))

export default useChatStore
