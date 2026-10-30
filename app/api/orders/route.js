import { NextResponse } from 'next/server';
const db = require('../../../server/db');
const { sendTelegramOrderNotification } = require('../../../server/telegram');

export async function GET() {
  try {
    const orders = db.getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newOrder = db.createOrder(body);
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
    }, { status: 201 });
  } catch (err) {
    console.error('[API Route] Order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

