import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'

import MainLayout from '@components/Layout/MainLayout'
import Dashboard from '@pages/Dashboard'
import TestCases from '@pages/TestCases'
import TestExecution from '@pages/TestExecution'
import TestReports from '@pages/TestReports'
import APITesting from '@pages/APITesting'
import PerformanceTesting from '@pages/PerformanceTesting'
import AutomationTesting from '@pages/AutomationTesting'
import AIAssistant from '@pages/AIAssistant'
import Settings from '@pages/Settings'

const { Content } = Layout

// 页面切换动画配置
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

const App: React.FC = () => {
  useEffect(() => {
    // 移除加载动画
    const loadingElement = document.querySelector('.loading-container')
    if (loadingElement) {
      setTimeout(() => {
        loadingElement.remove()
      }, 1000)
    }
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="dashboard"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="test-cases"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="test-cases"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TestCases />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="test-execution"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="test-execution"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TestExecution />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="test-reports"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="test-reports"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TestReports />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="api-testing"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="api-testing"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <APITesting />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="performance-testing"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="performance-testing"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PerformanceTesting />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="automation-testing"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="automation-testing"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AutomationTesting />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="ai-assistant"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="ai-assistant"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AIAssistant />
                </motion.div>
              </AnimatePresence>
            }
          />
          <Route
            path="settings"
            element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="settings"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Settings />
                </motion.div>
              </AnimatePresence>
            }
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
