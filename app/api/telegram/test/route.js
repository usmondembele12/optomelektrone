import { NextResponse } from 'next/server';
const { sendTestMessage } = require('../../../../server/telegram');

export async function POST(request) {
  try {
    const { token, chatId } = await request.json();
    const result = await sendTestMessage(token, chatId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
