const { PrismaClient } = require('@prisma/client');

let prismaClient = null;

function getPrismaClient() {
  if (!process.env.DATABASE_URL) return null;
  if (!prismaClient) {
    try {
      prismaClient = new PrismaClient();
    } catch (e) {
      console.warn('[Prisma] Client creation warning:', e.message);
      return null;
    }
  }
  return prismaClient;
}

// Background sync to PostgreSQL
async function syncProductToPostgres(product, action = 'upsert') {
  const prisma = getPrismaClient();
  if (!prisma) return;
  try {
    if (action === 'delete') {
      await prisma.product.deleteMany({
        where: {
          OR: [
            { id: Number(product.id) || -1 },
            { slug: product.slug || '' }
          ]
        }
      });
      console.log(`[Prisma -> PostgreSQL] Deleted product: ${product.name || product.id}`);
      return;
    }

    const p = product;
    const slug = p.slug || `prod-${p.id}`;
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: p.name,
        name_ru: p.name_ru || null,
        name_en: p.name_en || null,
        category: p.category,
        categoryName: p.categoryName || null,
        categoryName_ru: p.categoryName_ru || null,
        categoryName_en: p.categoryName_en || null,
        brand: p.brand || null,
        price: Number(p.price) || 0,
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        wholesalePrice: p.wholesalePrice ? Number(p.wholesalePrice) : null,
        minWholesaleQty: Number(p.minWholesaleQty) || 1,
        stock: Number(p.stock) || 0,
        unit: p.unit || 'dona',
        image: p.image || null,
        description: p.description || null,
        description_ru: p.description_ru || null,
        description_en: p.description_en || null,
        specs: p.specs || null,
        specs_ru: p.specs_ru || null,
        specs_en: p.specs_en || null,
        rating: Number(p.rating) || 5.0,
        reviewsCount: Number(p.reviewsCount) || 0,
        isFeatured: !!p.isFeatured,
        isPopular: !!p.isPopular,
      },
      create: {
        name: p.name,
        name_ru: p.name_ru || null,
        name_en: p.name_en || null,
        slug,
        category: p.category,
        categoryName: p.categoryName || null,
        categoryName_ru: p.categoryName_ru || null,
        categoryName_en: p.categoryName_en || null,
        brand: p.brand || null,
        price: Number(p.price) || 0,
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        wholesalePrice: p.wholesalePrice ? Number(p.wholesalePrice) : null,
        minWholesaleQty: Number(p.minWholesaleQty) || 1,
        stock: Number(p.stock) || 0,
        unit: p.unit || 'dona',
        image: p.image || null,
        description: p.description || null,
        description_ru: p.description_ru || null,
        description_en: p.description_en || null,
        specs: p.specs || null,
        specs_ru: p.specs_ru || null,
        specs_en: p.specs_en || null,
        rating: Number(p.rating) || 5.0,
        reviewsCount: Number(p.reviewsCount) || 0,
        isFeatured: !!p.isFeatured,
        isPopular: !!p.isPopular,
      }
    });
    console.log(`[Prisma -> PostgreSQL] Synced product: ${p.name}`);
  } catch (err) {
    console.warn(`[Prisma -> PostgreSQL] Product sync warning:`, err.message);
  }
}

async function syncOrderToPostgres(order, action = 'upsert') {
  const prisma = getPrismaClient();
  if (!prisma) return;
  try {
    const oId = String(order.id);
    if (action === 'delete') {
      await prisma.order.deleteMany({
        where: { id: oId }
      });
      console.log(`[Prisma -> PostgreSQL] Deleted order: ${oId}`);
      return;
    }

    const o = order;
    await prisma.order.upsert({
      where: { id: oId },
      update: {
        orderNumber: o.orderNumber || oId,
        customerName: o.customerName,
        phone: o.phone,
        address: o.address || null,
        paymentMethod: o.paymentMethod || 'naqd',
        notes: o.notes || null,
        totalAmount: Number(o.totalAmount) || 0,
        discount: Number(o.discount) || 0,
        isWholesale: !!o.isWholesale,
        status: o.status || 'yangi',
        rawItems: o.items || null,
      },
      create: {
        id: oId,
        orderNumber: o.orderNumber || oId,
        customerName: o.customerName,
        phone: o.phone,
        address: o.address || null,
        paymentMethod: o.paymentMethod || 'naqd',
        notes: o.notes || null,
        totalAmount: Number(o.totalAmount) || 0,
        discount: Number(o.discount) || 0,
        isWholesale: !!o.isWholesale,
        status: o.status || 'yangi',
        rawItems: o.items || null,
      }
    });
    console.log(`[Prisma -> PostgreSQL] Synced order: ${oId}`);
  } catch (err) {
    console.warn(`[Prisma -> PostgreSQL] Order sync warning:`, err.message);
  }
}

async function syncSettingsToPostgres(settings) {
  const prisma = getPrismaClient();
  if (!prisma) return;
  try {
    const s = settings;
    await prisma.setting.upsert({
      where: { id: 'global' },
      update: {
        siteName: s.siteName,
        phone: s.phone,
        email: s.email,
        address: s.address,
        workingHours: s.workingHours,
        deliveryCost: Number(s.deliveryCost) || 30000,
        freeDeliveryMin: Number(s.freeDeliveryMin) || 500000,
        wholesaleMinAmount: Number(s.wholesaleMinAmount) || 1000000,
        telegramBotToken: s.telegramBotToken,
        telegramChatId: s.telegramChatId ? String(s.telegramChatId) : null,
        adminUsername: s.adminUsername,
        adminPassword: s.adminPassword
      },
      create: {
        id: 'global',
        siteName: s.siteName,
        phone: s.phone,
        email: s.email,
        address: s.address,
        workingHours: s.workingHours,
        deliveryCost: Number(s.deliveryCost) || 30000,
        freeDeliveryMin: Number(s.freeDeliveryMin) || 500000,
        wholesaleMinAmount: Number(s.wholesaleMinAmount) || 1000000,
        telegramBotToken: s.telegramBotToken,
        telegramChatId: s.telegramChatId ? String(s.telegramChatId) : null,
        adminUsername: s.adminUsername,
        adminPassword: s.adminPassword
      }
    });
    console.log(`[Prisma -> PostgreSQL] Synced settings`);
  } catch (err) {
    console.warn(`[Prisma -> PostgreSQL] Settings sync warning:`, err.message);
  }
}

module.exports = {
  getPrismaClient,
  syncProductToPostgres,
  syncOrderToPostgres,
  syncSettingsToPostgres
};
