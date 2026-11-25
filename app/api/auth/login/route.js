import { NextResponse } from 'next/server';
const db = require('../../../../server/db');
const { 
  verifyPassword, 
  hashPassword, 
  generateToken, 
  checkRateLimit, 
  clearRateLimit,
  sanitizeText 
} = require('../../../../server/security');

export async function POST(request) {
  try {
    // 1. Client IP tracking for Rate Limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateLimitKey = `login_${clientIp}`;

    // 2. Check Brute-Force Rate Limit: max 5 attempts per 5 minutes
    const limitCheck = checkRateLimit(rateLimitKey, 5, 5 * 60 * 1000);
    if (!limitCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        error: limitCheck.error 
      }, { status: 429 });
    }

    const body = await request.json();
    const username = sanitizeText(body.username || '', 50);
    const password = String(body.password || '').trim();

    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Login va parolni kiriting!" 
      }, { status: 400 });
    }

    const settings = db.getSettings();
    const validUsername = settings.adminUsername || 'admin';
    const storedHash = settings.adminPasswordHash || settings.adminPassword || 'admin123';
    const storedSalt = settings.adminPasswordSalt || null;

    const isUserValid = (username === validUsername);
    const isPasswordValid = verifyPassword(password, storedHash, storedSalt);

    if (isUserValid && isPasswordValid) {
      // Clear rate limit on success
      clearRateLimit(rateLimitKey);

      // Auto-upgrade plaintext password to cryptographic hash + salt if not yet upgraded
      if (!settings.adminPasswordSalt) {
        try {
          const { hash, salt } = hashPassword(password);
          db.updateSettings({
            adminPasswordHash: hash,
            adminPasswordSalt: salt
          });
        } catch (_) {}
      }

      // Generate cryptographically signed HMAC-SHA256 JWT
      const token = generateToken({ username, role: 'admin' });

      return NextResponse.json({ 
        success: true, 
        token, 
        username 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: `Login yoki parol noto'g'ri! (Qolgan urinishlar: ${limitCheck.remainingAttempts})` 
      }, { status: 401 });
    }
  } catch (err) {
    console.error('API /api/auth/login error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
