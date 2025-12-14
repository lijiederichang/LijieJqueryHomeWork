// ==================== 本地存储管理 ====================
// 管理用户添加、编辑、删除的卡片数据

const STORAGE_KEY = 'userCardsData'; // localStorage键名
const USER_CARD_ID_START = 2000; // 用户添加的卡片ID起始值

// 获取所有用户添加的卡片
function getUserCards() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('读取用户卡片数据失败:', e);
            return [];
        }
    }
    return [];
}

// 保存用户卡片到localStorage
function saveUserCards(cards) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        return true;
    } catch (e) {
        console.error('保存用户卡片数据失败:', e);
        return false;
    }
}

// 获取下一个可用的卡片ID
function getNextCardId() {
    const userCards = getUserCards();
    if (userCards.length === 0) {
        return USER_CARD_ID_START;
    }
    const maxId = Math.max(...userCards.map(card => card.id));
    return maxId + 1;
}

// 添加用户卡片
function addUserCard(cardData) {
    const userCards = getUserCards();
    const newCard = {
        id: getNextCardId(),
        title: cardData.title,
        description: cardData.description,
        image: cardData.image || '', // Base64图片或URL
        category: cardData.category,
        author: cardData.author || '匿名',
        likes: 0,
        liked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    userCards.push(newCard);
    saveUserCards(userCards);
    return newCard;
}

// 更新用户卡片
function updateUserCard(cardId, cardData) {
    const userCards = getUserCards();
    const index = userCards.findIndex(card => card.id === cardId);
    
    if (index === -1) {
        return null; // 卡片不存在
    }
    
    // 更新卡片数据
    userCards[index] = {
        ...userCards[index],
        title: cardData.title,
        description: cardData.description,
        category: cardData.category,
        author: cardData.author || '匿名',
        updatedAt: new Date().toISOString()
    };
    
    // 如果提供了新图片，更新图片
    if (cardData.image) {
        userCards[index].image = cardData.image;
    }
    
    saveUserCards(userCards);
    return userCards[index];
}

// 删除用户卡片
function deleteUserCard(cardId) {
    const userCards = getUserCards();
    const filtered = userCards.filter(card => card.id !== cardId);
    saveUserCards(filtered);
    return filtered.length < userCards.length; // 返回是否成功删除
}

// 根据ID获取用户卡片
function getUserCardById(cardId) {
    const userCards = getUserCards();
    return userCards.find(card => card.id === cardId);
}

// 合并演示数据和用户数据
function mergeCardsData(demoCards, userCards) {
    // 合并所有卡片
    const allCards = [...demoCards, ...userCards];
    // 按创建时间倒序排列（最新的在前）
    return allCards.sort((a, b) => {
        const timeA = a.createdAt || a.updatedAt || 0;
        const timeB = b.createdAt || b.updatedAt || 0;
        return new Date(timeB) - new Date(timeA);
    });
}

// 检查卡片是否是用户添加的（ID >= 2000）
function isUserCard(cardId) {
    return cardId >= USER_CARD_ID_START;
}

// 检查卡片是否是演示数据（ID >= 1000 && < 2000）
function isDemoCard(cardId) {
    return cardId >= 1000 && cardId < USER_CARD_ID_START;
}

