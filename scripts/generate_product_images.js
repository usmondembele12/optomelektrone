const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const products = [
  {
    name: 'avtomat-1p',
    title: 'LUX VOLT 1P 16A',
    sub: 'Circuit Breaker C16',
    color1: '#0066FF',
    color2: '#0047AB',
    iconType: 'breaker'
  },
  {
    name: 'avtomat-3p',
    title: 'LUX VOLT 3P 63A',
    sub: 'Three-Phase Breaker',
    color1: '#0066FF',
    color2: '#1E3A8A',
    iconType: 'breaker3'
  },
  {
    name: 'uzo-schneider',
    title: 'Schneider Easy9 UZO',
    sub: 'Residual Current 30mA',
    color1: '#059669',
    color2: '#047857',
    iconType: 'uzo'
  },
  {
    name: 'kabel-vvg',
    title: 'Kabel VVG-P-ng 3x2.5',
    sub: 'Andijon Mis Kabel',
    color1: '#DC2626',
    color2: '#991B1B',
    iconType: 'cable'
  },
  {
    name: 'kabel-sip',
    title: 'SIP-4 2x16 mm²',
    sub: 'O\'z-Kabel Havo Liniyasi',
    color1: '#374151',
    color2: '#1F2937',
    iconType: 'sip'
  },
  {
    name: 'kontaktor-chint',
    title: 'CHINT NXC-40 40A',
    sub: 'Magnit Kontaktor 220V',
    color1: '#D97706',
    color2: '#B45309',
    iconType: 'contactor'
  },
  {
    name: 'shchit-metal',
    title: 'LUX VOLT Shchit IP54',
    sub: '24 Modul Metall Boks',
    color1: '#475569',
    color2: '#334155',
    iconType: 'panel'
  },
  {
    name: 'boks-plastik',
    title: 'LUX VOLT Boks IP65',
    sub: '12 Modul Germetik',
    color1: '#0284C7',
    color2: '#0369A1',
    iconType: 'box'
  },
  {
    name: 'zubr-rele',
    title: 'ZUBR D2-40 Red',
    sub: 'Kuchlanish Himoya Relesi',
    color1: '#E11D48',
    color2: '#BE123C',
    iconType: 'relay'
  },
  {
    name: 'led-100w',
    title: 'LUX VOLT LED 100W',
    sub: 'Sanoat Projektori IP66',
    color1: '#2563EB',
    color2: '#1D4ED8',
    iconType: 'floodlight'
  },
  {
    name: 'led-200w',
    title: 'LUX VOLT LED 200W',
    sub: 'Super Bright 6500K',
    color1: '#3B82F6',
    color2: '#1E40AF',
    iconType: 'floodlight2'
  },
  {
    name: 'rozetka-sanoat',
    title: 'Sanoat Rozetkasi 32A',
    sub: 'IEK IP44 3P+N+E 380V',
    color1: '#EF4444',
    color2: '#B91C1C',
    iconType: 'socket'
  },
  {
    name: 'stabilizator-10kva',
    title: 'LUX VOLT 10 kVA',
    sub: 'Kuchlanish Stabilizatori',
    color1: '#0F172A',
    color2: '#1E293B',
    iconType: 'stabilizer'
  },
  {
    name: 'multimetr-unit',
    title: 'UNI-T UT33D+',
    sub: 'Professional Multimetr',
    color1: '#EA580C',
    color2: '#C2410C',
    iconType: 'meter'
  }
];

function getIconSvg(type) {
  switch (type) {
    case 'breaker':
      return `
        <rect x="180" y="80" width="120" height="200" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4"/>
        <rect x="200" y="110" width="80" height="60" rx="8" fill="#F1F5F9"/>
        <rect x="225" y="125" width="30" height="30" rx="4" fill="#0066FF"/>
        <line x1="240" y1="50" x2="240" y2="80" stroke="#94A3B8" stroke-width="8" stroke-linecap="round"/>
        <line x1="240" y1="280" x2="240" y2="310" stroke="#94A3B8" stroke-width="8" stroke-linecap="round"/>
        <text x="240" y="210" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0F172A" text-anchor="middle">C16</text>
        <text x="240" y="235" font-family="Arial, sans-serif" font-size="12" fill="#64748B" text-anchor="middle">230V~ 4500A</text>
      `;
    case 'breaker3':
      return `
        <rect x="140" y="80" width="200" height="200" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4"/>
        <rect x="160" y="110" width="160" height="60" rx="8" fill="#F1F5F9"/>
        <rect x="175" y="125" width="35" height="30" rx="4" fill="#0066FF"/>
        <rect x="222" y="125" width="35" height="30" rx="4" fill="#0066FF"/>
        <rect x="270" y="125" width="35" height="30" rx="4" fill="#0066FF"/>
        <rect x="175" y="138" width="130" height="6" fill="#1E40AF"/>
        <text x="240" y="210" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0F172A" text-anchor="middle">3P 63A</text>
        <text x="240" y="235" font-family="Arial, sans-serif" font-size="12" fill="#64748B" text-anchor="middle">400V~ 6000A</text>
      `;
    case 'cable':
      return `
        <circle cx="240" cy="180" r="110" fill="none" stroke="#1E293B" stroke-width="24"/>
        <circle cx="240" cy="180" r="85" fill="none" stroke="#DC2626" stroke-width="16"/>
        <circle cx="240" cy="180" r="62" fill="none" stroke="#2563EB" stroke-width="14"/>
        <circle cx="240" cy="180" r="42" fill="none" stroke="#EAB308" stroke-width="12"/>
        <circle cx="240" cy="180" r="18" fill="#F8FAFC"/>
        <path d="M 280 90 L 350 50" stroke="#B45309" stroke-width="10" stroke-linecap="round"/>
        <path d="M 270 95 L 340 55" stroke="#B45309" stroke-width="8" stroke-linecap="round"/>
      `;
    case 'panel':
      return `
        <rect x="150" y="70" width="180" height="220" rx="14" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4"/>
        <rect x="170" y="90" width="140" height="80" rx="6" fill="#CBD5E1"/>
        <rect x="170" y="190" width="140" height="80" rx="6" fill="#CBD5E1"/>
        <circle cx="310" cy="180" r="7" fill="#475569"/>
        <rect x="180" y="110" width="120" height="40" rx="4" fill="#FFFFFF"/>
        <rect x="180" y="210" width="120" height="40" rx="4" fill="#FFFFFF"/>
      `;
    case 'floodlight':
    case 'floodlight2':
      return `
        <rect x="140" y="90" width="200" height="150" rx="12" fill="#1E293B" stroke="#0066FF" stroke-width="4"/>
        <rect x="160" y="110" width="160" height="110" rx="8" fill="#F8FAFC"/>
        <circle cx="240" cy="165" r="40" fill="#FEF08A"/>
        <circle cx="240" cy="165" r="28" fill="#FDE047"/>
        <polygon points="120,240 140,240 130,290" fill="#64748B"/>
        <polygon points="360,240 340,240 350,290" fill="#64748B"/>
        <line x1="130" y1="290" x2="350" y2="290" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      `;
    default:
      return `
        <rect x="160" y="90" width="160" height="180" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="4"/>
        <circle cx="240" cy="160" r="45" fill="#EFF6FF"/>
        <path d="M 240 130 L 225 165 L 245 165 L 235 195 L 255 155 L 240 155 Z" fill="#0066FF"/>
        <rect x="180" y="225" width="120" height="18" rx="4" fill="#E2E8F0"/>
      `;
  }
}

async function generateAll() {
  for (const item of products) {
    const icon = getIconSvg(item.iconType);
    const svg = `
      <svg width="480" height="360" viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F8FAFC"/>
            <stop offset="100%" stop-color="#EDF2F7"/>
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.08"/>
          </filter>
        </defs>
        <rect width="480" height="360" fill="url(#bg)"/>
        
        <!-- subtle grid -->
        <circle cx="240" cy="180" r="130" fill="#FFFFFF" opacity="0.8" filter="url(#cardShadow)"/>
        
        <!-- product visual -->
        <g id="visual">
          ${icon}
        </g>
        
        <!-- brand badge -->
        <rect x="24" y="24" width="105" height="28" rx="6" fill="#0066FF" fill-opacity="0.1"/>
        <text x="76" y="43" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0066FF" text-anchor="middle">OPTOM ELEKTRO</text>
        
        <!-- quality tag -->
        <rect x="370" y="24" width="86" height="28" rx="6" fill="#10B981" fill-opacity="0.1"/>
        <text x="413" y="43" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#059669" text-anchor="middle">✓ KAFOLAT</text>
      </svg>
    `;

    const outPath = path.join(__dirname, '../public/images/products', `${item.name}.png`);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outPath);
  }
  console.log('All product images generated successfully!');
}

generateAll().catch(console.error);

