const sharp = require('sharp');
const path = require('path');

async function createExtraBanners() {
  const bannerWidth = 1200;
  const bannerHeight = 460;

  // Banner 1: Optom Chegirmalar
  const svgOptom = `
    <svg width="${bannerWidth}" height="${bannerHeight}" viewBox="0 0 ${bannerWidth} ${bannerHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="optomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0047AB"/>
          <stop offset="60%" stop-color="#0066FF"/>
          <stop offset="100%" stop-color="#00D2FF"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="${bannerWidth}" height="${bannerHeight}" fill="url(#optomGrad)" rx="24"/>
      
      <!-- Decorative circles -->
      <circle cx="1050" cy="120" r="260" fill="#FFFFFF" fill-opacity="0.08"/>
      <circle cx="950" cy="380" r="180" fill="#FFFFFF" fill-opacity="0.05"/>
      <circle cx="120" cy="400" r="140" fill="#FFFFFF" fill-opacity="0.06"/>
      
      <!-- Badge -->
      <rect x="80" y="70" width="220" height="38" rx="19" fill="#FFFFFF" fill-opacity="0.2"/>
      <text x="190" y="95" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">⚡ OPTOM NARXDA XARID</text>
      
      <!-- Headline -->
      <text x="80" y="165" font-family="Arial, sans-serif" font-size="44" font-weight="900" fill="#FFFFFF">KATTA QURILISHLAR VA USTALARGA</text>
      <text x="80" y="225" font-family="Arial, sans-serif" font-size="40" font-weight="800" fill="#FEF08A">MAXSUS OPTOM SHARTLAR</text>
      
      <!-- Subtitle -->
      <text x="80" y="280" font-family="Arial, sans-serif" font-size="20" fill="#E0F2FE">To'g'ridan-to'g'ri zavod narxlarida • QQS bilan to'lov • O'zbekiston bo'ylab yetkazish</text>
      
      <!-- Feature Pills -->
      <rect x="80" y="325" width="220" height="48" rx="12" fill="#FFFFFF"/>
      <text x="190" y="356" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0066FF" text-anchor="middle">🔥 -15% gacha chegirma</text>
      
      <rect x="320" y="325" width="230" height="48" rx="12" fill="#FFFFFF" fill-opacity="0.2"/>
      <text x="435" y="356" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">📦 100+ dona olinganda</text>
      
      <!-- Visual Graphic on Right -->
      <g transform="translate(850, 100)" filter="url(#shadow)">
        <rect x="0" y="0" width="240" height="250" rx="20" fill="#FFFFFF"/>
        <circle cx="120" cy="80" r="45" fill="#EFF6FF"/>
        <path d="M 120 50 L 100 90 L 125 90 L 115 120 L 140 75 L 120 75 Z" fill="#0066FF"/>
        <text x="120" y="160" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#0F172A" text-anchor="middle">OPTOM ELEKTRO</text>
        <text x="120" y="185" font-family="Arial, sans-serif" font-size="14" fill="#64748B" text-anchor="middle">Eng ishonchli ta'minotchi</text>
        <rect x="40" y="205" width="160" height="32" rx="16" fill="#10B981"/>
        <text x="120" y="226" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SERTIFIKATLANGAN</text>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svgOptom))
    .png()
    .toFile(path.join(__dirname, '../public/images/banner_optom.png'));

  console.log('Extra promo banner created successfully!');
}

createExtraBanners().catch(console.error);

