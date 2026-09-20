const fs = require('fs');

const replaceInFile = (file, target, replacement) => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    if (code.includes(target)) {
      code = code.replace(target, replacement);
      fs.writeFileSync(file, code);
      console.log(`Patched ${file}`);
    }
  }
};

// 1. InfoSections.tsx
replaceInFile(
  'components/home/InfoSections.tsx',
  `                display: "inline-block",\n                background: "var(--green-light)",`,
  `                display: "inline-flex",\n                alignItems: "center",\n                gap: 8,\n                background: "var(--green-light)",`
);

// 2. KotaSections.tsx (Lihat Cakupan Lengkap)
replaceInFile(
  'components/kota/KotaSections.tsx',
  `              display: "inline-block",\n              background: "#fff",`,
  `              display: "inline-flex",\n              alignItems: "center",\n              gap: 8,\n              background: "#fff",`
);
replaceInFile(
  'components/kota/KotaSections.tsx',
  `<MapIcon size={24} color="var(--green)" />`,
  `<MapIcon size={24} color="var(--green)" style={{ flexShrink: 0 }} />`
);

// 3. KotaSections.tsx (Cek Ketersediaan)
replaceInFile(
  'components/kota/KotaSections.tsx',
  `              display: "inline-block",\n              width: "auto",\n              padding: "14px 32px",`,
  `              display: "inline-flex",\n              alignItems: "center",\n              gap: 8,\n              width: "auto",\n              padding: "14px 32px",`
);
replaceInFile(
  'components/kota/KotaSections.tsx',
  `<MapPin size={18} />\n            Cek Ketersediaan`,
  `<MapPin size={18} style={{ flexShrink: 0 }} />\n            Cek Ketersediaan`
);

// 4. Hero.tsx (Cek Ketersediaan)
replaceInFile(
  'components/home/Hero.tsx',
  `            display: "inline-block",\n            width: "auto",\n            padding: "14px 32px",`,
  `            display: "inline-flex",\n            alignItems: "center",\n            justifyContent: "center",\n            gap: 8,\n            width: "auto",\n            padding: "14px 32px",`
);
replaceInFile(
  'components/home/Hero.tsx',
  `<MapPin size={18} style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }} />`,
  `<MapPin size={18} style={{ flexShrink: 0 }} />`
);
