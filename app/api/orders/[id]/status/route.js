import { NextResponse } from 'next/server';
const db = require('../../../../../server/db');

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const updated = db.updateOrderStatus(id, status);
    if (!updated) return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
