// ==================== 工具函数 ====================

// 返回顶部功能 - 使用jQuery事件处理和动画
function initBackToTop() {
    const $backToTop = $('#backToTop');
    
    // 滚动事件 - 使用jQuery事件处理
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $backToTop.addClass('visible').fadeIn(300); // 动画效果：淡入
        } else {
            $backToTop.removeClass('visible').fadeOut(300); // 动画效果：淡出
        }
    });
    
    // 点击返回顶部 - 使用jQuery动画
    $backToTop.on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 600); // 动画效果：平滑滚动
    });
}

// 显示提示消息 - 使用jQuery动画
function showToast(message, type) {
    const $toast = $('#messageToast');
    $toast.removeClass('success error').addClass(type).text(message);
    
    // 动画效果：滑入
    $toast.addClass('show');
    
    // 3秒后自动隐藏
    setTimeout(function() {
        $toast.removeClass('show');
    }, 3000);
}

// 删除卡片 - 使用jQuery Ajax
function deleteCard(cardId, $cardElement, callback) {
    // 确认对话框
    if (!confirm('确定要删除这张卡片吗？此操作不可恢复！')) {
        return;
    }
    
    // 调用后端API删除卡片
    $.ajax({
        url: `${API_BASE_URL}/cards/${cardId}`,
        type: 'DELETE',
        success: function(response) {
            if (response.success) {
                showToast('卡片删除成功', 'success');
                
                // 如果提供了卡片元素，执行删除动画
                if ($cardElement) {
                    $cardElement.fadeOut(300, function() {
                        $(this).remove(); // DOM操作：删除元素
                    });
                }
                
                // 从本地数据中移除
                cardsData = cardsData.filter(c => c.id !== cardId);
                saveCardsToStorage();
                
                // 如果提供了回调函数，执行回调
                if (callback) {
                    callback();
                } else {
                    // 重新加载页面数据
                    loadCardsFromAPI(function() {
                        renderCards(cardsData);
                    });
                }
            } else {
                showToast('删除失败: ' + response.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            let errorMsg = '删除卡片失败';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMsg = xhr.responseJSON.message;
            }
            showToast(errorMsg, 'error');
        }
    });
}




