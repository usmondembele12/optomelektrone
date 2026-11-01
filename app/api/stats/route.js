import { NextResponse } from 'next/server';
const db = require('../../../server/db');

export async function GET() {
  try {
    const stats = db.getStats();
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

