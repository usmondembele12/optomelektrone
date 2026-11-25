import { NextResponse } from 'next/server';
const db = require('../../../server/db');
const { sendTelegramOrderNotification } = require('../../../server/telegram');
const { 
  verifyAdminRequest, 
  checkRateLimit, 
  sanitizeText 
} = require('../../../server/security');

export async function GET(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ 
        error: "Ruxsat etilmagan: Buyurtmalar ro'yxatini faqat admin ko'ra oladi" 
      }, { status: 401 });
    }

    const orders = db.getOrders();
    return NextResponse.json(orders, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err) {
    console.error('API GET /api/orders error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Rate limit: max 15 orders per 10 minutes per IP
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(`order_${clientIp}`, 15, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        error: rateCheck.error 
      }, { status: 429 });
    }

    const rawBody = await request.json();
    if (!rawBody) {
      return NextResponse.json({ error: "Ma'lumotlar to'liq emas" }, { status: 400 });
    }

    // Sanitize customer input
    const cleanCustomer = {
      name: sanitizeText(rawBody.customer?.name || rawBody.name || '', 100),
      phone: sanitizeText(rawBody.customer?.phone || rawBody.phone || '', 30),
      address: sanitizeText(rawBody.customer?.address || rawBody.address || '', 200),
      city: sanitizeText(rawBody.customer?.city || rawBody.city || 'Toshkent', 50),
      notes: sanitizeText(rawBody.customer?.notes || rawBody.notes || '', 300),
    };

    if (!cleanCustomer.phone || cleanCustomer.phone.length < 7) {
      return NextResponse.json({ error: "Telefon raqami kiritilishi shart!" }, { status: 400 });
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

    // Send Telegram Notification
    let telegramResult = null;
    try {
      telegramResult = await sendTelegramOrderNotification(newOrder, settings);
    } catch (tgErr) {
      console.error('[API Route] Telegram error:', tgErr);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      telegram: telegramResult
    }, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err) {
    console.error('[API Route] Order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
