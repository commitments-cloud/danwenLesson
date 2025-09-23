import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Progress, List, Avatar, Tag, Typography } from 'antd'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BugOutlined,
  ProjectOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'

import { useAppStore } from '@store/index'
import { mockDashboardStats } from '@api/mockData'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const { dashboardStats, setDashboardStats } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载仪表板数据
    setLoading(true)
    setTimeout(() => {
      setDashboardStats(mockDashboardStats)
      setLoading(false)
    }, 800)
  }, [setDashboardStats])

  // 使用默认数据或已加载的数据
  const currentStats = dashboardStats || mockDashboardStats

  if (!dashboardStats) {
    return <div>加载中...</div>
  }

  // 测试通过率图表配置
  const passRateChartOption = {
    title: {
      text: '测试通过率趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%',
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        data: [78, 82, 85, 88, 86, 90],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.6)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ],
          },
        },
        lineStyle: {
          color: '#1890ff',
        },
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  }

  // 缺陷分布图表配置
  const bugDistributionOption = {
    title: {
      text: '缺陷严重程度分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '缺陷分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { value: 5, name: '严重', itemStyle: { color: '#ff4d4f' } },
          { value: 12, name: '中等', itemStyle: { color: '#faad14' } },
          { value: 18, name: '轻微', itemStyle: { color: '#52c41a' } },
          { value: 10, name: '建议', itemStyle: { color: '#1890ff' } },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  // 获取活动类型图标
  const getActivityIcon = (type: string) => {
    const iconMap = {
      test_execution: <CheckCircleOutlined className="text-green-500" />,
      bug_report: <BugOutlined className="text-red-500" />,
      test_case_created: <FileTextOutlined className="text-blue-500" />,
      test_plan_updated: <ProjectOutlined className="text-purple-500" />,
    }
    return iconMap[type as keyof typeof iconMap] || <ClockCircleOutlined />
  }

  if (loading) {
    return <LoadingSpinner text="正在加载仪表板数据..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              仪表板概览
            </Title>
            <Text type="secondary" className="text-sm">
              查看您的测试项目概况和实时数据统计
            </Text>
          </div>
          <div className="text-right ml-4">
            <Text type="secondary" className="text-xs">
              最后更新: {new Date().toLocaleString()}
            </Text>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 space-y-6">

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="text-center gradient-bg-blue text-white">
              <Statistic
                title={<span className="text-white opacity-90">总测试用例</span>}
                value={currentStats.totalTestCases}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="text-center gradient-bg-green text-white">
              <Statistic
                title={<span className="text-white opacity-90">通过测试</span>}
                value={currentStats.passedTests}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card
              className="text-center text-white"
              style={{
                backgroundColor: '#ef4444 !important',
                borderColor: '#ef4444'
              }}
              styles={{
                body: {
                  backgroundColor: '#ef4444',
                  color: 'white'
                }
              }}
            >
              <Statistic
                title={<span className="text-white opacity-90">失败测试</span>}
                value={currentStats.failedTests}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="text-center gradient-bg-purple text-white">
              <Statistic
                title={<span className="text-white opacity-90">活跃项目</span>}
                value={currentStats.activeProjects}
                prefix={<ProjectOutlined />}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 进度指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="测试通过率" className="h-full">
            <div className="text-center mb-4">
              <Progress
                type="circle"
                percent={Math.round(currentStats.passRate)}
                size={120}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
            <Text type="secondary" className="block text-center">
              当前通过率: {currentStats.passRate.toFixed(1)}%
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="测试覆盖率" className="h-full">
            <div className="text-center mb-4">
              <Progress
                type="circle"
                percent={Math.round(currentStats.testCoverage)}
                size={120}
                strokeColor={{
                  '0%': '#ffa940',
                  '100%': '#fa541c',
                }}
              />
            </div>
            <Text type="secondary" className="block text-center">
              代码覆盖率: {currentStats.testCoverage.toFixed(1)}%
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={passRateChartOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={bugDistributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Card title="最近活动" extra={<a href="/activity">查看全部</a>}>
        <List
          dataSource={currentStats.recentActivity}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar icon={getActivityIcon(item.type)} className="bg-gray-100" />
                }
                title={
                  <div className="flex items-center justify-between">
                    <span>{item.title}</span>
                    <Text type="secondary" className="text-sm">
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                  </div>
                }
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
      </div>
    </div>
  )
}

export default Dashboard
