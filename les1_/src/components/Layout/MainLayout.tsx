import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Layout,
  Menu,
  Button,
  Typography,
} from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  BarChartOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'

import { useAppStore } from '@store/index'

const { Header, Sider, Content } = Layout
const { Text } = Typography

// 菜单项配置
const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表板',
  },
  {
    key: '/test-cases',
    icon: <FileTextOutlined />,
    label: '测试用例',
  },
  {
    key: '/test-execution',
    icon: <PlayCircleOutlined />,
    label: '测试执行',
  },
  {
    key: '/test-reports',
    icon: <BarChartOutlined />,
    label: '测试报告',
  },
  {
    type: 'divider',
  },
  {
    key: 'testing-tools',
    icon: <ApiOutlined />,
    label: '测试工具',
    children: [
      {
        key: '/api-testing',
        icon: <ApiOutlined />,
        label: 'API测试',
      },
      {
        key: '/performance-testing',
        icon: <ThunderboltOutlined />,
        label: '性能测试',
      },
      {
        key: '/automation-testing',
        icon: <RobotOutlined />,
        label: '自动化测试',
      },
    ],
  },
  {
    key: '/ai-assistant',
    icon: <RobotOutlined />,
    label: 'AI助手',
  },
  {
    type: 'divider',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '设置',
  },
]

const MainLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key !== location.pathname) {
      navigate(key)
    }
  }

  return (
    <Layout className="h-screen overflow-hidden">
      {/* 侧边栏 - 完全固定，不允许滚动 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={240}
        collapsedWidth={64}
        className="fixed left-0 top-0 z-50 shadow-lg"
        theme="dark"
        style={{
          height: '100vh',
          overflow: 'hidden' // 完全禁止滚动
        }}
      >
        {/* Logo区域 - 固定高度 */}
        <div className="h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
          {sidebarCollapsed ? (
            <div className="text-white text-xl font-bold">ST</div>
          ) : (
            <div className="text-white text-lg font-bold">智能测试平台</div>
          )}
        </div>

        {/* 菜单区域 - 固定高度，不允许滚动 */}
        <div
          className="flex-1"
          style={{
            height: 'calc(100vh - 64px)',
            overflow: 'hidden' // 完全禁止菜单滚动
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-r-0"
            style={{
              height: '100%',
              overflow: 'hidden' // 菜单本身也不允许滚动
            }}
          />
        </div>
      </Sider>

      {/* 主布局区域 - 完全独立，不影响侧边栏 */}
      <Layout
        className="h-screen"
        style={{
          marginLeft: sidebarCollapsed ? 64 : 240,
          transition: 'margin-left 0.2s ease-in-out',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* 顶部导航栏 - 紧凑设计 */}
        <Header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-base hover:bg-gray-100"
            />


          </div>


        </Header>

        {/* 主内容区域 - 可滚动，有合理间距 */}
        <Content
          className="bg-gray-50"
          style={{
            height: 'calc(100vh - 56px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px'
          }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.15,
              ease: "easeOut"
            }}
            style={{ minHeight: 'calc(100vh - 88px)' }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>


    </Layout>
  )
}

export default MainLayout
