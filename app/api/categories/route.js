import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    try {
      const res = await fetch('http://localhost:5000/api/categories', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, {
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
        });
      }
    } catch (_) {}

    const db = require('../../../server/db');
    const categories = db.getCategories();
    return NextResponse.json(categories, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
