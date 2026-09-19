const fs = require('fs');

let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');
code = code.replace(/Pas-pasan.*browsing/g, 'Pas-pasan — browsing');
fs.writeFileSync('components/tools/Speedtest.tsx', code);

// Kuis.tsx
let kuis = fs.readFileSync('components/tools/Kuis.tsx', 'utf8');
kuis = kuis.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}➔]/gu, '');
fs.writeFileSync('components/tools/Kuis.tsx', kuis);

// Kalkulator.tsx
let kalk = fs.readFileSync('components/tools/Kalkulator.tsx', 'utf8');
kalk = kalk.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}➔]/gu, '');
fs.writeFileSync('components/tools/Kalkulator.tsx', kalk);

// alat.ts
let alat = fs.readFileSync('lib/alat.ts', 'utf8');
alat = alat.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}➔✓]/gu, '');
fs.writeFileSync('lib/alat.ts', alat);

// CekLokasi.tsx
let cek = fs.readFileSync('components/CekLokasi.tsx', 'utf8');
cek = cek.replace(/✓/gu, '');
fs.writeFileSync('components/CekLokasi.tsx', cek);

