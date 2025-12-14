# 📌 GitHub Pages 部署步骤总结

## 🎯 一句话总结

**将代码推送到GitHub，然后在仓库设置中启用Pages功能。**

---

## 📝 10步完成部署

### ✅ 步骤1：创建GitHub仓库
- 登录GitHub → 点击 "+" → New repository
- 填写仓库名（如：`LiJie-Jquery-Exam`）
- 选择 Public
- 点击 Create repository

### ✅ 步骤2：安装Git（如果未安装）
- 访问 https://git-scm.com/download/win
- 下载并安装Git

### ✅ 步骤3：配置Git（首次使用）
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### ✅ 步骤4：进入项目目录
```bash
cd E:\LiJie-Jquery-Exam
```

### ✅ 步骤5：初始化Git仓库
```bash
git init
```

### ✅ 步骤6：添加并提交代码
```bash
git add .
git commit -m "Initial commit"
```

### ✅ 步骤7：连接GitHub仓库
```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### ✅ 步骤8：推送到GitHub
```bash
git branch -M main
git push -u origin main
```
（首次推送需要输入GitHub用户名和Personal Access Token）

### ✅ 步骤9：启用GitHub Pages
- 打开GitHub仓库 → Settings → Pages
- Source: `main` branch
- Folder: `/ (root)`
- 点击 Save

### ✅ 步骤10：访问网站
等待1-5分钟后访问：
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

---

## 🔑 关键点

1. **仓库必须是Public**（免费版Pages要求）
2. **使用相对路径**（所有资源路径）
3. **需要Personal Access Token**（不是密码）
4. **等待部署完成**（通常1-5分钟）

---

## 📚 详细文档

- **详细步骤**：查看 `详细手动部署指南.md`
- **快速参考**：查看 `部署命令速查卡.md`
- **检查清单**：查看 `部署检查清单.md`

---

## 🆘 遇到问题？

查看 `详细手动部署指南.md` 的"常见问题解决"章节。

