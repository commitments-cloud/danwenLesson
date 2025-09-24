// 测试计划管理类
class TestPlanManager {
    constructor() {
        this.testPlans = MockData.testPlans;
        this.currentFilter = 'all';
        this.currentSort = 'name';
    }

    // 渲染测试计划页面
    render() {
        const pageContent = document.getElementById('test-plans-page');
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="testPlanManager.createTestPlan()">
                        <i class="fas fa-plus"></i>新建测试计划
                    </button>
                    <button class="btn btn-secondary" onclick="testPlanManager.importTestPlan()">
                        <i class="fas fa-upload"></i>导入
                    </button>
                    <button class="btn btn-secondary" onclick="testPlanManager.exportTestPlans()">
                        <i class="fas fa-download"></i>导出
                    </button>
                </div>
            </div>

            <!-- 统计概览 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">总计划数</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.testPlans.length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>本月 +2</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">活跃计划</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.testPlans.filter(tp => tp.status === 'active').length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>执行中</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">平均完成度</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-chart-line"></i>
                        </div>
                    </div>
                    <div class="stat-number">${Math.round(this.testPlans.reduce((sum, tp) => sum + tp.progress, 0) / this.testPlans.length)}%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+5.2%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">即将到期</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-number">2</div>
                    <div class="stat-change negative">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>需关注</span>
                    </div>
                </div>
            </div>

            <!-- 过滤和搜索 -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">测试计划列表</h3>
                    <div class="filter-controls">
                        <div class="search-box" style="margin-right: 1rem;">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索计划..." id="planSearchInput" onkeyup="testPlanManager.filterPlans()">
                        </div>
                        <select class="form-select" id="statusFilter" onchange="testPlanManager.filterPlans()" style="margin-right: 1rem;">
                            <option value="">所有状态</option>
                            <option value="active">活跃</option>
                            <option value="completed">已完成</option>
                            <option value="draft">草稿</option>
                            <option value="in_progress">进行中</option>
                            <option value="on_hold">暂停</option>
                        </select>
                        <select class="form-select" id="priorityFilter" onchange="testPlanManager.filterPlans()">
                            <option value="">所有优先级</option>
                            <option value="high">高</option>
                            <option value="medium">中</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="test-plans-grid" id="testPlansGrid">
                        ${this.renderTestPlanCards()}
                    </div>
                </div>
            </div>
        `;

        this.addTestPlanStyles();
    }

    // 渲染测试计划卡片
    renderTestPlanCards() {
        const filteredPlans = this.getFilteredPlans();
        
        return filteredPlans.map(plan => `
            <div class="test-plan-card ${plan.status}" data-status="${plan.status}" data-priority="${plan.priority}">
                <div class="plan-header">
                    <div class="plan-status">
                        <span class="status-badge ${this.getStatusClass(plan.status)}">
                            ${this.getStatusText(plan.status)}
                        </span>
                        <span class="priority-badge ${plan.priority}">
                            ${this.getPriorityText(plan.priority)}
                        </span>
                    </div>
                    <div class="plan-actions">
                        <button class="btn-icon" onclick="testPlanManager.editTestPlan('${plan.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="testPlanManager.duplicateTestPlan('${plan.id}')" title="复制">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon" onclick="testPlanManager.deleteTestPlan('${plan.id}')" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="plan-content" onclick="testPlanManager.viewTestPlan('${plan.id}')">
                    <h3 class="plan-title">${plan.name}</h3>
                    <p class="plan-description">${plan.description}</p>
                    
                    <div class="plan-meta">
                        <div class="meta-item">
                            <i class="fas fa-code-branch"></i>
                            <span>版本: ${plan.version}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>负责人: ${plan.owner}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-server"></i>
                            <span>${plan.environment}</span>
                        </div>
                    </div>

                    <div class="plan-dates">
                        <div class="date-item">
                            <i class="fas fa-calendar-start"></i>
                            <span>开始: ${plan.startDate}</span>
                        </div>
                        <div class="date-item">
                            <i class="fas fa-calendar-end"></i>
                            <span>结束: ${plan.endDate}</span>
                        </div>
                    </div>
                </div>

                <div class="plan-progress">
                    <div class="progress-header">
                        <span class="progress-label">执行进度</span>
                        <span class="progress-percentage">${plan.progress}%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar ${plan.progress >= 80 ? 'success' : plan.progress >= 50 ? '' : 'warning'}" 
                             style="width: ${plan.progress}%"></div>
                    </div>
                </div>

                <div class="plan-stats">
                    <div class="stat-item passed">
                        <i class="fas fa-check"></i>
                        <span>${plan.passed}</span>
                        <small>通过</small>
                    </div>
                    <div class="stat-item failed">
                        <i class="fas fa-times"></i>
                        <span>${plan.failed}</span>
                        <small>失败</small>
                    </div>
                    <div class="stat-item blocked">
                        <i class="fas fa-pause"></i>
                        <span>${plan.blocked}</span>
                        <small>阻塞</small>
                    </div>
                    <div class="stat-item pending">
                        <i class="fas fa-clock"></i>
                        <span>${plan.notExecuted}</span>
                        <small>待执行</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 获取过滤后的计划
    getFilteredPlans() {
        let filtered = this.testPlans;

        // 状态过滤
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            filtered = filtered.filter(plan => plan.status === statusFilter);
        }

        // 优先级过滤
        const priorityFilter = document.getElementById('priorityFilter')?.value;
        if (priorityFilter) {
            filtered = filtered.filter(plan => plan.priority === priorityFilter);
        }

        // 搜索过滤
        const searchInput = document.getElementById('planSearchInput')?.value?.toLowerCase();
        if (searchInput) {
            filtered = filtered.filter(plan => 
                plan.name.toLowerCase().includes(searchInput) ||
                plan.description.toLowerCase().includes(searchInput) ||
                plan.owner.toLowerCase().includes(searchInput)
            );
        }

        return filtered;
    }

    // 过滤计划
    filterPlans() {
        const grid = document.getElementById('testPlansGrid');
        if (grid) {
            grid.innerHTML = this.renderTestPlanCards();
        }
    }

    // 获取状态样式类
    getStatusClass(status) {
        const statusMap = {
            'active': 'success',
            'completed': 'success',
            'draft': 'secondary',
            'in_progress': 'info',
            'on_hold': 'warning'
        };
        return statusMap[status] || 'secondary';
    }

    // 获取状态文本
    getStatusText(status) {
        const statusMap = {
            'active': '活跃',
            'completed': '已完成',
            'draft': '草稿',
            'in_progress': '进行中',
            'on_hold': '暂停'
        };
        return statusMap[status] || status;
    }

    // 获取优先级文本
    getPriorityText(priority) {
        const priorityMap = {
            'high': '高优先级',
            'medium': '中优先级',
            'low': '低优先级'
        };
        return priorityMap[priority] || priority;
    }

    // 查看测试计划详情
    viewTestPlan(planId) {
        const plan = this.testPlans.find(p => p.id === planId);
        if (!plan) return;

        const content = `
            <div class="test-plan-detail">
                <div class="detail-header">
                    <h3>${plan.name}</h3>
                    <div class="detail-badges">
                        <span class="status-badge ${this.getStatusClass(plan.status)}">
                            ${this.getStatusText(plan.status)}
                        </span>
                        <span class="priority-badge ${plan.priority}">
                            ${this.getPriorityText(plan.priority)}
                        </span>
                    </div>
                </div>
                
                <div class="detail-content">
                    <div class="detail-section">
                        <h4>基本信息</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>计划ID:</label>
                                <span>${plan.id}</span>
                            </div>
                            <div class="info-item">
                                <label>版本:</label>
                                <span>${plan.version}</span>
                            </div>
                            <div class="info-item">
                                <label>负责人:</label>
                                <span>${plan.owner}</span>
                            </div>
                            <div class="info-item">
                                <label>测试环境:</label>
                                <span>${plan.environment}</span>
                            </div>
                            <div class="info-item">
                                <label>开始日期:</label>
                                <span>${plan.startDate}</span>
                            </div>
                            <div class="info-item">
                                <label>结束日期:</label>
                                <span>${plan.endDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>计划描述</h4>
                        <p>${plan.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>执行统计</h4>
                        <div class="stats-row">
                            <div class="stat-box success">
                                <div class="stat-value">${plan.passed}</div>
                                <div class="stat-label">通过</div>
                            </div>
                            <div class="stat-box danger">
                                <div class="stat-value">${plan.failed}</div>
                                <div class="stat-label">失败</div>
                            </div>
                            <div class="stat-box warning">
                                <div class="stat-value">${plan.blocked}</div>
                                <div class="stat-label">阻塞</div>
                            </div>
                            <div class="stat-box secondary">
                                <div class="stat-value">${plan.notExecuted}</div>
                                <div class="stat-label">待执行</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        app.showModal('测试计划详情', content);
    }

    // 创建测试计划
    createTestPlan() {
        const content = `
            <form class="test-plan-form">
                <div class="form-group">
                    <label class="form-label">计划名称</label>
                    <input type="text" class="form-control" placeholder="请输入测试计划名称">
                </div>
                <div class="form-group">
                    <label class="form-label">计划描述</label>
                    <textarea class="form-control" rows="3" placeholder="请输入测试计划描述"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">版本</label>
                        <input type="text" class="form-control" placeholder="v1.0.0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">优先级</label>
                        <select class="form-select">
                            <option value="high">高</option>
                            <option value="medium" selected>中</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">开始日期</label>
                        <input type="date" class="form-control">
                    </div>
                    <div class="form-group">
                        <label class="form-label">结束日期</label>
                        <input type="date" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">负责人</label>
                    <select class="form-select">
                        <option>张测试</option>
                        <option>李测试员</option>
                        <option>王测试</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">测试环境</label>
                    <select class="form-select">
                        <option>测试环境</option>
                        <option>开发环境</option>
                        <option>预生产环境</option>
                    </select>
                </div>
            </form>
        `;

        app.showModal('创建测试计划', content, () => {
            app.hideModal();
            this.showNotification('测试计划创建成功！', 'success');
        });
    }

    // 编辑测试计划
    editTestPlan(planId) {
        app.showModal('编辑测试计划', '编辑功能开发中...');
    }

    // 复制测试计划
    duplicateTestPlan(planId) {
        app.showModal('复制测试计划', `复制测试计划 ${planId}...`);
    }

    // 删除测试计划
    deleteTestPlan(planId) {
        const content = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; color: var(--gradient-danger); margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="color: var(--text-primary); margin-bottom: 1rem;">确认删除</h3>
                <p style="color: var(--text-secondary);">您确定要删除这个测试计划吗？此操作无法撤销。</p>
            </div>
        `;

        app.showModal('删除确认', content, () => {
            app.hideModal();
            this.showNotification('测试计划已删除！', 'warning');
        });
    }

    // 导入测试计划
    importTestPlan() {
        app.showModal('导入测试计划', '导入功能开发中...');
    }

    // 导出测试计划
    exportTestPlans() {
        app.showModal('导出测试计划', '导出功能开发中...');
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'warning' ? 'fa-exclamation' : 'fa-info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动删除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 添加测试计划相关样式
    addTestPlanStyles() {
        if (document.getElementById('test-plan-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'test-plan-styles';
        styles.textContent = `
            .test-plans-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                gap: 1.5rem;
            }

            .test-plan-card {
                background: rgba(30, 41, 59, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--border-radius);
                overflow: hidden;
                transition: var(--transition-fast);
                position: relative;
            }

            .test-plan-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-xl);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .plan-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 1rem 1rem 0.5rem 1rem;
            }

            .plan-status {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .priority-badge {
                font-size: 0.7rem;
                padding: 0.2rem 0.6rem;
                border-radius: 999px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.025em;
            }

            .priority-badge.high {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }

            .priority-badge.medium {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }

            .priority-badge.low {
                background: rgba(34, 197, 94, 0.2);
                color: #22c55e;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }

            .plan-actions {
                display: flex;
                gap: 0.25rem;
                opacity: 0;
                transition: var(--transition-fast);
            }

            .test-plan-card:hover .plan-actions {
                opacity: 1;
            }

            .btn-icon {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 0.9rem;
                width: 32px;
                height: 32px;
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                transition: var(--transition-fast);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn-icon:hover {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
            }

            .plan-content {
                padding: 0.5rem 1rem 1rem 1rem;
                cursor: pointer;
            }

            .plan-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--text-primary);
                margin: 0 0 0.5rem 0;
                line-height: 1.3;
            }

            .plan-description {
                color: var(--text-secondary);
                font-size: 0.85rem;
                line-height: 1.4;
                margin: 0 0 1rem 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .plan-meta {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.8rem;
                color: var(--text-muted);
            }

            .meta-item i {
                width: 14px;
                text-align: center;
                opacity: 0.7;
            }

            .plan-dates {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .date-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.8rem;
                color: var(--text-muted);
            }

            .date-item i {
                width: 14px;
                text-align: center;
                opacity: 0.7;
            }

            .plan-progress {
                padding: 0 1rem 1rem 1rem;
            }

            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .progress-label {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }

            .progress-percentage {
                font-size: 0.8rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .plan-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.5rem;
                padding: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.02);
            }

            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.25rem;
                padding: 0.5rem;
                border-radius: var(--border-radius-sm);
            }

            .stat-item i {
                font-size: 0.9rem;
            }

            .stat-item span {
                font-weight: 600;
                font-size: 0.9rem;
            }

            .stat-item small {
                font-size: 0.7rem;
                opacity: 0.8;
            }

            .stat-item.passed {
                color: #10b981;
                background: rgba(16, 185, 129, 0.1);
            }

            .stat-item.failed {
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
            }

            .stat-item.blocked {
                color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
            }

            .stat-item.pending {
                color: #6b7280;
                background: rgba(107, 114, 128, 0.1);
            }

            .filter-controls {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .test-plan-detail {
                max-width: 600px;
            }

            .detail-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1.5rem;
            }

            .detail-header h3 {
                color: var(--text-primary);
                margin: 0;
                flex: 1;
            }

            .detail-badges {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                margin-left: 1rem;
            }

            .detail-section {
                margin-bottom: 2rem;
            }

            .detail-section h4 {
                color: var(--text-primary);
                margin: 0 0 1rem 0;
                font-size: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .info-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .info-item label {
                font-size: 0.8rem;
                color: var(--text-muted);
                font-weight: 500;
            }

            .info-item span {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .stats-row {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1rem;
            }

            .stat-box {
                text-align: center;
                padding: 1rem;
                border-radius: var(--border-radius);
                border: 1px solid;
            }

            .stat-box.success {
                background: rgba(16, 185, 129, 0.1);
                border-color: rgba(16, 185, 129, 0.2);
                color: #10b981;
            }

            .stat-box.danger {
                background: rgba(239, 68, 68, 0.1);
                border-color: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }

            .stat-box.warning {
                background: rgba(245, 158, 11, 0.1);
                border-color: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
            }

            .stat-box.secondary {
                background: rgba(107, 114, 128, 0.1);
                border-color: rgba(107, 114, 128, 0.2);
                color: #6b7280;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 0.25rem;
            }

            .stat-label {
                font-size: 0.8rem;
                opacity: 0.8;
            }

            .test-plan-form .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                color: white;
                font-weight: 500;
                z-index: 2500;
                animation: slideIn 0.3s ease;
            }

            .notification.success {
                background: var(--gradient-success);
            }

            .notification.warning {
                background: var(--gradient-warning);
            }

            .notification.info {
                background: var(--gradient-primary);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .test-plans-grid {
                    grid-template-columns: 1fr;
                }
                
                .filter-controls {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0.5rem;
                }
                
                .plan-dates {
                    grid-template-columns: 1fr;
                }
                
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .stats-row {
                    grid-template-columns: 1fr 1fr;
                }
            }
        `;

        document.head.appendChild(styles);
    }
}

// 全局测试计划管理实例
window.testPlanManager = new TestPlanManager();