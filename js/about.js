// ==================== 关于页面功能 ====================

function initAboutPage() {
    // 初始化手风琴FAQ
    const faqItems = [
        {
            title: '如何添加新卡片？',
            content: '点击导航栏中的"添加卡片"按钮，填写卡片标题、描述、分类等信息，并上传一张图片，然后点击提交即可。'
        },
        {
            title: '如何搜索卡片？',
            content: '在首页的搜索框中输入关键词，可以搜索卡片的标题、描述或作者信息。支持实时搜索功能。'
        },
        {
            title: '如何筛选卡片？',
            content: '使用首页的分类筛选下拉菜单，可以选择不同的分类（科技、艺术、自然、运动、音乐、游戏）来查看特定类型的卡片。'
        },
        {
            title: '如何点赞卡片？',
            content: '点击卡片上的心形按钮即可为卡片点赞。点赞后，可以在"我的喜欢"页面查看所有已点赞的卡片。'
        },
        {
            title: '如何编辑或删除卡片？',
            content: '在卡片上点击编辑按钮可以修改卡片信息，点击删除按钮可以删除卡片。这些操作需要确认后才能执行。'
        },
        {
            title: '图片上传有什么要求？',
            content: '支持JPG、PNG、GIF格式的图片，文件大小不能超过5MB。建议使用清晰、高质量的图片以获得最佳显示效果。'
        },
        {
            title: '数据会保存到哪里？',
            content: '卡片数据会保存到后端MySQL数据库中，图片文件会存储在服务器的images目录。前端使用localStorage作为备用存储。'
        },
        {
            title: '网站支持哪些浏览器？',
            content: '支持所有现代浏览器，包括Chrome、Firefox、Safari、Edge等。建议使用最新版本的浏览器以获得最佳体验。'
        }
    ];
    
    const $faqContainer = $('#faqAccordion');
    if ($faqContainer.length > 0 && typeof createAccordion === 'function') {
        const $accordion = createAccordion(faqItems);
        $faqContainer.append($accordion);
        // 延迟初始化，确保DOM已渲染
        setTimeout(function() {
            if (typeof initAccordion === 'function') {
                initAccordion();
            }
        }, 100);
    }
}



