const fs = require('fs');
const path = require('path');

let prismaSync = null;
try {
  prismaSync = require('./prismaSync');
} catch (e) {}

const isVercel = !!process.env.VERCEL;

function getDbPaths() {
  if (isVercel) {
    return {
      dir: '/tmp',
      file: '/tmp/db.json'
    };
  }
  const realFile = path.join(process.cwd(), 'server', 'data', 'db.json');
  return {
    dir: path.dirname(realFile),
    file: realFile
  };
}

const { dir: DB_DIR, file: DB_FILE } = getDbPaths();

function resolveSeedFilePath() {
  const seedInCwd = path.join(process.cwd(), 'server', 'data', 'db.json');
  try {
    if (fs.existsSync(seedInCwd)) return seedInCwd;
  } catch (_) {}
  return DB_FILE;
}

const SEED_FILE = resolveSeedFilePath();

const INITIAL_CATEGORIES = [
  {
    "id": "avtomatlar",
    "name": "Avtomat va Faza o'tkazgichlar",
    "name_ru": "Автоматы и фазопереключатели",
    "name_en": "Circuit Breakers & Phase Switches",
    "slug": "avtomatlar",
    "icon": "Zap",
    "count": 48
  },
  {
    "id": "shchitlar",
    "name": "ELEBOX va GIP Shchitlar",
    "name_ru": "Щиты ELEBOX и GIP",
    "name_en": "Distribution Boards & Boxes",
    "slug": "shchitlar",
    "icon": "Shield",
    "count": 32
  },
  {
    "id": "rele-himoya",
    "name": "Kuchlanish relesi va Taymerlar",
    "name_ru": "Реле напряжения и таймеры",
    "name_en": "Voltage Relays & Timers",
    "slug": "rele-himoya",
    "icon": "Activity",
    "count": 26
  },
  {
    "id": "shinalar",
    "name": "Mis shina va Nol shinalari",
    "name_ru": "Медные и нулевые шины",
    "name_en": "Busbars & Neutral Bars",
    "slug": "shinalar",
    "icon": "Cpu",
    "count": 35
  },
  {
    "id": "klemma-ulash",
    "name": "Klemma va Taqsimlash bloklari",
    "name_ru": "Клеммы и распредблоки",
    "name_en": "Terminal Blocks & Connectors",
    "slug": "klemma-ulash",
    "icon": "Package",
    "count": 42
  },
  {
    "id": "ventilyatsiya",
    "name": "GIP Havo tortgich va Ventilyatsiya",
    "name_ru": "Вентиляторы GIP",
    "name_en": "Ventilation & Extractors",
    "slug": "ventilyatsiya",
    "icon": "Sun",
    "count": 28
  },
  {
    "id": "olchov-datchik",
    "name": "Voltmetr, Ampermetr va Datchiklar",
    "name_ru": "Вольтметры и датчики",
    "name_en": "Meters & Sensors",
    "slug": "olchov-datchik",
    "icon": "Power",
    "count": 20
  },
  {
    "id": "montaj-xavfsizlik",
    "name": "Yerlatgich (Zazemleniye) va Montaj",
    "name_ru": "Заземление и монтаж",
    "name_en": "Grounding & Installation",
    "slug": "montaj-xavfsizlik",
    "icon": "Wrench",
    "count": 36
  }
];

const INITIAL_PRODUCTS = [
  {
    "id": 1,
    "name": "LUX VOLT Faza O'tkazgich RPS-63C (Avtomat)",
    "name_ru": "Переключатель фаз LUX VOLT RPS-63C (Автомат)",
    "name_en": "Phase Selector Switch LUX VOLT RPS-63C",
    "slug": "lux-volt-faza-otkazgich-rps63c",
    "category": "avtomatlar",
    "categoryName": "Avtomat va Faza o'tkazgichlar",
    "categoryName_ru": "Автоматы и фазопереключатели",
    "categoryName_en": "Circuit Breakers & Phase Switches",
    "brand": "LUX VOLT",
    "price": 259000,
    "oldPrice": 298000,
    "wholesalePrice": 220000,
    "minWholesaleQty": 3,
    "stock": 170,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-faza-otkazgich-rps63c.jpg",
    "description": "LUX VOLT RPS-63C ayni paytda eng talabgir faza o'tkazgichlaridan biri. Fazalarni avtomat ravishda uzluksiz barqaror fazaga o'tkazib beradi. Yuqori sifat va rasmiy kafolat.",
    "description_ru": "Автоматический переключатель фаз LUX VOLT RPS-63C выбирает наиболее стабильную фазу для непрерывного электроснабжения.",
    "description_en": "Automatic phase selector switch LUX VOLT RPS-63C for uninterrupted stable single-phase power supply.",
    "specs": {
      "Tok kuchi": "63 A",
      "Kuchlanish": "220/380 V",
      "Kafolat": "2 yil rasmiy",
      "O'rnatish": "DIN-reyka"
    },
    "specs_ru": {
      "Tok kuchi": "63 A",
      "Kuchlanish": "220/380 V",
      "Kafolat": "2 yil rasmiy",
      "O'rnatish": "DIN-reyka"
    },
    "specs_en": {
      "Tok kuchi": "63 A",
      "Kuchlanish": "220/380 V",
      "Kafolat": "2 yil rasmiy",
      "O'rnatish": "DIN-reyka"
    },
    "rating": 4.9,
    "reviewsCount": 19,
    "isFeatured": true,
    "isPopular": true
  },
  {
    "id": 2,
    "name": "LUX VOLT Faza O'tkazgich RPS-125C Yuqori Quvvatli",
    "name_ru": "Переключатель фаз LUX VOLT RPS-125C Мощный",
    "name_en": "Heavy-Duty Phase Selector LUX VOLT RPS-125C",
    "slug": "lux-volt-faza-otkazgich-rps125c",
    "category": "avtomatlar",
    "categoryName": "Avtomat va Faza o'tkazgichlar",
    "categoryName_ru": "Автоматы и фазопереключатели",
    "categoryName_en": "Circuit Breakers & Phase Switches",
    "brand": "LUX VOLT",
    "price": 362500,
    "oldPrice": 417000,
    "wholesalePrice": 311000,
    "minWholesaleQty": 3,
    "stock": 382,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-faza-otkazgich-rps125c.jpg",
    "description": "Katta yuklamalar va ishlab chiqarish obyektlari uchun mo'ljallangan 125A kuchli faza o'tkazgich. 3 fazali kirishdan eng yaxshi fazani tanlab uzatadi.",
    "description_ru": "Мощный переключатель фаз на 125A для промышленных и коммерческих объектов.",
    "description_en": "Heavy-duty 125A phase selector switch for industrial installations.",
    "specs": {
      "Tok kuchi": "125 A",
      "Kuchlanish": "220/380 V",
      "Kafolat": "2 yil rasmiy",
      "O'rnatish": "DIN-reyka"
    },
    "specs_ru": {
      "Tok kuchi": "125 A",
      "Kuchlanish": "220/380 V",
      "Kafolat": "2 yil rasmiy",
      "O'rnatish": "DIN-reyka"
    },
    "specs_en": {
      "Tok kuchi": "125 A",
      "Kuchlanish": "220/380 V",
      "Kafolat": "2 yil rasmiy",
      "O'rnatish": "DIN-reyka"
    },
    "rating": 4.9,
    "reviewsCount": 30,
    "isFeatured": true,
    "isPopular": false
  },
  {
    "id": 3,
    "name": "Avtomatik To'k O'tkazgichi (АВР) LUX VOLT LWQ3-80 2P 63A",
    "name_ru": "Автоматический ввод резерва (АВР) LUX VOLT LWQ3 2P 63A",
    "name_en": "Automatic Transfer Switch (ATS) LUX VOLT LWQ3 2P 63A",
    "slug": "lux-volt-avr-lwq3-80-2p-63a",
    "category": "avtomatlar",
    "categoryName": "Avtomat va Faza o'tkazgichlar",
    "categoryName_ru": "Автоматы и фазопереключатели",
    "categoryName_en": "Circuit Breakers & Phase Switches",
    "brand": "LUX VOLT",
    "price": 285000,
    "oldPrice": 328000,
    "wholesalePrice": 246000,
    "minWholesaleQty": 3,
    "stock": 458,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-avr-lwq3-80-2p-63a.jpg",
    "description": "Shahar tarmog'i va generator o'rtasida avtomatik va qo'lda boshqaruvchi AVR to'k o'tkazgichi. 63A tok kuchi, 50/60Hz, izolyatsiya 690V.",
    "description_ru": "АВР 2P 63A для автоматического переключения между сетью и генератором.",
    "description_en": "Dual-power automatic transfer switch 2P 63A for generator integration.",
    "specs": {
      "Tok kuchi": "63 A",
      "Qutblar": "2P",
      "Izolyatsiya": "690 V",
      "Ish rejimi": "Avtomatik / Qo'lda"
    },
    "specs_ru": {
      "Tok kuchi": "63 A",
      "Qutblar": "2P",
      "Izolyatsiya": "690 V",
      "Ish rejimi": "Avtomatik / Qo'lda"
    },
    "specs_en": {
      "Tok kuchi": "63 A",
      "Qutblar": "2P",
      "Izolyatsiya": "690 V",
      "Ish rejimi": "Avtomatik / Qo'lda"
    },
    "rating": 4.9,
    "reviewsCount": 49,
    "isFeatured": true,
    "isPopular": true
  },
  {
    "id": 4,
    "name": "Generator uchun Ikki Manbali AVR LW2R 4P 100A",
    "name_ru": "Двухпозиционный АВР для генератора LW2R 4P 100A",
    "name_en": "Dual Power ATS Generator Switch LW2R 4P 100A",
    "slug": "generator-avr-lw2r-4p-100a",
    "category": "avtomatlar",
    "categoryName": "Avtomat va Faza o'tkazgichlar",
    "categoryName_ru": "Автоматы и фазопереключатели",
    "categoryName_en": "Circuit Breakers & Phase Switches",
    "brand": "LUX VOLT",
    "price": 246000,
    "oldPrice": 283000,
    "wholesalePrice": 213500,
    "minWholesaleQty": 3,
    "stock": 120,
    "unit": "dona",
    "image": "/images/products/tg_generator-avr-lw2r-4p-100a.jpg",
    "description": "4 qutbli (3 faza + nol) generator va quyosh energiyasi uchun avtomatik to'k o'tkazgich. 100A quvvat, 690V izolyatsiya.",
    "description_ru": "4-полюсный автоматический переключатель питания на 100A для генераторов.",
    "description_en": "4-Pole 100A dual-power automatic transfer switch.",
    "specs": {
      "Tok kuchi": "100 A",
      "Qutblar": "4P (3F+N)",
      "Izolyatsiya": "690 V",
      "Kafolat": "1 yil"
    },
    "specs_ru": {
      "Tok kuchi": "100 A",
      "Qutblar": "4P (3F+N)",
      "Izolyatsiya": "690 V",
      "Kafolat": "1 yil"
    },
    "specs_en": {
      "Tok kuchi": "100 A",
      "Qutblar": "4P (3F+N)",
      "Izolyatsiya": "690 V",
      "Kafolat": "1 yil"
    },
    "rating": 4.9,
    "reviewsCount": 21,
    "isFeatured": true,
    "isPopular": false
  },
  {
    "id": 5,
    "name": "Mexanik Faza O'tkazgich 3P 63A (0-1-2-3)",
    "name_ru": "Механический кулачковый переключатель фаз 3P 63A",
    "name_en": "Mechanical Rotary Phase Selector 3P 63A",
    "slug": "mexanik-faza-otkazgich-3p-63a",
    "category": "avtomatlar",
    "categoryName": "Avtomat va Faza o'tkazgichlar",
    "categoryName_ru": "Автоматы и фазопереключатели",
    "categoryName_en": "Circuit Breakers & Phase Switches",
    "brand": "LUX VOLT",
    "price": 102500,
    "oldPrice": 118000,
    "wholesalePrice": 88000,
    "minWholesaleQty": 10,
    "stock": 472,
    "unit": "dona",
    "image": "/images/products/tg_mexanik-faza-otkazgich-3p-63a.jpg",
    "description": "Elektr tarmoqlarini qo'lda boshqarish uchun mustahkam va ishonchli mexanik yechim. 63A tok kuchi, 380V AC ish kuchlanishi, 0-1-2-3 boshqaruv pozitsiyalari.",
    "description_ru": "Механический переключатель фаз на 63A с удобным поворотным механизмом.",
    "description_en": "Rotary manual changeover phase switch 3P 63A with 0-1-2-3 positions.",
    "specs": {
      "Tok kuchi": "63 A",
      "Pozitsiyalar": "0-1-2-3",
      "Kuchlanish": "380 V AC",
      "Material": "Olovga chidamli korpus"
    },
    "specs_ru": {
      "Tok kuchi": "63 A",
      "Pozitsiyalar": "0-1-2-3",
      "Kuchlanish": "380 V AC",
      "Material": "Olovga chidamli korpus"
    },
    "specs_en": {
      "Tok kuchi": "63 A",
      "Pozitsiyalar": "0-1-2-3",
      "Kuchlanish": "380 V AC",
      "Material": "Olovga chidamli korpus"
    },
    "rating": 4.9,
    "reviewsCount": 33,
    "isFeatured": true,
    "isPopular": true
  },
  {
    "id": 6,
    "name": "Mexanik Faza O'tkazgich 3P 125A Sanoat Kuchli",
    "name_ru": "Механический переключатель фаз 3P 125A Мощный",
    "name_en": "Heavy-Duty Rotary Phase Switch 3P 125A",
    "slug": "mexanik-faza-otkazgich-3p-125a",
    "category": "avtomatlar",
    "categoryName": "Avtomat va Faza o'tkazgichlar",
    "categoryName_ru": "Автоматы и фазопереключатели",
    "categoryName_en": "Circuit Breakers & Phase Switches",
    "brand": "LUX VOLT",
    "price": 188000,
    "oldPrice": 216000,
    "wholesalePrice": 166000,
    "minWholesaleQty": 3,
    "stock": 184,
    "unit": "dona",
    "image": "/images/products/tg_mexanik-faza-otkazgich-3p-125a.jpg",
    "description": "Sanoat korxonalari va kuchli elektr shchitlari uchun 125A mexanik faza tanlagich.",
    "description_ru": "Промышленный ручной переключатель фаз 125A для силовых щитов.",
    "description_en": "Industrial 125A manual phase selector switch for heavy distribution panels.",
    "specs": {
      "Tok kuchi": "125 A",
      "Pozitsiyalar": "0-1-2-3",
      "Kuchlanish": "380 V AC",
      "Himoya": "IP40"
    },
    "specs_ru": {
      "Tok kuchi": "125 A",
      "Pozitsiyalar": "0-1-2-3",
      "Kuchlanish": "380 V AC",
      "Himoya": "IP40"
    },
    "specs_en": {
      "Tok kuchi": "125 A",
      "Pozitsiyalar": "0-1-2-3",
      "Kuchlanish": "380 V AC",
      "Himoya": "IP40"
    },
    "rating": 4.9,
    "reviewsCount": 32,
    "isFeatured": true,
    "isPopular": false
  },
  {
    "id": 7,
    "name": "SMART WI-FI Master Switch 63A (Tuya / Alisa)",
    "name_ru": "Умный Wi-Fi выключатель Master Switch 63A (Tuya / Алиса)",
    "name_en": "Smart Wi-Fi Master Switch 63A (Tuya & Alexa)",
    "slug": "smart-wifi-master-switch-63a",
    "category": "avtomatlar",
    "categoryName": "Avtomat va Faza o'tkazgichlar",
    "categoryName_ru": "Автоматы и фазопереключатели",
    "categoryName_en": "Circuit Breakers & Phase Switches",
    "brand": "LUX VOLT",
    "price": 233000,
    "oldPrice": 268000,
    "wholesalePrice": 200500,
    "minWholesaleQty": 3,
    "stock": 178,
    "unit": "dona",
    "image": "/images/products/tg_smart-wifi-master-switch-63a.jpg",
    "description": "Aqlli uy tizimi uchun Wi-Fi master switch 63A. Uydan chiqayotganda bitta tugma orqali barcha keraksiz jihozlarni o'chiradi. Yuqori va past kuchlanishdan himoya, Tuya va Alisa ovozli boshqaruv.",
    "description_ru": "Умный мастер-выключатель 63A с Wi-Fi управлением через Tuya и Алису.",
    "description_en": "Smart Wi-Fi 63A Master Circuit Breaker compatible with Tuya, Google Home and Alexa.",
    "specs": {
      "Tok quvvati": "63 A",
      "Ulanish": "Wi-Fi 2.4GHz",
      "Ilova": "Tuya / Smart Life",
      "Funksiya": "Voltaj himoyasi va hisoblagich"
    },
    "specs_ru": {
      "Tok quvvati": "63 A",
      "Ulanish": "Wi-Fi 2.4GHz",
      "Ilova": "Tuya / Smart Life",
      "Funksiya": "Voltaj himoyasi va hisoblagich"
    },
    "specs_en": {
      "Tok quvvati": "63 A",
      "Ulanish": "Wi-Fi 2.4GHz",
      "Ilova": "Tuya / Smart Life",
      "Funksiya": "Voltaj himoyasi va hisoblagich"
    },
    "rating": 4.9,
    "reviewsCount": 21,
    "isFeatured": true,
    "isPopular": true
  },
  {
    "id": 8,
    "name": "ELEBOX N-SERIES Premium Shchit (Tempered Glass) 18-Modul",
    "name_ru": "Премиум щит ELEBOX N-SERIES (Закаленное стекло) 18-модулей",
    "name_en": "ELEBOX N-SERIES Distribution Box 18-Modules Glass",
    "slug": "elebox-n-series-tempered-glass-18m",
    "category": "shchitlar",
    "categoryName": "ELEBOX va GIP Shchitlar",
    "categoryName_ru": "Щиты ELEBOX и GIP",
    "categoryName_en": "Distribution Boards & Boxes",
    "brand": "ELEBOX",
    "price": 285000,
    "oldPrice": 328000,
    "wholesalePrice": 246000,
    "minWholesaleQty": 3,
    "stock": 250,
    "unit": "dona",
    "image": "/images/products/tg_elebox-n-series-tempered-glass-18m.jpg",
    "description": "Optom Elektro taqdim etadi: 4 mm Tempered Glass (toblangan shisha) old panel, 1.2 mm mustahkam metall korpus, ko'tariluvchi DIN-reyka simlarni qulay o'tkazish uchun. Black va Gray ranglarda.",
    "description_ru": "Премиальный распределительный щит на 18 модулей с дверцей из закаленного стекла 4мм и металлом 1.2мм.",
    "description_en": "Premium distribution board 18-modules with 4mm tempered glass door and 1.2mm steel casing.",
    "specs": {
      "Sig'imi": "18 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm metall",
      "O'rnatish": "Ichki montaj"
    },
    "specs_ru": {
      "Sig'imi": "18 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm metall",
      "O'rnatish": "Ichki montaj"
    },
    "specs_en": {
      "Sig'imi": "18 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm metall",
      "O'rnatish": "Ichki montaj"
    },
    "rating": 4.9,
    "reviewsCount": 45,
    "isFeatured": true,
    "isPopular": false
  },
  {
    "id": 9,
    "name": "ELEBOX N-SERIES Premium Shchit (Tempered Glass) 36-Modul",
    "name_ru": "Премиум щит ELEBOX N-SERIES (Закаленное стекло) 36-модулей",
    "name_en": "ELEBOX N-SERIES Distribution Box 36-Modules Glass",
    "slug": "elebox-n-series-tempered-glass-36m",
    "category": "shchitlar",
    "categoryName": "ELEBOX va GIP Shchitlar",
    "categoryName_ru": "Щиты ELEBOX и GIP",
    "categoryName_en": "Distribution Boards & Boxes",
    "brand": "ELEBOX",
    "price": 414500,
    "oldPrice": 476500,
    "wholesalePrice": 362500,
    "minWholesaleQty": 3,
    "stock": 387,
    "unit": "dona",
    "image": "/images/products/tg_elebox-n-series-tempered-glass-36m.jpg",
    "description": "Katta xonadonlar va villalar uchun 36 modulli hashamatli shisha eshikli ELEBOX taqsimlash shchiti.",
    "description_ru": "Распределительный щит 36 модулей со стеклянным фасадом.",
    "description_en": "36-module luxury distribution board with tempered glass front.",
    "specs": {
      "Sig'imi": "36 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm metall",
      "Ranglar": "Black / Gray"
    },
    "specs_ru": {
      "Sig'imi": "36 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm metall",
      "Ranglar": "Black / Gray"
    },
    "specs_en": {
      "Sig'imi": "36 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm metall",
      "Ranglar": "Black / Gray"
    },
    "rating": 4.9,
    "reviewsCount": 59,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 10,
    "name": "ELEBOX N-SERIES Premium Shchit (Tempered Glass) 54-Modul",
    "name_ru": "Премиум щит ELEBOX N-SERIES (Закаленное стекло) 54-модулей",
    "name_en": "ELEBOX N-SERIES Distribution Box 54-Modules Glass",
    "slug": "elebox-n-series-tempered-glass-54m",
    "category": "shchitlar",
    "categoryName": "ELEBOX va GIP Shchitlar",
    "categoryName_ru": "Щиты ELEBOX и GIP",
    "categoryName_en": "Distribution Boards & Boxes",
    "brand": "ELEBOX",
    "price": 544000,
    "oldPrice": 625500,
    "wholesalePrice": 479000,
    "minWholesaleQty": 3,
    "stock": 383,
    "unit": "dona",
    "image": "/images/products/tg_elebox-n-series-tempered-glass-54m.jpg",
    "description": "Maksimal sig'imli 54 modulli 3 qatorli elektr taqsimlash shchiti. Zamonaviy interyer dizayni.",
    "description_ru": "Щит на 54 модуля для масштабных проектов и особняков.",
    "description_en": "54-module distribution enclosure for extensive residential wiring.",
    "specs": {
      "Sig'imi": "54 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm po'lat",
      "Qatorlar": "3 qator"
    },
    "specs_ru": {
      "Sig'imi": "54 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm po'lat",
      "Qatorlar": "3 qator"
    },
    "specs_en": {
      "Sig'imi": "54 modul",
      "Eshik": "4 mm Tempered Glass",
      "Korpus": "1.2 mm po'lat",
      "Qatorlar": "3 qator"
    },
    "rating": 4.9,
    "reviewsCount": 48,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 11,
    "name": "ELEBOX 2/1 Taqsimlash Qutisi Wi-Fi Router va Elektr Shchit 20M",
    "name_ru": "Щит ELEBOX 2в1 для Wi-Fi роутера и электрики 20 модулей",
    "name_en": "ELEBOX 2-in-1 Multimedia & Electrical Enclosure 20M",
    "slug": "elebox-2-in-1-wifi-elektr-shchit-20m",
    "category": "shchitlar",
    "categoryName": "ELEBOX va GIP Shchitlar",
    "categoryName_ru": "Щиты ELEBOX и GIP",
    "categoryName_en": "Distribution Boards & Boxes",
    "brand": "ELEBOX",
    "price": 362500,
    "oldPrice": 417000,
    "wholesalePrice": 311000,
    "minWholesaleQty": 3,
    "stock": 425,
    "unit": "dona",
    "image": "/images/products/tg_elebox-2-in-1-wifi-elektr-shchit-20m.jpg",
    "description": "ELEBOX 2/1: 500x400mm ichki montajli shchit. Bir tarafida avtomatlar uchun 20 ta modul o'rni, ikkinchi tarafida Wi-Fi router va optik tola uchun maxsus bo'lim.",
    "description_ru": "Комбинированный щит 500х400мм для силовой электрики (20 модулей) и Wi-Fi роутера.",
    "description_en": "2-in-1 combination enclosure 500x400mm for electric breakers and Wi-Fi router.",
    "specs": {
      "O'lchami": "500 x 400 mm",
      "Sig'im": "20 modul + Router",
      "Korpus": "Metall",
      "Montaj": "Ichki"
    },
    "specs_ru": {
      "O'lchami": "500 x 400 mm",
      "Sig'im": "20 modul + Router",
      "Korpus": "Metall",
      "Montaj": "Ichki"
    },
    "specs_en": {
      "O'lchami": "500 x 400 mm",
      "Sig'im": "20 modul + Router",
      "Korpus": "Metall",
      "Montaj": "Ichki"
    },
    "rating": 4.9,
    "reviewsCount": 31,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 12,
    "name": "GIP IP54 Germetik Taqsimlash Qutisi 110x110 mm",
    "name_ru": "Коробка распределительная герметичная GIP IP54 110x110 мм",
    "name_en": "GIP IP54 Waterproof Junction Box 110x110 mm",
    "slug": "gip-ip54-germetik-quti-110x110",
    "category": "shchitlar",
    "categoryName": "ELEBOX va GIP Shchitlar",
    "categoryName_ru": "Щиты ELEBOX и GIP",
    "categoryName_en": "Distribution Boards & Boxes",
    "brand": "GIP",
    "price": 8500,
    "oldPrice": 10000,
    "wholesalePrice": 7000,
    "minWholesaleQty": 20,
    "stock": 434,
    "unit": "dona",
    "image": "/images/products/tg_gip-ip54-germetik-quti-110x110.jpg",
    "description": "IP54 germetik taqsimlash qutisi. Namlik va changdan to'liq himoyalangan. Devor va shiftga qulay o'rnatiladi, kabel kirish germovtulkalari mavjud.",
    "description_ru": "Герметичная распредкоробка GIP IP54 110х110 мм с резиновыми уплотнителями.",
    "description_en": "Weatherproof junction box GIP IP54 110x110 mm with cable entries.",
    "specs": {
      "O'lchami": "110 x 110 mm",
      "Himoya": "IP54",
      "Material": "Mustahkam ABS",
      "Kafolat": "3 yil"
    },
    "specs_ru": {
      "O'lchami": "110 x 110 mm",
      "Himoya": "IP54",
      "Material": "Mustahkam ABS",
      "Kafolat": "3 yil"
    },
    "specs_en": {
      "O'lchami": "110 x 110 mm",
      "Himoya": "IP54",
      "Material": "Mustahkam ABS",
      "Kafolat": "3 yil"
    },
    "rating": 4.9,
    "reviewsCount": 28,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 13,
    "name": "GIP IP54 Germetik Taqsimlash Qutisi 85x85 mm",
    "name_ru": "Коробка распределительная герметичная GIP IP54 85x85 мм",
    "name_en": "GIP IP54 Waterproof Junction Box 85x85 mm",
    "slug": "gip-ip54-germetik-quti-85x85",
    "category": "shchitlar",
    "categoryName": "ELEBOX va GIP Shchitlar",
    "categoryName_ru": "Щиты ELEBOX и GIP",
    "categoryName_en": "Distribution Boards & Boxes",
    "brand": "GIP",
    "price": 5000,
    "oldPrice": 6000,
    "wholesalePrice": 4500,
    "minWholesaleQty": 20,
    "stock": 211,
    "unit": "dona",
    "image": "/images/products/tg_gip-ip54-germetik-quti-85x85.jpg",
    "description": "Standart 85x85mm germetik montaj qutisi. Elektr simlarini namlikdan ishonchli asraydi.",
    "description_ru": "Герметичная коробка GIP 85х85 мм для наружного и внутреннего монтажа.",
    "description_en": "Junction box GIP 85x85 mm IP54 moisture proof.",
    "specs": {
      "O'lchami": "85 x 85 mm",
      "Himoya": "IP54",
      "Material": "Plastik",
      "Qadoqda": "60 dona"
    },
    "specs_ru": {
      "O'lchami": "85 x 85 mm",
      "Himoya": "IP54",
      "Material": "Plastik",
      "Qadoqda": "60 dona"
    },
    "specs_en": {
      "O'lchami": "85 x 85 mm",
      "Himoya": "IP54",
      "Material": "Plastik",
      "Qadoqda": "60 dona"
    },
    "rating": 4.9,
    "reviewsCount": 33,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 14,
    "name": "GIP Hoshiyasiz Minimalistik Plastik Shchit (Ichki/Tashqi)",
    "name_ru": "Щит пластиковый безрамочный GIP Минимализм",
    "name_en": "GIP Frameless Modern Plastic Enclosure",
    "slug": "gip-hoshiyasiz-plastik-shchit",
    "category": "shchitlar",
    "categoryName": "ELEBOX va GIP Shchitlar",
    "categoryName_ru": "Щиты ELEBOX и GIP",
    "categoryName_en": "Distribution Boards & Boxes",
    "brand": "GIP",
    "price": 84000,
    "oldPrice": 96500,
    "wholesalePrice": 71000,
    "minWholesaleQty": 10,
    "stock": 182,
    "unit": "dona",
    "image": "/images/products/tg_gip-hoshiyasiz-plastik-shchit.jpg",
    "description": "GIP brendining yangi dizayndagi hoshiyasiz (frameless) minimalistik plastik taqsimlash shchiti. Zamonaviy devorga mukammal o'tiradi.",
    "description_ru": "Безрамочный настенный пластиковый распределительный щиток GIP.",
    "description_en": "Frameless sleek modular plastic consumer unit by GIP.",
    "specs": {
      "Dizayn": "Hoshiyasiz minimalist",
      "Material": "Mustahkam polimer",
      "Kafolat": "3 yil",
      "Ishlab chiqarilgan": "O'zbekiston / GIP"
    },
    "specs_ru": {
      "Dizayn": "Hoshiyasiz minimalist",
      "Material": "Mustahkam polimer",
      "Kafolat": "3 yil",
      "Ishlab chiqarilgan": "O'zbekiston / GIP"
    },
    "specs_en": {
      "Dizayn": "Hoshiyasiz minimalist",
      "Material": "Mustahkam polimer",
      "Kafolat": "3 yil",
      "Ishlab chiqarilgan": "O'zbekiston / GIP"
    },
    "rating": 4.9,
    "reviewsCount": 54,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 15,
    "name": "LUX VOLT Kuchlanishdan Himoya Relesi RPVA 1F-63A",
    "name_ru": "Реле контроля напряжения LUX VOLT RPVA 1F-63A",
    "name_en": "Voltage Protection Relay LUX VOLT RPVA 1F-63A",
    "slug": "lux-volt-rele-rpva-1f-63a",
    "category": "rele-himoya",
    "categoryName": "Kuchlanish relesi va Taymerlar",
    "categoryName_ru": "Реле напряжения и таймеры",
    "categoryName_en": "Voltage Relays & Timers",
    "brand": "LUX VOLT",
    "price": 110000,
    "oldPrice": 126500,
    "wholesalePrice": 93000,
    "minWholesaleQty": 10,
    "stock": 303,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-rele-rpva-1f-63a.jpg",
    "description": "63A 1-fazali raqamli volt-amper himoya relesi. Maishiy texnika va xonadonni past/baland kuchlanishdan va tok ortishidan ishonchli saqlaydi.",
    "description_ru": "Реле напряжения 63A с цифровым дисплеем вольт-ампер для защиты квартиры.",
    "description_en": "Digital over/under voltage protection relay 1F 63A with LED display.",
    "specs": {
      "Tok kuchi": "63 A",
      "Kuchlanish oralig'i": "50-450 V",
      "Displey": "LED Raqamli",
      "Kafolat": "2 yil"
    },
    "specs_ru": {
      "Tok kuchi": "63 A",
      "Kuchlanish oralig'i": "50-450 V",
      "Displey": "LED Raqamli",
      "Kafolat": "2 yil"
    },
    "specs_en": {
      "Tok kuchi": "63 A",
      "Kuchlanish oralig'i": "50-450 V",
      "Displey": "LED Raqamli",
      "Kafolat": "2 yil"
    },
    "rating": 4.9,
    "reviewsCount": 23,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 16,
    "name": "LUX VOLT 3-Fazali Kuchlanish Relesi RPVA 3F-63A",
    "name_ru": "Трехфазное реле напряжения LUX VOLT RPVA 3F-63A",
    "name_en": "3-Phase Voltage Protection Relay LUX VOLT 3F-63A",
    "slug": "lux-volt-3f-rele-rpva-63a",
    "category": "rele-himoya",
    "categoryName": "Kuchlanish relesi va Taymerlar",
    "categoryName_ru": "Реле напряжения и таймеры",
    "categoryName_en": "Voltage Relays & Timers",
    "brand": "LUX VOLT",
    "price": 259000,
    "oldPrice": 298000,
    "wholesalePrice": 220000,
    "minWholesaleQty": 3,
    "stock": 305,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-3f-rele-rpva-63a.jpg",
    "description": "3 fazali kuchlanish relesi RPVA 3F-63A. Fazalar assimetriyasi, faza uzilishi va kuchlanish o'zgarishlaridan butun binoni himoya qiladi.",
    "description_ru": "3-фазное реле напряжения на 63A для комплексной защиты оборудования.",
    "description_en": "3-Phase 63A voltage monitoring relay with phase loss & imbalance protection.",
    "specs": {
      "Faza": "3 Fazali",
      "Tok": "63 A",
      "O'lchov": "50-450 V",
      "Kafolat": "2 yil"
    },
    "specs_ru": {
      "Faza": "3 Fazali",
      "Tok": "63 A",
      "O'lchov": "50-450 V",
      "Kafolat": "2 yil"
    },
    "specs_en": {
      "Faza": "3 Fazali",
      "Tok": "63 A",
      "O'lchov": "50-450 V",
      "Kafolat": "2 yil"
    },
    "rating": 4.9,
    "reviewsCount": 30,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 17,
    "name": "Universal AC/DC Kuchlanishdan Himoya Relesi 1F-63A",
    "name_ru": "Универсальное реле защиты AC/DC 1F-63A",
    "name_en": "Universal AC/DC Voltage Guard Relay 1F-63A",
    "slug": "universal-ac-dc-himoya-relesi-63a",
    "category": "rele-himoya",
    "categoryName": "Kuchlanish relesi va Taymerlar",
    "categoryName_ru": "Реле напряжения и таймеры",
    "categoryName_en": "Voltage Relays & Timers",
    "brand": "LUX VOLT",
    "price": 84000,
    "oldPrice": 96500,
    "wholesalePrice": 70000,
    "minWholesaleQty": 10,
    "stock": 478,
    "unit": "dona",
    "image": "/images/products/tg_universal-ac-dc-himoya-relesi-63a.jpg",
    "description": "UVO 130-300V / UVE 80-210V sozlanadigan qiymatlar. Raqamli displey, menyuni qulflash, 3-30 soniya qayta yoqish kechikishi.",
    "description_ru": "Реле контроля напряжения 63A с регулируемой задержкой включения.",
    "description_en": "Adjustable 63A voltage relay with delay timer and digital readout.",
    "specs": {
      "Tok": "63 A",
      "UVO": "130-300 V",
      "UVE": "80-210 V",
      "Kafolat": "3 yil"
    },
    "specs_ru": {
      "Tok": "63 A",
      "UVO": "130-300 V",
      "UVE": "80-210 V",
      "Kafolat": "3 yil"
    },
    "specs_en": {
      "Tok": "63 A",
      "UVO": "130-300 V",
      "UVE": "80-210 V",
      "Kafolat": "3 yil"
    },
    "rating": 4.9,
    "reviewsCount": 49,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 18,
    "name": "LUX VOLT Raqamli Elektron Taymer THC20 (24 Soat / Haftalik)",
    "name_ru": "Электронный программируемый таймер LUX VOLT THC20",
    "name_en": "Digital Programmable Timer Switch LUX VOLT THC20",
    "slug": "elektron-taymer-lux-volt-thc20",
    "category": "rele-himoya",
    "categoryName": "Kuchlanish relesi va Taymerlar",
    "categoryName_ru": "Реле напряжения и таймеры",
    "categoryName_en": "Voltage Relays & Timers",
    "brand": "LUX VOLT",
    "price": 129500,
    "oldPrice": 149000,
    "wholesalePrice": 110000,
    "minWholesaleQty": 3,
    "stock": 446,
    "unit": "dona",
    "image": "/images/products/tg_elektron-taymer-lux-volt-thc20.jpg",
    "description": "24 soatlik va haftalik 48 ON / 48 OFF dasturlash imkoniyati. Ichki 650 mA zaxira akkumulyator. Yoritish, nasos va ventilyatsiyani avtomatik yoqish/o'chirish.",
    "description_ru": "Недельный цифровой таймер на DIN-рейку с резервным питанием.",
    "description_en": "Weekly programmable digital DIN-rail timer switch with battery backup.",
    "specs": {
      "Dasturlash": "48 ON / 48 OFF",
      "Zaxira batareya": "650 mA",
      "Displey": "LED",
      "Kafolat": "1 yil"
    },
    "specs_ru": {
      "Dasturlash": "48 ON / 48 OFF",
      "Zaxira batareya": "650 mA",
      "Displey": "LED",
      "Kafolat": "1 yil"
    },
    "specs_en": {
      "Dasturlash": "48 ON / 48 OFF",
      "Zaxira batareya": "650 mA",
      "Displey": "LED",
      "Kafolat": "1 yil"
    },
    "rating": 4.9,
    "reviewsCount": 52,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 19,
    "name": "LUX VOLT Termostat 0–60°C DIN-Reyka Uchun",
    "name_ru": "Термостат механический LUX VOLT 0–60°C на DIN-рейку",
    "name_en": "Mechanical Thermostat LUX VOLT 0-60°C DIN-Rail",
    "slug": "termostat-lux-volt-din-reyka",
    "category": "rele-himoya",
    "categoryName": "Kuchlanish relesi va Taymerlar",
    "categoryName_ru": "Реле напряжения и таймеры",
    "categoryName_en": "Voltage Relays & Timers",
    "brand": "LUX VOLT",
    "price": 19500,
    "oldPrice": 22500,
    "wholesalePrice": 16000,
    "minWholesaleQty": 20,
    "stock": 445,
    "unit": "dona",
    "image": "/images/products/tg_termostat-lux-volt-din-reyka.jpg",
    "description": "Elektr qutilari va ventilyatsiya tizimlarida haroratni nazorat qilish uchun qulay mexanik termostat. Sozlash diapazoni: 0–60 °C, maksimal 10A / 250V AC.",
    "description_ru": "Терморегулятор для шкафов управления и щитов с диапазоном 0-60°C.",
    "description_en": "Cabinet temperature controller thermostat 0-60°C DIN-rail mounted.",
    "specs": {
      "Harorat": "0–60 °C",
      "Maksimal tok": "10 A",
      "Kuchlanish": "250 V AC",
      "Montaj": "DIN-reyka"
    },
    "specs_ru": {
      "Harorat": "0–60 °C",
      "Maksimal tok": "10 A",
      "Kuchlanish": "250 V AC",
      "Montaj": "DIN-reyka"
    },
    "specs_en": {
      "Harorat": "0–60 °C",
      "Maksimal tok": "10 A",
      "Kuchlanish": "250 V AC",
      "Montaj": "DIN-reyka"
    },
    "rating": 4.9,
    "reviewsCount": 45,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 20,
    "name": "LUX VOLT Kross Modul UKK 80A (Ko'k / Sariq / Yashil / Qizil)",
    "name_ru": "Кросс-модуль LUX VOLT UKK 80A цветной",
    "name_en": "Distribution Block LUX VOLT UKK 80A Multi-Color",
    "slug": "lux-volt-kross-modul-ukk-80a",
    "category": "shinalar",
    "categoryName": "Mis shina va Nol shinalari",
    "categoryName_ru": "Медные и нулевые шины",
    "categoryName_en": "Busbars & Neutral Bars",
    "brand": "LUX VOLT",
    "price": 17000,
    "oldPrice": 19500,
    "wholesalePrice": 14000,
    "minWholesaleQty": 20,
    "stock": 201,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-kross-modul-ukk-80a.jpg",
    "description": "Optom Elektrodan LUX VOLT UKK seriyali kross modullari. 80A quvvat, olovga chidamli UL94 V0 korpus, 4 xil rangda (ko'k, sariq, yashil, qizil).",
    "description_ru": "Кросс-модуль распределительный 80А в 4 цветах для фазировки щитов.",
    "description_en": "Modular distribution block UKK 80A available in 4 phase colors.",
    "specs": {
      "Tok kuchi": "80 A",
      "Korpus": "Olovga chidamli UL94 V0",
      "Ranglar": "Ko'k, Sariq, Yashil, Qizil",
      "Montaj": "DIN-reyka"
    },
    "specs_ru": {
      "Tok kuchi": "80 A",
      "Korpus": "Olovga chidamli UL94 V0",
      "Ranglar": "Ko'k, Sariq, Yashil, Qizil",
      "Montaj": "DIN-reyka"
    },
    "specs_en": {
      "Tok kuchi": "80 A",
      "Korpus": "Olovga chidamli UL94 V0",
      "Ranglar": "Ko'k, Sariq, Yashil, Qizil",
      "Montaj": "DIN-reyka"
    },
    "rating": 4.9,
    "reviewsCount": 32,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 21,
    "name": "LUX VOLT Kross Modul UKK 125A / 160A",
    "name_ru": "Кросс-модуль LUX VOLT UKK 125A / 160A",
    "name_en": "Modular Distribution Block UKK 125A / 160A",
    "slug": "lux-volt-kross-modul-ukk-125a",
    "category": "shinalar",
    "categoryName": "Mis shina va Nol shinalari",
    "categoryName_ru": "Медные и нулевые шины",
    "categoryName_en": "Busbars & Neutral Bars",
    "brand": "LUX VOLT",
    "price": 31000,
    "oldPrice": 35500,
    "wholesalePrice": 26000,
    "minWholesaleQty": 10,
    "stock": 271,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-kross-modul-ukk-125a.jpg",
    "description": "125A va 160A o'lchamdagi professional kross modul. Kirish va chiqish simlarini mustahkam qisish imkoniyati.",
    "description_ru": "Распределительный кросс-блок на DIN рейку 125A/160A.",
    "description_en": "High-conductivity modular terminal cross block 125A / 160A.",
    "specs": {
      "Tok": "125A / 160A",
      "Ulanish": "Mis kontaktlar",
      "Montaj": "DIN-reyka",
      "Sertifikat": "Mavjud"
    },
    "specs_ru": {
      "Tok": "125A / 160A",
      "Ulanish": "Mis kontaktlar",
      "Montaj": "DIN-reyka",
      "Sertifikat": "Mavjud"
    },
    "specs_en": {
      "Tok": "125A / 160A",
      "Ulanish": "Mis kontaktlar",
      "Montaj": "DIN-reyka",
      "Sertifikat": "Mavjud"
    },
    "rating": 4.9,
    "reviewsCount": 48,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 22,
    "name": "DIN-Reyka Uchun Nol Shina LUX VOLT PT-6 / PT-10 / PT-12",
    "name_ru": "Шина нулевая на DIN-рейку LUX VOLT PT-6 / PT-10",
    "name_en": "Neutral Busbar on DIN-Rail LUX VOLT PT Series",
    "slug": "din-reyka-nol-shina-lux-volt-pt",
    "category": "shinalar",
    "categoryName": "Mis shina va Nol shinalari",
    "categoryName_ru": "Медные и нулевые шины",
    "categoryName_en": "Busbars & Neutral Bars",
    "brand": "LUX VOLT",
    "price": 8500,
    "oldPrice": 10000,
    "wholesalePrice": 6500,
    "minWholesaleQty": 20,
    "stock": 453,
    "unit": "dona",
    "image": "/images/products/tg_din-reyka-nol-shina-lux-volt-pt.jpg",
    "description": "Neytral simlarni tartibli va xavfsiz ulash uchun DIN-reyka nol shinasi. Maksimal o'tkazuvchan kontaktlar, mustahkam plastik korpus.",
    "description_ru": "Нулевая шина в изолированном корпусе с креплением на DIN-рейку.",
    "description_en": "Insulated neutral ground terminal busbar for DIN rail mounting.",
    "specs": {
      "Teshiklar soni": "6 / 10 / 12 teshikli",
      "Asos": "Guruch / Mis",
      "Montaj": "DIN-reyka",
      "Kafolat": "Sifat kafolatlangan"
    },
    "specs_ru": {
      "Teshiklar soni": "6 / 10 / 12 teshikli",
      "Asos": "Guruch / Mis",
      "Montaj": "DIN-reyka",
      "Kafolat": "Sifat kafolatlangan"
    },
    "specs_en": {
      "Teshiklar soni": "6 / 10 / 12 teshikli",
      "Asos": "Guruch / Mis",
      "Montaj": "DIN-reyka",
      "Kafolat": "Sifat kafolatlangan"
    },
    "rating": 4.9,
    "reviewsCount": 21,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 23,
    "name": "Mis Taroqli Shina 63A 1-Metr (1P H-101 / 3P H-203)",
    "name_ru": "Шина гребенчатая медная 63A 1 метр (1P / 3P)",
    "name_en": "Copper Comb Busbar 63A 1 Meter (1P / 3P)",
    "slug": "mis-taroqli-shina-63a-1m",
    "category": "shinalar",
    "categoryName": "Mis shina va Nol shinalari",
    "categoryName_ru": "Медные и нулевые шины",
    "categoryName_en": "Busbars & Neutral Bars",
    "brand": "LUX VOLT",
    "price": 36500,
    "oldPrice": 42000,
    "wholesalePrice": 30000,
    "minWholesaleQty": 10,
    "stock": 162,
    "unit": "metr",
    "image": "/images/products/tg_mis-taroqli-shina-63a-1m.jpg",
    "description": "Elektr avtomatlarni ketma-ket va tartibli ulash uchun 63A toza mis taroqli shina. Uzunligi 1 metr, izolyatsiyalangan.",
    "description_ru": "Гребенка медная соединительная 63А длина 1 метр для автоматов.",
    "description_en": "Copper comb connecting busbar 63A 1 meter for modular breakers.",
    "specs": {
      "Uzunligi": "1 metr",
      "Tok": "63 A",
      "Material": "Toza mis",
      "Turi": "1P yoki 3P taroq"
    },
    "specs_ru": {
      "Uzunligi": "1 metr",
      "Tok": "63 A",
      "Material": "Toza mis",
      "Turi": "1P yoki 3P taroq"
    },
    "specs_en": {
      "Uzunligi": "1 metr",
      "Tok": "63 A",
      "Material": "Toza mis",
      "Turi": "1P yoki 3P taroq"
    },
    "rating": 4.9,
    "reviewsCount": 57,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 24,
    "name": "Yuqori Sig'imli Nol Shina 6+1 / 10+1 / 12+1 Murvatli",
    "name_ru": "Шина нулевая усиленная 6+1 / 10+1 / 12+1",
    "name_en": "Heavy-Duty Ground Neutral Busbar 6+1 / 10+1",
    "slug": "yuqori-sigimli-nol-shina-katta-murvatli",
    "category": "shinalar",
    "categoryName": "Mis shina va Nol shinalari",
    "categoryName_ru": "Медные и нулевые шины",
    "categoryName_en": "Busbars & Neutral Bars",
    "brand": "LUX VOLT",
    "price": 16000,
    "oldPrice": 18500,
    "wholesalePrice": 13500,
    "minWholesaleQty": 20,
    "stock": 319,
    "unit": "dona",
    "image": "/images/products/tg_yuqori-sigimli-nol-shina-katta-murvatli.jpg",
    "description": "1 ta katta murvatli asosiy kirish va 6/10/12 ta chiqishli quvvatli nol shina. Sanoat va ko'p qavatli binolar shchiti uchun.",
    "description_ru": "Усиленная шина с одним большим болтовым вводом для главного нуля.",
    "description_en": "Heavy-duty neutral busbar with main bolt lug input and multiple outputs.",
    "specs": {
      "Kirish": "1 ta katta murvat",
      "Chiqishlar": "6/10/12 ta",
      "Material": "Qalin mis",
      "Tayanch": "Izolyatsiyalangan"
    },
    "specs_ru": {
      "Kirish": "1 ta katta murvat",
      "Chiqishlar": "6/10/12 ta",
      "Material": "Qalin mis",
      "Tayanch": "Izolyatsiyalangan"
    },
    "specs_en": {
      "Kirish": "1 ta katta murvat",
      "Chiqishlar": "6/10/12 ta",
      "Material": "Qalin mis",
      "Tayanch": "Izolyatsiyalangan"
    },
    "rating": 4.9,
    "reviewsCount": 25,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 25,
    "name": "LUX VOLT Klemma (WAGO) PCT-212 / 213 / 215 / 222",
    "name_ru": "Клеммы быстрозажимные LUX VOLT (аналог WAGO) PCT",
    "name_en": "Quick Push-in Wire Connectors LUX VOLT PCT Series",
    "slug": "lux-volt-klemma-wago-pct-seriya",
    "category": "klemma-ulash",
    "categoryName": "Klemma va Taqsimlash bloklari",
    "categoryName_ru": "Клеммы и распредблоки",
    "categoryName_en": "Terminal Blocks & Connectors",
    "brand": "LUX VOLT",
    "price": 1000,
    "oldPrice": 1000,
    "wholesalePrice": 1000,
    "minWholesaleQty": 20,
    "stock": 386,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-klemma-wago-pct-seriya.jpg",
    "description": "Tezkor qisuvchi WAGO tipidagi klemnalar. 8 xil o'lchamda, qizib ketmaydi, kontakt uzilmaydi. Elektr montaj ishlarida eng qulay vosita.",
    "description_ru": "Строительно-монтажные самозажимные клеммы LUX VOLT аналог WAGO.",
    "description_en": "Reusable lever-action wire connectors LUX VOLT PCT series.",
    "specs": {
      "Turlari": "PCT-212, 213, 215, 222",
      "Sim kesimi": "0.08 - 4.0 mm²",
      "Nominal tok": "32 A",
      "Kuchlanish": "250 V"
    },
    "specs_ru": {
      "Turlari": "PCT-212, 213, 215, 222",
      "Sim kesimi": "0.08 - 4.0 mm²",
      "Nominal tok": "32 A",
      "Kuchlanish": "250 V"
    },
    "specs_en": {
      "Turlari": "PCT-212, 213, 215, 222",
      "Sim kesimi": "0.08 - 4.0 mm²",
      "Nominal tok": "32 A",
      "Kuchlanish": "250 V"
    },
    "rating": 4.9,
    "reviewsCount": 54,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 26,
    "name": "LUX VOLT Taqsimlash Bloki RBP-95 / RBP-35 (РБП)",
    "name_ru": "Распределительный силовой блок LUX VOLT РБП-95 / РБП-35",
    "name_en": "Distribution Power Block LUX VOLT RBP Series",
    "slug": "lux-volt-taqsimlash-bloki-rbp",
    "category": "klemma-ulash",
    "categoryName": "Klemma va Taqsimlash bloklari",
    "categoryName_ru": "Клеммы и распредблоки",
    "categoryName_en": "Terminal Blocks & Connectors",
    "brand": "LUX VOLT",
    "price": 30000,
    "oldPrice": 34500,
    "wholesalePrice": 25500,
    "minWholesaleQty": 10,
    "stock": 362,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-taqsimlash-bloki-rbp.jpg",
    "description": "DIN-reykaga o'rnatiladigan RBP taqsimlash bloki. Yong'inga chidamli qopqoqli korpus, sanoat panellari uchun yuqori sifatli kontaktlar.",
    "description_ru": "Силовой блок РБП на DIN-рейку для надежного разделения фазных линий.",
    "description_en": "Power distribution terminal block RBP-95 / RBP-35 on DIN rail.",
    "specs": {
      "Modellar": "RBP-95 / RBP-35",
      "Material": "Olovbardosh polimer",
      "Montaj": "DIN-reyka",
      "Himoya": "Shaffof qopqoqli"
    },
    "specs_ru": {
      "Modellar": "RBP-95 / RBP-35",
      "Material": "Olovbardosh polimer",
      "Montaj": "DIN-reyka",
      "Himoya": "Shaffof qopqoqli"
    },
    "specs_en": {
      "Modellar": "RBP-95 / RBP-35",
      "Material": "Olovbardosh polimer",
      "Montaj": "DIN-reyka",
      "Himoya": "Shaffof qopqoqli"
    },
    "rating": 4.9,
    "reviewsCount": 38,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 27,
    "name": "Magistral Taqsimlovchi Klemma FJ6/HYT-50 / HYT-70 (Oreshki)",
    "name_ru": "Клемма магистральная ответвительная FJ6 Орешки",
    "name_en": "Main Line Piercing Branch Terminal Clamp (Oreshki)",
    "slug": "magistral-klemma-oreshki-fj6",
    "category": "klemma-ulash",
    "categoryName": "Klemma va Taqsimlash bloklari",
    "categoryName_ru": "Клеммы и распредблоки",
    "categoryName_en": "Terminal Blocks & Connectors",
    "brand": "LUX VOLT",
    "price": 70000,
    "oldPrice": 80500,
    "wholesalePrice": 59500,
    "minWholesaleQty": 10,
    "stock": 381,
    "unit": "dona",
    "image": "/images/products/tg_magistral-klemma-oreshki-fj6.jpg",
    "description": "Ko'p qavatli xonadonlarda asosiy magistral elektr liniyasidan filial ajratish uchun maxsus magistral klemma (oreshki).",
    "description_ru": "Сжим ответвительный (орех) FJ6 для магистральных кабельных стояков.",
    "description_en": "Main riser cable branch terminal clamp FJ6 series.",
    "specs": {
      "Kabel kesimi": "50 mm² / 70 mm²",
      "Korpus": "Dielektrik karbolit",
      "Kontaktlar": "Po'lat qotishma",
      "Qo'llanishi": "Ko'p qavatli uylar"
    },
    "specs_ru": {
      "Kabel kesimi": "50 mm² / 70 mm²",
      "Korpus": "Dielektrik karbolit",
      "Kontaktlar": "Po'lat qotishma",
      "Qo'llanishi": "Ko'p qavatli uylar"
    },
    "specs_en": {
      "Kabel kesimi": "50 mm² / 70 mm²",
      "Korpus": "Dielektrik karbolit",
      "Kontaktlar": "Po'lat qotishma",
      "Qo'llanishi": "Ko'p qavatli uylar"
    },
    "rating": 4.9,
    "reviewsCount": 58,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 28,
    "name": "TC Seriyali 4P Quvvatli Klemma Bloklari (TC-604 / TC-1004)",
    "name_ru": "Блок клеммный силовой 4-полюсный TC-604 / TC-1004",
    "name_en": "Heavy Duty 4P Terminal Block TC-604 / TC-1004",
    "slug": "tc-seriyali-4p-klemma-bloklari",
    "category": "klemma-ulash",
    "categoryName": "Klemma va Taqsimlash bloklari",
    "categoryName_ru": "Клеммы и распредблоки",
    "categoryName_en": "Terminal Blocks & Connectors",
    "brand": "LUX VOLT",
    "price": 19500,
    "oldPrice": 22500,
    "wholesalePrice": 16000,
    "minWholesaleQty": 20,
    "stock": 391,
    "unit": "dona",
    "image": "/images/products/tg_tc-seriyali-4p-klemma-bloklari.jpg",
    "description": "600V gacha nominal kuchlanish, baquvvat vintli ulanish, qizib ketishga chidamli sanoat klemma bloki.",
    "description_ru": "Силовые винтовые клеммные колодки 4P на ток 60А-100А.",
    "description_en": "Barrier terminal block 4-pole 60A/100A for industrial control panels.",
    "specs": {
      "Kuchlanish": "600 V",
      "Qutblar": "4P",
      "Tok": "60A - 100A",
      "Ulanish": "Vintli qisqich"
    },
    "specs_ru": {
      "Kuchlanish": "600 V",
      "Qutblar": "4P",
      "Tok": "60A - 100A",
      "Ulanish": "Vintli qisqich"
    },
    "specs_en": {
      "Kuchlanish": "600 V",
      "Qutblar": "4P",
      "Tok": "60A - 100A",
      "Ulanish": "Vintli qisqich"
    },
    "rating": 4.9,
    "reviewsCount": 29,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 29,
    "name": "GIP Havo Tortuvchi Ventilyator 12W 100mm (Silver / Gold / Black / Gray)",
    "name_ru": "Вытяжной вентилятор GIP 12W 100мм (Silver, Gold, Black, Gray)",
    "name_en": "Exhaust Fan GIP 12W 100mm Multi-Color",
    "slug": "gip-havo-tortuvchi-ventilyator-12w-100mm",
    "category": "ventilyatsiya",
    "categoryName": "GIP Havo tortgich va Ventilyatsiya",
    "categoryName_ru": "Вентиляторы GIP",
    "categoryName_en": "Ventilation & Extractors",
    "brand": "GIP",
    "price": 80500,
    "oldPrice": 92500,
    "wholesalePrice": 67500,
    "minWholesaleQty": 10,
    "stock": 381,
    "unit": "dona",
    "image": "/images/products/tg_gip-havo-tortuvchi-ventilyator-12w-100mm.jpg",
    "description": "Hammom, oshxona va hojatxona uchun mo'ljallangan shovqinsiz GIP ventilyatori. 4 xil zamonaviy rang (kumush, tilla, qora, kulrang). 40 000 soat xizmat muddati, 5 YIL KAFOLAT.",
    "description_ru": "Бесшумный вытяжной вентилятор GIP 100мм с премиальным дизайном в 4 цветах. Гарантия 5 лет.",
    "description_en": "Silent domestic extractor fan GIP 12W 100mm in 4 premium metallic colors with 5-year warranty.",
    "specs": {
      "Quvvat": "12 W",
      "Diametr": "100 mm",
      "Ranglar": "Silver / Gold / Black / Gray",
      "Kafolat": "5 yil rasmiy"
    },
    "specs_ru": {
      "Quvvat": "12 W",
      "Diametr": "100 mm",
      "Ranglar": "Silver / Gold / Black / Gray",
      "Kafolat": "5 yil rasmiy"
    },
    "specs_en": {
      "Quvvat": "12 W",
      "Diametr": "100 mm",
      "Ranglar": "Silver / Gold / Black / Gray",
      "Kafolat": "5 yil rasmiy"
    },
    "rating": 4.9,
    "reviewsCount": 20,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 30,
    "name": "GIP Professional Kanal Ventilyatori 100mm (250–300 m³/soat)",
    "name_ru": "Канальный вентилятор GIP Профессиональный 100мм",
    "name_en": "Duct Inline Extractor Fan GIP Professional 100mm",
    "slug": "gip-professional-kanal-ventilyatori-100mm",
    "category": "ventilyatsiya",
    "categoryName": "GIP Havo tortgich va Ventilyatsiya",
    "categoryName_ru": "Вентиляторы GIP",
    "categoryName_en": "Ventilation & Extractors",
    "brand": "GIP",
    "price": 207000,
    "oldPrice": 238000,
    "wholesalePrice": 175000,
    "minWholesaleQty": 3,
    "stock": 187,
    "unit": "dona",
    "image": "/images/products/tg_gip-professional-kanal-ventilyatori-100mm.jpg",
    "description": "OPTOM ELEKTRO dan yangilik: Ikki tomonlama rezina muhrli ulanish tizimiga ega GIP kanal ventilyatori. 250–300 m³/soat havo almashinuvi, 5 yil rasmiy kafolat.",
    "description_ru": "Профессиональный канальный вентилятор GIP 100мм высокой производительности 300 м3/ч.",
    "description_en": "High-performance inline duct fan GIP 100mm, 300 m3/h airflow, 5-year warranty.",
    "specs": {
      "Diametr": "100 mm",
      "Unumdorlik": "250–300 m³/soat",
      "Muhr": "Ikki tomonlama rezina",
      "Kafolat": "5 yil"
    },
    "specs_ru": {
      "Diametr": "100 mm",
      "Unumdorlik": "250–300 m³/soat",
      "Muhr": "Ikki tomonlama rezina",
      "Kafolat": "5 yil"
    },
    "specs_en": {
      "Diametr": "100 mm",
      "Unumdorlik": "250–300 m³/soat",
      "Muhr": "Ikki tomonlama rezina",
      "Kafolat": "5 yil"
    },
    "rating": 4.9,
    "reviewsCount": 21,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 31,
    "name": "GIP Yopiq Panel Dizayndagi Xona Ventilyatori 12W 100mm",
    "name_ru": "Вентилятор вытяжной GIP с закрытой панелью 12W 100мм",
    "name_en": "Cover-Panel Design Extractor Fan GIP 12W 100mm",
    "slug": "gip-yopiq-panel-ventilyator-12w",
    "category": "ventilyatsiya",
    "categoryName": "GIP Havo tortgich va Ventilyatsiya",
    "categoryName_ru": "Вентиляторы GIP",
    "categoryName_en": "Ventilation & Extractors",
    "brand": "GIP",
    "price": 70000,
    "oldPrice": 80500,
    "wholesalePrice": 58500,
    "minWholesaleQty": 10,
    "stock": 169,
    "unit": "dona",
    "image": "/images/products/tg_gip-yopiq-panel-ventilyator-12w.jpg",
    "description": "Yopiq zamonaviy old panelga ega GIP ventilyatori. Panjara ko'rinmaydi, xona devorida chiroyli va toza turadi. Shovqinsiz 40 000 soat motor.",
    "description_ru": "Дизайнерский вытяжной вентилятор с закрытой лицевой панелью.",
    "description_en": "Sleek flat-face design bathroom exhaust fan GIP 100mm.",
    "specs": {
      "Panel": "Yopiq silliq panel",
      "Quvvat": "12 W",
      "Diametr": "100 mm",
      "Kafolat": "5 yil"
    },
    "specs_ru": {
      "Panel": "Yopiq silliq panel",
      "Quvvat": "12 W",
      "Diametr": "100 mm",
      "Kafolat": "5 yil"
    },
    "specs_en": {
      "Panel": "Yopiq silliq panel",
      "Quvvat": "12 W",
      "Diametr": "100 mm",
      "Kafolat": "5 yil"
    },
    "rating": 4.9,
    "reviewsCount": 55,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 32,
    "name": "LUX VOLT Raqamli Voltmetr AD16-22DSV (Kalta korpus Ø22mm)",
    "name_ru": "Вольтметр цифровой щитовой LUX VOLT AD16-22DSV",
    "name_en": "Digital Panel Voltmeter LUX VOLT AD16-22DSV",
    "slug": "lux-volt-voltmetr-ad16-22dsv",
    "category": "olchov-datchik",
    "categoryName": "Voltmetr, Ampermetr va Datchiklar",
    "categoryName_ru": "Вольтметры и датчики",
    "categoryName_en": "Meters & Sensors",
    "brand": "LUX VOLT",
    "price": 8000,
    "oldPrice": 9000,
    "wholesalePrice": 6000,
    "minWholesaleQty": 20,
    "stock": 377,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-voltmetr-ad16-22dsv.jpg",
    "description": "Elektr panellarda tarmoq kuchlanishini (60V–500V) real vaqtda ko'rsatuvchi kalta o'lchamli LED raqamli voltmetr. Qizil, sariq, yashil ranglarda.",
    "description_ru": "Компактный светодиодный индикатор напряжения AC 60-500V на 22мм.",
    "description_en": "Compact LED digital panel voltmeter AD16-22DSV 60V-500V AC.",
    "specs": {
      "Diapazon": "AC 60V – 500V",
      "Diametr": "Ø22 mm",
      "Aniqlik": "±1%",
      "Ranglar": "Qizil / Sariq / Yashil"
    },
    "specs_ru": {
      "Diapazon": "AC 60V – 500V",
      "Diametr": "Ø22 mm",
      "Aniqlik": "±1%",
      "Ranglar": "Qizil / Sariq / Yashil"
    },
    "specs_en": {
      "Diapazon": "AC 60V – 500V",
      "Diametr": "Ø22 mm",
      "Aniqlik": "±1%",
      "Ranglar": "Qizil / Sariq / Yashil"
    },
    "rating": 4.9,
    "reviewsCount": 45,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 33,
    "name": "LUX VOLT Raqamli Volt/Ampermetr AD16-22DVA (2-in-1)",
    "name_ru": "Вольт-амперметр цифровой LUX VOLT AD16-22DVA",
    "name_en": "Digital Dual Volt-Ammeter LUX VOLT AD16-22DVA",
    "slug": "lux-volt-ampermetr-ad16-22dva",
    "category": "olchov-datchik",
    "categoryName": "Voltmetr, Ampermetr va Datchiklar",
    "categoryName_ru": "Вольтметры и датчики",
    "categoryName_en": "Meters & Sensors",
    "brand": "LUX VOLT",
    "price": 15500,
    "oldPrice": 18000,
    "wholesalePrice": 12500,
    "minWholesaleQty": 20,
    "stock": 443,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-ampermetr-ad16-22dva.jpg",
    "description": "Bir vaqtning o'zida ham kuchlanish (V), ham tok kuchini (A) aniq ko'rsatuvchi 2-in-1 raqamli panel indikatori. Qizil, sariq, yashil LED.",
    "description_ru": "Комбинированный цифровой индикатор напряжения и тока с трансформатором тока.",
    "description_en": "Dual digital display voltmeter & ammeter with current sensor ring.",
    "specs": {
      "Kuchlanish": "AC 60–500 V",
      "Tok": "0–100 A",
      "Diametr": "Ø22 mm",
      "LED": "2 qatorli"
    },
    "specs_ru": {
      "Kuchlanish": "AC 60–500 V",
      "Tok": "0–100 A",
      "Diametr": "Ø22 mm",
      "LED": "2 qatorli"
    },
    "specs_en": {
      "Kuchlanish": "AC 60–500 V",
      "Tok": "0–100 A",
      "Diametr": "Ø22 mm",
      "LED": "2 qatorli"
    },
    "rating": 4.9,
    "reviewsCount": 61,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 34,
    "name": "LUX VOLT ST41AR 2-Kanallik Infraqizil Harakat Sensori",
    "name_ru": "Датчик движения инфракрасный 2-канальный LUX VOLT ST41AR",
    "name_en": "Dual-Channel PIR Presence Sensor LUX VOLT ST41AR",
    "slug": "lux-volt-st41ar-harakat-sensori",
    "category": "olchov-datchik",
    "categoryName": "Voltmetr, Ampermetr va Datchiklar",
    "categoryName_ru": "Вольтметры и датчики",
    "categoryName_en": "Meters & Sensors",
    "brand": "LUX VOLT",
    "price": 194500,
    "oldPrice": 223500,
    "wholesalePrice": 166000,
    "minWholesaleQty": 3,
    "stock": 150,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-st41ar-harakat-sensori.jpg",
    "description": "360° qamrovli 2 kanallik datchik: bir vaqtda chiroq va ventilyatorni alohida vaqt oralig'ida boshqaradi (TIME 1 va TIME 2). 2–8 m aniqlash masofasi, 3–2000 Lux sozlama.",
    "description_ru": "Потолочный 2-канальный датчик присутствия 360 градусов для света и вытяжки.",
    "description_en": "Dual-channel 360° ceiling presence motion sensor for lighting and ventilation.",
    "specs": {
      "Burchak": "360°",
      "Masofa": "2–8 metr",
      "Kanallar": "2 ta mustaqil",
      "Kafolat": "1 yil"
    },
    "specs_ru": {
      "Burchak": "360°",
      "Masofa": "2–8 metr",
      "Kanallar": "2 ta mustaqil",
      "Kafolat": "1 yil"
    },
    "specs_en": {
      "Burchak": "360°",
      "Masofa": "2–8 metr",
      "Kanallar": "2 ta mustaqil",
      "Kafolat": "1 yil"
    },
    "rating": 4.9,
    "reviewsCount": 32,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 35,
    "name": "DIN-Reyka Raqamli Indikatori LUX VOLT 1V / 1A / VAHz",
    "name_ru": "Модульный индикатор на DIN-рейку LUX VOLT (Вольт/Ампер/Герц)",
    "name_en": "DIN-Rail Modular Digital Indicator LUX VOLT VAHz",
    "slug": "din-reyka-indikator-lux-volt-vahz",
    "category": "olchov-datchik",
    "categoryName": "Voltmetr, Ampermetr va Datchiklar",
    "categoryName_ru": "Вольтметры и датчики",
    "categoryName_en": "Meters & Sensors",
    "brand": "LUX VOLT",
    "price": 52000,
    "oldPrice": 60000,
    "wholesalePrice": 41500,
    "minWholesaleQty": 10,
    "stock": 341,
    "unit": "dona",
    "image": "/images/products/tg_din-reyka-indikator-lux-volt-vahz.jpg",
    "description": "Modulli DIN-reykaga o'rnatiladigan raqamli indikator. Kuchlanish (V), tok (A) va chastotani (Hz) real vaqtda ko'rsatadi.",
    "description_ru": "Модульный щитовой вольт-амперметр частотомер на DIN рейку.",
    "description_en": "Modular DIN rail multifunction digital meter for Volt, Current & Frequency.",
    "specs": {
      "Displey": "Yorqin LED",
      "Parametrlar": "Volt / Amper / Hertz",
      "Montaj": "Standart DIN-reyka"
    },
    "specs_ru": {
      "Displey": "Yorqin LED",
      "Parametrlar": "Volt / Amper / Hertz",
      "Montaj": "Standart DIN-reyka"
    },
    "specs_en": {
      "Displey": "Yorqin LED",
      "Parametrlar": "Volt / Amper / Hertz",
      "Montaj": "Standart DIN-reyka"
    },
    "rating": 4.9,
    "reviewsCount": 37,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 36,
    "name": "Mis Qoplamali Yerlatgich Shtiri (Заземление) 1.5m x Ø14mm",
    "name_ru": "Штырь заземления омедненный 1.5м x Ø14мм",
    "name_en": "Copper-Bonded Earth Grounding Rod 1.5m x 14mm",
    "slug": "mis-qoplamali-yerlatgich-1-5m-14mm",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление и монтаж",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 90500,
    "oldPrice": 104000,
    "wholesalePrice": 75000,
    "minWholesaleQty": 10,
    "stock": 485,
    "unit": "dona",
    "image": "/images/products/tg_mis-qoplamali-yerlatgich-1-5m-14mm.jpg",
    "description": "Optom Elektro omborida: to'liq qalin mis qoplamali yerlatgich shtiri (zazemleniye). Korroziyaga o'ta chidamli, elektr o'tkazuvchanligi yuqori. Uzunligi 1.5 metr, diametri 14 mm.",
    "description_ru": "Омедненный стержень заземления 1.5 метра диаметром 14мм с высокой коррозионной стойкостью.",
    "description_en": "Copper-bonded steel ground rod 1.5m x 14mm for lightning and electrical earthing.",
    "specs": {
      "Uzunligi": "1.5 metr",
      "Diametri": "Ø 14 mm",
      "Qoplama": "Elektrolitik qalin mis",
      "Xizmat muddati": "30 yil"
    },
    "specs_ru": {
      "Uzunligi": "1.5 metr",
      "Diametri": "Ø 14 mm",
      "Qoplama": "Elektrolitik qalin mis",
      "Xizmat muddati": "30 yil"
    },
    "specs_en": {
      "Uzunligi": "1.5 metr",
      "Diametri": "Ø 14 mm",
      "Qoplama": "Elektrolitik qalin mis",
      "Xizmat muddati": "30 yil"
    },
    "rating": 4.9,
    "reviewsCount": 39,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 37,
    "name": "Mis Qoplamali Yerlatgich Shtiri (Заземление) 1.5m x Ø16mm",
    "name_ru": "Штырь заземления омедненный 1.5м x Ø16мм",
    "name_en": "Copper-Bonded Earth Grounding Rod 1.5m x 16mm",
    "slug": "mis-qoplamali-yerlatgich-1-5m-16mm",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление и монтаж",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 103500,
    "oldPrice": 119000,
    "wholesalePrice": 88000,
    "minWholesaleQty": 10,
    "stock": 478,
    "unit": "dona",
    "image": "/images/products/tg_mis-qoplamali-yerlatgich-1-5m-16mm.jpg",
    "description": "Katta obyektlar va kuchli yerlatish konturi uchun 16 mm qalinlikdagi mis qoplamali zazemleniye shtiri.",
    "description_ru": "Усиленный штырь заземления 16 мм с медным покрытием.",
    "description_en": "Heavy-duty 16mm copper clad ground rod 1.5m.",
    "specs": {
      "Uzunligi": "1.5 metr",
      "Diametri": "Ø 16 mm",
      "Qoplama": "Mis",
      "Xizmat muddati": "30 yil"
    },
    "specs_ru": {
      "Uzunligi": "1.5 metr",
      "Diametri": "Ø 16 mm",
      "Qoplama": "Mis",
      "Xizmat muddati": "30 yil"
    },
    "specs_en": {
      "Uzunligi": "1.5 metr",
      "Diametri": "Ø 16 mm",
      "Qoplama": "Mis",
      "Xizmat muddati": "30 yil"
    },
    "rating": 4.9,
    "reviewsCount": 23,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 38,
    "name": "LUX VOLT Avtonom Yong'in O'chirish Aerozoli (Shchitlar uchun)",
    "name_ru": "Автономный огнетушащий аэрозоль LUX VOLT для щитов",
    "name_en": "Automatic Fire Extinguishing Aerosol LUX VOLT for Panels",
    "slug": "lux-volt-avtonom-yongin-ochirish-aerozoli",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление и монтаж",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 52000,
    "oldPrice": 60000,
    "wholesalePrice": 41500,
    "minWholesaleQty": 10,
    "stock": 328,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-avtonom-yongin-ochirish-aerozoli.jpg",
    "description": "Elektr shchitlari ichiga o'rnatiladigan avtonom yong'in o'chiruvchi aerozol. 170°C haroratda 6 soniyada avtomatik ishga tushib, alangani darhol bartaraf qiladi. Xizmat muddati: 10 yil.",
    "description_ru": "Автономная система пожаротушения для электрощитов, срабатывает при 170°C за 6 секунд.",
    "description_en": "Self-activating fire extinguishing thermal generator for electrical enclosures.",
    "specs": {
      "Ishga tushish": "170°C",
      "Faollashuv": "6 soniya",
      "Himoya hajmi": "0.2 m³",
      "Xizmat muddati": "10 yil"
    },
    "specs_ru": {
      "Ishga tushish": "170°C",
      "Faollashuv": "6 soniya",
      "Himoya hajmi": "0.2 m³",
      "Xizmat muddati": "10 yil"
    },
    "specs_en": {
      "Ishga tushish": "170°C",
      "Faollashuv": "6 soniya",
      "Himoya hajmi": "0.2 m³",
      "Xizmat muddati": "10 yil"
    },
    "rating": 4.9,
    "reviewsCount": 36,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 39,
    "name": "LUX VOLT DIN-Reyka Elektro Rozetka 16A",
    "name_ru": "Розетка на DIN-рейку 16A LUX VOLT",
    "name_en": "DIN-Rail Electrical Socket 16A LUX VOLT",
    "slug": "lux-volt-din-reyka-rozetka-16a",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление и монтаж",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 11500,
    "oldPrice": 13000,
    "wholesalePrice": 9500,
    "minWholesaleQty": 20,
    "stock": 141,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-din-reyka-rozetka-16a.jpg",
    "description": "Elektr shchiti ichiga o'rnatiladigan standart 16A DIN-reyka rozetkasi. Yerlatish kontaktiga ega, servis va asboblarni ulash uchun qulay.",
    "description_ru": "Модульная розетка 16А с заземлением для монтажа в распределительный щит.",
    "description_en": "Modular socket outlet 16A with grounding for DIN rail mounting inside panels.",
    "specs": {
      "Tok": "16 A",
      "Kuchlanish": "250 V",
      "Montaj": "DIN-reyka",
      "Yerlatish": "Mavjud"
    },
    "specs_ru": {
      "Tok": "16 A",
      "Kuchlanish": "250 V",
      "Montaj": "DIN-reyka",
      "Yerlatish": "Mavjud"
    },
    "specs_en": {
      "Tok": "16 A",
      "Kuchlanish": "250 V",
      "Montaj": "DIN-reyka",
      "Yerlatish": "Mavjud"
    },
    "rating": 4.9,
    "reviewsCount": 39,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 40,
    "name": "LUX VOLT IP-Himoya Qopqoqli DIN-Reyka Rozetka 16A",
    "name_ru": "Розетка на DIN-рейку с защитной крышкой IP LUX VOLT 16A",
    "name_en": "Weatherproof Covered DIN-Rail Socket 16A LUX VOLT",
    "slug": "lux-volt-qopqoqli-din-rozetka-16a",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление и монтаж",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 23500,
    "oldPrice": 27000,
    "wholesalePrice": 19500,
    "minWholesaleQty": 20,
    "stock": 484,
    "unit": "dona",
    "image": "/images/products/tg_lux-volt-qopqoqli-din-rozetka-16a.jpg",
    "description": "Himoya qopqog'iga ega bo'lgan DIN-reyka rozetkasi. Namlik va changdan himoyalaydi, ochiq yoki nam joylardagi shchitlar uchun ideal.",
    "description_ru": "Щитовая розетка 16А с откидной защитной крышкой.",
    "description_en": "Protective hinged cover DIN rail socket 16A for damp environments.",
    "specs": {
      "Himoya": "Qopqoqli",
      "Tok": "16 A",
      "Kuchlanish": "250 V",
      "Montaj": "DIN-reyka"
    },
    "specs_ru": {
      "Himoya": "Qopqoqli",
      "Tok": "16 A",
      "Kuchlanish": "250 V",
      "Montaj": "DIN-reyka"
    },
    "specs_en": {
      "Himoya": "Qopqoqli",
      "Tok": "16 A",
      "Kuchlanish": "250 V",
      "Montaj": "DIN-reyka"
    },
    "rating": 4.9,
    "reviewsCount": 57,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 41,
    "name": "Oq Neylon Xomutlar (Styajkalar) 200 x 3.6 mm (100 dona)",
    "name_ru": "Стяжки кабельные белые нейлоновые 200 x 3.6 мм (100 шт)",
    "name_en": "White Nylon Cable Ties 200 x 3.6 mm (Pack of 100)",
    "slug": "oq-neylon-xomutlar-200x3-6",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление и монтаж",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 5000,
    "oldPrice": 6000,
    "wholesalePrice": 4000,
    "minWholesaleQty": 20,
    "stock": 207,
    "unit": "paket",
    "image": "/images/products/tg_oq-neylon-xomutlar-200x3-6.jpg",
    "description": "Yuqori sifatli oq neylon kabel xomutlari (styajkalar). Mustahkam, egiluvchan, uzilmaydi. Qadoqda 100 dona.",
    "description_ru": "Кабельные нейлоновые хомуты (стяжки) 200х3.6мм белые, упаковка 100шт.",
    "description_en": "High tensile strength white nylon cable zip ties 200 x 3.6 mm (100 pcs).",
    "specs": {
      "O'lchami": "200 x 3.6 mm",
      "Miqdori": "100 dona / paket",
      "Material": "Neylon 66",
      "Harorat": "-40°C dan +85°C gacha"
    },
    "specs_ru": {
      "O'lchami": "200 x 3.6 mm",
      "Miqdori": "100 dona / paket",
      "Material": "Neylon 66",
      "Harorat": "-40°C dan +85°C gacha"
    },
    "specs_en": {
      "O'lchami": "200 x 3.6 mm",
      "Miqdori": "100 dona / paket",
      "Material": "Neylon 66",
      "Harorat": "-40°C dan +85°C gacha"
    },
    "rating": 4.9,
    "reviewsCount": 45,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 42,
    "name": "Kabellarni O'rnatish Maydonchasi (Площадка под хомут)",
    "name_ru": "Площадка монтажная под дюбель-хомут для кабеля",
    "name_en": "Cable Tie Mounting Base Cradle (Pack of 100)",
    "slug": "kabel-ornatish-maydonchasi-ploshadka",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление va Montaj",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 19500,
    "oldPrice": 22500,
    "wholesalePrice": 15500,
    "minWholesaleQty": 20,
    "stock": 234,
    "unit": "paket",
    "image": "/images/products/tg_kabel-ornatish-maydonchasi-ploshadka.jpg",
    "description": "Gaz pistoleti va dyubel orqali o'rnatiladigan professional kabel maydonchasi (ploshadka). Zarbga chidamli, qadoqda 100 dona.",
    "description_ru": "Площадки под кабельные хомуты для прямого монтажа газовым пистолетом.",
    "description_en": "Cable tie mounting cradle blocks for direct nail gun and screw fixing (100 pcs).",
    "specs": {
      "Qadoqda": "100 dona",
      "O'rnatish": "Gaz pistoleti yoki dyubel",
      "Harorat": "-50°C dan +50°C",
      "Material": "Zarbga chidamli plastik"
    },
    "specs_ru": {
      "Qadoqda": "100 dona",
      "O'rnatish": "Gaz pistoleti yoki dyubel",
      "Harorat": "-50°C dan +50°C",
      "Material": "Zarbga chidamli plastik"
    },
    "specs_en": {
      "Qadoqda": "100 dona",
      "O'rnatish": "Gaz pistoleti yoki dyubel",
      "Harorat": "-50°C dan +50°C",
      "Material": "Zarbga chidamli plastik"
    },
    "rating": 4.9,
    "reviewsCount": 47,
    "isFeatured": false,
    "isPopular": false
  },
  {
    "id": 43,
    "name": "Sink Qoplangan DIN-Reyka 1-Metr x 35mm Standart",
    "name_ru": "DIN-рейка оцинкованная 1 метр x 35мм",
    "name_en": "Galvanized Steel DIN Rail 1 Meter x 35mm",
    "slug": "sink-qoplangan-din-reyka-1m",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление va Montaj",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 9000,
    "oldPrice": 10500,
    "wholesalePrice": 7000,
    "minWholesaleQty": 20,
    "stock": 173,
    "unit": "metr",
    "image": "/images/products/tg_sink-qoplangan-din-reyka-1m.jpg",
    "description": "1 mm qalinlikdagi yuqori sifatli sinklangan standart 35 mm DIN-reyka. Uzunligi 1 metr, barcha modul avtomat va shinalar uchun mos.",
    "description_ru": "Профильная оцинкованная перфорированная DIN-рейка 35x7.5мм длиной 1м.",
    "description_en": "Standard slotted galvanized zinc-plated DIN mounting rail 35mm x 1m.",
    "specs": {
      "Uzunligi": "1 metr",
      "Kengligi": "35 mm",
      "Qalinligi": "1.0 mm",
      "Qoplama": "Oq sink"
    },
    "specs_ru": {
      "Uzunligi": "1 metr",
      "Kengligi": "35 mm",
      "Qalinligi": "1.0 mm",
      "Qoplama": "Oq sink"
    },
    "specs_en": {
      "Uzunligi": "1 metr",
      "Kengligi": "35 mm",
      "Qalinligi": "1.0 mm",
      "Qoplama": "Oq sink"
    },
    "rating": 4.9,
    "reviewsCount": 48,
    "isFeatured": false,
    "isPopular": true
  },
  {
    "id": 44,
    "name": "DIN-Reyka Uchun Metall va Plastik Stoper (Фиксатор)",
    "name_ru": "Ограничитель фиксатор на DIN-рейку (Металл / Пластик)",
    "name_en": "End Stop Bracket Clamp for DIN Rail (Metal & Plastic)",
    "slug": "din-reyka-stoper-fiksator",
    "category": "montaj-xavfsizlik",
    "categoryName": "Yerlatgich (Zazemleniye) va Montaj",
    "categoryName_ru": "Заземление va Montaj",
    "categoryName_en": "Grounding & Installation",
    "brand": "LUX VOLT",
    "price": 1000,
    "oldPrice": 1000,
    "wholesalePrice": 1000,
    "minWholesaleQty": 20,
    "stock": 123,
    "unit": "dona",
    "image": "/images/products/tg_din-reyka-stoper-fiksator.jpg",
    "description": "DIN reykadagi avtomat, klemma, kontaktor va relelarni sirg'alib ketmasligi uchun mustahkam ushlab turuvchi chetki fiksator (stoper).",
    "description_ru": "Концевой стопор-фиксатор для модульного оборудования на рейке.",
    "description_en": "Heavy-duty end clamp terminal stop bracket for DIN rail mounting.",
    "specs": {
      "Material": "Metall / Plastik",
      "Vazifasi": "Avtomatlarni surilishdan to'xtatish",
      "Montaj": "Vintli qisqich"
    },
    "specs_ru": {
      "Material": "Metall / Plastik",
      "Vazifasi": "Avtomatlarni surilishdan to'xtatish",
      "Montaj": "Vintli qisqich"
    },
    "specs_en": {
      "Material": "Metall / Plastik",
      "Vazifasi": "Avtomatlarni surilishdan to'xtatish",
      "Montaj": "Vintli qisqich"
    },
    "rating": 4.9,
    "reviewsCount": 46,
    "isFeatured": false,
    "isPopular": false
  }
];

const INITIAL_SETTINGS = {
  storeName: 'OPTOM elektro',
  storeTagline: 'LUX VOLT, ELEBOX va GIP elektrotexnika mahsulotlarining rasmiy ulgurji va chakana savdo markazi',
  storePhone: '+998 95 009-09-09',
  storePhoneSecondary: '+998 97 447-47-47',
  storePhoneManager: '+998 98 111-70-70',
  storeAddress: "Toshkent sh., Chuqursoy Savdo Markazi, 1-183 do'kon (Jomiy bozori)",
  storeTelegram: 'https://t.me/optomelektro',
  telegramBotToken: '9284355717:AAF8eLuWBibzGe6Oq4en1PbgiZ5ogHguYao',
  telegramChatId: '8038275900',
  freeDeliveryThreshold: 5000000,
  deliveryFee: 40000,
  adminUsername: 'foden',
  adminPassword: 'usmon47'
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

  const seed = resolveSeedFilePath();

  if (!fs.existsSync(DB_FILE)) {
    if (seed && fs.existsSync(seed)) {
      try {
        const seedRaw = fs.readFileSync(seed, 'utf-8');
        fs.writeFileSync(DB_FILE, seedRaw, 'utf-8');
        const parsedSeed = JSON.parse(seedRaw);
        if (parsedSeed.settings && !parsedSeed.settings.telegramBotToken) {
          parsedSeed.settings = { ...INITIAL_SETTINGS, ...parsedSeed.settings };
        }
        return parsedSeed;
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
    const parsed = JSON.parse(raw);
    if (!parsed.settings || !parsed.settings.telegramBotToken) {
      parsed.settings = { ...INITIAL_SETTINGS, ...(parsed.settings || {}) };
    }
    return parsed;
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
  const nextId = productData.id || (db.products.length > 0 ? Math.max(...db.products.map(p => Number(p.id) || 0)) + 1 : 1);
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
  if (prismaSync) {
    prismaSync.syncProductToPostgres(newProduct, 'upsert').catch(() => {});
  }
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
  if (prismaSync) {
    prismaSync.syncProductToPostgres(db.products[idx], 'upsert').catch(() => {});
  }
  return db.products[idx];
}

function deleteProduct(id) {
  const db = readDb();
  const initialLen = db.products.length;
  const toDelete = db.products.find(p => String(p.id) === String(id));
  db.products = db.products.filter(p => String(p.id) !== String(id));
  if (db.products.length !== initialLen) {
    writeDb(db);
    if (prismaSync && toDelete) {
      prismaSync.syncProductToPostgres(toDelete, 'delete').catch(() => {});
    }
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
  if (!id) return null;
  const clean = String(id).trim().toUpperCase();
  const orders = db.orders || [];
  const direct = orders.find(o => String(o.id).toUpperCase() === clean);
  if (direct) return direct;
  if (!clean.startsWith('ORD-')) {
    const withPrefix = orders.find(o => String(o.id).toUpperCase() === 'ORD-' + clean);
    if (withPrefix) return withPrefix;
  }
  if (clean.startsWith('ORD-')) {
    const withoutPrefix = orders.find(o => String(o.id).toUpperCase() === clean.slice(4));
    if (withoutPrefix) return withoutPrefix;
  }
  return null;
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
  if (prismaSync) {
    prismaSync.syncOrderToPostgres(newOrder, 'upsert').catch(() => {});
  }
  return newOrder;
}

function updateOrderStatus(id, status) {
  const db = readDb();
  const order = db.orders.find(o => String(o.id) === String(id));
  if (!order) return null;
  order.status = status;
  writeDb(db);
  if (prismaSync) {
    prismaSync.syncOrderToPostgres(order, 'upsert').catch(() => {});
  }
  return order;
}

function deleteOrder(id) {
  const db = readDb();
  if (!id) return false;
  const clean = String(id).trim().toUpperCase();
  const initialLen = (db.orders || []).length;
  const toDelete = (db.orders || []).find(o => {
    const oId = String(o.id).toUpperCase();
    return oId === clean || oId === ('ORD-' + clean) || oId.replace(/^ORD-/, '') === clean.replace(/^ORD-/, '');
  });
  db.orders = (db.orders || []).filter(o => {
    const oId = String(o.id).toUpperCase();
    return oId !== clean && oId !== ('ORD-' + clean) && oId.replace(/^ORD-/, '') !== clean.replace(/^ORD-/, '');
  });
  if (db.orders.length !== initialLen) {
    writeDb(db);
    if (prismaSync && toDelete) {
      prismaSync.syncOrderToPostgres(toDelete, 'delete').catch(() => {});
    }
    return true;
  }
  return false;
}

// Settings
function getSettings() {
  const db = readDb();
  const current = db.settings || {};
  return {
    ...INITIAL_SETTINGS,
    ...current,
    telegramBotToken: (current.telegramBotToken && current.telegramBotToken.trim()) || INITIAL_SETTINGS.telegramBotToken,
    telegramChatId: (current.telegramChatId && String(current.telegramChatId).trim()) || INITIAL_SETTINGS.telegramChatId,
    adminUsername: (current.adminUsername && current.adminUsername.trim()) || INITIAL_SETTINGS.adminUsername,
    adminPassword: (current.adminPassword && current.adminPassword.trim()) || INITIAL_SETTINGS.adminPassword
  };
}

function updateSettings(newSettings) {
  const db = readDb();
  db.settings = { ...db.settings, ...newSettings };
  writeDb(db);
  if (prismaSync) {
    prismaSync.syncSettingsToPostgres(db.settings).catch(() => {});
  }
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
  deleteOrder,
  getSettings,
  updateSettings,
  getStats,
  getPrismaClient: prismaSync ? prismaSync.getPrismaClient : () => null
};

