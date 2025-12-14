// ==================== API相关功能 ====================

// 从后端API加载数据
function loadCardsFromAPI(callback) {
    // 检查是否在演示模式（无后端）
    if (!API_BASE_URL || API_BASE_URL.includes('localhost')) {
        // 尝试连接，如果失败则使用演示数据
        $.ajax({
            url: `${API_BASE_URL}/cards`,
            type: 'GET',
            timeout: 3000, // 3秒超时
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
                    console.warn('API返回失败，使用演示数据');
                    loadDemoData(callback);
                }
            },
            error: function(xhr, status, error) {
                // API请求失败，使用演示数据
                console.warn('API请求失败，使用演示数据:', error);
                loadDemoData(callback);
            }
        });
    } else {
        // 生产环境，正常请求
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
                // 尝试使用演示数据
                loadDemoData(callback);
            }
        });
    }
}

// 加载演示数据（无后端时使用）
function loadDemoData(callback) {
    console.log('使用演示数据模式');
    
    // 从localStorage加载修改过的示例数据
    const demoCards = getDemoCards().map(function(card) {
        return {
            id: card.id,
            title: card.title,
            description: card.description,
            image: card.image,
            category: card.category,
            author: card.author,
            likes: card.likes || 0,
            liked: card.liked || false
        };
    });
    
    // 从localStorage加载点赞状态
    loadDemoLikeStatuses();
    
    // 尝试从后端加载用户数据（如果后端可用）
    loadUserCardsFromAPI(function() {
        // 合并演示数据和用户数据
        cardsData = [...demoCards, ...cardsData];
        
        // 按创建时间倒序排列
        cardsData.sort((a, b) => {
            const timeA = a.createdAt || a.updatedAt || 0;
            const timeB = b.createdAt || b.updatedAt || 0;
            return new Date(timeB) - new Date(timeA);
        });
        
        if (callback) callback();
    });
}

// 从后端API加载用户数据
function loadUserCardsFromAPI(callback) {
    // 尝试连接后端
    $.ajax({
        url: `${API_BASE_URL}/cards`,
        type: 'GET',
        timeout: 3000,
        success: function(response) {
            if (response.success) {
                // 只加载用户数据（ID < 1000，排除示例数据）
                cardsData = response.data
                    .filter(function(card) {
                        const id = card.id;
                        return id < 1000; // 只加载后端数据，排除示例数据
                    })
                    .map(function(card) {
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
            }
            if (callback) callback();
        },
        error: function() {
            // 后端不可用，只使用示例数据
            cardsData = [];
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




