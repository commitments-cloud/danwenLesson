import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'

import ChatPage from './pages/ChatPage'
import './styles/App.css'

const { Content } = Layout

function App() {
  return (
    <Layout className="app-layout">
      <Content className="app-content">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/chat/:sessionId?" element={<ChatPage />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
