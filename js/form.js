// ==================== 表单相关功能 ====================

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




