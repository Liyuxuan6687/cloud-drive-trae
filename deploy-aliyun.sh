#!/bin/bash

# 阿里云服务器部署脚本
# 用于在阿里云ECS上部署云端网盘应用

set -e

echo "========================================"
echo "  云端网盘 - 阿里云部署脚本"
echo "========================================"

# 配置变量
APP_NAME="cloud-drive"
APP_DIR="/var/www/$APP_NAME"
NODE_VERSION="18"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用root权限运行此脚本"
    exit 1
fi

echo ""
echo "[1/8] 更新系统包..."
apt update && apt upgrade -y

echo ""
echo "[2/8] 安装必要的依赖..."
apt install -y curl wget git nginx

# 安装Node.js
echo ""
echo "[3/8] 安装Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
fi

# 安装PM2
echo ""
echo "[4/8] 安装PM2进程管理器..."
npm install -g pm2

# 创建应用目录
echo ""
echo "[5/8] 创建应用目录..."
mkdir -p $APP_DIR
cd $APP_DIR

# 克隆代码（如果目录为空）
if [ -z "$(ls -A $APP_DIR)" ]; then
    echo ""
    echo "[6/8] 克隆GitHub仓库..."
    git clone https://github.com/Liyuxuan6687/cloud-drive-trae.git .
else
    echo ""
    echo "[6/8] 更新代码..."
    git pull origin main
fi

# 安装依赖
echo ""
echo "[7/8] 安装Node.js依赖..."
npm install

# 创建上传目录
echo ""
echo "创建上传目录..."
mkdir -p uploads
chmod 755 uploads

# 配置Nginx
echo ""
echo "[8/8] 配置Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    server_name _;  # 接受所有域名

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

    # 增加文件上传大小限制
    client_max_body_size 100M;
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx
systemctl enable nginx

# 使用PM2启动应用
echo ""
echo "启动应用..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start server.js --name $APP_NAME
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo "========================================"
echo "  部署完成！"
echo "========================================"
echo ""
echo "应用信息:"
echo "  - 本地访问: http://localhost:3000"
echo "  - 公网访问: http://$(curl -s ifconfig.me)"
echo ""
echo "管理命令:"
echo "  - 查看状态: pm2 status"
echo "  - 查看日志: pm2 logs $APP_NAME"
echo "  - 重启应用: pm2 restart $APP_NAME"
echo "  - 停止应用: pm2 stop $APP_NAME"
echo ""
echo "文件上传目录: $APP_DIR/uploads"
echo ""
echo "========================================"
