const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

code = code.replace(
  'export default function Home() {',
  `import { preload } from "react-dom";\n\nexport default function Home() {\n  preload("/images/promo-wifi-rumah-koneksi-pasti-mobile.webp", {\n    as: "image",\n    imageSrcSet: "/images/promo-wifi-rumah-koneksi-pasti-mobile.webp 500w, /images/promo-wifi-rumah-koneksi-pasti.webp 1080w",\n    imageSizes: "(max-width: 768px) 500px, 1080px",\n    fetchPriority: "high",\n  });`
);

fs.writeFileSync('app/page.tsx', code);
