const https = require('https');
const fs = require('fs');
const path = require('path');

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => resolve(destPath));
      stream.on('error', reject);
    }).on('error', reject);
  });
}

const UZS_RATE = 12950; // Current Tashkent market USD rate

// The 8 authentic store categories
const REAL_CATEGORIES = [
  { id: 'avtomatlar', name: "Avtomat va Faza o'tkazgichlar", name_ru: "Автоматы и фазопереключатели", name_en: "Circuit Breakers & Phase Switches", slug: 'avtomatlar', icon: 'Zap', count: 48 },
  { id: 'shchitlar', name: "ELEBOX va GIP Shchitlar", name_ru: "Щиты ELEBOX и GIP", name_en: "Distribution Boards & Boxes", slug: 'shchitlar', icon: 'Shield', count: 32 },
  { id: 'rele-himoya', name: "Kuchlanish relesi va Taymerlar", name_ru: "Реле напряжения и таймеры", name_en: "Voltage Relays & Timers", slug: 'rele-himoya', icon: 'Activity', count: 26 },
  { id: 'shinalar', name: "Mis shina va Nol shinalari", name_ru: "Медные и нулевые шины", name_en: "Busbars & Neutral Bars", slug: 'shinalar', icon: 'Cpu', count: 35 },
  { id: 'klemma-ulash', name: "Klemma va Taqsimlash bloklari", name_ru: "Клеммы и распредблоки", name_en: "Terminal Blocks & Connectors", slug: 'klemma-ulash', icon: 'Package', count: 42 },
  { id: 'ventilyatsiya', name: "GIP Havo tortgich va Ventilyatsiya", name_ru: "Вентиляторы GIP", name_en: "Ventilation & Extractors", slug: 'ventilyatsiya', icon: 'Sun', count: 28 },
  { id: 'olchov-datchik', name: "Voltmetr, Ampermetr va Datchiklar", name_ru: "Вольтметры и датчики", name_en: "Meters & Sensors", slug: 'olchov-datchik', icon: 'Power', count: 20 },
  { id: 'montaj-xavfsizlik', name: "Yerlatgich (Zazemleniye) va Montaj", name_ru: "Заземление и монтаж", name_en: "Grounding & Installation", slug: 'montaj-xavfsizlik', icon: 'Wrench', count: 36 }
];

// 32 Authentic products directly from t.me/optomelektro
const RAW_PRODUCTS = [
  // 1. Faza o'tkazgichlar & Avtomatlar
  {
    id: 1,
    name: "LUX VOLT Faza O'tkazgich RPS-63C (Avtomat)",
    name_ru: "Переключатель фаз LUX VOLT RPS-63C (Автомат)",
    name_en: "Phase Selector Switch LUX VOLT RPS-63C",
    slug: "lux-volt-faza-otkazgich-rps63c",
    category: "avtomatlar",
    categoryName: "Avtomat va Faza o'tkazgichlar",
    categoryName_ru: "Автоматы и фазопереключатели",
    categoryName_en: "Circuit Breakers & Phase Switches",
    brand: "LUX VOLT",
    usdPrice: 20,
    wholesaleUsdPrice: 17,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/nUY2Mrx68p3mm-lLEC36GJ2gAO64ergoM-kPmDJ89VLWCgeFO4hs2YqYOCUfnzIKv3wF16oh-B1RWM3J42B_P5yisWK-0gPlAIc-8ijsCG8b_yrPtfUaCpZZpCy3TsFLxOeKWjpwaoy1YSgIdZ_MWxguvHJIJDAV2QU--Um_D0rCZX5EpdML_h52GI2OBCoKDcuXe0AP0LuqMiG8hhekH7x4fC-lYuCteKz2Ynoj9pL1s9-7H2JBPVMHjStJBBSn3ElSGKmAmUbleqAk27MFtED5yTrstbIfAJxeq_GsyVoPPzehh4NiIyClxlYvK9-f-d0HNwbSbv0Q-LA1Lkgm6g.jpg",
    description: "LUX VOLT RPS-63C ayni paytda eng talabgir faza o'tkazgichlaridan biri. Fazalarni avtomat ravishda uzluksiz barqaror fazaga o'tkazib beradi. Yuqori sifat va rasmiy kafolat.",
    description_ru: "Автоматический переключатель фаз LUX VOLT RPS-63C выбирает наиболее стабильную фазу для непрерывного электроснабжения.",
    description_en: "Automatic phase selector switch LUX VOLT RPS-63C for uninterrupted stable single-phase power supply.",
    specs: { "Tok kuchi": "63 A", "Kuchlanish": "220/380 V", "Kafolat": "2 yil rasmiy", "O'rnatish": "DIN-reyka" }
  },
  {
    id: 2,
    name: "LUX VOLT Faza O'tkazgich RPS-125C Yuqori Quvvatli",
    name_ru: "Переключатель фаз LUX VOLT RPS-125C Мощный",
    name_en: "Heavy-Duty Phase Selector LUX VOLT RPS-125C",
    slug: "lux-volt-faza-otkazgich-rps125c",
    category: "avtomatlar",
    categoryName: "Avtomat va Faza o'tkazgichlar",
    categoryName_ru: "Автоматы и фазопереключатели",
    categoryName_en: "Circuit Breakers & Phase Switches",
    brand: "LUX VOLT",
    usdPrice: 28,
    wholesaleUsdPrice: 24,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/Bx93nI-klIbFHAHhH_GFgw39-hKY1L_Dy7LhDgxUa8Mv7JfT7X-hqjHi8189yzMprdNY_qT6aQ_WWmQv0GWpH2ZMwejz-GUS6unlkN7WvTBM_vloi-XyZgOLfxSYoaworchGd3JUc4wka5jmtvewdgQ7J6Bydtkc9wPpF9cK9cxpGMeZM1nzbGh5uJn-YrVYl36ho-3Qy5FV5M9EwFrFcwdRot8zYms_1PN-XyPvA-B-iCdwZbL8iNO_fonOxnFQVptVz_LFYHIQ3SVYdJbiH9DLn1Ea-qVv7Z3148VpUhilHCMpU_MMwNz2U-kQoJLy6WJEreyFkKUxOMziHoLGRQ.jpg",
    description: "Katta yuklamalar va ishlab chiqarish obyektlari uchun mo'ljallangan 125A kuchli faza o'tkazgich. 3 fazali kirishdan eng yaxshi fazani tanlab uzatadi.",
    description_ru: "Мощный переключатель фаз на 125A для промышленных и коммерческих объектов.",
    description_en: "Heavy-duty 125A phase selector switch for industrial installations.",
    specs: { "Tok kuchi": "125 A", "Kuchlanish": "220/380 V", "Kafolat": "2 yil rasmiy", "O'rnatish": "DIN-reyka" }
  },
  {
    id: 3,
    name: "Avtomatik To'k O'tkazgichi (АВР) LUX VOLT LWQ3-80 2P 63A",
    name_ru: "Автоматический ввод резерва (АВР) LUX VOLT LWQ3 2P 63A",
    name_en: "Automatic Transfer Switch (ATS) LUX VOLT LWQ3 2P 63A",
    slug: "lux-volt-avr-lwq3-80-2p-63a",
    category: "avtomatlar",
    categoryName: "Avtomat va Faza o'tkazgichlar",
    categoryName_ru: "Автоматы и фазопереключатели",
    categoryName_en: "Circuit Breakers & Phase Switches",
    brand: "LUX VOLT",
    usdPrice: 22,
    wholesaleUsdPrice: 19,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/Svkc3cNUdh61DvglIm0LYD1jyRb5AtY6EZMHshm5uzTlCBuSRvxiLsEp9TI2EvoupD96GtwdK15rkBqmNR4qOc4ZCF3fAIoo0QXpMeqbQFBfOGpHm6AbT5aNHWDIdxeWYxNMIWtswbaYTv8XtmNSLWFVNDh-JDGltYTWHui_HkjSDWuPQ5FrFVNCeu0LsR0ozTjDDtVxDv8pIqDRrYayP4xzZAvo0xcwcgu5FICIE5ZqkPP4LXTDtNQ1Tt_eI7Vgrdrm3ceWzegffSTv8CseuTGxwuMVS316Fzy6A6hUs_K_Ntk4mLuNQp-p8zLig2r5VyRHkwpKQRg3ea-4jnkN0A",
    description: "Shahar tarmog'i va generator o'rtasida avtomatik va qo'lda boshqaruvchi AVR to'k o'tkazgichi. 63A tok kuchi, 50/60Hz, izolyatsiya 690V.",
    description_ru: "АВР 2P 63A для автоматического переключения между сетью и генератором.",
    description_en: "Dual-power automatic transfer switch 2P 63A for generator integration.",
    specs: { "Tok kuchi": "63 A", "Qutblar": "2P", "Izolyatsiya": "690 V", "Ish rejimi": "Avtomatik / Qo'lda" }
  },
  {
    id: 4,
    name: "Generator uchun Ikki Manbali AVR LW2R 4P 100A",
    name_ru: "Двухпозиционный АВР для генератора LW2R 4P 100A",
    name_en: "Dual Power ATS Generator Switch LW2R 4P 100A",
    slug: "generator-avr-lw2r-4p-100a",
    category: "avtomatlar",
    categoryName: "Avtomat va Faza o'tkazgichlar",
    categoryName_ru: "Автоматы и фазопереключатели",
    categoryName_en: "Circuit Breakers & Phase Switches",
    brand: "LUX VOLT",
    usdPrice: 19,
    wholesaleUsdPrice: 16.5,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/aSwhFBINd2448pWfD1c26K48Yj2RI-_eehbzcReTpO2GBj_SYm0AeJhvJQ3W4uwtR4zRUHBuWqn86E3oFtTBdXHrfxW--iO0Mb1xf40YWRnJSYg7wVs4Lh4IEo4G6-mata53wSZS_-SmJqIFAGMUhF48-Xb4q6ohCmsy9YPDnvu-srd-JkmoDwKav9EHAkh_uNJWMR7w4_BMx8305meXJckCt_FDS2eBq3s0X2bOxnJeVPhYB3HHq9yzMJSUYdoLFdJx9z8okhUw-8hkUbEqd-F77ydTNqAF-F111qzkROsuco3cm9AAKRAc2h5aDglr2jfBGfSRfs0GLNmDA0gC5w.jpg",
    description: "4 qutbli (3 faza + nol) generator va quyosh energiyasi uchun avtomatik to'k o'tkazgich. 100A quvvat, 690V izolyatsiya.",
    description_ru: "4-полюсный автоматический переключатель питания на 100A для генераторов.",
    description_en: "4-Pole 100A dual-power automatic transfer switch.",
    specs: { "Tok kuchi": "100 A", "Qutblar": "4P (3F+N)", "Izolyatsiya": "690 V", "Kafolat": "1 yil" }
  },
  {
    id: 5,
    name: "Mexanik Faza O'tkazgich 3P 63A (0-1-2-3)",
    name_ru: "Механический кулачковый переключатель фаз 3P 63A",
    name_en: "Mechanical Rotary Phase Selector 3P 63A",
    slug: "mexanik-faza-otkazgich-3p-63a",
    category: "avtomatlar",
    categoryName: "Avtomat va Faza o'tkazgichlar",
    categoryName_ru: "Автоматы и фазопереключатели",
    categoryName_en: "Circuit Breakers & Phase Switches",
    brand: "LUX VOLT",
    usdPrice: 7.9,
    wholesaleUsdPrice: 6.8,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/vM_YUmYyBW2xZ83UgUqBFQRvgaT7NSN41avnNd8j5uiBxR8voiToHrfiwYtxI-vu1doOwy04peGHbE_02Y3P5wj1pS_xwRTgbNyWQ0iYytICaD4Ip7TzqzFEfzEdN-DfGDjoGsB9s_OMCUwr_y1Xef85WfZRz9IXtgX7HpbTErbduh3Ws7sXwS3ksbuI_Kh7RFB5h-vU8YjcyaUzISpZSb3pzsPndIK3ZwLaDX2KP8NLYV3rBZPBgVPTsXaEt7X0Tg3Yo5i7TEgX-J2k7EphgCt72m6w7ZzLNGNcxhDScvf6LvCcKuraszNH17de0xJ6dZLmhdvyneg7veBmZjff5w.jpg",
    description: "Elektr tarmoqlarini qo'lda boshqarish uchun mustahkam va ishonchli mexanik yechim. 63A tok kuchi, 380V AC ish kuchlanishi, 0-1-2-3 boshqaruv pozitsiyalari.",
    description_ru: "Механический переключатель фаз на 63A с удобным поворотным механизмом.",
    description_en: "Rotary manual changeover phase switch 3P 63A with 0-1-2-3 positions.",
    specs: { "Tok kuchi": "63 A", "Pozitsiyalar": "0-1-2-3", "Kuchlanish": "380 V AC", "Material": "Olovga chidamli korpus" }
  },
  {
    id: 6,
    name: "Mexanik Faza O'tkazgich 3P 125A Sanoat Kuchli",
    name_ru: "Механический переключатель фаз 3P 125A Мощный",
    name_en: "Heavy-Duty Rotary Phase Switch 3P 125A",
    slug: "mexanik-faza-otkazgich-3p-125a",
    category: "avtomatlar",
    categoryName: "Avtomat va Faza o'tkazgichlar",
    categoryName_ru: "Автоматы и фазопереключатели",
    categoryName_en: "Circuit Breakers & Phase Switches",
    brand: "LUX VOLT",
    usdPrice: 14.5,
    wholesaleUsdPrice: 12.8,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/vM_YUmYyBW2xZ83UgUqBFQRvgaT7NSN41avnNd8j5uiBxR8voiToHrfiwYtxI-vu1doOwy04peGHbE_02Y3P5wj1pS_xwRTgbNyWQ0iYytICaD4Ip7TzqzFEfzEdN-DfGDjoGsB9s_OMCUwr_y1Xef85WfZRz9IXtgX7HpbTErbduh3Ws7sXwS3ksbuI_Kh7RFB5h-vU8YjcyaUzISpZSb3pzsPndIK3ZwLaDX2KP8NLYV3rBZPBgVPTsXaEt7X0Tg3Yo5i7TEgX-J2k7EphgCt72m6w7ZzLNGNcxhDScvf6LvCcKuraszNH17de0xJ6dZLmhdvyneg7veBmZjff5w.jpg",
    description: "Sanoat korxonalari va kuchli elektr shchitlari uchun 125A mexanik faza tanlagich.",
    description_ru: "Промышленный ручной переключатель фаз 125A для силовых щитов.",
    description_en: "Industrial 125A manual phase selector switch for heavy distribution panels.",
    specs: { "Tok kuchi": "125 A", "Pozitsiyalar": "0-1-2-3", "Kuchlanish": "380 V AC", "Himoya": "IP40" }
  },
  {
    id: 7,
    name: "SMART WI-FI Master Switch 63A (Tuya / Alisa)",
    name_ru: "Умный Wi-Fi выключатель Master Switch 63A (Tuya / Алиса)",
    name_en: "Smart Wi-Fi Master Switch 63A (Tuya & Alexa)",
    slug: "smart-wifi-master-switch-63a",
    category: "avtomatlar",
    categoryName: "Avtomat va Faza o'tkazgichlar",
    categoryName_ru: "Автоматы и фазопереключатели",
    categoryName_en: "Circuit Breakers & Phase Switches",
    brand: "LUX VOLT",
    usdPrice: 18,
    wholesaleUsdPrice: 15.5,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/SF-jfSE6bjgSrc-7Sy-vduHL7R79AhFiuney1VeQQucWrKqj7-F5msQucY88QfakiZcG3WCAPgEiHiOZXWGzcfzuZ6SwqMEQU0h_xBOz1SmScnAcPQ0Zdc6uTB63oEq4tiCjhv3NyLc9sHcTNCi7kP-7Z_ZO9Fjc5IqEwzsrtOe7KQGIPZ4cCZXIQMx4-EyJFV624ogSyhZkdGHzfakl8N31CKZa2c64ffepGdeNNo1KwJHb3TEjDezS4Y4rqUNAlqdXNI9IEib1ijumM8ILtFNrrYL85pSshNnP_U8ChNZ61JBwD4b3MwP1aTlykyeOv0E5iLi8xg6WnWPwJ1OTcw",
    description: "Aqlli uy tizimi uchun Wi-Fi master switch 63A. Uydan chiqayotganda bitta tugma orqali barcha keraksiz jihozlarni o'chiradi. Yuqori va past kuchlanishdan himoya, Tuya va Alisa ovozli boshqaruv.",
    description_ru: "Умный мастер-выключатель 63A с Wi-Fi управлением через Tuya и Алису.",
    description_en: "Smart Wi-Fi 63A Master Circuit Breaker compatible with Tuya, Google Home and Alexa.",
    specs: { "Tok quvvati": "63 A", "Ulanish": "Wi-Fi 2.4GHz", "Ilova": "Tuya / Smart Life", "Funksiya": "Voltaj himoyasi va hisoblagich" }
  },

  // 2. ELEBOX & GIP Shchitlar
  {
    id: 8,
    name: "ELEBOX N-SERIES Premium Shchit (Tempered Glass) 18-Modul",
    name_ru: "Премиум щит ELEBOX N-SERIES (Закаленное стекло) 18-модулей",
    name_en: "ELEBOX N-SERIES Distribution Box 18-Modules Glass",
    slug: "elebox-n-series-tempered-glass-18m",
    category: "shchitlar",
    categoryName: "ELEBOX va GIP Shchitlar",
    categoryName_ru: "Щиты ELEBOX и GIP",
    categoryName_en: "Distribution Boards & Boxes",
    brand: "ELEBOX",
    usdPrice: 22,
    wholesaleUsdPrice: 19,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/a3LEa18Q8mlDnSPWkYrgYm-rZBFJFTzeJ5x0c3gzZiEXiLiKDBy2Sb5kZ2PhgfPpBh52533h6xOSML3mJfe5XFFSbReawZPmiDLRkyxAGQBJBrs9Ig5-iQkN1mwo0OrLY8J2O2osNcPxQR8FDr-Am80mqH5S3zABJgEsSImUkgh7G2W2oI6ikyy3QY43mZxd_ZR3v6vqNXHtMBkuP23wxNGcXLBDst7L1zl8oimHP6Fe6UWq6Ssy0KfEWKiplrU1Z345ydhhEUH_pjyr341fyTL9rYxyBqYxOWBzSV71z_-S0N44sCv2frVQFY_EEu8yr9qRi10ynfaKjFKCYFf3Lg",
    description: "Optom Elektro taqdim etadi: 4 mm Tempered Glass (toblangan shisha) old panel, 1.2 mm mustahkam metall korpus, ko'tariluvchi DIN-reyka simlarni qulay o'tkazish uchun. Black va Gray ranglarda.",
    description_ru: "Премиальный распределительный щит на 18 модулей с дверцей из закаленного стекла 4мм и металлом 1.2мм.",
    description_en: "Premium distribution board 18-modules with 4mm tempered glass door and 1.2mm steel casing.",
    specs: { "Sig'imi": "18 modul", "Eshik": "4 mm Tempered Glass", "Korpus": "1.2 mm metall", "O'rnatish": "Ichki montaj" }
  },
  {
    id: 9,
    name: "ELEBOX N-SERIES Premium Shchit (Tempered Glass) 36-Modul",
    name_ru: "Премиум щит ELEBOX N-SERIES (Закаленное стекло) 36-модулей",
    name_en: "ELEBOX N-SERIES Distribution Box 36-Modules Glass",
    slug: "elebox-n-series-tempered-glass-36m",
    category: "shchitlar",
    categoryName: "ELEBOX va GIP Shchitlar",
    categoryName_ru: "Щиты ELEBOX и GIP",
    categoryName_en: "Distribution Boards & Boxes",
    brand: "ELEBOX",
    usdPrice: 32,
    wholesaleUsdPrice: 28,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/a3LEa18Q8mlDnSPWkYrgYm-rZBFJFTzeJ5x0c3gzZiEXiLiKDBy2Sb5kZ2PhgfPpBh52533h6xOSML3mJfe5XFFSbReawZPmiDLRkyxAGQBJBrs9Ig5-iQkN1mwo0OrLY8J2O2osNcPxQR8FDr-Am80mqH5S3zABJgEsSImUkgh7G2W2oI6ikyy3QY43mZxd_ZR3v6vqNXHtMBkuP23wxNGcXLBDst7L1zl8oimHP6Fe6UWq6Ssy0KfEWKiplrU1Z345ydhhEUH_pjyr341fyTL9rYxyBqYxOWBzSV71z_-S0N44sCv2frVQFY_EEu8yr9qRi10ynfaKjFKCYFf3Lg",
    description: "Katta xonadonlar va villalar uchun 36 modulli hashamatli shisha eshikli ELEBOX taqsimlash shchiti.",
    description_ru: "Распределительный щит 36 модулей со стеклянным фасадом.",
    description_en: "36-module luxury distribution board with tempered glass front.",
    specs: { "Sig'imi": "36 modul", "Eshik": "4 mm Tempered Glass", "Korpus": "1.2 mm metall", "Ranglar": "Black / Gray" }
  },
  {
    id: 10,
    name: "ELEBOX N-SERIES Premium Shchit (Tempered Glass) 54-Modul",
    name_ru: "Премиум щит ELEBOX N-SERIES (Закаленное стекло) 54-модулей",
    name_en: "ELEBOX N-SERIES Distribution Box 54-Modules Glass",
    slug: "elebox-n-series-tempered-glass-54m",
    category: "shchitlar",
    categoryName: "ELEBOX va GIP Shchitlar",
    categoryName_ru: "Щиты ELEBOX и GIP",
    categoryName_en: "Distribution Boards & Boxes",
    brand: "ELEBOX",
    usdPrice: 42,
    wholesaleUsdPrice: 37,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/a3LEa18Q8mlDnSPWkYrgYm-rZBFJFTzeJ5x0c3gzZiEXiLiKDBy2Sb5kZ2PhgfPpBh52533h6xOSML3mJfe5XFFSbReawZPmiDLRkyxAGQBJBrs9Ig5-iQkN1mwo0OrLY8J2O2osNcPxQR8FDr-Am80mqH5S3zABJgEsSImUkgh7G2W2oI6ikyy3QY43mZxd_ZR3v6vqNXHtMBkuP23wxNGcXLBDst7L1zl8oimHP6Fe6UWq6Ssy0KfEWKiplrU1Z345ydhhEUH_pjyr341fyTL9rYxyBqYxOWBzSV71z_-S0N44sCv2frVQFY_EEu8yr9qRi10ynfaKjFKCYFf3Lg",
    description: "Maksimal sig'imli 54 modulli 3 qatorli elektr taqsimlash shchiti. Zamonaviy interyer dizayni.",
    description_ru: "Щит на 54 модуля для масштабных проектов и особняков.",
    description_en: "54-module distribution enclosure for extensive residential wiring.",
    specs: { "Sig'imi": "54 modul", "Eshik": "4 mm Tempered Glass", "Korpus": "1.2 mm po'lat", "Qatorlar": "3 qator" }
  },
  {
    id: 11,
    name: "ELEBOX 2/1 Taqsimlash Qutisi Wi-Fi Router va Elektr Shchit 20M",
    name_ru: "Щит ELEBOX 2в1 для Wi-Fi роутера и электрики 20 модулей",
    name_en: "ELEBOX 2-in-1 Multimedia & Electrical Enclosure 20M",
    slug: "elebox-2-in-1-wifi-elektr-shchit-20m",
    category: "shchitlar",
    categoryName: "ELEBOX va GIP Shchitlar",
    categoryName_ru: "Щиты ELEBOX и GIP",
    categoryName_en: "Distribution Boards & Boxes",
    brand: "ELEBOX",
    usdPrice: 28,
    wholesaleUsdPrice: 24,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/EZOPurX1vocl0pTAyPOEeTFnrYeWyaoJ_TD87_W7DKsgJQ3sddszG-djowd9rr_bInAZo9bsAPdk49Hq5UB10r-21pR38VGYvJuEUVqBETH0aRNKd9OwJ389RsVG1Q_xIpeiFiYWLlx-7c0SeMCuKlQko64YEEepjIt2D2_i3rz1TQkRhhW9GUl8OsFr7B_48O0SlGHI9-Hul1nKmXnPj9STYcmTQgx-RWuYeq44XbGNGMi9t6OQlKNoPs9i78qPOKjmOXojeil0je9K1SmvZdyr6aYiCGYcPxtP93kmju6ZCuv_jXNrg-VbR-aXR4UD7XtMwb6VkjEORpIX7YypzQ",
    description: "ELEBOX 2/1: 500x400mm ichki montajli shchit. Bir tarafida avtomatlar uchun 20 ta modul o'rni, ikkinchi tarafida Wi-Fi router va optik tola uchun maxsus bo'lim.",
    description_ru: "Комбинированный щит 500х400мм для силовой электрики (20 модулей) и Wi-Fi роутера.",
    description_en: "2-in-1 combination enclosure 500x400mm for electric breakers and Wi-Fi router.",
    specs: { "O'lchami": "500 x 400 mm", "Sig'im": "20 modul + Router", "Korpus": "Metall", "Montaj": "Ichki" }
  },
  {
    id: 12,
    name: "GIP IP54 Germetik Taqsimlash Qutisi 110x110 mm",
    name_ru: "Коробка распределительная герметичная GIP IP54 110x110 мм",
    name_en: "GIP IP54 Waterproof Junction Box 110x110 mm",
    slug: "gip-ip54-germetik-quti-110x110",
    category: "shchitlar",
    categoryName: "ELEBOX va GIP Shchitlar",
    categoryName_ru: "Щиты ELEBOX и GIP",
    categoryName_en: "Distribution Boards & Boxes",
    brand: "GIP",
    usdPrice: 0.675,
    wholesaleUsdPrice: 0.55,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/RBvs2CVGnYGU1PWKoMIvF_vyolMEV8QX5eFlMQiF_JDG-s6-1ytgCBOAiEtwxrLousHEf8BTkTrNPFlG9OVNxmZd3Hv4-2Y3RKQH0ujTsbtCk7_SRRPekD6OH6GXZgy4N0nTCq5JiFOsLnUgEakMI8783sO3x-8LG4WQsnFFwfDZzT8V-TL-Hk-690wS6veeDn3je_tylnxzkMOdjFV5h7GL1gydVwGBVCtj2z96-obOm2XeDEpT4LxuOM4mTHcw0prfwXbvzmRi9gEeDE_xfzF7OEOG_xhX3l-eRmAidH17XUq6mMCbCLN8bFFBX_qJPKHSNszFbrnVLBhgXlXmPQ.jpg",
    description: "IP54 germetik taqsimlash qutisi. Namlik va changdan to'liq himoyalangan. Devor va shiftga qulay o'rnatiladi, kabel kirish germovtulkalari mavjud.",
    description_ru: "Герметичная распредкоробка GIP IP54 110х110 мм с резиновыми уплотнителями.",
    description_en: "Weatherproof junction box GIP IP54 110x110 mm with cable entries.",
    specs: { "O'lchami": "110 x 110 mm", "Himoya": "IP54", "Material": "Mustahkam ABS", "Kafolat": "3 yil" }
  },
  {
    id: 13,
    name: "GIP IP54 Germetik Taqsimlash Qutisi 85x85 mm",
    name_ru: "Коробка распределительная герметичная GIP IP54 85x85 мм",
    name_en: "GIP IP54 Waterproof Junction Box 85x85 mm",
    slug: "gip-ip54-germetik-quti-85x85",
    category: "shchitlar",
    categoryName: "ELEBOX va GIP Shchitlar",
    categoryName_ru: "Щиты ELEBOX и GIP",
    categoryName_en: "Distribution Boards & Boxes",
    brand: "GIP",
    usdPrice: 0.405,
    wholesaleUsdPrice: 0.35,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/RBvs2CVGnYGU1PWKoMIvF_vyolMEV8QX5eFlMQiF_JDG-s6-1ytgCBOAiEtwxrLousHEf8BTkTrNPFlG9OVNxmZd3Hv4-2Y3RKQH0ujTsbtCk7_SRRPekD6OH6GXZgy4N0nTCq5JiFOsLnUgEakMI8783sO3x-8LG4WQsnFFwfDZzT8V-TL-Hk-690wS6veeDn3je_tylnxzkMOdjFV5h7GL1gydVwGBVCtj2z96-obOm2XeDEpT4LxuOM4mTHcw0prfwXbvzmRi9gEeDE_xfzF7OEOG_xhX3l-eRmAidH17XUq6mMCbCLN8bFFBX_qJPKHSNszFbrnVLBhgXlXmPQ.jpg",
    description: "Standart 85x85mm germetik montaj qutisi. Elektr simlarini namlikdan ishonchli asraydi.",
    description_ru: "Герметичная коробка GIP 85х85 мм для наружного и внутреннего монтажа.",
    description_en: "Junction box GIP 85x85 mm IP54 moisture proof.",
    specs: { "O'lchami": "85 x 85 mm", "Himoya": "IP54", "Material": "Plastik", "Qadoqda": "60 dona" }
  },
  {
    id: 14,
    name: "GIP Hoshiyasiz Minimalistik Plastik Shchit (Ichki/Tashqi)",
    name_ru: "Щит пластиковый безрамочный GIP Минимализм",
    name_en: "GIP Frameless Modern Plastic Enclosure",
    slug: "gip-hoshiyasiz-plastik-shchit",
    category: "shchitlar",
    categoryName: "ELEBOX va GIP Shchitlar",
    categoryName_ru: "Щиты ELEBOX и GIP",
    categoryName_en: "Distribution Boards & Boxes",
    brand: "GIP",
    usdPrice: 6.5,
    wholesaleUsdPrice: 5.5,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/UX4gw87IVaCHPHxHS5OT2t_1PyPBMWPJy4l2S6Z9p0iLQ-uX8qRJjgjXP_SN_UYrXrLT_DqIMw8pl9jraFRY7ytagx2DfvNw5XDA8kH3xSSrLlo7il_cNCzHlgZcs6IzR0thd92lKPkPDHjMm6Ia7ht0DrE7HtL8wJaNOGOwAZyNpNkc2Iwds997qFhUbLyKvPW6DTXdFewLNhKJG5PXL4OLabjSlmz_rQSUSsUVu01dBsdTFLAJCGsaxwGmSY_NhYrFtwWff068EC3mRUFtRi1cET3BVspe4CnSjEsSdbyEEIw5_dtbcmyLO-Ru4U6gpYK85eFgtNMjhqfpyhvcaA.jpg",
    description: "GIP brendining yangi dizayndagi hoshiyasiz (frameless) minimalistik plastik taqsimlash shchiti. Zamonaviy devorga mukammal o'tiradi.",
    description_ru: "Безрамочный настенный пластиковый распределительный щиток GIP.",
    description_en: "Frameless sleek modular plastic consumer unit by GIP.",
    specs: { "Dizayn": "Hoshiyasiz minimalist", "Material": "Mustahkam polimer", "Kafolat": "3 yil", "Ishlab chiqarilgan": "O'zbekiston / GIP" }
  },

  // 3. Kuchlanish relesi & Taymerlar
  {
    id: 15,
    name: "LUX VOLT Kuchlanishdan Himoya Relesi RPVA 1F-63A",
    name_ru: "Реле контроля напряжения LUX VOLT RPVA 1F-63A",
    name_en: "Voltage Protection Relay LUX VOLT RPVA 1F-63A",
    slug: "lux-volt-rele-rpva-1f-63a",
    category: "rele-himoya",
    categoryName: "Kuchlanish relesi va Taymerlar",
    categoryName_ru: "Реле напряжения и таймеры",
    categoryName_en: "Voltage Relays & Timers",
    brand: "LUX VOLT",
    usdPrice: 8.5,
    wholesaleUsdPrice: 7.2,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/snY25DbcSQUCpRevVqBKmG4P4ik_q22cG5R9tgomtTikdvLUyf3WQNsWVX5SbcbEOX91YkdXjOevaoe1xyK3qud-hjXsjciSZ7ZQyKEPM1SFpXp8GSgy0eT7EdsEYbBAlXQVyEl6I4WxKPzUWBB7OsU7somnRBVbQxBuzR27m18JKUKxVm7wK8ZIPHgqlCY1zKQGPMRhVl8yV-04LD3OjeauWG4p3MEJiX-RAQlm8Q0M5nnIqhcPBRoaKdRTuGhV5TMx9_7crx-zwfF3NkvgxkeZolFjY9TOQOzyhpCATvRV_AAuQKbej6o59EyQSufK378zEd5uXAePMgVf0tbLtg.jpg",
    description: "63A 1-fazali raqamli volt-amper himoya relesi. Maishiy texnika va xonadonni past/baland kuchlanishdan va tok ortishidan ishonchli saqlaydi.",
    description_ru: "Реле напряжения 63A с цифровым дисплеем вольт-ампер для защиты квартиры.",
    description_en: "Digital over/under voltage protection relay 1F 63A with LED display.",
    specs: { "Tok kuchi": "63 A", "Kuchlanish oralig'i": "50-450 V", "Displey": "LED Raqamli", "Kafolat": "2 yil" }
  },
  {
    id: 16,
    name: "LUX VOLT 3-Fazali Kuchlanish Relesi RPVA 3F-63A",
    name_ru: "Трехфазное реле напряжения LUX VOLT RPVA 3F-63A",
    name_en: "3-Phase Voltage Protection Relay LUX VOLT 3F-63A",
    slug: "lux-volt-3f-rele-rpva-63a",
    category: "rele-himoya",
    categoryName: "Kuchlanish relesi va Taymerlar",
    categoryName_ru: "Реле напряжения и таймеры",
    categoryName_en: "Voltage Relays & Timers",
    brand: "LUX VOLT",
    usdPrice: 20,
    wholesaleUsdPrice: 17,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/lOsdlTy31duGz4Oa9Mf3ZaRULXIS6tInAZ40EKQSi19J_R87uMDQeZ5ubUIM6sCrCpNmwEcN9zEbuwqpL8p85BIfGXHjcu1zwcziqBJOobHKFwvSnpai0815bf5jMxT_L8hUKGsJcU-WM1LqA2ixnj3KAvCLj6tGzrBzS2mlMy_kXFKyE7z4UY1V6qPeTMz2ek0C_77v9eXrtCsHa2Ew0Hayu1UXNqRGK8fH_1QOR5VMHjiebIAvK0DQS7K9KF7pN_u7m_NWmzjlV2ijMM39bYGfb8ewMvSOVUZpjg3K6GA24zIYY0XQp0_CXtxFFbpdD6eKtE9Qoe6COKaLRSGblA",
    description: "3 fazali kuchlanish relesi RPVA 3F-63A. Fazalar assimetriyasi, faza uzilishi va kuchlanish o'zgarishlaridan butun binoni himoya qiladi.",
    description_ru: "3-фазное реле напряжения на 63A для комплексной защиты оборудования.",
    description_en: "3-Phase 63A voltage monitoring relay with phase loss & imbalance protection.",
    specs: { "Faza": "3 Fazali", "Tok": "63 A", "O'lchov": "50-450 V", "Kafolat": "2 yil" }
  },
  {
    id: 17,
    name: "Universal AC/DC Kuchlanishdan Himoya Relesi 1F-63A",
    name_ru: "Универсальное реле защиты AC/DC 1F-63A",
    name_en: "Universal AC/DC Voltage Guard Relay 1F-63A",
    slug: "universal-ac-dc-himoya-relesi-63a",
    category: "rele-himoya",
    categoryName: "Kuchlanish relesi va Taymerlar",
    categoryName_ru: "Реле напряжения и таймеры",
    categoryName_en: "Voltage Relays & Timers",
    brand: "LUX VOLT",
    usdPrice: 6.5,
    wholesaleUsdPrice: 5.4,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/MwL2jnRrsz0Sjqi7jcqvbctk-4DcpZSePsEnUt_omMj-q1SfotqTa845CZOXjOs2VNeczRAfFDxPKcg01b9Po64DM3fm7f9En5KGwEEHh4zrjXfmDJWAUl4YU7VM-t9O7yWUioa_rydRp8lKMkWg1zSNVbsgoArFyU6Fy5SW6EG2BrW8FAkQ_KqUmb1Pu6SqkBbT7zaW0ud4akb3RvLwxWqZHp8XWmbfqIsabP7VMuq6lPE9SZYiLc9_aD60Cg5v5zHULXVniYt5LYhYJztzq-VTUlvNddZaQeC6DOZLfuixLLDJDaOrNi3iR9yJeg59sJdG5e-qmC6bOAPU2xU19A.jpg",
    description: "UVO 130-300V / UVE 80-210V sozlanadigan qiymatlar. Raqamli displey, menyuni qulflash, 3-30 soniya qayta yoqish kechikishi.",
    description_ru: "Реле контроля напряжения 63A с регулируемой задержкой включения.",
    description_en: "Adjustable 63A voltage relay with delay timer and digital readout.",
    specs: { "Tok": "63 A", "UVO": "130-300 V", "UVE": "80-210 V", "Kafolat": "3 yil" }
  },
  {
    id: 18,
    name: "LUX VOLT Raqamli Elektron Taymer THC20 (24 Soat / Haftalik)",
    name_ru: "Электронный программируемый таймер LUX VOLT THC20",
    name_en: "Digital Programmable Timer Switch LUX VOLT THC20",
    slug: "elektron-taymer-lux-volt-thc20",
    category: "rele-himoya",
    categoryName: "Kuchlanish relesi va Taymerlar",
    categoryName_ru: "Реле напряжения и таймеры",
    categoryName_en: "Voltage Relays & Timers",
    brand: "LUX VOLT",
    usdPrice: 10,
    wholesaleUsdPrice: 8.5,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/pWmoHzXvy3V0-ymN-3zmPrUJNs_lPrt82-245fL1NAMPvCT-oFiIQZ8pC4PUoHE4QWiek27YOJ62hen0c5uVbiMdiayNrKDaYKmppQuzhzbI0V0wJmu6FOuCyUdfd5VH9Q0O-ME4cMQUwqwdJq39roED_3KxyH6-WmobidG1CCJpec-f7dI09TW0CUaDPHjxDleh4WJIaSNQhZMhFcD_yVhTWfQtPxZ_MsGgnCkKQoY7uS-GSYsMAIGLjPEkYylEMTXrcYdtIJzPe1Uj1BbzrHkpLDZBugCB9Td3qwDf3uwwOBFJHn_0ZOXO_TYH3EQM-qa7bi8nNik3up4q7ufNjA.jpg",
    description: "24 soatlik va haftalik 48 ON / 48 OFF dasturlash imkoniyati. Ichki 650 mA zaxira akkumulyator. Yoritish, nasos va ventilyatsiyani avtomatik yoqish/o'chirish.",
    description_ru: "Недельный цифровой таймер на DIN-рейку с резервным питанием.",
    description_en: "Weekly programmable digital DIN-rail timer switch with battery backup.",
    specs: { "Dasturlash": "48 ON / 48 OFF", "Zaxira batareya": "650 mA", "Displey": "LED", "Kafolat": "1 yil" }
  },
  {
    id: 19,
    name: "LUX VOLT Termostat 0–60°C DIN-Reyka Uchun",
    name_ru: "Термостат механический LUX VOLT 0–60°C на DIN-рейку",
    name_en: "Mechanical Thermostat LUX VOLT 0-60°C DIN-Rail",
    slug: "termostat-lux-volt-din-reyka",
    category: "rele-himoya",
    categoryName: "Kuchlanish relesi va Taymerlar",
    categoryName_ru: "Реле напряжения и таймеры",
    categoryName_en: "Voltage Relays & Timers",
    brand: "LUX VOLT",
    usdPrice: 1.5,
    wholesaleUsdPrice: 1.25,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/i9IdiCfzzzo7Ni6xrqoJJA_9c2gjEs-bTup2jM2oViBJYdzX57ff9EohyYxeiHl6AHUuCoE5GAJofj4-O-3zG-Sg6ZdPD0Ml8ZVKFHpDpyaf5yG5mw48IDAyO5wIdhR92s8tdVBaQ4QHMymxY46dfff242QifIGHqlDpvz6fiQHCr7NYuT1eV6bKS8i2GkDYk6dnBT6Z1iJUzPXg5H6XunTBBq9n-1r1--hrytOkmfiFFYWqjYWMbu1VKbEGMWl4ZR8CrZ88JfEfyuvZIeV2ws6lV4fQ45Z_NNvZNMeDsoRAXhbNoqQcD8N1WMN6yIn2gzfqvnbSksShqd5tTDK6Gw.jpg",
    description: "Elektr qutilari va ventilyatsiya tizimlarida haroratni nazorat qilish uchun qulay mexanik termostat. Sozlash diapazoni: 0–60 °C, maksimal 10A / 250V AC.",
    description_ru: "Терморегулятор для шкафов управления и щитов с диапазоном 0-60°C.",
    description_en: "Cabinet temperature controller thermostat 0-60°C DIN-rail mounted.",
    specs: { "Harorat": "0–60 °C", "Maksimal tok": "10 A", "Kuchlanish": "250 V AC", "Montaj": "DIN-reyka" }
  },

  // 4. Mis shina & Nol shinalari
  {
    id: 20,
    name: "LUX VOLT Kross Modul UKK 80A (Ko'k / Sariq / Yashil / Qizil)",
    name_ru: "Кросс-модуль LUX VOLT UKK 80A цветной",
    name_en: "Distribution Block LUX VOLT UKK 80A Multi-Color",
    slug: "lux-volt-kross-modul-ukk-80a",
    category: "shinalar",
    categoryName: "Mis shina va Nol shinalari",
    categoryName_ru: "Медные и нулевые шины",
    categoryName_en: "Busbars & Neutral Bars",
    brand: "LUX VOLT",
    usdPrice: 1.32,
    wholesaleUsdPrice: 1.1,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/cw6qde8vFuS6O-wh7I9u4lZTq-qpko7aOQHwVE-S67Kw4CATsG8wxDdxHKj3zlojpk1Xqc4_IlKTdmFcl26YIla8Pesakuo-s_UKwjY7dlKmrYtB5GyfNaVqHl_3viji7zKYUtvoPt4dHmuns5qp8-U_IO8-ZvP0FNbRcbn65KgdlPm_6j-wrsWQMSI8YDlBzoWMAIHME9v0idxUTs0PWSa9ehXnCM2XxmJDIzBmk_h9IaJSRFiPj2LOXnIO2L4eN0rTwqAl5_rpgiB94ookB6yzy2AxXaYkE1Ih_ZtltkwHxIXI8pv-Gk9jsrgOra2hHAVJ3UlV5I03ZR4VePbZiA.jpg",
    description: "Optom Elektrodan LUX VOLT UKK seriyali kross modullari. 80A quvvat, olovga chidamli UL94 V0 korpus, 4 xil rangda (ko'k, sariq, yashil, qizil).",
    description_ru: "Кросс-модуль распределительный 80А в 4 цветах для фазировки щитов.",
    description_en: "Modular distribution block UKK 80A available in 4 phase colors.",
    specs: { "Tok kuchi": "80 A", "Korpus": "Olovga chidamli UL94 V0", "Ranglar": "Ko'k, Sariq, Yashil, Qizil", "Montaj": "DIN-reyka" }
  },
  {
    id: 21,
    name: "LUX VOLT Kross Modul UKK 125A / 160A",
    name_ru: "Кросс-модуль LUX VOLT UKK 125A / 160A",
    name_en: "Modular Distribution Block UKK 125A / 160A",
    slug: "lux-volt-kross-modul-ukk-125a",
    category: "shinalar",
    categoryName: "Mis shina va Nol shinalari",
    categoryName_ru: "Медные и нулевые шины",
    categoryName_en: "Busbars & Neutral Bars",
    brand: "LUX VOLT",
    usdPrice: 2.38,
    wholesaleUsdPrice: 2.0,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/cw6qde8vFuS6O-wh7I9u4lZTq-qpko7aOQHwVE-S67Kw4CATsG8wxDdxHKj3zlojpk1Xqc4_IlKTdmFcl26YIla8Pesakuo-s_UKwjY7dlKmrYtB5GyfNaVqHl_3viji7zKYUtvoPt4dHmuns5qp8-U_IO8-ZvP0FNbRcbn65KgdlPm_6j-wrsWQMSI8YDlBzoWMAIHME9v0idxUTs0PWSa9ehXnCM2XxmJDIzBmk_h9IaJSRFiPj2LOXnIO2L4eN0rTwqAl5_rpgiB94ookB6yzy2AxXaYkE1Ih_ZtltkwHxIXI8pv-Gk9jsrgOra2hHAVJ3UlV5I03ZR4VePbZiA.jpg",
    description: "125A va 160A o'lchamdagi professional kross modul. Kirish va chiqish simlarini mustahkam qisish imkoniyati.",
    description_ru: "Распределительный кросс-блок на DIN рейку 125A/160A.",
    description_en: "High-conductivity modular terminal cross block 125A / 160A.",
    specs: { "Tok": "125A / 160A", "Ulanish": "Mis kontaktlar", "Montaj": "DIN-reyka", "Sertifikat": "Mavjud" }
  },
  {
    id: 22,
    name: "DIN-Reyka Uchun Nol Shina LUX VOLT PT-6 / PT-10 / PT-12",
    name_ru: "Шина нулевая на DIN-рейку LUX VOLT PT-6 / PT-10",
    name_en: "Neutral Busbar on DIN-Rail LUX VOLT PT Series",
    slug: "din-reyka-nol-shina-lux-volt-pt",
    category: "shinalar",
    categoryName: "Mis shina va Nol shinalari",
    categoryName_ru: "Медные и нулевые шины",
    categoryName_en: "Busbars & Neutral Bars",
    brand: "LUX VOLT",
    usdPrice: 0.65,
    wholesaleUsdPrice: 0.52,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/Bp4XMsZJpTNWj0hsQ8WEAiDNUpq5KqurxgrZMreRHi1_aUGeEboEoM2-v-oBVwCgWcZIw-3Yd5WfnGOOVoVr0xOmpcSpvnRhUfL_jhEUJOj1MfC0g_ASS9ZvkQ5XIeDwvlthE8RVKA3Kyynmxk_83sZPKDfB_yfTm7WGrmg7YSnGlOLl240L0aAAIdIpx5d6-ij-fXQJaLStoysaNmJcB5daKkznSqygSFlxM0kYDzUVyUxVR1B7eGsCGYUZdR3BBp_CeNh7Ptjdw5oBnRWtrdAT9goPz0oBP6-cHw4Id27wsEwiidpWX-NQNzqvX3nowY3hta_p_L-iJCgEL6TbSA.jpg",
    description: "Neytral simlarni tartibli va xavfsiz ulash uchun DIN-reyka nol shinasi. Maksimal o'tkazuvchan kontaktlar, mustahkam plastik korpus.",
    description_ru: "Нулевая шина в изолированном корпусе с креплением на DIN-рейку.",
    description_en: "Insulated neutral ground terminal busbar for DIN rail mounting.",
    specs: { "Teshiklar soni": "6 / 10 / 12 teshikli", "Asos": "Guruch / Mis", "Montaj": "DIN-reyka", "Kafolat": "Sifat kafolatlangan" }
  },
  {
    id: 23,
    name: "Mis Taroqli Shina 63A 1-Metr (1P H-101 / 3P H-203)",
    name_ru: "Шина гребенчатая медная 63A 1 метр (1P / 3P)",
    name_en: "Copper Comb Busbar 63A 1 Meter (1P / 3P)",
    slug: "mis-taroqli-shina-63a-1m",
    category: "shinalar",
    categoryName: "Mis shina va Nol shinalari",
    categoryName_ru: "Медные и нулевые шины",
    categoryName_en: "Busbars & Neutral Bars",
    brand: "LUX VOLT",
    usdPrice: 2.8,
    wholesaleUsdPrice: 2.3,
    unit: "metr",
    photoUrl: "https://cdn4.telesco.pe/file/hHcOZFeXgNReB0StFtyh5Opt0LXJ-w6sALWcstFmokMPPFvyyy4Csd9XX_yKqW9dLewsnl5RUQOtZbzSv34KSH0qqpLXMNciS4Kb-RZOP1h29514bpZP4r1VwSHon3MO0hvAuaciu_ND0-FJ0wu79z-p01e2H3Nv4oShIyQDK4ff_6vOH0fdVVBxp_Shas2NlKSV-gp_JcvPR-V9HM-ITbkWKFWuVRCpDeMNEjnwGALpWZPCThKabU_siaF-La5Q1p6uGWSq5rv2uDIBCn1KHWcm9z2Eicr8L_FI4-ObDKG7cZQmbi1TYHNYmk8eNZY_D4Q-E8-IfFW3LHFkTAvm2Q",
    description: "Elektr avtomatlarni ketma-ket va tartibli ulash uchun 63A toza mis taroqli shina. Uzunligi 1 metr, izolyatsiyalangan.",
    description_ru: "Гребенка медная соединительная 63А длина 1 метр для автоматов.",
    description_en: "Copper comb connecting busbar 63A 1 meter for modular breakers.",
    specs: { "Uzunligi": "1 metr", "Tok": "63 A", "Material": "Toza mis", "Turi": "1P yoki 3P taroq" }
  },
  {
    id: 24,
    name: "Yuqori Sig'imli Nol Shina 6+1 / 10+1 / 12+1 Murvatli",
    name_ru: "Шина нулевая усиленная 6+1 / 10+1 / 12+1",
    name_en: "Heavy-Duty Ground Neutral Busbar 6+1 / 10+1",
    slug: "yuqori-sigimli-nol-shina-katta-murvatli",
    category: "shinalar",
    categoryName: "Mis shina va Nol shinalari",
    categoryName_ru: "Медные и нулевые шины",
    categoryName_en: "Busbars & Neutral Bars",
    brand: "LUX VOLT",
    usdPrice: 1.24,
    wholesaleUsdPrice: 1.05,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/SAFkXld5jA9SnI7uV4Ce-F8Vj8xSZaEYTQYmcoeAz0Qj0j08hkwMk9bv5_SINYHJPj6GIwa-HjewTLJdFCBhGl15h4plXReT24ZF_yDnYVuXMy_6YlkGZoaahKOmAnERb_5BCbsb9W1FZ9Odw4wxu7vTeyWaRfSbj5Hw8o1v9icliG0di9tg4Yn4wIHSwCxfTm3YA0ajezN9k5f-FIXwHb8p6eRB58v8lSmCS2UWDW1BRLk3kFO6tofXSmBAWE0Dtrl-edmLwxsiwQVuEbkHnVkTBxbcNcGiUyMcFGb2T5EDpI2FFnqXDL4ytbKzKxkLXHsglBgVilGDRya4nmkNIA.jpg",
    description: "1 ta katta murvatli asosiy kirish va 6/10/12 ta chiqishli quvvatli nol shina. Sanoat va ko'p qavatli binolar shchiti uchun.",
    description_ru: "Усиленная шина с одним большим болтовым вводом для главного нуля.",
    description_en: "Heavy-duty neutral busbar with main bolt lug input and multiple outputs.",
    specs: { "Kirish": "1 ta katta murvat", "Chiqishlar": "6/10/12 ta", "Material": "Qalin mis", "Tayanch": "Izolyatsiyalangan" }
  },

  // 5. Klemma & Taqsimlash bloklari
  {
    id: 25,
    name: "LUX VOLT Klemma (WAGO) PCT-212 / 213 / 215 / 222",
    name_ru: "Клеммы быстрозажимные LUX VOLT (аналог WAGO) PCT",
    name_en: "Quick Push-in Wire Connectors LUX VOLT PCT Series",
    slug: "lux-volt-klemma-wago-pct-seriya",
    category: "klemma-ulash",
    categoryName: "Klemma va Taqsimlash bloklari",
    categoryName_ru: "Клеммы и распредблоки",
    categoryName_en: "Terminal Blocks & Connectors",
    brand: "LUX VOLT",
    usdPrice: 0.08,
    wholesaleUsdPrice: 0.065,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/LOvCHbnwpdWCuerlrbFUI9XxBE0LEkM3JQbsausL1ozOoJF8yM9uEuUplkjWA2wGeQRHURVOxURRT0c9ycGDSRPlMfYOTsyU-d1ys-Kli8qgs04mhiY8DiOk3J3bKwG_kEvCVVna2iFHoU9Ifj5feNfDxBWKkjqZ1zMxtMhwHwSgCTvki3AEDEmzYwtzoHCCkcSyA9QmN-k5unQOj6_gzZRyDjLQG9h5k9yVLIOtz3oFftDRH_WnUXuEa05B54vpiROzfJEXjHGdci67iZ9-oyyLxxmAFlaBa41Yj-AGbp34ubG9FPmAuCuy5NL7UyahdZrSyDkGmkB2ht8zXvJNQA.jpg",
    description: "Tezkor qisuvchi WAGO tipidagi klemnalar. 8 xil o'lchamda, qizib ketmaydi, kontakt uzilmaydi. Elektr montaj ishlarida eng qulay vosita.",
    description_ru: "Строительно-монтажные самозажимные клеммы LUX VOLT аналог WAGO.",
    description_en: "Reusable lever-action wire connectors LUX VOLT PCT series.",
    specs: { "Turlari": "PCT-212, 213, 215, 222", "Sim kesimi": "0.08 - 4.0 mm²", "Nominal tok": "32 A", "Kuchlanish": "250 V" }
  },
  {
    id: 26,
    name: "LUX VOLT Taqsimlash Bloki RBP-95 / RBP-35 (РБП)",
    name_ru: "Распределительный силовой блок LUX VOLT РБП-95 / РБП-35",
    name_en: "Distribution Power Block LUX VOLT RBP Series",
    slug: "lux-volt-taqsimlash-bloki-rbp",
    category: "klemma-ulash",
    categoryName: "Klemma va Taqsimlash bloklari",
    categoryName_ru: "Клеммы и распредблоки",
    categoryName_en: "Terminal Blocks & Connectors",
    brand: "LUX VOLT",
    usdPrice: 2.3,
    wholesaleUsdPrice: 1.95,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/qqTQ7UoScyV6Nhh2BLs-I6u8Vj6y_T3ZKy_24Fbji-i0u0EIDTjAaIw5RL5CS7Vm46YenUJ1fb3xY7iCUF2-C1dr1BhZWYYSt0fakxM27kep9KwT-p7rmOT4YgZSFe6A8swHu7FNS8ABawjXxjOgsCofn8VLoNUKQ1pbp9SK_8y-LO9mwgzV0oUfCPbKLy6VELVxJfKLkfqjKDs4dyjjh8Qyb9uzjywiUoCZ6L4lPjlaH9jeMyyq689byWhN8TWg7LF2Z9P6U4wPgl0Z8yC34xpugm9nDq4nyveGnlGBLcqQ6TyUXL7oJXS89mFVIpqtaO46qxCtuuCEWvnNBTIN7w.jpg",
    description: "DIN-reykaga o'rnatiladigan RBP taqsimlash bloki. Yong'inga chidamli qopqoqli korpus, sanoat panellari uchun yuqori sifatli kontaktlar.",
    description_ru: "Силовой блок РБП на DIN-рейку для надежного разделения фазных линий.",
    description_en: "Power distribution terminal block RBP-95 / RBP-35 on DIN rail.",
    specs: { "Modellar": "RBP-95 / RBP-35", "Material": "Olovbardosh polimer", "Montaj": "DIN-reyka", "Himoya": "Shaffof qopqoqli" }
  },
  {
    id: 27,
    name: "Magistral Taqsimlovchi Klemma FJ6/HYT-50 / HYT-70 (Oreshki)",
    name_ru: "Клемма магистральная ответвительная FJ6 Орешки",
    name_en: "Main Line Piercing Branch Terminal Clamp (Oreshki)",
    slug: "magistral-klemma-oreshki-fj6",
    category: "klemma-ulash",
    categoryName: "Klemma va Taqsimlash bloklari",
    categoryName_ru: "Клеммы и распредблоки",
    categoryName_en: "Terminal Blocks & Connectors",
    brand: "LUX VOLT",
    usdPrice: 5.4,
    wholesaleUsdPrice: 4.6,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/pUeEvsESHsRmDz1ZkQHBsq2g76bsxRy6AujC7SC0Y0ap6Crd6UfkH2xzbVPVmlCW4_ir7GI5kpRT2eEoJocLoWNffGF5j1EFhe-HK32KWGg0Jg58KrBoFEt-QgGttrjV2Fr57qKUE10--bsiF8qfWFIcu03e03xRmgsXJaohnrwgelgEwDFeQuVdODKLh09PNDPJ120evv4u8mxodi_-3MqMkj5qGIxEd2ebsslXEOm8FwKCnLtQ6fAPCVKTCU62dbhi9spfegogeLucC5hRKauCWrx7bcdBjowJ72ccOm382l42A-Qq3p0ty-PJDjYupn9KfdE_8KyPyE8l61KZ9w.jpg",
    description: "Ko'p qavatli xonadonlarda asosiy magistral elektr liniyasidan filial ajratish uchun maxsus magistral klemma (oreshki).",
    description_ru: "Сжим ответвительный (орех) FJ6 для магистральных кабельных стояков.",
    description_en: "Main riser cable branch terminal clamp FJ6 series.",
    specs: { "Kabel kesimi": "50 mm² / 70 mm²", "Korpus": "Dielektrik karbolit", "Kontaktlar": "Po'lat qotishma", "Qo'llanishi": "Ko'p qavatli uylar" }
  },
  {
    id: 28,
    name: "TC Seriyali 4P Quvvatli Klemma Bloklari (TC-604 / TC-1004)",
    name_ru: "Блок клеммный силовой 4-полюсный TC-604 / TC-1004",
    name_en: "Heavy Duty 4P Terminal Block TC-604 / TC-1004",
    slug: "tc-seriyali-4p-klemma-bloklari",
    category: "klemma-ulash",
    categoryName: "Klemma va Taqsimlash bloklari",
    categoryName_ru: "Клеммы и распредблоки",
    categoryName_en: "Terminal Blocks & Connectors",
    brand: "LUX VOLT",
    usdPrice: 1.5,
    wholesaleUsdPrice: 1.25,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/Ui7bCZrhdrh69gSyM_ZBCX6Q1H-ooozg3f1asgPTmqv2a8gk8acziBO5BgpP2YBL13Y7tcH_6HcczBm-lS83JR4SA4jNmAiFW1L4pw36-jZUtp5y2UxXT-t0iNWQ5WTGWi9WyPceFaHf2nouz1fvOOEM9Qzxet6CqHekkDTLu23c7s5YECj7_il5onp170KfxEUagDdYOjhI-ixlvooGX_b7vYoNpu6a0b5uqyFQdAsGKIA7ZIDMtB8XQYeh0x93khsazi2x1XYqLc68L0OCA2HKHTiTkw5wjS1sk8_v5FcnDBy1xtfiosUIL88d6fr2zJgtClm0xlR4uvC3q8gRkA.jpg",
    description: "600V gacha nominal kuchlanish, baquvvat vintli ulanish, qizib ketishga chidamli sanoat klemma bloki.",
    description_ru: "Силовые винтовые клеммные колодки 4P на ток 60А-100А.",
    description_en: "Barrier terminal block 4-pole 60A/100A for industrial control panels.",
    specs: { "Kuchlanish": "600 V", "Qutblar": "4P", "Tok": "60A - 100A", "Ulanish": "Vintli qisqich" }
  },

  // 6. GIP Ventilyatsiya
  {
    id: 29,
    name: "GIP Havo Tortuvchi Ventilyator 12W 100mm (Silver / Gold / Black / Gray)",
    name_ru: "Вытяжной вентилятор GIP 12W 100мм (Silver, Gold, Black, Gray)",
    name_en: "Exhaust Fan GIP 12W 100mm Multi-Color",
    slug: "gip-havo-tortuvchi-ventilyator-12w-100mm",
    category: "ventilyatsiya",
    categoryName: "GIP Havo tortgich va Ventilyatsiya",
    categoryName_ru: "Вентиляторы GIP",
    categoryName_en: "Ventilation & Extractors",
    brand: "GIP",
    usdPrice: 6.2,
    wholesaleUsdPrice: 5.2,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/LPVO44XkggAKppK-9Qv0FQtxuQENL_hKJviE7Vj_hPWUhzyTGS9vMiu0Pfo1ICfx95D-VtJA6FzZkFTg1eCBmOXl6A8PPdn6Kb6oPjGZzTCK3B8Z022994qr-ULR7BF_xGXS7o8oUUnutqAyJSF1PiK4Dt6XqSW0jwDeBbJK1-g7DJVpJNesDTjKy_zoXSVvDoNOyqv1NIW6NA4lOoOBHzvh8vpn8dCyQPfyZ5DAtwHQlul9hTUB2-ODgirVhQN0LlfcVFPca99FkkwL7H0evLMCjjLILjE0RFE7KQ6UJIQGahAVGRq7WyEyHVvdplIbY1DUbn2AJCkDWZHwoyyb4Q.jpg",
    description: "Hammom, oshxona va hojatxona uchun mo'ljallangan shovqinsiz GIP ventilyatori. 4 xil zamonaviy rang (kumush, tilla, qora, kulrang). 40 000 soat xizmat muddati, 5 YIL KAFOLAT.",
    description_ru: "Бесшумный вытяжной вентилятор GIP 100мм с премиальным дизайном в 4 цветах. Гарантия 5 лет.",
    description_en: "Silent domestic extractor fan GIP 12W 100mm in 4 premium metallic colors with 5-year warranty.",
    specs: { "Quvvat": "12 W", "Diametr": "100 mm", "Ranglar": "Silver / Gold / Black / Gray", "Kafolat": "5 yil rasmiy" }
  },
  {
    id: 30,
    name: "GIP Professional Kanal Ventilyatori 100mm (250–300 m³/soat)",
    name_ru: "Канальный вентилятор GIP Профессиональный 100мм",
    name_en: "Duct Inline Extractor Fan GIP Professional 100mm",
    slug: "gip-professional-kanal-ventilyatori-100mm",
    category: "ventilyatsiya",
    categoryName: "GIP Havo tortgich va Ventilyatsiya",
    categoryName_ru: "Вентиляторы GIP",
    categoryName_en: "Ventilation & Extractors",
    brand: "GIP",
    usdPrice: 16,
    wholesaleUsdPrice: 13.5,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/DB7fTfqg_psOhFeHpGWtcsJmC9-vmhitz_05i6ya8hpQMrXHZAR0ZZZekH5sCEfn2JhcYZb1yTPVVN7yduHO3Q7tbqglzw80loE0coLReBIJ2odG5o3kc58SbweRQ8vxRf36yab0IzR9dEkkZOJ4p6SMVXcdbRWWCIzhBMi8gy3X4_Og6183AJwdcyB5-qb_ArioJ-_zTAeOgoqMHg_8UoiOkWZV2AfkqpvzqQBw1OSjLGxmNte2AocrgObxQy1vMX09g9wb74V4eDCGrhbMCKdwmIV_YYNClnpjx0Ui28SoqeKkZktziA1mN74_NzjeYmlWxRuViWa3NJti1WcO9A",
    description: "OPTOM ELEKTRO dan yangilik: Ikki tomonlama rezina muhrli ulanish tizimiga ega GIP kanal ventilyatori. 250–300 m³/soat havo almashinuvi, 5 yil rasmiy kafolat.",
    description_ru: "Профессиональный канальный вентилятор GIP 100мм высокой производительности 300 м3/ч.",
    description_en: "High-performance inline duct fan GIP 100mm, 300 m3/h airflow, 5-year warranty.",
    specs: { "Diametr": "100 mm", "Unumdorlik": "250–300 m³/soat", "Muhr": "Ikki tomonlama rezina", "Kafolat": "5 yil" }
  },
  {
    id: 31,
    name: "GIP Yopiq Panel Dizayndagi Xona Ventilyatori 12W 100mm",
    name_ru: "Вентилятор вытяжной GIP с закрытой панелью 12W 100мм",
    name_en: "Cover-Panel Design Extractor Fan GIP 12W 100mm",
    slug: "gip-yopiq-panel-ventilyator-12w",
    category: "ventilyatsiya",
    categoryName: "GIP Havo tortgich va Ventilyatsiya",
    categoryName_ru: "Вентиляторы GIP",
    categoryName_en: "Ventilation & Extractors",
    brand: "GIP",
    usdPrice: 5.4,
    wholesaleUsdPrice: 4.5,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/EOsf4Mo6EUjx1eE3UB64eupFUahumN3WM0Zy5W_XDSOJe5vc51jR6w7sDYVnI5gbUxoVNgYKbwlcqX2Kh8-PlSME0T406bOlMSInWZI9fLB22GPX4g4S8BQjD5KbkRyXP7pXlfjb-8wcP_Q7X8fDQ0tsX2D6QB_7nOc2yX1laXmifDRJswRlJRdfJzCFbbQGjkVdWYvOEitMVpc3g23UhoE0q9iUpw9SrOV7ZtJiNQXN_DIwkK5rhd7Pjiy7J3JtLXr4h1C1XisYMs95VjaY80hyzyhyaWTufIXCv4-QFBC-K8jk6X6v98NVKh4kgkqSy8IdxHL2reuCckGxhdMxNw.jpg",
    description: "Yopiq zamonaviy old panelga ega GIP ventilyatori. Panjara ko'rinmaydi, xona devorida chiroyli va toza turadi. Shovqinsiz 40 000 soat motor.",
    description_ru: "Дизайнерский вытяжной вентилятор с закрытой лицевой панелью.",
    description_en: "Sleek flat-face design bathroom exhaust fan GIP 100mm.",
    specs: { "Panel": "Yopiq silliq panel", "Quvvat": "12 W", "Diametr": "100 mm", "Kafolat": "5 yil" }
  },

  // 7. Voltmetr, Ampermetr & Datchiklar
  {
    id: 32,
    name: "LUX VOLT Raqamli Voltmetr AD16-22DSV (Kalta korpus Ø22mm)",
    name_ru: "Вольтметр цифровой щитовой LUX VOLT AD16-22DSV",
    name_en: "Digital Panel Voltmeter LUX VOLT AD16-22DSV",
    slug: "lux-volt-voltmetr-ad16-22dsv",
    category: "olchov-datchik",
    categoryName: "Voltmetr, Ampermetr va Datchiklar",
    categoryName_ru: "Вольтметры и датчики",
    categoryName_en: "Meters & Sensors",
    brand: "LUX VOLT",
    usdPrice: 0.6,
    wholesaleUsdPrice: 0.48,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/v-PvVxV-E-JsyVsiHQwxOsNjbQqBrlpWOAtgLQLk7eIkgOmAjDCtPWS_BPZiTP8CgvMiZH7fONr-BLWCn-BY6fKxJiZDP0-6fDFZmiOM_lQmGXlVRsbypd6dbGd6nAG7-cUOBnjJCtDvID_YdSaRtehgk9mfn4Ubj_5q02xE0sPQS_-sfAw8puN1ND8h18Vd6rVsM7V04MjkpJof-O-vF1URDAe-FDU2lnGKdK4fTYhskzrKT0GmFNA3nVPiXFYmrws-owicXoRnO0loN8jiamtiHl3rFd8MX0S22x4mSrnOUK3Xr73X-np_twl6kwsf7mxOnO8mKMw8Xr_RNY9nsw.jpg",
    description: "Elektr panellarda tarmoq kuchlanishini (60V–500V) real vaqtda ko'rsatuvchi kalta o'lchamli LED raqamli voltmetr. Qizil, sariq, yashil ranglarda.",
    description_ru: "Компактный светодиодный индикатор напряжения AC 60-500V на 22мм.",
    description_en: "Compact LED digital panel voltmeter AD16-22DSV 60V-500V AC.",
    specs: { "Diapazon": "AC 60V – 500V", "Diametr": "Ø22 mm", "Aniqlik": "±1%", "Ranglar": "Qizil / Sariq / Yashil" }
  },
  {
    id: 33,
    name: "LUX VOLT Raqamli Volt/Ampermetr AD16-22DVA (2-in-1)",
    name_ru: "Вольт-амперметр цифровой LUX VOLT AD16-22DVA",
    name_en: "Digital Dual Volt-Ammeter LUX VOLT AD16-22DVA",
    slug: "lux-volt-ampermetr-ad16-22dva",
    category: "olchov-datchik",
    categoryName: "Voltmetr, Ampermetr va Datchiklar",
    categoryName_ru: "Вольтметры и датчики",
    categoryName_en: "Meters & Sensors",
    brand: "LUX VOLT",
    usdPrice: 1.2,
    wholesaleUsdPrice: 0.98,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/K08-79_PTV6NPGZeDf_sJneMXKYIGELtP_SUVph-X-vkrxvY6zLkfY6TQG81e4FGDOfF6Qay_CfqEQP-bQrrEQmqR6lsqrjTO-PV_57QKdAQc-ro8PMU-B9ajRt-Vzl9K1DwCXC2V80N9h8kNv37-vtpn7hN3QAwo_mB7httqgln9m9DII_JvvaAjGR1UbgkF4cbXEzafC0B4prEKfGn3EICSK-KYXVoO6srPE1DIrLjeqIHcWVjCANDVxHWtY-2hXmQZsAsg5_4aMoYo2Ykkq2ZnDZHbBerpHy2lpE5cRqbV7MAsFwnbOw34uasTjpOFu5Q33UZkPGlK7oQ02Mh4Q.jpg",
    description: "Bir vaqtning o'zida ham kuchlanish (V), ham tok kuchini (A) aniq ko'rsatuvchi 2-in-1 raqamli panel indikatori. Qizil, sariq, yashil LED.",
    description_ru: "Комбинированный цифровой индикатор напряжения и тока с трансформатором тока.",
    description_en: "Dual digital display voltmeter & ammeter with current sensor ring.",
    specs: { "Kuchlanish": "AC 60–500 V", "Tok": "0–100 A", "Diametr": "Ø22 mm", "LED": "2 qatorli" }
  },
  {
    id: 34,
    name: "LUX VOLT ST41AR 2-Kanallik Infraqizil Harakat Sensori",
    name_ru: "Датчик движения инфракрасный 2-канальный LUX VOLT ST41AR",
    name_en: "Dual-Channel PIR Presence Sensor LUX VOLT ST41AR",
    slug: "lux-volt-st41ar-harakat-sensori",
    category: "olchov-datchik",
    categoryName: "Voltmetr, Ampermetr va Datchiklar",
    categoryName_ru: "Вольтметры и датчики",
    categoryName_en: "Meters & Sensors",
    brand: "LUX VOLT",
    usdPrice: 15,
    wholesaleUsdPrice: 12.8,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/oo9iwEOcU1jBme_CV6_JFRmphU138ni51TLKu4VkyPttM4M7rY1UGt55bFJebHlw1T8Ur3-HsHesMv13F-cXl_7m2rvJSBB6HCe35KB1QGgVX5Q5VFPl5YoMDOj9ALAF-SHr5P4QKMG9yLcHHSUJsuZD-W6_yeNDZgd-WxhxVisWDxQkjgRPIhsAT1hfvmA-RXjUzqp1jFC2ayIjJJ5hDcl2xd7SD8HzgrY0x7nv98_-9_Ldi4ENWeNTVBobF27mPj-u9yRFjbvnJn9_AkEsJt4keAwGMzKjnjs-dpirxCmqGFr1J2U32enrew9maCgEJWfck-hUQx1LACOJyzzGyw",
    description: "360° qamrovli 2 kanallik datchik: bir vaqtda chiroq va ventilyatorni alohida vaqt oralig'ida boshqaradi (TIME 1 va TIME 2). 2–8 m aniqlash masofasi, 3–2000 Lux sozlama.",
    description_ru: "Потолочный 2-канальный датчик присутствия 360 градусов для света и вытяжки.",
    description_en: "Dual-channel 360° ceiling presence motion sensor for lighting and ventilation.",
    specs: { "Burchak": "360°", "Masofa": "2–8 metr", "Kanallar": "2 ta mustaqil", "Kafolat": "1 yil" }
  },
  {
    id: 35,
    name: "DIN-Reyka Raqamli Indikatori LUX VOLT 1V / 1A / VAHz",
    name_ru: "Модульный индикатор на DIN-рейку LUX VOLT (Вольт/Ампер/Герц)",
    name_en: "DIN-Rail Modular Digital Indicator LUX VOLT VAHz",
    slug: "din-reyka-indikator-lux-volt-vahz",
    category: "olchov-datchik",
    categoryName: "Voltmetr, Ampermetr va Datchiklar",
    categoryName_ru: "Вольтметры и датчики",
    categoryName_en: "Meters & Sensors",
    brand: "LUX VOLT",
    usdPrice: 4,
    wholesaleUsdPrice: 3.2,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/utyMG6skkT7MbcB95rF4jW_HCBD8yvqnuhRTXdr0qOlNx9rEznRzmWXrE_-nATemz3opIz6S7POWH5nBqK-V5fXXBgcoDgJgHvIb_4maeIPZq1aaCuHLrLz4xzlDSprDiV1FlMx7HBFU9NwkeKyslU203BxVyFSELHWqIp8IoFcDDTxU_-CGi0zcIWePjkCYHvS7qoTzjmyDwd8TZYAMtdZbK0jav3RI1pDO8vTQQT3elCIuSOmOv_getSquPLpIftmOReY1RLvKSUlQpQxJGXa9LltrughyfeUcqxKnpeQn2tCUAvvJ6UPO9_A_rGZVgFNNj4miLt3k5mIg4jPG1A.jpg",
    description: "Modulli DIN-reykaga o'rnatiladigan raqamli indikator. Kuchlanish (V), tok (A) va chastotani (Hz) real vaqtda ko'rsatadi.",
    description_ru: "Модульный щитовой вольт-амперметр частотомер на DIN рейку.",
    description_en: "Modular DIN rail multifunction digital meter for Volt, Current & Frequency.",
    specs: { "Displey": "Yorqin LED", "Parametrlar": "Volt / Amper / Hertz", "Montaj": "Standart DIN-reyka" }
  },

  // 8. Zazemleniye & Montaj materiallari
  {
    id: 36,
    name: "Mis Qoplamali Yerlatgich Shtiri (Заземление) 1.5m x Ø14mm",
    name_ru: "Штырь заземления омедненный 1.5м x Ø14мм",
    name_en: "Copper-Bonded Earth Grounding Rod 1.5m x 14mm",
    slug: "mis-qoplamali-yerlatgich-1-5m-14mm",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление и монтаж",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 7,
    wholesaleUsdPrice: 5.8,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/Aodw8eJJA09pNEXuiLvM-5QRywPywXak4MgoUwNyXsK4m6RDAJNYYEnjjY8k1egHSaCIdOoS7v4AiyRcen5q08OoSaM0i4ssqTd5_oqeyD8yWt5yaA7y8hwFMq9p5U5-9g95u4zQ529eXDIPM9UgnWUD0i5dKLiu8h2sKVszhHyBrn63_5_JDB1nTQhav7oy_cAP_YmYGk0jF6bq72tzUuRS7eZgc7qZ6HqcPcVNuSNvynfBCAun0L0X4mBJ3Pd9XWNb_UDBZ3bNA5k5WHajt2dnA3QqEy71ybmyfy5jUrRVb3zW2ZwHwVMlnPmBmwXVFFWrbBNR3mHo6S4Z7ILT1g.jpg",
    description: "Optom Elektro omborida: to'liq qalin mis qoplamali yerlatgich shtiri (zazemleniye). Korroziyaga o'ta chidamli, elektr o'tkazuvchanligi yuqori. Uzunligi 1.5 metr, diametri 14 mm.",
    description_ru: "Омедненный стержень заземления 1.5 метра диаметром 14мм с высокой коррозионной стойкостью.",
    description_en: "Copper-bonded steel ground rod 1.5m x 14mm for lightning and electrical earthing.",
    specs: { "Uzunligi": "1.5 metr", "Diametri": "Ø 14 mm", "Qoplama": "Elektrolitik qalin mis", "Xizmat muddati": "30 yil" }
  },
  {
    id: 37,
    name: "Mis Qoplamali Yerlatgich Shtiri (Заземление) 1.5m x Ø16mm",
    name_ru: "Штырь заземления омедненный 1.5м x Ø16мм",
    name_en: "Copper-Bonded Earth Grounding Rod 1.5m x 16mm",
    slug: "mis-qoplamali-yerlatgich-1-5m-16mm",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление и монтаж",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 8,
    wholesaleUsdPrice: 6.8,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/Aodw8eJJA09pNEXuiLvM-5QRywPywXak4MgoUwNyXsK4m6RDAJNYYEnjjY8k1egHSaCIdOoS7v4AiyRcen5q08OoSaM0i4ssqTd5_oqeyD8yWt5yaA7y8hwFMq9p5U5-9g95u4zQ529eXDIPM9UgnWUD0i5dKLiu8h2sKVszhHyBrn63_5_JDB1nTQhav7oy_cAP_YmYGk0jF6bq72tzUuRS7eZgc7qZ6HqcPcVNuSNvynfBCAun0L0X4mBJ3Pd9XWNb_UDBZ3bNA5k5WHajt2dnA3QqEy71ybmyfy5jUrRVb3zW2ZwHwVMlnPmBmwXVFFWrbBNR3mHo6S4Z7ILT1g.jpg",
    description: "Katta obyektlar va kuchli yerlatish konturi uchun 16 mm qalinlikdagi mis qoplamali zazemleniye shtiri.",
    description_ru: "Усиленный штырь заземления 16 мм с медным покрытием.",
    description_en: "Heavy-duty 16mm copper clad ground rod 1.5m.",
    specs: { "Uzunligi": "1.5 metr", "Diametri": "Ø 16 mm", "Qoplama": "Mis", "Xizmat muddati": "30 yil" }
  },
  {
    id: 38,
    name: "LUX VOLT Avtonom Yong'in O'chirish Aerozoli (Shchitlar uchun)",
    name_ru: "Автономный огнетушащий аэрозоль LUX VOLT для щитов",
    name_en: "Automatic Fire Extinguishing Aerosol LUX VOLT for Panels",
    slug: "lux-volt-avtonom-yongin-ochirish-aerozoli",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление и монтаж",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 4,
    wholesaleUsdPrice: 3.2,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/FYIGOCgfczRTqidxsuWM_vZ8-3jZxz7_3cYYy5Q0Zjykaa8isf3UAtnhpD9YKofcnFUxnYCi-9cJUTf83cYo-J0fu7-w1UeuYEY8xmohNZyjAoxzQv6m1CRG4JXyTOoLzL-4vvzv39EhK3Zl83V8EiInSqHJpz29rqz7IcjM3AL-NeBk5OwufPqpsxzIclN-iZWjgi08UJGDmY1wM194qyJeDAwWEsfr9N3vlFbkU7AZiu7aNxrF62MWr0QeBZxKq9O_dAxO9k6khCMOkOVI2ntDTOAWcP_h7-BKRdeqp7cJjugv1QTQ94ybTrqxM4j22FPNoLZdRrM5ykUuz1taKA",
    description: "Elektr shchitlari ichiga o'rnatiladigan avtonom yong'in o'chiruvchi aerozol. 170°C haroratda 6 soniyada avtomatik ishga tushib, alangani darhol bartaraf qiladi. Xizmat muddati: 10 yil.",
    description_ru: "Автономная система пожаротушения для электрощитов, срабатывает при 170°C за 6 секунд.",
    description_en: "Self-activating fire extinguishing thermal generator for electrical enclosures.",
    specs: { "Ishga tushish": "170°C", "Faollashuv": "6 soniya", "Himoya hajmi": "0.2 m³", "Xizmat muddati": "10 yil" }
  },
  {
    id: 39,
    name: "LUX VOLT DIN-Reyka Elektro Rozetka 16A",
    name_ru: "Розетка на DIN-рейку 16A LUX VOLT",
    name_en: "DIN-Rail Electrical Socket 16A LUX VOLT",
    slug: "lux-volt-din-reyka-rozetka-16a",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление и монтаж",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 0.9,
    wholesaleUsdPrice: 0.75,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/NUHdL33JE6zDbDfGpU-luwBbnqVExC45IriHz6ICDVzv35O8yVoKSF7HBkDtl16f83MMWyc4EaQCA4vXwy7Wm6zoHMwgLg9v5ltqVcAp7urCiLRwSFq1C3r2OSncvel8JB-jafVIvjpeKr2u_sMHDRLmlykEVqTdIGW1D2GUJGL_HjGHhqIpNVpcA0czhUN3LEZ5CRRr-YzZiYYtFKBHfFXLRzmDYM2XtsC2MIgane9sIZuPDcV4URvvsMKEr53ZuwrR_HlDPRHdgsW4H0RPpXVcQlrS5U7uuq0ikBoTkg0RmlOUBPBWFJWl4S4lkNgkze_lt99eXFzTn2whfZmX0A.jpg",
    description: "Elektr shchiti ichiga o'rnatiladigan standart 16A DIN-reyka rozetkasi. Yerlatish kontaktiga ega, servis va asboblarni ulash uchun qulay.",
    description_ru: "Модульная розетка 16А с заземлением для монтажа в распределительный щит.",
    description_en: "Modular socket outlet 16A with grounding for DIN rail mounting inside panels.",
    specs: { "Tok": "16 A", "Kuchlanish": "250 V", "Montaj": "DIN-reyka", "Yerlatish": "Mavjud" }
  },
  {
    id: 40,
    name: "LUX VOLT IP-Himoya Qopqoqli DIN-Reyka Rozetka 16A",
    name_ru: "Розетка на DIN-рейку с защитной крышкой IP LUX VOLT 16A",
    name_en: "Weatherproof Covered DIN-Rail Socket 16A LUX VOLT",
    slug: "lux-volt-qopqoqli-din-rozetka-16a",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление и монтаж",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 1.8,
    wholesaleUsdPrice: 1.5,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/B0EBlQSFqUel9eQWv3XcCIgWKqJB3p8sQGpSYQj7E-NfT_yH040gDsu9ZGtoA-bBwr5zimuWF5U05Nw5R6mKOG3DLeoazXHVmgN0_lJ9TbVv1tTpWnogdYpDkwoOdoMmfiwH-E45He8SQvR_rUI4M1Edz8eNN7iFWwC-5W8ZOym3S5_k85yipst3yhDCevNU3czGZl7hYHpbi0c0nczI9WnRHRoilAbR40Sm12Xy-MR8GiShD1-OdLI3OJedFmymi4eXmS1_NWdH_o-AaN0Bp2TytoHbkwa__06YyysDys1dnXNiyKngkGbJ8oD546WQMp4wHkmjGdisGUKtSEjnNA.jpg",
    description: "Himoya qopqog'iga ega bo'lgan DIN-reyka rozetkasi. Namlik va changdan himoyalaydi, ochiq yoki nam joylardagi shchitlar uchun ideal.",
    description_ru: "Щитовая розетка 16А с откидной защитной крышкой.",
    description_en: "Protective hinged cover DIN rail socket 16A for damp environments.",
    specs: { "Himoya": "Qopqoqli", "Tok": "16 A", "Kuchlanish": "250 V", "Montaj": "DIN-reyka" }
  },
  {
    id: 41,
    name: "Oq Neylon Xomutlar (Styajkalar) 200 x 3.6 mm (100 dona)",
    name_ru: "Стяжки кабельные белые нейлоновые 200 x 3.6 мм (100 шт)",
    name_en: "White Nylon Cable Ties 200 x 3.6 mm (Pack of 100)",
    slug: "oq-neylon-xomutlar-200x3-6",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление и монтаж",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 0.38,
    wholesaleUsdPrice: 0.30,
    unit: "paket",
    photoUrl: "https://cdn4.telesco.pe/file/kuNymTTA0BZGxC3Ni070ZtwzGlwfW76BTxFrwXjPFZLGBrbK6dm39NP_rWTWUEwDS2W_CjlauerAkoS8OLXdFfZ0lyHGeLOx0E2kyS7Ny6ypz32qcr8YJjhFdMKopX8cBFGug0857Lbl2kRNce72amnxhEWk9Xivh12KUPPz8kS7DdbfQ5awHw0QOF7OoDN9CbevW4viokMLddq1OM1a6_7AthzdjZn7sGv1Rz5HXcQbIBp06TXXopuKMd6bTUi5vpO9I_7RSwDts8MsMNWptpb4M-wbRn1P0D8ly-ybAeFq1rwC3uBe9IbqUdomAiFugNdIY1VUAdgFje9__USwsg.jpg",
    description: "Yuqori sifatli oq neylon kabel xomutlari (styajkalar). Mustahkam, egiluvchan, uzilmaydi. Qadoqda 100 dona.",
    description_ru: "Кабельные нейлоновые хомуты (стяжки) 200х3.6мм белые, упаковка 100шт.",
    description_en: "High tensile strength white nylon cable zip ties 200 x 3.6 mm (100 pcs).",
    specs: { "O'lchami": "200 x 3.6 mm", "Miqdori": "100 dona / paket", "Material": "Neylon 66", "Harorat": "-40°C dan +85°C gacha" }
  },
  {
    id: 42,
    name: "Kabellarni O'rnatish Maydonchasi (Площадка под хомут)",
    name_ru: "Площадка монтажная под дюбель-хомут для кабеля",
    name_en: "Cable Tie Mounting Base Cradle (Pack of 100)",
    slug: "kabel-ornatish-maydonchasi-ploshadka",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление va Montaj",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 1.5,
    wholesaleUsdPrice: 1.2,
    unit: "paket",
    photoUrl: "https://cdn4.telesco.pe/file/Erqp_Ye0CsWr5_vXFUi0dLNQ5IXSbeL6YM3GPrJjP5yrBWHzurC3DEEGaEwuY_9hRaq3GPvzwh7RuhRSQaRlmu4ae0HRwO184cnGizsFFyg-uzeccljqTpDNpe28Ip6ZAiQhwD2uwua2WfP3EPluvr39oJSGlLvZIbSY4G5Q43bi_cKHa7H17JnwH7F0-s3qV_WklOqCicJPwpZq0PYNszX0hOrXbbD3FJZBGxII9K4iNLr6vPdTLeBgayVD_R2uqDGqyMD_DQRt4NGHowItmfp4PR0_qvVxc-P5YxPTvsrhgnQ8Jq2gAHFbLX8SUqY2g4zcx5nKWaDWvoWvcL6rwg.jpg",
    description: "Gaz pistoleti va dyubel orqali o'rnatiladigan professional kabel maydonchasi (ploshadka). Zarbga chidamli, qadoqda 100 dona.",
    description_ru: "Площадки под кабельные хомуты для прямого монтажа газовым пистолетом.",
    description_en: "Cable tie mounting cradle blocks for direct nail gun and screw fixing (100 pcs).",
    specs: { "Qadoqda": "100 dona", "O'rnatish": "Gaz pistoleti yoki dyubel", "Harorat": "-50°C dan +50°C", "Material": "Zarbga chidamli plastik" }
  },
  {
    id: 43,
    name: "Sink Qoplangan DIN-Reyka 1-Metr x 35mm Standart",
    name_ru: "DIN-рейка оцинкованная 1 метр x 35мм",
    name_en: "Galvanized Steel DIN Rail 1 Meter x 35mm",
    slug: "sink-qoplangan-din-reyka-1m",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление va Montaj",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 0.7,
    wholesaleUsdPrice: 0.55,
    unit: "metr",
    photoUrl: "https://cdn4.telesco.pe/file/HVph0I_dG1mlC_Ib9xILsDkxLV_z0Vw7UG9fOwrY31PLVKGDswb71DaCCu1zk6l7fjT9rO5-m_kz59A9Nhf0CRg_ACltPW_jGN5g6t5EcBGZ97Cehijag8PLCY24zJDaJPaOi_fetTwcGIY4nKkfqjIFhVwazKT1Aw-Fkeoa-I08lFTjesKYNpvpQnAEcECIr_QhkOOpId-EhhkruMR8qOAt-do4zU9cbt7vc-NaBgEEk8kNYZWi-cKqn_srsEHr-KzlAaZhrHq0thxsnD2rmBWyP38Jmvu2poY_0x94x-XGia_NPUJzzteyDmGllXZ-7rglMjWXB4jX0Wr4w7tCdg.jpg",
    description: "1 mm qalinlikdagi yuqori sifatli sinklangan standart 35 mm DIN-reyka. Uzunligi 1 metr, barcha modul avtomat va shinalar uchun mos.",
    description_ru: "Профильная оцинкованная перфорированная DIN-рейка 35x7.5мм длиной 1м.",
    description_en: "Standard slotted galvanized zinc-plated DIN mounting rail 35mm x 1m.",
    specs: { "Uzunligi": "1 metr", "Kengligi": "35 mm", "Qalinligi": "1.0 mm", "Qoplama": "Oq sink" }
  },
  {
    id: 44,
    name: "DIN-Reyka Uchun Metall va Plastik Stoper (Фиксатор)",
    name_ru: "Ограничитель фиксатор на DIN-рейку (Металл / Пластик)",
    name_en: "End Stop Bracket Clamp for DIN Rail (Metal & Plastic)",
    slug: "din-reyka-stoper-fiksator",
    category: "montaj-xavfsizlik",
    categoryName: "Yerlatgich (Zazemleniye) va Montaj",
    categoryName_ru: "Заземление va Montaj",
    categoryName_en: "Grounding & Installation",
    brand: "LUX VOLT",
    usdPrice: 0.08,
    wholesaleUsdPrice: 0.06,
    unit: "dona",
    photoUrl: "https://cdn4.telesco.pe/file/GQxLKV9UbIeXaNi8CiwS_VUiF421hO-CENTToUc97uVlgmY_k8tyDeog_VmVQeirR3JRymKYhfrYTOdBZ5T9skQD4wyMgg6FFIMtss8YBKdQpoN2yggwMMsMrpHstSQ-n6v26e7b7nEjFML9cm6ng8oKLSrLmIFdc3m8BwnNfv7Czr20836tslSwQa94J9uoACkKm6SfLQJu_jcCigFmPv-orra0qxpA73Aq5KcqMuulhLpJ6k8_JtJKX6JuAR_CtBM-OwWalCZp1YqkL4roqQgjItpW4JbtwIEqESRch9NJnfiUPWeFs5_1nbDCA94m-u2iQQG7CD7lwrklrirzlA.jpg",
    description: "DIN reykadagi avtomat, klemma, kontaktor va relelarni sirg'alib ketmasligi uchun mustahkam ushlab turuvchi chetki fiksator (stoper).",
    description_ru: "Концевой стопор-фиксатор для модульного оборудования на рейке.",
    description_en: "Heavy-duty end clamp terminal stop bracket for DIN rail mounting.",
    specs: { "Material": "Metall / Plastik", "Vazifasi": "Avtomatlarni surilishdan to'xtatish", "Montaj": "Vintli qisqich" }
  }
];

async function main() {
  console.log(`Starting authentic catalog generation: ${RAW_PRODUCTS.length} products...`);
  
  const imgDir = path.join(__dirname, '..', 'public', 'images', 'products');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

  const finalProducts = [];

  for (let i = 0; i < RAW_PRODUCTS.length; i++) {
    const p = RAW_PRODUCTS[i];
    const imageFilename = `tg_${p.slug}.jpg`;
    const imagePathOnDisk = path.join(imgDir, imageFilename);
    const publicImagePath = `/images/products/${imageFilename}`;

    console.log(`[${i+1}/${RAW_PRODUCTS.length}] Downloading photo for: ${p.name.slice(0, 45)}...`);
    try {
      if (!fs.existsSync(imagePathOnDisk)) {
        await downloadImage(p.photoUrl, imagePathOnDisk);
      }
    } catch (err) {
      console.warn(`Failed image for ${p.slug}:`, err.message);
    }

    // Convert USD to rounded UZS
    const retailPriceUzs = Math.round((p.usdPrice * UZS_RATE) / 500) * 500;
    const wholesalePriceUzs = Math.round((p.wholesaleUsdPrice * UZS_RATE) / 500) * 500;
    const oldPriceUzs = Math.round((retailPriceUzs * 1.15) / 500) * 500;

    finalProducts.push({
      id: p.id,
      name: p.name,
      name_ru: p.name_ru,
      name_en: p.name_en,
      slug: p.slug,
      category: p.category,
      categoryName: p.categoryName,
      categoryName_ru: p.categoryName_ru,
      categoryName_en: p.categoryName_en,
      brand: p.brand,
      price: retailPriceUzs,
      oldPrice: oldPriceUzs,
      wholesalePrice: wholesalePriceUzs,
      minWholesaleQty: p.usdPrice < 2 ? 20 : (p.usdPrice < 10 ? 10 : 3),
      stock: Math.floor(120 + Math.random() * 380),
      unit: p.unit,
      image: publicImagePath,
      description: p.description,
      description_ru: p.description_ru,
      description_en: p.description_en,
      specs: p.specs,
      specs_ru: p.specs,
      specs_en: p.specs,
      rating: 4.9,
      reviewsCount: Math.floor(18 + Math.random() * 45),
      isFeatured: i < 8,
      isPopular: i % 2 === 0
    });
  }

  // Update server/data/db.json
  const dbJsonPath = path.join(__dirname, '..', 'server', 'data', 'db.json');
  let currentDb = { orders: [], settings: {} };
  if (fs.existsSync(dbJsonPath)) {
    try {
      currentDb = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
    } catch (_) {}
  }

  currentDb.categories = REAL_CATEGORIES;
  currentDb.products = finalProducts;
  if (!currentDb.settings || !currentDb.settings.siteName) {
    currentDb.settings = {
      siteName: "OptomElektro",
      phone: "+998 95 009-09-09",
      email: "info@optomelektro.uz",
      address: "Toshkent sh., Chuqursoy Savdo Markazi, 1-183 do'kon (Jomiy bozori)",
      workingHours: "Dush - Shan: 08:30 - 18:30",
      deliveryCost: 30000,
      freeDeliveryMin: 1000000,
      wholesaleMinAmount: 2000000,
      telegramBotToken: "9284355717:AAF8eLuWBibzGe6Oq4en1PbgiZ5ogHguYao",
      telegramChatId: "8038275900",
      adminUsername: "foden",
      adminPassword: "usmon47"
    };
  }

  fs.writeFileSync(dbJsonPath, JSON.stringify(currentDb, null, 2), 'utf8');
  console.log(`Saved ${finalProducts.length} authentic products to server/data/db.json!`);

  // Update server/db.js
  const dbJsPath = path.join(__dirname, '..', 'server', 'db.js');
  let dbJs = fs.readFileSync(dbJsPath, 'utf8');

  // Replace INITIAL_CATEGORIES
  const catRegex = /const INITIAL_CATEGORIES = \[[\s\S]*?\];\r?\n\r?\nconst INITIAL_PRODUCTS/;
  if (catRegex.test(dbJs)) {
    dbJs = dbJs.replace(catRegex, `const INITIAL_CATEGORIES = ${JSON.stringify(REAL_CATEGORIES, null, 2)};\n\nconst INITIAL_PRODUCTS`);
  }

  // Replace INITIAL_PRODUCTS
  const prodRegex = /const INITIAL_PRODUCTS = \[[\s\S]*?\];\r?\n\r?\nconst INITIAL_SETTINGS/;
  if (prodRegex.test(dbJs)) {
    dbJs = dbJs.replace(prodRegex, `const INITIAL_PRODUCTS = ${JSON.stringify(finalProducts, null, 2)};\n\nconst INITIAL_SETTINGS`);
  }

  fs.writeFileSync(dbJsPath, dbJs, 'utf8');
  console.log(`Updated INITIAL_CATEGORIES & INITIAL_PRODUCTS in server/db.js!`);
}

main().catch(console.error);
