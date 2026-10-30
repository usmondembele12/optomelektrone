const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./db');
const { sendTelegramOrderNotification, sendTestMessage } = require('./telegram');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images from public folder
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Serve Admin Panel UI
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Root route redirect to /admin or info
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// ==================== REST API ====================

// Products
app.get('/api/products', (req, res) => {
  try {
    const { category, brand, search, featured } = req.query;
    const products = db.getProducts({ category, brand, search, featured });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Mahsulot topilmadi' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const newProduct = db.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Mahsulot topilmadi' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Mahsulot topilmadi' });
    res.json({ message: 'Mahsulot muvaffaqiyatli o\'chirildi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
app.get('/api/categories', (req, res) => {
  try {
    res.json(db.getCategories());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.get('/api/orders', (req, res) => {
  try {
    res.json(db.getOrders());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Buyurtma topilmadi' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = db.createOrder(req.body);
    const settings = db.getSettings();

    // Trigger Telegram Bot Notification asynchronously
    const tgResult = await sendTelegramOrderNotification(newOrder, settings);

    res.status(201).json({
      success: true,
      order: newOrder,
      telegram: tgResult
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Buyurtma topilmadi' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const settings = db.getSettings();
    const validUsername = settings.adminUsername || 'admin';
    const validPassword = settings.adminPassword || 'admin123';

    if (username === validUsername && password === validPassword) {
      const token = 'optom_admin_auth_' + Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return res.json({ success: true, token, username });
    } else {
      return res.status(401).json({ success: false, error: 'Login yoki parol noto\'g\'ri!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statistics
app.get('/api/stats', (req, res) => {
  try {
    res.json(db.getStats());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings
app.get('/api/settings', (req, res) => {
  try {
    res.json(db.getSettings());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Telegram Bot Test
app.post('/api/telegram/test', async (req, res) => {
  try {
    const { token, chatId } = req.body;
    const result = await sendTestMessage(token, chatId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚡ OPTOM elektro Backend Server is running!`);
  console.log(`📊 Admin Panel Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔌 REST API Base:        http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});

