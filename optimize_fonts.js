const fs = require('fs');

// 1. Update layout.tsx
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

if (!layout.includes('next/font/google')) {
  layout = layout.replace(
    'import "./globals.css";',
    `import { Plus_Jakarta_Sans } from "next/font/google";\nimport "./globals.css";\n\nconst jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-jakarta" });`
  );
  
  layout = layout.replace(
    '<html lang="id">',
    '<html lang="id" className={jakarta.variable}>'
  );
  
  fs.writeFileSync('app/layout.tsx', layout);
  console.log('layout.tsx updated');
}

// 2. Update globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(
  '@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");',
  ''
);

css = css.replace(
  "font-family: 'Plus Jakarta Sans', sans-serif;",
  "font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;"
);

fs.writeFileSync('app/globals.css', css);
console.log('globals.css updated');
