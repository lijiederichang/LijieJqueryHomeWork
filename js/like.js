// ==================== 点赞功能 ====================

// 点赞功能 - 使用jQuery DOM操作和动画，调用后端API
function toggleLike(cardId, $button) {
    const card = cardsData.find(c => c.id === cardId);
    if (!card) return;
    
    // 调用后端API点赞/取消点赞
    $.ajax({
        url: `${API_BASE_URL}/cards/${cardId}/like`,
        type: 'POST',
        data: { userId: userId },
        success: function(response) {
            if (response.success) {
                card.liked = response.data.liked;
                card.likes = response.data.likes;
                
                // DOM操作：修改类名和内容
                if (card.liked) {
                    $button.addClass('liked').html('❤️'); // 属性操作：修改HTML
                    // 动画效果：缩放动画
                    $button.animate({
                        transform: 'scale(1.2)'
                    }, 200, function() {
                        $(this).animate({
                            transform: 'scale(1)'
                        }, 200);
                    });
                } else {
                    $button.removeClass('liked').html('🤍');
                }
                
                // 更新点赞数
                $button.find('.like-count').text(card.likes); // 层次选择器：查找子元素
                
                saveCardsToStorage(); // 同步到本地存储
                showToast(card.liked ? '已点赞' : '已取消点赞', 'success');
            }
        },
        error: function() {
            // 失败时使用本地逻辑
            card.liked = !card.liked;
            card.likes += card.liked ? 1 : -1;
            
            if (card.liked) {
                $button.addClass('liked').html('❤️');
            } else {
                $button.removeClass('liked').html('🤍');
            }
            $button.find('.like-count').text(card.likes);
            saveCardsToStorage();
            showToast(card.liked ? '已点赞' : '已取消点赞', 'success');
        }
    });
}




