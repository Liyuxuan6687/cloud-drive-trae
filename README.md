# 云端网盘

一个简单的云端网盘应用，支持文件上传、下载、用户认证等功能。

## 功能特性

- 用户登录和注册
- 文件上传（支持拖放操作）
- 文件下载
- 按时间排序的文件列表
- 响应式设计，适配各种设备
- 用户空间隔离

## 技术栈

- 前端：HTML、CSS、JavaScript、Bootstrap、Font Awesome
- 后端：Node.js、Express、Multer
- 部署：支持Netlify和服务器部署

## 快速开始

### 本地运行

1. 克隆仓库
2. 安装依赖：`npm install`
3. 启动服务器：`npm start`
4. 访问：http://localhost:3000

### 部署到Netlify

1. 登录Netlify账户
2. 连接GitHub仓库
3. 配置构建命令：`npm run build`
4. 配置发布目录：`dist`
5. 部署

### 部署到服务器

1. 克隆仓库到服务器
2. 安装依赖：`npm install`
3. 运行部署脚本：`./deploy.sh`
4. 使用PM2等工具管理进程

## 项目结构

- `index.html` - 前端页面
- `server.js` - 后端服务器
- `package.json` - 项目配置和依赖
- `netlify/` - Netlify函数
- `uploads/` - 上传文件存储目录
- `deploy.sh` - 服务器部署脚本

## API文档

### 认证API

- `POST /api/login` - 用户登录
- `POST /api/register` - 用户注册

### 文件API

- `POST /upload` - 上传文件
- `GET /files` - 获取文件列表
- `GET /files/:userId/:filename` - 下载文件

## 注意事项

- 本项目使用模拟用户数据，实际生产环境应使用数据库
- 本项目使用本地文件系统存储文件，实际生产环境应使用云存储服务
- 本项目使用简单的token验证，实际生产环境应使用JWT等安全的认证方式

## 许可证

MIT License