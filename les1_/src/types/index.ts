// 基础类型定义
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// 用户类型
export interface User extends BaseEntity {
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'tester' | 'developer'
  status: 'active' | 'inactive'
}

// 项目类型
export interface Project extends BaseEntity {
  name: string
  description: string
  status: 'active' | 'archived'
  members: User[]
  testCaseCount: number
  passRate: number
}

// 测试用例类型
export interface TestCase extends BaseEntity {
  title: string
  description: string
  projectId: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'active' | 'deprecated'
  type: 'manual' | 'automated'
  steps: TestStep[]
  expectedResult: string
  tags: string[]
  assignee?: User
  lastExecutionResult?: TestExecutionResult
}

// 测试步骤类型
export interface TestStep {
  id: string
  order: number
  action: string
  expectedResult: string
  actualResult?: string
  status?: 'pass' | 'fail' | 'skip'
}

// 测试执行结果类型
export interface TestExecutionResult extends BaseEntity {
  testCaseId: string
  executorId: string
  status: 'pass' | 'fail' | 'skip' | 'blocked'
  executionTime: number
  notes?: string
  screenshots?: string[]
  logs?: string[]
  environment: string
}

// 测试计划类型
export interface TestPlan extends BaseEntity {
  name: string
  description: string
  projectId: string
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  testCases: string[]
  assignees: string[]
  progress: {
    total: number
    passed: number
    failed: number
    skipped: number
    blocked: number
  }
}

// API测试类型
export interface APITest extends BaseEntity {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  headers: Record<string, string>
  body?: string
  expectedStatus: number
  expectedResponse?: string
  assertions: APIAssertion[]
  environment: string
}

export interface APIAssertion {
  id: string
  type: 'status' | 'header' | 'body' | 'response_time'
  field?: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists'
  value: string | number
}

// 性能测试类型
export interface PerformanceTest extends BaseEntity {
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  concurrency: number
  duration: number
  rampUp: number
  thresholds: {
    responseTime: number
    errorRate: number
    throughput: number
  }
  results?: PerformanceTestResult[]
}

export interface PerformanceTestResult {
  timestamp: string
  responseTime: number
  throughput: number
  errorRate: number
  activeUsers: number
}

// 自动化测试类型
export interface AutomationTest extends BaseEntity {
  name: string
  type: 'selenium' | 'cypress' | 'playwright'
  script: string
  parameters: Record<string, any>
  schedule?: {
    enabled: boolean
    cron: string
  }
  lastRun?: {
    timestamp: string
    status: 'success' | 'failure'
    duration: number
    logs: string[]
  }
}

// 缺陷类型
export interface Bug extends BaseEntity {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected'
  assignee?: User
  reporter: User
  projectId: string
  testCaseId?: string
  steps: string[]
  environment: string
  attachments?: string[]
  comments: BugComment[]
}

export interface BugComment extends BaseEntity {
  content: string
  author: User
  bugId: string
}

// 测试报告类型
export interface TestReport extends BaseEntity {
  name: string
  type: 'execution' | 'coverage' | 'performance' | 'summary'
  projectId: string
  period: {
    startDate: string
    endDate: string
  }
  data: any
  charts: ReportChart[]
}

export interface ReportChart {
  id: string
  type: 'line' | 'bar' | 'pie' | 'area'
  title: string
  data: any
  config: any
}

// 通知类型
export interface Notification extends BaseEntity {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  userId: string
  actionUrl?: string
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

// 分页类型
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 筛选类型
export interface FilterParams {
  search?: string
  status?: string[]
  priority?: string[]
  assignee?: string[]
  dateRange?: [string, string]
  tags?: string[]
}

// 仪表板统计类型
export interface DashboardStats {
  totalTestCases: number
  passedTests: number
  failedTests: number
  passRate: number
  totalBugs: number
  openBugs: number
  resolvedBugs: number
  testCoverage: number
  activeProjects: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'test_execution' | 'bug_report' | 'test_case_created' | 'test_plan_updated'
  title: string
  description: string
  timestamp: string
  user: User
  projectId?: string
}
