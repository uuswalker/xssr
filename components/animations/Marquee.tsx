"use client";

import { motion } from "framer-motion";

const items = [
  "🚀 100% Fiber Optic",
  "🔥 Tanpa FUP (Batas Kuota)",
  "⚡ Ping Super Stabil",
  "🛠️ Gratis Instalasi",
  "🎁 Free Vidio & Catchplay",
  "📞 Teknisi Siap Sedia",
  "✅ Tagihan Flat (Pasti)",
];

export default function Marquee() {
  // We duplicate the items several times to ensure it fills ultra-wide screens
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        display: "flex",
        whiteSpace: "nowrap",
        background: "var(--green-light)",
        padding: "16px 0",
        borderTop: "2px solid #047857",
        borderBottom: "2px solid #047857",
        color: "var(--green-dark)",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)",
      }}
    >
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35, // Adjust this to make it faster/slower
        }}
        style={{
          display: "flex",
          gap: "3rem",
          paddingRight: "3rem", // Match the gap to make the loop seamless
        }}
      >
        {duplicatedItems.map((item, i) => (
          <span
            key={i}
            style={{
              fontWeight: 700,
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
