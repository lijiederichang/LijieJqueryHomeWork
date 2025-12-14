// ==================== 首页功能 ====================

function initIndexPage() {
    // 初始化轮播图
    if (cardsData.length > 0) {
        const $carouselContainer = $('#carouselContainer');
        if ($carouselContainer.length > 0) {
            const $carousel = createCarouselFromCards(cardsData);
            $carouselContainer.append($carousel);
            // 延迟初始化，确保DOM已渲染
            setTimeout(function() {
                initCarousel();
            }, 100);
        }
    }
    
    // 渲染所有卡片
    renderCards(cardsData);
    
    // 搜索功能 - 使用jQuery事件处理
    $('#searchBtn').on('click', function() {
        performSearch();
    });
    
    // 回车键搜索 - 使用jQuery事件处理
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            performSearch();
        }
    });
    
    // 分类筛选功能 - 使用jQuery选择器和事件处理
    $('#categoryFilter').on('change', function() {
        performFilter();
    });
    
    // 重置筛选
    $('#resetFilter').on('click', function() {
        $('#categoryFilter').val('all');
        $('#searchInput').val('');
        renderCards(cardsData);
        showToast('筛选已重置', 'success');
    });
    
    // 卡片点击事件 - 使用jQuery事件委托
    $(document).on('click', '.card', function() {
        const cardId = $(this).data('id');
        window.location.href = `detail.html?id=${cardId}`;
    });
    
    // 点赞功能 - 使用jQuery事件委托和动画
    $(document).on('click', '.like-btn', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        const cardId = $(this).closest('.card').data('id');
        toggleLike(cardId, $(this));
    });
    
    // 编辑功能 - 使用jQuery事件委托
    $(document).on('click', '.edit-btn', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        const cardId = $(this).closest('.card').data('id');
        window.location.href = `edit-card.html?id=${cardId}`;
    });
    
    // 删除功能 - 使用jQuery事件委托
    $(document).on('click', '.delete-btn', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        const cardId = $(this).closest('.card').data('id');
        deleteCard(cardId, $(this).closest('.card'));
    });
}


