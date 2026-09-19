const fs = require('fs');
let code = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');

// Add use client and framer-motion if not there
if (!code.includes('"use client"')) {
  code = `"use client";\nimport { motion } from "framer-motion";\n` + code;
}

// Modify Kenapa component
const kenapaRegex = /export function Kenapa\(\) \{[\s\S]*?\{KENAPA\.map\(\(k\) => \([\s\S]*?<\/div>\s*\)\)\}\s*<\/div>/;
const newKenapa = `
export function Kenapa() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      {/* KENAPA PILIH KAMI */}
      <section className="area-section" style={{ background: "#f7faf9" }}>
        <div className="area-inner">
          <h2 className="section-title">Kenapa Pilih Sales Resmi Kami?</h2>
          <p className="section-sub">
            Bukan sekadar jualan ?" kami yang pegang tanggung jawab dari daftar
            sampai internet nyala
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 20,
              marginTop: 32,
              textAlign: "left",
            }}
          >
            {KENAPA.map((k) => (
              <motion.div
                key={k.title}
                variants={item}
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                style={{
                  background: "#fff",
                  border: "1px solid #e3ece9",
                  borderRadius: 14,
                  padding: 24,
                  transition: "box-shadow 0.3s"
                }}
              >
                <i
                  className={k.icon}
                  style={{
                    color: "var(--green)",
                    fontSize: 28,
                    marginBottom: 12,
                    display: "block",
                  }}
                ></i>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{k.title}</h3>
                <p style={{ fontSize: 14, color: "#5a6b66", margin: 0 }}>
                  {k.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
`;

code = code.replace(kenapaRegex, newKenapa.trim());

fs.writeFileSync('components/home/InfoSections.tsx', code);
