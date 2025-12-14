// ==================== 手风琴功能 ====================

// 初始化手风琴
function initAccordion() {
    const $accordion = $('.accordion');
    if ($accordion.length === 0) return;
    
    // 为每个手风琴项绑定事件
    $accordion.find('.accordion-item').each(function() {
        const $item = $(this);
        const $header = $item.find('.accordion-header');
        const $content = $item.find('.accordion-content');
        const $icon = $header.find('.accordion-icon');
        
        // 初始状态：第一个展开，其他收起
        if ($item.index() === 0) {
            $item.addClass('active');
            $content.slideDown(300);
            $icon.addClass('rotated');
        } else {
            $content.hide();
        }
        
        // 点击头部切换
        $header.on('click', function() {
            const isActive = $item.hasClass('active');
            
            // 关闭其他项（可选：如果希望同时只能展开一个）
            $accordion.find('.accordion-item').not($item).each(function() {
                $(this).removeClass('active');
                $(this).find('.accordion-content').slideUp(300);
                $(this).find('.accordion-icon').removeClass('rotated');
            });
            
            // 切换当前项
            if (isActive) {
                // 收起
                $item.removeClass('active');
                $content.slideUp(300);
                $icon.removeClass('rotated');
            } else {
                // 展开
                $item.addClass('active');
                $content.slideDown(300);
                $icon.addClass('rotated');
            }
        });
    });
}

// 创建手风琴元素
function createAccordion(items) {
    const $accordion = $('<div>').addClass('accordion');
    
    items.forEach(function(item, index) {
        const $item = $('<div>').addClass('accordion-item');
        const $header = $('<div>').addClass('accordion-header');
        const $icon = $('<span>').addClass('accordion-icon').html('▼');
        const $title = $('<h3>').addClass('accordion-title').text(item.title);
        const $content = $('<div>').addClass('accordion-content');
        const $text = $('<p>').text(item.content);
        
        $header.append($icon, $title);
        $content.append($text);
        $item.append($header, $content);
        
        if (index === 0) {
            $item.addClass('active');
        }
        
        $accordion.append($item);
    });
    
    return $accordion;
}



