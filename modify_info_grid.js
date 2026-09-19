const fs = require('fs');

let code = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');

// Replace the inline style grid with bento-grid
code = code.replace(/style=\{\{\s*display: "grid",\s*gridTemplateColumns: "repeat\(auto-fit,minmax\(240px,1fr\)\)",\s*gap: 20,\s*marginTop: 32,\s*textAlign: "left",\s*\}\}/, 'className="bento-grid"\n              style={{ textAlign: "left" }}');

// Replace inline styles of the card with bento-card
code = code.replace(/className="kenapa-card"\s*style=\{\{\s*background: "#fff",\s*borderRadius: 16,\s*padding: 24,\s*boxShadow: "0 4px 15px rgba\(0,0,0,0.03\)",\s*border: "1px solid #f0f0f0",\s*\}\}/g, 'className="bento-card"');

fs.writeFileSync('components/home/InfoSections.tsx', code);
