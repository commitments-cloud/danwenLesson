import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Space,
  Typography,
  Statistic,
  Table,
  Tag,
  Progress,
  Tabs,
  List,
  Avatar,
  Divider,
} from 'antd'
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  BarChartOutlined,
  TrophyOutlined,
  BugOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { TabPane } = Tabs

const TestReports: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ])
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [dateRange, selectedProject])

  const loadReportData = async () => {
    // 模拟加载报告数据
    setLoading(true)
    setTimeout(() => {
      setReportData({
        summary: {
          totalTests: 1245,
          passedTests: 1067,
          failedTests: 156,
          skippedTests: 22,
          passRate: 85.7,
          totalBugs: 89,
          criticalBugs: 12,
          testCoverage: 78.5,
          avgExecutionTime: 2.3,
        },
        trends: {
          dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'],
          passRate: [82, 84, 86, 85, 87, 86, 88],
          testCount: [120, 135, 142, 138, 156, 149, 163],
          bugCount: [15, 12, 18, 14, 16, 13, 11],
        },
        distribution: {
          byPriority: [
            { name: '低', value: 456, color: '#52c41a' },
            { name: '中', value: 523, color: '#faad14' },
            { name: '高', value: 234, color: '#ff7875' },
            { name: '紧急', value: 32, color: '#f50' },
          ],
          byModule: [
            { name: '用户管理', passed: 89, failed: 11, total: 100 },
            { name: '订单系统', passed: 156, failed: 24, total: 180 },
            { name: '支付模块', passed: 67, failed: 8, total: 75 },
            { name: '商品管理', passed: 234, failed: 16, total: 250 },
            { name: '库存管理', passed: 123, failed: 7, total: 130 },
          ],
        },
        topBugs: [
          {
            id: '1',
            title: '登录页面在IE浏览器下显示异常',
            severity: 'high',
            status: 'open',
            assignee: '张三',
            createdAt: '2024-01-15',
          },
          {
            id: '2',
            title: '订单提交后状态更新延迟',
            severity: 'medium',
            status: 'in_progress',
            assignee: '李四',
            createdAt: '2024-01-14',
          },
          {
            id: '3',
            title: '商品搜索结果排序错误',
            severity: 'low',
            status: 'resolved',
            assignee: '王五',
            createdAt: '2024-01-13',
          },
        ],
      })
      setLoading(false)
    }, 800)
  }

  // 导出报告
  const exportReport = (format: 'excel' | 'pdf') => {
    // 这里实现导出逻辑
    console.log(`导出${format}格式报告`)
  }

  // 通过率趋势图表配置
  const passRateTrendOption = {
    title: {
      text: '测试通过率趋势',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `${params[0].name}<br/>通过率: ${params[0].value}%`
      },
    },
    xAxis: {
      type: 'category',
      data: reportData?.trends.dates.map((date: string) => dayjs(date).format('MM-DD')),
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
        data: reportData?.trends.passRate,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.6)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ],
          },
        },
        lineStyle: { color: '#1890ff' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }

  // 测试分布饼图配置
  const distributionOption = {
    title: {
      text: '测试用例优先级分布',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '优先级分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: reportData?.distribution.byPriority,
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

  // 模块测试情况柱状图配置
  const moduleTestOption = {
    title: {
      text: '各模块测试情况',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['通过', '失败'],
      top: 30,
    },
    xAxis: {
      type: 'category',
      data: reportData?.distribution.byModule.map((item: any) => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '通过',
        type: 'bar',
        stack: 'total',
        data: reportData?.distribution.byModule.map((item: any) => item.passed),
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '失败',
        type: 'bar',
        stack: 'total',
        data: reportData?.distribution.byModule.map((item: any) => item.failed),
        itemStyle: { color: '#ff4d4f' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }

  if (loading || !reportData) {
    return <LoadingSpinner text="正在加载测试报告数据..." />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 页面标题 - 固定头部 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Title level={3} className="mb-2 text-gray-800">
              测试报告分析
            </Title>
            <Text type="secondary" className="text-sm">
              查看测试数据统计分析，支持多种格式报告导出
            </Text>
          </div>
          <Space className="ml-4">
            <Button
              icon={<FileExcelOutlined />}
              onClick={() => exportReport('excel')}
            >
              导出Excel
            </Button>
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => exportReport('pdf')}
            >
              导出PDF
            </Button>
          </Space>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 space-y-6">

      {/* 筛选条件 */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Text strong className="block mb-2">时间范围</Text>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Text strong className="block mb-2">项目</Text>
            <Select
              value={selectedProject}
              onChange={setSelectedProject}
              style={{ width: '100%' }}
            >
              <Option value="all">全部项目</Option>
              <Option value="1">电商平台测试</Option>
              <Option value="2">支付系统测试</Option>
              <Option value="3">用户管理系统</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 关键指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center gradient-bg-blue text-white">
              <Statistic
                title={<span className="text-white opacity-90">总测试数</span>}
                value={reportData.summary.totalTests}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center gradient-bg-green text-white">
              <Statistic
                title={<span className="text-white opacity-90">通过测试</span>}
                value={reportData.summary.passedTests}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
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
                value={reportData.summary.failedTests}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="text-center gradient-bg-purple text-white">
              <Statistic
                title={<span className="text-white opacity-90">通过率</span>}
                value={reportData.summary.passRate}
                precision={1}
                suffix="%"
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 详细指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="测试覆盖率" className="h-full">
            <div className="text-center">
              <Progress
                type="circle"
                percent={Math.round(reportData.summary.testCoverage)}
                size={120}
                strokeColor={{
                  '0%': '#ffa940',
                  '100%': '#fa541c',
                }}
              />
              <div className="mt-4">
                <Text type="secondary">
                  代码覆盖率: {reportData.summary.testCoverage}%
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="缺陷统计" className="h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text>总缺陷数</Text>
                <Text strong>{reportData.summary.totalBugs}</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>严重缺陷</Text>
                <Text strong className="text-red-500">
                  {reportData.summary.criticalBugs}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>平均执行时间</Text>
                <Text strong>{reportData.summary.avgExecutionTime}分钟</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="质量趋势" className="h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Text>本周通过率</Text>
                <div className="flex items-center">
                  <Text strong className="text-green-500 mr-2">↗ 2.3%</Text>
                  <Tag color="green">提升</Tag>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>缺陷修复率</Text>
                <div className="flex items-center">
                  <Text strong className="text-green-500 mr-2">↗ 5.1%</Text>
                  <Tag color="green">提升</Tag>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>测试效率</Text>
                <div className="flex items-center">
                  <Text strong className="text-red-500 mr-2">↘ 1.2%</Text>
                  <Tag color="red">下降</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={passRateTrendOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={distributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card>
            <ReactECharts option={moduleTestOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>

      {/* 详细数据标签页 */}
      <Card>
        <Tabs defaultActiveKey="bugs">
          <TabPane tab="重要缺陷" key="bugs">
            <List
              dataSource={reportData.topBugs}
              renderItem={(bug: any) => (
                <List.Item
                  actions={[
                    <Tag
                      color={
                        bug.severity === 'high' ? 'red' :
                        bug.severity === 'medium' ? 'orange' : 'green'
                      }
                    >
                      {bug.severity === 'high' ? '高' :
                       bug.severity === 'medium' ? '中' : '低'}
                    </Tag>,
                    <Tag
                      color={
                        bug.status === 'open' ? 'red' :
                        bug.status === 'in_progress' ? 'blue' : 'green'
                      }
                    >
                      {bug.status === 'open' ? '待处理' :
                       bug.status === 'in_progress' ? '处理中' : '已解决'}
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<BugOutlined />} />}
                    title={bug.title}
                    description={
                      <div>
                        <Text type="secondary">负责人: {bug.assignee}</Text>
                        <Divider type="vertical" />
                        <Text type="secondary">创建时间: {bug.createdAt}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
          
          <TabPane tab="模块详情" key="modules">
            <Table
              dataSource={reportData.distribution.byModule}
              columns={[
                {
                  title: '模块名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '总用例数',
                  dataIndex: 'total',
                  key: 'total',
                },
                {
                  title: '通过数',
                  dataIndex: 'passed',
                  key: 'passed',
                  render: (value: number) => (
                    <Text className="text-green-500">{value}</Text>
                  ),
                },
                {
                  title: '失败数',
                  dataIndex: 'failed',
                  key: 'failed',
                  render: (value: number) => (
                    <Text className="text-red-500">{value}</Text>
                  ),
                },
                {
                  title: '通过率',
                  key: 'passRate',
                  render: (_, record: any) => {
                    const rate = (record.passed / record.total) * 100
                    return (
                      <div className="flex items-center">
                        <Progress
                          percent={Math.round(rate)}
                          size="small"
                          className="mr-2"
                          style={{ width: 100 }}
                        />
                        <Text>{rate.toFixed(1)}%</Text>
                      </div>
                    )
                  },
                },
              ]}
              pagination={false}
            />
          </TabPane>
        </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default TestReports
