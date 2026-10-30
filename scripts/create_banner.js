const sharp = require('sharp');
const fs = require('fs');

async function buildBanner() {
  const banner = sharp('public/images/banner_raw.jpg');
  const bannerMeta = await banner.metadata();

  // Resize luxvolt logo cleanly
  const luxResized = await sharp('public/images/luxvolt_clean.png')
    .resize({ width: 330, height: 95, fit: 'inside' })
    .toBuffer();
  const luxResizedMeta = await sharp(luxResized).metadata();

  // Patch covers x: 0 to 440, y: 0 to 122
  const patchSvg = Buffer.from(`
    <svg width="${bannerMeta.width}" height="${bannerMeta.height}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#edf4ff" stop-opacity="0.99"/>
          <stop offset="50%" stop-color="#f5f9ff" stop-opacity="0.99"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.98"/>
        </linearGradient>
      </defs>
      <polygon points="0,0 438,0 395,124 0,124" fill="url(#bgGrad)"/>
      <line x1="438" y1="0" x2="395" y2="124" stroke="#0066FF" stroke-width="2.5" stroke-opacity="0.45"/>
    </svg>
  `);

  const topOffset = Math.max(12, Math.round((124 - luxResizedMeta.height) / 2));
  const leftOffset = Math.max(25, Math.round((400 - luxResizedMeta.width) / 2));

  await sharp('public/images/banner_raw.jpg')
    .composite([
      { input: patchSvg, top: 0, left: 0 },
      { input: luxResized, top: topOffset, left: leftOffset }
    ])
    .png()
    .toFile('public/images/banner.png');

  console.log('Banner created successfully at public/images/banner.png');
}

buildBanner().catch(console.error);
