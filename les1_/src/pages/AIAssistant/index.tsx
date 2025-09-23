import React, { useState, useRef, useEffect } from 'react'
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Avatar,
  List,
  Tag,
  Divider,
  Spin,
  Row,
  Col,
  Tabs,
  Progress,
  Alert,
} from 'antd'
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  BulbOutlined,
  FileTextOutlined,
  BugOutlined,
  ThunderboltOutlined,
  ClearOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
// import ReactMarkdown from 'react-markdown' // 暂时注释掉，可以后续添加
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { TextArea } = Input
const { TabPane } = Tabs

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  suggestions?: string[]
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '您好！我是您的AI测试助手。我可以帮助您：\n\n• 生成测试用例\n• 分析测试结果\n• 识别潜在缺陷\n• 优化测试策略\n• 提供测试建议\n\n请告诉我您需要什么帮助？',
      timestamp: new Date().toISOString(),
      suggestions: [
        '帮我生成登录功能的测试用例',
        '分析最近的测试失败原因',
        '推荐性能测试策略',
        '检查代码覆盖率问题',
      ],
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 模拟页面加载
    setTimeout(() => {
      setPageLoading(false)
    }, 600)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        suggestions: aiResponse.suggestions,
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  // 生成AI响应（模拟）
  const generateAIResponse = (input: string) => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('测试用例') || lowerInput.includes('test case')) {
      return {
        content: `我来帮您生成测试用例。基于您的需求，我建议以下测试用例结构：

## 功能测试用例

### 1. 正常流程测试
- **测试目标**: 验证功能在正常情况下的表现
- **前置条件**: 系统正常运行，用户已登录
- **测试步骤**: 
  1. 输入有效数据
  2. 执行操作
  3. 验证结果
- **预期结果**: 功能正常执行，返回预期结果

### 2. 边界值测试
- **测试目标**: 验证边界条件处理
- **测试数据**: 最小值、最大值、临界值
- **预期结果**: 系统正确处理边界情况

### 3. 异常情况测试
- **测试目标**: 验证错误处理机制
- **测试场景**: 无效输入、网络异常、系统错误
- **预期结果**: 系统优雅处理异常，给出明确提示

需要我为特定功能生成详细的测试用例吗？`,
        suggestions: [
          '生成登录功能详细测试用例',
          '生成API接口测试用例',
          '生成性能测试用例',
          '生成安全测试用例',
        ],
      }
    }

    if (lowerInput.includes('失败') || lowerInput.includes('错误') || lowerInput.includes('bug')) {
      return {
        content: `我来帮您分析测试失败的可能原因：

## 常见失败原因分析

### 🔍 环境问题
- 测试环境配置不一致
- 数据库连接问题
- 第三方服务不可用
- 网络连接异常

### 🐛 代码问题
- 逻辑错误或边界条件处理不当
- 并发问题导致的竞态条件
- 内存泄漏或性能问题
- 依赖版本冲突

### 📋 测试问题
- 测试数据不准确或过期
- 测试用例设计缺陷
- 测试执行顺序依赖
- 断言条件设置错误

### 💡 建议解决方案
1. **检查日志**: 查看详细的错误日志和堆栈信息
2. **环境验证**: 确认测试环境配置正确
3. **数据检查**: 验证测试数据的有效性
4. **重现问题**: 在本地环境重现失败场景
5. **逐步调试**: 使用调试工具定位具体问题

需要我帮您分析具体的失败案例吗？`,
        suggestions: [
          '分析API测试失败原因',
          '检查数据库连接问题',
          '排查性能测试异常',
          '定位UI自动化失败',
        ],
      }
    }

    if (lowerInput.includes('性能') || lowerInput.includes('performance')) {
      return {
        content: `我来为您提供性能测试的专业建议：

## 🚀 性能测试策略

### 测试类型
- **负载测试**: 验证系统在预期负载下的表现
- **压力测试**: 找出系统的性能极限
- **容量测试**: 确定系统的最大处理能力
- **稳定性测试**: 长时间运行验证系统稳定性

### 关键指标
- **响应时间**: < 2秒（Web页面）
- **吞吐量**: 每秒处理请求数
- **并发用户数**: 同时在线用户数
- **资源利用率**: CPU、内存、磁盘、网络

### 测试建议
1. **制定基准**: 建立性能基准线
2. **渐进加压**: 逐步增加负载
3. **监控资源**: 实时监控系统资源
4. **分析瓶颈**: 识别性能瓶颈点
5. **优化验证**: 验证优化效果

当前系统建议的性能目标：
- 响应时间: 95%请求 < 2秒
- 吞吐量: > 1000 TPS
- 错误率: < 0.1%`,
        suggestions: [
          '制定性能测试计划',
          '配置性能监控',
          '分析性能瓶颈',
          '优化建议方案',
        ],
      }
    }

    // 默认响应
    return {
      content: `我理解您的问题。作为AI测试助手，我可以在以下方面为您提供帮助：

## 🤖 我的能力

### 测试设计
- 生成全面的测试用例
- 设计测试数据和场景
- 制定测试策略和计划

### 问题分析
- 分析测试失败原因
- 识别潜在的系统风险
- 提供问题解决方案

### 质量评估
- 评估测试覆盖率
- 分析代码质量指标
- 提供改进建议

### 自动化支持
- 推荐自动化测试工具
- 生成自动化测试脚本
- 优化测试执行效率

请告诉我您具体需要什么帮助，我会为您提供专业的建议！`,
      suggestions: [
        '我需要测试用例生成',
        '帮我分析测试结果',
        '推荐自动化工具',
        '制定测试策略',
      ],
    }
  }

  // 使用建议
  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
  }

  // 清空对话
  const clearMessages = () => {
    setMessages([messages[0]]) // 保留欢迎消息
  }

  if (pageLoading) {
    return <LoadingSpinner text="正在初始化AI助手..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              AI智能测试助手
            </Title>
            <Text type="secondary" className="text-sm">
              智能对话助手，提供测试建议、用例生成和问题分析
            </Text>
          </div>
          <Space className="ml-4">
            <Button icon={<ClearOutlined />} onClick={clearMessages}>
              清空对话
            </Button>
          </Space>
        </div>
      </div>

      {/* 内容区域 - 聊天界面 */}
      <div className="p-6">
        <Row gutter={[16, 16]}>
        {/* 主对话区域 */}
        <Col xs={24} lg={16} order={2}>
          <Card className="h-[600px] flex flex-col">
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar
                      icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      className={message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'}
                    />
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      {/* 建议按钮 */}
                      {message.suggestions && (
                        <div className="mt-3 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              size="small"
                              type="text"
                              className="block text-left p-1 hover:bg-blue-50"
                              onClick={() => useSuggestion(suggestion)}
                            >
                              💡 {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* 加载指示器 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <Avatar icon={<RobotOutlined />} className="bg-green-500" />
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Spin size="small" />
                      <Text className="ml-2">AI正在思考...</Text>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="请输入您的问题..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={sendMessage}
                  loading={isLoading}
                  disabled={!inputValue.trim()}
                >
                  发送
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={8} order={1}>
          <div className="space-y-3">
            {/* AI能力介绍 */}
            <Card title="AI助手能力" size="small" styles={{ body: { padding: '12px' } }}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileTextOutlined className="text-blue-500" />
                  <Text>智能生成测试用例</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <BugOutlined className="text-red-500" />
                  <Text>缺陷分析与定位</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <ThunderboltOutlined className="text-orange-500" />
                  <Text>性能优化建议</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <BulbOutlined className="text-green-500" />
                  <Text>测试策略制定</Text>
                </div>
              </div>
            </Card>

            {/* 快速操作 */}
            <Card title="快速操作" size="small" styles={{ body: { padding: '12px' } }}>
              <div className="space-y-1">
                <Button
                  block
                  onClick={() => useSuggestion('帮我生成登录功能的测试用例')}
                >
                  生成测试用例
                </Button>
                <Button
                  block
                  onClick={() => useSuggestion('分析最近的测试失败原因')}
                >
                  分析失败原因
                </Button>
                <Button
                  block
                  onClick={() => useSuggestion('推荐性能测试策略')}
                >
                  性能测试建议
                </Button>
                <Button
                  block
                  onClick={() => useSuggestion('检查代码覆盖率问题')}
                >
                  覆盖率分析
                </Button>
              </div>
            </Card>

            {/* 使用统计 */}
            <Card title="使用统计" size="small" styles={{ body: { padding: '12px' } }}>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <Text type="secondary" className="text-xs">今日对话</Text>
                    <Text className="text-xs">12次</Text>
                  </div>
                  <Progress percent={60} size="small" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Text type="secondary" className="text-xs">问题解决率</Text>
                    <Text className="text-xs">85%</Text>
                  </div>
                  <Progress percent={85} size="small" strokeColor="#52c41a" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Text type="secondary" className="text-xs">满意度</Text>
                    <Text className="text-xs">4.8/5.0</Text>
                  </div>
                  <Progress percent={96} size="small" strokeColor="#1890ff" />
                </div>
              </div>
            </Card>

            {/* 使用提示 */}
            <Alert
              message={<span className="text-sm">使用提示</span>}
              description={<span className="text-xs">您可以直接描述测试需求，AI会为您提供专业的建议和解决方案。</span>}
              type="info"
              showIcon
              icon={<BulbOutlined />}
              style={{ padding: '8px 12px' }}
            />
          </div>
        </Col>
        </Row>
      </div>
    </div>
  )
}

export default AIAssistant
