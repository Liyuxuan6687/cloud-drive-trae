const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 配置跨域
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 模拟用户数据
const users = [
    { id: 1, username: 'admin', password: 'admin123' },
    { id: 2, username: 'user', password: 'user123' }
];

// 登录API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // 查找用户
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 模拟生成token
        const token = 'token-' + Date.now() + '-' + user.id;
        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: '用户名或密码错误'
        });
    }
});

// 注册API
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    // 检查密码长度
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: '密码长度至少为6位'
        });
    }
    
    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: '用户名已存在'
        });
    }
    
    // 创建新用户
    const newUser = {
        id: users.length + 1,
        username: username,
        password: password
    };
    
    users.push(newUser);
    
    res.json({
        success: true,
        message: '注册成功'
    });
});

// 验证token中间件
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ success: false, message: '未提供token' });
    }
    
    // 简单验证token格式
    if (token.startsWith('Bearer ')) {
        const tokenValue = token.substring(7);
        // 这里应该验证token的有效性，实际项目中应该使用JWT
        if (tokenValue) {
            // 从token中提取用户ID
            const userId = tokenValue.split('-')[2] || 'unknown';
            // 将用户ID存储在req对象中
            req.user = { id: userId };
            next();
        } else {
            res.status(401).json({ success: false, message: '无效的token' });
        }
    } else {
        res.status(401).json({ success: false, message: '无效的token格式' });
    }
}

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 使用从中间件中获取的用户ID
    const userId = req.user?.id || 'unknown';
    
    // 为每个用户创建单独的目录
    const uploadDir = path.join(__dirname, 'uploads', userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 处理中文文件名编码问题
    let fileName = file.originalname;
    try {
      // 尝试将Latin1编码的字符串转换回UTF-8
      fileName = Buffer.from(fileName, 'latin1').toString('utf8');
    } catch (e) {
      // 如果转换失败，使用原始文件名
    }
    cb(null, Date.now() + '-' + fileName);
  }
});

const upload = multer({ storage: storage });

// 根路径返回index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 上传接口（需要验证token）
app.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
  // 使用从中间件中获取的用户ID
  const userId = req.user?.id || 'unknown';
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    downloadUrl: `http://localhost:${PORT}/files/${userId}/${req.file.filename}`
  });
});

// 静态文件服务，用于访问上传的文件
app.get('/files/:userId/:filename', verifyToken, (req, res) => {
  const { userId, filename } = req.params;
  
  // 使用从中间件中获取的用户ID
  const currentUserId = req.user?.id || 'unknown';
  
  // 只有用户自己才能访问自己的文件
  if (currentUserId !== userId) {
    return res.status(403).json({ success: false, message: '无权访问该文件' });
  }
  
  const filePath = path.join(__dirname, 'uploads', userId, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// 获取文件列表接口（需要验证token）
app.get('/files', verifyToken, (req, res) => {
  // 使用从中间件中获取的用户ID
  const userId = req.user?.id || 'unknown';
  
  const uploadDir = path.join(__dirname, 'uploads', userId);
  if (!fs.existsSync(uploadDir)) {
    return res.json([]);
  }
  
  const files = fs.readdirSync(uploadDir).map(file => ({
    name: file,
    downloadUrl: `http://localhost:${PORT}/files/${userId}/${file}`
  }));
  res.json(files);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});