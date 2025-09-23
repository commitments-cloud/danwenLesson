import dayjs from 'dayjs'
import { message } from 'antd'

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format)
}

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow()
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化数字
 */
export const formatNumber = (num: number, precision = 2): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(precision) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(precision) + 'K'
  }
  return num.toString()
}

/**
 * 格式化百分比
 */
export const formatPercentage = (value: number, total: number, precision = 1): string => {
  if (total === 0) return '0%'
  return ((value / total) * 100).toFixed(precision) + '%'
}

/**
 * 格式化时长（毫秒转换为可读格式）
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}天 ${hours % 24}小时 ${minutes % 60}分钟`
  }
  if (hours > 0) {
    return `${hours}小时 ${minutes % 60}分钟`
  }
  if (minutes > 0) {
    return `${minutes}分钟 ${seconds % 60}秒`
  }
  return `${seconds}秒`
}

/**
 * 生成随机ID
 */
export const generateId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成UUID
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 深拷贝对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, wait)
    }
  }
}

/**
 * 下载文件
 */
export const downloadFile = (url: string, filename?: string): void => {
  const link = document.createElement('a')
  link.href = url
  if (filename) {
    link.download = filename
  }
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 下载Blob文件
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  downloadFile(url, filename)
  URL.revokeObjectURL(url)
}

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
    message.success('复制成功')
    return true
  } catch (error) {
    message.error('复制失败')
    return false
  }
}

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * 验证邮箱格式
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证URL格式
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证IP地址格式
 */
export const isValidIP = (ip: string): boolean => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipRegex.test(ip)
}

/**
 * 生成颜色
 */
export const generateColor = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

/**
 * 获取随机颜色
 */
export const getRandomColor = (): string => {
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa541c', '#a0d911', '#2f54eb'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 计算数组平均值
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * 计算数组总和
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((total, num) => total + num, 0)
}

/**
 * 获取数组最大值
 */
export const max = (numbers: number[]): number => {
  return Math.max(...numbers)
}

/**
 * 获取数组最小值
 */
export const min = (numbers: number[]): number => {
  return Math.min(...numbers)
}

/**
 * 数组去重
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

/**
 * 数组分组
 */
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * 数组排序
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * 对象转查询字符串
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams()
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, String(item)))
      } else {
        params.append(key, String(value))
      }
    }
  })
  
  return params.toString()
}

/**
 * 查询字符串转对象
 */
export const queryStringToObject = (queryString: string): Record<string, any> => {
  const params = new URLSearchParams(queryString)
  const obj: Record<string, any> = {}
  
  for (const [key, value] of params.entries()) {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value)
      } else {
        obj[key] = [obj[key], value]
      }
    } else {
      obj[key] = value
    }
  }
  
  return obj
}

/**
 * 本地存储工具
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key)
  },
  
  clear: (): void => {
    localStorage.clear()
  }
}

/**
 * 会话存储工具
 */
export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    window.sessionStorage.removeItem(key)
  },
  
  clear: (): void => {
    window.sessionStorage.clear()
  }
}
