// ==================== 演示数据（无后端时使用）====================
// 包含20条示例卡片数据，使用在线CDN图片

const DEMO_CARDS_DATA = [
    {
        id: 1001,
        title: '人工智能的未来',
        description: '探索人工智能技术如何改变我们的生活方式，从智能家居到自动驾驶，AI正在重塑世界。',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        category: 'technology',
        author: '科技探索者',
        likes: 128,
        liked: false
    },
    {
        id: 1002,
        title: '抽象艺术之美',
        description: '抽象艺术通过色彩、形状和线条表达情感，每一幅作品都是艺术家内心世界的映射。',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
        category: 'art',
        author: '艺术爱好者',
        likes: 95,
        liked: false
    },
    {
        id: 1003,
        title: '壮丽的山川',
        description: '大自然的鬼斧神工创造了无数令人惊叹的景观，山川河流诉说着地球的古老故事。',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        category: 'nature',
        author: '自然摄影师',
        likes: 156,
        liked: false
    },
    {
        id: 1004,
        title: '篮球运动',
        description: '篮球是一项充满激情和团队合作的运动，每一次投篮都是技巧与意志的完美结合。',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
        category: 'sports',
        author: '运动达人',
        likes: 87,
        liked: false
    },
    {
        id: 1005,
        title: '古典音乐的魅力',
        description: '古典音乐穿越时空，用优美的旋律和和声触动人心，是艺术与情感的完美融合。',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        category: 'music',
        author: '音乐家',
        likes: 112,
        liked: false
    },
    {
        id: 1006,
        title: '电子竞技',
        description: '电子竞技已成为全球最受欢迎的竞技项目之一，展现了技术与策略的完美结合。',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        category: 'game',
        author: '游戏玩家',
        likes: 203,
        liked: false
    },
    {
        id: 1007,
        title: '量子计算突破',
        description: '量子计算技术正在突破传统计算的极限，为科学研究和工业应用带来革命性变化。',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        category: 'technology',
        author: '科技前沿',
        likes: 145,
        liked: false
    },
    {
        id: 1008,
        title: '印象派画作',
        description: '印象派艺术捕捉光影的瞬间变化，用细腻的笔触描绘生活中的美好时刻。',
        image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80',
        category: 'art',
        author: '艺术收藏家',
        likes: 78,
        liked: false
    },
    {
        id: 1009,
        title: '海洋奇观',
        description: '深邃的海洋中隐藏着无数神秘生物，珊瑚礁是海洋中最美丽的生态系统之一。',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        category: 'nature',
        author: '海洋探索者',
        likes: 134,
        liked: false
    },
    {
        id: 1010,
        title: '足球世界杯',
        description: '足球是世界上最受欢迎的运动，世界杯是每个球员和球迷心中的梦想舞台。',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
        category: 'sports',
        author: '足球迷',
        likes: 189,
        liked: false
    },
    {
        id: 1011,
        title: '爵士乐即兴',
        description: '爵士乐以其即兴演奏和复杂和声著称，是音乐自由表达的完美体现。',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
        category: 'music',
        author: '爵士乐手',
        likes: 92,
        liked: false
    },
    {
        id: 1012,
        title: '开放世界游戏',
        description: '开放世界游戏让玩家自由探索虚拟世界，体验无限可能的冒险旅程。',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        category: 'game',
        author: '游戏设计师',
        likes: 167,
        liked: false
    },
    {
        id: 1013,
        title: '5G网络时代',
        description: '5G技术带来超高速网络连接，为物联网、自动驾驶和远程医疗等应用奠定基础。',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        category: 'technology',
        author: '网络工程师',
        likes: 103,
        liked: false
    },
    {
        id: 1014,
        title: '现代雕塑艺术',
        description: '现代雕塑打破传统束缚，用创新的材料和形式表达艺术家的独特视角。',
        image: 'https://images.unsplash.com/photo-1578302912591-01b7d8b96b0a?w=800&q=80',
        category: 'art',
        author: '雕塑艺术家',
        likes: 76,
        liked: false
    },
    {
        id: 1015,
        title: '森林生态',
        description: '茂密的森林是地球的绿肺，为无数生物提供栖息地，维持着生态平衡。',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        category: 'nature',
        author: '生态学家',
        likes: 121,
        liked: false
    },
    {
        id: 1016,
        title: '网球运动',
        description: '网球是一项优雅而激烈的运动，需要技巧、速度和策略的完美结合。',
        image: 'https://images.unsplash.com/photo-1622163642999-9586a13e0a0c?w=800&q=80',
        category: 'sports',
        author: '网球教练',
        likes: 98,
        liked: false
    },
    {
        id: 1017,
        title: '摇滚音乐节',
        description: '摇滚音乐节是音乐爱好者的狂欢，现场演出带来无与伦比的视听体验。',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        category: 'music',
        author: '摇滚乐迷',
        likes: 154,
        liked: false
    },
    {
        id: 1018,
        title: '策略游戏',
        description: '策略游戏考验玩家的思维能力和决策能力，每一步都影响最终结果。',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
        category: 'game',
        author: '策略玩家',
        likes: 139,
        liked: false
    },
    {
        id: 1019,
        title: '虚拟现实技术',
        description: 'VR技术创造沉浸式体验，让用户仿佛置身于虚拟世界中，开启全新的交互方式。',
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80',
        category: 'technology',
        author: 'VR开发者',
        likes: 178,
        liked: false
    },
    {
        id: 1020,
        title: '街头艺术',
        description: '街头艺术将艺术带到公共空间，用色彩和创意点亮城市，传递社会信息。',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
        category: 'art',
        author: '街头艺术家',
        likes: 115,
        liked: false
    }
];

// 从localStorage加载点赞状态（如果存在）
function loadDemoLikeStatuses() {
    const storedLikes = localStorage.getItem('demoLikes');
    if (storedLikes) {
        try {
            const likedIds = JSON.parse(storedLikes);
            DEMO_CARDS_DATA.forEach(function(card) {
                if (likedIds.includes(card.id)) {
                    card.liked = true;
                }
            });
        } catch (e) {
            console.error('加载点赞状态失败:', e);
        }
    }
}

// 保存点赞状态到localStorage
function saveDemoLikeStatus(cardId, liked) {
    let likedIds = [];
    const stored = localStorage.getItem('demoLikes');
    if (stored) {
        try {
            likedIds = JSON.parse(stored);
        } catch (e) {
            console.error('读取点赞状态失败:', e);
        }
    }
    
    if (liked) {
        if (!likedIds.includes(cardId)) {
            likedIds.push(cardId);
        }
    } else {
        likedIds = likedIds.filter(function(id) {
            return id !== cardId;
        });
    }
    
    localStorage.setItem('demoLikes', JSON.stringify(likedIds));
}

// 初始化演示数据（加载点赞状态）
loadDemoLikeStatuses();

