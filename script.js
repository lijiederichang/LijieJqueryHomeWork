// API基础URL
const API_BASE_URL = 'http://localhost:8080/api';

// 卡片数据存储（从后端加载）
let cardsData = [];
let userId = 'default'; // 用户ID，可以从localStorage获取

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

// 初始化
$(document).ready(function() {
    // 从后端API加载数据
    loadCardsFromAPI(function() {
        // 根据当前页面执行不同的初始化
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (currentPage === 'index.html' || currentPage === '') {
            initIndexPage();
        } else if (currentPage === 'add-card.html') {
            initAddCardPage();
        } else if (currentPage === 'detail.html') {
            initDetailPage();
        } else if (currentPage === 'category.html') {
            initCategoryPage();
        } else if (currentPage === 'favorites.html') {
            initFavoritesPage();
        } else if (currentPage === 'edit-card.html') {
            initEditCardPage();
        }
    });
    
    // 返回顶部功能
    initBackToTop();
});

// ==================== 首页功能 ====================

function initIndexPage() {
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

// ==================== 添加卡片页面功能 ====================

function initAddCardPage() {
    // 表单提交 - 使用jQuery事件处理和Ajax
    $('#cardForm').on('submit', function(e) {
        e.preventDefault();
        submitCardForm();
    });
    
    // 表单重置 - 使用jQuery事件处理
    $('#cardForm').on('reset', function() {
        $('#formMessage').removeClass('success error').hide(); // DOM操作：修改类名和显示状态
        $('#imagePreview').empty(); // 清空图片预览
    });
    
    // 实时验证 - 使用jQuery事件处理
    $('#cardTitle, #cardDescription, #cardCategory').on('blur', function() {
        validateField($(this)); // 基本选择器：ID选择器
    });
    
    // 图片预览功能 - 使用jQuery事件处理
    $('#cardImage').on('change', function(e) {
        handleImagePreview(e);
    });
}

// 图片预览处理 - 使用jQuery DOM操作和FileReader
function handleImagePreview(e) {
    const file = e.target.files[0];
    const $preview = $('#imagePreview');
    
    if (!file) {
        $preview.empty();
        return;
    }
    
    // 验证文件类型
    if (!file.type.match('image.*')) {
        showFormMessage('请选择图片文件', 'error');
        $('#cardImage').val('');
        $preview.empty();
        return;
    }
    
    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
        showFormMessage('图片大小不能超过5MB', 'error');
        $('#cardImage').val('');
        $preview.empty();
        return;
    }
    
    // 使用FileReader读取文件
    const reader = new FileReader();
    reader.onload = function(e) {
        const $img = $('<img>').attr('src', e.target.result).addClass('preview-image');
        $preview.empty().append($img); // DOM操作：清空并添加预览图片
    };
    reader.readAsDataURL(file);
}

// 表单提交 - 使用jQuery Ajax和FormData，调用后端API
function submitCardForm() {
    // 使用jQuery选择器获取表单数据
    const formData = {
        title: $('#cardTitle').val(), // 基本选择器
        description: $('#cardDescription').val(),
        category: $('#cardCategory').val(),
        author: $('#cardAuthor').val() || '匿名'
    };
    
    // 验证必填字段
    if (!formData.title || !formData.description || !formData.category) {
        showFormMessage('请填写所有必填字段', 'error');
        return;
    }
    
    // 获取上传的图片文件
    const imageFile = $('#cardImage')[0].files[0];
    
    // 使用FormData上传文件 - 使用jQuery Ajax
    const formDataObj = new FormData();
    if (imageFile) {
        formDataObj.append('image', imageFile);
    }
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('category', formData.category);
    formDataObj.append('author', formData.author);
    
    // 调用后端API创建卡片
    $.ajax({
        url: `${API_BASE_URL}/cards`,
        type: 'POST',
        data: formDataObj,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                showFormMessage('卡片添加成功！', 'success');
                
                // 动画效果：表单淡出后重置
                $('#cardForm').fadeOut(300, function() {
                    $(this)[0].reset(); // DOM操作：重置表单
                    $('#imagePreview').empty(); // 清空预览
                    $(this).fadeIn(300);
                    $('#formMessage').delay(2000).fadeOut(300);
                });
                
                // 3秒后跳转到首页
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                showFormMessage('添加失败: ' + response.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            let errorMsg = '添加卡片失败';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMsg = xhr.responseJSON.message;
            }
            showFormMessage(errorMsg, 'error');
        }
    });
}

// 表单验证
function validateField($field) {
    const value = $field.val().trim();
    const fieldId = $field.attr('id'); // 属性操作：读取属性
    
    if (fieldId === 'cardTitle' || fieldId === 'cardDescription' || fieldId === 'cardCategory') {
        if (!value) {
            $field.css('border-color', 'var(--error-color)'); // 属性操作：修改样式
        } else {
            $field.css('border-color', 'var(--border-color)');
        }
    }
}

// 显示表单消息
function showFormMessage(message, type) {
    const $message = $('#formMessage');
    $message.removeClass('success error').addClass(type).text(message).show(); // DOM操作：修改类名、文本和显示状态
}

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
                // 失败时从本地数据查找
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
        // 如果是相对路径，添加API基础URL
        let imageUrl = card.image;
        if (imageUrl.startsWith('images/')) {
            imageUrl = `http://localhost:8080/${imageUrl}`;
        }
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

// ==================== 通用功能 ====================

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

// ==================== 删除功能 ====================

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

// ==================== 编辑卡片页面功能 ====================

function initEditCardPage() {
    // 获取URL参数中的卡片ID
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = parseInt(urlParams.get('id'));
    
    if (!cardId) {
        showFormMessage('无效的卡片ID', 'error');
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // 从后端API加载卡片数据
    $.ajax({
        url: `${API_BASE_URL}/cards/${cardId}`,
        type: 'GET',
        success: function(response) {
            if (response.success) {
                const card = response.data;
                // 填充表单
                $('#cardTitle').val(card.title);
                $('#cardDescription').val(card.description);
                $('#cardCategory').val(card.category);
                $('#cardAuthor').val(card.author || '');
                
                // 显示当前图片
                if (card.imagePath) {
                    let imageUrl = card.imagePath;
                    if (imageUrl.startsWith('images/')) {
                        imageUrl = `http://localhost:8080/${imageUrl}`;
                    }
                    const $currentImg = $('<img>').attr('src', imageUrl).addClass('preview-image');
                    $('#currentImage').html('<label>当前图片：</label>').append($currentImg);
                }
                
                // 保存卡片ID到表单
                $('#cardForm').data('card-id', cardId);
            } else {
                showFormMessage('加载卡片失败', 'error');
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 2000);
            }
        },
        error: function() {
            showFormMessage('加载卡片失败', 'error');
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 2000);
        }
    });
    
    // 表单提交 - 使用jQuery事件处理
    $('#cardForm').on('submit', function(e) {
        e.preventDefault();
        updateCardForm();
    });
    
    // 取消按钮
    $('#cancelBtn').on('click', function() {
        if (confirm('确定要取消编辑吗？未保存的修改将丢失。')) {
            window.location.href = 'index.html';
        }
    });
    
    // 图片预览功能
    $('#cardImage').on('change', function(e) {
        handleImagePreview(e);
        // 隐藏当前图片提示
        $('#currentImage').hide();
    });
    
    // 实时验证
    $('#cardTitle, #cardDescription, #cardCategory').on('blur', function() {
        validateField($(this));
    });
}

// 更新卡片表单提交 - 使用jQuery Ajax和FormData
function updateCardForm() {
    const cardId = $('#cardForm').data('card-id');
    if (!cardId) {
        showFormMessage('卡片ID不存在', 'error');
        return;
    }
    
    // 使用jQuery选择器获取表单数据
    const formData = {
        title: $('#cardTitle').val(),
        description: $('#cardDescription').val(),
        category: $('#cardCategory').val(),
        author: $('#cardAuthor').val() || '匿名'
    };
    
    // 验证必填字段
    if (!formData.title || !formData.description || !formData.category) {
        showFormMessage('请填写所有必填字段', 'error');
        return;
    }
    
    // 获取上传的图片文件
    const imageFile = $('#cardImage')[0].files[0];
    
    // 使用FormData更新卡片（支持文件上传）
    const formDataObj = new FormData();
    if (imageFile) {
        formDataObj.append('image', imageFile);
    }
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('category', formData.category);
    formDataObj.append('author', formData.author);
    
    // 调用后端API更新卡片（使用POST方法支持文件上传）
    $.ajax({
        url: `${API_BASE_URL}/cards/${cardId}/update`,
        type: 'POST',
        data: formDataObj,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                showFormMessage('卡片更新成功！', 'success');
                
                // 动画效果：表单淡出
                $('#cardForm').fadeOut(300, function() {
                    $('#formMessage').delay(2000).fadeOut(300);
                });
                
                // 3秒后跳转到详情页
                setTimeout(function() {
                    window.location.href = `detail.html?id=${cardId}`;
                }, 3000);
            } else {
                showFormMessage('更新失败: ' + response.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            let errorMsg = '更新卡片失败';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMsg = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.message) {
                        errorMsg = errorResponse.message;
                    }
                } catch (e) {
                    errorMsg = '更新卡片失败: ' + error;
                }
            }
            showFormMessage(errorMsg, 'error');
            console.error('更新错误:', xhr, status, error);
        }
    });
}


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

