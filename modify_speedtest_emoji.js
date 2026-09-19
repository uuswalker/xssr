const fs = require('fs');

let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

code = code.replace(/Ngebut [\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]* cukup/gu, 'Sangat Cepat — cukup');
code = code.replace(/Lancar [\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]* cukup/gu, 'Lancar — cukup');
code = code.replace(/Pas-pasan [\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]* browsing/gu, 'Pas-pasan — browsing');
code = code.replace(/Lemot untuk standar 2026 [\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]* waktunya/gu, 'Lambat — waktunya');
code = code.replace(/Hasil bagikan [\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}➔]* jalankan/gu, 'Hasil dibagikan — jalankan');
code = code.replace(/Link Tersalin! Pamer [\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]*/gu, 'Link Tersalin!');

fs.writeFileSync('components/tools/Speedtest.tsx', code);
