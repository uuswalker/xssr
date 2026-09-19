const fs = require('fs');
let code = fs.readFileSync('components/tools/Speedtest.tsx', 'utf8');

if (!code.includes('import { motion } from "framer-motion"')) {
  code = code.replace('import { useCallback, useEffect, useRef, useState } from "react";', 'import { useCallback, useEffect, useRef, useState } from "react";\nimport { motion } from "framer-motion";');
}

// Modify the button
code = code.replace(/<button\s*className="btn-pilih"\s*onClick=\{startTest\}\s*style=\{\{ padding: "12px 32px", fontSize: 16 \}\}\s*>\s*Mulai Test\s*<\/button>/, '<motion.button\n            whileHover={{ scale: 1.05 }}\n            whileTap={{ scale: 0.95 }}\n            animate={{ boxShadow: ["0 0 0 0 rgba(5,169,134,0.4)", "0 0 0 15px rgba(5,169,134,0)"] }}\n            transition={{ repeat: Infinity, duration: 1.5 }}\n            className="btn-pilih"\n            onClick={startTest}\n            style={{ padding: "12px 32px", fontSize: 16, border: "none", cursor: "pointer" }}\n          >\n            Mulai Test\n          </motion.button>');

// Wrap the main circle in a motion div to pulse when measuring
// Need to find the SVG circle
code = code.replace(/<svg viewBox="0 0 36 36" className="speed-gauge-svg">/, '<motion.svg \n              animate={{ scale: phase === "Download" || phase === "Upload" ? [1, 1.02, 1] : 1 }}\n              transition={{ repeat: Infinity, duration: 1 }}\n              viewBox="0 0 36 36" className="speed-gauge-svg">');

// Add smooth transitions to the bars
code = code.replace(/<path\s*className="speed-gauge-val"\s*strokeDasharray=\{\`\$\{fill\} 100\`\}/, '<motion.path\n                className="speed-gauge-val"\n                initial={{ strokeDasharray: "0 100" }}\n                animate={{ strokeDasharray: `${fill} 100` }}\n                transition={{ type: "spring", bounce: 0, duration: 0.5 }}');

fs.writeFileSync('components/tools/Speedtest.tsx', code);
