"use client";

import { motion } from "framer-motion";
import { 
  Network, 
  Infinity as InfinityIcon, 
  Activity, 
  Wrench, 
  Gift, 
  Headset, 
  ShieldCheck 
} from "lucide-react";

const items = [
  { text: "100% Fiber Optic", icon: Network },
  { text: "Tanpa FUP (Batas Kuota)", icon: InfinityIcon },
  { text: "Ping Super Stabil", icon: Activity },
  { text: "Gratis Instalasi", icon: Wrench },
  { text: "Free Vidio & Catchplay", icon: Gift },
  { text: "Teknisi Siap Sedia", icon: Headset },
  { text: "Tagihan Flat (Pasti)", icon: ShieldCheck },
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
        {duplicatedItems.map((item, i) => {
          const Icon = item.icon;
          return (
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
              <Icon size={18} strokeWidth={2.5} />
              {item.text}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
