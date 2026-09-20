const fs = require('fs');

let code = fs.readFileSync('components/CekLokasi.tsx', 'utf8');

// The block to replace:
const regexStrip = /\{strip !== null && !open && \([\s\S]*?<\/button>\s*<\/div>\s*\)\}/;

const newStrip = `<AnimatePresence>
        {strip !== null && !open && (
          <motion.div
            id="xlsr-lokasi-strip"
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            style={{
              position: "fixed",
              left: "50%",
              bottom: "calc(96px + env(safe-area-inset-bottom))",
              zIndex: 9998,
              width: "min(92%,340px)",
              background: "#fff",
              color: "var(--text)",
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              boxShadow: "0 10px 40px rgba(0,0,0,.15)",
              border: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ background: "var(--green-light)", color: "var(--green)", padding: 10, borderRadius: 12 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2, marginBottom: 2 }}>Cek Jaringan XL SATU</div>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.3 }}>
                    Apakah rumahmu di {strip || 'areamu'} sudah ter-cover Fiber?
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  tutupStrip(true);
                  gtag("event", "lokasi_strip_tutup", { page_path: location.pathname });
                }}
                aria-label="Tutup"
                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <button
              onClick={() => { tutupStrip(true); bukaModal("strip"); }}
              style={{
                background: "var(--green)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                transition: "background .2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--green-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--green)"}
            >
              Cek Lokasi Saya <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
        </AnimatePresence>`;

code = code.replace(regexStrip, newStrip);
fs.writeFileSync('components/CekLokasi.tsx', code);
console.log('Toast replaced');
