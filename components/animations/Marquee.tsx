"use client";

import { useEffect, useRef } from "react";
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

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Ambil lebar 1 set item (setengah dari track karena kita duplikat 2x)
    const halfWidth = track.scrollWidth / 2;

    // Buat keyframes secara dinamis berdasarkan lebar pixel sebenarnya
    const keyframes = [
      { transform: "translateX(0)" },
      { transform: `translateX(-${halfWidth}px)` },
    ];

    const anim = track.animate(keyframes, {
      duration: 35000,
      iterations: Infinity,
      easing: "linear",
    });

    return () => {
      anim.cancel();
    };
  }, []);

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
      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: "max-content",
          willChange: "transform",
        }}
      >
        {/* Render 2 salinan identik — saat salinan pertama habis geser ke kiri,
            salinan kedua sudah siap menggantikan tanpa celah */}
        {[0, 1].map((copy) =>
          items.map((item, i) => {
            const Icon = item.icon;
            return (
              <span
                key={`${copy}-${i}`}
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
          })
        )}
      </div>
    </div>
  );
}
