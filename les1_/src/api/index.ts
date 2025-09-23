import axios from 'axios'
import { message } from 'antd'
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
  TestCase,
  APITest,
  PerformanceTest,
  AutomationTest,
  TestExecutionResult,
  Bug,
  TestReport,
  User,
  Project,
  DashboardStats,
  Notification,
} from '@types/index'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 401:
          message.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问该资源')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(response.data?.message || '请求失败')
      }
    } else {
      message.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

// 用户相关API
export const userAPI = {
  // 登录
  login: (credentials: { username: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> =>
    api.post('/auth/login', credentials),
  
  // 登出
  logout: (): Promise<ApiResponse> =>
    api.post('/auth/logout'),
  
  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<User>> =>
    api.get('/auth/me'),
  
  // 更新用户信息
  updateUser: (id: string, data: Partial<User>): Promise<ApiResponse<User>> =>
    api.put(`/users/${id}`, data),
  
  // 获取用户列表
  getUsers: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<User>>> =>
    api.get('/users', { params }),
}

// 项目相关API
export const projectAPI = {
  // 获取项目列表
  getProjects: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<Project>>> =>
    api.get('/projects', { params }),
  
  // 获取项目详情
  getProject: (id: string): Promise<ApiResponse<Project>> =>
    api.get(`/projects/${id}`),
  
  // 创建项目
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Project>> =>
    api.post('/projects', data),
  
  // 更新项目
  updateProject: (id: string, data: Partial<Project>): Promise<ApiResponse<Project>> =>
    api.put(`/projects/${id}`, data),
  
  // 删除项目
  deleteProject: (id: string): Promise<ApiResponse> =>
    api.delete(`/projects/${id}`),
}

// 测试用例相关API
export const testCaseAPI = {
  // 获取测试用例列表
  getTestCases: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<TestCase>>> =>
    api.get('/test-cases', { params }),
  
  // 获取测试用例详情
  getTestCase: (id: string): Promise<ApiResponse<TestCase>> =>
    api.get(`/test-cases/${id}`),
  
  // 创建测试用例
  createTestCase: (data: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<TestCase>> =>
    api.post('/test-cases', data),
  
  // 更新测试用例
  updateTestCase: (id: string, data: Partial<TestCase>): Promise<ApiResponse<TestCase>> =>
    api.put(`/test-cases/${id}`, data),
  
  // 删除测试用例
  deleteTestCase: (id: string): Promise<ApiResponse> =>
    api.delete(`/test-cases/${id}`),
  
  // 批量删除测试用例
  batchDeleteTestCases: (ids: string[]): Promise<ApiResponse> =>
    api.delete('/test-cases/batch', { data: { ids } }),
  
  // 执行测试用例
  executeTestCase: (id: string, data: any): Promise<ApiResponse<TestExecutionResult>> =>
    api.post(`/test-cases/${id}/execute`, data),
}

// API测试相关API
export const apiTestAPI = {
  // 获取API测试列表
  getAPITests: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<APITest>>> =>
    api.get('/api-tests', { params }),
  
  // 获取API测试详情
  getAPITest: (id: string): Promise<ApiResponse<APITest>> =>
    api.get(`/api-tests/${id}`),
  
  // 创建API测试
  createAPITest: (data: Omit<APITest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<APITest>> =>
    api.post('/api-tests', data),
  
  // 更新API测试
  updateAPITest: (id: string, data: Partial<APITest>): Promise<ApiResponse<APITest>> =>
    api.put(`/api-tests/${id}`, data),
  
  // 删除API测试
  deleteAPITest: (id: string): Promise<ApiResponse> =>
    api.delete(`/api-tests/${id}`),
  
  // 执行API测试
  executeAPITest: (id: string): Promise<ApiResponse<any>> =>
    api.post(`/api-tests/${id}/execute`),
}

// 性能测试相关API
export const performanceTestAPI = {
  // 获取性能测试列表
  getPerformanceTests: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<PerformanceTest>>> =>
    api.get('/performance-tests', { params }),
  
  // 获取性能测试详情
  getPerformanceTest: (id: string): Promise<ApiResponse<PerformanceTest>> =>
    api.get(`/performance-tests/${id}`),
  
  // 创建性能测试
  createPerformanceTest: (data: Omit<PerformanceTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PerformanceTest>> =>
    api.post('/performance-tests', data),
  
  // 更新性能测试
  updatePerformanceTest: (id: string, data: Partial<PerformanceTest>): Promise<ApiResponse<PerformanceTest>> =>
    api.put(`/performance-tests/${id}`, data),
  
  // 删除性能测试
  deletePerformanceTest: (id: string): Promise<ApiResponse> =>
    api.delete(`/performance-tests/${id}`),
  
  // 执行性能测试
  executePerformanceTest: (id: string): Promise<ApiResponse<any>> =>
    api.post(`/performance-tests/${id}/execute`),
  
  // 停止性能测试
  stopPerformanceTest: (id: string): Promise<ApiResponse> =>
    api.post(`/performance-tests/${id}/stop`),
}

// 自动化测试相关API
export const automationTestAPI = {
  // 获取自动化测试列表
  getAutomationTests: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<AutomationTest>>> =>
    api.get('/automation-tests', { params }),
  
  // 获取自动化测试详情
  getAutomationTest: (id: string): Promise<ApiResponse<AutomationTest>> =>
    api.get(`/automation-tests/${id}`),
  
  // 创建自动化测试
  createAutomationTest: (data: Omit<AutomationTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AutomationTest>> =>
    api.post('/automation-tests', data),
  
  // 更新自动化测试
  updateAutomationTest: (id: string, data: Partial<AutomationTest>): Promise<ApiResponse<AutomationTest>> =>
    api.put(`/automation-tests/${id}`, data),
  
  // 删除自动化测试
  deleteAutomationTest: (id: string): Promise<ApiResponse> =>
    api.delete(`/automation-tests/${id}`),
  
  // 执行自动化测试
  executeAutomationTest: (id: string): Promise<ApiResponse<any>> =>
    api.post(`/automation-tests/${id}/execute`),
}

// 缺陷相关API
export const bugAPI = {
  // 获取缺陷列表
  getBugs: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<Bug>>> =>
    api.get('/bugs', { params }),
  
  // 获取缺陷详情
  getBug: (id: string): Promise<ApiResponse<Bug>> =>
    api.get(`/bugs/${id}`),
  
  // 创建缺陷
  createBug: (data: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Bug>> =>
    api.post('/bugs', data),
  
  // 更新缺陷
  updateBug: (id: string, data: Partial<Bug>): Promise<ApiResponse<Bug>> =>
    api.put(`/bugs/${id}`, data),
  
  // 删除缺陷
  deleteBug: (id: string): Promise<ApiResponse> =>
    api.delete(`/bugs/${id}`),
}

// 测试报告相关API
export const reportAPI = {
  // 获取测试报告列表
  getReports: (params?: PaginationParams & FilterParams): Promise<ApiResponse<PaginatedResponse<TestReport>>> =>
    api.get('/reports', { params }),
  
  // 获取测试报告详情
  getReport: (id: string): Promise<ApiResponse<TestReport>> =>
    api.get(`/reports/${id}`),
  
  // 生成测试报告
  generateReport: (data: any): Promise<ApiResponse<TestReport>> =>
    api.post('/reports/generate', data),
  
  // 导出测试报告
  exportReport: (id: string, format: 'pdf' | 'excel'): Promise<Blob> =>
    api.get(`/reports/${id}/export`, {
      params: { format },
      responseType: 'blob',
    }),
  
  // 获取仪表板统计数据
  getDashboardStats: (params?: { projectId?: string; dateRange?: [string, string] }): Promise<ApiResponse<DashboardStats>> =>
    api.get('/reports/dashboard', { params }),
}

// 通知相关API
export const notificationAPI = {
  // 获取通知列表
  getNotifications: (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Notification>>> =>
    api.get('/notifications', { params }),
  
  // 标记通知为已读
  markAsRead: (id: string): Promise<ApiResponse> =>
    api.put(`/notifications/${id}/read`),
  
  // 批量标记为已读
  markAllAsRead: (): Promise<ApiResponse> =>
    api.put('/notifications/read-all'),
  
  // 删除通知
  deleteNotification: (id: string): Promise<ApiResponse> =>
    api.delete(`/notifications/${id}`),
  
  // 获取未读通知数量
  getUnreadCount: (): Promise<ApiResponse<{ count: number }>> =>
    api.get('/notifications/unread-count'),
}

// 文件上传API
export const uploadAPI = {
  // 上传文件
  uploadFile: (file: File, onProgress?: (percent: number) => void): Promise<ApiResponse<{ url: string; filename: string }>> => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      },
    })
  },
  
  // 批量上传文件
  uploadFiles: (files: File[]): Promise<ApiResponse<Array<{ url: string; filename: string }>>> => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })
    
    return api.post('/upload/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// 导出所有API
export default {
  user: userAPI,
  project: projectAPI,
  testCase: testCaseAPI,
  apiTest: apiTestAPI,
  performanceTest: performanceTestAPI,
  automationTest: automationTestAPI,
  bug: bugAPI,
  report: reportAPI,
  notification: notificationAPI,
  upload: uploadAPI,
}
