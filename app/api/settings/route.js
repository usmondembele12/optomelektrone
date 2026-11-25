import { NextResponse } from 'next/server';
const db = require('../../../server/db');
const { 
  verifyAdminRequest, 
  filterPublicSettings,
  hashPassword,
  sanitizeText 
} = require('../../../server/security');

export async function GET(request) {
  try {
    const settings = db.getSettings();
    const auth = verifyAdminRequest(request);

    // If admin is authenticated, return full administrative settings
    if (auth.authorized) {
      const adminView = { ...settings };
      // Keep sensitive password hashes internal
      delete adminView.adminPasswordHash;
      delete adminView.adminPasswordSalt;
      return NextResponse.json(adminView, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      });
    }

    // Otherwise, return strictly safe public storefront settings
    const publicSettings = filterPublicSettings(settings);
    return NextResponse.json(publicSettings, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err) {
    console.error('API GET /api/settings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json({ 
        error: "Ruxsat etilmagan: Admin avtorizatsiyasi talab qilinadi" 
      }, { status: 401 });
    }

    const body = await request.json();
    const updatePayload = { ...body };

    // If admin password is being updated, hash it securely
    if (updatePayload.adminPassword) {
      const { hash, salt } = hashPassword(updatePayload.adminPassword);
      updatePayload.adminPasswordHash = hash;
      updatePayload.adminPasswordSalt = salt;
    }

    if (updatePayload.adminUsername) {
      updatePayload.adminUsername = sanitizeText(updatePayload.adminUsername, 50);
    }

    const updated = db.updateSettings(updatePayload);
    const safeResult = { ...updated };
    delete safeResult.adminPasswordHash;
    delete safeResult.adminPasswordSalt;

    return NextResponse.json(safeResult);
  } catch (err) {
    console.error('API POST /api/settings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}
