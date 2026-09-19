const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

layout = layout.replace('<link rel="preload" as="image" href="/images/promo-wifi-rumah-koneksi-pasti.webp" fetchPriority="high" />', 
  `<link 
    rel="preload" 
    as="image" 
    imagesrcset="/images/promo-wifi-rumah-koneksi-pasti-mobile.webp 500w, /images/promo-wifi-rumah-koneksi-pasti.webp 1080w"
    imagesizes="(max-width: 768px) 500px, 1080px"
    fetchPriority="high" 
  />`);

fs.writeFileSync('app/layout.tsx', layout);
