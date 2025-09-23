import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  Input,
  Form,
  Table,
  Space,
  Tag,
  Typography,
  Tabs,
  message,
  Modal,
  Divider,
  Collapse,
  Badge,
} from 'antd'
import {
  PlayCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  CopyOutlined,
  HistoryOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
// import MonacoEditor from '@monaco-editor/react' // 暂时注释掉，避免错误

import { APITest, APIAssertion } from '@types/index'
import { mockAPITests } from '@api/mockData'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs
const { Panel } = Collapse

const APITesting: React.FC = () => {
  const [apiTests, setApiTests] = useState<APITest[]>([])
  const [currentTest, setCurrentTest] = useState<APITest | null>(null)
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadAPITests()
  }, [])

  const loadAPITests = async () => {
    setLoading(true)
    setTimeout(() => {
      setApiTests(mockAPITests)
      if (mockAPITests.length > 0) {
        setCurrentTest(mockAPITests[0])
        form.setFieldsValue(mockAPITests[0])
      }
      setLoading(false)
    }, 500)
  }

  // 执行API测试
  const executeAPITest = async () => {
    if (!currentTest) return

    setExecuting(true)
    setResponse(null)

    // 模拟API请求
    setTimeout(() => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'content-length': '156',
        },
        data: {
          success: true,
          message: '登录成功',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
          },
        },
        responseTime: 245,
        size: 156,
      }

      setResponse(mockResponse)
      setExecuting(false)
      message.success('API测试执行完成')
    }, 2000)
  }

  // 保存API测试
  const saveAPITest = async (values: any) => {
    try {
      if (currentTest) {
        // 更新现有测试
        const updatedTests = apiTests.map(test =>
          test.id === currentTest.id
            ? { ...test, ...values, updatedAt: new Date().toISOString() }
            : test
        )
        setApiTests(updatedTests)
        setCurrentTest({ ...currentTest, ...values })
      } else {
        // 创建新测试
        const newTest: APITest = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setApiTests([...apiTests, newTest])
        setCurrentTest(newTest)
      }
      message.success('API测试保存成功')
    } catch (error) {
      message.error('保存失败，请重试')
    }
  }

  // 创建新的API测试
  const createNewTest = () => {
    const newTest: Partial<APITest> = {
      name: '新建API测试',
      method: 'GET',
      url: '',
      headers: {},
      expectedStatus: 200,
      assertions: [],
      environment: 'test',
    }
    setCurrentTest(newTest as APITest)
    form.setFieldsValue(newTest)
  }

  // HTTP方法选项
  const httpMethods = [
    { value: 'GET', color: 'green' },
    { value: 'POST', color: 'blue' },
    { value: 'PUT', color: 'orange' },
    { value: 'DELETE', color: 'red' },
    { value: 'PATCH', color: 'purple' },
  ]

  // 响应状态颜色
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success'
    if (status >= 300 && status < 400) return 'warning'
    if (status >= 400) return 'error'
    return 'default'
  }

  if (loading) {
    return <LoadingSpinner text="正在加载API测试数据..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              API接口测试
            </Title>
            <Text type="secondary" className="text-sm">
              测试RESTful API接口，支持多种HTTP方法和断言验证
            </Text>
          </div>
          <Space className="ml-4">
            <Button icon={<HistoryOutlined />}>
              测试历史
            </Button>
            <Button icon={<SettingOutlined />}>
              环境配置
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
      <div className="p-6">

      <Row gutter={[16, 16]}>
        {/* 左侧：API测试详情 */}
        <Col xs={24} lg={18} order={2}>
          {currentTest ? (
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={saveAPITest}
                initialValues={currentTest}
              >
                {/* 基本信息 */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="测试名称"
                      rules={[{ required: true, message: '请输入测试名称' }]}
                    >
                      <Input placeholder="请输入测试名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="environment"
                      label="测试环境"
                      rules={[{ required: true, message: '请选择测试环境' }]}
                    >
                      <Select placeholder="请选择测试环境">
                        <Option value="dev">开发环境</Option>
                        <Option value="test">测试环境</Option>
                        <Option value="staging">预发布环境</Option>
                        <Option value="prod">生产环境</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* 请求配置 */}
                <div className="mb-4">
                  <Text strong>请求配置</Text>
                  <div className="mt-2 p-4 bg-gray-50 rounded">
                    <Row gutter={16}>
                      <Col span={4}>
                        <Form.Item
                          name="method"
                          rules={[{ required: true, message: '请选择请求方法' }]}
                        >
                          <Select>
                            {httpMethods.map(method => (
                              <Option key={method.value} value={method.value}>
                                <Tag color={method.color}>{method.value}</Tag>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item
                          name="url"
                          rules={[{ required: true, message: '请输入请求URL' }]}
                        >
                          <Input placeholder="请输入请求URL" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          loading={executing}
                          onClick={executeAPITest}
                          block
                        >
                          发送
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* 详细配置标签页 */}
                <Tabs defaultActiveKey="headers">
                  <TabPane tab="请求头" key="headers">
                    <Form.Item name="headers">
                      <Input.TextArea
                        rows={8}
                        placeholder="请求头 (JSON格式)"
                        defaultValue={JSON.stringify(currentTest.headers || {}, null, 2)}
                        style={{ fontFamily: 'monospace' }}
                      />
                    </Form.Item>
                  </TabPane>

                  <TabPane tab="请求体" key="body">
                    <Form.Item name="body">
                      <Input.TextArea
                        rows={8}
                        placeholder="请求体 (JSON格式)"
                        defaultValue={currentTest.body || ''}
                        style={{ fontFamily: 'monospace' }}
                      />
                    </Form.Item>
                  </TabPane>

                  <TabPane tab="断言" key="assertions">
                    <div className="space-y-2">
                      <Button type="dashed" icon={<PlusOutlined />} block>
                        添加断言
                      </Button>
                      {/* 这里可以添加断言配置组件 */}
                    </div>
                  </TabPane>
                </Tabs>

                {/* 操作按钮 */}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button icon={<CopyOutlined />}>
                    复制
                  </Button>
                  <Button icon={<DeleteOutlined />} danger>
                    删除
                  </Button>
                  <Button icon={<SaveOutlined />} htmlType="submit">
                    保存
                  </Button>
                </div>
              </Form>

              {/* 响应结果 */}
              {response && (
                <div className="mt-6">
                  <Divider />
                  <Title level={4}>响应结果</Title>
                  
                  <div className="mb-4">
                    <Space>
                      <Badge
                        status={getStatusColor(response.status)}
                        text={`${response.status} ${response.statusText}`}
                      />
                      <Text type="secondary">
                        响应时间: {response.responseTime}ms
                      </Text>
                      <Text type="secondary">
                        大小: {response.size} bytes
                      </Text>
                    </Space>
                  </div>

                  <Tabs defaultActiveKey="body">
                    <TabPane tab="响应体" key="body">
                      <Input.TextArea
                        rows={12}
                        value={JSON.stringify(response.data, null, 2)}
                        readOnly
                        style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5' }}
                      />
                    </TabPane>

                    <TabPane tab="响应头" key="headers">
                      <Input.TextArea
                        rows={12}
                        value={JSON.stringify(response.headers, null, 2)}
                        readOnly
                        style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5' }}
                      />
                    </TabPane>
                  </Tabs>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Text type="secondary">请选择或创建一个API测试</Text>
              </div>
            </Card>
          )}
        </Col>

        {/* 右侧：API测试列表 */}
        <Col xs={24} lg={6} order={1}>
          <Card title="API测试列表" size="small">
            <div className="space-y-2">
              {apiTests.map(test => (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    currentTest?.id === test.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setCurrentTest(test)
                    form.setFieldsValue(test)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text strong className="block">
                        {test.name}
                      </Text>
                      <div className="flex items-center space-x-2 mt-1">
                        <Tag
                          color={httpMethods.find(m => m.value === test.method)?.color}
                          size="small"
                        >
                          {test.method}
                        </Tag>
                        <Text type="secondary" className="text-xs">
                          {test.url.length > 20 ? `${test.url.substring(0, 20)}...` : test.url}
                        </Text>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </Col>
        </Row>
      </div>
    </div>
  )
}

export default APITesting
