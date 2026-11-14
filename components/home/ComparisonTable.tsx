"use client";

import { CheckCircle2, ShieldCheck, ArrowRight, AlertTriangle, Rocket, Sparkles, TrendingDown, HelpCircle } from "lucide-react";
import { waLink } from "@/lib/site";

const EFFICIENCY_METRICS = [
  {
    provider: "XL HOME SPARK",
    speed: "250 Mbps",
    price: "Rp 229.000 / bln",
    ratio: "Rp 916",
    ratioLabel: "Paling Hemat di Solo Raya 🏆",
    isWinner: true,
    badges: ["Pasang Rp 0 (Gratis)", "100% Fiber Simetris", "Bebas FUP"],
  },
  {
    provider: "Provider \"M\"",
    speed: "150 Mbps",
    price: "Rp 250.000+ / bln",
    ratio: "Rp 1.666",
    ratioLabel: "1,8x Lebih Mahal per Mbps",
    isWinner: false,
    badges: ["Biaya sewa ONT", "Harga promo terbatas"],
  },
  {
    provider: "Provider \"B\"",
    speed: "100 Mbps",
    price: "Rp 250.000+ / bln",
    ratio: "Rp 2.500",
    ratioLabel: "2,7x Lebih Mahal per Mbps",
    isWinner: false,
    badges: ["Wajib beli router Rp 500rb+", "FUP ketat"],
  },
  {
    provider: "Provider \"I\"",
    speed: "50 Mbps",
    price: "Rp 250.000+ / bln",
    ratio: "Rp 5.000",
    ratioLabel: "5,4x LEBIH MAHAL per Mbps ⚠️",
    isWinner: false,
    badges: ["FUP kuota bulanan", "Speed turun saat kuota habis"],
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Kecepatan vs Harga",
    xl: "Spark 250 Mbps cuma Rp 229.000/bln (Rp 916/Mbps)",
    i: "Rp 283.000 cuma dapat 30 Mbps (Rp 9.433/Mbps)",
    b: "Rp 277.500 cuma dapat 50-100 Mbps (Rp 2.775/Mbps)",
    m: "Rp 277.500++ baru dapat 150 Mbps (Rp 1.850/Mbps)",
  },
  {
    feature: "Modal Awal Pasang Baru",
    xl: "Rp 0 (Bebas Pasang Paket 250 Mbps+ & Modem Dipinjamkan Gratis)",
    i: "Biaya PSB Rp 50.000 - Rp 150.000",
    b: "Rp 1 Juta+ (Wajib beli modem 500rb + pasang 250rb)",
    m: "Promo pasang Rp 0 (Klaim normal 500rb)",
  },
  {
    feature: "Biaya Bulanan & Transparansi",
    xl: "Harga Flat Bersih (Tanpa Sewa Router)",
    i: "Sering naik tiba-tiba setelah 3 bulan",
    b: "Ada biaya kabel underground 25rb/bln",
    m: "Ada sewa ONT + biaya admin di faktur bulanan",
  },
  {
    feature: "Batas Kuota / FUP",
    xl: "100% Unlimited Tanpa FUP Sejati",
    i: "FUP ketat (Speed dipotong s/d 50%)",
    b: "Ada FUP (Kuota habis drop ke 5-15 Mbps)",
    m: "Tanpa FUP",
  },
  {
    feature: "Keamanan Transaksi & Pembayaran",
    xl: "100% via Virtual Account Resmi XL (Anti Pungli)",
    i: "Via loket / tagihan bulanan",
    b: "Bayar di muka sistem invoice",
    m: "Sistem tagihan invoice / loket pihak ketiga",
  },
];

const STEPS = [
  { step: "1", title: "Registrasi Online", desc: "Kirim alamat & share loc via web atau WhatsApp resmi sales." },
  { step: "2", title: "Verifikasi ODP", desc: "Data & jarak tiang divalidasi langsung oleh sistem pusat XL dalam 10 menit." },
  { step: "3", title: "Bayar via VA Resmi XL", desc: "Hanya bayar lewat Virtual Account resmi XL setelah aktif. Dilarang titip tunai ke sales!" },
  { step: "4", title: "Jadwal Teknisi", desc: "Pilih tanggal & jam instalasi yang nyaman untuk keluarga Anda (1-3 hari kerja)." },
  { step: "5", title: "Teknisi Pasang Rp 0", desc: "Pemasangan gratis tanpa pungli, internet langsung aktif siap dipakai." },
];

export default function ComparisonTable() {
  const waDaftarUrl = waLink("Halo Sales XL Home Solo, saya ingin daftar pasang baru paket Spark 250 Mbps (Rp 229.000/bln). Mohon panduan registrasi resmi:");

  return (
    <section id="bandingkan" style={{ padding: "72px 20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ 
            display: "inline-block", 
            padding: "6px 16px", 
            background: "#e0f2fe", 
            color: "#075985", 
            fontSize: 13, 
            fontWeight: 700, 
            borderRadius: 999, 
            marginBottom: 12,
            letterSpacing: "0.5px"
          }}>
            FAKTA RISET TARIF INTERNET SOLO RAYA 2026
          </span>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.25 }}>
            Kenapa Warga Solo Raya Berbondong-bondong Pindah ke XL Home?
          </h2>
          <p style={{ color: "#475569", fontSize: "clamp(14px, 2vw, 16px)", maxWidth: 740, margin: "0 auto", lineHeight: 1.6 }}>
            Bandingkan sendiri fakta riil tarif per Mbps, modal awal pasang baru, biaya tersembunyi, dan keamanan transaksi kami dengan provider lain di Surakarta, Sukoharjo, Karanganyar, Klaten, dan Boyolali.
          </p>
        </div>

        {/* 1. Value-to-Speed Cards (Rp 916 / Mbps Highlight) */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: 12, 
            background: "#f0fdf4", 
            border: "1px solid #bbf7d0", 
            borderRadius: 14, 
            padding: "12px 18px", 
            marginBottom: 20 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#166534", fontWeight: 700 }}>
              <TrendingDown size={18} color="#16a34a" />
              <span>Matriks Nilai Riil: Biaya per 1 Mbps Bandwidth di Solo Raya</span>
            </div>
            <div style={{ fontSize: 12, color: "#475569" }}>
              *Rumus: Tarif Bulanan ÷ Kecepatan (Mbps). Makin rendah = makin hemat!
            </div>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
            gap: 16 
          }}>
            {EFFICIENCY_METRICS.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  background: m.isWinner ? "linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)" : "#ffffff",
                  border: m.isWinner ? "2px solid #10b981" : "1px solid #e2e8f0",
                  borderRadius: 16,
                  padding: "20px 18px",
                  boxShadow: m.isWinner ? "0 10px 25px -5px rgba(16, 185, 129, 0.2)" : "0 2px 6px rgba(0,0,0,0.03)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                {m.isWinner && (
                  <div style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#037e64",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "3px 12px",
                    borderRadius: 999,
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                    <Sparkles size={12} /> PALING HEMAT
                  </div>
                )}

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: m.isWinner ? "#037e64" : "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                    {m.provider}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                    Speed: <strong>{m.speed}</strong> ({m.price})
                  </div>

                  <div style={{ 
                    background: m.isWinner ? "#d1fae5" : "#f1f5f9", 
                    borderRadius: 10, 
                    padding: "10px", 
                    textAlign: "center", 
                    marginBottom: 12 
                  }}>
                    <div style={{ fontSize: 11, color: m.isWinner ? "#065f46" : "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                      Biaya per 1 Mbps:
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: m.isWinner ? "#047857" : "#334155", lineHeight: 1.15 }}>
                      {m.ratio}
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>/bln</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 700, color: m.isWinner ? "#047857" : "#b91c1c", marginBottom: 12, textAlign: "center" }}>
                    {m.ratioLabel}
                  </div>
                </div>

                <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {m.badges.map((b, bIdx) => (
                    <div key={bIdx} style={{ fontSize: 11.5, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                      {m.isWinner ? (
                        <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0 }} />
                      ) : (
                        <span style={{ display: "inline-block", width: 4, height: 4, borderRadius: "50%", background: "#94a3b8" }} />
                      )}
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Detailed Comparison Table */}
        <div style={{ 
          overflowX: "auto", 
          borderRadius: 16, 
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)", 
          background: "#fff",
          marginBottom: 48,
          border: "1px solid #e2e8f0"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "18px 20px", color: "#334155", fontWeight: 700, fontSize: 14 }}>Fitur Layanan</th>
                <th style={{ 
                  padding: "18px 20px", 
                  color: "#037e64", 
                  fontWeight: 800, 
                  background: "#e6f7f3", 
                  borderTop: "4px solid #037e64",
                  fontSize: 15
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>XL HOME SOLO <Rocket size={16} color="#037e64" style={{ flexShrink: 0 }} aria-hidden="true" /></span>
                </th>
                <th style={{ padding: "18px 18px", color: "#334155", fontWeight: 600, fontSize: 13 }}>Provider "I"</th>
                <th style={{ padding: "18px 18px", color: "#334155", fontWeight: 600, fontSize: 13 }}>Provider "B"</th>
                <th style={{ padding: "18px 18px", color: "#334155", fontWeight: 600, fontSize: 13 }}>Provider "M"</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#ffffff" : "#fcfdfe" }}>
                  <td style={{ padding: "16px 20px", fontWeight: 700, color: "#1e293b", fontSize: 14 }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: "16px 20px", fontWeight: 700, color: "#037e64", background: "#f4fbf9", fontSize: 14 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <CheckCircle2 size={18} color="#037e64" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{row.xl}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 18px", color: "#334155", fontSize: 13, lineHeight: 1.4 }}>
                    {row.i}
                  </td>
                  <td style={{ padding: "16px 18px", color: "#334155", fontSize: 13, lineHeight: 1.4 }}>
                    {row.b}
                  </td>
                  <td style={{ padding: "16px 18px", color: "#334155", fontSize: 13, lineHeight: 1.4 }}>
                    {row.m}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Trust & Safety Box (Anti-Sales Nakal & Alur Resmi) */}
        <div style={{ 
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
          borderRadius: 20, 
          padding: "clamp(24px, 4vw, 40px)", 
          color: "#fff",
          boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.25)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <ShieldCheck size={32} color="#10b981" />
            <div>
              <h3 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 800, margin: 0, color: "#f8fafc" }}>
                Jaminan 100% Bebas Sales Nakal & Transparansi Pembayaran XL Home
              </h3>
              <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: 14 }}>
                Bebas resiko uang dibawa lari oknum sales. Transaksi resmi, aman, dan langsung tercatat di sistem pusat XL Axiata.
              </p>
            </div>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
            gap: 16, 
            marginTop: 28,
            marginBottom: 28
          }}>
            {STEPS.map((s) => (
              <div key={s.step} style={{ 
                background: "rgba(255, 255, 255, 0.05)", 
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                borderRadius: 12, 
                padding: "16px",
                position: "relative"
              }}>
                <div style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  width: 28, 
                  height: 28, 
                  borderRadius: "50%", 
                  background: "#10b981", 
                  color: "#fff", 
                  fontWeight: 800, 
                  fontSize: 13,
                  marginBottom: 10
                }}>
                  {s.step}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px 0", color: "#f1f5f9" }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: 16,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 20
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cbd5e1" }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <span>
                <strong>Penting:</strong> Tim sales kami <u>TIDAK PERNAH</u> menerima titip tunai atau transfer ke rekening pribadi. Pembayaran hanya via nomor Virtual Account resmi XL setelah internet aktif.
              </span>
            </div>
            <a 
              href={waDaftarUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#037e64",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "10px 22px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "background 0.2s",
                boxShadow: "0 4px 12px rgba(3, 126, 100, 0.4)"
              }}
            >
              Konsultasi Pasang Baru Resmi <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
