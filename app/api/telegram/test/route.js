import { NextResponse } from 'next/server';
const { sendTestMessage } = require('../../../../server/telegram');
const { verifyAdminRequest, checkRateLimit, sanitizeText } = require('../../../../server/security');

export async function POST(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ 
        error: "Ruxsat etilmagan: Telegram test xabarini faqat admin yubora oladi" 
      }, { status: 401 });
    }

    // Rate limit test messages: max 3 tests per 5 minutes
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(`tg_test_${clientIp}`, 3, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.error }, { status: 429 });
    }

    const { token, chatId } = await request.json();
    const cleanToken = sanitizeText(token || '', 100);
    const cleanChatId = sanitizeText(String(chatId || ''), 50);

    const result = await sendTestMessage(cleanToken, cleanChatId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
