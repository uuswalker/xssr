import Link from "next/link";
import { MessageCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function SiloSoloHub() {
  return (
    <section 
      style={{ 
        maxWidth: 720, 
        margin: "32px auto 16px", 
        padding: "24px", 
        background: "linear-gradient(135deg, #023835 0%, #037e64 100%)", 
        borderRadius: "16px", 
        color: "#ffffff", 
        boxShadow: "0 10px 25px rgba(3,126,100,0.18)" 
      }}
      aria-label="Layanan Pasang WiFi Solo Murah"
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.18)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", marginBottom: "12px", color: "#ffd000" }}>
        <Zap size={14} /> Layanan Resmi Solo Raya 2026
      </div>
      
      <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: "800", color: "#ffffff", lineHeight: "1.3" }}>
        Mau Pasang WiFi Rumah Cepat &amp; Murah di Solo?
      </h3>
      
      <p style={{ margin: "0 0 18px", fontSize: "14px", lineHeight: "1.6", color: "rgba(255,255,255,0.92)" }}>
        Untuk warga Surakarta, Sukoharjo, Karanganyar, dan Boyolali yang ingin{" "}
        <Link 
          href="/wifi-solo/" 
          title="Pasang WiFi Solo Murah 2026"
          style={{ color: "#ffd000", fontWeight: "800", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          pasang wifi solo murah
        </Link>{" "}
        mulai <strong>Rp 185.000/bulan</strong> dengan promo <strong>Bebas Biaya Pasang Rp 0</strong> (100% Fiber Optic Tanpa Batas FUP), cek paket resmi &amp; ketersediaan tiang ODP di depan rumah Anda sekarang.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <Link 
          href="/wifi-solo/" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "#ffd000", 
            color: "#023835", 
            fontWeight: "800", 
            padding: "11px 20px", 
            borderRadius: "10px", 
            textDecoration: "none", 
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          Lihat Paket WiFi Solo <ArrowRight size={16} />
        </Link>
        <a 
          href="https://wa.me/6287778999141?text=Halo%20Sales%20XL%20Home%20Solo%2C%20saya%20mau%20pasang%20wifi%20murah%20di%20Solo" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "rgba(255,255,255,0.15)", 
            color: "#ffffff", 
            fontWeight: "700", 
            padding: "11px 18px", 
            borderRadius: "10px", 
            textDecoration: "none", 
            fontSize: "14px", 
            border: "1px solid rgba(255,255,255,0.3)" 
          }}
        >
          <MessageCircle size={17} /> Tanya Sales WA 24 Jam
        </a>
      </div>

      <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.88)" }}>
        <ShieldCheck size={16} color="#ffd000" />
        <span>Pilihan terfavorit <Link href="/wifi-solo/" style={{ color: "#ffffff", textDecoration: "underline" }}>wifi murah solo</Link> tanpa FUP. Kontak: <Link href="/nomor-sales-xl-home-solo-raya/" title="Nomor Resmi Sales XL Home Solo" style={{ color: "#ffd000", fontWeight: "700", textDecoration: "underline" }}>nomor resmi sales XL Home Solo</Link> (<a href="https://wa.me/xlhomesolo" target="_blank" rel="noopener noreferrer" style={{ color: "#ffd000", textDecoration: "underline" }}>wa.me/xlhomesolo</a> • 0877-7899-9141).</span>
      </div>
    </section>
  );
}
