import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Space,
  Tag,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tabs,
  List,
  Avatar,
  Progress,
  Tooltip,
  message,
  Popconfirm,
  Badge,
  Statistic,
} from 'antd'
import {
  PlayCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ScheduleOutlined,
  CodeOutlined,
  HistoryOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import MonacoEditor from '@monaco-editor/react'
import type { ColumnsType } from 'antd/es/table'

import { AutomationTest } from '@types/index'
import { mockAutomationTests } from '@api/mockData'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

const AutomationTesting: React.FC = () => {
  const [automationTests, setAutomationTests] = useState<AutomationTest[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTest, setEditingTest] = useState<AutomationTest | null>(null)
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [form] = Form.useForm()

  useEffect(() => {
    loadAutomationTests()
  }, [])

  const loadAutomationTests = async () => {
    setLoading(true)
    setTimeout(() => {
      setAutomationTests(mockAutomationTests)
      setLoading(false)
    }, 500)
  }

  // 执行自动化测试
  const runAutomationTest = async (test: AutomationTest) => {
    setRunningTests(prev => new Set([...prev, test.id]))
    message.info(`开始执行自动化测试: ${test.name}`)

    // 模拟测试执行
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% 成功率
      const updatedTests = automationTests.map(t =>
        t.id === test.id
          ? {
              ...t,
              lastRun: {
                timestamp: new Date().toISOString(),
                status: success ? 'success' : 'failure',
                duration: Math.floor(Math.random() * 60000) + 10000,
                logs: [
                  '测试开始执行',
                  '初始化测试环境',
                  '加载测试脚本',
                  '执行测试步骤',
                  success ? '测试执行成功' : '测试执行失败',
                  '清理测试环境',
                  '测试执行完成',
                ],
              },
            }
          : t
      )
      setAutomationTests(updatedTests)
      setRunningTests(prev => {
        const newSet = new Set(prev)
        newSet.delete(test.id)
        return newSet
      })
      message.success(`自动化测试执行完成: ${success ? '成功' : '失败'}`)
    }, 3000)
  }

  // 创建新的自动化测试
  const createNewTest = () => {
    setEditingTest(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 编辑自动化测试
  const editTest = (test: AutomationTest) => {
    setEditingTest(test)
    form.setFieldsValue({
      ...test,
      scheduleEnabled: test.schedule?.enabled || false,
      scheduleCron: test.schedule?.cron || '',
    })
    setModalVisible(true)
  }

  // 删除自动化测试
  const deleteTest = (id: string) => {
    setAutomationTests(automationTests.filter(t => t.id !== id))
    message.success('自动化测试删除成功')
  }

  // 保存自动化测试
  const saveTest = async (values: any) => {
    try {
      const testData = {
        ...values,
        schedule: values.scheduleEnabled
          ? {
              enabled: values.scheduleEnabled,
              cron: values.scheduleCron,
            }
          : undefined,
      }

      if (editingTest) {
        // 更新现有测试
        const updatedTests = automationTests.map(t =>
          t.id === editingTest.id
            ? { ...t, ...testData, updatedAt: new Date().toISOString() }
            : t
        )
        setAutomationTests(updatedTests)
        message.success('自动化测试更新成功')
      } else {
        // 创建新测试
        const newTest: AutomationTest = {
          id: Date.now().toString(),
          ...testData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setAutomationTests([...automationTests, newTest])
        message.success('自动化测试创建成功')
      }

      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    }
  }

  // 获取测试类型标签颜色
  const getTestTypeColor = (type: string) => {
    const colorMap = {
      selenium: 'blue',
      cypress: 'green',
      playwright: 'purple',
    }
    return colorMap[type as keyof typeof colorMap] || 'default'
  }

  // 获取最后运行状态
  const getLastRunStatus = (test: AutomationTest) => {
    if (!test.lastRun) return { color: 'default', text: '未运行' }
    
    const statusMap = {
      success: { color: 'success', text: '成功' },
      failure: { color: 'error', text: '失败' },
    }
    
    return statusMap[test.lastRun.status] || { color: 'default', text: '未知' }
  }

  // 表格列配置
  const columns: ColumnsType<AutomationTest> = [
    {
      title: '测试名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: AutomationTest) => (
        <div>
          <Text strong className="block">{text}</Text>
          <div className="flex items-center space-x-2 mt-1">
            <Tag color={getTestTypeColor(record.type)} size="small">
              {record.type.toUpperCase()}
            </Tag>
            {record.schedule?.enabled && (
              <Tag color="orange" size="small">
                <ScheduleOutlined className="mr-1" />
                定时
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '最后运行',
      key: 'lastRun',
      width: 150,
      render: (_, record: AutomationTest) => {
        const status = getLastRunStatus(record)
        return (
          <div>
            <Badge status={status.color as any} text={status.text} />
            {record.lastRun && (
              <div className="text-xs text-gray-500 mt-1">
                {new Date(record.lastRun.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: '执行时长',
      key: 'duration',
      width: 100,
      render: (_, record: AutomationTest) => (
        record.lastRun ? (
          <Text type="secondary">
            {Math.floor(record.lastRun.duration / 1000)}s
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: '定时任务',
      key: 'schedule',
      width: 120,
      render: (_, record: AutomationTest) => (
        record.schedule?.enabled ? (
          <Tooltip title={`Cron: ${record.schedule.cron}`}>
            <Tag color="orange" size="small">
              <ScheduleOutlined className="mr-1" />
              已启用
            </Tag>
          </Tooltip>
        ) : (
          <Tag size="small">未启用</Tag>
        )
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record: AutomationTest) => (
        <Space size="small">
          <Tooltip title="运行测试">
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              loading={runningTests.has(record.id)}
              onClick={() => runAutomationTest(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => editTest(record)}
            />
          </Tooltip>
          <Tooltip title="查看日志">
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={() => {
                // 这里可以打开日志查看模态框
                message.info('查看测试日志')
              }}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个自动化测试吗？"
            onConfirm={() => deleteTest(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 统计数据
  const stats = {
    total: automationTests.length,
    success: automationTests.filter(t => t.lastRun?.status === 'success').length,
    failure: automationTests.filter(t => t.lastRun?.status === 'failure').length,
    scheduled: automationTests.filter(t => t.schedule?.enabled).length,
  }

  if (loading) {
    return <LoadingSpinner text="正在加载自动化测试数据..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={2} className="mb-2 text-gray-800">
              自动化测试管理
            </Title>
            <Text type="secondary" className="text-sm">
              管理自动化测试脚本，支持多种框架和定时调度执行
            </Text>
          </div>
          <Space className="ml-4">
            <Button icon={<ScheduleOutlined />}>
              定时任务管理
            </Button>
            <Button icon={<SettingOutlined />}>
              环境配置
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={createNewTest}
            >
              新建自动化测试
            </Button>
          </Space>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 space-y-6">

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center">
              <Statistic
                title="总测试数"
                value={stats.total}
                prefix={<CodeOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center">
              <Statistic
                title="成功测试"
                value={stats.success}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center">
              <Statistic
                title="失败测试"
                value={stats.failure}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center">
              <Statistic
                title="定时任务"
                value={stats.scheduled}
                prefix={<ScheduleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 自动化测试表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={automationTests}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            total: automationTests.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新建/编辑自动化测试模态框 */}
      <Modal
        title={editingTest ? '编辑自动化测试' : '新建自动化测试'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveTest}
        >
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
                name="type"
                label="测试框架"
                rules={[{ required: true, message: '请选择测试框架' }]}
              >
                <Select placeholder="请选择测试框架">
                  <Option value="selenium">Selenium</Option>
                  <Option value="cypress">Cypress</Option>
                  <Option value="playwright">Playwright</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="script"
            label="测试脚本"
            rules={[{ required: true, message: '请输入测试脚本' }]}
          >
            <MonacoEditor
              height="300px"
              language="python"
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Form.Item>

          <Form.Item
            name="parameters"
            label="测试参数 (JSON格式)"
          >
            <MonacoEditor
              height="150px"
              language="json"
              theme="vs-light"
              value='{\n  "browser": "chrome",\n  "timeout": 30000,\n  "retries": 3\n}'
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Form.Item>

          <div className="border-t pt-4">
            <Text strong className="block mb-3">定时任务配置</Text>
            <Form.Item
              name="scheduleEnabled"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              <Text className="ml-2">启用定时执行</Text>
            </Form.Item>

            <Form.Item
              name="scheduleCron"
              label="Cron表达式"
              tooltip="例如: 0 2 * * * 表示每天凌晨2点执行"
            >
              <Input placeholder="0 2 * * *" />
            </Form.Item>
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              {editingTest ? '更新' : '创建'}
            </Button>
          </div>
        </Form>
      </Modal>
      </div>
    </div>
  )
}

export default AutomationTesting
