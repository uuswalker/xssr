const fs = require('fs');

let header = fs.readFileSync('components/Header.tsx', 'utf8');

header = header.replace(/<motion\.button[\s\S]*?type="button"/, '<button type="button"');
header = header.replace(/className="btn-wa-header btn-cek-lokasi-trigger"/, 'className="btn-wa-header btn-cek-lokasi-trigger hover-glow"');

fs.writeFileSync('components/Header.tsx', header);
