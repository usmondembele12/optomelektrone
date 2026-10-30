import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // Attempt to fetch latest from Express backend server first
    try {
      const backendUrl = new URL('http://localhost:5000/api/products');
      if (category) backendUrl.searchParams.set('category', category);
      if (brand) backendUrl.searchParams.set('brand', brand);
      if (search) backendUrl.searchParams.set('search', search);
      if (featured) backendUrl.searchParams.set('featured', featured);

      const res = await fetch(backendUrl.toString(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        });
      }
    } catch (_) {}

    // Fallback directly to db
    const db = require('../../../server/db');
    const products = db.getProducts({
      category: category || undefined,
      brand: brand || undefined,
      search: search || undefined,
      featured: featured === 'true'
    });

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
