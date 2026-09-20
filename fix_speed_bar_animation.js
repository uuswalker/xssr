const fs = require('fs');

let code = fs.readFileSync('components/home/PaketSection.tsx', 'utf8');

// Replacement for FiberCard
const oldFiberBar = `<div className="speed-bar-bg">
            <div
              className="speed-bar-fill"
              style={{ width: \`\${t.barWidth}%\`, background: t.barGradient }}
            ></div>
            <div
              className="speed-bar-dot"
              style={{
                left: \`calc(\${t.barWidth}% - 8px)\`,
                borderColor: t.barDotColor,
              }}
            ></div>
          </div>`;

const newFiberBar = `<div className="speed-bar-bg">
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
          </div>`;

// Replacement for TahunanPaket
const oldTahunanBar = `<div className="speed-bar-bg">
                    <div
                      className="speed-bar-fill"
                      style={{ width: \`\${t.barWidth}%\`, background: "linear-gradient(90deg, #1e1b4b 0%, #7c3aed 100%)" }}
                    ></div>
                    <div
                      className="speed-bar-dot"
                      style={{
                        left: \`calc(\${t.barWidth}% - 8px)\`,
                        borderColor: "#7c3aed",
                      }}
                    ></div>
                  </div>`;

const newTahunanBar = `<div className="speed-bar-bg">
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
                  </div>`;

// Replace using normal string replacement 
code = code.replace(oldFiberBar, newFiberBar);
code = code.replace(oldTahunanBar, newTahunanBar);

fs.writeFileSync('components/home/PaketSection.tsx', code);
console.log('Fixed PaketSection animation');
