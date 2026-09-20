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

// 1. PaketSection.tsx
const paketFile = 'components/home/PaketSection.tsx';
replaceInFile(
  paketFile,
  `<span\n              style={{\n                display: "inline-block",`,
  `<span\n              style={{\n                display: "inline-flex",\n                alignItems: "center",\n                gap: 6,`
);
replaceInFile(
  paketFile,
  `<Gift size={16} style={{ marginRight: 6 }} />{" "}`,
  `<Gift size={16} style={{ flexShrink: 0 }} />{" "}`
);

replaceInFile(
  paketFile,
  `<span\n              style={{\n                display: "inline-block",\n                padding: "10px 16px",`,
  `<span\n              style={{\n                display: "inline-flex",\n                alignItems: "center",\n                gap: 8,\n                padding: "10px 16px",`
);
replaceInFile(
  paketFile,
  `<CalendarCheck size={16} style={{ marginRight: 8, color: "var(--green)" }} />{" "}`,
  `<CalendarCheck size={16} style={{ color: "var(--green)", flexShrink: 0 }} />{" "}`
);

// 2. InfoSections.tsx
const infoFile = 'components/home/InfoSections.tsx';
replaceInFile(
  infoFile,
  `display: "inline-block",\n              marginTop: 24,`,
  `display: "inline-flex",\n              alignItems: "center",\n              gap: 8,\n              marginTop: 24,`
);
replaceInFile(
  infoFile,
  `<Map size={16} style={{ marginRight: 6 }} />`,
  `<Map size={16} style={{ flexShrink: 0 }} />`
);

// 3. Faq.tsx
const faqFile = 'components/home/Faq.tsx';
replaceInFile(
  faqFile,
  `className="btn-faq-chat"\n          >`,
  `className="btn-faq-chat"\n            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}\n          >`
);

// 4. CekLokasi.tsx
const cekFile = 'components/CekLokasi.tsx';
replaceInFile(
  cekFile,
  `<h3 className="cl-title">`,
  `<h3 className="cl-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>`
);
replaceInFile(
  cekFile,
  `<CheckCircle2 size={18} color="var(--green)" />{" "}`,
  `<CheckCircle2 size={18} color="var(--green)" style={{ flexShrink: 0 }} />`
);
