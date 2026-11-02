import { NextResponse } from 'next/server';
const db = require('../../../server/db');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categories = db.getCategories();
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
