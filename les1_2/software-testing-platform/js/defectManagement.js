// 缺陷管理类
class DefectManager {
    constructor() {
        this.defects = MockData.defects;
        this.currentFilter = 'all';
        this.selectedDefects = new Set();
    }

    // 渲染缺陷管理页面
    render() {
        const pageContent = document.getElementById('defects-page');
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="defectManager.createDefect()">
                        <i class="fas fa-plus"></i>新建缺陷
                    </button>
                    <button class="btn btn-secondary" onclick="defectManager.batchAssign()">
                        <i class="fas fa-user-plus"></i>批量分配
                    </button>
                    <button class="btn btn-secondary" onclick="defectManager.exportDefects()">
                        <i class="fas fa-download"></i>导出
                    </button>
                    <button class="btn btn-secondary" onclick="defectManager.generateReport()">
                        <i class="fas fa-chart-bar"></i>生成报告
                    </button>
                </div>
            </div>

            <!-- 统计概览 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">总缺陷数</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-bug"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.defects.length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>本月 +${Math.floor(Math.random() * 5) + 3}</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">待处理</span>
                        <div class="stat-icon" style="background: var(--gradient-danger);">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.defects.filter(d => d.status === 'open').length}</div>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-up"></i>
                        <span>需关注</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">处理中</span>
                        <div class="stat-icon" style="background: var(--gradient-warning);">
                            <i class="fas fa-tools"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.defects.filter(d => d.status === 'in_progress').length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>进行中</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">已解决</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.defects.filter(d => ['resolved', 'closed'].includes(d.status)).length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>解决率 ${Math.round((this.defects.filter(d => ['resolved', 'closed'].includes(d.status)).length / this.defects.length) * 100)}%</span>
                    </div>
                </div>
            </div>

            <!-- 缺陷分析图表 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">缺陷严重程度分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="defectSeverityChart" width="400" height="300"></canvas>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">缺陷状态分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="defectStatusChart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>

            <!-- 过滤和搜索 -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">缺陷列表</h3>
                    <div class="filter-controls">
                        <div class="search-box" style="margin-right: 1rem;">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索缺陷..." id="defectSearchInput" onkeyup="defectManager.filterDefects()">
                        </div>
                        <select class="form-select" id="statusFilter" onchange="defectManager.filterDefects()" style="margin-right: 1rem;">
                            <option value="">所有状态</option>
                            <option value="open">待处理</option>
                            <option value="in_progress">处理中</option>
                            <option value="resolved">已解决</option>
                            <option value="closed">已关闭</option>
                        </select>
                        <select class="form-select" id="severityFilter" onchange="defectManager.filterDefects()" style="margin-right: 1rem;">
                            <option value="">所有严重程度</option>
                            <option value="critical">严重</option>
                            <option value="high">高</option>
                            <option value="medium">中</option>
                            <option value="low">低</option>
                        </select>
                        <select class="form-select" id="assigneeFilter" onchange="defectManager.filterDefects()">
                            <option value="">所有负责人</option>
                            <option value="开发团队A">开发团队A</option>
                            <option value="安全开发组">安全开发组</option>
                            <option value="前端开发组">前端开发组</option>
                            <option value="后端开发组">后端开发组</option>
                            <option value="UI开发组">UI开发组</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="defects-grid" id="defectsGrid">
                        ${this.renderDefectCards()}
                    </div>
                </div>
            </div>
        `;

        this.addDefectStyles();
        this.initDefectCharts();
    }

    // 渲染缺陷卡片
    renderDefectCards() {
        const filteredDefects = this.getFilteredDefects();
        
        return filteredDefects.map(defect => `
            <div class="defect-card ${defect.severity}" data-defect-id="${defect.id}">
                <div class="defect-header">
                    <div class="defect-meta">
                        <span class="defect-id">${defect.id}</span>
                        <span class="severity-badge ${defect.severity}">
                            ${this.getSeverityText(defect.severity)}
                        </span>
                        <span class="priority-badge ${defect.priority}">
                            ${this.getPriorityText(defect.priority)}
                        </span>
                    </div>
                    <div class="defect-actions">
                        <button class="btn-icon" onclick="defectManager.viewDefect('${defect.id}')" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="defectManager.editDefect('${defect.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="defectManager.assignDefect('${defect.id}')" title="分配">
                            <i class="fas fa-user-plus"></i>
                        </button>
                    </div>
                </div>

                <div class="defect-content" onclick="defectManager.viewDefect('${defect.id}')">
                    <h3 class="defect-title">${defect.title}</h3>
                    <p class="defect-description">${defect.description}</p>
                    
                    <div class="defect-info">
                        <div class="info-row">
                            <div class="info-item">
                                <i class="fas fa-cube"></i>
                                <span>模块: ${defect.module}</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-user"></i>
                                <span>报告人: ${defect.reporter}</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-item">
                                <i class="fas fa-calendar"></i>
                                <span>创建: ${defect.createdDate}</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-clock"></i>
                                <span>更新: ${defect.lastUpdated}</span>
                            </div>
                        </div>
                        ${defect.dueDate ? `
                            <div class="info-row">
                                <div class="info-item">
                                    <i class="fas fa-calendar-times"></i>
                                    <span>到期: ${defect.dueDate}</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-desktop"></i>
                                    <span>${defect.browser} / ${defect.os}</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    ${defect.tags && defect.tags.length > 0 ? `
                        <div class="defect-tags">
                            ${defect.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>

                <div class="defect-footer">
                    <div class="status-info">
                        <span class="status-badge ${this.getStatusClass(defect.status)}">
                            ${this.getStatusText(defect.status)}
                        </span>
                        <span class="assignee-info">
                            <i class="fas fa-user-tie"></i>
                            ${defect.assignee}
                        </span>
                    </div>
                    <div class="defect-controls">
                        <button class="btn btn-sm btn-secondary" onclick="defectManager.changeStatus('${defect.id}', event)">
                            更改状态
                        </button>
                        ${defect.workaround ? `
                            <button class="btn btn-sm btn-info" onclick="defectManager.showWorkaround('${defect.id}')" title="有解决方案">
                                <i class="fas fa-lightbulb"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 获取过滤后的缺陷
    getFilteredDefects() {
        let filtered = this.defects;

        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            filtered = filtered.filter(defect => defect.status === statusFilter);
        }

        const severityFilter = document.getElementById('severityFilter')?.value;
        if (severityFilter) {
            filtered = filtered.filter(defect => defect.severity === severityFilter);
        }

        const assigneeFilter = document.getElementById('assigneeFilter')?.value;
        if (assigneeFilter) {
            filtered = filtered.filter(defect => defect.assignee === assigneeFilter);
        }

        const searchInput = document.getElementById('defectSearchInput')?.value?.toLowerCase();
        if (searchInput) {
            filtered = filtered.filter(defect => 
                defect.title.toLowerCase().includes(searchInput) ||
                defect.description.toLowerCase().includes(searchInput) ||
                defect.module.toLowerCase().includes(searchInput) ||
                (defect.tags && defect.tags.some(tag => tag.toLowerCase().includes(searchInput)))
            );
        }

        return filtered.sort((a, b) => {
            // 按严重程度排序
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });
    }

    // 过滤缺陷
    filterDefects() {
        const grid = document.getElementById('defectsGrid');
        if (grid) {
            grid.innerHTML = this.renderDefectCards();
        }
    }

    // 获取严重程度文本
    getSeverityText(severity) {
        const severityMap = {
            'critical': '严重',
            'high': '高',
            'medium': '中',
            'low': '低'
        };
        return severityMap[severity] || severity;
    }

    // 获取优先级文本
    getPriorityText(priority) {
        const priorityMap = {
            'urgent': '紧急',
            'high': '高',
            'medium': '中',
            'low': '低'
        };
        return priorityMap[priority] || priority;
    }

    // 获取状态样式类
    getStatusClass(status) {
        const statusMap = {
            'open': 'danger',
            'in_progress': 'warning',
            'resolved': 'success',
            'closed': 'secondary'
        };
        return statusMap[status] || 'secondary';
    }

    // 获取状态文本
    getStatusText(status) {
        const statusMap = {
            'open': '待处理',
            'in_progress': '处理中',
            'resolved': '已解决',
            'closed': '已关闭'
        };
        return statusMap[status] || status;
    }

    // 查看缺陷详情
    viewDefect(defectId) {
        const defect = this.defects.find(d => d.id === defectId);
        if (!defect) return;

        const content = `
            <div class="defect-detail">
                <div class="detail-header">
                    <div class="header-left">
                        <h3>${defect.title}</h3>
                        <div class="defect-id-info">
                            <span class="defect-id-badge">${defect.id}</span>
                            <span class="test-case-link">${defect.testCase ? `关联用例: ${defect.testCase}` : '无关联用例'}</span>
                        </div>
                    </div>
                    <div class="detail-badges">
                        <span class="severity-badge ${defect.severity}">
                            ${this.getSeverityText(defect.severity)}
                        </span>
                        <span class="priority-badge ${defect.priority}">
                            ${this.getPriorityText(defect.priority)}
                        </span>
                        <span class="status-badge ${this.getStatusClass(defect.status)}">
                            ${this.getStatusText(defect.status)}
                        </span>
                    </div>
                </div>
                
                <div class="detail-content">
                    <div class="detail-section">
                        <h4>基本信息</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>缺陷ID:</label>
                                <span>${defect.id}</span>
                            </div>
                            <div class="info-item">
                                <label>缺陷类型:</label>
                                <span>${defect.type}</span>
                            </div>
                            <div class="info-item">
                                <label>所属模块:</label>
                                <span>${defect.module}</span>
                            </div>
                            <div class="info-item">
                                <label>测试环境:</label>
                                <span>${defect.environment}</span>
                            </div>
                            <div class="info-item">
                                <label>报告人:</label>
                                <span>${defect.reporter}</span>
                            </div>
                            <div class="info-item">
                                <label>负责人:</label>
                                <span>${defect.assignee}</span>
                            </div>
                            <div class="info-item">
                                <label>浏览器:</label>
                                <span>${defect.browser}</span>
                            </div>
                            <div class="info-item">
                                <label>操作系统:</label>
                                <span>${defect.os}</span>
                            </div>
                            <div class="info-item">
                                <label>创建时间:</label>
                                <span>${defect.createdDate}</span>
                            </div>
                            <div class="info-item">
                                <label>最后更新:</label>
                                <span>${defect.lastUpdated}</span>
                            </div>
                            ${defect.dueDate ? `
                                <div class="info-item">
                                    <label>截止时间:</label>
                                    <span class="${this.isOverdue(defect.dueDate) ? 'overdue' : ''}">${defect.dueDate}</span>
                                </div>
                            ` : ''}
                            <div class="info-item">
                                <label>可重现:</label>
                                <span>${defect.reproducible ? '是' : '否'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>缺陷描述</h4>
                        <p class="defect-description-full">${defect.description}</p>
                    </div>
                    
                    ${defect.workaround ? `
                        <div class="detail-section">
                            <h4>临时解决方案</h4>
                            <p class="workaround-text">${defect.workaround}</p>
                        </div>
                    ` : ''}
                    
                    ${defect.resolution ? `
                        <div class="detail-section">
                            <h4>解决方案</h4>
                            <p class="resolution-text">${defect.resolution}</p>
                        </div>
                    ` : ''}
                    
                    ${defect.attachments && defect.attachments.length > 0 ? `
                        <div class="detail-section">
                            <h4>附件</h4>
                            <div class="attachments-list">
                                ${defect.attachments.map(file => `
                                    <div class="attachment-item">
                                        <i class="fas ${this.getFileIcon(file)}"></i>
                                        <span>${file}</span>
                                        <button class="btn-icon" onclick="defectManager.downloadAttachment('${file}')" title="下载">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${defect.tags && defect.tags.length > 0 ? `
                        <div class="detail-section">
                            <h4>标签</h4>
                            <div class="defect-tags">
                                ${defect.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- 数据可视化图表 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">缺陷严重程度分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="defectSeverityChart" width="400" height="300"></canvas>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">缺陷状态分布</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="defectStatusChart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        // 渲染缺陷相关图表
        this.renderDefectCharts();
    }
    
    // 渲染缺陷图表
    renderDefectCharts() {
        setTimeout(() => {
            // 缺陷严重程度分布图
            const severityCanvas = document.getElementById('defectSeverityChart');
            if (severityCanvas && typeof Chart !== 'undefined') {
                const severityCtx = severityCanvas.getContext('2d');
                new Chart(severityCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['高', '中', '低', '提示'],
                        datasets: [{
                            data: [8, 15, 12, 5],
                            backgroundColor: [
                                '#ef4444', // 高严重 - 红色
                                '#f59e0b', // 中严重 - 橙色  
                                '#10b981', // 低严重 - 绿色
                                '#6366f1'  // 提示 - 蓝色
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
            
            // 缺陷状态分布图
            const statusCanvas = document.getElementById('defectStatusChart');
            if (statusCanvas && typeof Chart !== 'undefined') {
                const statusCtx = statusCanvas.getContext('2d');
                new Chart(statusCtx, {
                    type: 'bar',
                    data: {
                        labels: ['开放', '修复中', '待验证', '已关闭', '重新打开'],
                        datasets: [{
                            label: '缺陷数量',
                            data: [12, 8, 6, 14, 3],
                            backgroundColor: [
                                '#ef4444', // 开放 - 红色
                                '#f59e0b', // 修复中 - 橙色
                                '#3b82f6', // 待验证 - 蓝色
                                '#10b981', // 已关闭 - 绿色
                                '#8b5cf6'  // 重新打开 - 紫色
                            ],
                            borderRadius: 6,
                            borderSkipped: false
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
            }
        }, 100);
    }

    // 创建缺陷
    createDefect() {
        const content = `
            <form class="defect-form">
                <div class="form-group">
                    <label class="form-label">缺陷标题</label>
                    <input type="text" class="form-control" placeholder="请输入缺陷标题">
                </div>
                <div class="form-group">
                    <label class="form-label">缺陷描述</label>
                    <textarea class="form-control" rows="4" placeholder="请详细描述缺陷现象和重现步骤"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">严重程度</label>
                        <select class="form-select">
                            <option value="critical">严重</option>
                            <option value="high">高</option>
                            <option value="medium" selected>中</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">优先级</label>
                        <select class="form-select">
                            <option value="urgent">紧急</option>
                            <option value="high">高</option>
                            <option value="medium" selected>中</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">缺陷类型</label>
                        <select class="form-select">
                            <option>功能缺陷</option>
                            <option>界面缺陷</option>
                            <option>性能缺陷</option>
                            <option>安全缺陷</option>
                            <option>兼容性缺陷</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">所属模块</label>
                        <select class="form-select">
                            <option>用户管理</option>
                            <option>商品管理</option>
                            <option>订单管理</option>
                            <option>支付系统</option>
                            <option>API接口</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">测试环境</label>
                        <select class="form-select">
                            <option>测试环境</option>
                            <option>开发环境</option>
                            <option>预生产环境</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">负责人</label>
                        <select class="form-select">
                            <option>开发团队A</option>
                            <option>开发团队B</option>
                            <option>前端开发组</option>
                            <option>后端开发组</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">浏览器</label>
                        <input type="text" class="form-control" placeholder="Chrome 118">
                    </div>
                    <div class="form-group">
                        <label class="form-label">操作系统</label>
                        <input type="text" class="form-control" placeholder="Windows 11">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">关联测试用例</label>
                    <input type="text" class="form-control" placeholder="请输入测试用例ID（可选）">
                </div>
                <div class="form-group">
                    <label class="form-label">缺陷标签</label>
                    <input type="text" class="form-control" placeholder="请输入标签，用逗号分隔">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" checked> 缺陷可重现
                    </label>
                </div>
            </form>
        `;

        app.showModal('新建缺陷', content, () => {
            app.hideModal();
            this.showNotification('缺陷创建成功！', 'success');
        });
    }

    // 更改缺陷状态
    changeStatus(defectId, event) {
        event.stopPropagation();
        const defect = this.defects.find(d => d.id === defectId);
        if (!defect) return;

        const content = `
            <div class="status-change-form">
                <h4>更改缺陷状态：${defect.title}</h4>
                <div class="current-status">
                    <span>当前状态：</span>
                    <span class="status-badge ${this.getStatusClass(defect.status)}">
                        ${this.getStatusText(defect.status)}
                    </span>
                </div>
                <div class="form-group">
                    <label class="form-label">新状态</label>
                    <select class="form-select" id="newStatus">
                        <option value="open" ${defect.status === 'open' ? 'selected' : ''}>待处理</option>
                        <option value="in_progress" ${defect.status === 'in_progress' ? 'selected' : ''}>处理中</option>
                        <option value="resolved" ${defect.status === 'resolved' ? 'selected' : ''}>已解决</option>
                        <option value="closed" ${defect.status === 'closed' ? 'selected' : ''}>已关闭</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <textarea class="form-control" rows="3" placeholder="请输入状态更改备注..."></textarea>
                </div>
            </div>
        `;

        app.showModal('更改缺陷状态', content, () => {
            const newStatus = document.getElementById('newStatus').value;
            app.hideModal();
            this.showNotification(`缺陷状态已更改为：${this.getStatusText(newStatus)}`, 'success');
        });
    }

    // 显示临时解决方案
    showWorkaround(defectId) {
        const defect = this.defects.find(d => d.id === defectId);
        if (!defect || !defect.workaround) return;

        const content = `
            <div class="workaround-info">
                <h4>临时解决方案</h4>
                <div class="defect-info-summary">
                    <strong>缺陷：</strong>${defect.title}
                </div>
                <div class="workaround-content">
                    <p>${defect.workaround}</p>
                </div>
            </div>
        `;

        app.showModal('临时解决方案', content);
    }

    // 分配缺陷
    assignDefect(defectId) {
        const content = `
            <div class="assign-form">
                <h4>分配缺陷</h4>
                <div class="form-group">
                    <label class="form-label">负责人</label>
                    <select class="form-select">
                        <option>开发团队A</option>
                        <option>开发团队B</option>
                        <option>前端开发组</option>
                        <option>后端开发组</option>
                        <option>UI开发组</option>
                        <option>安全开发组</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">截止时间</label>
                    <input type="date" class="form-control">
                </div>
                <div class="form-group">
                    <label class="form-label">分配说明</label>
                    <textarea class="form-control" rows="3" placeholder="请输入分配说明..."></textarea>
                </div>
            </div>
        `;

        app.showModal('分配缺陷', content, () => {
            app.hideModal();
            this.showNotification('缺陷分配成功！', 'success');
        });
    }

    // 批量分配
    batchAssign() {
        app.showModal('批量分配', '批量分配功能开发中...');
    }

    // 编辑缺陷
    editDefect(defectId) {
        app.showModal('编辑缺陷', '编辑功能开发中...');
    }

    // 导出缺陷
    exportDefects() {
        app.showModal('导出缺陷', '导出功能开发中...');
    }

    // 生成报告
    generateReport() {
        app.showModal('生成缺陷报告', '报告生成功能开发中...');
    }

    // 下载附件
    downloadAttachment(filename) {
        this.showNotification(`正在下载附件：${filename}`, 'info');
    }

    // 获取文件图标
    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'png': 'fa-image',
            'jpg': 'fa-image',
            'jpeg': 'fa-image',
            'gif': 'fa-image',
            'pdf': 'fa-file-pdf',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'xls': 'fa-file-excel',
            'xlsx': 'fa-file-excel',
            'txt': 'fa-file-text',
            'log': 'fa-file-text',
            'zip': 'fa-file-archive',
            'mp4': 'fa-file-video',
            'mov': 'fa-file-video'
        };
        return iconMap[ext] || 'fa-file';
    }

    // 检查是否过期
    isOverdue(dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        return due < now;
    }

    // 初始化缺陷图表
    initDefectCharts() {
        setTimeout(() => {
            this.initSeverityChart();
            this.initStatusChart();
        }, 100);
    }

    // 初始化严重程度图表
    initSeverityChart() {
        const canvas = document.getElementById('defectSeverityChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        const severityData = this.getSeverityData();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['严重', '高', '中', '低'],
                datasets: [{
                    data: severityData,
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

    // 初始化状态图表
    initStatusChart() {
        const canvas = document.getElementById('defectStatusChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        const statusData = this.getStatusData();
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['待处理', '处理中', '已解决', '已关闭'],
                datasets: [{
                    data: statusData,
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#10b981',
                        '#6b7280'
                    ],
                    maxBarThickness: 50
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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

    // 获取严重程度数据
    getSeverityData() {
        const critical = this.defects.filter(d => d.severity === 'critical').length;
        const high = this.defects.filter(d => d.severity === 'high').length;
        const medium = this.defects.filter(d => d.severity === 'medium').length;
        const low = this.defects.filter(d => d.severity === 'low').length;
        return [critical, high, medium, low];
    }

    // 获取状态数据
    getStatusData() {
        const open = this.defects.filter(d => d.status === 'open').length;
        const inProgress = this.defects.filter(d => d.status === 'in_progress').length;
        const resolved = this.defects.filter(d => d.status === 'resolved').length;
        const closed = this.defects.filter(d => d.status === 'closed').length;
        return [open, inProgress, resolved, closed];
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'warning' ? 'fa-exclamation' : 'fa-info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 添加缺陷管理相关样式
    addDefectStyles() {
        if (document.getElementById('defect-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'defect-styles';
        styles.textContent = `
            .defects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                gap: 1.5rem;
            }

            .defect-card {
                background: rgba(30, 41, 59, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--border-radius);
                overflow: hidden;
                transition: var(--transition-fast);
                position: relative;
            }

            .defect-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-xl);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .defect-card.critical {
                border-left: 4px solid #dc2626;
            }

            .defect-card.high {
                border-left: 4px solid #ef4444;
            }

            .defect-card.medium {
                border-left: 4px solid #f59e0b;
            }

            .defect-card.low {
                border-left: 4px solid #10b981;
            }

            .defect-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 1rem 1rem 0.5rem 1rem;
            }

            .defect-meta {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                align-items: center;
            }

            .defect-id {
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 0.8rem;
                font-weight: 600;
                color: var(--text-primary);
                background: rgba(255, 255, 255, 0.1);
                padding: 0.2rem 0.5rem;
                border-radius: var(--border-radius-sm);
            }

            .severity-badge {
                font-size: 0.7rem;
                padding: 0.2rem 0.6rem;
                border-radius: 999px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.025em;
            }

            .severity-badge.critical {
                background: rgba(220, 38, 38, 0.2);
                color: #dc2626;
                border: 1px solid rgba(220, 38, 38, 0.3);
            }

            .severity-badge.high {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }

            .severity-badge.medium {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }

            .severity-badge.low {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }

            .defect-actions {
                display: flex;
                gap: 0.25rem;
                opacity: 0;
                transition: var(--transition-fast);
            }

            .defect-card:hover .defect-actions {
                opacity: 1;
            }

            .defect-content {
                padding: 0.5rem 1rem 1rem 1rem;
                cursor: pointer;
            }

            .defect-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--text-primary);
                margin: 0 0 0.5rem 0;
                line-height: 1.3;
            }

            .defect-description {
                color: var(--text-secondary);
                font-size: 0.85rem;
                line-height: 1.4;
                margin: 0 0 1rem 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .defect-info {
                margin-bottom: 1rem;
            }

            .info-row {
                display: flex;
                gap: 1rem;
                margin-bottom: 0.5rem;
            }

            .info-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.8rem;
                color: var(--text-muted);
                flex: 1;
            }

            .info-item i {
                width: 14px;
                text-align: center;
                opacity: 0.7;
            }

            .defect-tags {
                display: flex;
                gap: 0.25rem;
                flex-wrap: wrap;
            }

            .defect-footer {
                padding: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.02);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .status-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .assignee-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.8rem;
                color: var(--text-secondary);
            }

            .defect-controls {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            .defect-detail {
                max-width: 800px;
            }

            .detail-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1.5rem;
                gap: 1rem;
            }

            .header-left {
                flex: 1;
            }

            .detail-header h3 {
                color: var(--text-primary);
                margin: 0 0 0.5rem 0;
                line-height: 1.3;
            }

            .defect-id-info {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            .defect-id-badge {
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-primary);
                background: rgba(255, 255, 255, 0.1);
                padding: 0.3rem 0.6rem;
                border-radius: var(--border-radius-sm);
            }

            .test-case-link {
                font-size: 0.8rem;
                color: var(--text-muted);
            }

            .detail-badges {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .defect-description-full {
                color: var(--text-secondary);
                line-height: 1.6;
                margin: 0;
            }

            .workaround-text {
                color: var(--text-secondary);
                background: rgba(245, 158, 11, 0.1);
                padding: 1rem;
                border-radius: var(--border-radius);
                border-left: 4px solid #f59e0b;
                margin: 0;
            }

            .resolution-text {
                color: var(--text-secondary);
                background: rgba(16, 185, 129, 0.1);
                padding: 1rem;
                border-radius: var(--border-radius);
                border-left: 4px solid #10b981;
                margin: 0;
            }

            .attachments-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .attachment-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.02);
                border-radius: var(--border-radius-sm);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .attachment-item i:first-child {
                color: var(--text-muted);
                width: 16px;
            }

            .attachment-item span {
                flex: 1;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .status-change-form h4 {
                color: var(--text-primary);
                margin: 0 0 1rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .current-status {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                color: var(--text-secondary);
            }

            .workaround-info h4 {
                color: var(--text-primary);
                margin: 0 0 1rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .defect-info-summary {
                color: var(--text-secondary);
                margin-bottom: 1rem;
            }

            .workaround-content {
                background: rgba(245, 158, 11, 0.1);
                padding: 1rem;
                border-radius: var(--border-radius);
                border-left: 4px solid #f59e0b;
            }

            .assign-form h4 {
                color: var(--text-primary);
                margin: 0 0 1.5rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .defect-form .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .overdue {
                color: #ef4444 !important;
                font-weight: 600;
            }

            @media (max-width: 768px) {
                .defects-grid {
                    grid-template-columns: 1fr;
                }
                
                .filter-controls {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0.5rem;
                }
                
                .info-row {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .defect-footer {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }
                
                .status-info {
                    justify-content: space-between;
                }
                
                .detail-header {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .defect-form .form-row {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(styles);
    }
}

// 全局缺陷管理实例
window.defectManager = new DefectManager();