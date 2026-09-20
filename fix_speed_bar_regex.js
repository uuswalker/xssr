const fs = require('fs');

let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

// Replace fiber
code = code.replace(
  /<div className="speed-bar-bg">\s*<div\s*className="speed-bar-fill"\s*style=\{\{ width: `\$\{t\.barWidth\}%`, background: t\.barGradient \}\}\s*><\/div>\s*<div\s*className="speed-bar-dot"\s*style=\{\{\s*left: `calc\(\$\{t\.barWidth\}% - 8px\)`,\s*borderColor: t\.barDotColor,\s*\}\}\s*><\/div>\s*<\/div>/,
  `<div className="speed-bar-bg">
            <motion.div
              className="speed-bar-fill"
              initial={{ width: "0%" }}
              whileInView={{ width: \`\${t.barWidth}%\` }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              style={{ background: t.barGradient }}
            ></motion.div>
            <motion.div
              className="speed-bar-dot"
              initial={{ left: "0%" }}
              whileInView={{ left: \`calc(\${t.barWidth}% - 8px)\` }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              style={{ borderColor: t.barDotColor }}
            ></motion.div>
          </div>`
);

// Replace tahunan
code = code.replace(
  /<div className="speed-bar-bg">\s*<div\s*className="speed-bar-fill"\s*style=\{\{ width: `\$\{t\.barWidth\}%`, background: "linear-gradient\(90deg, #1e1b4b 0%, #7c3aed 100%\)" \}\}\s*><\/div>\s*<div\s*className="speed-bar-dot"\s*style=\{\{\s*left: `calc\(\$\{t\.barWidth\}% - 8px\)`,\s*borderColor: "#7c3aed",\s*\}\}\s*><\/div>\s*<\/div>/,
  `<div className="speed-bar-bg">
                    <motion.div
                      className="speed-bar-fill"
                      initial={{ width: "0%" }}
                      whileInView={{ width: \`\${t.barWidth}%\` }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      style={{ background: "linear-gradient(90deg, #1e1b4b 0%, #7c3aed 100%)" }}
                    ></motion.div>
                    <motion.div
                      className="speed-bar-dot"
                      initial={{ left: "0%" }}
                      whileInView={{ left: \`calc(\${t.barWidth}% - 8px)\` }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      style={{ borderColor: "#7c3aed" }}
                    ></motion.div>
                  </div>`
);

fs.writeFileSync('components/home/PaketSection.tsx', code);
console.log('Regex replacement finished');
