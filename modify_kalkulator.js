const fs = require('fs');

let code = fs.readFileSync('components/tools/Kalkulator.tsx', 'utf8');

if (!code.includes('import { motion } from "framer-motion"')) {
  code = code.replace('import { useEffect, useState } from "react";', 'import { useEffect, useState } from "react";\nimport { motion } from "framer-motion";');
}

// Convert control buttons to motion buttons
code = code.replace(/<button([^>]*)onClick=\{\(\) => chg\(f, -1\)\}([^>]*)>/g, '<motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}$1onClick={() => chg(f, -1)}$2>');
code = code.replace(/<\/button>\s*<span/g, '</motion.button>\n                  <span');
code = code.replace(/<button([^>]*)onClick=\{\(\) => chg\(f, 1\)\}([^>]*)>/g, '<motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}$1onClick={() => chg(f, 1)}$2>');
code = code.replace(/<\/button>\s*<\/div>\s*<\/div>/g, '</motion.button>\n                </div>\n              </div>');

// Animate the resulting total number and bar
code = code.replace(/<div className="total-val" style={{ fontSize: 36, fontWeight: 800 }}>\s*\{tot\} Mbps\s*<\/div>/, '<motion.div key={tot} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="total-val" style={{ fontSize: 36, fontWeight: 800 }}>\n          {tot} Mbps\n        </motion.div>');

// Bar fill
code = code.replace(/<div\s*style=\{\{\s*height: "100%",\s*width: \`\$\{pct\}%\`,\s*background: "var\(--green\)",\s*borderRadius: 999,\s*transition: "width \.3s",\s*\}\}\s*><\/div>/, '<motion.div\n            initial={{ width: 0 }}\n            animate={{ width: `${pct}%` }}\n            transition={{ type: "spring", stiffness: 100 }}\n            style={{\n              height: "100%",\n              background: "var(--green)",\n              borderRadius: 999,\n            }}\n          ></motion.div>');

fs.writeFileSync('components/tools/Kalkulator.tsx', code);
