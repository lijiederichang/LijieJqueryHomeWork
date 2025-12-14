# 交互式媒体卡片墙展示网站

## 项目简介

这是一个基于 HTML5 + CSS3 + JavaScript + jQuery 开发的交互式媒体卡片墙展示网站。用户可以浏览、搜索、筛选和添加各种类型的媒体卡片，每个卡片都包含文本、图片和互动元素。

## 功能特点

- 🎨 **精美的卡片墙展示** - 采用网格布局，支持响应式设计
- 🔍 **强大的搜索功能** - 支持标题、描述、作者搜索
- 🏷️ **分类筛选** - 按科技、艺术、自然、运动、音乐、游戏等分类浏览
- ❤️ **点赞互动** - 为喜欢的卡片点赞，支持实时更新
- 💖 **我的喜欢** - 专门的页面展示所有点赞的卡片
- ➕ **添加卡片** - 通过表单添加自定义卡片，支持本地图片上传和Ajax异步提交
- 📸 **图片上传** - 支持从本地选择图片文件上传，自动预览
- 📱 **响应式设计** - 适配桌面、平板和移动设备
- 🎭 **流畅动画** - 淡入淡出、滑动、缩放等动画效果

## 页面结构

1. **index.html** - 主页面，展示卡片墙，支持搜索和筛选
2. **add-card.html** - 添加卡片表单页面，支持本地图片上传
3. **detail.html** - 卡片详情页面（二级页面）
4. **category.html** - 分类浏览页面（二级页面）
5. **favorites.html** - 我的喜欢页面，展示所有点赞的卡片（二级页面）
6. **about.html** - 关于页面（二级页面）

## 技术实现

### jQuery技术应用

#### 1. jQuery选择器
- **基本选择器**：`$('#searchInput')`, `$('.card')`, `$('button')`
- **层次选择器**：`$button.find('.like-count')`, `$(this).closest('.card')`
- **过滤器**：`.filter()`, `.find()`, `.closest()`, `.parent()`

#### 2. DOM操作
- **创建元素**：`$('<div>')`, `$('<img>')`
- **添加元素**：`.append()`, `.prepend()`
- **删除元素**：`.empty()`, `.remove()`
- **替换元素**：`.replaceWith()`
- **修改内容**：`.text()`, `.html()`

#### 3. 属性操作
- **读取属性**：`.attr('id')`, `.data('category')`, `.val()`
- **设置属性**：`.attr('src', url)`, `.data('id', id)`, `.addClass()`, `.removeClass()`
- **修改样式**：`.css()`, `.addClass()`, `.removeClass()`

#### 4. 事件处理
- **点击事件**：`.on('click', handler)`
- **表单提交**：`.on('submit', handler)`
- **输入事件**：`.on('keypress', handler)`, `.on('blur', handler)`
- **滚动事件**：`.on('scroll', handler)`
- **事件委托**：`$(document).on('click', '.card', handler)`

#### 5. 动画效果
- **淡入淡出**：`.fadeIn()`, `.fadeOut()`
- **滑动效果**：`.slideDown()`, `.slideUp()`
- **自定义动画**：`.animate()`
- **平滑滚动**：`$('html, body').animate({scrollTop: 0})`

#### 6. Ajax交互
- **Ajax提交**：`$.ajax()` 方法
- **表单数据获取**：通过jQuery选择器获取表单数据
- **异步处理**：`success` 和 `error` 回调函数
- **响应处理**：显示成功提示、错误信息等

## 🚀 部署到GitHub Pages

### 快速部署步骤

1. **创建GitHub仓库**
   - 登录GitHub，创建新仓库
   - 仓库名：`LiJie-Jquery-Exam`（或自定义）

2. **推送代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
   或使用提供的 `快速部署脚本.bat`（Windows）

3. **启用GitHub Pages**
   - 打开仓库 → Settings → Pages
   - Source: `main` branch
   - 点击 Save
   - 等待几分钟，访问：`https://YOUR_USERNAME.github.io/REPO_NAME/`

详细说明请查看 [GitHub部署说明.md](./GitHub部署说明.md)

## 使用方法

1. 直接在浏览器中打开 `index.html` 即可开始使用
2. 使用搜索框搜索卡片内容
3. 使用分类筛选下拉菜单按分类浏览（包括新增的游戏分类）
4. 点击卡片查看详情
5. 点击心形按钮为卡片点赞
6. 通过"我的喜欢"页面查看所有点赞的卡片
7. 通过"添加卡片"页面添加新卡片，支持上传本地图片文件

## 数据存储

### 前端存储
- 项目使用 `localStorage` 进行本地数据存储
- 添加的卡片会保存在浏览器本地存储中
- 点赞状态保存在 localStorage 中

### 图片存储
- 图片文件存储在 `images/` 目录
- 图片路径格式：`images/card_{timestamp}.{extension}`
- 支持 JPG、PNG、GIF 格式，最大 5MB

### MySQL 数据库（生产环境）
- 提供了完整的 MySQL 数据库设计文档（见 `database_design.md`）
- 包含卡片表、用户喜欢表、图片信息表的设计
- 支持图片路径存储在数据库中

## 浏览器兼容性

支持所有现代浏览器（Chrome、Firefox、Safari、Edge等）

## 项目结构

```
LiJie-Jquery-Exam/
├── index.html              # 主页面
├── add-card.html           # 添加卡片页面
├── detail.html             # 卡片详情页
├── category.html           # 分类浏览页
├── favorites.html          # 我的喜欢页面
├── about.html              # 关于页面
├── styles.css              # 样式文件
├── script.js               # jQuery脚本文件
├── jquery-3.7.1.min.js    # jQuery库文件
├── images/                 # 图片存储目录
│   └── README.md          # 图片目录说明
├── database_design.md      # MySQL数据库设计文档
└── README.md               # 项目说明文档
```

## 设计特色

- **科技感与亲和力**：采用深色主题配合渐变色彩，既现代又友好
- **层次分明**：清晰的导航结构和卡片布局
- **视觉新颖**：卡片悬停效果、动画过渡、阴影效果等
- **用户体验**：流畅的交互、即时的反馈、友好的提示

## 开发规范

- 遵循HTML5语义化标签
- CSS3使用变量和现代特性
- JavaScript代码结构清晰，注释完善
- jQuery使用规范，无冲突问题

