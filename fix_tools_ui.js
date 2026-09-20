const fs = require('fs');

let code = fs.readFileSync('components/home/InfoSections.tsx', 'utf8');

// Update imports
code = code.replace(
  'import { Ticket, HandCoins, MapPinned, Building2, HelpCircle, Map, MessageCircle } from "lucide-react";',
  'import { Ticket, HandCoins, MapPinned, Building2, HelpCircle, Map, MessageCircle, Gauge, Calculator, FileQuestion, Lightbulb, ArrowRight } from "lucide-react";'
);

// Update TOOLS array
const oldTools = `const TOOLS = [
  {
    href: "/tes-kecepatan/",
    emoji: "",
    title: "Tes Kecepatan Internet",
    desc: "Ukur download & upload ke server terdekat A±20 detik.",
  },
  {
    href: "/berapa-mbps-untuk-berapa-orang/",
    emoji: "",
    title: "Kalkulator Mbps",
    desc: "Isi perangkat aktif, dapat rekomendasi paket + link share.",
  },
  {
    href: "/panduan-fiber-vs-wireless/",
    emoji: "",
    title: "Kuis Fiber vs Wireless",
    desc: "5 pertanyaan, tahu mana yang pas untuk rumahmu.",
  },
  {
    href: "/250-mbps-untuk-berapa-orang/",
    emoji: "",
    title: "Panduan 250 Mbps",
    desc: "Untuk berapa orang? Tabel aktivitas + harga paket.",
  },
];`;

const newTools = `const TOOLS = [
  {
    href: "/tes-kecepatan/",
    Icon: Gauge,
    title: "Tes Kecepatan Internet",
    desc: "Ukur download & upload ke server terdekat ±20 detik.",
  },
  {
    href: "/berapa-mbps-untuk-berapa-orang/",
    Icon: Calculator,
    title: "Kalkulator Mbps",
    desc: "Isi perangkat aktif, dapat rekomendasi paket + link share.",
  },
  {
    href: "/panduan-fiber-vs-wireless/",
    Icon: FileQuestion,
    title: "Kuis Fiber vs Wireless",
    desc: "5 pertanyaan, tahu mana yang pas untuk rumahmu.",
  },
  {
    href: "/250-mbps-untuk-berapa-orang/",
    Icon: Lightbulb,
    title: "Panduan 250 Mbps",
    desc: "Untuk berapa orang? Tabel aktivitas + harga paket.",
  },
];`;

code = code.replace(/const TOOLS = \[[\s\S]*?\];/, newTools);

// Update rendering
const oldRender = `{TOOLS.map((t) => (
            <a
              key={t.href}
              href={t.href}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                textDecoration: "none",
                color: "inherit",
                boxShadow: "0 2px 12px rgba(0,0,0,.06)",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>
                {t.title}
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280" }}>{t.desc}</p>
            </a>
          ))}`;

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

code = code.replace(oldRender, newRender);

fs.writeFileSync('components/home/InfoSections.tsx', code);
console.log('Fixed Tools UI');
