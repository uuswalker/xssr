const fs = require('fs');

const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let original = code;

  // Replacements
  code = code.replace(/Chat Sales Solo/g, 'Tanya Admin Solo');
  code = code.replace(/Chat Sales Sukoharjo/g, 'Tanya Admin Sukoharjo');
  code = code.replace(/Chat Sales Karanganyar/g, 'Tanya Admin Karanganyar');
  code = code.replace(/Chat Sales Klaten/g, 'Tanya Admin Klaten');
  code = code.replace(/Chat Sales Boyolali/g, 'Tanya Admin Boyolali');
  code = code.replace(/Chat Sales Surakarta/g, 'Tanya Admin Surakarta');
  
  code = code.replace(/Dikelola sales resmi/g, 'Dikelola agen resmi');
  code = code.replace(/sales lokal kami/g, 'tim support lokal kami');
  code = code.replace(/Tim sales XL SATU/g, 'Tim support XL SATU');
  code = code.replace(/Hubungi Sales/g, 'Konsultasi Gratis');
  code = code.replace(/Chat Sales Sekarang/g, 'Chat Admin Sekarang');
  code = code.replace(/tanyakan.*?promo.*?ke sales/g, 'tanyakan promo yang sedang berlaku ke admin');
  code = code.replace(/tanyakan.*biaya.*ke sales/g, 'tanyakan biaya instalasi dan promo ke admin');
  code = code.replace(/respons sales/g, 'kecepatan respons support');
  code = code.replace(/sales resmi/gi, 'agen resmi'); // Catch all remaining

  if (code !== original) {
    fs.writeFileSync(filePath, code);
    console.log('Patched:', filePath);
  }
}

const dirsToScan = [
  'app',
  'components',
  'lib'
];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

dirsToScan.forEach(scanDir);
console.log('Finished text replacements');
