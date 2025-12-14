// ==================== 我的喜欢页面功能 ====================

function initFavoritesPage() {
    // 加载并显示喜欢的卡片
    loadFavorites();
    
    // 卡片点击事件
    $(document).on('click', '.card', function() {
        const cardId = $(this).data('id');
        window.location.href = `detail.html?id=${cardId}`;
    });
    
    // 点赞功能 - 取消点赞后从喜欢列表移除
    $(document).on('click', '.like-btn', function(e) {
        e.stopPropagation();
        const cardId = $(this).closest('.card').data('id');
        const card = cardsData.find(c => c.id === cardId);
        
        if (card && card.liked) {
            // 取消点赞
            toggleLike(cardId, $(this));
            // 重新加载喜欢列表
            setTimeout(function() {
                loadFavorites();
            }, 300);
        } else {
            toggleLike(cardId, $(this));
        }
    });
}

// 加载喜欢的卡片 - 从后端API加载
function loadFavorites() {
    // 从后端API获取用户喜欢的卡片
    $.ajax({
        url: `${API_BASE_URL}/cards/favorites`,
        type: 'GET',
        data: { userId: userId },
        success: function(response) {
            if (response.success) {
                const favoriteCards = response.data.map(function(card) {
                    return {
                        id: card.id,
                        title: card.title,
                        description: card.description,
                        image: card.imagePath || '',
                        category: card.category,
                        author: card.author || '匿名',
                        likes: card.likes || 0,
                        liked: true
                    };
                });
                
                const $container = $('#favoritesContainer');
                const $noFavorites = $('#noFavorites');
                
                if (favoriteCards.length === 0) {
                    $container.hide();
                    $noFavorites.fadeIn(300); // 动画效果：淡入
                } else {
                    $noFavorites.hide();
                    $container.empty().show();
                    
                    // 渲染喜欢的卡片
                    favoriteCards.forEach(function(card) {
                        const $card = createCardElement(card);
                        $container.append($card);
                    });
                    
                    // 动画效果：卡片依次淡入
                    $container.find('.card').each(function(index) {
                        $(this).css('opacity', 0).delay(index * 100).animate({
                            opacity: 1
                        }, 300);
                    });
                }
            }
        },
        error: function() {
            // 失败时从本地数据加载
            loadCardsFromStorage();
            const favoriteCards = cardsData.filter(function(card) {
                return card.liked === true;
            });
            
            const $container = $('#favoritesContainer');
            const $noFavorites = $('#noFavorites');
            
            if (favoriteCards.length === 0) {
                $container.hide();
                $noFavorites.fadeIn(300);
            } else {
                $noFavorites.hide();
                $container.empty().show();
                
                favoriteCards.forEach(function(card) {
                    const $card = createCardElement(card);
                    $container.append($card);
                });
                
                $container.find('.card').each(function(index) {
                    $(this).css('opacity', 0).delay(index * 100).animate({
                        opacity: 1
                    }, 300);
                });
            }
        }
    });
}




