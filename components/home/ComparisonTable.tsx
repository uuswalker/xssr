"use client";

import { CheckCircle2, XCircle, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";
import { waLink } from "@/lib/site";

const COMPARISON_ROWS = [
  {
    feature: "Kecepatan vs Harga",
    xl: "Spark 250 Mbps cuma Rp 229.000/bln",
    i: "Rp 283.000 cuma dapat 30 Mbps",
    b: "Rp 277.500 cuma dapat 50-100 Mbps",
    m: "Rp 277.500++ baru dapat 150 Mbps",
  },
  {
    feature: "Modal Awal Pasang Baru",
    xl: "Rp 0 (Bebas Pasang & Modem Gratis)",
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
    m: "Rentan titip tunai ke sales (Banyak kasus nilep)",
  },
];

const STEPS = [
  { step: "1", title: "Registrasi Online", desc: "Kirim alamat & share loc via web atau WhatsApp resmi sales." },
  { step: "2", title: "Verifikasi ODP", desc: "Data & jarak tiang divalidasi langsung oleh sistem pusat XL." },
  { step: "3", title: "Bayar via VA Resmi XL", desc: "Hanya bayar lewat Virtual Account resmi XL. Dilarang titip tunai ke sales!" },
  { step: "4", title: "Jadwal Teknisi", desc: "Pilih tanggal & jam instalasi yang nyaman untuk keluarga Anda." },
  { step: "5", title: "Teknisi Pasang Rp 0", desc: "Pemasangan gratis tanpa pungli, internet langsung aktif siap dipakai." },
];

export default function ComparisonTable() {
  const waDaftarUrl = waLink("Halo Sales XL Home Solo, saya ingin daftar pasang baru paket Spark 250 Mbps (Rp 229.000/bln). Mohon panduan registrasi resmi:");

  return (
    <section id="bandingkan" style={{ padding: "72px 20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
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
            FAKTA RISET PASAR SOLO RAYA 2026
          </span>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.25 }}>
            Kenapa Warga Solo Raya Berbondong-bondong Pindah ke XL Home?
          </h2>
          <p style={{ color: "#475569", fontSize: "clamp(14px, 2vw, 16px)", maxWidth: 720, margin: "0 auto" }}>
            Bandingkan sendiri fakta riil kecepatan, modal awal, biaya tersembunyi, dan keamanan transaksi kami dengan provider lain di Surakarta, Sukoharjo, Karanganyar, dan Boyolali.
          </p>
        </div>

        {/* Comparison Table */}
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
                  XL HOME SOLO 🚀
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

        {/* Trust & Safety Box (Anti-Sales Nakal & Alur Resmi) */}
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
                <strong>Penting:</strong> Tim sales kami <u>TIDAK PERNAH</u> menerima titip tunai atau transfer ke rekening pribadi. Pembayaran hanya via nomor Virtual Account resmi XL.
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
