import { NextResponse } from 'next/server';
const db = require('../../../../server/db');
const { verifyAdminRequest, sanitizeText } = require('../../../../server/security');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = db.getProductById(id);
    if (!product) return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ 
        error: "Ruxsat etilmagan: Mahsulotni tahrirlash uchun admin ruxsati kerak" 
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = db.updateProduct(id, body);
    if (!updated) return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ 
        error: "Ruxsat etilmagan: Mahsulotni o'chirish uchun admin avtorizatsiyasi talab qilinadi" 
      }, { status: 401 });
    }

    const { id } = await params;
    const success = db.deleteProduct(id);
    if (!success) return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    return NextResponse.json({ success: true, message: "Mahsulot muvaffaqiyatli o'chirildi" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
