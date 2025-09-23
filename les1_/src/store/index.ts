import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, Project, Notification, DashboardStats } from '@types/index'

// 用户状态
interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,
        isAuthenticated: false,
        login: (user) => set({ currentUser: user, isAuthenticated: true }),
        logout: () => set({ currentUser: null, isAuthenticated: false }),
        updateUser: (userData) => {
          const currentUser = get().currentUser
          if (currentUser) {
            set({ currentUser: { ...currentUser, ...userData } })
          }
        },
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'user-store' }
  )
)

// 项目状态
interface ProjectState {
  currentProject: Project | null
  projects: Project[]
  setCurrentProject: (project: Project | null) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  removeProject: (id: string) => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      (set, get) => ({
        currentProject: null,
        projects: [],
        setCurrentProject: (project) => set({ currentProject: project }),
        setProjects: (projects) => set({ projects }),
        addProject: (project) => {
          const projects = get().projects
          set({ projects: [...projects, project] })
        },
        updateProject: (id, projectData) => {
          const projects = get().projects
          const updatedProjects = projects.map((p) =>
            p.id === id ? { ...p, ...projectData } : p
          )
          set({ projects: updatedProjects })
          
          // 如果更新的是当前项目，也更新当前项目状态
          const currentProject = get().currentProject
          if (currentProject && currentProject.id === id) {
            set({ currentProject: { ...currentProject, ...projectData } })
          }
        },
        removeProject: (id) => {
          const projects = get().projects
          const filteredProjects = projects.filter((p) => p.id !== id)
          set({ projects: filteredProjects })
          
          // 如果删除的是当前项目，清空当前项目
          const currentProject = get().currentProject
          if (currentProject && currentProject.id === id) {
            set({ currentProject: null })
          }
        },
      }),
      {
        name: 'project-storage',
        partialize: (state) => ({
          currentProject: state.currentProject,
          projects: state.projects,
        }),
      }
    ),
    { name: 'project-store' }
  )
)

// 通知状态
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.read).length
        set({ notifications, unreadCount })
      },
      addNotification: (notification) => {
        const notifications = get().notifications
        const newNotifications = [notification, ...notifications]
        const unreadCount = newNotifications.filter((n) => !n.read).length
        set({ notifications: newNotifications, unreadCount })
      },
      markAsRead: (id) => {
        const notifications = get().notifications
        const updatedNotifications = notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
        const unreadCount = updatedNotifications.filter((n) => !n.read).length
        set({ notifications: updatedNotifications, unreadCount })
      },
      markAllAsRead: () => {
        const notifications = get().notifications
        const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))
        set({ notifications: updatedNotifications, unreadCount: 0 })
      },
      removeNotification: (id) => {
        const notifications = get().notifications
        const filteredNotifications = notifications.filter((n) => n.id !== id)
        const unreadCount = filteredNotifications.filter((n) => !n.read).length
        set({ notifications: filteredNotifications, unreadCount })
      },
    }),
    { name: 'notification-store' }
  )
)

// 应用状态
interface AppState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  dashboardStats: DashboardStats | null
  loading: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'zh-CN' | 'en-US') => void
  setDashboardStats: (stats: DashboardStats) => void
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        theme: 'light',
        language: 'zh-CN',
        dashboardStats: null,
        loading: false,
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        setDashboardStats: (stats) => set({ dashboardStats: stats }),
        setLoading: (loading) => set({ loading }),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          language: state.language,
        }),
      }
    ),
    { name: 'app-store' }
  )
)

// 测试执行状态
interface TestExecutionState {
  runningTests: Set<string>
  testResults: Map<string, any>
  startTest: (testId: string) => void
  stopTest: (testId: string) => void
  setTestResult: (testId: string, result: any) => void
  clearResults: () => void
}

export const useTestExecutionStore = create<TestExecutionState>()(
  devtools(
    (set, get) => ({
      runningTests: new Set(),
      testResults: new Map(),
      startTest: (testId) => {
        const runningTests = new Set(get().runningTests)
        runningTests.add(testId)
        set({ runningTests })
      },
      stopTest: (testId) => {
        const runningTests = new Set(get().runningTests)
        runningTests.delete(testId)
        set({ runningTests })
      },
      setTestResult: (testId, result) => {
        const testResults = new Map(get().testResults)
        testResults.set(testId, result)
        set({ testResults })
      },
      clearResults: () => {
        set({ testResults: new Map() })
      },
    }),
    { name: 'test-execution-store' }
  )
)
