const fs = require('fs');

let content = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

// Target 1: <Gift size={16} /> div
content = content.replace(
  /maxWidth: 420,\s*margin: "0 auto 24px",\s*background: "var\(--green-light\)",\s*borderRadius: 12,\s*padding: "12px 16px",\s*textAlign: "center",\s*fontSize: 13,\s*fontWeight: 600,\s*color: "var\(--green-dark\)",/,
  `maxWidth: 420,
                    margin: "0 auto 24px",
                    background: "var(--green-light)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--green-dark)",`
);
content = content.replace(
  /<Gift size=\{16\} style=\{\{ flexShrink: 0 \}\} \/>\{" "\}/,
  `<Gift size={16} style={{ flexShrink: 0 }} />`
);

// Target 2: <CalendarCheck size={16} /> div
content = content.replace(
  /maxWidth: 420,\s*margin: "0 auto 24px",\s*background: "#fff3e0",\s*borderRadius: 12,\s*padding: "12px 16px",\s*textAlign: "center",\s*fontSize: 13,\s*fontWeight: 600,\s*color: "#ac3c00",/,
  `maxWidth: 420,
                    margin: "0 auto 24px",
                    background: "#fff3e0",
                    borderRadius: 12,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#ac3c00",`
);
content = content.replace(
  /<CalendarCheck size=\{16\} style=\{\{ color: "var\(--green\)", flexShrink: 0 \}\} \/>\{" "\}/,
  `<CalendarCheck size={16} style={{ flexShrink: 0 }} />`
);


fs.writeFileSync('components/home/PaketSection.tsx', content);
console.log('Fixed icon alignments in PaketSection');
