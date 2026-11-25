const crypto = require('crypto');

// Load secret or fallback to high-entropy persistent secret
const DEFAULT_SECRET = 'optom_elektro_super_secure_key_2026_9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || DEFAULT_SECRET;

// ==================== 1. PASSWORD HASHING ====================

/**
 * Hashes password using PBKDF2 with SHA-512 and salt
 */
function hashPassword(password, customSalt = null) {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(String(password), salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verifies password against stored hash or legacy plain string (with automatic upgrade)
 */
function verifyPassword(password, storedHash, salt = null) {
  if (!password || !storedHash) return false;
  
  // If salt is present, do constant-time hash comparison
  if (salt) {
    const computed = crypto.pbkdf2Sync(String(password), salt, 100000, 64, 'sha512').toString('hex');
    try {
      const a = Buffer.from(computed, 'hex');
      const b = Buffer.from(storedHash, 'hex');
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch (_) {
      return false;
    }
  }

  // Legacy plaintext check (will be upgraded on login)
  try {
    const a = Buffer.from(String(password));
    const b = Buffer.from(String(storedHash));
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (_) {
    return password === storedHash;
  }
}

// ==================== 2. SECURE TOKENS ====================

/**
 * Creates HMAC-SHA256 signed JWT-like token (Valid for 7 days)
 */
function generateToken(payload, expiresInMs = 7 * 24 * 60 * 60 * 1000) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Date.now() + expiresInMs;
  const fullPayload = { ...payload, exp, iat: Date.now() };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const dataToSign = `${headerB64}.${payloadB64}`;

  const signature = crypto.createHmac('sha256', JWT_SECRET).update(dataToSign).digest('base64url');
  return `${dataToSign}.${signature}`;
}

/**
 * Verifies HMAC-SHA256 signed token
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return { valid: false, reason: 'Token yo\'q' };
  
  // Support legacy token temporary migration if needed
  if (token.startsWith('optom_admin_auth_')) {
    try {
      const raw = token.replace('optom_admin_auth_', '');
      const decoded = Buffer.from(raw, 'base64').toString('utf8');
      const [username, timestamp] = decoded.split(':');
      const age = Date.now() - Number(timestamp);
      // Valid for at most 24 hours during transition
      if (username && age > 0 && age < 24 * 60 * 60 * 1000) {
        return { valid: true, payload: { username, role: 'admin', legacy: true } };
      }
    } catch (_) {}
  }

  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'Noto\'g\'ri token formati' };

  const [headerB64, payloadB64, signature] = parts;
  const dataToSign = `${headerB64}.${payloadB64}`;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(dataToSign).digest('base64url');

  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return { valid: false, reason: 'Token imzosi noto\'g\'ri' };
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return { valid: false, reason: 'Token muddati tugagan' };
    }

    return { valid: true, payload };
  } catch (e) {
    return { valid: false, reason: 'Token xatosi: ' + e.message };
  }
}

/**
 * Extracts and verifies token from Next.js Request or Express req
 */
function verifyAdminRequest(req) {
  let authHeader = null;

  // Next.js Web Request
  if (req && req.headers && typeof req.headers.get === 'function') {
    authHeader = req.headers.get('authorization') || req.headers.get('x-admin-token');
  } 
  // Express Request
  else if (req && req.headers) {
    authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  }

  if (!authHeader) return { authorized: false, error: 'Avtorizatsiya talab qilinadi' };

  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  const res = verifyToken(token);
  if (!res.valid) {
    return { authorized: false, error: res.reason || 'Yaroqsiz avtorizatsiya' };
  }

  return { authorized: true, user: res.payload };
}

// ==================== 3. RATE LIMITING ====================

const rateLimitBuckets = new Map();

/**
 * In-memory sliding window rate limiter
 */
function checkRateLimit(key, maxAttempts, windowMs) {
  const now = Date.now();
  const record = rateLimitBuckets.get(key) || { attempts: [], blockedUntil: 0 };

  // If blocked
  if (record.blockedUntil > now) {
    const remainingSec = Math.ceil((record.blockedUntil - now) / 1000);
    return { 
      allowed: false, 
      remainingSec, 
      error: `Juda ko'p urinishlar. Iltimos, ${remainingSec} soniyadan so'ng qayta urinib ko'ring.` 
    };
  }

  // Filter out attempts outside window
  record.attempts = record.attempts.filter(ts => (now - ts) < windowMs);

  if (record.attempts.length >= maxAttempts) {
    record.blockedUntil = now + windowMs;
    rateLimitBuckets.set(key, record);
    const remainingSec = Math.ceil(windowMs / 1000);
    return { 
      allowed: false, 
      remainingSec, 
      error: `Urinishlar soni oshib ketdi. ${remainingSec} soniyaga bloklandi.` 
    };
  }

  record.attempts.push(now);
  rateLimitBuckets.set(key, record);
  return { allowed: true, remainingAttempts: maxAttempts - record.attempts.length };
}

/**
 * Clears rate limit upon successful action
 */
function clearRateLimit(key) {
  rateLimitBuckets.delete(key);
}

// ==================== 4. SENSITIVE DATA MASKS & FILTERS ====================

/**
 * Strips sensitive fields from settings for public consumption
 */
function filterPublicSettings(settings = {}) {
  const safe = {
    siteName: settings.siteName || "OptomElektro",
    storeName: settings.storeName || "OPTOM elektro",
    phone: settings.phone || "+998 95 009-09-09",
    storePhone: settings.storePhone || "+998 95 009-09-09",
    storePhoneSecondary: settings.storePhoneSecondary || "+998 97 447-47-47",
    storePhoneManager: settings.storePhoneManager || "+998 98 111-70-70",
    address: settings.address || "Toshkent sh., Chuqursoy Savdo Markazi, 1-183 do'kon (Jomiy bozori)",
    storeAddress: settings.storeAddress || "Toshkent sh., Chuqursoy Savdo Markazi, 1-183 do'kon (Jomiy bozori)",
    storeTagline: settings.storeTagline || "LUX VOLT, ELEBOX va GIP elektrotexnika mahsulotlarining rasmiy ulgurji va chakana savdo markazi",
    workingHours: settings.workingHours || "Dush - Shan: 08:30 - 18:30",
    deliveryCost: settings.deliveryCost || 30000,
    freeDeliveryMin: settings.freeDeliveryMin || 1000000,
    wholesaleMinAmount: settings.wholesaleMinAmount || 2000000,
    storeTelegram: settings.storeTelegram || "https://t.me/optomelektro"
  };
  return safe;
}

/**
 * Masks customer PII for safe public order tracking
 */
function maskOrderPII(order) {
  if (!order) return null;
  const clone = { ...order };

  // Mask phone: e.g. "+998 90 123 45 67" -> "+998 90 *** ** 67"
  if (clone.phone) {
    const raw = String(clone.phone).replace(/\s+/g, '');
    if (raw.length >= 7) {
      const start = raw.substring(0, raw.length - 6);
      const end = raw.substring(raw.length - 2);
      clone.phone = `${start} *** ** ${end}`;
    } else {
      clone.phone = '***';
    }
  }

  // Mask address
  if (clone.address) {
    clone.address = clone.city ? `${clone.city} (Aniq manzil yashirilgan)` : 'Yetkazib berish manzili yashirilgan';
  }

  return clone;
}

// ==================== 5. INPUT SANITIZATION ====================

function sanitizeText(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLength);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  verifyAdminRequest,
  checkRateLimit,
  clearRateLimit,
  filterPublicSettings,
  maskOrderPII,
  sanitizeText,
  JWT_SECRET
};
