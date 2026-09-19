const fs = require('fs');
let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

if (!code.includes('import { motion }')) {
  code = code.replace('"use client";\n', '"use client";\n\nimport { motion } from "framer-motion";\n');
}

const motionProps = `whileHover={{ scale: 1.03, y: -5, boxShadow: "0px 15px 30px rgba(5,169,134,0.15)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}`;

code = code.replace(/<div className="paket-card"([^>]*)>/g, '<motion.div className="paket-card"$1 ' + motionProps + '>');
code = code.replace(/<div className="wireless-card"([^>]*)>/g, '<motion.div className="wireless-card"$1 ' + motionProps + '>');

// Fix the closing tags.
// For FiberCard
code = code.replace(/\{t\.boosterNote && \([\s\S]*?\}\)\}\s*<\/div>\s*<\/div>/, match => {
  return match.replace(/<\/div>$/, '</motion.div>');
});

// For TahunanPaket
code = code.replace(/<div className="paket-card"([\s\S]*?)<\/a>\s*<\/div>/g, match => {
  return match.replace(/<\/div>$/, '</motion.div>');
});

// For WirelessPaket
code = code.replace(/<div className="wireless-card"([\s\S]*?)<\/a>\s*<\/div>/g, match => {
  return match.replace(/<\/div>$/, '</motion.div>');
});

fs.writeFileSync('components/home/PaketSection.tsx', code);
