// ==================== 轮播图功能 ====================

// 初始化轮播图
function initCarousel() {
    const $carousel = $('#carousel');
    if ($carousel.length === 0) return;
    
    const $slides = $carousel.find('.carousel-slide');
    const $prevBtn = $carousel.find('.carousel-prev');
    const $nextBtn = $carousel.find('.carousel-next');
    const $indicators = $carousel.find('.carousel-indicator');
    
    let currentIndex = 0;
    const totalSlides = $slides.length;
    let autoPlayInterval = null;
    
    // 显示指定索引的幻灯片
    function showSlide(index) {
        // 确保索引在有效范围内
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        // 隐藏所有幻灯片
        $slides.each(function(i) {
            if (i === currentIndex) {
                $(this).fadeIn(500); // 淡入动画
            } else {
                $(this).fadeOut(300); // 淡出动画
            }
        });
        
        // 更新指示器
        $indicators.removeClass('active');
        $indicators.eq(currentIndex).addClass('active');
    }
    
    // 下一张
    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    // 上一张
    function prevSlide() {
        showSlide(currentIndex - 1);
    }
    
    // 自动播放
    function startAutoPlay() {
        autoPlayInterval = setInterval(function() {
            nextSlide();
        }, 4000); // 每4秒切换
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // 按钮事件
    $nextBtn.on('click', function() {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });
    
    $prevBtn.on('click', function() {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });
    
    // 指示器点击事件
    $indicators.on('click', function() {
        stopAutoPlay();
        const index = $(this).index();
        showSlide(index);
        startAutoPlay();
    });
    
    // 鼠标悬停暂停自动播放
    $carousel.on('mouseenter', function() {
        stopAutoPlay();
    }).on('mouseleave', function() {
        startAutoPlay();
    });
    
    // 初始化显示第一张
    showSlide(0);
    
    // 开始自动播放
    startAutoPlay();
    
    // 触摸滑动支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;
    
    $carousel.on('touchstart', function(e) {
        touchStartX = e.originalEvent.touches[0].clientX;
    });
    
    $carousel.on('touchend', function(e) {
        touchEndX = e.originalEvent.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑动，下一张
                nextSlide();
            } else {
                // 向右滑动，上一张
                prevSlide();
            }
        }
    }
}

// 创建轮播图元素（从卡片数据）
function createCarouselFromCards(cards) {
    if (!cards || cards.length === 0) return;
    
    // 取前5张卡片作为轮播内容
    const featuredCards = cards.slice(0, Math.min(5, cards.length));
    
    const $carousel = $('<div>').addClass('carousel').attr('id', 'carousel');
    const $slidesContainer = $('<div>').addClass('carousel-slides');
    const $indicatorsContainer = $('<div>').addClass('carousel-indicators');
    
    // 创建幻灯片
    featuredCards.forEach(function(card, index) {
        const $slide = $('<div>').addClass('carousel-slide');
        
        // 图片
        if (card.image) {
            let imageUrl = card.image;
            if (imageUrl.startsWith('images/')) {
                imageUrl = `http://localhost:8080/${imageUrl}`;
            }
            const $img = $('<img>').attr('src', imageUrl).attr('alt', card.title);
            $slide.append($img);
        }
        
        // 内容
        const $content = $('<div>').addClass('carousel-content');
        const $title = $('<h3>').addClass('carousel-title').text(card.title);
        const $description = $('<p>').addClass('carousel-description').text(card.description);
        const $link = $('<a>').addClass('carousel-link').attr('href', `detail.html?id=${card.id}`).text('查看详情 →');
        
        $content.append($title, $description, $link);
        $slide.append($content);
        
        $slidesContainer.append($slide);
        
        // 创建指示器
        const $indicator = $('<span>').addClass('carousel-indicator');
        if (index === 0) {
            $indicator.addClass('active');
        }
        $indicatorsContainer.append($indicator);
    });
    
    // 创建导航按钮
    const $prevBtn = $('<button>').addClass('carousel-btn carousel-prev').html('‹');
    const $nextBtn = $('<button>').addClass('carousel-btn carousel-next').html('›');
    
    $carousel.append($prevBtn, $nextBtn, $slidesContainer, $indicatorsContainer);
    
    return $carousel;
}



