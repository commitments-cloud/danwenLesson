import React, { useState, useEffect } from 'react'
import {
  Layout,
  Button,
  List,
  Input,
  Dropdown,
  Modal,
  message,
  Empty,
  Spin
} from 'antd'
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  ClearOutlined
} from '@ant-design/icons'

import type { ChatSession } from '@/types'
import { sessionAPI } from '@/services/api'
import { formatRelativeTime, truncateText, formatBeijingTime } from '@/utils'
import useChatStore from '@/stores/chatStore'
import './Sidebar.css'

const { Sider } = Layout
const { Search } = Input

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingSession, setEditingSession] = useState<ChatSession | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const {
    sessions,
    currentSession,
    setSessions,
    setCurrentSession,
    addSession,
    updateSession,
    removeSession,
    clearMessages,
    setMessages
  } = useChatStore()

  // 加载会话列表
  const loadSessions = async () => {
    try {
      setLoading(true)
      const response = await sessionAPI.list(1, 50)
      if (response.success && response.data) {
        setSessions(response.data.items)
      }
    } catch (error) {
      message.error('加载会话列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 创建新会话
  const handleCreateSession = async () => {
    try {
      const response = await sessionAPI.create({ title: '新对话' })
      if (response.success && response.data) {
        addSession(response.data)
        setCurrentSession(response.data)
        clearMessages()
      }
    } catch (error) {
      message.error('创建会话失败')
    }
  }

  // 选择会话
  const handleSelectSession = async (session: ChatSession) => {
    if (currentSession?.id === session.id) return

    try {
      setCurrentSession(session)
      
      // 加载会话消息
      const response = await sessionAPI.getMessages(session.id, 1, 100)
      if (response.success && response.data) {
        setMessages(response.data.items)
      }
    } catch (error) {
      message.error('加载会话消息失败')
    }
  }

  // 编辑会话标题
  const handleEditSession = (session: ChatSession) => {
    setEditingSession(session)
    setEditTitle(session.title)
  }

  // 保存会话标题
  const handleSaveTitle = async () => {
    if (!editingSession || !editTitle.trim()) return

    try {
      const response = await sessionAPI.update(editingSession.id, {
        title: editTitle.trim()
      })
      if (response.success && response.data) {
        updateSession(editingSession.id, { title: editTitle.trim() })
        message.success('标题更新成功')
      }
    } catch (error) {
      message.error('更新标题失败')
    } finally {
      setEditingSession(null)
      setEditTitle('')
    }
  }

  // 删除会话
  const handleDeleteSession = (session: ChatSession) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除会话"${session.title}"吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await sessionAPI.delete(session.id)
          removeSession(session.id)
          if (currentSession?.id === session.id) {
            setCurrentSession(null)
            clearMessages()
          }
          // 重新加载会话列表以确保数据同步
          await loadSessions()
          message.success('会话删除成功')
        } catch (error) {
          message.error('删除会话失败')
        }
      }
    })
  }

  // 清空会话消息
  const handleClearMessages = (session: ChatSession) => {
    Modal.confirm({
      title: '确认清空',
      content: `确定要清空会话"${session.title}"的所有消息吗？此操作不可恢复。`,
      okText: '清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await sessionAPI.clearMessages(session.id)
          if (currentSession?.id === session.id) {
            clearMessages()
          }
          // 重新加载会话列表以更新时间戳
          await loadSessions()
          message.success('消息清空成功')
        } catch (error) {
          message.error('清空消息失败')
        }
      }
    })
  }

  // 搜索会话
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      loadSessions()
      return
    }

    try {
      setLoading(true)
      const response = await sessionAPI.search({ query: value.trim(), limit: 20 })
      if (response.success && response.data) {
        setSessions(response.data.sessions)
      }
    } catch (error) {
      message.error('搜索失败')
    } finally {
      setLoading(false)
    }
  }

  // 过滤会话
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchValue.toLowerCase())
  )

  // 会话操作菜单
  const getSessionMenu = (session: ChatSession) => ({
    items: [
      {
        key: 'edit',
        label: '重命名',
        icon: <EditOutlined />,
        onClick: () => handleEditSession(session)
      },
      {
        key: 'clear',
        label: '清空消息',
        icon: <ClearOutlined />,
        onClick: () => handleClearMessages(session)
      },
      {
        type: 'divider' as const
      },
      {
        key: 'delete',
        label: '删除会话',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDeleteSession(session)
      }
    ]
  })

  useEffect(() => {
    loadSessions()
  }, [])

  return (
    <Sider
      width={280}
      collapsed={collapsed}
      onCollapse={onCollapse}
      className="chat-sidebar"
      theme="light"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="sidebar-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateSession}
          className="new-chat-button"
          block
        >
          {!collapsed && '新建对话'}
        </Button>
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-search">
            <Search
              placeholder="搜索会话..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              className="search-input"
            />
          </div>

          <div className="sidebar-content">
            <Spin spinning={loading}>
              {filteredSessions.length > 0 ? (
                <List
                  dataSource={filteredSessions}
                  split={false}
                  size="small"
                  renderItem={(session) => (
                    <List.Item
                      className={`session-item ${
                        currentSession?.id === session.id ? 'active' : ''
                      }`}
                      onClick={() => handleSelectSession(session)}
                    >
                      <div className="session-content">
                        <div className="session-title">
                          {truncateText(session.title, 20)}
                        </div>
                        <div className="session-meta">
                          <span className="session-time">
                            {session.first_question_time
                              ? formatBeijingTime(session.first_question_time)
                              : formatRelativeTime(session.updated_at)
                            }
                          </span>
                          <span className="session-count">
                            {session.message_count}个问题
                          </span>
                        </div>
                      </div>
                      <Dropdown
                        menu={getSessionMenu(session)}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          size="small"
                          className="session-menu-button"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="暂无会话"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Spin>
          </div>
        </>
      )}

      {/* 编辑标题模态框 */}
      <Modal
        title="重命名会话"
        open={!!editingSession}
        onOk={handleSaveTitle}
        onCancel={() => {
          setEditingSession(null)
          setEditTitle('')
        }}
        okText="保存"
        cancelText="取消"
      >
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="请输入会话标题"
          maxLength={50}
          onPressEnter={handleSaveTitle}
        />
      </Modal>
    </Sider>
  )
}

export default Sidebar
