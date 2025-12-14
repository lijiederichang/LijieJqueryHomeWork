// ==================== 配置文件示例 ====================
// 复制此文件为 config.js 并根据环境修改API地址

// 开发环境：本地后端
// const API_BASE_URL = 'http://localhost:8080/api';

// 生产环境：部署在云端的后端API（替换为你的实际地址）
// const API_BASE_URL = 'https://your-backend-api.com/api';

// 演示模式：仅使用localStorage（不连接后端）
// const API_BASE_URL = null;
// const DEMO_MODE = true;

// 当前配置（开发环境）
const API_BASE_URL = 'http://localhost:8080/api';

// 卡片数据存储（从后端加载）
let cardsData = [];

// 用户ID，可以从localStorage获取
let userId = 'default';

