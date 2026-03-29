# 云端网盘

一个简单的云端网盘应用，支持文件上传、下载、用户认证等功能。

## 🌐 在线访问

- **GitHub仓库**: https://github.com/Liyuxuan6687/cloud-drive-trae
- **服务器地址**: http://8.163.51.120 (部署后访问)

## ✨ 功能特性

- 用户登录和注册
- 文件上传（支持拖放操作）
- 文件下载
- 按时间排序的文件列表
- 响应式设计，适配各种设备
- 用户空间隔离

## 🛠️ 技术栈

- 前端：HTML、CSS、JavaScript、Bootstrap、Font Awesome
- 后端：Node.js、Express、Multer
- 部署：支持Netlify和服务器部署

## 🚀 快速开始

### 本地运行

1. 克隆仓库
```bash
git clone https://github.com/Liyuxuan6687/cloud-drive-trae.git
cd cloud-drive-trae
```

2. 安装依赖
```bash
npm install
```

3. 启动服务器
```bash
npm start
```

4. 访问：http://localhost:3000

### 部署到阿里云服务器

#### 方法一：使用自动部署脚本（推荐）

1. 连接到服务器
```bash
ssh root@8.163.51.120
```

2. 下载并运行部署脚本
```bash
curl -fsSL https://raw.githubusercontent.com/Liyuxuan6687/cloud-drive-trae/main/deploy-aliyun.sh | bash
```

#### 方法二：手动部署

1. 连接到服务器
```bash
ssh root@8.163.51.120
```

2. 更新系统并安装依赖
```bash
apt update && apt upgrade -y
apt install -y git nodejs npm nginx
npm install -g pm2
```

3. 克隆代码
```bash
mkdir -p /var/www/cloud-drive
cd /var/www/cloud-drive
git clone https://github.com/Liyuxuan6687/cloud-drive-trae.git .
```

4. 安装依赖
```bash
npm install
mkdir -p uploads
chmod 755 uploads
```

5. 配置Nginx
```bash
cat > /etc/nginx/sites-available/cloud-drive << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 100M;
}
EOF

ln -sf /etc/nginx/sites-available/cloud-drive /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx
```

6. 启动应用
```bash
pm2 start server.js --name "cloud-drive"
pm2 save
pm2 startup
```

### 部署到Netlify

1. 登录Netlify账户
2. 连接GitHub仓库
3. 配置构建命令：`npm run build`
4. 配置发布目录：`dist`
5. 部署

## 📁 项目结构

```
cloud-drive-trae/
├── index.html          # 前端页面
├── server.js           # 后端服务器
├── package.json        # 项目配置和依赖
├── netlify.toml        # Netlify配置
├── deploy.sh           # 基础部署脚本
├── deploy-aliyun.sh    # 阿里云部署脚本
├── .gitignore          # Git忽略文件
├── netlify/            # Netlify函数
│   └── functions/
│       ├── files.js
│       └── upload.js
├── uploads/            # 上传文件存储目录
└── .trae/              # Trae技能
    └── skills/
        └── server-deployment/
            └── SKILL.md
```

## 🔌 API文档

### 认证API

- `POST /api/login` - 用户登录
- `POST /api/register` - 用户注册

### 文件API

- `POST /upload` - 上传文件
- `GET /files` - 获取文件列表
- `GET /files/:userId/:filename` - 下载文件

## ⚙️ 管理命令

```bash
# 查看应用状态
pm2 status

# 查看应用日志
pm2 logs cloud-drive

# 重启应用
pm2 restart cloud-drive

# 停止应用
pm2 stop cloud-drive

# 删除应用
pm2 delete cloud-drive
```

## 📝 配置说明

### 环境变量

创建 `.env` 文件来配置环境变量：

```env
PORT=3000
NODE_ENV=production
```

### Nginx配置

已配置Nginx作为反向代理，支持：
- 静态文件服务
- 反向代理到Node.js应用
- 文件上传大小限制（100MB）

## 🔒 安全说明

- 本项目使用模拟用户数据，实际生产环境应使用数据库
- 本项目使用本地文件系统存储文件，实际生产环境应使用云存储服务
- 本项目使用简单的token验证，实际生产环境应使用JWT等安全的认证方式
- 建议配置SSL证书以启用HTTPS

## 🐛 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 2. 权限问题
```bash
# 修改上传目录权限
chmod -R 755 /var/www/cloud-drive/uploads
chown -R www-data:www-data /var/www/cloud-drive/uploads
```

### 3. Nginx配置错误
```bash
# 测试配置
nginx -t

# 查看错误日志
tail -f /var/log/nginx/error.log
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系

如有问题，请通过GitHub Issues联系。