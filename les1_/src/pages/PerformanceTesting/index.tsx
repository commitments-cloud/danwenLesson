import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Space,
  Typography,
  Progress,
  Statistic,
  Alert,
  Tabs,
  Tag,
  message,
  Modal,
  Divider,
} from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  PlusOutlined,
  SettingOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'

import { PerformanceTest, PerformanceTestResult } from '@types/index'
import { mockPerformanceTests } from '@api/mockData'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

const PerformanceTesting: React.FC = () => {
  const [performanceTests, setPerformanceTests] = useState<PerformanceTest[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTest, setCurrentTest] = useState<PerformanceTest | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [realTimeData, setRealTimeData] = useState<PerformanceTestResult[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadPerformanceTests()
  }, [])

  const loadPerformanceTests = async () => {
    setLoading(true)
    setTimeout(() => {
      setPerformanceTests(mockPerformanceTests)
      if (mockPerformanceTests.length > 0) {
        setCurrentTest(mockPerformanceTests[0])
        setRealTimeData(mockPerformanceTests[0].results || [])
      }
      setLoading(false)
    }, 800)
  }

  // 开始性能测试
  const startPerformanceTest = () => {
    if (!currentTest) return

    setIsRunning(true)
    setIsPaused(false)
    setProgress(0)
    setRealTimeData([])

    // 模拟性能测试执行
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1
        
        // 生成模拟数据
        const newDataPoint: PerformanceTestResult = {
          timestamp: new Date().toISOString(),
          responseTime: Math.random() * 2000 + 500,
          throughput: Math.random() * 100 + 50,
          errorRate: Math.random() * 10,
          activeUsers: Math.min(currentTest.concurrency, Math.floor(newProgress * currentTest.concurrency / 100)),
        }

        setRealTimeData(prev => [...prev, newDataPoint])

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          message.success('性能测试执行完成')
        }

        return newProgress
      })
    }, 1000)
  }

  // 暂停/恢复测试
  const togglePauseTest = () => {
    setIsPaused(!isPaused)
    message.info(isPaused ? '测试已恢复' : '测试已暂停')
  }

  // 停止测试
  const stopTest = () => {
    setIsRunning(false)
    setIsPaused(false)
    setProgress(0)
    message.info('测试已停止')
  }

  // 创建新的性能测试
  const createNewTest = () => {
    form.resetFields()
    setModalVisible(true)
  }

  // 保存性能测试配置
  const saveTestConfig = async (values: any) => {
    try {
      const newTest: PerformanceTest = {
        id: Date.now().toString(),
        ...values,
        results: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setPerformanceTests([...performanceTests, newTest])
      setCurrentTest(newTest)
      setModalVisible(false)
      message.success('性能测试配置保存成功')
    } catch (error) {
      message.error('保存失败，请重试')
    }
  }

  // 响应时间图表配置
  const responseTimeChartOption = {
    title: {
      text: '响应时间趋势',
      left: 'center',
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `时间: ${new Date(data.name).toLocaleTimeString()}<br/>响应时间: ${data.value.toFixed(2)}ms`
      },
    },
    xAxis: {
      type: 'category',
      data: realTimeData.map(d => d.timestamp),
      axisLabel: {
        formatter: (value: string) => new Date(value).toLocaleTimeString(),
      },
    },
    yAxis: {
      type: 'value',
      name: '响应时间 (ms)',
    },
    series: [
      {
        data: realTimeData.map(d => d.responseTime),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.6)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ],
          },
        },
        lineStyle: { color: '#1890ff' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }

  // 吞吐量图表配置
  const throughputChartOption = {
    title: {
      text: '吞吐量趋势',
      left: 'center',
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `时间: ${new Date(data.name).toLocaleTimeString()}<br/>吞吐量: ${data.value.toFixed(2)} req/s`
      },
    },
    xAxis: {
      type: 'category',
      data: realTimeData.map(d => d.timestamp),
      axisLabel: {
        formatter: (value: string) => new Date(value).toLocaleTimeString(),
      },
    },
    yAxis: {
      type: 'value',
      name: '吞吐量 (req/s)',
    },
    series: [
      {
        data: realTimeData.map(d => d.throughput),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(82, 196, 26, 0.6)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.1)' },
            ],
          },
        },
        lineStyle: { color: '#52c41a' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }

  // 获取当前性能指标
  const getCurrentMetrics = () => {
    if (realTimeData.length === 0) return null

    const latest = realTimeData[realTimeData.length - 1]
    const avgResponseTime = realTimeData.reduce((sum, d) => sum + d.responseTime, 0) / realTimeData.length
    const avgThroughput = realTimeData.reduce((sum, d) => sum + d.throughput, 0) / realTimeData.length
    const avgErrorRate = realTimeData.reduce((sum, d) => sum + d.errorRate, 0) / realTimeData.length

    return {
      current: latest,
      averages: {
        responseTime: avgResponseTime,
        throughput: avgThroughput,
        errorRate: avgErrorRate,
      },
    }
  }

  const metrics = getCurrentMetrics()

  if (loading) {
    return <LoadingSpinner text="正在加载性能测试数据..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              性能压力测试
            </Title>
            <Text type="secondary" className="text-sm">
              进行负载测试和压力测试，实时监控系统性能指标
            </Text>
          </div>
          <Space className="ml-4">
            <Button icon={<SettingOutlined />}>
              测试配置
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createNewTest}
            >
              新建测试
            </Button>
          </Space>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 space-y-6">

      {/* 测试控制面板 */}
      {currentTest && (
        <Card title={`当前测试: ${currentTest.name}`}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <div className="space-y-4">
                <div>
                  <Text strong>测试配置</Text>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <Text type="secondary">目标URL:</Text>
                      <Text>{currentTest.url}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">并发用户:</Text>
                      <Text>{currentTest.concurrency}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">测试时长:</Text>
                      <Text>{currentTest.duration}秒</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">爬坡时间:</Text>
                      <Text>{currentTest.rampUp}秒</Text>
                    </div>
                  </div>
                </div>

                <Divider />

                <div>
                  <Text strong>测试进度</Text>
                  <div className="mt-2">
                    <Progress
                      percent={progress}
                      status={isRunning ? 'active' : 'normal'}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                    <div className="flex justify-center space-x-2 mt-4">
                      {!isRunning ? (
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          onClick={startPerformanceTest}
                          size="large"
                        >
                          开始测试
                        </Button>
                      ) : (
                        <Space>
                          <Button
                            icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                            onClick={togglePauseTest}
                          >
                            {isPaused ? '恢复' : '暂停'}
                          </Button>
                          <Button
                            danger
                            icon={<StopOutlined />}
                            onClick={stopTest}
                          >
                            停止
                          </Button>
                        </Space>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={16}>
              {/* 实时指标 */}
              {metrics && (
                <div>
                  <Text strong className="block mb-4">实时性能指标</Text>
                  <Row gutter={[16, 16]}>
                    <Col xs={12} lg={6}>
                      <Card size="small" className="text-center">
                        <Statistic
                          title="响应时间"
                          value={metrics.current.responseTime}
                          precision={0}
                          suffix="ms"
                          prefix={<ClockCircleOutlined />}
                          valueStyle={{ color: '#1890ff' }}
                        />
                        <Text type="secondary" className="text-xs">
                          平均: {metrics.averages.responseTime.toFixed(0)}ms
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Card size="small" className="text-center">
                        <Statistic
                          title="吞吐量"
                          value={metrics.current.throughput}
                          precision={1}
                          suffix="req/s"
                          prefix={<ThunderboltOutlined />}
                          valueStyle={{ color: '#52c41a' }}
                        />
                        <Text type="secondary" className="text-xs">
                          平均: {metrics.averages.throughput.toFixed(1)} req/s
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Card size="small" className="text-center">
                        <Statistic
                          title="错误率"
                          value={metrics.current.errorRate}
                          precision={1}
                          suffix="%"
                          valueStyle={{ 
                            color: metrics.current.errorRate > 5 ? '#ff4d4f' : '#52c41a' 
                          }}
                        />
                        <Text type="secondary" className="text-xs">
                          平均: {metrics.averages.errorRate.toFixed(1)}%
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Card size="small" className="text-center">
                        <Statistic
                          title="活跃用户"
                          value={metrics.current.activeUsers}
                          suffix={`/${currentTest.concurrency}`}
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 阈值警告 */}
                  {currentTest.thresholds && (
                    <div className="mt-4 space-y-2">
                      {metrics.current.responseTime > currentTest.thresholds.responseTime && (
                        <Alert
                          message="响应时间超过阈值"
                          description={`当前: ${metrics.current.responseTime.toFixed(0)}ms, 阈值: ${currentTest.thresholds.responseTime}ms`}
                          type="warning"
                          showIcon
                          size="small"
                        />
                      )}
                      {metrics.current.errorRate > currentTest.thresholds.errorRate && (
                        <Alert
                          message="错误率超过阈值"
                          description={`当前: ${metrics.current.errorRate.toFixed(1)}%, 阈值: ${currentTest.thresholds.errorRate}%`}
                          type="error"
                          showIcon
                          size="small"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Card>
      )}

      {/* 实时图表 */}
      {realTimeData.length > 0 && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card>
              <ReactECharts option={responseTimeChartOption} style={{ height: '300px' }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card>
              <ReactECharts option={throughputChartOption} style={{ height: '300px' }} />
            </Card>
          </Col>
        </Row>
      )}

      {/* 新建测试配置模态框 */}
      <Modal
        title="新建性能测试"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveTestConfig}
        >
          <Form.Item
            name="name"
            label="测试名称"
            rules={[{ required: true, message: '请输入测试名称' }]}
          >
            <Input placeholder="请输入测试名称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="url"
                label="目标URL"
                rules={[{ required: true, message: '请输入目标URL' }]}
              >
                <Input placeholder="https://example.com/api" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="method"
                label="请求方法"
                rules={[{ required: true, message: '请选择请求方法' }]}
              >
                <Select placeholder="请选择">
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="DELETE">DELETE</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="concurrency"
                label="并发用户数"
                rules={[{ required: true, message: '请输入并发用户数' }]}
              >
                <InputNumber min={1} max={10000} placeholder="100" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="测试时长(秒)"
                rules={[{ required: true, message: '请输入测试时长' }]}
              >
                <InputNumber min={10} max={3600} placeholder="300" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rampUp"
                label="爬坡时间(秒)"
                rules={[{ required: true, message: '请输入爬坡时间' }]}
              >
                <InputNumber min={0} max={600} placeholder="60" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Text strong className="block mb-2">性能阈值</Text>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['thresholds', 'responseTime']}
                label="响应时间(ms)"
              >
                <InputNumber min={1} placeholder="2000" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['thresholds', 'errorRate']}
                label="错误率(%)"
              >
                <InputNumber min={0} max={100} placeholder="5" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['thresholds', 'throughput']}
                label="吞吐量(req/s)"
              >
                <InputNumber min={1} placeholder="50" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              创建测试
            </Button>
          </div>
        </Form>
      </Modal>
      </div>
    </div>
  )
}

export default PerformanceTesting
