# 智能软件测试平台

一个现代化、功能齐全的软件测试智能平台前端框架，提供全方位的测试解决方案。

## ✨ 特性

### 🎯 核心功能
- **测试用例管理** - 创建、编辑、执行和管理测试用例
- **API测试** - 完整的API测试工具，支持多种HTTP方法和断言
- **性能测试** - 实时性能监控和负载测试
- **自动化测试** - 支持Selenium、Cypress、Playwright等框架
- **测试执行** - 手动和自动化测试执行管理
- **测试报告** - 丰富的图表和统计分析
- **AI助手** - 智能测试建议和问题分析
- **缺陷管理** - 完整的缺陷跟踪和管理流程

### 🎨 界面特色
- **现代化设计** - 基于Ant Design的精美UI
- **响应式布局** - 完美适配桌面和移动设备
- **动画效果** - 流畅的页面切换和交互动画
- **主题定制** - 支持浅色/深色主题切换
- **国际化** - 支持中英文切换

### 🛠️ 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design 5.x
- **样式方案**: Tailwind CSS
- **状态管理**: Zustand
- **路由管理**: React Router 6
- **动画库**: Framer Motion
- **图表库**: ECharts
- **代码编辑器**: Monaco Editor
- **HTTP客户端**: Axios
- **日期处理**: Day.js

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## 📁 项目结构

```
les1_/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   │   ├── index.ts       # API服务
│   │   └── mockData.ts    # 模拟数据
│   ├── components/        # 公共组件
│   │   ├── Common/        # 通用组件
│   │   └── Layout/        # 布局组件
│   ├── hooks/             # 自定义Hooks
│   ├── pages/             # 页面组件
│   │   ├── Dashboard/     # 仪表板
│   │   ├── TestCases/     # 测试用例管理
│   │   ├── TestExecution/ # 测试执行
│   │   ├── TestReports/   # 测试报告
│   │   ├── APITesting/    # API测试
│   │   ├── PerformanceTesting/ # 性能测试
│   │   ├── AutomationTesting/  # 自动化测试
│   │   ├── AIAssistant/   # AI助手
│   │   └── Settings/      # 系统设置
│   ├── store/             # 状态管理
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 应用主组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── index.html             # HTML模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── README.md              # 项目说明
```

## 🎯 功能模块

### 1. 仪表板 (Dashboard)
- 测试统计概览
- 实时数据图表
- 最近活动记录
- 关键指标监控

### 2. 测试用例管理 (Test Cases)
- 测试用例CRUD操作
- 批量操作支持
- 优先级和状态管理
- 测试步骤详细配置
- 标签分类管理

### 3. 测试执行 (Test Execution)
- 手动测试执行
- 批量测试执行
- 实时执行状态监控
- 测试结果记录
- 执行历史查看

### 4. API测试 (API Testing)
- HTTP请求配置
- 请求头和请求体编辑
- 响应结果展示
- 断言配置
- 环境变量管理

### 5. 性能测试 (Performance Testing)
- 负载测试配置
- 实时性能监控
- 性能指标图表
- 阈值告警
- 测试报告生成

### 6. 自动化测试 (Automation Testing)
- 测试脚本管理
- 多框架支持
- 定时任务配置
- 执行日志查看
- 结果统计分析

### 7. 测试报告 (Test Reports)
- 多维度数据分析
- 丰富的图表展示
- 报告导出功能
- 历史趋势分析
- 自定义报告配置

### 8. AI助手 (AI Assistant)
- 智能测试建议
- 问题分析诊断
- 测试用例生成
- 性能优化建议
- 自然语言交互

### 9. 系统设置 (Settings)
- 个人信息管理
- 系统参数配置
- 环境配置管理
- 通知设置
- 安全设置

## 🔧 开发指南

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件采用函数式组件 + Hooks

### 状态管理
使用Zustand进行状态管理，主要包括：
- 用户状态 (useUserStore)
- 项目状态 (useProjectStore)
- 应用状态 (useAppStore)
- 通知状态 (useNotificationStore)
- 测试执行状态 (useTestExecutionStore)

### API接口
所有API接口统一在 `src/api/index.ts` 中管理，支持：
- 请求/响应拦截器
- 错误处理
- 认证token管理
- 类型安全

### 样式方案
- 使用Tailwind CSS进行样式开发
- Ant Design提供基础组件
- 支持主题定制
- 响应式设计

## 🎨 UI组件

### 布局组件
- MainLayout: 主布局组件
- NotificationPanel: 通知面板

### 业务组件
- TestCaseForm: 测试用例表单
- APITestPanel: API测试面板
- PerformanceChart: 性能图表
- TestExecutionModal: 测试执行模态框

## 📊 数据模拟

项目包含完整的模拟数据，位于 `src/api/mockData.ts`：
- 用户数据
- 项目数据
- 测试用例数据
- API测试数据
- 性能测试数据
- 自动化测试数据
- 缺陷数据
- 报告数据

## 🔒 安全特性

- JWT token认证
- 路由权限控制
- XSS防护
- CSRF防护
- 安全的文件上传

## 📱 响应式设计

完美支持各种设备：
- 桌面端 (≥1200px)
- 平板端 (768px-1199px)
- 手机端 (<768px)

## 🌐 浏览器支持

- Chrome ≥ 88
- Firefox ≥ 78
- Safari ≥ 14
- Edge ≥ 88

## 📝 更新日志

### v1.0.0 (2024-01-20)
- 🎉 初始版本发布
- ✨ 完整的测试管理功能
- 🎨 现代化UI设计
- 🚀 高性能架构

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 团队

- **项目负责人**: AI Assistant
- **前端开发**: AI Assistant
- **UI设计**: AI Assistant

## 📞 联系我们

如有问题或建议，请通过以下方式联系：
- 邮箱: support@testing-platform.com
- 官网: https://testing-platform.com
- 文档: https://docs.testing-platform.com

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！
