import React, { useState, useEffect, useRef } from 'react'
import { Layout, message, Button, Empty } from 'antd'
import { MenuOutlined, RobotOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'

import Sidebar from '@/components/Sidebar'
import MessageItem from '@/components/MessageItem'
import ChatInput from '@/components/ChatInput'
import { chatAPI, sessionAPI } from '@/services/api'
import useChatStore from '@/stores/chatStore'
import { scrollToBottom, isAtBottom } from '@/utils'
import type { ChatMessage, SSEEvent } from '@/types'
import './ChatPage.css'

const { Content } = Layout

const ChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const {
    currentSession,
    messages,
    status,
    setCurrentSession,
    setMessages,
    addMessage,
    addSession,
    setStatus,
    setError
  } = useChatStore()

  // 自动滚动到底部
  const scrollToBottomIfNeeded = () => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      setTimeout(() => {
        scrollToBottom(messagesContainerRef.current!, true)
      }, 100)
    }
  }

  // 监听滚动事件
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const atBottom = isAtBottom(messagesContainerRef.current, 50)
      setShouldAutoScroll(atBottom)
    }
  }

  // 发送消息
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || status === 'typing') return

    try {
      setStatus('waiting')
      setError(null)

      // 创建用户消息
      const userMessage: ChatMessage = {
        id: Date.now(),
        session_id: currentSession?.id || 0,
        role: 'user',
        content: messageText,
        created_at: new Date().toISOString()
      }

      addMessage(userMessage)
      scrollToBottomIfNeeded()

      // 创建SSE连接
      const es = chatAPI.stream({
        message: messageText,
        session_id: currentSession?.id,
        stream: true
      })

      setEventSource(es)
      setStatus('typing')

      let assistantContent = ''
      let assistantMessage: ChatMessage | null = null

      // 监听不同类型的事件
      es.addEventListener('session', (event) => {
        try {
          const data = JSON.parse(event.data)
          // 更新会话信息
          if (data.session_id && !currentSession) {
            // 获取完整的会话信息
            sessionAPI.get(data.session_id).then(response => {
              if (response.success && response.data) {
                setCurrentSession(response.data)
                addSession(response.data)
              }
            }).catch(error => {
              console.error('获取会话信息失败:', error)
            })
            // 如果是新会话，更新URL
            navigate(`/chat/${data.session_id}`, { replace: true })
          }
        } catch (error) {
          console.error('解析session事件失败:', error)
        }
      })

      es.addEventListener('chunk', (event) => {
        try {
          const data = JSON.parse(event.data)
          assistantContent = data.full_content || data.content

          if (!assistantMessage) {
            assistantMessage = {
              id: Date.now(),
              session_id: currentSession?.id || data.session_id || 0,
              role: 'assistant',
              content: assistantContent,
              created_at: new Date().toISOString(),
              metadata: {}
            }
            setStreamingMessage(assistantMessage)
          } else {
            assistantMessage.content = assistantContent
            setStreamingMessage({ ...assistantMessage })
          }
          scrollToBottomIfNeeded()
        } catch (error) {
          console.error('解析chunk事件失败:', error)
        }
      })

      es.addEventListener('complete', (event) => {
        try {
          const data = JSON.parse(event.data)
          if (assistantMessage) {
            assistantMessage.id = data.assistant_message_id
            assistantMessage.content = data.content
            addMessage(assistantMessage)
            setStreamingMessage(null)
          }
          setStatus('idle')
          es.close()
          setEventSource(null)
          scrollToBottomIfNeeded()
        } catch (error) {
          console.error('解析complete事件失败:', error)
        }
      })

      es.addEventListener('error', (event) => {
        try {
          const data = JSON.parse(event.data)
          message.error(data.content || '发生错误')
          setError(data.error)
          setStatus('error')
          setStreamingMessage(null)
          es.close()
          setEventSource(null)
        } catch (error) {
          console.error('解析error事件失败:', error)
        }
      })

      es.onerror = (error) => {
        console.error('SSE连接错误:', error)
        message.error('连接中断，请重试')
        setStatus('error')
        setStreamingMessage(null)
        es.close()
        setEventSource(null)
      }

    } catch (error) {
      console.error('发送消息失败:', error)
      message.error('发送消息失败')
      setStatus('error')
    }
  }

  // 停止生成
  const handleStopGeneration = () => {
    if (eventSource) {
      eventSource.close()
      setEventSource(null)
    }
    setStatus('idle')
    setStreamingMessage(null)
  }

  // 加载会话
  const loadSession = async (id: string) => {
    try {
      const [sessionResponse, messagesResponse] = await Promise.all([
        sessionAPI.get(parseInt(id)),
        sessionAPI.getMessages(parseInt(id), 1, 100)
      ])

      if (sessionResponse.success && sessionResponse.data) {
        setCurrentSession(sessionResponse.data)
      }

      if (messagesResponse.success && messagesResponse.data) {
        setMessages(messagesResponse.data.items)
      }
    } catch (error) {
      message.error('加载会话失败')
      navigate('/')
    }
  }

  // 处理URL参数变化
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId)
    } else {
      setCurrentSession(null)
      setMessages([])
    }
  }, [sessionId])

  // 自动滚动
  useEffect(() => {
    scrollToBottomIfNeeded()
  }, [messages, streamingMessage])

  // 清理资源
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  const allMessages = [...messages]
  if (streamingMessage) {
    allMessages.push(streamingMessage)
  }

  return (
    <Layout className="chat-page">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
      
      <Layout className="chat-main">
        <div className="chat-header">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sidebar-toggle"
          />
          <div className="chat-title">
            {currentSession?.title || 'AI助手'}
          </div>
        </div>

        <Content className="chat-content">
          <div
            ref={messagesContainerRef}
            className="messages-container"
            onScroll={handleScroll}
          >
            {allMessages.length > 0 ? (
              <>
                {allMessages.map((msg, index) => (
                  <MessageItem
                    key={msg.id || index}
                    message={msg}
                    isStreaming={msg === streamingMessage}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="empty-state">
                <Empty
                  image={<RobotOutlined style={{ fontSize: 64, color: 'rgba(255,255,255,0.3)' }} />}
                  description={
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                      开始与AI助手对话吧
                    </span>
                  }
                />
              </div>
            )}
          </div>
        </Content>

        <div className="chat-input-wrapper">
          <ChatInput
            onSend={handleSendMessage}
            onStop={handleStopGeneration}
            status={status}
            placeholder="输入消息... (Ctrl+Enter发送)"
          />
        </div>
      </Layout>
    </Layout>
  )
}

export default ChatPage
