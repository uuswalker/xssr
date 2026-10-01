const fs = require('fs');
const content = fs.readFileSync('lib/artikel.ts', 'utf8');
const slugs = [
  'wifi-tanpa-fup-unlimited',
  'kecepatan-wifi-ideal-keluarga',
  'berapa-mbps-untuk-berapa-orang',
  'internet-rakyat-vs-xl-satu'
];

slugs.forEach(slug => {
  const start = content.indexOf(`ARTIKEL["${slug}"]`);
  if (start === -1) {
    console.log(`${slug} NOT FOUND`);
    return;
  }
  const next = content.indexOf(`ARTIKEL["`, start + 20);
  const end = next !== -1 ? next : content.length;
  fs.writeFileSync(`temp_${slug}.txt`, content.substring(start, end));
});
