import React from 'react'
import { Drawer, List, Avatar, Button, Typography, Space, Tag, Empty } from 'antd'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useNotificationStore } from '@store/index'
import { Notification } from '@types/index'

dayjs.extend(relativeTime)

const { Text, Title } = Typography

interface NotificationPanelProps {
  visible: boolean
  onClose: () => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ visible, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotificationStore()

  // 获取通知图标
  const getNotificationIcon = (type: Notification['type']) => {
    const iconMap = {
      success: <CheckCircleOutlined className="text-green-500" />,
      warning: <ExclamationCircleOutlined className="text-yellow-500" />,
      error: <CloseCircleOutlined className="text-red-500" />,
      info: <InfoCircleOutlined className="text-blue-500" />,
    }
    return iconMap[type]
  }

  // 获取通知标签颜色
  const getNotificationTagColor = (type: Notification['type']) => {
    const colorMap = {
      success: 'green',
      warning: 'orange',
      error: 'red',
      info: 'blue',
    }
    return colorMap[type]
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleRemoveNotification = (id: string) => {
    removeNotification(id)
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="mb-0">
            通知中心
          </Title>
          {unreadNotifications.length > 0 && (
            <Button
              type="link"
              size="small"
              onClick={markAllAsRead}
              icon={<CheckOutlined />}
            >
              全部标记为已读
            </Button>
          )}
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      className="notification-drawer"
    >
      <div className="space-y-4">
        {/* 未读通知 */}
        {unreadNotifications.length > 0 && (
          <div>
            <Text strong className="text-gray-700 mb-2 block">
              未读通知 ({unreadNotifications.length})
            </Text>
            <List
              dataSource={unreadNotifications}
              renderItem={(notification) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <List.Item
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2 hover:shadow-md transition-shadow"
                    actions={[
                      <Button
                        type="text"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="标记为已读"
                      />,
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveNotification(notification.id)}
                        title="删除"
                        danger
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={getNotificationIcon(notification.type)}
                          className="bg-white"
                        />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <Text strong>{notification.title}</Text>
                          <Tag
                            color={getNotificationTagColor(notification.type)}
                            size="small"
                          >
                            {notification.type}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Text className="text-gray-600 block mb-1">
                            {notification.message}
                          </Text>
                          <Text type="secondary" className="text-xs">
                            {dayjs(notification.createdAt).fromNow()}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                </motion.div>
              )}
            />
          </div>
        )}

        {/* 已读通知 */}
        {readNotifications.length > 0 && (
          <div>
            <Text strong className="text-gray-700 mb-2 block">
              已读通知 ({readNotifications.length})
            </Text>
            <List
              dataSource={readNotifications.slice(0, 10)} // 只显示最近10条已读通知
              renderItem={(notification) => (
                <List.Item
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 opacity-75"
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveNotification(notification.id)}
                      title="删除"
                      danger
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getNotificationIcon(notification.type)}
                        className="bg-white opacity-60"
                      />
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <Text>{notification.title}</Text>
                        <Tag
                          color={getNotificationTagColor(notification.type)}
                          size="small"
                        >
                          {notification.type}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          {notification.message}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {dayjs(notification.createdAt).fromNow()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {/* 空状态 */}
        {notifications.length === 0 && (
          <Empty
            description="暂无通知"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </Drawer>
  )
}

export default NotificationPanel
