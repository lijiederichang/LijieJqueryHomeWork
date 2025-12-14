// ==================== 卡片相关功能 ====================

// 创建卡片元素 - 使用jQuery DOM操作和属性操作
function createCardElement(card) {
    const categoryNames = {
        'technology': '科技',
        'art': '艺术',
        'nature': '自然',
        'sports': '运动',
        'music': '音乐',
        'game': '游戏'
    };
    
    const $card = $('<div>').addClass('card').attr('data-id', card.id); // DOM操作：创建元素，属性操作：设置data-id
    
    // 图片部分
    const $imageContainer = $('<div>').addClass('card-image');
    if (card.image) {
        // 如果是相对路径，添加API基础URL
        let imageUrl = card.image;
        if (imageUrl.startsWith('images/')) {
            imageUrl = `http://localhost:8080/${imageUrl}`;
        }
        const $img = $('<img>').attr('src', imageUrl).attr('alt', card.title); // 属性操作：设置src和alt
        $img.on('error', function() {
            $(this).replaceWith($('<div>').text('🖼️')); // DOM操作：替换元素
        });
        $imageContainer.append($img);
    } else {
        $imageContainer.text('🖼️');
    }
    
    // 内容部分
    const $content = $('<div>').addClass('card-content');
    const $category = $('<span>').addClass('card-category').text(categoryNames[card.category] || card.category);
    const $title = $('<h3>').addClass('card-title').text(card.title); // 属性操作：设置文本内容
    const $description = $('<p>').addClass('card-description').text(card.description);
    
    // 底部
    const $footer = $('<div>').addClass('card-footer');
    const $author = $('<span>').addClass('card-author').text('作者: ' + (card.author || '匿名'));
    
    const $actions = $('<div>').addClass('card-actions');
    const $likeBtn = $('<button>').addClass('like-btn').attr('type', 'button').attr('title', '点赞');
    if (card.liked) {
        $likeBtn.addClass('liked').html('❤️'); // 属性操作：设置HTML内容
    } else {
        $likeBtn.html('🤍');
    }
    const $likeCount = $('<span>').addClass('like-count').text(card.likes || 0);
    $likeBtn.append($likeCount);
    
    // 添加编辑和删除按钮
    const $editBtn = $('<button>').addClass('edit-btn').attr('type', 'button').html('✏️').attr('title', '编辑');
    const $deleteBtn = $('<button>').addClass('delete-btn').attr('type', 'button').html('🗑️').attr('title', '删除');
    
    $actions.append($likeBtn, $editBtn, $deleteBtn);
    $footer.append($author, $actions);
    
    $content.append($category, $title, $description, $footer);
    $card.append($imageContainer, $content);
    
    return $card;
}

// 渲染卡片 - 使用jQuery DOM操作
function renderCards(cards) {
    const $container = $('#cardsContainer');
    $container.empty(); // DOM操作：清空容器
    
    if (cards.length === 0) {
        $('#noResults').fadeIn(300); // 动画效果：淡入
        return;
    }
    
    $('#noResults').hide();
    
    cards.forEach(function(card) {
        const $card = createCardElement(card);
        $container.append($card); // DOM操作：添加元素
    });
    
    // 动画效果：卡片淡入
    $container.find('.card').each(function(index) {
        $(this).css('opacity', 0).delay(index * 100).animate({
            opacity: 1
        }, 300);
    });
}

// 搜索功能 - 使用jQuery选择器，调用后端API
function performSearch() {
    const searchTerm = $('#searchInput').val().trim(); // 基本选择器：ID选择器
    
    if (!searchTerm) {
        loadCardsFromAPI(function() {
            renderCards(cardsData);
        });
        return;
    }
    
    // 调用后端API搜索
    $.ajax({
        url: `${API_BASE_URL}/cards`,
        type: 'GET',
        data: { keyword: searchTerm },
        success: function(response) {
            if (response.success) {
                cardsData = response.data.map(function(card) {
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
                    renderCards(cardsData);
                    if (cardsData.length === 0) {
                        showToast('未找到匹配的卡片', 'error');
                    } else {
                        showToast(`找到 ${cardsData.length} 个结果`, 'success');
                    }
                });
            }
        },
        error: function() {
            // 失败时使用本地搜索
            const filteredCards = cardsData.filter(function(card) {
                return card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (card.author && card.author.toLowerCase().includes(searchTerm.toLowerCase()));
            });
            renderCards(filteredCards);
            if (filteredCards.length === 0) {
                showToast('未找到匹配的卡片', 'error');
            } else {
                showToast(`找到 ${filteredCards.length} 个结果`, 'success');
            }
        }
    });
}

// 筛选功能 - 使用jQuery选择器和过滤器，调用后端API
function performFilter() {
    const category = $('#categoryFilter').val(); // 基本选择器：ID选择器
    
    // 调用后端API获取筛选后的卡片
    $.ajax({
        url: `${API_BASE_URL}/cards`,
        type: 'GET',
        data: { category: category },
        success: function(response) {
            if (response.success) {
                cardsData = response.data.map(function(card) {
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
                    renderCards(cardsData);
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
            renderCards(filteredCards);
        }
    });
}




