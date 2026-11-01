import { NextResponse } from 'next/server';
const db = require('../../../../server/db');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = db.getProductById(id);
    if (!product) return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
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
    const { id } = await params;
    const success = db.deleteProduct(id);
    if (!success) return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    return NextResponse.json({ message: "Mahsulot muvaffaqiyatli o'chirildi" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

