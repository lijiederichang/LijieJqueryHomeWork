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
    
    // 检查是否是示例数据（ID: 1001-1020）
    const isDemoCardFlag = isDemoCard(cardId);
    
    if (isDemoCardFlag) {
        // 示例数据：本地删除（标记为已删除，不调用后端）
        deleteDemoCard(cardId);
        
        // 从当前数据中移除（示例数据删除后，刷新页面会恢复）
        cardsData = cardsData.filter(c => c.id !== cardId);
        
        // 如果提供了卡片元素，执行删除动画
        if ($cardElement) {
            $cardElement.fadeOut(300, function() {
                $(this).remove(); // DOM操作：删除元素
            });
        }
        
        showToast('示例卡片已删除', 'success');
        
        // 如果提供了回调函数，执行回调
        if (callback) {
            callback();
        } else {
            // 重新渲染卡片
            renderCards(cardsData);
        }
        return;
    }
    
    // 用户数据或后端数据：调用后端API删除
    $.ajax({
        url: `${API_BASE_URL}/cards/${cardId}`,
        type: 'DELETE',
        timeout: 3000,
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
            // API失败，尝试本地删除
            cardsData = cardsData.filter(c => c.id !== cardId);
            if ($cardElement) {
                $cardElement.fadeOut(300, function() {
                    $(this).remove();
                });
            }
            showToast('卡片已从本地删除', 'success');
            if (callback) callback();
        }
    });
}




