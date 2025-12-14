// ==================== 详情页功能 ====================

function initDetailPage() {
    // 使用jQuery获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = parseInt(urlParams.get('id'));
    
    if (cardId) {
        // 从后端API获取卡片详情
        $.ajax({
            url: `${API_BASE_URL}/cards/${cardId}`,
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    const card = {
                        id: response.data.id,
                        title: response.data.title,
                        description: response.data.description,
                        image: response.data.imagePath || '',
                        category: response.data.category,
                        author: response.data.author || '匿名',
                        likes: response.data.likes || 0,
                        liked: false
                    };
                    
                    // 检查点赞状态
                    $.ajax({
                        url: `${API_BASE_URL}/cards/${cardId}/like-status?userId=${userId}`,
                        type: 'GET',
                        success: function(likeResponse) {
                            if (likeResponse.success) {
                                card.liked = likeResponse.data.liked;
                            }
                            renderCardDetail(card);
                        },
                        error: function() {
                            renderCardDetail(card);
                        }
                    });
                } else {
                    $('#detailContent').html('<p>卡片不存在</p>');
                }
            },
            error: function() {
                // 失败时从本地数据查找（包括演示数据）
                const card = cardsData.find(c => c.id === cardId);
                if (card) {
                    renderCardDetail(card);
                } else {
                    $('#detailContent').html('<p>卡片不存在</p>');
                }
            }
        });
    } else {
        $('#detailContent').html('<p>无效的卡片ID</p>');
    }
    
    // 点赞功能
    $(document).on('click', '.detail-like-btn', function() {
        const cardId = parseInt($(this).data('id'));
        toggleLike(cardId, $(this));
        // 重新加载详情页
        setTimeout(function() {
            window.location.reload();
        }, 500);
    });
    
    // 编辑功能
    $(document).on('click', '.detail-actions .btn-primary', function() {
        const cardId = $(this).data('id');
        window.location.href = `edit-card.html?id=${cardId}`;
    });
    
    // 删除功能
    $(document).on('click', '.detail-actions .btn-secondary', function() {
        const cardId = $(this).data('id');
        deleteCard(cardId, null, function() {
            window.location.href = 'index.html';
        });
    });
}

// 渲染卡片详情 - 使用jQuery DOM操作
function renderCardDetail(card) {
    const categoryNames = {
        'technology': '科技',
        'art': '艺术',
        'nature': '自然',
        'sports': '运动',
        'music': '音乐',
        'game': '游戏'
    };
    
    const $content = $('#detailContent');
    $content.empty(); // DOM操作：清空内容
    
    // 创建详情元素
    let $html = $('<div>');
    
    if (card.image) {
        // 处理图片URL
        let imageUrl = card.image;
        // 如果是相对路径（本地图片），添加API基础URL
        if (imageUrl.startsWith('images/') && API_BASE_URL) {
            imageUrl = `${API_BASE_URL.replace('/api', '')}/${imageUrl}`;
        }
        // CDN图片（http://或https://开头）直接使用
        const $img = $('<img>').addClass('detail-image').attr('src', imageUrl).attr('alt', card.title);
        $html.append($img);
    }
    
    const $category = $('<span>').addClass('detail-category').text(categoryNames[card.category] || card.category);
    const $title = $('<h2>').addClass('detail-title').text(card.title);
    const $description = $('<p>').addClass('detail-description').text(card.description);
    
    const $meta = $('<div>').addClass('detail-meta');
    const $author = $('<span>').addClass('detail-author').text('作者: ' + (card.author || '匿名'));
    
    const $likeBtn = $('<button>').addClass('like-btn detail-like-btn').attr('data-id', card.id);
    if (card.liked) {
        $likeBtn.addClass('liked').html('❤️');
    } else {
        $likeBtn.html('🤍');
    }
    const $likeCount = $('<span>').addClass('like-count').text(card.likes || 0);
    $likeBtn.append($likeCount);
    
    // 添加编辑和删除按钮
    const $editBtn = $('<button>').addClass('btn-primary').text('✏️ 编辑').attr('data-id', card.id);
    const $deleteBtn = $('<button>').addClass('btn-secondary').text('🗑️ 删除').attr('data-id', card.id);
    const $actionBtns = $('<div>').addClass('detail-actions').append($editBtn, $deleteBtn);
    
    $meta.append($author, $likeBtn);
    
    // 在meta下方添加操作按钮
    $html.append($actionBtns);
    
    $html.append($category, $title, $description, $meta);
    
    $content.append($html);
    
    // 动画效果：淡入
    $content.hide().fadeIn(500);
}




