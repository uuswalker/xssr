const fs = require('fs');
let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');
code = code.replace("width: \\`\\${progress}%\\`", "width: `${progress}%`");
fs.writeFileSync('components/tools/Speedtest.tsx', code);
