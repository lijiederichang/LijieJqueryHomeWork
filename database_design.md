# MySQL 数据库设计文档

## 数据库名称
`media_cards_db`

## 数据表设计

### 1. cards 表（卡片主表）

存储所有卡片的基本信息。

```sql
CREATE TABLE `cards` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '卡片ID',
  `title` VARCHAR(255) NOT NULL COMMENT '卡片标题',
  `description` TEXT NOT NULL COMMENT '卡片描述',
  `image_path` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '图片存储路径（相对于网站根目录）',
  `category` ENUM('technology', 'art', 'nature', 'sports', 'music', 'game') NOT NULL COMMENT '分类',
  `author` VARCHAR(100) DEFAULT '匿名' COMMENT '作者名称',
  `likes` INT(11) DEFAULT 0 COMMENT '点赞数',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='卡片信息表';
```

### 2. user_favorites 表（用户喜欢表）

存储用户的点赞记录（如果需要多用户系统）。

```sql
CREATE TABLE `user_favorites` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` INT(11) DEFAULT NULL COMMENT '用户ID（如果有多用户系统）',
  `card_id` INT(11) NOT NULL COMMENT '卡片ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_card` (`user_id`, `card_id`),
  KEY `idx_card_id` (`card_id`),
  CONSTRAINT `fk_favorite_card` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户喜欢记录表';
```

### 3. images 表（图片信息表，可选）

如果需要单独管理图片信息，可以创建此表。

```sql
CREATE TABLE `images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `card_id` INT(11) NOT NULL COMMENT '关联的卡片ID',
  `file_name` VARCHAR(255) NOT NULL COMMENT '文件名',
  `file_path` VARCHAR(500) NOT NULL COMMENT '文件存储路径',
  `file_size` INT(11) DEFAULT NULL COMMENT '文件大小（字节）',
  `mime_type` VARCHAR(100) DEFAULT NULL COMMENT 'MIME类型',
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`id`),
  KEY `idx_card_id` (`card_id`),
  CONSTRAINT `fk_image_card` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图片信息表';
```

## 图片存储方案

### 存储路径结构
```
项目根目录/
├── images/              # 图片存储目录
│   ├── card_1234567890.jpg
│   ├── card_1234567891.png
│   └── ...
```

### 图片命名规则
- 格式：`card_{timestamp}.{extension}`
- 示例：`card_1702567890123.jpg`
- 使用时间戳确保文件名唯一性

### 图片路径存储
在 `cards` 表中，`image_path` 字段存储相对路径，例如：
- `images/card_1702567890123.jpg`
- 前端显示时使用：`<img src="images/card_1702567890123.jpg">`

## 后端API接口设计（参考）

### 1. 上传卡片（包含图片）
```
POST /api/cards
Content-Type: multipart/form-data

参数：
- title: 卡片标题
- description: 卡片描述
- category: 分类
- author: 作者
- image: 图片文件

响应：
{
  "success": true,
  "data": {
    "id": 123,
    "title": "卡片标题",
    "image_path": "images/card_1702567890123.jpg",
    ...
  }
}
```

### 2. 获取所有卡片
```
GET /api/cards?category=technology&page=1&limit=10

响应：
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "卡片标题",
      "image_path": "images/card_1702567890123.jpg",
      ...
    }
  ],
  "total": 100
}
```

### 3. 获取单个卡片详情
```
GET /api/cards/:id

响应：
{
  "success": true,
  "data": {
    "id": 1,
    "title": "卡片标题",
    "image_path": "images/card_1702567890123.jpg",
    ...
  }
}
```

### 4. 点赞/取消点赞
```
POST /api/cards/:id/like

响应：
{
  "success": true,
  "data": {
    "liked": true,
    "likes": 42
  }
}
```

## 数据库初始化SQL

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS `media_cards_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `media_cards_db`;

-- 创建cards表
CREATE TABLE `cards` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '卡片ID',
  `title` VARCHAR(255) NOT NULL COMMENT '卡片标题',
  `description` TEXT NOT NULL COMMENT '卡片描述',
  `image_path` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '图片存储路径',
  `category` ENUM('technology', 'art', 'nature', 'sports', 'music', 'game') NOT NULL COMMENT '分类',
  `author` VARCHAR(100) DEFAULT '匿名' COMMENT '作者名称',
  `likes` INT(11) DEFAULT 0 COMMENT '点赞数',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='卡片信息表';

-- 插入示例数据
INSERT INTO `cards` (`title`, `description`, `image_path`, `category`, `author`, `likes`) VALUES
('人工智能的未来', '探索人工智能技术如何改变我们的生活方式，从智能家居到自动驾驶，AI正在重塑世界。', 'images/ai_future.jpg', 'technology', '科技探索者', 42),
('自然风光之美', '感受大自然的壮丽景色，山川河流、日出日落，每一帧都是大自然的杰作。', 'images/nature_beauty.jpg', 'nature', '自然摄影师', 38),
('电子竞技的魅力', '探索电子竞技的精彩世界，感受团队协作和策略思考带来的竞技乐趣。', 'images/game1.jpg', 'game', '游戏评论家', 56);
```

## 注意事项

1. **图片安全**：
   - 验证文件类型（只允许图片格式）
   - 限制文件大小（建议5MB以内）
   - 对上传的文件进行病毒扫描
   - 使用安全的文件名（避免路径遍历攻击）

2. **性能优化**：
   - 为 `category` 和 `created_at` 字段创建索引
   - 对于大量图片，考虑使用CDN或对象存储服务
   - 可以添加图片缩略图功能

3. **数据备份**：
   - 定期备份数据库
   - 备份图片文件目录

4. **本地存储方案**：
   - 当前项目使用 localStorage 存储卡片数据
   - 图片文件存储在 `images/` 目录
   - 图片路径存储在 localStorage 的 JSON 数据中
   - 实际部署时，建议迁移到 MySQL 数据库





