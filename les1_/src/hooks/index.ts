import { useState, useEffect, useCallback, useRef } from 'react'
import { message } from 'antd'
import { debounce } from '@utils/index'

/**
 * 本地存储Hook
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

/**
 * 会话存储Hook
 */
export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

/**
 * 防抖Hook
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 防抖回调Hook
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback(
    debounce((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay]
  ) as T
}

/**
 * 异步操作Hook
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
  }
}

/**
 * 复制到剪贴板Hook
 */
export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      message.warning('剪贴板功能不可用')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      message.success('复制成功')
      return true
    } catch (error) {
      message.error('复制失败')
      setCopiedText(null)
      return false
    }
  }, [])

  return { copiedText, copy }
}

/**
 * 窗口大小Hook
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * 媒体查询Hook
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * 响应式断点Hook
 */
export const useBreakpoint = () => {
  const isXs = useMediaQuery('(max-width: 575px)')
  const isSm = useMediaQuery('(min-width: 576px) and (max-width: 767px)')
  const isMd = useMediaQuery('(min-width: 768px) and (max-width: 991px)')
  const isLg = useMediaQuery('(min-width: 992px) and (max-width: 1199px)')
  const isXl = useMediaQuery('(min-width: 1200px)')

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isMobile: isXs || isSm,
    isTablet: isMd,
    isDesktop: isLg || isXl,
  }
}

/**
 * 在线状态Hook
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * 页面可见性Hook
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return isVisible
}

/**
 * 倒计时Hook
 */
export const useCountdown = (initialTime: number) => {
  const [time, setTime] = useState(initialTime)
  const [isActive, setIsActive] = useState(false)

  const start = useCallback(() => setIsActive(true), [])
  const pause = useCallback(() => setIsActive(false), [])
  const reset = useCallback(() => {
    setTime(initialTime)
    setIsActive(false)
  }, [initialTime])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time])

  return { time, isActive, start, pause, reset }
}

/**
 * 轮询Hook
 */
export const usePolling = <T>(
  asyncFunction: () => Promise<T>,
  interval: number,
  immediate = true
) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startPolling = useCallback(() => {
    const poll = async () => {
      try {
        setIsLoading(true)
        const result = await asyncFunction()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    poll() // 立即执行一次
    intervalRef.current = setInterval(poll, interval)
  }, [asyncFunction, interval])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      startPolling()
    }

    return () => {
      stopPolling()
    }
  }, [immediate, startPolling, stopPolling])

  return {
    data,
    error,
    isLoading,
    startPolling,
    stopPolling,
  }
}

/**
 * 表单验证Hook
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // 验证单个字段
    const error = validationRules[name]?.(value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validationRules])

  const setTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach(key => {
      const error = validationRules[key as keyof T](values[key as keyof T])
      if (error) {
        newErrors[key as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validationRules])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  }
}

/**
 * 无限滚动Hook
 */
export const useInfiniteScroll = <T>(
  fetchMore: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  options: {
    threshold?: number
    initialPage?: number
  } = {}
) => {
  const { threshold = 100, initialPage = 1 } = options
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(initialPage)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await fetchMore(page)
      setData(prev => [...prev, ...result.data])
      setHasMore(result.hasMore)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Failed to load more data:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchMore, page, loading, hasMore])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - threshold
      ) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore, threshold])

  // 初始加载
  useEffect(() => {
    if (data.length === 0) {
      loadMore()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setData([])
    setPage(initialPage)
    setHasMore(true)
  }, [initialPage])

  return {
    data,
    loading,
    hasMore,
    loadMore,
    reset,
  }
}
