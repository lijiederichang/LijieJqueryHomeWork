// ==================== 分类页功能 ====================

function initCategoryPage() {
    // 分类标签点击 - 使用jQuery选择器和事件处理
    $('.category-tab').on('click', function() {
        // DOM操作：修改类名
        $('.category-tab').removeClass('active');
        $(this).addClass('active');
        
        const category = $(this).data('category'); // 属性操作：读取data属性
        
        filterCardsByCategory(category);
    });
    
    // 初始加载
    filterCardsByCategory('all');
}

// 按分类筛选卡片 - 调用后端API
function filterCardsByCategory(category) {
    $.ajax({
        url: `${API_BASE_URL}/cards`,
        type: 'GET',
        data: { category: category },
        success: function(response) {
            if (response.success) {
                const filteredCards = response.data.map(function(card) {
                    return {
                        id: card.id,
                        title: card.title,
                        description: card.description,
                        image: card.imagePath || '',
                        category: card.category,
                        author: card.author || '匿名',
                        likes: card.likes || 0,
                        liked: false
                    };
                });
                loadLikeStatuses(function() {
                    renderCategoryCards(filteredCards);
                });
            }
        },
        error: function() {
            // 失败时使用本地筛选
            let filteredCards;
            if (category === 'all') {
                filteredCards = cardsData;
            } else {
                filteredCards = cardsData.filter(function(card) {
                    return card.category === category;
                });
            }
            renderCategoryCards(filteredCards);
        }
    });
}

// 渲染分类页卡片
function renderCategoryCards(cards) {
    const $container = $('#categoryCardsContainer');
    $container.empty();
    
    if (cards.length === 0) {
        $container.html('<div class="no-results"><p>该分类下暂无卡片</p></div>');
        return;
    }
    
    cards.forEach(function(card) {
        const $card = createCardElement(card);
        $container.append($card);
    });
    
    // 动画效果：卡片依次淡入
    $container.find('.card').each(function(index) {
        $(this).css({
            opacity: 0,
            transform: 'translateY(20px)'
        }).delay(index * 50).animate({
            opacity: 1
        }, 400, function() {
            $(this).css('transform', 'translateY(0)');
        });
    });
    
    // 卡片点击事件
    $container.find('.card').on('click', function() {
        const cardId = $(this).data('id');
        window.location.href = `detail.html?id=${cardId}`;
    });
}




