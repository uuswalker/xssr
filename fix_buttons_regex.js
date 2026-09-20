const fs = require('fs');

const replaceInFile = (file, targetRegex, replacement) => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    if (targetRegex.test(code)) {
      code = code.replace(targetRegex, replacement);
      fs.writeFileSync(file, code);
      console.log(`Patched ${file}`);
    } else {
      console.log(`Missed ${file}`);
    }
  }
};

replaceInFile(
  'components/home/InfoSections.tsx',
  /display:\s*"inline-block",\s*background:\s*"var\(--green-light\)",/g,
  `display: "inline-flex", alignItems: "center", gap: 8, background: "var(--green-light)",`
);

replaceInFile(
  'components/kota/KotaSections.tsx',
  /display:\s*"inline-block",\s*background:\s*"#fff",/g,
  `display: "inline-flex", alignItems: "center", gap: 8, background: "#fff",`
);

replaceInFile(
  'components/kota/KotaSections.tsx',
  /<MapIcon size=\{24\} color="var\(--green\)" \/>/g,
  `<MapIcon size={24} color="var(--green)" style={{ flexShrink: 0 }} />`
);

replaceInFile(
  'components/kota/KotaSections.tsx',
  /display:\s*"inline-block",\s*width:\s*"auto",\s*padding:\s*"14px 32px",/g,
  `display: "inline-flex", alignItems: "center", gap: 8, width: "auto", padding: "14px 32px",`
);

replaceInFile(
  'components/kota/KotaSections.tsx',
  /<MapPin size=\{18\} \/>\s*Cek Ketersediaan/g,
  `<MapPin size={18} style={{ flexShrink: 0 }} />\n            Cek Ketersediaan`
);

replaceInFile(
  'components/home/Hero.tsx',
  /display:\s*"inline-block",\s*width:\s*"auto",\s*padding:\s*"14px 32px",/g,
  `display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, width: "auto", padding: "14px 32px",`
);
