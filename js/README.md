# JavaScript文件结构说明

## 文件拆分说明

原来的 `script.js` 文件（1159行）已按功能模块拆分为多个文件，便于维护和管理。

## 文件列表及功能

### 1. config.js
**功能**: 配置和全局变量
- API基础URL
- 卡片数据存储
- 用户ID

### 2. api.js
**功能**: API相关函数
- `loadCardsFromAPI()` - 从后端加载卡片数据
- `loadLikeStatuses()` - 加载点赞状态
- `loadCardsFromStorage()` - 从localStorage加载
- `saveCardsToStorage()` - 保存到localStorage

### 3. card.js
**功能**: 卡片相关功能
- `createCardElement()` - 创建卡片元素
- `renderCards()` - 渲染卡片列表
- `performSearch()` - 搜索功能
- `performFilter()` - 筛选功能

### 4. like.js
**功能**: 点赞功能
- `toggleLike()` - 点赞/取消点赞

### 5. form.js
**功能**: 表单相关功能
- `initAddCardPage()` - 添加卡片页面初始化
- `initEditCardPage()` - 编辑卡片页面初始化
- `handleImagePreview()` - 图片预览
- `submitCardForm()` - 提交表单（创建）
- `updateCardForm()` - 更新表单（编辑）
- `validateField()` - 表单验证
- `showFormMessage()` - 显示表单消息

### 6. detail.js
**功能**: 详情页功能
- `initDetailPage()` - 详情页初始化
- `renderCardDetail()` - 渲染卡片详情

### 7. category.js
**功能**: 分类页功能
- `initCategoryPage()` - 分类页初始化
- `filterCardsByCategory()` - 按分类筛选
- `renderCategoryCards()` - 渲染分类页卡片

### 8. favorites.js
**功能**: 我的喜欢页面功能
- `initFavoritesPage()` - 我的喜欢页面初始化
- `loadFavorites()` - 加载喜欢的卡片

### 9. utils.js
**功能**: 工具函数
- `initBackToTop()` - 返回顶部功能
- `showToast()` - 显示提示消息
- `deleteCard()` - 删除卡片

### 10. index.js
**功能**: 首页功能
- `initIndexPage()` - 首页初始化

### 11. main.js
**功能**: 主入口文件
- 文档就绪后初始化
- 根据页面路由调用相应的初始化函数

## 依赖关系

```
config.js (基础配置)
  ↓
api.js (依赖config.js)
  ↓
card.js (依赖api.js)
  ↓
like.js (依赖api.js)
  ↓
form.js (依赖api.js)
detail.js (依赖card.js, like.js)
category.js (依赖card.js)
favorites.js (依赖card.js, like.js)
utils.js (独立)
index.js (依赖card.js, like.js, utils.js)
  ↓
main.js (依赖所有模块)
```

## 各页面加载的JS文件

### index.html
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/card.js"></script>
<script src="js/like.js"></script>
<script src="js/utils.js"></script>
<script src="js/index.js"></script>
<script src="js/main.js"></script>
```

### add-card.html
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/form.js"></script>
<script src="js/utils.js"></script>
<script src="js/main.js"></script>
```

### detail.html
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/card.js"></script>
<script src="js/like.js"></script>
<script src="js/detail.js"></script>
<script src="js/utils.js"></script>
<script src="js/main.js"></script>
```

### category.html
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/card.js"></script>
<script src="js/like.js"></script>
<script src="js/category.js"></script>
<script src="js/utils.js"></script>
<script src="js/main.js"></script>
```

### favorites.html
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/card.js"></script>
<script src="js/like.js"></script>
<script src="js/favorites.js"></script>
<script src="js/utils.js"></script>
<script src="js/main.js"></script>
```

### edit-card.html
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/form.js"></script>
<script src="js/utils.js"></script>
<script src="js/main.js"></script>
```

### about.html
```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/utils.js"></script>
<script src="js/main.js"></script>
```

## 优势

1. **模块化**: 每个文件职责单一，便于维护
2. **可读性**: 文件变小，更容易理解和查找代码
3. **可维护性**: 修改某个功能只需编辑对应文件
4. **可扩展性**: 新增功能只需添加新文件
5. **按需加载**: 每个页面只加载需要的JS文件

## 注意事项

1. **加载顺序**: 必须按照依赖关系顺序加载
2. **全局变量**: `cardsData`、`userId`、`API_BASE_URL` 在config.js中定义
3. **函数共享**: 各模块间的函数可以互相调用
4. **向后兼容**: 功能保持不变，只是文件结构改变




