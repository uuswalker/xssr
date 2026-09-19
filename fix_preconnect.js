const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

layout = layout.replace('<link rel="preconnect" href="https://ipwho.is" />', '<link rel="preconnect" href="https://ipwho.is" crossOrigin="anonymous" />');

fs.writeFileSync('app/layout.tsx', layout);
