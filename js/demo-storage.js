// ==================== 示例数据本地存储管理 ====================
// 只管理示例数据（ID: 1001-1020）的增删改查，不调用后端

const DEMO_STORAGE_KEY = 'demoCardsData'; // localStorage键名
const DEMO_CARD_ID_START = 1000;
const DEMO_CARD_ID_END = 2000;

// 获取所有示例数据（从DEMO_CARDS_DATA加载，合并localStorage中的修改）
function getDemoCards() {
    // 从localStorage加载修改过的示例数据
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    let modifiedCards = {};
    if (stored) {
        try {
            modifiedCards = JSON.parse(stored);
        } catch (e) {
            console.error('读取示例数据失败:', e);
        }
    }
    
    // 合并原始演示数据和修改
    return DEMO_CARDS_DATA.map(function(card) {
        if (modifiedCards[card.id]) {
            // 如果有修改，使用修改后的数据
            return { ...card, ...modifiedCards[card.id] };
        }
        return card;
    }).filter(function(card) {
        // 过滤掉被删除的卡片
        return !modifiedCards[card.id] || !modifiedCards[card.id].deleted;
    });
}

// 保存示例数据修改到localStorage
function saveDemoCardModification(cardId, modifications) {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    let modifiedCards = {};
    if (stored) {
        try {
            modifiedCards = JSON.parse(stored);
        } catch (e) {
            console.error('读取示例数据失败:', e);
        }
    }
    
    if (!modifiedCards[cardId]) {
        modifiedCards[cardId] = {};
    }
    
    // 合并修改
    modifiedCards[cardId] = { ...modifiedCards[cardId], ...modifications };
    
    try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(modifiedCards));
        return true;
    } catch (e) {
        console.error('保存示例数据失败:', e);
        return false;
    }
}

// 更新示例数据（不调用后端）
function updateDemoCard(cardId, cardData) {
    return saveDemoCardModification(cardId, {
        title: cardData.title,
        description: cardData.description,
        category: cardData.category,
        author: cardData.author || '匿名',
        image: cardData.image || undefined,
        updatedAt: new Date().toISOString()
    });
}

// 删除示例数据（标记为已删除，不调用后端）
function deleteDemoCard(cardId) {
    return saveDemoCardModification(cardId, {
        deleted: true
    });
}

// 检查是否是示例数据（ID: 1001-1020）
function isDemoCard(cardId) {
    return cardId >= DEMO_CARD_ID_START && cardId < DEMO_CARD_ID_END;
}

// 根据ID获取示例数据
function getDemoCardById(cardId) {
    const demoCards = getDemoCards();
    return demoCards.find(card => card.id === cardId);
}

