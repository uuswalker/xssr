const fs = require('fs');

// Fix Layout imageSrcSet
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
layout = layout.replace(/imagesrcset/g, 'imageSrcSet');
layout = layout.replace(/imagesizes/g, 'imageSizes');
fs.writeFileSync('app/layout.tsx', layout);

// Fix Header duplicate attributes
let header = fs.readFileSync('components/Header.tsx', 'utf8');
header = header.replace(/className="btn-wa-header btn-cek-lokasi-trigger"[\s\S]*?className="btn-wa-header btn-cek-lokasi-trigger hover-glow"/, 'className="btn-wa-header btn-cek-lokasi-trigger hover-glow"');
fs.writeFileSync('components/Header.tsx', header);
