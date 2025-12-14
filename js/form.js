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
    
    // 处理图片：转换为Base64或URL
    let imageData = '';
    if (imageFile) {
        // 使用FileReader转换为Base64
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            // 继续提交
            submitCardData(formData, imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // 没有图片，直接提交
        submitCardData(formData, '');
    }
}

// 提交卡片数据（调用后端API保存到MySQL）
function submitCardData(formData, imageData) {
    // 用户添加的数据：调用后端API保存到MySQL
    const formDataObj = new FormData();
    
    // 如果有图片，需要转换为File对象
    if (imageData && imageData.startsWith('data:image')) {
        // Base64转Blob
        const byteString = atob(imageData.split(',')[1]);
        const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'image.jpg', { type: mimeString });
        formDataObj.append('image', file);
    }
    
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('category', formData.category);
    formDataObj.append('author', formData.author);
    
    // 调用后端API保存到MySQL
    $.ajax({
        url: `${API_BASE_URL}/cards`,
        type: 'POST',
        data: formDataObj,
        processData: false,
        contentType: false,
        timeout: 5000,
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
            // 后端不可用，提示用户
            let errorMsg = '后端服务器不可用，无法保存数据';
            if (xhr.status === 0) {
                errorMsg = '无法连接到后端服务器，请确保后端服务已启动';
            } else if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMsg = xhr.responseJSON.message;
            }
            showFormMessage(errorMsg, 'error');
            console.error('保存失败:', error);
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
    
    // 检查是否是示例数据（ID: 1001-1020）
    const isDemoCardFlag = isDemoCard(cardId);
    
    if (isDemoCardFlag) {
        // 从示例数据加载（包含localStorage中的修改）
        const card = getDemoCardById(cardId);
        if (card) {
            fillEditForm(card, cardId);
        } else {
            showFormMessage('卡片不存在', 'error');
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 2000);
        }
    } else {
        // 从后端API加载卡片数据
        $.ajax({
            url: `${API_BASE_URL}/cards/${cardId}`,
            type: 'GET',
            timeout: 3000,
            success: function(response) {
                if (response.success) {
                    const card = response.data;
                    fillEditForm(card, cardId, card.imagePath);
                } else {
                    showFormMessage('加载卡片失败', 'error');
                    setTimeout(function() {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            },
            error: function() {
                // 后端失败，尝试从本地数据查找
                const card = cardsData.find(c => c.id === cardId);
                if (card) {
                    fillEditForm(card, cardId);
                } else {
                    showFormMessage('加载卡片失败', 'error');
                    setTimeout(function() {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            }
        });
    }
    
    // 填充编辑表单
    function fillEditForm(card, cardId, imagePath) {
        // 填充表单
        $('#cardTitle').val(card.title);
        $('#cardDescription').val(card.description);
        $('#cardCategory').val(card.category);
        $('#cardAuthor').val(card.author || '');
        
        // 显示当前图片
        const imageUrl = imagePath || card.image || '';
        if (imageUrl) {
            let displayUrl = imageUrl;
            // 处理图片URL
            if (imageUrl.startsWith('images/') && API_BASE_URL) {
                displayUrl = `${API_BASE_URL.replace('/api', '')}/${imageUrl}`;
            } else if (imageUrl.startsWith('data:image')) {
                // Base64图片直接使用
                displayUrl = imageUrl;
            } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                // CDN图片直接使用
                displayUrl = imageUrl;
            }
            const $currentImg = $('<img>').attr('src', displayUrl).addClass('preview-image');
            $('#currentImage').html('<label>当前图片：</label>').append($currentImg);
        }
        
        // 保存卡片ID到表单
        $('#cardForm').data('card-id', cardId);
    }
    
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
    
    // 检查是否是示例数据
    const isDemoCardFlag = isDemoCard(cardId);
    
    // 获取上传的图片文件
    const imageFile = $('#cardImage')[0].files[0];
    
    // 处理图片
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            updateCardData(cardId, formData, imageData, isDemoCardFlag);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // 没有新图片，保持原图片
        updateCardData(cardId, formData, null, isDemoCardFlag);
    }
}

// 更新卡片数据
function updateCardData(cardId, formData, imageData, isDemoCardFlag) {
    if (isDemoCardFlag) {
        // 示例数据：更新到localStorage（不调用后端）
        const success = updateDemoCard(cardId, {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            author: formData.author,
            image: imageData || undefined
        });
        
        if (success) {
            // 更新当前数据
            const index = cardsData.findIndex(c => c.id === cardId);
            if (index !== -1) {
                cardsData[index] = {
                    ...cardsData[index],
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    author: formData.author
                };
                if (imageData) {
                    cardsData[index].image = imageData;
                }
            }
            
            showFormMessage('示例卡片更新成功！', 'success');
            $('#cardForm').fadeOut(300, function() {
                $('#formMessage').delay(2000).fadeOut(300);
            });
            
            setTimeout(function() {
                window.location.href = `detail.html?id=${cardId}`;
            }, 3000);
        } else {
            showFormMessage('更新失败', 'error');
        }
    } else {
        // 用户数据：调用后端API更新到MySQL
        const formDataObj = new FormData();
        
        // 如果有新图片，转换为File对象
        if (imageData && imageData.startsWith('data:image')) {
            const byteString = atob(imageData.split(',')[1]);
            const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], 'image.jpg', { type: mimeString });
            formDataObj.append('image', file);
        }
        
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('category', formData.category);
        formDataObj.append('author', formData.author);
        
        $.ajax({
            url: `${API_BASE_URL}/cards/${cardId}/update`,
            type: 'POST',
            data: formDataObj,
            processData: false,
            contentType: false,
            timeout: 5000,
            success: function(response) {
                if (response.success) {
                    showFormMessage('卡片更新成功！', 'success');
                    $('#cardForm').fadeOut(300, function() {
                        $('#formMessage').delay(2000).fadeOut(300);
                    });
                    setTimeout(function() {
                        window.location.href = `detail.html?id=${cardId}`;
                    }, 3000);
                } else {
                    showFormMessage('更新失败: ' + response.message, 'error');
                }
            },
            error: function(xhr, status, error) {
                let errorMsg = '后端服务器不可用，无法更新数据';
                if (xhr.status === 0) {
                    errorMsg = '无法连接到后端服务器，请确保后端服务已启动';
                } else if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                showFormMessage(errorMsg, 'error');
            }
        });
    }
}




