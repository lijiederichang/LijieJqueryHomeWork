@echo off
chcp 65001 >nul
echo ============================================
echo GitHub Pages 快速部署脚本
echo ============================================
echo.

REM 检查Git是否安装
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到Git，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] 检查Git仓库状态...
git status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [信息] 初始化Git仓库...
    git init
    echo [信息] Git仓库初始化完成
) else (
    echo [信息] Git仓库已存在
)

echo.
echo [2/5] 检查Git配置...
git config user.name >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 未配置Git用户信息
    echo [提示] 请先运行以下命令配置Git：
    echo   git config --global user.name "你的名字"
    echo   git config --global user.email "你的邮箱"
    echo.
    set /p CONFIG_NOW="是否现在配置？(Y/N，直接回车跳过): "
    if /i "%CONFIG_NOW%"=="Y" (
        set /p GIT_NAME="请输入你的名字: "
        set /p GIT_EMAIL="请输入你的邮箱: "
        git config --global user.name "%GIT_NAME%"
        git config --global user.email "%GIT_EMAIL%"
        echo [信息] Git配置完成
    )
)

echo.
echo [3/5] 添加文件到Git...
git add .

echo.
echo [4/5] 提交更改...
set /p COMMIT_MSG="请输入提交信息（直接回车使用默认信息）: "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update: 更新项目文件
git commit -m "%COMMIT_MSG%"
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 提交失败，可能没有更改或已是最新版本
    echo [提示] 如果这是首次提交，请检查是否有文件需要添加
)

echo.
echo [5/5] 检查远程仓库...
git remote -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [提示] 未检测到远程仓库
    echo.
    set /p REMOTE_URL="请输入GitHub仓库地址（例如: https://github.com/USERNAME/REPO.git）: "
    if not "%REMOTE_URL%"=="" (
        git remote add origin "%REMOTE_URL%"
        echo [信息] 远程仓库已添加
    ) else (
        echo [错误] 未输入远程仓库地址，跳过推送
        pause
        exit /b 1
    )
)

echo.
echo [推送] 推送到GitHub...
git branch -M main 2>nul
echo [提示] 如果提示输入用户名和密码：
echo   - 用户名：输入你的GitHub用户名
echo   - 密码：输入GitHub Personal Access Token（不是账号密码）
echo   如何创建Token：GitHub ^> Settings ^> Developer settings ^> Personal access tokens
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo [成功] 代码已推送到GitHub！
    echo ============================================
    echo.
    echo 下一步操作：
    echo 1. 打开GitHub仓库页面
    echo 2. 进入 Settings ^> Pages
    echo 3. 选择 Source: main branch，Folder: / (root)
    echo 4. 点击 Save
    echo 5. 等待1-5分钟后访问你的网站
    echo.
    echo 详细步骤请查看：详细手动部署指南.md
    echo.
) else (
    echo.
    echo ============================================
    echo [错误] 推送失败
    echo ============================================
    echo.
    echo 可能的原因：
    echo 1. 网络连接问题
    echo 2. 认证失败（需要配置SSH密钥或使用GitHub CLI）
    echo 3. 远程仓库地址错误
    echo.
    echo 解决方法：
    echo 1. 检查网络连接
    echo 2. 使用GitHub Desktop或网页上传
    echo 3. 配置Git认证信息
    echo.
)

pause

