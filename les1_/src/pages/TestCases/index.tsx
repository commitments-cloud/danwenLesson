import React, { useState, useEffect } from 'react'
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Drawer,
  Typography,
  Divider,
  Steps,
  Row,
  Col,
  Avatar,
  Tooltip,
  Popconfirm,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import type { ColumnsType } from 'antd/es/table'

import { TestCase, User } from '@types/index'
import { mockTestCases, mockUsers, mockProjects } from '@api/mockData'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { TextArea } = Input
const { Step } = Steps
const { Option } = Select

const TestCases: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null)
  const [viewingTestCase, setViewingTestCase] = useState<TestCase | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadTestCases()
  }, [])

  const loadTestCases = async () => {
    setLoading(true)
    // 模拟API调用
    setTimeout(() => {
      setTestCases(mockTestCases)
      setLoading(false)
    }, 500)
  }

  // 获取优先级标签颜色
  const getPriorityColor = (priority: string) => {
    const colorMap = {
      low: 'green',
      medium: 'orange',
      high: 'red',
      critical: 'purple',
    }
    return colorMap[priority as keyof typeof colorMap] || 'default'
  }

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colorMap = {
      draft: 'default',
      active: 'green',
      deprecated: 'red',
    }
    return colorMap[status as keyof typeof colorMap] || 'default'
  }

  // 处理查看测试用例
  const handleViewTestCase = (testCase: TestCase) => {
    setViewingTestCase(testCase)
    setDrawerVisible(true)
  }

  // 处理编辑测试用例
  const handleEditTestCase = (testCase: TestCase) => {
    setEditingTestCase(testCase)
    form.setFieldsValue({
      ...testCase,
      assigneeId: testCase.assignee?.id,
    })
    setModalVisible(true)
  }

  // 处理执行测试用例
  const handleExecuteTestCase = (testCase: TestCase) => {
    message.info(`开始执行测试用例: ${testCase.title}`)
    // 这里可以跳转到测试执行页面
  }

  // 处理删除测试用例
  const handleDeleteTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id))
    message.success('测试用例删除成功')
  }

  // 处理新建测试用例
  const handleCreateTestCase = () => {
    setEditingTestCase(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理表单提交
  const handleFormSubmit = async (values: any) => {
    try {
      if (editingTestCase) {
        // 更新测试用例
        const updatedTestCases = testCases.map(tc =>
          tc.id === editingTestCase.id
            ? {
                ...tc,
                ...values,
                assignee: mockUsers.find(u => u.id === values.assigneeId),
                updatedAt: new Date().toISOString(),
              }
            : tc
        )
        setTestCases(updatedTestCases)
        message.success('测试用例更新成功')
      } else {
        // 创建新测试用例
        const newTestCase: TestCase = {
          id: Date.now().toString(),
          ...values,
          assignee: mockUsers.find(u => u.id === values.assigneeId),
          steps: values.steps || [],
          tags: values.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setTestCases([...testCases, newTestCase])
        message.success('测试用例创建成功')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    }
  }

  // 过滤测试用例
  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = !searchText || 
      testCase.title.toLowerCase().includes(searchText.toLowerCase()) ||
      testCase.description.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = !statusFilter || testCase.status === statusFilter
    const matchesPriority = !priorityFilter || testCase.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys as string[])
    },
  }

  if (loading) {
    return <LoadingSpinner text="正在加载测试用例数据..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题和操作按钮 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              测试用例管理
            </Title>
            <Text type="secondary" className="text-sm">
              管理和维护项目的测试用例，支持批量操作和高级筛选
            </Text>
          </div>
          <Space className="ml-4">
            <Button icon={<ExportOutlined />}>
              导出
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTestCase}
            >
              新建测试用例
            </Button>
          </Space>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 space-y-4">

      {/* 搜索和筛选 */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="搜索测试用例标题或描述"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="draft">草稿</Option>
              <Option value="active">激活</Option>
              <Option value="deprecated">已废弃</Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="优先级筛选"
              value={priorityFilter}
              onChange={setPriorityFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
              <Option value="critical">紧急</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <Text type="secondary">
                共 {filteredTestCases.length} 个测试用例
              </Text>
              {selectedRowKeys.length > 0 && (
                <Text type="secondary">
                  已选择 {selectedRowKeys.length} 项
                </Text>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 测试用例表格 */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              width: 80,
              fixed: 'left',
            },
            {
              title: '测试用例标题',
              dataIndex: 'title',
              key: 'title',
              width: 300,
              fixed: 'left',
              render: (text: string, record: TestCase) => (
                <div>
                  <Text strong className="block">
                    {text}
                  </Text>
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
              render: (priority: string) => (
                <Tag color={getPriorityColor(priority)}>
                  {priority.toUpperCase()}
                </Tag>
              ),
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                  {status === 'draft' ? '草稿' : status === 'active' ? '激活' : '已废弃'}
                </Tag>
              ),
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
              title: '负责人',
              dataIndex: 'assignee',
              key: 'assignee',
              width: 120,
              render: (assignee: User) => (
                assignee ? (
                  <div className="flex items-center">
                    <Avatar src={assignee.avatar} size="small" className="mr-2" />
                    <Text>{assignee.username}</Text>
                  </div>
                ) : (
                  <Text type="secondary">未分配</Text>
                )
              ),
            },
            {
              title: '标签',
              dataIndex: 'tags',
              key: 'tags',
              width: 200,
              render: (tags: string[]) => (
                <div>
                  {tags.slice(0, 2).map((tag) => (
                    <Tag key={tag} size="small">
                      {tag}
                    </Tag>
                  ))}
                  {tags.length > 2 && (
                    <Tag size="small">+{tags.length - 2}</Tag>
                  )}
                </div>
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
              render: (_, record: TestCase) => (
                <Space size="small">
                  <Tooltip title="查看详情">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewTestCase(record)}
                    />
                  </Tooltip>
                  <Tooltip title="编辑">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditTestCase(record)}
                    />
                  </Tooltip>
                  <Tooltip title="执行测试">
                    <Button
                      type="text"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleExecuteTestCase(record)}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="确定要删除这个测试用例吗？"
                    onConfirm={() => handleDeleteTestCase(record.id)}
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
          ]}
          dataSource={filteredTestCases}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredTestCases.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新建/编辑测试用例模态框 */}
      <Modal
        title={editingTestCase ? '编辑测试用例' : '新建测试用例'}
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
          onFinish={handleFormSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="测试用例标题"
                rules={[{ required: true, message: '请输入测试用例标题' }]}
              >
                <Input placeholder="请输入测试用例标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="projectId"
                label="所属项目"
                rules={[{ required: true, message: '请选择所属项目' }]}
              >
                <Select placeholder="请选择所属项目">
                  {mockProjects.map(project => (
                    <Option key={project.id} value={project.id}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="测试用例描述"
            rules={[{ required: true, message: '请输入测试用例描述' }]}
          >
            <TextArea rows={3} placeholder="请输入测试用例描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="draft">草稿</Option>
                  <Option value="active">激活</Option>
                  <Option value="deprecated">已废弃</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="测试类型"
                rules={[{ required: true, message: '请选择测试类型' }]}
              >
                <Select placeholder="请选择测试类型">
                  <Option value="manual">手动测试</Option>
                  <Option value="automated">自动化测试</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assigneeId"
                label="负责人"
              >
                <Select placeholder="请选择负责人" allowClear>
                  {mockUsers.map(user => (
                    <Option key={user.id} value={user.id}>
                      <div className="flex items-center">
                        <Avatar src={user.avatar} size="small" className="mr-2" />
                        {user.username}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="标签"
              >
                <Select
                  mode="tags"
                  placeholder="请输入标签"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="expectedResult"
            label="预期结果"
            rules={[{ required: true, message: '请输入预期结果' }]}
          >
            <TextArea rows={2} placeholder="请输入预期结果" />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              {editingTestCase ? '更新' : '创建'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 查看测试用例详情抽屉 */}
      <Drawer
        title="测试用例详情"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        {viewingTestCase && (
          <div className="space-y-4">
            <div>
              <Title level={4}>{viewingTestCase.title}</Title>
              <Text type="secondary">{viewingTestCase.description}</Text>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>优先级: </Text>
                <Tag color={getPriorityColor(viewingTestCase.priority)}>
                  {viewingTestCase.priority.toUpperCase()}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>状态: </Text>
                <Tag color={getStatusColor(viewingTestCase.status)}>
                  {viewingTestCase.status === 'draft' ? '草稿' :
                   viewingTestCase.status === 'active' ? '激活' : '已废弃'}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>类型: </Text>
                <Tag color={viewingTestCase.type === 'manual' ? 'blue' : 'green'}>
                  {viewingTestCase.type === 'manual' ? '手动' : '自动'}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>负责人: </Text>
                {viewingTestCase.assignee ? (
                  <div className="flex items-center">
                    <Avatar src={viewingTestCase.assignee.avatar} size="small" className="mr-2" />
                    <Text>{viewingTestCase.assignee.username}</Text>
                  </div>
                ) : (
                  <Text type="secondary">未分配</Text>
                )}
              </Col>
            </Row>

            <Divider />

            <div>
              <Title level={5}>测试步骤</Title>
              <Steps direction="vertical" size="small">
                {viewingTestCase.steps.map((step, index) => (
                  <Step
                    key={step.id}
                    title={`步骤 ${step.order}`}
                    description={
                      <div>
                        <Text strong>操作: </Text>
                        <Text>{step.action}</Text>
                        <br />
                        <Text strong>预期结果: </Text>
                        <Text>{step.expectedResult}</Text>
                      </div>
                    }
                  />
                ))}
              </Steps>
            </div>

            <Divider />

            <div>
              <Title level={5}>预期结果</Title>
              <Text>{viewingTestCase.expectedResult}</Text>
            </div>

            <Divider />

            <div>
              <Title level={5}>标签</Title>
              <div>
                {viewingTestCase.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
      </div>
    </div>
  )
}

export default TestCases
