const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');
code = code.replace(
  'import CekLokasi from "@/components/CekLokasi";', 
  'import CekLokasi from "@/components/CekLokasi";\nimport StickyMobileBar from "@/components/StickyMobileBar";'
);
code = code.replace(
  '<ConsentBanner />',
  '<ConsentBanner />\n        <StickyMobileBar />'
);
fs.writeFileSync('app/layout.tsx', code);
