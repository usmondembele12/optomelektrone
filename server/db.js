const fs = require('fs');
const path = require('path');

const isVercel = !!process.env.VERCEL;
const DB_DIR = isVercel ? '/tmp' : path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const SEED_FILE = path.join(__dirname, 'data', 'db.json');

const INITIAL_CATEGORIES = [
  { id: 'avtomatlar', name: 'Avtomatlar va UZO', slug: 'avtomatlar', icon: 'Zap', count: 145 },
  { id: 'kabellar', name: 'Kabellar va Simlar', slug: 'kabellar', icon: 'Cable', count: 210 },
  { id: 'shchitlar', name: 'Shchitlar va Qutilar', slug: 'shchitlar', icon: 'Shield', count: 85 },
  { id: 'kontaktorlar', name: 'Boshqaruv uskunalari', slug: 'kontaktorlar', icon: 'Cpu', count: 64 },
  { id: 'stabilizatorlar', name: 'Stabilizatorlar va Rele', slug: 'stabilizatorlar', icon: 'Activity', count: 52 },
  { id: 'rozetkalar', name: 'Rozetka va Kalitlar', slug: 'rozetkalar', icon: 'Power', count: 98 },
  { id: 'led-yoritish', name: 'LED Sanoat yoritish', slug: 'led-yoritish', icon: 'Sun', count: 120 },
  { id: 'asboblar', name: 'Asbob-uskunalar', slug: 'asboblar', icon: 'Wrench', count: 43 }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Avtomat uzgich LUX VOLT 1P 16A C-tipli',
    slug: 'avtomat-lux-volt-1p-16a',
    category: 'avtomatlar',
    categoryName: 'Avtomatlar va UZO',
    brand: 'LUX VOLT',
    price: 22000,
    oldPrice: 28000,
    wholesalePrice: 17500,
    minWholesaleQty: 12,
    stock: 450,
    unit: 'dona',
    image: '/images/products/avtomat-1p.png',
    description: 'LUX VOLT 16A 1-qutbli avtomat uzgich xonadonlar va ofislar uchun ortiqcha yuklanish va qisqa tutashuvdan ishonchli himoya ta\'minlaydi. Mis kontaktli va olovga chidamli korpus.',
    specs: {
      'Nominal tok': '16 A',
      'Qutblar soni': '1P',
      'O\'chirish xususiyati': 'C tipli',
      'Uzgich quvvati': '4.5 kA',
      'Kafolat': '3 yil rasmiy'
    },
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isPopular: true
  },
  {
    id: 2,
    name: 'Avtomat uzgich LUX VOLT 3P 63A C-tipli',
    slug: 'avtomat-lux-volt-3p-63a',
    category: 'avtomatlar',
    categoryName: 'Avtomatlar va UZO',
    brand: 'LUX VOLT',
    price: 78000,
    oldPrice: 92000,
    wholesalePrice: 65000,
    minWholesaleQty: 6,
    stock: 180,
    unit: 'dona',
    image: '/images/products/avtomat-3p.png',
    description: '3 fazali (3P) 63A kuchli avtomat uzgich ishlab chiqarish korxonalari, kuchli dvigatellar va asosiy kirish shchitlari uchun mo\'ljallangan.',
    specs: {
      'Nominal tok': '63 A',
      'Qutblar soni': '3P (3 fazali)',
      'O\'chirish xususiyati': 'C tipli',
      'Uzgich quvvati': '6.0 kA',
      'Kafolat': '3 yil rasmiy'
    },
    rating: 4.8,
    reviewsCount: 24,
    isFeatured: true,
    isPopular: true
  },
  {
    id: 3,
    name: 'Differensial avtomat (UZO) Schneider Easy9 2P 25A 30mA',
    slug: 'uzo-schneider-easy9-25a',
    category: 'avtomatlar',
    categoryName: 'Avtomatlar va UZO',
    brand: 'Schneider Electric',
    price: 145000,
    oldPrice: 165000,
    wholesalePrice: 128000,
    minWholesaleQty: 5,
    stock: 95,
    unit: 'dona',
    image: '/images/products/uzo-schneider.png',
    description: 'Insonni elektr toki urishidan va yong\'indan saqlovchi original Schneider Electric differensial himoya uskunasi. 30mA sezgirlik.',
    specs: {
      'Nominal tok': '25 A',
      'Qutblar': '2P (1P+N)',
      'Oqish toki': '30 mA',
      'Brend vatani': 'Fransiya'
    },
    rating: 5.0,
    reviewsCount: 42,
    isFeatured: false,
    isPopular: true
  },
  {
    id: 4,
    name: 'Quvvat kabeli VVG-P-ng(A)-LS 3x2.5 mm² Andijonkabel (mis)',
    slug: 'kabel-vvg-png-3x25-andijon',
    category: 'kabellar',
    categoryName: 'Kabellar va Simlar',
    brand: 'Andijon Kabel',
    price: 13800,
    oldPrice: 15500,
    wholesalePrice: 11500,
    minWholesaleQty: 100,
    stock: 2400,
    unit: 'metr',
    image: '/images/products/kabel-vvg.png',
    description: '100% toza misdan tayyorlangan, yonmaydigan (ng) va tutun chiqarmaydigan (LS) yuqori sifatli rozetka kabeli. GOST sertifikati mavjud.',
    specs: {
      'Tomirlar soni va kesimi': '3 × 2.5 mm²',
      'Material': 'Toza elektrolitik mis',
      'Qobiq turi': 'Yonmaydigan PVX (ng-LS)',
      'Standart': 'GOST 31996-2012'
    },
    rating: 4.9,
    reviewsCount: 67,
    isFeatured: true,
    isPopular: true
  },
  {
    id: 5,
    name: 'SIP-4 2x16 mm² O\'z-Kabel Alyumin havo kabeli',
    slug: 'kabel-sip-4-2x16',
    category: 'kabellar',
    categoryName: 'Kabellar va Simlar',
    brand: 'O\'z-kabel',
    price: 5400,
    oldPrice: 6200,
    wholesalePrice: 4600,
    minWholesaleQty: 200,
    stock: 5000,
    unit: 'metr',
    image: '/images/products/kabel-sip.png',
    description: 'Ustundan xonadonga elektr tarmog\'ini olib kirish uchun qora nurga chidamli polietilen qobiqli mustahkam o\'ziyurar kabel.',
    specs: {
      'Kesimi': '2 × 16 mm²',
      'Tomir materiali': 'Alyumin',
      'Izolyatsiya': 'Svetostabilizatsiyalangan polietilen'
    },
    rating: 4.7,
    reviewsCount: 19,
    isFeatured: false,
    isPopular: true
  },
  {
    id: 6,
    name: 'Magnit kontaktor CHINT NXC-40 220V 40A',
    slug: 'kontaktor-chint-nxc-40',
    category: 'kontaktorlar',
    categoryName: 'Boshqaruv uskunalari',
    brand: 'CHINT',
    price: 185000,
    oldPrice: 210000,
    wholesalePrice: 155000,
    minWholesaleQty: 4,
    stock: 65,
    unit: 'dona',
    image: '/images/products/kontaktor-chint.png',
    description: 'Nasoslar, ventilyatsiya, sanoat kompressorlari va elektr dvigatellarini masofadan boshqarish uchun ishonchli CHINT kontaktori.',
    specs: {
      'Nominal tok': '40 A (AC-3)',
      'G‘altak kuchlanishi': '220V AC',
      'Yordamchi kontaktlar': '1NO + 1NC'
    },
    rating: 4.8,
    reviewsCount: 15,
    isFeatured: false,
    isPopular: true
  },
  {
    id: 7,
    name: 'Modulli metall shchit LUX VOLT IP54 24 ta o\'rinli',
    slug: 'shchit-metall-lux-volt-24',
    category: 'shchitlar',
    categoryName: 'Shchitlar va Qutilar',
    brand: 'LUX VOLT',
    price: 135000,
    oldPrice: 155000,
    wholesalePrice: 110000,
    minWholesaleQty: 5,
    stock: 120,
    unit: 'dona',
    image: '/images/products/shchit-metal.png',
    description: 'Chang va namlikdan himoyalangan (IP54), kukunli bo\'yoq bilan qoplangan, qulflanadigan 24 o\'rinli mustahkam metall taqsimlash qutisi.',
    specs: {
      'Sig\'imi': '24 modul (2 qator)',
      'Himoya darajasi': 'IP54',
      'Material': '0.8mm metall qatlam',
      'To\'plam': 'DIN-reyka, shina, qulf va kalit'
    },
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: true,
    isPopular: true
  },
  {
    id: 8,
    name: 'Germetik plastik boks IP65 LUX VOLT 12 modulli',
    slug: 'boks-plastik-lux-volt-12',
    category: 'shchitlar',
    categoryName: 'Shchitlar va Qutilar',
    brand: 'LUX VOLT',
    price: 68000,
    oldPrice: 82000,
    wholesalePrice: 54000,
    minWholesaleQty: 8,
    stock: 140,
    unit: 'dona',
    image: '/images/products/boks-plastik.png',
    description: 'Ochiq havoda va nam xonalarda o\'rnatish uchun mo\'ljallangan germetik IP65 plastik quti. Shaffof qoraytirilgan qopqoqli.',
    specs: {
      'Sig\'imi': '12 modul',
      'Himoya darajasi': 'IP65 germetik',
      'Material': 'ABS zarbaga chidamli plastik'
    },
    rating: 4.8,
    reviewsCount: 22,
    isFeatured: false,
    isPopular: false
  },
  {
    id: 9,
    name: 'Kuchlanish nazorat relesi ZUBR D2-40 Red (40A raqamli himoya)',
    slug: 'rele-zubr-d2-40',
    category: 'stabilizatorlar',
    categoryName: 'Stabilizatorlar va Rele',
    brand: 'ZUBR',
    price: 260000,
    oldPrice: 295000,
    wholesalePrice: 230000,
    minWholesaleQty: 4,
    stock: 80,
    unit: 'dona',
    image: '/images/products/zubr-rele.png',
    description: 'Kuchlanish sakrashlari va nol uzilishidan maishiy texnikalarni (muzlatgich, televizor, konditsioner) 100% himoya qiluvchi tezyurar raqamli rele.',
    specs: {
      'Nominal tok': '40 A',
      'Chegaralar': '120 - 280 V',
      'O\'chirish tezligi': '0.03 soniya',
      'Displey': 'Raqamli qizil LED indikator'
    },
    rating: 5.0,
    reviewsCount: 54,
    isFeatured: true,
    isPopular: true
  },
  {
    id: 10,
    name: 'Sanoat LED Projektori LUX VOLT 100W IP66 6500K',
    slug: 'led-lux-volt-100w',
    category: 'led-yoritish',
    categoryName: 'LED Sanoat yoritish',
    brand: 'LUX VOLT',
    price: 125000,
    oldPrice: 150000,
    wholesalePrice: 98000,
    minWholesaleQty: 6,
    stock: 190,
    unit: 'dona',
    image: '/images/products/led-100w.png',
    description: 'Hovli, omborxona, avtoservis va qurilish maydonchalarini yorqin yoritish uchun kuchli alyumin korpusli 100W IP66 projektor.',
    specs: {
      'Quvvat': '100 Watt',
      'Yorug\'lik oqimi': '10 000 Lumen',
      'Rang harorati': '6500K (Sovuq oq)',
      'Himoya sinfi': 'IP66 suv va chang o\'tkazmas'
    },
    rating: 4.9,
    reviewsCount: 29,
    isFeatured: true,
    isPopular: true
  },
  {
    id: 11,
    name: 'Sanoat LED Projektori LUX VOLT 200W IP66 Super Bright',
    slug: 'led-lux-volt-200w',
    category: 'led-yoritish',
    categoryName: 'LED Sanoat yoritish',
    brand: 'LUX VOLT',
    price: 240000,
    oldPrice: 285000,
    wholesalePrice: 195000,
    minWholesaleQty: 4,
    stock: 75,
    unit: 'dona',
    image: '/images/products/led-200w.png',
    description: 'Stadionlar, katta sanoat binolari va avtoturargohlar uchun super yorqin 200W LED projektor. Kuchaytirilgan sovutish radiatori bilan.',
    specs: {
      'Quvvat': '200 Watt',
      'Yorug\'lik oqimi': '22 000 Lumen',
      'Rang harorati': '6500K',
      'Kafolat': '2 yil'
    },
    rating: 4.8,
    reviewsCount: 17,
    isFeatured: false,
    isPopular: true
  },
  {
    id: 12,
    name: 'Sanoat rozetkasi 3P+N+E 32A IP44 IEK (qizil 380V)',
    slug: 'rozetka-sanoat-32a-iek',
    category: 'rozetkalar',
    categoryName: 'Rozetka va Kalitlar',
    brand: 'IEK',
    price: 42000,
    oldPrice: 50000,
    wholesalePrice: 34000,
    minWholesaleQty: 10,
    stock: 160,
    unit: 'dona',
    image: '/images/products/rozetka-sanoat.png',
    description: 'Uch fazali payvandlash apparatlari, dastgohlar va generatorlarni ulash uchun 380V 32A sanoat rozetkasi.',
    specs: {
      'Nominal tok': '32 A',
      'Kuchlanish': '380 - 415 V',
      'Qutblar': '3P + N + PE (5 kontaktli)',
      'Himoya': 'IP44 qopqoqli'
    },
    rating: 4.7,
    reviewsCount: 13,
    isFeatured: false,
    isPopular: false
  }
];

const INITIAL_SETTINGS = {
  storeName: 'OPTOM elektro',
  storeTagline: 'Elektr jihozlari va kabellarning ulgurji va chakana savdo markazi',
  storePhone: '+998 71 200-00-00',
  storeAddress: "Toshkent sh., Chilonzor tumani, O'rikzor ulgurji bozori, 4-blok 18-do'kon",
  storeTelegram: 'https://t.me/optomelektro',
  telegramBotToken: '', // Enter bot token here or via admin panel
  telegramChatId: '',   // Enter chat id here or via admin panel
  freeDeliveryThreshold: 5000000, // 5 mln so'mdan yuqori xarid bepul yetkaziladi
  deliveryFee: 40000,
  adminUsername: 'admin',
  adminPassword: 'admin123'
};

const INITIAL_ORDERS = [
  {
    id: 'ORD-984210',
    customerName: 'Akmal Karimov',
    phone: '+998 90 123 45 67',
    city: 'Toshkent',
    address: 'Yunusobod 14-mavze, 22-uy',
    deliveryMethod: 'yetkazib_berish',
    paymentMethod: 'naqd',
    notes: 'Iltimos, soat 14:00 dan keyin olib keling',
    items: [
      {
        productId: 1,
        name: 'Avtomat uzgich LUX VOLT 1P 16A C-tipli',
        price: 17500,
        quantity: 20,
        unit: 'dona',
        total: 350000
      },
      {
        productId: 4,
        name: 'Quvvat kabeli VVG-P-ng(A)-LS 3x2.5 mm² Andijonkabel (mis)',
        price: 11500,
        quantity: 100,
        unit: 'metr',
        total: 1150000
      }
    ],
    totalAmount: 1500000,
    status: 'qabul_qilindi',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'ORD-984211',
    customerName: 'Javohir Toshmatov (Prorab)',
    phone: '+998 99 876 54 32',
    city: 'Toshkent',
    address: "O'rikzor do'kondan olib ketiladi",
    deliveryMethod: 'olib_ketish',
    paymentMethod: 'hisob_raqam',
    notes: 'Kompaniya nomiga schet-faktura tayyorlab qo\'ying',
    items: [
      {
        productId: 7,
        name: 'Modulli metall shchit LUX VOLT IP54 24 ta o\'rinli',
        price: 110000,
        quantity: 8,
        unit: 'dona',
        total: 880000
      },
      {
        productId: 10,
        name: 'Sanoat LED Projektori LUX VOLT 100W IP66 6500K',
        price: 98000,
        quantity: 10,
        unit: 'dona',
        total: 980000
      }
    ],
    totalAmount: 1860000,
    status: 'yangi',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    try { fs.mkdirSync(DB_DIR, { recursive: true }); } catch (_) {}
  }

  if (!fs.existsSync(DB_FILE)) {
    if (fs.existsSync(SEED_FILE)) {
      try {
        const seedRaw = fs.readFileSync(SEED_FILE, 'utf-8');
        fs.writeFileSync(DB_FILE, seedRaw, 'utf-8');
        return JSON.parse(seedRaw);
      } catch (_) {}
    }
    const data = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      settings: INITIAL_SETTINGS
    };
    try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8'); } catch (_) {}
    return data;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, reinitializing:', err);
    const data = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      settings: INITIAL_SETTINGS
    };
    try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8'); } catch (_) {}
    return data;
  }
}

function readDb() {
  return initDb();
}

function writeDb(data) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('writeDb error:', err.message);
  }
}

// Products
function getProducts(filter = {}) {
  const db = readDb();
  let list = db.products || [];

  if (filter.category) {
    list = list.filter(p => p.category === filter.category);
  }
  if (filter.brand) {
    list = list.filter(p => p.brand.toLowerCase() === filter.brand.toLowerCase());
  }
  if (filter.search) {
    const s = filter.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(s) || (p.description && p.description.toLowerCase().includes(s)));
  }
  if (filter.featured) {
    list = list.filter(p => p.isFeatured);
  }
  return list;
}

function getProductById(id) {
  const db = readDb();
  return db.products.find(p => String(p.id) === String(id));
}

function addProduct(productData) {
  const db = readDb();
  const nextId = db.products.length > 0 ? Math.max(...db.products.map(p => Number(p.id) || 0)) + 1 : 1;
  const newProduct = {
    id: nextId,
    name: productData.name,
    slug: productData.slug || (productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
    category: productData.category || 'avtomatlar',
    categoryName: productData.categoryName || 'Boshqa',
    brand: productData.brand || 'OPTOM ELEKTRO',
    price: Number(productData.price) || 0,
    oldPrice: Number(productData.oldPrice) || 0,
    wholesalePrice: Number(productData.wholesalePrice) || Number(productData.price) || 0,
    minWholesaleQty: Number(productData.minWholesaleQty) || 5,
    stock: Number(productData.stock) || 50,
    unit: productData.unit || 'dona',
    image: productData.image || '/images/products/avtomat-1p.png',
    description: productData.description || '',
    specs: productData.specs || {},
    rating: 5.0,
    reviewsCount: 1,
    isFeatured: !!productData.isFeatured,
    isPopular: !!productData.isPopular
  };
  db.products.unshift(newProduct);
  writeDb(db);
  return newProduct;
}

function updateProduct(id, updates) {
  const db = readDb();
  const idx = db.products.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;

  db.products[idx] = {
    ...db.products[idx],
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : db.products[idx].price,
    wholesalePrice: updates.wholesalePrice !== undefined ? Number(updates.wholesalePrice) : db.products[idx].wholesalePrice,
    stock: updates.stock !== undefined ? Number(updates.stock) : db.products[idx].stock
  };
  writeDb(db);
  return db.products[idx];
}

function deleteProduct(id) {
  const db = readDb();
  const initialLen = db.products.length;
  db.products = db.products.filter(p => String(p.id) !== String(id));
  if (db.products.length !== initialLen) {
    writeDb(db);
    return true;
  }
  return false;
}

// Categories
function getCategories() {
  const db = readDb();
  return db.categories || [];
}

// Orders
function getOrders() {
  const db = readDb();
  return (db.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getOrderById(id) {
  const db = readDb();
  return db.orders.find(o => String(o.id) === String(id));
}

function createOrder(orderData) {
  const db = readDb();
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    id: orderId,
    customerName: orderData.customerName || 'Mijoz',
    phone: orderData.phone || '',
    city: orderData.city || 'Toshkent',
    address: orderData.address || '',
    deliveryMethod: orderData.deliveryMethod || 'yetkazib_berish',
    paymentMethod: orderData.paymentMethod || 'naqd',
    notes: orderData.notes || '',
    items: orderData.items || [],
    totalAmount: Number(orderData.totalAmount) || 0,
    status: 'yangi',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // reduce stock of products
  for (const item of newOrder.items) {
    const prod = db.products.find(p => String(p.id) === String(item.productId));
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
    }
  }

  writeDb(db);
  return newOrder;
}

function updateOrderStatus(id, status) {
  const db = readDb();
  const order = db.orders.find(o => String(o.id) === String(id));
  if (!order) return null;
  order.status = status;
  writeDb(db);
  return order;
}

// Settings
function getSettings() {
  const db = readDb();
  return { ...INITIAL_SETTINGS, ...(db.settings || {}) };
}

function updateSettings(newSettings) {
  const db = readDb();
  db.settings = { ...db.settings, ...newSettings };
  writeDb(db);
  return db.settings;
}

// Dashboard statistics
function getStats() {
  const db = readDb();
  const orders = db.orders || [];
  const products = db.products || [];

  const totalRevenue = orders
    .filter(o => o.status !== 'bekor_qilindi')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const newOrdersCount = orders.filter(o => o.status === 'yangi').length;
  const lowStockCount = products.filter(p => (Number(p.stock) || 0) <= 20).length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    newOrdersCount,
    lowStockCount,
    totalProducts: products.length,
    recentOrders: orders.slice(0, 5)
  };
}

module.exports = {
  readDb,
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getSettings,
  updateSettings,
  getStats
};

