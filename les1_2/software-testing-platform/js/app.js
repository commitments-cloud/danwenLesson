// 主应用程序类
class TestPlatformApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isSidebarCollapsed = false;
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.loadPage('dashboard');
        this.updateNavigation();
    }

    // 绑定事件
    bindEvents() {
        // 侧边栏切换
        document.getElementById('toggleBtn').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // 导航菜单点击
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.loadPage(page);
            });
        });

        // 全局搜索
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // 模态框关闭
        document.getElementById('modalClose').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modalCancel').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });

        // 响应式菜单处理
        this.handleResponsive();
    }

    // 切换侧边栏
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        
        if (this.isSidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }

    // 加载页面
    loadPage(page) {
        // 隐藏所有页面
        document.querySelectorAll('.page-content').forEach(pageContent => {
            pageContent.classList.add('hidden');
        });

        // 显示目标页面
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            this.currentPage = page;
            this.updatePageTitle(page);
            this.updateBreadcrumb(page);
            this.updateNavigation();
            this.loadPageContent(page);
        }
    }

    // 更新页面标题
    updatePageTitle(page) {
        const titles = {
            'dashboard': '仪表盘',
            'test-plans': '测试计划',
            'test-cases': '测试用例',
            'test-execution': '测试执行',
            'defects': '缺陷管理',
            'reports': '测试报告',
            'automation': '自动化测试',
            'performance': '性能测试',
            'security': '安全测试',
            'api-testing': 'API测试',
            'test-data': '测试数据',
            'settings': '系统设置'
        };

        const titleElement = document.getElementById('pageTitle');
        titleElement.textContent = titles[page] || '未知页面';
    }

    // 更新面包屑导航
    updateBreadcrumb(page) {
        const breadcrumbs = {
            'dashboard': '首页 / 仪表盘',
            'test-plans': '首页 / 测试管理 / 测试计划',
            'test-cases': '首页 / 测试管理 / 测试用例',
            'test-execution': '首页 / 测试管理 / 测试执行',
            'defects': '首页 / 质量管理 / 缺陷管理',
            'reports': '首页 / 报告分析 / 测试报告',
            'automation': '首页 / 自动化 / 自动化测试',
            'performance': '首页 / 专项测试 / 性能测试',
            'security': '首页 / 专项测试 / 安全测试',
            'api-testing': '首页 / 专项测试 / API测试',
            'test-data': '首页 / 数据管理 / 测试数据',
            'settings': '首页 / 系统管理 / 系统设置'
        };

        const breadcrumbElement = document.getElementById('breadcrumbItem');
        breadcrumbElement.textContent = breadcrumbs[page] || '首页';
    }

    // 更新导航菜单激活状态
    updateNavigation() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeMenuItem = document.querySelector(`[data-page="${this.currentPage}"]`)?.closest('.menu-item');
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }
    }

    // 加载页面内容
    loadPageContent(page) {
        switch (page) {
            case 'dashboard':
                if (typeof Dashboard !== 'undefined') {
                    new Dashboard().render();
                }
                break;
            case 'test-plans':
                if (typeof TestPlanManager !== 'undefined') {
                    new TestPlanManager().render();
                }
                break;
            case 'test-cases':
                if (typeof TestCaseManager !== 'undefined') {
                    new TestCaseManager().render();
                }
                break;
            case 'defects':
                if (typeof DefectManager !== 'undefined') {
                    new DefectManager().render();
                }
                break;
            case 'automation':
                this.renderAutomationPage();
                break;
            case 'performance':
                this.renderPerformancePage();
                break;
            case 'security':
                this.renderSecurityPage();
                break;
            case 'api-testing':
                this.renderApiTestingPage();
                break;
            case 'test-execution':
                this.renderTestExecutionPage();
                break;
            case 'reports':
                this.renderReportsPage();
                break;
            case 'test-data':
                this.renderTestDataPage();
                break;
            case 'settings':
                this.renderSettingsPage();
                break;
            default:
                this.renderDefaultPage(page);
        }
    }

    // 渲染自动化测试页面
    renderAutomationPage() {
        const pageContent = document.getElementById('automation-page');
        const automationTests = MockData.automationTests;
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.createAutomationTest()">
                        <i class="fas fa-plus"></i>新建自动化测试
                    </button>
                    <button class="btn btn-secondary" onclick="app.runAllAutomationTests()">
                        <i class="fas fa-play"></i>运行所有测试
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">总测试套件</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-robot"></i>
                        </div>
                    </div>
                    <div class="stat-number">${automationTests.length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>活跃: ${automationTests.filter(t => t.status === 'active').length}</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">平均通过率</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">${Math.round(automationTests.reduce((sum, test) => sum + test.passRate, 0) / automationTests.length)}%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>较上周 +2.3%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">执行次数</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="stat-number">${automationTests.reduce((sum, test) => sum + test.passed + test.failed + test.skipped, 0)}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>本周</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">自动化测试套件</h3>
                    <div class="filter-controls">
                        <select class="form-select" onchange="app.filterAutomationTests(this.value)">
                            <option value="">所有状态</option>
                            <option value="active">活跃</option>
                            <option value="inactive">未激活</option>
                            <option value="maintenance">维护中</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>测试套件</th>
                                    <th>框架</th>
                                    <th>状态</th>
                                    <th>最后运行</th>
                                    <th>通过率</th>
                                    <th>执行结果</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${automationTests.map(test => `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 500; color: var(--text-primary);">${test.name}</div>
                                            <div style="font-size: 0.8rem; color: var(--text-muted);">${test.description}</div>
                                        </td>
                                        <td>${test.framework} (${test.language})</td>
                                        <td>
                                            <span class="status-badge ${test.status === 'active' ? 'success' : test.status === 'inactive' ? 'secondary' : 'warning'}">
                                                ${test.status === 'active' ? '活跃' : test.status === 'inactive' ? '未激活' : '维护中'}
                                            </span>
                                        </td>
                                        <td>${test.lastRun}</td>
                                        <td>
                                            <div class="progress" style="width: 100px;">
                                                <div class="progress-bar ${test.passRate >= 90 ? 'success' : test.passRate >= 70 ? '' : 'danger'}" 
                                                     style="width: ${test.passRate}%"></div>
                                            </div>
                                            <span style="font-size: 0.8rem;">${test.passRate}%</span>
                                        </td>
                                        <td>
                                            <span style="color: #10b981;">通过: ${test.passed}</span> |
                                            <span style="color: #ef4444;">失败: ${test.failed}</span> |
                                            <span style="color: #f59e0b;">跳过: ${test.skipped}</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="app.runAutomationTest('${test.id}')">
                                                <i class="fas fa-play"></i>
                                            </button>
                                            <button class="btn btn-sm btn-secondary" onclick="app.viewAutomationTestDetails('${test.id}')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-sm btn-secondary" onclick="app.editAutomationTest('${test.id}')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染性能测试页面
    renderPerformancePage() {
        const pageContent = document.getElementById('performance-page');
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.createPerformanceTest()">
                        <i class="fas fa-plus"></i>新建性能测试
                    </button>
                    <button class="btn btn-secondary" onclick="app.runPerformanceTest()">
                        <i class="fas fa-tachometer-alt"></i>开始压力测试
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">平均响应时间</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-number">285ms</div>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-down"></i>
                        <span>-12ms</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">最大并发数</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <div class="stat-number">1,250</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+150</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">吞吐量</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                    </div>
                    <div class="stat-number">4,523</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>请求/分钟</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">错误率</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <div class="stat-number">0.02%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-down"></i>
                        <span>-0.01%</span>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">响应时间趋势</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="responseTimeChart" width="400" height="200"></canvas>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">系统资源监控</h3>
                    </div>
                    <div class="card-body">
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>CPU使用率</span>
                                <span>68%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" style="width: 68%;"></div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>内存使用率</span>
                                <span>74%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar warning" style="width: 74%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>磁盘I/O</span>
                                <span>45%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar success" style="width: 45%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">性能测试场景</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>测试场景</th>
                                    <th>并发用户</th>
                                    <th>持续时间</th>
                                    <th>平均响应时间</th>
                                    <th>95%响应时间</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>用户登录压力测试</td>
                                    <td>500</td>
                                    <td>10分钟</td>
                                    <td>245ms</td>
                                    <td>512ms</td>
                                    <td><span class="status-badge success">通过</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="app.runPerformanceScenario('login')">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <button class="btn btn-sm btn-secondary" onclick="app.viewPerformanceReport('login')">
                                            <i class="fas fa-chart-line"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>商品搜索负载测试</td>
                                    <td>1000</td>
                                    <td>15分钟</td>
                                    <td>186ms</td>
                                    <td>389ms</td>
                                    <td><span class="status-badge success">通过</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <button class="btn btn-sm btn-secondary">
                                            <i class="fas fa-chart-line"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>订单处理峰值测试</td>
                                    <td>1500</td>
                                    <td>20分钟</td>
                                    <td>421ms</td>
                                    <td>892ms</td>
                                    <td><span class="status-badge warning">警告</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <button class="btn btn-sm btn-secondary">
                                            <i class="fas fa-chart-line"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // 绘制响应时间图表
        this.renderResponseTimeChart();
    }

    // 渲染安全测试页面
    renderSecurityPage() {
        const pageContent = document.getElementById('security-page');
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.startSecurityScan()">
                        <i class="fas fa-shield-alt"></i>开始安全扫描
                    </button>
                    <button class="btn btn-secondary" onclick="app.generateSecurityReport()">
                        <i class="fas fa-file-shield"></i>生成报告
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">安全评分</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-shield-check"></i>
                        </div>
                    </div>
                    <div class="stat-number">85</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+3</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">高风险漏洞</span>
                        <div class="stat-icon" style="background: var(--gradient-danger);">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">3</div>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-down"></i>
                        <span>-2</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">中风险漏洞</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                    </div>
                    <div class="stat-number">7</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-down"></i>
                        <span>-3</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">扫描覆盖率</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                    <div class="stat-number">94%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+2%</span>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">漏洞类型分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="vulnerabilityChart" width="400" height="300"></canvas>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">安全测试项目</h3>
                    </div>
                    <div class="card-body">
                        <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 4px solid #10b981;">
                            <div style="font-weight: 500; color: #10b981;">✓ SQL注入检测</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">已完成 - 无漏洞发现</div>
                        </div>
                        <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <div style="font-weight: 500; color: #f59e0b;">⚠ XSS漏洞扫描</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">发现2个中等风险漏洞</div>
                        </div>
                        <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 4px solid #10b981;">
                            <div style="font-weight: 500; color: #10b981;">✓ CSRF防护检测</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">已完成 - 防护措施有效</div>
                        </div>
                        <div style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border-left: 4px solid #ef4444;">
                            <div style="font-weight: 500; color: #ef4444;">✗ 权限提升检测</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">发现1个高风险漏洞</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">安全漏洞列表</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>漏洞名称</th>
                                    <th>风险等级</th>
                                    <th>影响模块</th>
                                    <th>CVSS评分</th>
                                    <th>发现时间</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>未授权访问漏洞</td>
                                    <td><span class="status-badge danger">高风险</span></td>
                                    <td>用户管理模块</td>
                                    <td>7.5</td>
                                    <td>2024-01-25</td>
                                    <td><span class="status-badge warning">待修复</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary">详情</button>
                                        <button class="btn btn-sm btn-secondary">修复</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>反射型XSS漏洞</td>
                                    <td><span class="status-badge warning">中风险</span></td>
                                    <td>搜索功能</td>
                                    <td>5.4</td>
                                    <td>2024-01-24</td>
                                    <td><span class="status-badge success">已修复</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary">详情</button>
                                        <button class="btn btn-sm btn-success">验证</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>敏感信息泄露</td>
                                    <td><span class="status-badge warning">中风险</span></td>
                                    <td>API接口</td>
                                    <td>4.3</td>
                                    <td>2024-01-23</td>
                                    <td><span class="status-badge info">修复中</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary">详情</button>
                                        <button class="btn btn-sm btn-secondary">跟进</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // 绘制漏洞分布图表
        this.renderVulnerabilityChart();
    }

    // 处理全局搜索
    handleGlobalSearch(query) {
        if (query.length < 2) return;
        
        // 这里可以实现搜索逻辑
        console.log('搜索:', query);
    }

    // 显示模态框
    showModal(title, content, confirmCallback = null) {
        const modal = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const confirmBtn = document.getElementById('modalConfirm');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        
        if (confirmCallback) {
            confirmBtn.onclick = confirmCallback;
        }
        
        modal.classList.add('show');
    }

    // 隐藏模态框
    hideModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('show');
    }

    // 显示加载状态
    showLoading() {
        const loading = document.getElementById('loadingOverlay');
        loading.classList.add('show');
    }

    // 隐藏加载状态
    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        loading.classList.remove('show');
    }

    // 响应式处理
    handleResponsive() {
        const handleResize = () => {
            const sidebar = document.getElementById('sidebar');
            const width = window.innerWidth;
            
            if (width <= 1024) {
                sidebar.classList.remove('collapsed');
                this.isSidebarCollapsed = false;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 初始检查
    }

    // 渲染API测试页面
    renderApiTestingPage() {
        const pageContent = document.getElementById('api-testing-page');
        const apiTests = [
            { id: 'API001', name: '用户登录接口', method: 'POST', url: '/api/auth/login', status: 'passed', responseTime: '245ms', lastRun: '2024-01-26 10:30' },
            { id: 'API002', name: '用户信息查询', method: 'GET', url: '/api/user/profile', status: 'passed', responseTime: '156ms', lastRun: '2024-01-26 10:25' },
            { id: 'API003', name: '商品列表接口', method: 'GET', url: '/api/products', status: 'failed', responseTime: '2.3s', lastRun: '2024-01-26 10:20' },
            { id: 'API004', name: '创建订单接口', method: 'POST', url: '/api/orders', status: 'passed', responseTime: '423ms', lastRun: '2024-01-26 10:15' },
            { id: 'API005', name: '支付接口', method: 'POST', url: '/api/payment', status: 'blocked', responseTime: 'N/A', lastRun: '2024-01-25 16:30' },
            { id: 'API006', name: '文件上传接口', method: 'POST', url: '/api/upload', status: 'passed', responseTime: '1.2s', lastRun: '2024-01-26 09:45' },
            { id: 'API007', name: '删除商品接口', method: 'DELETE', url: '/api/products/{id}', status: 'passed', responseTime: '189ms', lastRun: '2024-01-26 09:30' },
            { id: 'API008', name: '用户注册接口', method: 'POST', url: '/api/auth/register', status: 'failed', responseTime: '500ms', lastRun: '2024-01-26 09:00' },
            { id: 'API009', name: '订单查询接口', method: 'GET', url: '/api/orders/{id}', status: 'passed', responseTime: '234ms', lastRun: '2024-01-26 08:45' },
            { id: 'API010', name: '密码重置接口', method: 'POST', url: '/api/auth/reset', status: 'passed', responseTime: '345ms', lastRun: '2024-01-26 08:30' }
        ];
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.showModal('新建API测试', '功能开发中...')">
                        <i class="fas fa-plus"></i>新建测试
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('批量测试', '功能开发中...')">
                        <i class="fas fa-play"></i>批量测试
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('导入Postman', '功能开发中...')">
                        <i class="fas fa-upload"></i>导入Postman
                    </button>
                    <button class="btn btn-secondary" onclick="app.exportApiTestData()">
                        <i class="fas fa-download"></i>导出数据
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">API总数</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                    </div>
                    <div class="stat-number">${apiTests.length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>通过率 ${Math.round((apiTests.filter(t => t.status === 'passed').length / apiTests.length) * 100)}%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">平均响应时间</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-number">387ms</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-down"></i>
                        <span>-23ms</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">失败接口</span>
                        <div class="stat-icon" style="background: var(--gradient-danger);">
                            <i class="fas fa-times-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">${apiTests.filter(t => t.status === 'failed').length}</div>
                    <div class="stat-change negative">
                        <i class="fas fa-exclamation"></i>
                        <span>需修复</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">测试覆盖率</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                    </div>
                    <div class="stat-number">85%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+5%</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">API测试列表</h3>
                    <div class="search-filter-controls" style="display: flex; gap: 1rem; align-items: center;">
                        <div class="search-box-inline" style="position: relative;">
                            <i class="fas fa-search" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                            <input type="text" id="apiTestSearch" placeholder="搜索API测试..."
                                   style="padding: 0.5rem 0.75rem 0.5rem 2.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: var(--text-primary); width: 250px;"
                                   oninput="app.filterApiTests()" />
                        </div>
                        <select id="apiMethodFilter" class="form-select" style="width: 120px;" onchange="app.filterApiTests()">
                            <option value="">所有方法</option>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                        <select id="apiStatusFilter" class="form-select" style="width: 120px;" onchange="app.filterApiTests()">
                            <option value="">所有状态</option>
                            <option value="passed">通过</option>
                            <option value="failed">失败</option>
                            <option value="blocked">阻塞</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>接口名称</th>
                                    <th>请求方法</th>
                                    <th>接口地址</th>
                                    <th>状态</th>
                                    <th>响应时间</th>
                                    <th>最后执行</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="apiTestsTableBody">
                                ${this.renderApiTestRows(apiTests)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- API测试数据可视化 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">API测试结果分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="apiTestResultChart" width="400" height="300"></canvas>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">API响应时间趋势</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="apiResponseTimeChart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        // 渲染API测试图表
        this.renderApiTestCharts(apiTests);
    }
    
    // 渲染API测试图表
    renderApiTestCharts(apiTests) {
        setTimeout(() => {
            // API测试结果分布图
            const resultCanvas = document.getElementById('apiTestResultChart');
            if (resultCanvas && typeof Chart !== 'undefined') {
                const resultCtx = resultCanvas.getContext('2d');
                const passedCount = apiTests.filter(api => api.status === 'passed').length;
                const failedCount = apiTests.filter(api => api.status === 'failed').length;
                const blockedCount = apiTests.filter(api => api.status === 'blocked').length;
                
                new Chart(resultCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['通过', '失败', '阻塞'],
                        datasets: [{
                            data: [passedCount, failedCount, blockedCount],
                            backgroundColor: [
                                '#10b981', // 通过 - 绿色
                                '#ef4444', // 失败 - 红色
                                '#f59e0b'  // 阻塞 - 橙色
                            ],
                            borderColor: '#1e293b',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { 
                                    color: '#f8fafc',
                                    padding: 20,
                                    font: { size: 12 }
                                }
                            },
                            tooltip: {
                                backgroundColor: '#1e293b',
                                titleColor: '#f8fafc',
                                bodyColor: '#f8fafc',
                                borderColor: '#374151',
                                borderWidth: 1
                            }
                        }
                    }
                });
            }
            
            // API响应时间趋势图
            const responseCanvas = document.getElementById('apiResponseTimeChart');
            if (responseCanvas && typeof Chart !== 'undefined') {
                const responseCtx = responseCanvas.getContext('2d');
                new Chart(responseCtx, {
                    type: 'line',
                    data: {
                        labels: ['登录接口', '用户信息', '商品列表', '创建订单', '文件上传', '删除商品', '订单查询', '密码重置'],
                        datasets: [{
                            label: '响应时间 (ms)',
                            data: [245, 156, 423, 189, 1200, 234, 345, 500],
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#667eea',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#f8fafc' }
                            }
                        },
                        scales: {
                            x: { 
                                ticks: { 
                                    color: '#f8fafc',
                                    maxRotation: 45
                                },
                                grid: { color: 'rgba(255, 255, 255, 0.1)' }
                            },
                            y: { 
                                ticks: { color: '#f8fafc' },
                                grid: { color: 'rgba(255, 255, 255, 0.1)' }
                            }
                        }
                    }
                });
            }
        }, 100);
    }
    
    // 渲染API测试表格行
    renderApiTestRows(apiTests) {
        return apiTests.map(api => `
            <tr>
                <td>
                    <div style="font-weight: 500; color: var(--text-primary);">${api.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${api.id}</div>
                </td>
                <td>
                    <span class="method-badge ${api.method.toLowerCase()}">${api.method}</span>
                </td>
                <td>
                    <code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${api.url}</code>
                </td>
                <td>
                    <span class="status-badge ${api.status === 'passed' ? 'success' : api.status === 'failed' ? 'danger' : 'warning'}">
                        ${api.status === 'passed' ? '通过' : api.status === 'failed' ? '失败' : '阻塞'}
                    </span>
                </td>
                <td>${api.responseTime}</td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${api.lastRun}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="app.showModal('执行测试', '正在执行API测试...')">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="app.showModal('查看详情', 'API测试详情...')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // API测试筛选功能
    filterApiTests() {
        const searchTerm = document.getElementById('apiTestSearch')?.value.toLowerCase() || '';
        const methodFilter = document.getElementById('apiMethodFilter')?.value || '';
        const statusFilter = document.getElementById('apiStatusFilter')?.value || '';
        
        const apiTests = [
            { id: 'API001', name: '用户登录接口', method: 'POST', url: '/api/auth/login', status: 'passed', responseTime: '245ms', lastRun: '2024-01-26 10:30' },
            { id: 'API002', name: '用户信息查询', method: 'GET', url: '/api/user/profile', status: 'passed', responseTime: '156ms', lastRun: '2024-01-26 10:25' },
            { id: 'API003', name: '商品列表接口', method: 'GET', url: '/api/products', status: 'failed', responseTime: '2.3s', lastRun: '2024-01-26 10:20' },
            { id: 'API004', name: '创建订单接口', method: 'POST', url: '/api/orders', status: 'passed', responseTime: '423ms', lastRun: '2024-01-26 10:15' },
            { id: 'API005', name: '支付接口', method: 'POST', url: '/api/payment', status: 'blocked', responseTime: 'N/A', lastRun: '2024-01-25 16:30' },
            { id: 'API006', name: '文件上传接口', method: 'POST', url: '/api/upload', status: 'passed', responseTime: '1.2s', lastRun: '2024-01-26 09:45' },
            { id: 'API007', name: '删除商品接口', method: 'DELETE', url: '/api/products/{id}', status: 'passed', responseTime: '189ms', lastRun: '2024-01-26 09:30' },
            { id: 'API008', name: '用户注册接口', method: 'POST', url: '/api/auth/register', status: 'failed', responseTime: '500ms', lastRun: '2024-01-26 09:00' },
            { id: 'API009', name: '订单查询接口', method: 'GET', url: '/api/orders/{id}', status: 'passed', responseTime: '234ms', lastRun: '2024-01-26 08:45' },
            { id: 'API010', name: '密码重置接口', method: 'POST', url: '/api/auth/reset', status: 'passed', responseTime: '345ms', lastRun: '2024-01-26 08:30' }
        ];
        
        const filtered = apiTests.filter(api => {
            const matchesSearch = !searchTerm || 
                api.name.toLowerCase().includes(searchTerm) ||
                api.id.toLowerCase().includes(searchTerm) ||
                api.url.toLowerCase().includes(searchTerm);
                
            const matchesMethod = !methodFilter || api.method === methodFilter;
            const matchesStatus = !statusFilter || api.status === statusFilter;
            
            return matchesSearch && matchesMethod && matchesStatus;
        });
        
        const tbody = document.getElementById('apiTestsTableBody');
        if (tbody) {
            tbody.innerHTML = this.renderApiTestRows(filtered);
        }
    }
    
    // 通用数据导出功能
    exportData(data, filename, type = 'csv') {
        if (type === 'csv') {
            this.exportToCSV(data, filename);
        } else if (type === 'json') {
            this.exportToJSON(data, filename);
        }
    }
    
    // 导出为CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            this.showModal('导出失败', '没有数据可导出');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    // 处理含有逗号或换行符的字段
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');
        
        this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
        this.showModal('导出成功', `数据已导出为 ${filename}.csv`);
    }
    
    // 导出为JSON
    exportToJSON(data, filename) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
        this.showModal('导出成功', `数据已导出为 ${filename}.json`);
    }
    
    // 下载文件
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
    
    // 导出API测试数据
    exportApiTestData() {
        const apiTests = [
            { id: 'API001', name: '用户登录接口', method: 'POST', url: '/api/auth/login', status: '通过', responseTime: '245ms', lastRun: '2024-01-26 10:30' },
            { id: 'API002', name: '用户信息查询', method: 'GET', url: '/api/user/profile', status: '通过', responseTime: '156ms', lastRun: '2024-01-26 10:25' },
            { id: 'API003', name: '商品列表接口', method: 'GET', url: '/api/products', status: '失败', responseTime: '2.3s', lastRun: '2024-01-26 10:20' },
            { id: 'API004', name: '创建订单接口', method: 'POST', url: '/api/orders', status: '通过', responseTime: '423ms', lastRun: '2024-01-26 10:15' },
            { id: 'API005', name: '支付接口', method: 'POST', url: '/api/payment', status: '阻塞', responseTime: 'N/A', lastRun: '2024-01-25 16:30' }
        ];
        this.exportData(apiTests, 'API测试数据', 'csv');
    }
    
    // 表格排序功能
    sortTable(tableId, columnIndex, sortType = 'string') {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        const sortDirection = table.getAttribute('data-sort-direction') || 'asc';
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        
        rows.sort((a, b) => {
            const aValue = a.children[columnIndex].textContent.trim();
            const bValue = b.children[columnIndex].textContent.trim();
            
            let comparison = 0;
            
            if (sortType === 'number') {
                const aNum = parseFloat(aValue.replace(/[^\d.-]/g, ''));
                const bNum = parseFloat(bValue.replace(/[^\d.-]/g, ''));
                comparison = aNum - bNum;
            } else if (sortType === 'date') {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                comparison = aDate - bDate;
            } else {
                comparison = aValue.localeCompare(bValue);
            }
            
            return newDirection === 'asc' ? comparison : -comparison;
        });
        
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
        
        table.setAttribute('data-sort-direction', newDirection);
        
        // 更新排序指示器
        table.querySelectorAll('th').forEach((th, index) => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (index === columnIndex) {
                th.classList.add(`sort-${newDirection}`);
            }
        });
    }
    
    // 获取表格数据（用于分页）
    getTableData(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return [];
        
        const rows = table.querySelectorAll('tbody tr');
        return Array.from(rows).map(row => {
            return Array.from(row.children).map(cell => cell.textContent.trim());
        });
    }
    
    // 简单分页功能
    paginateTable(tableId, pageSize = 10) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const totalPages = Math.ceil(rows.length / pageSize);
        
        let currentPage = 1;
        
        const showPage = (page) => {
            rows.forEach((row, index) => {
                const shouldShow = index >= (page - 1) * pageSize && index < page * pageSize;
                row.style.display = shouldShow ? '' : 'none';
            });
        };
        
        // 初始显示第一页
        showPage(currentPage);
        
        // 创建分页控制器
        const paginationContainer = table.parentElement.querySelector('.pagination-container');
        if (paginationContainer) {
            paginationContainer.innerHTML = `
                <div class="pagination-info">
                    显示 ${Math.min(pageSize, rows.length)} / ${rows.length} 条记录
                </div>
                <div class="pagination-controls">
                    <button class="btn btn-sm btn-secondary" onclick="app.changePage('${tableId}', -1)" 
                            ${currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="page-info">${currentPage} / ${totalPages}</span>
                    <button class="btn btn-sm btn-secondary" onclick="app.changePage('${tableId}', 1)"
                            ${currentPage === totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
        }
        
        // 存储分页信息
        table.setAttribute('data-current-page', currentPage);
        table.setAttribute('data-total-pages', totalPages);
        table.setAttribute('data-page-size', pageSize);
    }
    
    // 切换页面
    changePage(tableId, direction) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const currentPage = parseInt(table.getAttribute('data-current-page'));
        const totalPages = parseInt(table.getAttribute('data-total-pages'));
        const pageSize = parseInt(table.getAttribute('data-page-size'));
        
        const newPage = Math.max(1, Math.min(totalPages, currentPage + direction));
        
        if (newPage !== currentPage) {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.forEach((row, index) => {
                const shouldShow = index >= (newPage - 1) * pageSize && index < newPage * pageSize;
                row.style.display = shouldShow ? '' : 'none';
            });
            
            table.setAttribute('data-current-page', newPage);
            
            // 更新分页控制器
            this.paginateTable(tableId, pageSize);
        }
    }

    // 渲染测试执行页面
    renderTestExecutionPage() {
        const pageContent = document.getElementById('test-execution-page');
        const executions = MockData.testExecutions;
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.showModal('开始执行', '功能开发中...')">
                        <i class="fas fa-play"></i>开始执行
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('调度任务', '功能开发中...')">
                        <i class="fas fa-calendar"></i>调度任务
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('执行历史', '功能开发中...')">
                        <i class="fas fa-history"></i>执行历史
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">今日执行</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="stat-number">${executions.filter(e => e.executionDate === '2024-01-26').length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+3</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">通过率</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                    <div class="stat-number">${Math.round((executions.filter(e => e.status === 'passed').length / executions.length) * 100)}%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+5%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">平均耗时</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-number">4m 12s</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-down"></i>
                        <span>-30s</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">执行队列</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-list"></i>
                        </div>
                    </div>
                    <div class="stat-number">5</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>待执行</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">最近执行记录</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>测试用例</th>
                                    <th>执行人</th>
                                    <th>执行时间</th>
                                    <th>状态</th>
                                    <th>耗时</th>
                                    <th>环境</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${executions.map(exec => `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 500; color: var(--text-primary);">${exec.testCase}</div>
                                        </td>
                                        <td>${exec.executedBy}</td>
                                        <td>${exec.executionDate} ${exec.executionTime}</td>
                                        <td>
                                            <span class="status-badge ${exec.status === 'passed' ? 'success' : exec.status === 'failed' ? 'danger' : exec.status === 'blocked' ? 'warning' : 'secondary'}">
                                                ${exec.status === 'passed' ? '通过' : exec.status === 'failed' ? '失败' : exec.status === 'blocked' ? '阻塞' : '未执行'}
                                            </span>
                                        </td>
                                        <td>${exec.duration || '-'}</td>
                                        <td>${exec.environment}</td>
                                        <td>
                                            <button class="btn btn-sm btn-secondary" onclick="app.showModal('执行详情', '查看执行详细信息...')">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染测试报告页面
    renderReportsPage() {
        const pageContent = document.getElementById('reports-page');
        const reports = MockData.testReports;
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.showModal('生成报告', '功能开发中...')">
                        <i class="fas fa-plus"></i>生成报告
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('定时报告', '功能开发中...')">
                        <i class="fas fa-clock"></i>定时报告
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('报告模板', '功能开发中...')">
                        <i class="fas fa-file-alt"></i>报告模板
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">总报告数</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                    </div>
                    <div class="stat-number">${reports.length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>本月 +2</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">已发布</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">${reports.filter(r => r.status === 'published').length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>发布率 ${Math.round((reports.filter(r => r.status === 'published').length / reports.length) * 100)}%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">平均通过率</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-percentage"></i>
                        </div>
                    </div>
                    <div class="stat-number">${Math.round(reports.reduce((sum, r) => sum + r.passRate, 0) / reports.length)}%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+3.2%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">测试覆盖率</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                    </div>
                    <div class="stat-number">${Math.round(reports.reduce((sum, r) => sum + r.coverage, 0) / reports.length)}%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+1.8%</span>
                    </div>
                </div>
            </div>

            <div class="reports-grid">
                ${reports.map(report => `
                    <div class="report-card">
                        <div class="report-header">
                            <h3 class="report-title">${report.name}</h3>
                            <span class="report-type">${this.getReportTypeText(report.type)}</span>
                        </div>
                        <div class="report-meta">
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${report.period}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user"></i>
                                <span>${report.author}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${report.createdDate}</span>
                            </div>
                        </div>
                        <div class="report-stats">
                            <div class="stat-item">
                                <span class="stat-value">${report.totalTestCases}</span>
                                <span class="stat-label">总用例</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${report.passRate}%</span>
                                <span class="stat-label">通过率</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${report.coverage}%</span>
                                <span class="stat-label">覆盖率</span>
                            </div>
                        </div>
                        <div class="report-footer">
                            <span class="status-badge ${report.status === 'published' ? 'success' : 'secondary'}">
                                ${report.status === 'published' ? '已发布' : '草稿'}
                            </span>
                            <div class="report-actions">
                                <button class="btn btn-sm btn-secondary" onclick="app.showModal('查看报告', '报告详情...')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="app.showModal('下载报告', '准备下载...')">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 渲染测试数据页面
    renderTestDataPage() {
        const pageContent = document.getElementById('test-data-page');
        const environments = MockData.testEnvironments;
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.showModal('创建数据', '功能开发中...')">
                        <i class="fas fa-plus"></i>创建数据
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('数据库连接', '功能开发中...')">
                        <i class="fas fa-database"></i>数据库连接
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('数据备份', '功能开发中...')">
                        <i class="fas fa-save"></i>数据备份
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">测试环境</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-server"></i>
                        </div>
                    </div>
                    <div class="stat-number">${environments.length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>活跃: ${environments.filter(e => e.status === 'active').length}</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">数据集</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-table"></i>
                        </div>
                    </div>
                    <div class="stat-number">156</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+12</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">存储空间</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-hdd"></i>
                        </div>
                    </div>
                    <div class="stat-number">2.3GB</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>使用率 45%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">备份次数</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-archive"></i>
                        </div>
                    </div>
                    <div class="stat-number">28</div>
                    <div class="stat-change positive">
                        <i class="fas fa-check"></i>
                        <span>最近: 昨天</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">测试环境列表</h3>
                </div>
                <div class="card-body">
                    <div class="environments-grid">
                        ${environments.map(env => `
                            <div class="env-card">
                                <div class="env-header">
                                    <h4>${env.name}</h4>
                                    <span class="status-badge ${env.status === 'active' ? 'success' : env.status === 'maintenance' ? 'warning' : 'secondary'}">
                                        ${env.status === 'active' ? '运行中' : env.status === 'maintenance' ? '维护中' : '停用'}
                                    </span>
                                </div>
                                <div class="env-info">
                                    <div class="info-item">
                                        <i class="fas fa-link"></i>
                                        <span>${env.url}</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-tag"></i>
                                        <span>${env.version}</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-user-tie"></i>
                                        <span>${env.maintainer}</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-clock"></i>
                                        <span>更新: ${env.lastUpdated}</span>
                                    </div>
                                </div>
                                <div class="env-resources">
                                    <div class="resource-item">
                                        <span class="resource-label">CPU:</span>
                                        <span>${env.resources.cpu}</span>
                                    </div>
                                    <div class="resource-item">
                                        <span class="resource-label">内存:</span>
                                        <span>${env.resources.memory}</span>
                                    </div>
                                    <div class="resource-item">
                                        <span class="resource-label">存储:</span>
                                        <span>${env.resources.storage}</span>
                                    </div>
                                </div>
                                <div class="env-services">
                                    ${env.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                                </div>
                                <div class="env-actions">
                                    <button class="btn btn-sm btn-secondary" onclick="app.showModal('环境详情', '查看环境详细信息...')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-primary" onclick="app.showModal('连接测试', '测试环境连接...')">
                                        <i class="fas fa-plug"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染系统设置页面
    renderSettingsPage() {
        const pageContent = document.getElementById('settings-page');
        const users = MockData.users;
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="app.showModal('添加用户', '功能开发中...')">
                        <i class="fas fa-user-plus"></i>添加用户
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('系统备份', '功能开发中...')">
                        <i class="fas fa-save"></i>系统备份
                    </button>
                    <button class="btn btn-secondary" onclick="app.showModal('日志查看', '功能开发中...')">
                        <i class="fas fa-file-alt"></i>系统日志
                    </button>
                </div>
            </div>

            <div class="settings-tabs">
                <div class="tab-nav">
                    <button class="tab-btn active" onclick="app.switchSettingsTab('users', this)">用户管理</button>
                    <button class="tab-btn" onclick="app.switchSettingsTab('system', this)">系统配置</button>
                    <button class="tab-btn" onclick="app.switchSettingsTab('notifications', this)">通知设置</button>
                    <button class="tab-btn" onclick="app.switchSettingsTab('security', this)">安全设置</button>
                </div>
                
                <div class="tab-content">
                    <div class="tab-pane active" id="users-tab">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">用户列表</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-container">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>用户信息</th>
                                                <th>角色</th>
                                                <th>部门</th>
                                                <th>技能</th>
                                                <th>活跃项目</th>
                                                <th>加入时间</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${users.map(user => `
                                                <tr>
                                                    <td>
                                                        <div class="user-info">
                                                            <div class="user-avatar">
                                                                <i class="fas fa-user"></i>
                                                            </div>
                                                            <div>
                                                                <div style="font-weight: 500; color: var(--text-primary);">${user.name}</div>
                                                                <div style="font-size: 0.8rem; color: var(--text-muted);">${user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span class="role-badge">${this.getRoleText(user.role)}</span>
                                                    </td>
                                                    <td>${user.department}</td>
                                                    <td>
                                                        <div class="skill-tags">
                                                            ${user.skills.slice(0, 2).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                                            ${user.skills.length > 2 ? `<span class="skill-more">+${user.skills.length - 2}</span>` : ''}
                                                        </div>
                                                    </td>
                                                    <td>${user.activeProjects.length} 个项目</td>
                                                    <td>${user.joinDate}</td>
                                                    <td>
                                                        <button class="btn btn-sm btn-secondary" onclick="app.showModal('编辑用户', '编辑用户信息...')">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="system-tab">
                        <div class="settings-section">
                            <h3>系统配置</h3>
                            <p>系统配置页面开发中...</p>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="notifications-tab">
                        <div class="settings-section">
                            <h3>通知设置</h3>
                            <p>通知设置页面开发中...</p>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="security-tab">
                        <div class="settings-section">
                            <h3>安全设置</h3>
                            <p>安全设置页面开发中...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 报告类型翻译
    getReportTypeText(type) {
        const types = {
            'functional': '功能测试',
            'performance': '性能测试', 
            'api': 'API测试',
            'security': '安全测试',
            'automation': '自动化测试',
            'comprehensive': '综合测试'
        };
        return types[type] || type;
    }

    // 角色翻译
    getRoleText(role) {
        const roles = {
            'admin': '管理员',
            'tester': '测试工程师',
            'lead': '测试主管',
            'developer': '开发工程师'
        };
        return roles[role] || role;
    }

    // 设置页面标签切换
    switchSettingsTab(tabName, button) {
        // 移除所有活跃状态
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // 设置当前活跃状态
        button.classList.add('active');
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    // 渲染默认页面
    renderDefaultPage(page) {
        const pageContent = document.getElementById(`${page}-page`);
        pageContent.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;">
                    <i class="fas fa-cogs"></i>
                </div>
                <h3 style="color: var(--text-primary); margin-bottom: 1rem;">功能开发中</h3>
                <p style="color: var(--text-muted);">该模块正在开发中，敬请期待！</p>
            </div>
        `;
    }

    // 绘制响应时间图表
    renderResponseTimeChart() {
        setTimeout(() => {
            const canvas = document.getElementById('responseTimeChart');
            if (!canvas || typeof Chart === 'undefined') return;
            
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    datasets: [{
                        label: '平均响应时间 (ms)',
                        data: [245, 198, 267, 321, 298, 234],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#f8fafc' }
                        }
                    },
                    scales: {
                        x: { 
                            ticks: { color: '#f8fafc' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: { 
                            ticks: { color: '#f8fafc' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }, 100);
    }

    // 绘制漏洞分布图表
    renderVulnerabilityChart() {
        setTimeout(() => {
            const canvas = document.getElementById('vulnerabilityChart');
            if (!canvas || typeof Chart === 'undefined') return;
            
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['高风险', '中风险', '低风险', '信息'],
                    datasets: [{
                        data: [3, 7, 12, 8],
                        backgroundColor: [
                            '#ef4444',
                            '#f59e0b',
                            '#10b981',
                            '#3b82f6'
                        ]
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
                    }
                }
            });
        }, 100);
    }

    // 占位方法，用于按钮事件
    createAutomationTest() { this.showModal('创建自动化测试', '功能开发中...'); }
    runAllAutomationTests() { this.showModal('运行所有测试', '功能开发中...'); }
    runAutomationTest(id) { this.showModal('运行测试', `运行测试套件: ${id}`); }
    createPerformanceTest() { this.showModal('新建性能测试', '功能开发中...'); }
    runPerformanceTest() { this.showModal('运行性能测试', '功能开发中...'); }
    startSecurityScan() { this.showModal('开始安全扫描', '功能开发中...'); }
    generateSecurityReport() { this.showModal('生成安全报告', '功能开发中...'); }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    window.app = new TestPlatformApp();
});