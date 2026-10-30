import { NextResponse } from 'next/server';
const db = require('../../../server/db');

export async function GET() {
  try {
    const settings = db.getSettings();
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const updated = db.updateSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
