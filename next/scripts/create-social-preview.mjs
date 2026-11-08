import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const backgroundPath = path.join(publicDir, 'voxbridge/social-share-background.png');
const emblemPath = path.join(publicDir, 'voxbridge/icon-detailed-white-transparent-v2.png');

const variations = [
  {
    locale: 'en',
    headline: ['Choose your path.', 'Then your language.'],
    offer: 'ENGLISH + FRENCH',
    location: "M'SILA, ALGERIA",
    alt: 'Voxbridge Language School in M\'Sila, with English and French courses',
    rtl: false,
  },
  {
    locale: 'fr',
    headline: ['Choisissez votre voie.', 'Puis votre langue.'],
    offer: 'ANGLAIS + FRANÇAIS',
    location: "M'SILA, ALGÉRIE",
    alt: 'Voxbridge Language School à M\'Sila, cours d’anglais et de français',
    rtl: false,
  },
  {
    locale: 'ar',
    headline: ['اختر مسارك.', 'ثم لغتك.'],
    offer: 'الإنجليزية والفرنسية',
    location: 'المسيلة، الجزائر',
    alt: 'فوكس بريدج مدرسة لغات في المسيلة، الإنجليزية والفرنسية',
    rtl: true,
  },
];

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

for (const item of variations) {
  const arabic = item.rtl;
  const anchor = arabic ? 'end' : 'start';
  const x = 72;
  const [line1, line2] = item.headline.map(escapeXml);
  const offer = escapeXml(item.offer);
  const location = escapeXml(item.location);

  const overlay = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stop-color="#650900" stop-opacity=".60" />
          <stop offset=".53" stop-color="#790b00" stop-opacity=".38" />
          <stop offset=".76" stop-color="#790b00" stop-opacity=".06" />
          <stop offset="1" stop-color="#790b00" stop-opacity="0" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-20%" width="120%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dy="2" />
          <feComponentTransfer><feFuncA type="linear" slope=".24" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)" />
      <g fill="#fff" font-family="Cairo, Arial, sans-serif" filter="url(#softShadow)">
        <text x="164" y="76" font-size="28" font-weight="800">Voxbridge</text>
        <text x="164" y="105" font-size="28" font-weight="800">Language</text>
        <text x="164" y="134" font-size="28" font-weight="800">School.</text>
        <text x="${x}" y="270" text-anchor="${anchor}" direction="${arabic ? 'rtl' : 'ltr'}" font-size="${arabic ? '52' : '58'}" font-weight="900">${line1}</text>
        <text x="${x}" y="342" text-anchor="${anchor}" direction="${arabic ? 'rtl' : 'ltr'}" font-size="${arabic ? '52' : '58'}" font-weight="900">${line2}</text>
      </g>
      <rect x="72" y="414" width="394" height="52" rx="26" fill="#fff4e7" fill-opacity=".97" />
      <text x="269" y="448" text-anchor="middle" direction="${arabic ? 'rtl' : 'ltr'}" font-family="Cairo, Arial, sans-serif" font-size="19" font-weight="800" letter-spacing="${arabic ? '0' : '.6'}" fill="#9c1007">${offer}</text>
      <text x="72" y="522" font-family="Cairo, Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="1.2" fill="#fff">${location}</text>
      <rect x="72" y="548" width="48" height="4" rx="2" fill="#fff4e7" />
    </svg>
  `);

  const icon = await sharp(emblemPath).resize(76, 76).png().toBuffer();
  const out = path.join(publicDir, `og-image-${item.locale}.png`);
  await sharp(backgroundPath)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: icon, left: 72, top: 43 },
    ])
    .png()
    .toFile(out);
}

await sharp(path.join(publicDir, 'og-image-en.png')).toFile(path.join(publicDir, 'og-image.png'));
console.log('Created localized 1200x630 Open Graph and Twitter images in next/public/.');
