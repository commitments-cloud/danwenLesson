import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Typography,
  Divider,
  Avatar,
  Upload,
  message,
  Tabs,
  List,
  Tag,
  Modal,
  Space,
  Alert,
} from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  NotificationOutlined,
  TeamOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'

import { useUserStore } from '@store/index'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { Option } = Select

const { TextArea } = Input

const Settings: React.FC = () => {
  const { currentUser, updateUser } = useUserStore()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingEnvironment, setEditingEnvironment] = useState<any>(null)

  // 模拟环境配置数据
  const [environments, setEnvironments] = useState([
    {
      id: '1',
      name: '开发环境',
      url: 'https://dev.example.com',
      description: '开发环境配置',
      status: 'active',
    },
    {
      id: '2',
      name: '测试环境',
      url: 'https://test.example.com',
      description: '测试环境配置',
      status: 'active',
    },
    {
      id: '3',
      name: '预发布环境',
      url: 'https://staging.example.com',
      description: '预发布环境配置',
      status: 'inactive',
    },
  ])

  useEffect(() => {
    // 模拟页面加载
    setTimeout(() => {
      setPageLoading(false)
    }, 600)
  }, [])

  // 保存个人信息
  const saveProfile = async (values: any) => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateUser(values)
      message.success('个人信息更新成功')
    } catch (error) {
      message.error('更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 保存系统设置
  const saveSystemSettings = async (values: any) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('系统设置保存成功')
    } catch (error) {
      message.error('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 头像上传
  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功')
      updateUser({ avatar: info.file.response.url })
    } else if (info.file.status === 'error') {
      message.error('头像上传失败')
    }
  }

  // 添加/编辑环境
  const saveEnvironment = (values: any) => {
    if (editingEnvironment) {
      setEnvironments(environments.map(env =>
        env.id === editingEnvironment.id ? { ...env, ...values } : env
      ))
      message.success('环境配置更新成功')
    } else {
      const newEnv = {
        id: Date.now().toString(),
        ...values,
        status: 'active',
      }
      setEnvironments([...environments, newEnv])
      message.success('环境配置添加成功')
    }
    setModalVisible(false)
    setEditingEnvironment(null)
  }

  // 删除环境
  const deleteEnvironment = (id: string) => {
    setEnvironments(environments.filter(env => env.id !== id))
    message.success('环境配置删除成功')
  }

  if (pageLoading) {
    return <LoadingSpinner text="正在加载系统设置..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              系统设置
            </Title>
            <Text type="secondary" className="text-sm">
              管理个人信息、系统配置和环境设置
            </Text>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: 'profile',
              label: (
                <span>
                  <UserOutlined />
                  个人信息
                </span>
              ),
              children: (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card>
                <div className="text-center">
                  <Avatar
                    size={120}
                    src={currentUser?.avatar}
                    icon={<UserOutlined />}
                    className="mb-4"
                  />
                  <Upload
                    name="avatar"
                    showUploadList={false}
                    action="/api/upload"
                    onChange={handleAvatarUpload}
                  >
                    <Button icon={<UploadOutlined />}>
                      更换头像
                    </Button>
                  </Upload>
                  <div className="mt-4">
                    <Title level={4}>{currentUser?.username}</Title>
                    <Text type="secondary">{currentUser?.email}</Text>
                    <div className="mt-2">
                      <Tag color="blue">{currentUser?.role}</Tag>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={16}>
              <Card title="基本信息">
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={currentUser}
                  onFinish={saveProfile}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                          { required: true, message: '请输入邮箱' },
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="role"
                    label="角色"
                  >
                    <Select disabled>
                      <Option value="admin">管理员</Option>
                      <Option value="tester">测试员</Option>
                      <Option value="developer">开发者</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存更改
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
              )
            },
            {
              key: 'system',
              label: (
                <span>
                  <SettingOutlined />
                  系统设置
                </span>
              ),
              children: (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="界面设置">
                <Form layout="vertical" onFinish={saveSystemSettings}>
                  <Form.Item name="theme" label="主题模式" initialValue="light">
                    <Select>
                      <Option value="light">浅色模式</Option>
                      <Option value="dark">深色模式</Option>
                      <Option value="auto">跟随系统</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="language" label="语言" initialValue="zh-CN">
                    <Select>
                      <Option value="zh-CN">简体中文</Option>
                      <Option value="en-US">English</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="pageSize" label="每页显示条数" initialValue={10}>
                    <Select>
                      <Option value={10}>10条</Option>
                      <Option value={20}>20条</Option>
                      <Option value={50}>50条</Option>
                      <Option value={100}>100条</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存设置
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="测试设置">
                <Form layout="vertical" onFinish={saveSystemSettings}>
                  <Form.Item
                    name="autoSave"
                    label="自动保存测试结果"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="parallelExecution"
                    label="并行执行测试"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="screenshotOnFailure"
                    label="失败时自动截图"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item name="timeout" label="默认超时时间(秒)" initialValue={30}>
                    <Input type="number" min={1} max={300} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存设置
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
              )
            },
            {
              key: 'notifications',
              label: (
                <span>
                  <NotificationOutlined />
                  通知设置
                </span>
              ),
              children: (
          <Card title="通知偏好">
            <Form layout="vertical" onFinish={saveSystemSettings}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>测试完成通知</Text>
                    <br />
                    <Text type="secondary">测试执行完成后发送通知</Text>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>缺陷分配通知</Text>
                    <br />
                    <Text type="secondary">有新缺陷分配给您时发送通知</Text>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>系统维护通知</Text>
                    <br />
                    <Text type="secondary">系统维护和更新通知</Text>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>邮件通知</Text>
                    <br />
                    <Text type="secondary">通过邮件接收重要通知</Text>
                  </div>
                  <Switch />
                </div>
              </div>

              <Form.Item className="mt-6">
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
              )
            },
            {
              key: 'environments',
              label: (
                <span>
                  <SecurityScanOutlined />
                  环境配置
                </span>
              ),
              children: (
          <Card
            title="测试环境"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingEnvironment(null)
                  setModalVisible(true)
                }}
              >
                添加环境
              </Button>
            }
          >
            <List
              dataSource={environments}
              renderItem={(env) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingEnvironment(env)
                        setModalVisible(true)
                      }}
                    />,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteEnvironment(env.id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center space-x-2">
                        <Text strong>{env.name}</Text>
                        <Tag color={env.status === 'active' ? 'green' : 'red'}>
                          {env.status === 'active' ? '启用' : '禁用'}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">{env.description}</Text>
                        <br />
                        <Text code>{env.url}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
              )
            },
            {
              key: 'security',
              label: (
                <span>
                  <SecurityScanOutlined />
                  安全设置
                </span>
              ),
              children: (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="密码设置">
                <Form layout="vertical">
                  <Form.Item
                    name="currentPassword"
                    label="当前密码"
                    rules={[{ required: true, message: '请输入当前密码' }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 8, message: '密码至少8位' },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="确认新密码"
                    rules={[
                      { required: true, message: '请确认新密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      更新密码
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="安全选项">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text strong>双因素认证</Text>
                      <br />
                      <Text type="secondary">增强账户安全性</Text>
                    </div>
                    <Switch />
                  </div>

                  <Divider />

                  <div className="flex items-center justify-between">
                    <div>
                      <Text strong>登录通知</Text>
                      <br />
                      <Text type="secondary">新设备登录时发送通知</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Divider />

                  <div className="flex items-center justify-between">
                    <div>
                      <Text strong>会话超时</Text>
                      <br />
                      <Text type="secondary">自动登出时间设置</Text>
                    </div>
                    <Select defaultValue={30} style={{ width: 120 }}>
                      <Option value={15}>15分钟</Option>
                      <Option value={30}>30分钟</Option>
                      <Option value={60}>1小时</Option>
                      <Option value={240}>4小时</Option>
                    </Select>
                  </div>
                </div>

                <Alert
                  message="安全提示"
                  description="建议启用双因素认证以提高账户安全性。定期更换密码，避免在公共设备上保存登录信息。"
                  type="info"
                  showIcon
                  className="mt-4"
                />
              </Card>
            </Col>
          </Row>
              )
            }
          ]}
        />
      </div>

      {/* 环境配置模态框 */}
      <Modal
        title={editingEnvironment ? '编辑环境' : '添加环境'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingEnvironment(null)
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingEnvironment}
          onFinish={saveEnvironment}
        >
          <Form.Item
            name="name"
            label="环境名称"
            rules={[{ required: true, message: '请输入环境名称' }]}
          >
            <Input placeholder="例如：开发环境" />
          </Form.Item>

          <Form.Item
            name="url"
            label="环境地址"
            rules={[
              { required: true, message: '请输入环境地址' },
              { type: 'url', message: '请输入有效的URL' },
            ]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="环境描述信息" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingEnvironment ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Settings
