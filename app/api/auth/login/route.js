import { NextResponse } from 'next/server';
const db = require('../../../../server/db');

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const settings = db.getSettings();
    const validUsername = settings.adminUsername || 'admin';
    const validPassword = settings.adminPassword || 'admin123';

    if (username === validUsername && password === validPassword) {
      const token = 'optom_admin_auth_' + Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return NextResponse.json({ success: true, token, username });
    } else {
      return NextResponse.json({ success: false, error: "Login yoki parol noto'g'ri!" }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
