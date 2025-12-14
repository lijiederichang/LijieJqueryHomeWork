// ==================== API相关功能 ====================

// 从后端API加载数据
function loadCardsFromAPI(callback) {
    $.ajax({
        url: `${API_BASE_URL}/cards`,
        type: 'GET',
        success: function(response) {
            if (response.success) {
                // 为每个卡片添加liked状态
                cardsData = response.data.map(function(card) {
                    return {
                        id: card.id,
                        title: card.title,
                        description: card.description,
                        image: card.imagePath || '',
                        category: card.category,
                        author: card.author || '匿名',
                        likes: card.likes || 0,
                        liked: false // 稍后通过API检查
                    };
                });
                
                // 加载点赞状态
                loadLikeStatuses(callback);
            } else {
                console.error('加载卡片失败:', response.message);
                loadCardsFromStorage(); // 失败时使用本地存储
                if (callback) callback();
            }
        },
        error: function(xhr, status, error) {
            console.error('API请求失败:', error);
            loadCardsFromStorage(); // 失败时使用本地存储
            if (callback) callback();
        }
    });
}

// 加载所有卡片的点赞状态
function loadLikeStatuses(callback) {
    let loaded = 0;
    const total = cardsData.length;
    
    if (total === 0) {
        if (callback) callback();
        return;
    }
    
    cardsData.forEach(function(card, index) {
        $.ajax({
            url: `${API_BASE_URL}/cards/${card.id}/like-status?userId=${userId}`,
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    card.liked = response.data.liked;
                }
                loaded++;
                if (loaded === total && callback) {
                    callback();
                }
            },
            error: function() {
                loaded++;
                if (loaded === total && callback) {
                    callback();
                }
            }
        });
    });
}

// 从localStorage加载数据（备用方案）
function loadCardsFromStorage() {
    const stored = localStorage.getItem('cardsData');
    if (stored) {
        cardsData = JSON.parse(stored);
    }
}

// 保存数据到localStorage（备用方案）
function saveCardsToStorage() {
    localStorage.setItem('cardsData', JSON.stringify(cardsData));
}




