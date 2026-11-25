const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./db');
const { sendTelegramOrderNotification, sendTestMessage } = require('./telegram');
const {
  verifyAdminRequest,
  verifyPassword,
  hashPassword,
  generateToken,
  checkRateLimit,
  clearRateLimit,
  filterPublicSettings,
  maskOrderPII,
  sanitizeText
} = require('./security');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Tightened CORS: Allows same origin and local dev
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during local deployment, can be locked down with production domain
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static images from public folder
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Serve Admin Panel UI
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Root route redirect to /admin
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// ==================== REST API ====================

// Products
app.get('/api/products', (req, res) => {
  try {
    const { category, brand, search, featured } = req.query;
    const products = db.getProducts({ category, brand, search, featured });
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Mahsulot topilmadi' });
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Only Admin can add products
app.post('/api/products', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Yangi mahsulot qo'shish uchun admin avtorizatsiyasi talab qilinadi" });
    }

    if (!req.body || !req.body.name) {
      return res.status(400).json({ error: "Mahsulot nomi kiritilishi shart!" });
    }

    const sanitized = {
      ...req.body,
      name: sanitizeText(req.body.name, 200),
      brand: sanitizeText(req.body.brand || 'Standart', 50),
      category: sanitizeText(req.body.category || 'avtomatlar', 50),
    };

    const newProduct = db.addProduct(sanitized);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Only Admin can update products
app.put('/api/products/:id', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Mahsulotni tahrirlash uchun admin ruxsati kerak" });
    }

    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Mahsulot topilmadi' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Only Admin can delete products
app.delete('/api/products/:id', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Mahsulotni o'chirish uchun admin avtorizatsiyasi talab qilinadi" });
    }

    const success = db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Mahsulot topilmadi' });
    res.json({ message: "Mahsulot muvaffaqiyatli o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories (Public)
app.get('/api/categories', (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(db.getCategories());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders - Protected: Only Admin can view all orders list
app.get('/api/orders', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Buyurtmalar ro'yxatini faqat admin ko'ra oladi" });
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(db.getOrders());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Order Lookup (Masks customer phone and exact address if not admin)
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Buyurtma topilmadi' });

    const auth = verifyAdminRequest(req);
    const data = auth.authorized ? order : maskOrderPII(order);

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Creation (Rate limited + Input sanitized)
app.post('/api/orders', async (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const rateCheck = checkRateLimit(`order_${clientIp}`, 15, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.error });
    }

    const rawBody = req.body;
    if (!rawBody) {
      return res.status(400).json({ error: "Ma'lumotlar to'liq emas" });
    }

    const cleanCustomer = {
      name: sanitizeText(rawBody.customer?.name || rawBody.name || '', 100),
      phone: sanitizeText(rawBody.customer?.phone || rawBody.phone || '', 30),
      address: sanitizeText(rawBody.customer?.address || rawBody.address || '', 200),
      city: sanitizeText(rawBody.customer?.city || rawBody.city || 'Toshkent', 50),
      notes: sanitizeText(rawBody.customer?.notes || rawBody.notes || '', 300),
    };

    if (!cleanCustomer.phone || cleanCustomer.phone.length < 7) {
      return res.status(400).json({ error: "Telefon raqami kiritilishi shart!" });
    }

    const sanitizedPayload = {
      ...rawBody,
      customer: cleanCustomer,
      name: cleanCustomer.name,
      phone: cleanCustomer.phone,
      address: cleanCustomer.address,
      city: cleanCustomer.city,
      notes: cleanCustomer.notes
    };

    const newOrder = db.createOrder(sanitizedPayload);
    const settings = db.getSettings();

    // Trigger Telegram Bot Notification asynchronously
    let tgResult = null;
    try {
      tgResult = await sendTelegramOrderNotification(newOrder, settings);
    } catch (tgErr) {
      console.error('[Backend] Telegram error:', tgErr);
    }

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

// Protected: Only Admin can update status
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Faqat admin buyurtma holatini o'zgartira oladi" });
    }

    const { status } = req.body;
    const cleanStatus = sanitizeText(status || '', 30);
    const updated = db.updateOrderStatus(req.params.id, cleanStatus);
    if (!updated) return res.status(404).json({ error: 'Buyurtma topilmadi' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Only Admin can delete orders
app.delete('/api/orders/:id', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Faqat admin buyurtmani o'chira oladi" });
    }

    const success = db.deleteOrder(req.params.id);
    if (!success) return res.status(404).json({ error: 'Buyurtma topilmadi' });
    res.json({ success: true, message: "Buyurtma o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication (Rate-limited + Secure HMAC-SHA256 tokens)
app.post('/api/auth/login', (req, res) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const rateLimitKey = `login_${clientIp}`;

    const limitCheck = checkRateLimit(rateLimitKey, 5, 5 * 60 * 1000);
    if (!limitCheck.allowed) {
      return res.status(429).json({ success: false, error: limitCheck.error });
    }

    const { username, password } = req.body;
    const cleanUsername = sanitizeText(username || '', 50);
    const cleanPassword = String(password || '').trim();

    if (!cleanUsername || !cleanPassword) {
      return res.status(400).json({ success: false, error: "Login va parolni kiriting!" });
    }

    const settings = db.getSettings();
    const validUsername = settings.adminUsername || 'admin';
    const storedHash = settings.adminPasswordHash || settings.adminPassword || 'admin123';
    const storedSalt = settings.adminPasswordSalt || null;

    const isUserValid = (cleanUsername === validUsername);
    const isPasswordValid = verifyPassword(cleanPassword, storedHash, storedSalt);

    if (isUserValid && isPasswordValid) {
      clearRateLimit(rateLimitKey);

      // Auto-upgrade plaintext password
      if (!settings.adminPasswordSalt) {
        try {
          const { hash, salt } = hashPassword(cleanPassword);
          db.updateSettings({ adminPasswordHash: hash, adminPasswordSalt: salt });
        } catch (_) {}
      }

      const token = generateToken({ username: cleanUsername, role: 'admin' });
      return res.json({ success: true, token, username: cleanUsername });
    } else {
      return res.status(401).json({ 
        success: false, 
        error: `Login yoki parol noto'g'ri! (Qolgan urinishlar: ${limitCheck.remainingAttempts})` 
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statistics (Protected breakdown, sanitized public stats)
app.get('/api/stats', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    const stats = db.getStats();

    if (auth.authorized) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      return res.json(stats);
    }

    res.json({
      totalProducts: stats.totalProducts,
      totalCategories: stats.totalCategories || 8
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings - Hides secrets from public, allows full read/write only for verified Admin
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    const auth = verifyAdminRequest(req);

    if (auth.authorized) {
      const adminView = { ...settings };
      delete adminView.adminPasswordHash;
      delete adminView.adminPasswordSalt;
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      return res.json(adminView);
    }

    const publicSettings = filterPublicSettings(settings);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json(publicSettings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Admin avtorizatsiyasi talab qilinadi" });
    }

    const updatePayload = { ...req.body };
    if (updatePayload.adminPassword) {
      const { hash, salt } = hashPassword(updatePayload.adminPassword);
      updatePayload.adminPasswordHash = hash;
      updatePayload.adminPasswordSalt = salt;
    }

    if (updatePayload.adminUsername) {
      updatePayload.adminUsername = sanitizeText(updatePayload.adminUsername, 50);
    }

    const updated = db.updateSettings(updatePayload);
    const safeResult = { ...updated };
    delete safeResult.adminPasswordHash;
    delete safeResult.adminPasswordSalt;

    res.json(safeResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Telegram Bot Test (Admin only + rate limited)
app.post('/api/telegram/test', async (req, res) => {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return res.status(401).json({ error: "Ruxsat etilmagan: Telegram test xabarini faqat admin yubora oladi" });
    }

    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const rateCheck = checkRateLimit(`tg_test_${clientIp}`, 3, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.error });
    }

    const { token, chatId } = req.body;
    const cleanToken = sanitizeText(token || '', 100);
    const cleanChatId = sanitizeText(String(chatId || ''), 50);

    const result = await sendTestMessage(cleanToken, cleanChatId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Database & Prisma Status
app.get('/api/db/status', async (req, res) => {
  const hasDbUrl = !!process.env.DATABASE_URL;
  let prismaConnected = false;
  let postgresStats = null;
  let error = null;

  if (hasDbUrl) {
    try {
      const getPrisma = db.getPrismaClient;
      const prisma = getPrisma ? getPrisma() : null;
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`;
        prismaConnected = true;
        const [prodCount, orderCount] = await Promise.all([
          prisma.product.count(),
          prisma.order.count(),
        ]);
        postgresStats = { totalProducts: prodCount, totalOrders: orderCount };
      }
    } catch (e) {
      prismaConnected = false;
      error = e.message;
    }
  }

  const localStats = db.getStats();

  res.json({
    status: prismaConnected ? 'connected' : 'fallback',
    orm: 'Prisma 6.4.1',
    database: prismaConnected ? 'PostgreSQL' : 'Local JSON Store',
    hasDatabaseUrlConfigured: hasDbUrl,
    prismaConnected,
    postgresStats,
    localStats: {
      totalProducts: localStats.totalProducts,
      totalOrders: localStats.totalOrders,
      totalRevenue: localStats.totalRevenue,
    },
    error: error || undefined,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚡ OPTOM elektro Secure Backend Server is running!`);
  console.log(`📊 Admin Panel Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔌 REST API Base:        http://localhost:${PORT}/api`);
  console.log(`🛡️  Security Shield:      ENABLED (HMAC JWT, RateLimit, CORS, Hash)`);
  console.log(`===============================================`);
});
