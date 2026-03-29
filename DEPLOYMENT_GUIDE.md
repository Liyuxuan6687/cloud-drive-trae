# 云端网盘 - 部署指南

## 快速部署

### 连接到服务器
```bash
ssh root@8.163.51.120
```

### 运行自动部署脚本
```bash
curl -fsSL https://raw.githubusercontent.com/Liyuxuan6687/cloud-drive-trae/main/deploy-aliyun.sh | bash
```

部署完成后访问：http://8.163.51.120

## 手动部署步骤

1. 更新系统：`apt update && apt upgrade -y`
2. 安装Node.js：`apt install -y nodejs npm`
3. 安装PM2：`npm install -g pm2`
4. 安装Nginx：`apt install -y nginx`
5. 克隆代码：`git clone https://github.com/Liyuxuan6687/cloud-drive-trae.git /var/www/cloud-drive`
6. 安装依赖：`cd /var/www/cloud-drive && npm install`
7. 启动应用：`pm2 start server.js --name "cloud-drive"`
8. 配置Nginx反向代理到3000端口

## 管理命令

- 查看状态：`pm2 status`
- 查看日志：`pm2 logs cloud-drive`
- 重启应用：`pm2 restart cloud-drive`
- 停止应用：`pm2 stop cloud-drive`
