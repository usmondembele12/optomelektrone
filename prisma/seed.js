const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('[Seed] DATABASE_URL not configured in .env. Skipping Postgres seeding (Local JSON store is active with 44 products).');
    return;
  }
  console.log('[Seed] Seeding database from server/data/db.json...');

  const dbPath = path.join(__dirname, '..', 'server', 'data', 'db.json');
  let data = { categories: [], products: [], settings: {}, orders: [] };

  if (fs.existsSync(dbPath)) {
    try {
      data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      console.warn('[Seed] Could not parse server/data/db.json:', e.message);
    }
  }

  // 1. Seed Categories
  const categories = data.categories || [];
  console.log(`[Seed] Found ${categories.length} categories.`);
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        name_ru: cat.name_ru || null,
        name_en: cat.name_en || null,
        slug: cat.slug || cat.id,
        icon: cat.icon || 'Box',
        count: cat.count || 0,
      },
      create: {
        id: cat.id,
        name: cat.name,
        name_ru: cat.name_ru || null,
        name_en: cat.name_en || null,
        slug: cat.slug || cat.id,
        icon: cat.icon || 'Box',
        count: cat.count || 0,
      },
    });
  }

  // 2. Seed Products
  const products = data.products || [];
  console.log(`[Seed] Found ${products.length} products.`);
  for (const p of products) {
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
        id: p.id,
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
      },
    });
  }

  // 3. Seed Settings
  const s = data.settings || {};
  await prisma.setting.upsert({
    where: { id: 'global' },
    update: {
      siteName: s.siteName || 'OptomElektro',
      phone: s.phone || '+998 71 200 44 44',
      email: s.email || 'info@optomelektro.uz',
      address: s.address || "Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 42-uy",
      workingHours: s.workingHours || 'Har kuni: 08:00 - 20:00',
      deliveryCost: Number(s.deliveryCost) || 30000,
      freeDeliveryMin: Number(s.freeDeliveryMin) || 500000,
      wholesaleMinAmount: Number(s.wholesaleMinAmount) || 1000000,
      telegramBotToken: s.telegramBotToken || '9284355717:AAF8eLuWBibzGe6Oq4en1PbgiZ5ogHguYao',
      telegramChatId: s.telegramChatId ? String(s.telegramChatId) : '8038275900',
      adminUsername: s.adminUsername || 'foden',
      adminPassword: s.adminPassword || 'usmon47',
    },
    create: {
      id: 'global',
      siteName: s.siteName || 'OptomElektro',
      phone: s.phone || '+998 71 200 44 44',
      email: s.email || 'info@optomelektro.uz',
      address: s.address || "Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 42-uy",
      workingHours: s.workingHours || 'Har kuni: 08:00 - 20:00',
      deliveryCost: Number(s.deliveryCost) || 30000,
      freeDeliveryMin: Number(s.freeDeliveryMin) || 500000,
      wholesaleMinAmount: Number(s.wholesaleMinAmount) || 1000000,
      telegramBotToken: s.telegramBotToken || '9284355717:AAF8eLuWBibzGe6Oq4en1PbgiZ5ogHguYao',
      telegramChatId: s.telegramChatId ? String(s.telegramChatId) : '8038275900',
      adminUsername: s.adminUsername || 'foden',
      adminPassword: s.adminPassword || 'usmon47',
    },
  });

  console.log('[Seed] Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('[Seed] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
