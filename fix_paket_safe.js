const fs = require('fs');

let content = fs.readFileSync('lib/paket.ts', 'utf8');

content = content.replace(/XL Satu Spark - 300 Mbps/g, 'XL Satu Spark — 300 Mbps');
content = content.replace(/XL Satu Spark - 500 Mbps/g, 'XL Satu Spark — 500 Mbps');

fs.writeFileSync('lib/paket.ts', content);
console.log('Fixed paket.ts safely');
