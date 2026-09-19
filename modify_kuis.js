const fs = require('fs');

let code = fs.readFileSync('components/tools/Kuis.tsx', 'utf8');

if (!code.includes('import { motion, AnimatePresence } from "framer-motion"')) {
  code = code.replace('import { useCallback, useEffect, useState } from "react";', 'import { useCallback, useEffect, useState } from "react";\nimport { motion, AnimatePresence } from "framer-motion";');
}

// Replace the main render block
const replacement = `
      <div
        id="kuis-step"
        style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 10 }}
      >
        {done ? "Hasil" : \`Pertanyaan \${idx + 1} dari \${QS.length}\`}
      </div>
      
      <div style={{ position: "relative" }}>
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={idx}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                id="kuis-q"
                style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}
              >
                {QS[idx].q}
              </div>
              <div id="kuis-opts" style={{ display: "grid", gap: 8 }}>
                {QS[idx].opts.map((o, i) => (
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    key={i} 
                    type="button" 
                    style={BTN_OPT} 
                    onClick={() => jawab(i)}
                  >
                    {o.t}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="hasil"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              id="kuis-hasil"
            >
              {type === "fiber" && (
                <>
                  <p style={{ fontSize: 15 }}>
                    <strong>✅ Hasil: Fiber Optic XL SATU cocok untukmu.</strong>
                  </p>
                  <p style={{ fontSize: 14 }}>
                    Koneksi kabel paling stabil, latensi rendah untuk gaming &amp;
                    video call, kecepatan hingga 1000 Mbps. Mulai Rp185rb/bln
                    (Starter 20).
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={\`https://wa.me/6287778999141?text=\${encodeURIComponent("Halo kak, hasil kuisku: FIBER. Tolong info paket + cek coverage di alamat saya")}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "var(--green, #037e64)",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: 8,
                      fontWeight: 700,
                      textDecoration: "none",
                      margin: "8px 8px 0 0",
                    }}
                  >
                    Chat Sales: Paket Fiber
                  </motion.a>
                  <a
                    href="/biaya-pasang-wifi-solo-raya/"
                    style={{
                      display: "inline-block",
                      padding: "12px 0",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Lihat harga paket ➔
                  </a>
                </>
              )}
              {type === "wireless" && (
                <>
                  <p style={{ fontSize: 15 }}>
                    <strong>✅ Hasil: Wireless XL SATU cocok untukmu.</strong>
                  </p>
                  <p style={{ fontSize: 14 }}>
                    Tanpa tarik kabel ?" aktif cepat, solusi area belum fiber, hemat
                    mulai Rp162rb/bln (program bayar di muka). Cocok untuk
                    pemakaian ringan-sedang.
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={\`https://wa.me/6287778999141?text=\${encodeURIComponent("Halo kak, hasil kuisku: WIRELESS. Tolong info program wireless + cek sinyal di alamat saya")}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "var(--green, #037e64)",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: 8,
                      fontWeight: 700,
                      textDecoration: "none",
                      margin: "8px 8px 0 0",
                    }}
                  >
                    Chat Sales: Wireless
                  </motion.a>
                  <a
                    href="/solusi-internet-daerah-belum-ada-fiber-optik/"
                    style={{
                      display: "inline-block",
                      padding: "12px 0",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Pelajari wireless ➔
                  </a>
                </>
              )}
              {type === "seri" && (
                <>
                  <p style={{ fontSize: 15 }}>
                    <strong>
                      ✅ Hasil: Seimbang ?" konsultasi dulu yang paling pas.
                    </strong>
                  </p>
                  <p style={{ fontSize: 14 }}>
                    Jawabanmu cocok untuk keduanya. Faktor penentu akhir: hasil cek
                    coverage + budget. Ceritakan alamatmu, sales bantu putuskan.
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={\`https://wa.me/6287778999141?text=\${encodeURIComponent("Halo kak, hasil kuisku SERI (fiber vs wireless). Tolong bantu pilihkan + cek coverage")}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "var(--green, #037e64)",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: 8,
                      fontWeight: 700,
                      textDecoration: "none",
                      marginTop: 8,
                    }}
                  >
                    Konsultasi Gratis via WA
                  </motion.a>
                </>
              )}
              {answers[0] === 1 && QS[0].opts[1].note && (
                <p
                  style={{ fontSize: 13, marginTop: 10 }}
                  dangerouslySetInnerHTML={{ __html: QS[0].opts[1].note }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
`;

// regex to match the old block
const oldRegex = /<div\s*id="kuis-step"[\s\S]*?<div style={{ display: "flex", gap: 8, marginTop: 12 }}>/;
code = code.replace(oldRegex, replacement);

fs.writeFileSync('components/tools/Kuis.tsx', code);
