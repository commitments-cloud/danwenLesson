import dayjs from 'dayjs'

// 格式化时间
export const formatTime = (time: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(time).format(format)
}

// 相对时间
export const formatRelativeTime = (time: string | Date) => {
  const now = dayjs()
  const target = dayjs(time)
  const diff = now.diff(target, 'minute')

  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  if (diff < 10080) return `${Math.floor(diff / 1440)}天前`
  
  return target.format('MM-DD HH:mm')
}

// 截断文本
export const truncateText = (text: string, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// 格式化北京时间
export const formatBeijingTime = (time: string | Date) => {
  // 简单地显示本地时间，假设服务器时间已经是正确的
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 生成随机ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// 复制到剪贴板
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
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

// 滚动到底部
export const scrollToBottom = (element: HTMLElement, smooth = true) => {
  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

// 检查是否在底部
export const isAtBottom = (element: HTMLElement, threshold = 100) => {
  return element.scrollHeight - element.scrollTop - element.clientHeight < threshold
}

// 格式化文件大小
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 高亮搜索关键词
export const highlightText = (text: string, keyword: string) => {
  if (!keyword) return text
  
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
