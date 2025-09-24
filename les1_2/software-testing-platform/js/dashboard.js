// 仪表盘类
class Dashboard {
    constructor() {
        this.stats = MockData.generateStats();
        this.charts = {};
    }

    // 渲染仪表盘
    render() {
        const pageContent = document.getElementById('dashboard-page');
        
        pageContent.innerHTML = `
            <!-- 欢迎区域 -->
            <div class="welcome-section" style="background: var(--gradient-primary); border-radius: var(--border-radius); padding: 2rem; margin-bottom: 2rem; color: white;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h2 style="margin: 0; font-size: 1.8rem;">欢迎回来，测试工程师！</h2>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">今天是 ${new Date().toLocaleDateString('zh-CN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            weekday: 'long'
                        })}</p>
                    </div>
                    <div style="font-size: 3rem; opacity: 0.7;">
                        <i class="fas fa-chart-line"></i>
                    </div>
                </div>
            </div>

            <!-- 核心统计指标 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">测试计划总数</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.stats.overview.totalTestPlans}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>活跃: ${this.stats.overview.activeTestPlans}</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">测试用例总数</span>
                        <div class="stat-icon" style="background: var(--gradient-secondary);">
                            <i class="fas fa-list-check"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.stats.overview.totalTestCases}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>已执行: ${this.stats.overview.executedCases}</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">缺陷总数</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-bug"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.stats.overview.totalDefects}</div>
                    <div class="stat-change ${this.stats.overview.openDefects > 5 ? 'negative' : 'positive'}">
                        <i class="fas ${this.stats.overview.openDefects > 5 ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                        <span>待处理: ${this.stats.overview.openDefects}</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">自动化率</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-robot"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.stats.overview.automationRate}%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+3.2%</span>
                    </div>
                </div>
            </div>

            <!-- 图表区域 -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <!-- 测试执行趋势图 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">测试执行趋势</h3>
                        <div class="header-actions">
                            <select class="form-select" onchange="dashboard.updateTrendChart(this.value)" style="width: 120px;">
                                <option value="7">近7天</option>
                                <option value="30">近30天</option>
                                <option value="90">近3个月</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body">
                        <canvas id="testTrendChart" width="600" height="300"></canvas>
                    </div>
                </div>

                <!-- 测试通过率分布 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">测试用例状态分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="testStatusChart" width="300" height="300"></canvas>
                        <div style="margin-top: 1rem;">
                            <div class="test-status-legend">
                                <div class="legend-item">
                                    <span class="legend-color" style="background: #10b981;"></span>
                                    <span>通过 ${this.stats.overview.passedCases}</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-color" style="background: #ef4444;"></span>
                                    <span>失败 ${this.stats.overview.failedCases}</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-color" style="background: #f59e0b;"></span>
                                    <span>阻塞 ${this.stats.overview.totalTestCases - this.stats.overview.executedCases}</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-color" style="background: #6b7280;"></span>
                                    <span>未执行 ${this.stats.overview.totalTestCases - this.stats.overview.executedCases}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 缺陷趋势和优先级分析 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <!-- 缺陷趋势图 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">缺陷处理趋势</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="defectTrendChart" width="400" height="250"></canvas>
                    </div>
                </div>

                <!-- 缺陷严重程度分布 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">缺陷严重程度分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="defectSeverityChart" width="400" height="250"></canvas>
                    </div>
                </div>
            </div>

            <!-- 最新动态和快速操作 -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
                <!-- 最新动态 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">最新动态</h3>
                        <a href="#" class="btn btn-sm btn-secondary" onclick="app.loadPage('reports')">查看更多</a>
                    </div>
                    <div class="card-body">
                        <div class="activity-timeline">
                            ${this.renderActivityTimeline()}
                        </div>
                    </div>
                </div>

                <!-- 快速操作 -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">快速操作</h3>
                    </div>
                    <div class="card-body">
                        <div class="quick-actions">
                            <button class="quick-action-btn" onclick="app.showModal('创建测试计划', '功能开发中...')">
                                <div class="action-icon" style="background: var(--gradient-primary);">
                                    <i class="fas fa-plus"></i>
                                </div>
                                <span>新建测试计划</span>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.showModal('执行测试用例', '功能开发中...')">
                                <div class="action-icon" style="background: var(--gradient-success);">
                                    <i class="fas fa-play"></i>
                                </div>
                                <span>执行测试</span>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.showModal('报告缺陷', '功能开发中...')">
                                <div class="action-icon" style="background: var(--gradient-danger);">
                                    <i class="fas fa-bug"></i>
                                </div>
                                <span>报告缺陷</span>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.showModal('生成报告', '功能开发中...')">
                                <div class="action-icon" style="background: var(--gradient-accent);">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <span>生成报告</span>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.showModal('自动化测试', '功能开发中...')">
                                <div class="action-icon" style="background: var(--gradient-warning);">
                                    <i class="fas fa-robot"></i>
                                </div>
                                <span>自动化测试</span>
                            </button>
                            
                            <button class="quick-action-btn" onclick="app.showModal('环境监控', '功能开发中...')">
                                <div class="action-icon" style="background: var(--gradient-secondary);">
                                    <i class="fas fa-server"></i>
                                </div>
                                <span>环境监控</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 待处理事项 -->
            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-header">
                    <h3 class="card-title">待处理事项</h3>
                    <span class="badge" style="background: var(--gradient-danger); color: white; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.8rem;">
                        ${this.getPendingTasksCount()} 项待处理
                    </span>
                </div>
                <div class="card-body">
                    ${this.renderPendingTasks()}
                </div>
            </div>
        `;

        // 添加样式
        this.addDashboardStyles();

        // 初始化图表
        setTimeout(() => {
            this.initCharts();
        }, 100);
    }

    // 渲染活动时间线
    renderActivityTimeline() {
        const activities = [
            {
                time: '10分钟前',
                type: 'success',
                icon: 'fa-check-circle',
                content: '测试计划 "电商平台核心功能测试" 执行完成',
                user: '张测试'
            },
            {
                time: '25分钟前',
                type: 'warning',
                icon: 'fa-bug',
                content: '发现新缺陷 "用户登录时出现500错误"',
                user: '李测试员'
            },
            {
                time: '1小时前',
                type: 'info',
                icon: 'fa-upload',
                content: '自动化测试套件已更新',
                user: '自动化团队'
            },
            {
                time: '2小时前',
                type: 'success',
                icon: 'fa-shield-alt',
                content: '安全扫描完成，发现 3 个中风险漏洞',
                user: '王安全测试'
            },
            {
                time: '3小时前',
                type: 'primary',
                icon: 'fa-chart-line',
                content: '性能测试报告已生成',
                user: '刘性能测试'
            }
        ];

        return activities.map(activity => `
            <div class="timeline-item">
                <div class="timeline-marker ${activity.type}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-time">${activity.time}</span>
                        <span class="timeline-user">${activity.user}</span>
                    </div>
                    <div class="timeline-text">${activity.content}</div>
                </div>
            </div>
        `).join('');
    }

    // 渲染待处理事项
    renderPendingTasks() {
        const pendingTasks = [
            {
                type: 'critical',
                icon: 'fa-exclamation-circle',
                title: '紧急缺陷需要修复',
                description: '3个高危缺陷等待开发团队处理',
                action: '查看详情',
                link: 'defects'
            },
            {
                type: 'warning',
                icon: 'fa-clock',
                title: '测试计划即将到期',
                description: '2个测试计划将在3天内到期',
                action: '查看计划',
                link: 'test-plans'
            },
            {
                type: 'info',
                icon: 'fa-list-check',
                title: '未执行的测试用例',
                description: '45个测试用例等待执行',
                action: '开始执行',
                link: 'test-execution'
            }
        ];

        return `
            <div class="pending-tasks-grid">
                ${pendingTasks.map(task => `
                    <div class="pending-task-card ${task.type}">
                        <div class="task-icon">
                            <i class="fas ${task.icon}"></i>
                        </div>
                        <div class="task-content">
                            <h4>${task.title}</h4>
                            <p>${task.description}</p>
                            <button class="btn btn-sm btn-primary" onclick="app.loadPage('${task.link}')">
                                ${task.action}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 获取待处理事项数量
    getPendingTasksCount() {
        return this.stats.overview.openDefects + 2 + 45; // 缺陷 + 过期计划 + 未执行用例
    }

    // 初始化所有图表
    initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js 未加载，跳过图表初始化');
            return;
        }

        this.initTestTrendChart();
        this.initTestStatusChart();
        this.initDefectTrendChart();
        this.initDefectSeverityChart();
    }

    // 初始化测试趋势图表
    initTestTrendChart() {
        const canvas = document.getElementById('testTrendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.testTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.stats.trends.testExecution.map(item => 
                    new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                ),
                datasets: [
                    {
                        label: '通过',
                        data: this.stats.trends.testExecution.map(item => item.passed),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: '失败',
                        data: this.stats.trends.testExecution.map(item => item.failed),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: '阻塞',
                        data: this.stats.trends.testExecution.map(item => item.blocked),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#f8fafc' }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: '#f8fafc',
                        bodyColor: '#f8fafc',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#cbd5e0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#cbd5e0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 初始化测试状态饼图
    initTestStatusChart() {
        const canvas = document.getElementById('testStatusChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const passed = this.stats.overview.passedCases;
        const failed = this.stats.overview.failedCases;
        const blocked = 8; // 示例数据
        const notExecuted = this.stats.overview.totalTestCases - this.stats.overview.executedCases;

        this.charts.testStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['通过', '失败', '阻塞', '未执行'],
                datasets: [{
                    data: [passed, failed, blocked, notExecuted],
                    backgroundColor: [
                        '#10b981',
                        '#ef4444',
                        '#f59e0b',
                        '#6b7280'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: '#f8fafc',
                        bodyColor: '#f8fafc'
                    }
                },
                cutout: '60%'
            }
        });
    }

    // 初始化缺陷趋势图
    initDefectTrendChart() {
        const canvas = document.getElementById('defectTrendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.defectTrend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.stats.trends.defectTrend.map(item => 
                    new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                ),
                datasets: [
                    {
                        label: '新增',
                        data: this.stats.trends.defectTrend.map(item => item.opened),
                        backgroundColor: '#ef4444',
                        maxBarThickness: 20
                    },
                    {
                        label: '已解决',
                        data: this.stats.trends.defectTrend.map(item => item.resolved),
                        backgroundColor: '#10b981',
                        maxBarThickness: 20
                    },
                    {
                        label: '已关闭',
                        data: this.stats.trends.defectTrend.map(item => item.closed),
                        backgroundColor: '#6b7280',
                        maxBarThickness: 20
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#f8fafc' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#cbd5e0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#cbd5e0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 初始化缺陷严重程度图
    initDefectSeverityChart() {
        const canvas = document.getElementById('defectSeverityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.defectSeverity = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['严重', '高级', '中等', '低级'],
                datasets: [{
                    data: [this.stats.overview.criticalDefects, 5, 12, 8],
                    backgroundColor: [
                        '#dc2626',
                        '#ef4444',
                        '#f59e0b',
                        '#10b981'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#f8fafc' }
                    }
                },
                scales: {
                    r: {
                        ticks: { color: '#cbd5e0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    // 更新趋势图表（时间范围切换）
    updateTrendChart(days) {
        // 这里可以根据天数重新获取数据并更新图表
        console.log(`更新趋势图表: ${days} 天`);
    }

    // 添加仪表盘特定样式
    addDashboardStyles() {
        if (document.getElementById('dashboard-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'dashboard-styles';
        styles.textContent = `
            .test-status-legend {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-top: 1rem;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.85rem;
            }

            .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                display: inline-block;
            }

            .activity-timeline {
                max-height: 400px;
                overflow-y: auto;
                padding-right: 0.5rem;
            }

            .timeline-item {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                position: relative;
            }

            .timeline-item:not(:last-child)::after {
                content: '';
                position: absolute;
                left: 20px;
                top: 40px;
                width: 2px;
                height: calc(100% + 0.5rem);
                background: rgba(255, 255, 255, 0.1);
            }

            .timeline-marker {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: white;
                font-size: 0.9rem;
            }

            .timeline-marker.success { background: #10b981; }
            .timeline-marker.warning { background: #f59e0b; }
            .timeline-marker.info { background: #3b82f6; }
            .timeline-marker.primary { background: #667eea; }

            .timeline-content {
                flex: 1;
                padding-top: 0.25rem;
            }

            .timeline-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.25rem;
            }

            .timeline-time {
                font-size: 0.8rem;
                color: var(--text-muted);
            }

            .timeline-user {
                font-size: 0.8rem;
                color: var(--text-secondary);
                background: rgba(255, 255, 255, 0.05);
                padding: 0.1rem 0.5rem;
                border-radius: 12px;
            }

            .timeline-text {
                color: var(--text-secondary);
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .quick-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .quick-action-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--border-radius);
                color: var(--text-primary);
                cursor: pointer;
                transition: var(--transition-fast);
                text-decoration: none;
                font-size: 0.85rem;
                text-align: center;
            }

            .quick-action-btn:hover {
                background: rgba(255, 255, 255, 0.05);
                transform: translateY(-2px);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .action-icon {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
            }

            .pending-tasks-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1rem;
            }

            .pending-task-card {
                display: flex;
                gap: 1rem;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--border-radius);
                transition: var(--transition-fast);
            }

            .pending-task-card:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .pending-task-card.critical {
                border-left: 4px solid #ef4444;
            }

            .pending-task-card.warning {
                border-left: 4px solid #f59e0b;
            }

            .pending-task-card.info {
                border-left: 4px solid #3b82f6;
            }

            .task-icon {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 1.2rem;
            }

            .pending-task-card.critical .task-icon {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }

            .pending-task-card.warning .task-icon {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
            }

            .pending-task-card.info .task-icon {
                background: rgba(59, 130, 246, 0.2);
                color: #3b82f6;
            }

            .task-content h4 {
                margin: 0 0 0.5rem 0;
                color: var(--text-primary);
                font-size: 1rem;
            }

            .task-content p {
                margin: 0 0 1rem 0;
                color: var(--text-secondary);
                font-size: 0.85rem;
                line-height: 1.4;
            }

            .badge {
                font-weight: 500;
                letter-spacing: 0.025em;
            }

            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: 1fr 1fr;
                }
                
                .quick-actions {
                    grid-template-columns: 1fr;
                }
                
                .pending-tasks-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// 全局仪表盘实例
window.dashboard = new Dashboard();