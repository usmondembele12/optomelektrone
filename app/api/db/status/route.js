import { NextResponse } from 'next/server';
const db = require('../../../../server/db');

export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  let prismaConnected = false;
  let postgresStats = null;
  let error = null;

  if (hasDbUrl) {
    try {
      const getPrisma = db.getPrismaClient;
      const prisma = getPrisma ? getPrisma() : null;
      if (prisma) {
        // Quick query test
        const [productCount, categoryCount, orderCount] = await Promise.all([
          prisma.product.count(),
          prisma.category.count(),
          prisma.order.count(),
        ]);
        prismaConnected = true;
        postgresStats = {
          products: productCount,
          categories: categoryCount,
          orders: orderCount,
        };
      }
    } catch (err) {
      error = err.message;
    }
  }

  const localStats = db.getStats();

  return NextResponse.json({
    status: prismaConnected ? 'connected' : 'fallback',
    orm: 'Prisma 6.4.1',
    database: prismaConnected ? 'PostgreSQL' : 'Local JSON Store',
    hasDatabaseUrlConfigured: hasDbUrl,
    prismaConnected,
    postgresStats,
    localStats: {
      totalProducts: localStats.totalProducts,
      totalOrders: localStats.totalOrders,
      totalRevenue: localStats.totalRevenue,
    },
    error: error || undefined,
    instructions: !prismaConnected ? {
      step1: "O'zingizning PostgreSQL DATABASE_URL ini .env fayliga kiriting (Neon, Supabase yoki mahalliy Postgres)",
      step2: "Jadvallarni yaratish uchun: npm run prisma:push",
      step3: "37 ta mahsulot va kategoriyalarni bazaga yuklash uchun: npm run prisma:seed",
    } : undefined
  });
}
