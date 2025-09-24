// 测试用例管理类
class TestCaseManager {
    constructor() {
        this.testCases = MockData.testCases || [];
        this.filteredTestCases = [...this.testCases];
        this.selectedCases = new Set();
        this.currentFilters = {
            search: '',
            priority: '',
            status: ''
        };
    }

    // 渲染测试用例页面
    render() {
        const pageContent = document.getElementById('test-cases-page');
        
        pageContent.innerHTML = `
            <div class="page-header">
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="testCaseManager.createTestCase()">
                        <i class="fas fa-plus"></i>新建用例
                    </button>
                    <button class="btn btn-secondary" onclick="testCaseManager.batchExecute()">
                        <i class="fas fa-play"></i>批量执行
                    </button>
                    <button class="btn btn-secondary" onclick="this.exportTestCases()">
                        <i class="fas fa-download"></i>导出
                    </button>
                </div>
                <div class="search-filter-controls">
                    <div class="search-box-inline">
                        <i class="fas fa-search"></i>
                        <input type="text" id="testCaseSearch" placeholder="搜索测试用例..."
                               oninput="testCaseManager.handleSearch(this.value)" />
                    </div>
                    <select id="priorityFilter" class="form-select" onchange="testCaseManager.handleFilter()">
                        <option value="">所有优先级</option>
                        <option value="high">高</option>
                        <option value="medium">中</option>
                        <option value="low">低</option>
                    </select>
                    <select id="statusFilter" class="form-select" onchange="testCaseManager.handleFilter()">
                        <option value="">所有状态</option>
                        <option value="active">活跃</option>
                        <option value="inactive">非活跃</option>
                        <option value="deprecated">废弃</option>
                    </select>
                    <button class="btn btn-secondary" onclick="testCaseManager.exportCases()">
                        <i class="fas fa-download"></i>导出
                    </button>
                </div>
            </div>

            <!-- 统计概览 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">总用例数</span>
                        <div class="stat-icon" style="background: var(--gradient-primary);">
                            <i class="fas fa-list-check"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.testCases.length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>本周 +5</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">通过用例</span>
                        <div class="stat-icon" style="background: var(--gradient-success);">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.testCases.filter(tc => tc.status === 'passed').length}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>通过率 ${Math.round((this.testCases.filter(tc => tc.status === 'passed').length / this.testCases.length) * 100)}%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">失败用例</span>
                        <div class="stat-icon" style="background: var(--gradient-danger);">
                            <i class="fas fa-times-circle"></i>
                        </div>
                    </div>
                    <div class="stat-number">${this.testCases.filter(tc => tc.status === 'failed').length}</div>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-up"></i>
                        <span>需关注</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">自动化率</span>
                        <div class="stat-icon" style="background: var(--gradient-accent);">
                            <i class="fas fa-robot"></i>
                        </div>
                    </div>
                    <div class="stat-number">${Math.round((this.testCases.filter(tc => tc.automationStatus === 'automated').length / this.testCases.length) * 100)}%</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+8.5%</span>
                    </div>
                </div>
            </div>

            <!-- 过滤和操作栏 -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">测试用例列表</h3>
                    <div class="filter-controls">
                        <div class="search-box" style="margin-right: 1rem;">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索用例..." id="caseSearchInput" onkeyup="testCaseManager.filterCases()">
                        </div>
                        <select class="form-select" id="statusFilter" onchange="testCaseManager.filterCases()" style="margin-right: 1rem;">
                            <option value="">所有状态</option>
                            <option value="passed">通过</option>
                            <option value="failed">失败</option>
                            <option value="blocked">阻塞</option>
                            <option value="not_executed">未执行</option>
                        </select>
                        <select class="form-select" id="moduleFilter" onchange="testCaseManager.filterCases()" style="margin-right: 1rem;">
                            <option value="">所有模块</option>
                            <option value="用户管理">用户管理</option>
                            <option value="商品管理">商品管理</option>
                            <option value="订单管理">订单管理</option>
                            <option value="支付系统">支付系统</option>
                            <option value="API接口">API接口</option>
                        </select>
                        <select class="form-select" id="priorityFilter" onchange="testCaseManager.filterCases()">
                            <option value="">所有优先级</option>
                            <option value="high">高</option>
                            <option value="medium">中</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th width="40">
                                        <input type="checkbox" onchange="testCaseManager.toggleSelectAll(this)">
                                    </th>
                                    <th>用例信息</th>
                                    <th>模块</th>
                                    <th>优先级</th>
                                    <th>状态</th>
                                    <th>自动化</th>
                                    <th>执行次数</th>
                                    <th>最后执行</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="testCasesTableBody">
                                ${this.renderTestCaseRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.addTestCaseStyles();
    }

    // 渲染测试用例表格行
    renderTestCaseRows() {
        const filteredCases = this.getFilteredCases();
        
        return filteredCases.map(testCase => `
            <tr class="test-case-row" data-case-id="${testCase.id}">
                <td>
                    <input type="checkbox" class="case-checkbox" value="${testCase.id}" 
                           onchange="testCaseManager.toggleSelectCase('${testCase.id}', this.checked)">
                </td>
                <td>
                    <div class="case-info">
                        <div class="case-title">${testCase.title}</div>
                        <div class="case-description">${testCase.description}</div>
                        <div class="case-tags">
                            ${testCase.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="module-badge">${testCase.module}</span>
                </td>
                <td>
                    <span class="priority-badge ${testCase.priority}">
                        ${this.getPriorityText(testCase.priority)}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${this.getStatusClass(testCase.status)}">
                        ${this.getStatusText(testCase.status)}
                    </span>
                </td>
                <td>
                    <span class="automation-badge ${testCase.automationStatus}">
                        <i class="fas ${this.getAutomationIcon(testCase.automationStatus)}"></i>
                        ${this.getAutomationText(testCase.automationStatus)}
                    </span>
                </td>
                <td>
                    <span class="execution-count">${testCase.executionCount}</span>
                </td>
                <td>
                    <span class="last-executed">${testCase.lastExecuted || '-'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="testCaseManager.viewTestCase('${testCase.id}')" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="testCaseManager.executeTestCase('${testCase.id}')" title="执行">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-icon" onclick="testCaseManager.editTestCase('${testCase.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="testCaseManager.duplicateTestCase('${testCase.id}')" title="复制">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 获取过滤后的用例
    getFilteredCases() {
        let filtered = this.testCases;

        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            filtered = filtered.filter(testCase => testCase.status === statusFilter);
        }

        const moduleFilter = document.getElementById('moduleFilter')?.value;
        if (moduleFilter) {
            filtered = filtered.filter(testCase => testCase.module === moduleFilter);
        }

        const priorityFilter = document.getElementById('priorityFilter')?.value;
        if (priorityFilter) {
            filtered = filtered.filter(testCase => testCase.priority === priorityFilter);
        }

        const searchInput = document.getElementById('caseSearchInput')?.value?.toLowerCase();
        if (searchInput) {
            filtered = filtered.filter(testCase => 
                testCase.title.toLowerCase().includes(searchInput) ||
                testCase.description.toLowerCase().includes(searchInput) ||
                testCase.tags.some(tag => tag.toLowerCase().includes(searchInput))
            );
        }

        return filtered;
    }

    // 过滤用例
    filterCases() {
        const tbody = document.getElementById('testCasesTableBody');
        if (tbody) {
            tbody.innerHTML = this.renderTestCaseRows();
        }
    }

    // 获取状态样式类
    getStatusClass(status) {
        const statusMap = {
            'passed': 'success',
            'failed': 'danger',
            'blocked': 'warning',
            'not_executed': 'secondary'
        };
        return statusMap[status] || 'secondary';
    }

    // 获取状态文本
    getStatusText(status) {
        const statusMap = {
            'passed': '通过',
            'failed': '失败',
            'blocked': '阻塞',
            'not_executed': '未执行'
        };
        return statusMap[status] || status;
    }

    // 获取优先级文本
    getPriorityText(priority) {
        const priorityMap = {
            'high': '高',
            'medium': '中',
            'low': '低'
        };
        return priorityMap[priority] || priority;
    }

    // 获取自动化状态图标
    getAutomationIcon(status) {
        const iconMap = {
            'automated': 'fa-robot',
            'manual': 'fa-user',
            'pending': 'fa-clock'
        };
        return iconMap[status] || 'fa-question';
    }

    // 获取自动化状态文本
    getAutomationText(status) {
        const textMap = {
            'automated': '已自动化',
            'manual': '手工执行',
            'pending': '待自动化'
        };
        return textMap[status] || status;
    }

    // 切换选择所有用例
    toggleSelectAll(checkbox) {
        const allCheckboxes = document.querySelectorAll('.case-checkbox');
        const isChecked = checkbox.checked;
        
        allCheckboxes.forEach(cb => {
            cb.checked = isChecked;
            if (isChecked) {
                this.selectedCases.add(cb.value);
            } else {
                this.selectedCases.delete(cb.value);
            }
        });
    }

    // 切换选择单个用例
    toggleSelectCase(caseId, isSelected) {
        if (isSelected) {
            this.selectedCases.add(caseId);
        } else {
            this.selectedCases.delete(caseId);
        }
    }

    // 查看测试用例详情
    viewTestCase(caseId) {
        const testCase = this.testCases.find(tc => tc.id === caseId);
        if (!testCase) return;

        const content = `
            <div class="test-case-detail">
                <div class="detail-header">
                    <h3>${testCase.title}</h3>
                    <div class="detail-badges">
                        <span class="status-badge ${this.getStatusClass(testCase.status)}">
                            ${this.getStatusText(testCase.status)}
                        </span>
                        <span class="priority-badge ${testCase.priority}">
                            ${this.getPriorityText(testCase.priority)}
                        </span>
                    </div>
                </div>
                
                <div class="detail-content">
                    <div class="detail-section">
                        <h4>基本信息</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>用例ID:</label>
                                <span>${testCase.id}</span>
                            </div>
                            <div class="info-item">
                                <label>所属模块:</label>
                                <span>${testCase.module}</span>
                            </div>
                            <div class="info-item">
                                <label>测试类型:</label>
                                <span>${testCase.type}</span>
                            </div>
                            <div class="info-item">
                                <label>执行人:</label>
                                <span>${testCase.assignee}</span>
                            </div>
                            <div class="info-item">
                                <label>自动化状态:</label>
                                <span>${this.getAutomationText(testCase.automationStatus)}</span>
                            </div>
                            <div class="info-item">
                                <label>执行次数:</label>
                                <span>${testCase.executionCount}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>用例描述</h4>
                        <p>${testCase.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>前置条件</h4>
                        <p>${testCase.precondition}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>测试步骤</h4>
                        <ol class="test-steps">
                            ${testCase.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    
                    <div class="detail-section">
                        <h4>预期结果</h4>
                        <p class="expected-result">${testCase.expectedResult}</p>
                    </div>
                    
                    ${testCase.actualResult && testCase.actualResult !== '尚未执行' ? `
                        <div class="detail-section">
                            <h4>实际结果</h4>
                            <p class="actual-result ${testCase.status}">${testCase.actualResult}</p>
                        </div>
                    ` : ''}
                    
                    <div class="detail-section">
                        <h4>用例标签</h4>
                        <div class="case-tags">
                            ${testCase.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        app.showModal('测试用例详情', content);
    }

    // 执行测试用例
    executeTestCase(caseId) {
        const testCase = this.testCases.find(tc => tc.id === caseId);
        if (!testCase) return;

        const content = `
            <div class="execute-case-form">
                <h4>执行测试用例：${testCase.title}</h4>
                <div class="form-group">
                    <label class="form-label">执行结果</label>
                    <select class="form-select" id="executionResult">
                        <option value="passed">通过</option>
                        <option value="failed">失败</option>
                        <option value="blocked">阻塞</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">实际结果</label>
                    <textarea class="form-control" id="actualResult" rows="4" placeholder="请输入实际执行结果..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">执行环境</label>
                    <select class="form-select">
                        <option>测试环境</option>
                        <option>开发环境</option>
                        <option>预生产环境</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <textarea class="form-control" rows="2" placeholder="执行备注（可选）..."></textarea>
                </div>
            </div>
        `;

        app.showModal('执行测试用例', content, () => {
            const result = document.getElementById('executionResult').value;
            app.hideModal();
            this.showNotification(`测试用例执行完成，结果：${this.getStatusText(result)}`, 'success');
        });
    }

    // 创建测试用例
    createTestCase() {
        const content = `
            <form class="test-case-form">
                <div class="form-group">
                    <label class="form-label">用例标题</label>
                    <input type="text" class="form-control" placeholder="请输入测试用例标题">
                </div>
                <div class="form-group">
                    <label class="form-label">用例描述</label>
                    <textarea class="form-control" rows="3" placeholder="请输入测试用例描述"></textarea>
                </div>
                <div class="form-row">
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
                        <label class="form-label">测试类型</label>
                        <select class="form-select">
                            <option>功能测试</option>
                            <option>接口测试</option>
                            <option>性能测试</option>
                            <option>安全测试</option>
                            <option>UI测试</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">执行人</label>
                        <select class="form-select">
                            <option>张测试员</option>
                            <option>李测试员</option>
                            <option>王测试员</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">前置条件</label>
                    <textarea class="form-control" rows="2" placeholder="请输入前置条件"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">测试步骤</label>
                    <textarea class="form-control" rows="4" placeholder="请输入测试步骤（每行一个步骤）"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">预期结果</label>
                    <textarea class="form-control" rows="3" placeholder="请输入预期结果"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">用例标签</label>
                    <input type="text" class="form-control" placeholder="请输入标签，用逗号分隔">
                </div>
            </form>
        `;

        app.showModal('创建测试用例', content, () => {
            app.hideModal();
            this.showNotification('测试用例创建成功！', 'success');
        });
    }

    // 批量执行
    batchExecute() {
        if (this.selectedCases.size === 0) {
            this.showNotification('请先选择要执行的测试用例', 'warning');
            return;
        }

        const content = `
            <div class="batch-execute-form">
                <h4>批量执行测试用例</h4>
                <p>已选择 <strong>${this.selectedCases.size}</strong> 个测试用例</p>
                <div class="form-group">
                    <label class="form-label">执行环境</label>
                    <select class="form-select">
                        <option>测试环境</option>
                        <option>开发环境</option>
                        <option>预生产环境</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">执行模式</label>
                    <select class="form-select">
                        <option>顺序执行</option>
                        <option>并行执行</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" checked> 失败时继续执行
                    </label>
                </div>
            </div>
        `;

        app.showModal('批量执行测试用例', content, () => {
            app.hideModal();
            this.showNotification(`已开始执行 ${this.selectedCases.size} 个测试用例`, 'info');
            this.selectedCases.clear();
        });
    }

    // 编辑测试用例
    editTestCase(caseId) {
        app.showModal('编辑测试用例', '编辑功能开发中...');
    }

    // 复制测试用例
    duplicateTestCase(caseId) {
        app.showModal('复制测试用例', `复制测试用例 ${caseId}...`);
    }

    // 导入测试用例
    importCases() {
        app.showModal('导入测试用例', '导入功能开发中...');
    }

    // 导出测试用例
    exportCases() {
        app.showModal('导出测试用例', '导出功能开发中...');
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

    // 添加测试用例相关样式
    addTestCaseStyles() {
        if (document.getElementById('test-case-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'test-case-styles';
        styles.textContent = `
            .case-info {
                max-width: 300px;
            }

            .case-title {
                font-weight: 500;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
                font-size: 0.9rem;
            }

            .case-description {
                color: var(--text-secondary);
                font-size: 0.8rem;
                line-height: 1.3;
                margin-bottom: 0.5rem;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .case-tags {
                display: flex;
                gap: 0.25rem;
                flex-wrap: wrap;
            }

            .tag {
                background: rgba(102, 126, 234, 0.2);
                color: #667eea;
                padding: 0.1rem 0.4rem;
                border-radius: 999px;
                font-size: 0.7rem;
                font-weight: 500;
            }

            .module-badge {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                padding: 0.25rem 0.6rem;
                border-radius: var(--border-radius-sm);
                font-size: 0.8rem;
                font-weight: 500;
            }

            .automation-badge {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.8rem;
                color: var(--text-secondary);
            }

            .automation-badge.automated {
                color: #10b981;
            }

            .automation-badge.manual {
                color: #f59e0b;
            }

            .automation-badge.pending {
                color: #6b7280;
            }

            .execution-count {
                font-weight: 600;
                color: var(--text-primary);
            }

            .last-executed {
                font-size: 0.8rem;
                color: var(--text-muted);
            }

            .action-buttons {
                display: flex;
                gap: 0.25rem;
            }

            .test-case-detail {
                max-width: 700px;
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

            .test-steps {
                padding-left: 1.5rem;
                color: var(--text-secondary);
            }

            .test-steps li {
                margin-bottom: 0.5rem;
                line-height: 1.4;
            }

            .expected-result {
                color: var(--text-secondary);
                background: rgba(59, 130, 246, 0.1);
                padding: 1rem;
                border-radius: var(--border-radius);
                border-left: 4px solid #3b82f6;
                margin: 0;
            }

            .actual-result {
                padding: 1rem;
                border-radius: var(--border-radius);
                margin: 0;
                border-left: 4px solid;
            }

            .actual-result.passed {
                background: rgba(16, 185, 129, 0.1);
                border-left-color: #10b981;
                color: #10b981;
            }

            .actual-result.failed {
                background: rgba(239, 68, 68, 0.1);
                border-left-color: #ef4444;
                color: #ef4444;
            }

            .actual-result.blocked {
                background: rgba(245, 158, 11, 0.1);
                border-left-color: #f59e0b;
                color: #f59e0b;
            }

            .execute-case-form h4 {
                color: var(--text-primary);
                margin: 0 0 1.5rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .batch-execute-form h4 {
                color: var(--text-primary);
                margin: 0 0 1rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .batch-execute-form p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }

            .test-case-form .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            @media (max-width: 768px) {
                .filter-controls {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0.5rem;
                }
                
                .action-buttons {
                    flex-direction: column;
                }
                
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .test-case-form .form-row {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(styles);
    }
}

// 全局测试用例管理实例
window.testCaseManager = new TestCaseManager();