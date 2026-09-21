const fs = require('fs');
let code = fs.readFileSync('app/layout.tsx', 'utf8');

code = code.replace(
  'const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-jakarta" });\n',
  ''
);

code = code.replace(
  'export const metadata: Metadata = {',
  'const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-jakarta" });\n\nexport const metadata: Metadata = {'
);

fs.writeFileSync('app/layout.tsx', code);
console.log('Fixed import order');
