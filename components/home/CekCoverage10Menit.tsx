"use client";

import { Clock, MapPin, Zap, MessageSquare, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { waLink, PHONE_DISPLAY } from "@/lib/site";

export default function CekCoverage10Menit() {
  const waCoverageUrl = waLink(
    "Halo Sales Resmi XL Home Solo, saya mau Cek Coverage 10 Menit untuk lokasi rumah/kos saya. Ini alamat atau titik Google Maps saya: "
  );

  return (
    <section 
      id="cek-coverage-10-menit" 
      style={{ 
        padding: "48px 20px", 
        background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)",
        borderTop: "1px solid #e2e8f0",
        borderBottom: "1px solid #bbf7d0"
      }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div 
          style={{ 
            background: "#ffffff", 
            borderRadius: 24, 
            padding: "clamp(24px, 4vw, 40px)", 
            boxShadow: "0 12px 30px -8px rgba(3, 126, 100, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
            border: "1.5px solid #86efac"
          }}
        >
          {/* Badge & Title */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ecfdf5", padding: "6px 14px", borderRadius: 999, border: "1px solid #a7f3d0" }}>
              <Zap size={16} color="#059669" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#065f46", letterSpacing: "0.4px" }}>
                FAST-TRACK ODP RADAR SOLO RAYA
              </span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#15803d", fontWeight: 600 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              Sales Lokal Online Siaga Cek ODP (Solo, Sukoharjo, Karanganyar, Klaten, Boyolali)
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.25 }}>
                Malas Isi Form Panjang? <span style={{ color: "#037e64" }}>Cek Coverage 10 Menit</span> via WhatsApp!
              </h2>
              <p style={{ color: "#475569", fontSize: "clamp(14px, 2vw, 15.5px)", lineHeight: 1.6, marginBottom: 20 }}>
                Tak perlu menunggu berhari-hari seperti web provider pusat. Cukup kirim titik lokasi (share-loc) atau nama perumahan Anda, tim sales resmi Solo Raya langsung verifikasi tiang ODP dan jarak kabel dalam 10 menit.
              </p>

              {/* 3 Step Pills */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  {
                    icon: MapPin,
                    title: "1. Kirim Share-Loc atau Alamat",
                    desc: "Kirim pin Google Maps atau nama gang/perumahan ke WhatsApp sales."
                  },
                  {
                    icon: Clock,
                    title: "2. Verifikasi Tiang ODP 10 Menit",
                    desc: "Kami cek jarak tiang fiber terdekat & ketersediaan slot port aktif."
                  },
                  {
                    icon: ShieldCheck,
                    title: "3. Konfirmasi Jadwal Pasang Rp 0",
                    desc: "Jika slot siap, teknisi datang 1-3 hari kerja. Bayar HANYA via VA resmi XL setelah nyala!"
                  }
                ].map((st, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#f8fafc", padding: "10px 14px", borderRadius: 12, border: "1px solid #f1f5f9" }}>
                    <st.icon size={18} color="#037e64" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b" }}>{st.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{st.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Box Card */}
            <div 
              style={{ 
                background: "linear-gradient(135deg, #037e64 0%, #064e3b 100%)", 
                borderRadius: 20, 
                padding: "28px 24px", 
                color: "#ffffff", 
                textAlign: "center",
                boxShadow: "0 10px 25px -5px rgba(3, 126, 100, 0.4)"
              }}
            >
              <div style={{ display: "inline-flex", padding: 12, background: "rgba(255,255,255,0.15)", borderRadius: "50%", marginBottom: 14 }}>
                <Clock size={32} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px 0", color: "#ffffff" }}>
                Cek Coverage 10 Menit Sekarang
              </h3>
              <p style={{ fontSize: 13, color: "#a7f3d0", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                Gratis pengecekan tiang ODP untuk seluruh kecamatan di Solo Raya. Respon cepat langsung dari sales lokal.
              </p>

              <a
                href={waCoverageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  width: "100%",
                  padding: "16px 20px",
                  background: "#ffffff",
                  color: "#037e64",
                  fontSize: 16,
                  fontWeight: 800,
                  borderRadius: 999,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s ease",
                }}
              >
                <MessageSquare size={20} color="#037e64" style={{ flexShrink: 0 }} />
                <span>Kirim Lokasi via WhatsApp</span>
                <ArrowRight size={18} color="#037e64" style={{ flexShrink: 0 }} />
              </a>

              <div style={{ marginTop: 14, fontSize: 12, color: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <CheckCircle2 size={14} color="#86efac" />
                <span>Nomor Sales Resmi: <strong>{PHONE_DISPLAY}</strong></span>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#a7f3d0" }}>
                *Gratis Biaya Pasang Rp 0 berlaku khusus paket 250 Mbps ke atas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
