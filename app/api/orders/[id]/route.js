import { NextResponse } from 'next/server';
const db = require('../../../../server/db');
const { verifyAdminRequest, maskOrderPII } = require('../../../../server/security');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Buyurtma ID si kiritilmadi" }, { status: 400 });
    }

    const cleanId = String(id).trim();
    const order = db.getOrderById(cleanId);

    if (!order) {
      return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });
    }

    const auth = verifyAdminRequest(request);
    // If admin is requesting, return full details. Otherwise mask sensitive PII for customer tracking.
    const responseData = auth.authorized ? order : maskOrderPII(order);

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err) {
    console.error('API GET /api/orders/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ 
        error: "Ruxsat etilmagan: Faqat admin buyurtmani o'chira oladi" 
      }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Buyurtma ID si kiritilmadi" }, { status: 400 });
    }

    const cleanId = String(id).trim();
    const success = db.deleteOrder(cleanId);

    if (success) {
      return NextResponse.json({ success: true, message: "Buyurtma o'chirildi" });
    }

    return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });
  } catch (err) {
    console.error('API DELETE /api/orders/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
