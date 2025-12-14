# GitHub Pages 部署指南

## 📋 部署前准备

### 1. 创建GitHub仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `LiJie-Jquery-Exam` (或你喜欢的名字)
   - **Description**: 交互式媒体卡片墙展示网站
   - **Visibility**: Public (GitHub Pages免费版需要公开仓库)
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 2. 初始化Git并推送代码

在项目根目录（`E:\LiJie-Jquery-Exam`）打开命令行，执行：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 交互式媒体卡片墙项目"

# 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/LiJie-Jquery-Exam.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 3. 配置API地址（重要！）

⚠️ **注意**：由于GitHub Pages是静态托管，无法运行后端服务。你需要：

#### 选项A：使用在线后端API（如果有）

如果你的后端部署在云服务器上（如Heroku、Railway、Vercel等），修改 `js/config.js`：

```javascript
// 将 localhost 替换为你的后端API地址
const API_BASE_URL = 'https://your-backend-api.com/api';
```

#### 选项B：仅使用前端功能（推荐用于演示）

如果只是展示前端功能，可以：
1. 使用 `localStorage` 存储数据（项目已支持）
2. 或者创建一个演示模式，使用模拟数据

修改 `js/config.js` 添加演示模式：

```javascript
// 演示模式：使用localStorage
const DEMO_MODE = true; // 设置为true使用本地存储
const API_BASE_URL = DEMO_MODE ? null : 'http://localhost:8080/api';
```

## 🚀 启用GitHub Pages

### 方法1：通过GitHub网页界面（推荐）

1. 打开你的GitHub仓库页面
2. 点击 **Settings**（设置）标签
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 选择分支：`main`（或 `master`）
   - 选择文件夹：`/ (root)`
5. 点击 **Save**
6. 等待几分钟，GitHub会生成你的网站地址：
   - 格式：`https://YOUR_USERNAME.github.io/LiJie-Jquery-Exam/`

### 方法2：通过GitHub Actions（自动部署）

1. 在项目根目录创建 `.github/workflows/deploy.yml` 文件
2. 每次推送到 `main` 分支时自动部署

## 📝 部署后访问

部署完成后，你的网站地址将是：
```
https://YOUR_USERNAME.github.io/LiJie-Jquery-Exam/
```

或者如果仓库名是 `LiJie-Jquery-Exam`：
```
https://YOUR_USERNAME.github.io/LiJie-Jquery-Exam/
```

## ⚙️ 配置说明

### API地址配置

由于GitHub Pages是静态网站托管，**无法直接连接本地后端**。你需要：

1. **开发环境**：使用 `http://localhost:8080/api`
2. **生产环境**：使用部署在云端的后端API地址

### 图片资源

- 如果图片存储在 `images/` 目录，会随代码一起部署
- 如果使用CDN图片（如Unsplash），无需担心
- 如果图片太大，建议使用CDN或Git LFS

## 🔧 常见问题

### 1. 页面404错误

**原因**：GitHub Pages可能需要几分钟才能生效

**解决**：
- 等待5-10分钟
- 检查仓库设置中的Pages配置
- 确认 `index.html` 在根目录

### 2. API请求失败（CORS错误）

**原因**：后端API没有配置CORS允许GitHub Pages域名

**解决**：在后端 `CardController.java` 中添加：

```java
@CrossOrigin(origins = {
    "http://localhost:8080",
    "https://YOUR_USERNAME.github.io"
})
```

### 3. 图片不显示

**原因**：图片路径问题

**解决**：
- 使用相对路径：`images/xxx.jpg`
- 或使用绝对路径：`/LiJie-Jquery-Exam/images/xxx.jpg`
- 或使用CDN地址

### 4. 样式和脚本不加载

**原因**：路径问题

**解决**：
- 确保所有资源使用相对路径
- 检查HTML中的引用路径是否正确

## 📦 更新网站

每次修改代码后，执行：

```bash
git add .
git commit -m "更新描述"
git push origin main
```

GitHub Pages会自动更新（可能需要几分钟）

## 🎯 最佳实践

1. **使用CDN图片**：减少仓库大小，加快加载速度
2. **压缩资源**：压缩CSS、JS文件
3. **使用相对路径**：确保所有资源路径正确
4. **测试链接**：部署后测试所有页面链接
5. **添加404页面**：创建 `404.html` 提供更好的用户体验

## 📚 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Git 基础教程](https://git-scm.com/book/zh/v2)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 🎉 完成！

部署成功后，你可以：
- 分享网站链接给他人
- 在简历中展示项目
- 继续迭代开发

祝你部署顺利！🚀

