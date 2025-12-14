// ==================== 额外动画效果 ====================

// 卡片悬停动画效果（使用CSS类，因为jQuery animate不支持transform）
function initCardHoverEffects() {
    // 悬停效果已通过CSS实现，这里可以添加额外的JavaScript效果
    $(document).on('mouseenter', '.card', function() {
        const $card = $(this);
        // 添加脉冲效果
        $card.addClass('card-hover');
    });
    
    $(document).on('mouseleave', '.card', function() {
        const $card = $(this);
        $card.removeClass('card-hover');
    });
}

// 加载动画
function showLoadingAnimation($container) {
    const $loader = $('<div>').addClass('loading-spinner');
    $loader.html('<div class="spinner"></div><p>加载中...</p>');
    $container.append($loader);
    $loader.fadeIn(300);
}

function hideLoadingAnimation() {
    $('.loading-spinner').fadeOut(300, function() {
        $(this).remove();
    });
}

// 脉冲动画（用于强调元素）
function pulseAnimation($element) {
    $element.animate({
        transform: 'scale(1.1)'
    }, 200, function() {
        $(this).animate({
            transform: 'scale(1)'
        }, 200);
    });
}

// 摇摆动画（用于错误提示）
function shakeAnimation($element) {
    const originalPosition = $element.position();
    $element.css('position', 'relative');
    
    for (let i = 0; i < 5; i++) {
        $element.animate({
            left: '-=10px'
        }, 50).animate({
            left: '+=20px'
        }, 50).animate({
            left: '-=10px'
        }, 50);
    }
    
    $element.animate({
        left: originalPosition.left
    }, 100);
}

// 打字机效果
function typewriterEffect($element, text, speed = 50) {
    $element.text('');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            $element.text($element.text() + text.charAt(i));
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 数字递增动画
function countUpAnimation($element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            $element.text(target);
            clearInterval(timer);
        } else {
            $element.text(Math.floor(current));
        }
    }, 16);
}

// 淡入向上滑动动画
function fadeInUp($element, delay = 0) {
    $element.css({
        opacity: 0,
        transform: 'translateY(30px)'
    });
    
    setTimeout(function() {
        $element.animate({
            opacity: 1,
            transform: 'translateY(0)'
        }, 500);
    }, delay);
}

// 3D翻转动画
function flip3D($element) {
    $element.css({
        transform: 'rotateY(180deg)',
        transition: 'transform 0.6s'
    });
    
    setTimeout(function() {
        $element.css({
            transform: 'rotateY(0deg)'
        });
    }, 600);
}

// 弹跳动画
function bounceAnimation($element) {
    $element.animate({
        transform: 'translateY(-20px)'
    }, 200, function() {
        $(this).animate({
            transform: 'translateY(0)'
        }, 200, function() {
            $(this).animate({
                transform: 'translateY(-10px)'
            }, 150, function() {
                $(this).animate({
                    transform: 'translateY(0)'
                }, 150);
            });
        });
    });
}

// 初始化所有动画效果
function initAllAnimations() {
    initCardHoverEffects();
}

