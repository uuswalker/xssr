const fs = require('fs');

let content = fs.readFileSync('lib/artikel.ts', 'utf8');

const target = `  keywords: ["xl satu vs indihome solo", "xl satu vs myrepublic", "perbandingan provider wifi solo", "wifi terbaik solo raya", "xl satu vs biznet"],`;

const replacement = `  keywords: ["xl satu vs indihome solo", "xl satu vs myrepublic", "perbandingan provider wifi solo", "wifi terbaik solo raya", "xl satu vs biznet"],
  ogTitle: "XL SATU vs IndiHome & MyRepublic di Solo: Mana yang Terbaik?",
  ogDescription: "Bingung pilih XL SATU, IndiHome, atau MyRepublic di Solo Raya? Cek perbandingan harga, FUP, dan keunggulan masing-masing provider internet rumah di tahun 2026.",
  ogImage: "https://xlsatusolo.com/og.jpg",
  schemas: [],`;

content = content.replace(target, replacement);
fs.writeFileSync('lib/artikel.ts', content);
console.log('Patched');
