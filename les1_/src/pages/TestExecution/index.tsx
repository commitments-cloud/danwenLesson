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
  Progress,
  Statistic,
  Select,
  Input,
  Modal,
  Steps,
  Checkbox,
  message,
  Tooltip,
  Badge,
} from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import type { ColumnsType } from 'antd/es/table'

import { TestCase, TestExecutionResult, User } from '@types/index'
import { mockTestCases, mockUsers } from '@api/mockData'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { Option } = Select
const { Step } = Steps
const { TextArea } = Input

const TestExecution: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [executingTests, setExecutingTests] = useState<Set<string>>(new Set())
  const [executionResults, setExecutionResults] = useState<Map<string, TestExecutionResult>>(new Map())
  const [modalVisible, setModalVisible] = useState(false)
  const [currentExecution, setCurrentExecution] = useState<TestCase | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepResults, setStepResults] = useState<Map<string, 'pass' | 'fail' | 'skip'>>(new Map())
  const [executionNotes, setExecutionNotes] = useState('')

  useEffect(() => {
    loadTestCases()
  }, [])

  const loadTestCases = async () => {
    setLoading(true)
    setTimeout(() => {
      setTestCases(mockTestCases)
      setLoading(false)
    }, 500)
  }

  // 开始批量执行测试
  const startBatchExecution = () => {
    if (selectedTests.length === 0) {
      message.warning('请选择要执行的测试用例')
      return
    }

    selectedTests.forEach(testId => {
      executeTest(testId)
    })
  }

  // 执行单个测试
  const executeTest = (testId: string) => {
    setExecutingTests(prev => new Set([...prev, testId]))
    
    // 模拟测试执行
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% 成功率
      const result: TestExecutionResult = {
        id: Date.now().toString(),
        testCaseId: testId,
        executorId: mockUsers[0].id,
        status: success ? 'pass' : 'fail',
        executionTime: Math.floor(Math.random() * 5000) + 1000,
        notes: success ? '测试执行成功' : '测试执行失败，请检查相关功能',
        environment: 'test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setExecutionResults(prev => new Map([...prev, [testId, result]]))
      setExecutingTests(prev => {
        const newSet = new Set(prev)
        newSet.delete(testId)
        return newSet
      })

      message.success(`测试用例执行完成: ${success ? '通过' : '失败'}`)
    }, Math.random() * 3000 + 2000)
  }

  // 手动执行测试用例
  const manualExecuteTest = (testCase: TestCase) => {
    setCurrentExecution(testCase)
    setCurrentStep(0)
    setStepResults(new Map())
    setExecutionNotes('')
    setModalVisible(true)
  }

  // 执行下一步
  const nextStep = () => {
    if (currentExecution && currentStep < currentExecution.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // 执行上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 设置步骤结果
  const setStepResult = (stepId: string, result: 'pass' | 'fail' | 'skip') => {
    setStepResults(prev => new Map([...prev, [stepId, result]]))
  }

  // 完成手动测试
  const finishManualTest = () => {
    if (!currentExecution) return

    const allSteps = currentExecution.steps
    const passedSteps = Array.from(stepResults.values()).filter(r => r === 'pass').length
    const failedSteps = Array.from(stepResults.values()).filter(r => r === 'fail').length
    
    const overallStatus = failedSteps > 0 ? 'fail' : passedSteps === allSteps.length ? 'pass' : 'skip'

    const result: TestExecutionResult = {
      id: Date.now().toString(),
      testCaseId: currentExecution.id,
      executorId: mockUsers[0].id,
      status: overallStatus,
      executionTime: Date.now() - new Date().getTime(),
      notes: executionNotes,
      environment: 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setExecutionResults(prev => new Map([...prev, [currentExecution.id, result]]))
    setModalVisible(false)
    message.success('手动测试执行完成')
  }

  // 获取执行状态
  const getExecutionStatus = (testId: string) => {
    if (executingTests.has(testId)) {
      return { status: 'running', color: 'processing', text: '执行中' }
    }
    
    const result = executionResults.get(testId)
    if (!result) {
      return { status: 'pending', color: 'default', text: '待执行' }
    }

    const statusMap = {
      pass: { status: 'pass', color: 'success', text: '通过' },
      fail: { status: 'fail', color: 'error', text: '失败' },
      skip: { status: 'skip', color: 'warning', text: '跳过' },
      blocked: { status: 'blocked', color: 'default', text: '阻塞' },
    }

    return statusMap[result.status] || { status: 'unknown', color: 'default', text: '未知' }
  }

  // 表格列配置
  const columns: ColumnsType<TestCase> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '测试用例',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: TestCase) => (
        <div>
          <Text strong className="block">{text}</Text>
          <Text type="secondary" className="text-sm">
            {record.description.length > 50
              ? `${record.description.substring(0, 50)}...`
              : record.description}
          </Text>
        </div>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        const colorMap = {
          low: 'green',
          medium: 'orange',
          high: 'red',
          critical: 'purple',
        }
        return (
          <Tag color={colorMap[priority as keyof typeof colorMap]}>
            {priority.toUpperCase()}
          </Tag>
        )
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'manual' ? 'blue' : 'green'}>
          {type === 'manual' ? '手动' : '自动'}
        </Tag>
      ),
    },
    {
      title: '执行状态',
      key: 'status',
      width: 120,
      render: (_, record: TestCase) => {
        const status = getExecutionStatus(record.id)
        return <Badge status={status.color as any} text={status.text} />
      },
    },
    {
      title: '执行时间',
      key: 'executionTime',
      width: 120,
      render: (_, record: TestCase) => {
        const result = executionResults.get(record.id)
        return result ? (
          <Text type="secondary">
            {Math.floor(result.executionTime / 1000)}s
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: TestCase) => (
        <Space size="small">
          <Tooltip title="执行测试">
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              loading={executingTests.has(record.id)}
              onClick={() => {
                if (record.type === 'manual') {
                  manualExecuteTest(record)
                } else {
                  executeTest(record.id)
                }
              }}
            />
          </Tooltip>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                // 查看测试用例详情
                message.info('查看测试用例详情')
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // 统计数据
  const stats = {
    total: testCases.length,
    executed: executionResults.size,
    passed: Array.from(executionResults.values()).filter(r => r.status === 'pass').length,
    failed: Array.from(executionResults.values()).filter(r => r.status === 'fail').length,
    running: executingTests.size,
  }

  const passRate = stats.executed > 0 ? (stats.passed / stats.executed) * 100 : 0

  if (loading) {
    return <LoadingSpinner text="正在加载测试执行数据..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              测试执行管理
            </Title>
            <Text type="secondary" className="text-sm">
              执行测试用例，支持手动执行和批量自动化执行
            </Text>
          </div>
          <Space className="ml-4">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={startBatchExecution}
              disabled={selectedTests.length === 0}
            >
              批量执行 ({selectedTests.length})
            </Button>
          </Space>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 space-y-6">

      {/* 执行统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center">
              <Statistic
                title="总用例数"
                value={stats.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center">
              <Statistic
                title="已执行"
                value={stats.executed}
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
                title="执行中"
                value={stats.running}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center">
              <div className="mb-2">
                <Progress
                  type="circle"
                  percent={Math.round(passRate)}
                  size={60}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
              <Text type="secondary">通过率</Text>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 测试用例表格 */}
      <Card>
        <Table
          rowSelection={{
            selectedRowKeys: selectedTests,
            onChange: (keys) => setSelectedTests(keys as string[]),
          }}
          columns={columns}
          dataSource={testCases}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            total: testCases.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 手动测试执行模态框 */}
      <Modal
        title={`手动执行测试: ${currentExecution?.title}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={
          <div className="flex justify-between">
            <div>
              <Button onClick={prevStep} disabled={currentStep === 0}>
                上一步
              </Button>
              <Button
                onClick={nextStep}
                disabled={!currentExecution || currentStep >= currentExecution.steps.length - 1}
                className="ml-2"
              >
                下一步
              </Button>
            </div>
            <div>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" onClick={finishManualTest} className="ml-2">
                完成测试
              </Button>
            </div>
          </div>
        }
      >
        {currentExecution && (
          <div className="space-y-4">
            {/* 测试步骤 */}
            <div>
              <Title level={4}>测试步骤</Title>
              <Steps
                current={currentStep}
                direction="vertical"
                size="small"
              >
                {currentExecution.steps.map((step, index) => {
                  const result = stepResults.get(step.id)
                  return (
                    <Step
                      key={step.id}
                      title={`步骤 ${step.order}: ${step.action}`}
                      description={
                        <div>
                          <Text strong>预期结果: </Text>
                          <Text>{step.expectedResult}</Text>
                          {index === currentStep && (
                            <div className="mt-2">
                              <Text strong>执行结果: </Text>
                              <div className="mt-1">
                                <Checkbox.Group
                                  value={result ? [result] : []}
                                  onChange={(values) => {
                                    if (values.length > 0) {
                                      setStepResult(step.id, values[0] as 'pass' | 'fail' | 'skip')
                                    }
                                  }}
                                >
                                  <Space>
                                    <Checkbox value="pass">
                                      <Tag color="green">通过</Tag>
                                    </Checkbox>
                                    <Checkbox value="fail">
                                      <Tag color="red">失败</Tag>
                                    </Checkbox>
                                    <Checkbox value="skip">
                                      <Tag color="orange">跳过</Tag>
                                    </Checkbox>
                                  </Space>
                                </Checkbox.Group>
                              </div>
                            </div>
                          )}
                        </div>
                      }
                      status={
                        result === 'pass' ? 'finish' :
                        result === 'fail' ? 'error' :
                        result === 'skip' ? 'process' :
                        index === currentStep ? 'process' : 'wait'
                      }
                    />
                  )
                })}
              </Steps>
            </div>

            {/* 执行备注 */}
            <div>
              <Title level={5}>执行备注</Title>
              <TextArea
                rows={3}
                placeholder="请输入测试执行过程中的备注信息..."
                value={executionNotes}
                onChange={(e) => setExecutionNotes(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
      </div>
    </div>
  )
}

export default TestExecution
