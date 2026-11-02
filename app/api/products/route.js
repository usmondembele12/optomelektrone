import { NextResponse } from 'next/server';
const db = require('../../../server/db');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const products = db.getProducts({
      category: category || undefined,
      brand: brand || undefined,
      search: search || undefined,
      featured: featured === 'true'
    });

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: "Mahsulot nomi kiritilishi shart!" }, { status: 400 });
    }
    const newProduct = db.addProduct(body);
    return NextResponse.json(newProduct, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err) {
    console.error('API POST /api/products error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
