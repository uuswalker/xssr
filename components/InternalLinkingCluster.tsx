import { MapPin, Gamepad2, ShieldCheck, Radio, Zap } from "lucide-react";

export default function InternalLinkingCluster() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto 48px", padding: "0 24px" }}>
      <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 12, padding: "22px 24px" }}>
        <h3 style={{ margin: "0 0 8px", color: "#0f172a", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={18} color="#0284c7" style={{ flexShrink: 0 }} aria-hidden="true" />
          Area Prioritas & Panduan Pasang WiFi Solo Raya
        </h3>
        <p style={{ fontSize: 14, color: "#475569", margin: "0 0 16px" }}>
          Pilih lokasi pemasangan Anda untuk cek promo gratis pasang Rp 0 & tiang fiber aktif:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: 13 }}>
          <a href="/" style={{ background: "#ffffff", border: "1px solid #94a3b8", padding: "8px 14px", borderRadius: 8, fontWeight: 600, textDecoration: "none", color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <MapPin size={14} color="#0066ff" style={{ flexShrink: 0 }} aria-hidden="true" /> Pasang WiFi Solo Murah Mulai 185rb
          </a>
          <a href="/pasang-wifi-xl-home-kartasura/" style={{ background: "#ffffff", border: "1px solid #94a3b8", padding: "8px 14px", borderRadius: 8, fontWeight: 600, textDecoration: "none", color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <MapPin size={14} color="#0066ff" style={{ flexShrink: 0 }} aria-hidden="true" /> Pasang WiFi Kartasura (Dekat UMS)
          </a>
          <a href="/pasang-wifi-xl-home-solo-baru/" style={{ background: "#ffffff", border: "1px solid #94a3b8", padding: "8px 14px", borderRadius: 8, fontWeight: 600, textDecoration: "none", color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <MapPin size={14} color="#0066ff" style={{ flexShrink: 0 }} aria-hidden="true" /> Solo Baru Sektor 1-10
          </a>
          <a href="/eksperimen-game-streaming-zoom-bersamaan/" style={{ background: "#ffffff", border: "1px solid #94a3b8", padding: "8px 14px", borderRadius: 8, fontWeight: 600, textDecoration: "none", color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Gamepad2 size={14} color="#16a34a" style={{ flexShrink: 0 }} aria-hidden="true" /> Eksperimen Game & 4K Streaming
          </a>
          <a href="/rahasia-fup-internet-rumah/" style={{ background: "#ffffff", border: "1px solid #94a3b8", padding: "8px 14px", borderRadius: 8, fontWeight: 600, textDecoration: "none", color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={14} color="#0284c7" style={{ flexShrink: 0 }} aria-hidden="true" /> Rahasia FUP Internet Rumah
          </a>
          <a href="/panduan-fiber-vs-wireless/" style={{ background: "#ffffff", border: "1px solid #94a3b8", padding: "8px 14px", borderRadius: 8, fontWeight: 600, textDecoration: "none", color: "#0f172a", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Radio size={14} color="#9333ea" style={{ flexShrink: 0 }} aria-hidden="true" /> Panduan Fiber vs Wireless Solo Raya
          </a>
        </div>
      </div>
    </div>
  );
}
