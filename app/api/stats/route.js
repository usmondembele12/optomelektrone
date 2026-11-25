import { NextResponse } from 'next/server';
const db = require('../../../server/db');
const { verifyAdminRequest } = require('../../../server/security');

export async function GET(request) {
  try {
    const auth = verifyAdminRequest(request);
    const stats = db.getStats();

    if (auth.authorized) {
      return NextResponse.json(stats, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      });
    }

    // Public sanitized stats (only product count, no revenue or internal order metrics)
    return NextResponse.json({
      totalProducts: stats.totalProducts,
      totalCategories: stats.totalCategories || 8
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
