import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, Tooltip } from 'antd'
import { SendOutlined, StopOutlined } from '@ant-design/icons'
import { useHotkeys } from 'react-hotkeys-hook'

import type { ChatStatus } from '@/types'
import './ChatInput.css'

const { TextArea } = Input

interface ChatInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  status: ChatStatus
  disabled?: boolean
  placeholder?: string
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  status,
  disabled = false,
  placeholder = '输入消息...'
}) => {
  const [message, setMessage] = useState('')
  const textAreaRef = useRef<any>(null)

  const isLoading = status === 'typing' || status === 'waiting'
  const canSend = message.trim() && !disabled && status !== 'typing'
  const canStop = status === 'typing' && onStop

  // 发送消息
  const handleSend = () => {
    if (!canSend) return

    const trimmedMessage = message.trim()
    if (trimmedMessage) {
      onSend(trimmedMessage)
      setMessage('')
    }
  }

  // 停止生成
  const handleStop = () => {
    if (canStop) {
      onStop?.()
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 快捷键
  useHotkeys('ctrl+enter', handleSend, { enableOnFormTags: true })
  useHotkeys('escape', handleStop, { enableOnFormTags: true })

  // 自动聚焦
  useEffect(() => {
    if (status === 'idle' && textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [status])

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <TextArea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoSize={false}
          disabled={disabled}
          className="chat-textarea"
          rows={2}
        />

        <div className="chat-input-actions">
          {canStop ? (
            <Tooltip title="停止生成 (Esc)">
              <Button
                type="primary"
                danger
                icon={<StopOutlined />}
                onClick={handleStop}
                className="stop-button"
              />
            </Tooltip>
          ) : (
            <Tooltip title={canSend ? "发送消息 (Ctrl+Enter)" : "请输入消息"}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!canSend}
                loading={isLoading}
                className="send-button"
              />
            </Tooltip>
          )}
        </div>

        {isLoading && (
          <div className="chat-input-status">
            <span className="status-text">
              {status === 'waiting' ? 'AI正在思考...' : 'AI正在回复...'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInput
