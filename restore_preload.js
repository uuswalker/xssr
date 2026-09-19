const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

if (!layout.includes('rel="preload" as="image" href="/images/promo-wifi-rumah-koneksi-pasti.webp"')) {
  layout = layout.replace('<link rel="preconnect" href="https://ipwho.is" crossOrigin="anonymous" />', '<link rel="preload" as="image" href="/images/promo-wifi-rumah-koneksi-pasti.webp" fetchPriority="high" />\n        <link rel="preconnect" href="https://ipwho.is" crossOrigin="anonymous" />');
}

fs.writeFileSync('app/layout.tsx', layout);
