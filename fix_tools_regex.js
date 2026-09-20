const fs = require('fs');

let code = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');

const regex = /\{TOOLS\.map\(\(t\) => \([\s\S]*?<\/a>\s*\)\)\}/;
const newRender = `{TOOLS.map((t) => (
            <motion.a
              key={t.href}
              href={t.href}
              whileHover={{ scale: 1.03, y: -4, boxShadow: "0 10px 20px rgba(0,0,0,.08)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 20px 24px",
                textDecoration: "none",
                color: "inherit",
                boxShadow: "0 2px 12px rgba(0,0,0,.04)",
                border: "1px solid rgba(0,0,0,.04)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ background: "var(--green-light)", color: "var(--green)", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <t.Icon size={22} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: 0, lineHeight: 1.2 }}>
                  {t.title}
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5, margin: 0, flex: 1 }}>
                {t.desc}
              </p>
              
              <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, color: "var(--green)", display: "flex", alignItems: "center", gap: 4 }}>
                Coba Sekarang <ArrowRight size={14} />
              </div>
            </motion.a>
          ))}`;

code = code.replace(regex, newRender);

fs.writeFileSync('components/home/InfoSections.tsx', code);
console.log('Regex fix done');
