const fs = require('fs');
let info = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');

info = info.replace(/{KENAPA.map\(\(k\) => \(/g, '{KENAPA.map((k) => {\n                const Icon = k.icon;\n                return (');
info = info.replace(/<k\.icon/g, '<Icon');
info = info.replace(/<\/div>\n              \)\)}/g, '</div>\n                );\n              })}');
fs.writeFileSync('components/home/InfoSections.tsx', info);
