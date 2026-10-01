const fs = require('fs');
const content = fs.readFileSync('lib/artikel.ts', 'utf8');
const start = content.indexOf('ARTIKEL["penyebab-wifi-lemot-cara-mengatasi"]');
console.log(content.substring(start, start + 1000));
