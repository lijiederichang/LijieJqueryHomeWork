# 📦 本地存储CRUD功能说明

## 🎯 功能概述

项目已实现完整的**增删改查（CRUD）**功能，支持演示数据和用户添加的数据，所有操作都使用**localStorage**进行本地存储。

## ✨ 功能特点

- ✅ **添加卡片**：支持添加新卡片，保存到localStorage
- ✅ **删除卡片**：支持删除演示数据和用户卡片
- ✅ **编辑卡片**：支持编辑演示数据和用户卡片
- ✅ **查询卡片**：搜索和筛选包含所有数据（演示+用户）
- ✅ **自动合并**：演示数据和用户数据自动合并显示
- ✅ **数据持久化**：所有用户数据保存在localStorage

## 📊 数据分类

### 1. 演示数据（ID: 1001-1020）
- 内置的20条示例数据
- 存储在 `js/demo-data.js`
- 可以删除和编辑（编辑后会转换为用户卡片）

### 2. 用户卡片（ID: 2000+）
- 用户通过表单添加的卡片
- 存储在 `localStorage` 中（键名：`userCardsData`）
- 支持完整的增删改查

### 3. 后端数据（ID: < 1000）
- 从后端API获取的数据
- 如果后端可用，优先使用后端数据

## 🔧 实现细节

### 1. 添加卡片（Create）

**功能**：
- 用户填写表单，上传图片
- 图片转换为Base64格式保存
- 自动生成唯一ID（从2000开始递增）
- 保存到localStorage

**代码位置**：`js/form.js` → `submitCardForm()`

**存储格式**：
```javascript
{
    id: 2000,  // 自动生成
    title: "标题",
    description: "描述",
    image: "data:image/jpeg;base64,...",  // Base64图片
    category: "technology",
    author: "作者名",
    likes: 0,
    liked: false,
    createdAt: "2024-01-01T12:00:00.000Z",
    updatedAt: "2024-01-01T12:00:00.000Z"
}
```

### 2. 查询卡片（Read）

**功能**：
- 自动合并演示数据和用户数据
- 按创建时间倒序排列（最新的在前）
- 支持搜索和筛选

**代码位置**：`js/api.js` → `loadDemoData()`

**合并逻辑**：
```javascript
// 合并演示数据和用户数据
cardsData = mergeCardsData(demoCards, userCards);
```

### 3. 编辑卡片（Update）

**功能**：
- 支持编辑用户卡片（直接更新localStorage）
- 支持编辑演示数据（编辑后转换为用户卡片）
- 支持更新图片（转换为Base64）

**代码位置**：`js/form.js` → `updateCardForm()`

**编辑演示数据**：
- 编辑演示数据时，会创建新的用户卡片
- 原演示数据保持不变（可以删除）

### 4. 删除卡片（Delete）

**功能**：
- 支持删除用户卡片（从localStorage移除）
- 支持删除演示数据（从当前显示中移除）
- 删除后立即更新显示

**代码位置**：`js/utils.js` → `deleteCard()`

**删除逻辑**：
- 用户卡片：从localStorage删除
- 演示数据：从当前数据中移除（刷新页面后会恢复）

## 📁 文件说明

### `js/storage.js`（新增）
本地存储管理模块，提供：
- `getUserCards()`：获取所有用户卡片
- `addUserCard()`：添加用户卡片
- `updateUserCard()`：更新用户卡片
- `deleteUserCard()`：删除用户卡片
- `getUserCardById()`：根据ID获取卡片
- `mergeCardsData()`：合并数据
- `isUserCard()`：判断是否是用户卡片
- `isDemoCard()`：判断是否是演示数据

### 修改的文件

1. **`js/api.js`**
   - 修改 `loadDemoData()`：合并演示数据和用户数据

2. **`js/form.js`**
   - 修改 `submitCardForm()`：保存到localStorage
   - 修改 `initEditCardPage()`：支持编辑演示数据和用户卡片
   - 修改 `updateCardForm()`：更新localStorage

3. **`js/utils.js`**
   - 修改 `deleteCard()`：支持删除演示数据和用户卡片

4. **所有HTML文件**
   - 添加 `js/storage.js` 引用

## 🎯 使用场景

### 场景1：添加新卡片
1. 打开"添加卡片"页面
2. 填写表单，上传图片
3. 提交后自动保存到localStorage
4. 立即显示在首页

### 场景2：编辑卡片
1. 点击卡片的"编辑"按钮
2. 修改表单内容
3. 提交后更新localStorage
4. 如果是演示数据，会转换为用户卡片

### 场景3：删除卡片
1. 点击卡片的"删除"按钮
2. 确认删除
3. 从localStorage移除（如果是用户卡片）
4. 立即从页面移除

### 场景4：搜索和筛选
1. 搜索和筛选包含所有数据
2. 演示数据 + 用户数据
3. 实时显示结果

## ⚠️ 注意事项

1. **图片存储**：
   - 图片以Base64格式存储在localStorage
   - Base64图片较大，建议图片不超过1MB
   - 如果图片太大，localStorage可能超出限制（通常5-10MB）

2. **数据持久化**：
   - 用户数据保存在浏览器localStorage
   - 清除浏览器数据会丢失用户卡片
   - 不同浏览器/设备的数据不共享

3. **ID管理**：
   - 用户卡片ID从2000开始
   - 自动递增，避免冲突
   - 删除后ID不会重用

4. **演示数据编辑**：
   - 编辑演示数据会创建新的用户卡片
   - 原演示数据保持不变
   - 可以删除新创建的用户卡片恢复原样

## 🔍 调试方法

### 查看localStorage数据

在浏览器控制台执行：
```javascript
// 查看所有用户卡片
JSON.parse(localStorage.getItem('userCardsData'))

// 查看点赞状态
JSON.parse(localStorage.getItem('demoLikes'))
```

### 清除所有用户数据

```javascript
localStorage.removeItem('userCardsData');
location.reload();
```

## 🎉 优势

- ✅ **完全离线**：无需后端即可使用
- ✅ **数据持久化**：刷新页面数据不丢失
- ✅ **功能完整**：完整的CRUD操作
- ✅ **自动合并**：演示数据和用户数据无缝整合
- ✅ **易于使用**：操作简单直观

---

**提示**：所有用户添加的数据都保存在浏览器localStorage中，清除浏览器数据会丢失这些数据。

