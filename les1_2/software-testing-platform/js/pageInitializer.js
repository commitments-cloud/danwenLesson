// 页面初始化脚本 - 确保所有页面都能正确加载数据
document.addEventListener('DOMContentLoaded', function() {
    // 确保所有必需的管理器都已初始化
    console.log('正在初始化页面管理器...');
    
    // 检查并初始化测试用例管理器
    if (typeof TestCaseManager !== 'undefined') {
        if (!window.testCaseManager) {
            window.testCaseManager = new TestCaseManager();
            console.log('✓ 测试用例管理器已初始化');
        }
    } else {
        console.error('❌ TestCaseManager类未找到');
    }
    
    // 检查并初始化缺陷管理器
    if (typeof DefectManager !== 'undefined') {
        if (!window.defectManager) {
            window.defectManager = new DefectManager();
            console.log('✓ 缺陷管理器已初始化');
        }
    } else {
        console.error('❌ DefectManager类未找到');
    }
    
    // 监听页面切换事件，确保数据正确渲染
    const originalLoadPage = app.loadPage;
    app.loadPage = function(page) {
        console.log(`正在加载页面: ${page}`);
        
        // 调用原始加载方法
        originalLoadPage.call(this, page);
        
        // 延迟确保数据正确加载
        setTimeout(() => {
            switch(page) {
                case 'test-cases':
                    if (window.testCaseManager) {
                        console.log('重新渲染测试用例页面...');
                        window.testCaseManager.render();
                    }
                    break;
                case 'defects':
                    if (window.defectManager) {
                        console.log('重新渲染缺陷管理页面...');
                        window.defectManager.render();
                    }
                    break;
            }
        }, 100);
    };
    
    // 添加调试信息
    console.log('页面初始化完成，可用的管理器：');
    console.log('- app:', typeof app !== 'undefined' ? '✓' : '❌');
    console.log('- testCaseManager:', typeof testCaseManager !== 'undefined' ? '✓' : '❌');
    console.log('- defectManager:', typeof defectManager !== 'undefined' ? '✓' : '❌');
    console.log('- MockData:', typeof MockData !== 'undefined' ? '✓' : '❌');
});

// 添加页面刷新功能
window.refreshCurrentPage = function() {
    const currentPage = app.currentPage;
    console.log(`刷新当前页面: ${currentPage}`);
    app.loadPage(currentPage);
};

// 添加数据重新加载功能
window.reloadPageData = function(pageName) {
    switch(pageName) {
        case 'test-cases':
            if (window.testCaseManager) {
                window.testCaseManager.testCases = MockData.testCases || [];
                window.testCaseManager.render();
            }
            break;
        case 'defects':
            if (window.defectManager) {
                window.defectManager.defects = MockData.defects || [];
                window.defectManager.render();
            }
            break;
    }
};

console.log('页面初始化脚本加载完成');