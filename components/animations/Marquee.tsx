"use client";

import {
  Network,
  Infinity as InfinityIcon,
  Activity,
  Wrench,
  Gift,
  Headset,
  ShieldCheck,
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

// Duplikat 2x saja — cukup untuk loop seamless, kurangi DOM node
const track = [...items, ...items];

export default function Marquee() {
  return (
    <div
      style={{
        overflow: "hidden",
        background: "var(--green-light)",
        padding: "16px 0",
        borderTop: "2px solid #047857",
        borderBottom: "2px solid #047857",
        color: "var(--green-dark)",
      }}
    >
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
      <div className="marquee-track">
        {track.map((item, i) => {
          const Icon = item.icon;
          return (
            <span
              key={i}
              style={{
                fontWeight: 700,
                fontSize: "15px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                paddingRight: "3rem",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={18} strokeWidth={2.5} />
              {item.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
