const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

layout = layout.replace(/<head>/, '<head>\n        <link rel="webmcp" id="webmcp" href="/webmcp.json" />');

fs.writeFileSync('app/layout.tsx', layout);
