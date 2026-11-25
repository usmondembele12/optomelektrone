import { NextResponse } from 'next/server';
const db = require('../../../../../server/db');
const { verifyAdminRequest, sanitizeText } = require('../../../../../server/security');

export async function PATCH(request, { params }) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ 
        error: "Ruxsat etilmagan: Faqat admin buyurtma holatini o'zgartira oladi" 
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const cleanStatus = sanitizeText(body.status || '', 30);

    const validStatuses = ['yangi', 'qabul_qilindi', 'yetkazilmoqda', 'yakunlandi', 'bekor_qilindi'];
    if (!validStatuses.includes(cleanStatus)) {
      return NextResponse.json({ error: "Noto'g'ri buyurtma holati" }, { status: 400 });
    }

    const updated = db.updateOrderStatus(id, cleanStatus);
    if (!updated) return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
