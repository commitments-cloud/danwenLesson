import { 
  User, 
  Project, 
  TestCase, 
  TestExecutionResult, 
  APITest, 
  PerformanceTest, 
  AutomationTest, 
  Bug, 
  TestReport,
  DashboardStats,
  ActivityItem,
  Notification
} from '@types/index'

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'tester1',
    email: 'tester1@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tester1',
    role: 'tester',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    username: 'developer1',
    email: 'dev1@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev1',
    role: 'developer',
    status: 'active',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
]

// 模拟项目数据
export const mockProjects: Project[] = [
  {
    id: '1',
    name: '电商平台测试',
    description: '电商平台的全面测试项目，包括前端、后端和移动端',
    status: 'active',
    members: mockUsers,
    testCaseCount: 156,
    passRate: 85.2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: '支付系统测试',
    description: '支付系统的安全性和功能性测试',
    status: 'active',
    members: [mockUsers[0], mockUsers[1]],
    testCaseCount: 89,
    passRate: 92.1,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    name: '用户管理系统',
    description: '用户注册、登录、权限管理等功能测试',
    status: 'archived',
    members: [mockUsers[1], mockUsers[2]],
    testCaseCount: 67,
    passRate: 88.5,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
]

// 模拟测试用例数据
export const mockTestCases: TestCase[] = [
  {
    id: '1',
    title: '用户登录功能测试',
    description: '验证用户使用正确的用户名和密码能够成功登录系统',
    projectId: '1',
    priority: 'high',
    status: 'active',
    type: 'manual',
    steps: [
      {
        id: '1',
        order: 1,
        action: '打开登录页面',
        expectedResult: '显示登录表单',
      },
      {
        id: '2',
        order: 2,
        action: '输入有效的用户名和密码',
        expectedResult: '输入框显示输入内容',
      },
      {
        id: '3',
        order: 3,
        action: '点击登录按钮',
        expectedResult: '成功登录并跳转到首页',
      },
    ],
    expectedResult: '用户成功登录系统',
    tags: ['登录', '认证', '核心功能'],
    assignee: mockUsers[1],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: '商品搜索功能测试',
    description: '验证用户能够通过关键词搜索到相关商品',
    projectId: '1',
    priority: 'medium',
    status: 'active',
    type: 'automated',
    steps: [
      {
        id: '1',
        order: 1,
        action: '在搜索框输入商品关键词',
        expectedResult: '搜索框显示输入内容',
      },
      {
        id: '2',
        order: 2,
        action: '点击搜索按钮',
        expectedResult: '显示搜索结果页面',
      },
    ],
    expectedResult: '显示相关商品列表',
    tags: ['搜索', '商品', '功能测试'],
    assignee: mockUsers[2],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
]

// 模拟API测试数据
export const mockAPITests: APITest[] = [
  {
    id: '1',
    name: '用户登录API',
    method: 'POST',
    url: '/api/auth/login',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'testuser',
      password: 'password123',
    }),
    expectedStatus: 200,
    expectedResponse: '{"success": true, "token": "..."}',
    assertions: [
      {
        id: '1',
        type: 'status',
        operator: 'equals',
        value: 200,
      },
      {
        id: '2',
        type: 'body',
        field: 'success',
        operator: 'equals',
        value: true,
      },
    ],
    environment: 'test',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
]

// 模拟性能测试数据
export const mockPerformanceTests: PerformanceTest[] = [
  {
    id: '1',
    name: '首页加载性能测试',
    url: '/api/homepage',
    method: 'GET',
    concurrency: 100,
    duration: 300,
    rampUp: 60,
    thresholds: {
      responseTime: 2000,
      errorRate: 5,
      throughput: 50,
    },
    results: [
      {
        timestamp: '2024-01-15T10:00:00Z',
        responseTime: 1200,
        throughput: 85,
        errorRate: 2.1,
        activeUsers: 100,
      },
      {
        timestamp: '2024-01-15T10:01:00Z',
        responseTime: 1350,
        throughput: 82,
        errorRate: 2.8,
        activeUsers: 100,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
]

// 模拟自动化测试数据
export const mockAutomationTests: AutomationTest[] = [
  {
    id: '1',
    name: '用户注册流程自动化测试',
    type: 'selenium',
    script: `
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_user_registration():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000/register")
    
    # 填写注册表单
    driver.find_element(By.ID, "username").send_keys("testuser")
    driver.find_element(By.ID, "email").send_keys("test@example.com")
    driver.find_element(By.ID, "password").send_keys("password123")
    
    # 提交表单
    driver.find_element(By.ID, "submit").click()
    
    # 验证结果
    assert "注册成功" in driver.page_source
    
    driver.quit()
    `,
    parameters: {
      browser: 'chrome',
      timeout: 30000,
      retries: 3,
    },
    schedule: {
      enabled: true,
      cron: '0 2 * * *',
    },
    lastRun: {
      timestamp: '2024-01-15T02:00:00Z',
      status: 'success',
      duration: 45000,
      logs: [
        '测试开始执行',
        '打开注册页面',
        '填写用户信息',
        '提交注册表单',
        '验证注册成功',
        '测试执行完成',
      ],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
]

// 模拟缺陷数据
export const mockBugs: Bug[] = [
  {
    id: '1',
    title: '登录页面密码输入框不显示密码强度提示',
    description: '在登录页面输入密码时，应该显示密码强度提示，但目前没有显示',
    severity: 'medium',
    priority: 'medium',
    status: 'open',
    reporter: mockUsers[1],
    assignee: mockUsers[2],
    projectId: '1',
    testCaseId: '1',
    steps: [
      '打开登录页面',
      '在密码输入框中输入密码',
      '观察是否显示密码强度提示',
    ],
    environment: 'Chrome 120.0, Windows 11',
    attachments: ['screenshot1.png'],
    comments: [
      {
        id: '1',
        content: '已确认此问题，将在下个版本修复',
        author: mockUsers[2],
        bugId: '1',
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z',
      },
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
]

// 模拟仪表板统计数据
export const mockDashboardStats: DashboardStats = {
  totalTestCases: 312,
  passedTests: 267,
  failedTests: 28,
  passRate: 85.6,
  totalBugs: 45,
  openBugs: 12,
  resolvedBugs: 33,
  testCoverage: 78.5,
  activeProjects: 5,
  recentActivity: [
    {
      id: '1',
      type: 'test_execution',
      title: '执行了用户登录测试',
      description: '测试用例 "用户登录功能测试" 执行完成，结果：通过',
      timestamp: '2024-01-15T14:30:00Z',
      user: mockUsers[1],
      projectId: '1',
    },
    {
      id: '2',
      type: 'bug_report',
      title: '报告了新缺陷',
      description: '在电商平台项目中发现登录页面显示问题',
      timestamp: '2024-01-15T13:45:00Z',
      user: mockUsers[1],
      projectId: '1',
    },
    {
      id: '3',
      type: 'test_case_created',
      title: '创建了新测试用例',
      description: '为支付系统添加了支付流程测试用例',
      timestamp: '2024-01-15T11:20:00Z',
      user: mockUsers[2],
      projectId: '2',
    },
  ],
}

// 模拟通知数据
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '测试执行完成',
    message: '用户登录功能测试已完成，结果：通过',
    type: 'success',
    read: false,
    userId: '1',
    actionUrl: '/test-execution',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: '新缺陷分配',
    message: '您被分配了一个新的缺陷：登录页面密码输入框问题',
    type: 'warning',
    read: false,
    userId: '2',
    actionUrl: '/bugs/1',
    createdAt: '2024-01-15T13:45:00Z',
    updatedAt: '2024-01-15T13:45:00Z',
  },
  {
    id: '3',
    title: '性能测试报告',
    message: '首页加载性能测试报告已生成',
    type: 'info',
    read: true,
    userId: '1',
    actionUrl: '/test-reports',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
  },
]
