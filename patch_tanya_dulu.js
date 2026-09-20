const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let original = code;

  // Replacements
  code = code.replace(/> Chat WA/g, '> Tanya Dulu');
  code = code.replace(/small = "Konsultasi Gratis"/g, 'small = "Tanya Dulu"');
  code = code.replace(/Tanya Admin Solo/g, 'Tanya Dulu');
  code = code.replace(/Tanya Admin Sukoharjo/g, 'Tanya Dulu');
  code = code.replace(/Tanya Admin Karanganyar/g, 'Tanya Dulu');
  code = code.replace(/Tanya Admin Klaten/g, 'Tanya Dulu');
  code = code.replace(/Tanya Admin Boyolali/g, 'Tanya Dulu');
  code = code.replace(/Tanya Admin Surakarta/g, 'Tanya Dulu');
  code = code.replace(/Konsultasi Gratis/g, 'Tanya Dulu');
  code = code.replace(/Chat Admin Sekarang/g, 'Tanya Dulu');
  
  // Header and StickyMobileBar
  // Already caught by "> Chat WA" or we can be specific
  code = code.replace(/>\s*Chat WA\s*<\/a>/g, '> Tanya Dulu</a>');
  code = code.replace(/>\s*Chat WA\s*/g, '> Tanya Dulu ');

  if (code !== original) {
    fs.writeFileSync(filePath, code);
    console.log('Patched:', filePath);
  }
}

const dirsToScan = ['app', 'components', 'lib'];

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
console.log('Finished "Tanya Dulu" replacements');
