import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Ensure directories exist
fs.mkdirSync('assets', { recursive: true });
fs.mkdirSync('public', { recursive: true });
fs.mkdirSync('public/assets', { recursive: true });

// SVG for CorbiQ Calculator App Icon (512x512 standard)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <!-- Google Color Gradients -->
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4285F4" />
      <stop offset="100%" stop-color="#1A73E8" />
    </linearGradient>

    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EA4335" />
      <stop offset="100%" stop-color="#D93025" />
    </linearGradient>

    <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBC04" />
      <stop offset="100%" stop-color="#F29900" />
    </linearGradient>

    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34A853" />
      <stop offset="100%" stop-color="#1E8E3E" />
    </linearGradient>

    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E2638" />
      <stop offset="100%" stop-color="#151C28" />
    </linearGradient>

    <!-- Subtle Shadows -->
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="keyGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#4285F4" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Base Squircle Card with Google elevation -->
  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#bgGrad)" stroke="#334155" stroke-width="6" />

  <!-- Inner Calculator Body Frame -->
  <rect x="68" y="68" width="376" height="376" rx="64" fill="#182234" stroke="#2A3850" stroke-width="3" />

  <!-- Display Screen / Pill with calculation & corbiQ logo branding -->
  <rect x="96" y="96" width="320" height="92" rx="30" fill="url(#screenGrad)" stroke="#2F3E58" stroke-width="2" />
  
  <!-- Mini Google Accent Bar above screen -->
  <g transform="translate(116, 114)">
    <circle cx="8" cy="8" r="5" fill="#4285F4" />
    <circle cx="28" cy="8" r="5" fill="#EA4335" />
    <circle cx="48" cy="8" r="5" fill="#FBBC04" />
    <circle cx="68" cy="8" r="5" fill="#34A853" />
  </g>

  <!-- Screen Content: CorbiQ "Q" symbol + digital digits -->
  <text x="390" y="156" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-weight="700" font-size="38" fill="#E2E8F0" text-anchor="end" letter-spacing="2">
    corbi<tspan fill="#4285F4">Q</tspan>
  </text>

  <!-- Calculator Keypad Grid (Google Material 3 Styled circular/pill keys) -->
  <!-- Row 1: Function Keys -->
  <!-- C key (Red accent) -->
  <rect x="96" y="210" width="68" height="60" rx="24" fill="#33242A" stroke="#EA4335" stroke-width="2" />
  <text x="130" y="248" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#EA4335" text-anchor="middle">AC</text>

  <!-- ( ) key -->
  <rect x="180" y="210" width="68" height="60" rx="24" fill="#243048" />
  <text x="214" y="248" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="24" fill="#93C5FD" text-anchor="middle">( )</text>

  <!-- % key -->
  <rect x="264" y="210" width="68" height="60" rx="24" fill="#243048" />
  <text x="298" y="248" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="24" fill="#93C5FD" text-anchor="middle">%</text>

  <!-- ÷ key (Yellow accent) -->
  <rect x="348" y="210" width="68" height="60" rx="24" fill="#38301D" stroke="#FBBC04" stroke-width="2" />
  <text x="382" y="248" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="28" fill="#FBBC04" text-anchor="middle">÷</text>

  <!-- Row 2: Keys -->
  <!-- 7 -->
  <rect x="96" y="286" width="68" height="60" rx="24" fill="#1E2A3E" />
  <text x="130" y="324" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#F1F5F9" text-anchor="middle">7</text>

  <!-- 8 -->
  <rect x="180" y="286" width="68" height="60" rx="24" fill="#1E2A3E" />
  <text x="214" y="324" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#F1F5F9" text-anchor="middle">8</text>

  <!-- 9 -->
  <rect x="264" y="286" width="68" height="60" rx="24" fill="#1E2A3E" />
  <text x="298" y="324" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#F1F5F9" text-anchor="middle">9</text>

  <!-- × key (Blue accent) -->
  <rect x="348" y="286" width="68" height="60" rx="24" fill="#1E2E4E" stroke="#4285F4" stroke-width="2" />
  <text x="382" y="324" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="28" fill="#4285F4" text-anchor="middle">×</text>

  <!-- Row 3: Prominent Q + Equal Key -->
  <!-- 0 key -->
  <rect x="96" y="362" width="68" height="60" rx="24" fill="#1E2A3E" />
  <text x="130" y="400" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#F1F5F9" text-anchor="middle">0</text>

  <!-- . key -->
  <rect x="180" y="362" width="68" height="60" rx="24" fill="#1E2A3E" />
  <text x="214" y="400" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="28" fill="#F1F5F9" text-anchor="middle">.</text>

  <!-- Signature Google Green '=' Action Key with Elevated Design & 'Q' touch -->
  <g filter="url(#dropShadow)">
    <rect x="264" y="362" width="152" height="60" rx="30" fill="url(#greenGrad)" />
    <!-- Dynamic "=" with glowing elegance -->
    <path d="M 324 384 L 356 384 M 324 398 L 356 398" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" />
  </g>
</svg>`;

// Maskable Icon SVG (with 15% safe zone padding as per PWA skill)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="mBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4285F4" />
      <stop offset="100%" stop-color="#1A73E8" />
    </linearGradient>
    <linearGradient id="mGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34A853" />
      <stop offset="100%" stop-color="#1E8E3E" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect x="0" y="0" width="512" height="512" fill="url(#mBgGrad)" />

  <!-- Safe-zone scaled content (center 80%) -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <rect x="24" y="24" width="464" height="464" rx="90" fill="#182234" stroke="#334155" stroke-width="4" />
    <rect x="68" y="76" width="376" height="96" rx="28" fill="#131B28" stroke="#2F3E58" stroke-width="2" />
    
    <g transform="translate(88, 92)">
      <circle cx="8" cy="8" r="5" fill="#4285F4" />
      <circle cx="28" cy="8" r="5" fill="#EA4335" />
      <circle cx="48" cy="8" r="5" fill="#FBBC04" />
      <circle cx="68" cy="8" r="5" fill="#34A853" />
    </g>
    <text x="414" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-weight="700" font-size="36" fill="#FFFFFF" text-anchor="end">
      corbi<tspan fill="#4285F4">Q</tspan>
    </text>

    <!-- Keypad grid -->
    <rect x="68" y="200" width="76" height="66" rx="22" fill="#33242A" stroke="#EA4335" stroke-width="2" />
    <text x="106" y="242" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#EA4335" text-anchor="middle">AC</text>

    <rect x="168" y="200" width="76" height="66" rx="22" fill="#243048" />
    <text x="206" y="242" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="24" fill="#93C5FD" text-anchor="middle">( )</text>

    <rect x="268" y="200" width="76" height="66" rx="22" fill="#243048" />
    <text x="306" y="242" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="24" fill="#93C5FD" text-anchor="middle">%</text>

    <rect x="368" y="200" width="76" height="66" rx="22" fill="#38301D" stroke="#FBBC04" stroke-width="2" />
    <text x="406" y="242" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="28" fill="#FBBC04" text-anchor="middle">÷</text>

    <rect x="68" y="286" width="76" height="66" rx="22" fill="#1E2A3E" />
    <text x="106" y="328" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#FFFFFF" text-anchor="middle">7</text>

    <rect x="168" y="286" width="76" height="66" rx="22" fill="#1E2A3E" />
    <text x="206" y="328" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#FFFFFF" text-anchor="middle">8</text>

    <rect x="268" y="286" width="76" height="66" rx="22" fill="#1E2A3E" />
    <text x="306" y="328" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#FFFFFF" text-anchor="middle">9</text>

    <rect x="368" y="286" width="76" height="66" rx="22" fill="#1E2E4E" stroke="#4285F4" stroke-width="2" />
    <text x="406" y="328" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="28" fill="#4285F4" text-anchor="middle">×</text>

    <rect x="68" y="372" width="76" height="66" rx="22" fill="#1E2A3E" />
    <text x="106" y="414" font-family="'Google Sans', Roboto, sans-serif" font-weight="600" font-size="26" fill="#FFFFFF" text-anchor="middle">0</text>

    <rect x="168" y="372" width="76" height="66" rx="22" fill="#1E2A3E" />
    <text x="206" y="414" font-family="'Google Sans', Roboto, sans-serif" font-weight="700" font-size="28" fill="#FFFFFF" text-anchor="middle">.</text>

    <rect x="268" y="372" width="176" height="66" rx="33" fill="url(#mGreenGrad)" />
    <path d="M 338 396 L 374 396 M 338 412 L 374 412" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" />
  </g>
</svg>`;

async function generate() {
  const logoBuffer = Buffer.from(logoSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // Save SVGs
  fs.writeFileSync('public/icon.svg', logoSvg);
  fs.writeFileSync('public/favicon.svg', logoSvg);

  // Generate assets/logo.png (512x512) - as specifically requested by user!
  await sharp(logoBuffer)
    .resize(512, 512)
    .png()
    .toFile('assets/logo.png');
  console.log('Created assets/logo.png');

  // Also duplicate in public/assets/logo.png for static web serving
  await sharp(logoBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/assets/logo.png');
  console.log('Created public/assets/logo.png');

  // Generate standard PWA icons
  await sharp(logoBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Created public/pwa-192x192.png');

  await sharp(logoBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Created public/pwa-512x512.png');

  // Generate Maskable icon
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Created public/pwa-maskable-512x512.png');

  // Apple Touch Icon (180x180)
  await sharp(logoBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Created public/apple-touch-icon.png');

  // Favicon (48x48 PNG)
  await sharp(logoBuffer)
    .resize(48, 48)
    .png()
    .toFile('public/favicon.ico');
  console.log('Created public/favicon.ico');
}

generate().catch(console.error);
