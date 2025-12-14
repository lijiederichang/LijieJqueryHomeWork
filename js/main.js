// ==================== 主入口文件 ====================

// 初始化
$(document).ready(function() {
    // 初始化所有动画效果
    if (typeof initAllAnimations === 'function') {
        initAllAnimations();
    }
    
    // 从后端API加载数据
    loadCardsFromAPI(function() {
        // 根据当前页面执行不同的初始化
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (currentPage === 'index.html' || currentPage === '') {
            initIndexPage();
        } else if (currentPage === 'add-card.html') {
            initAddCardPage();
        } else if (currentPage === 'detail.html') {
            initDetailPage();
        } else if (currentPage === 'category.html') {
            initCategoryPage();
        } else if (currentPage === 'favorites.html') {
            initFavoritesPage();
        } else if (currentPage === 'edit-card.html') {
            initEditCardPage();
        } else if (currentPage === 'about.html') {
            initAboutPage();
        }
    });
    
    // 返回顶部功能
    initBackToTop();
});


