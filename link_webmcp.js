const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
layout = layout.replace(/<link rel="manifest"/, '<link rel="webmcp" href="/webmcp.json" />\n        <link rel="manifest"');
fs.writeFileSync('app/layout.tsx', layout);
