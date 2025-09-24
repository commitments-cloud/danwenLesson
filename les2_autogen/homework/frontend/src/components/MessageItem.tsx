import React, { useState } from 'react'
import { Avatar, Button, message, Tooltip } from 'antd'
import { UserOutlined, RobotOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

import type { ChatMessage } from '@/types'
import { formatRelativeTime, copyToClipboard } from '@/utils'
import './MessageItem.css'

interface MessageItemProps {
  message: ChatMessage
  isStreaming?: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming = false }) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content)
      setCopied(true)
      message.success('已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      message.error('复制失败')
    }
  }

  const renderContent = () => {
    if (isUser) {
      return <div className="message-text">{message.content}</div>
    }

    return (
      <div className="message-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneLight}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
        {isStreaming && <span className="streaming-cursor">|</span>}
      </div>
    )
  }

  return (
    <div className={`message-item ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-avatar">
        <Avatar
          size={32}
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{
            backgroundColor: isUser ? '#1677ff' : '#52c41a',
          }}
        />
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-role">
            {isUser ? '你' : 'AI助手'}
          </span>
          <span className="message-time">
            {formatRelativeTime(message.created_at)}
          </span>
        </div>
        
        <div className="message-body">
          {renderContent()}
        </div>
        
        <div className="message-actions">
          <Tooltip title={copied ? '已复制' : '复制'}>
            <Button
              type="text"
              size="small"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              className="copy-button"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default MessageItem
