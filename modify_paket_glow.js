const fs = require('fs');

let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

// Add best-seller class to the card if it has a badge
code = code.replace('<motion.div className="paket-card"', '<motion.div className={`paket-card ${t.badge ? "best-seller" : ""}`}');

fs.writeFileSync('components/home/PaketSection.tsx', code);
