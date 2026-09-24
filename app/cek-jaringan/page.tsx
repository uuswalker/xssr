import React from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import PageTransition from "@/components/animations/PageTransition";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { pageMetadata } from "@/lib/seo";
import { MapPin, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Cek Ketersediaan Jaringan XL SATU | Fiber & Wireless",
  description: "Cek langsung apakah lokasi rumah Anda sudah tercover jaringan XL SATU — fiber optic atau wireless. Sistem otomatis deteksi opsi terbaik untuk lokasimu dalam 1 menit.",
  path: "/cek-jaringan/",
});

export default function CekJaringanPage() {
  return (
    <>
      <Header />
      <PageTransition>
        <section className="hero-lokal">
          <div className="hero-lokal-inner">
            <ScrollReveal>
              <h1>
                Cek Ketersediaan <span>Jaringan XL SATU</span>
              </h1>
              <p>
                Ketahui dengan akurat apakah lokasi rumah Anda sudah terjangkau jaringan XL SATU —
                fiber optic maupun wireless. Sistem kami otomatis mendeteksi opsi terbaik
                untuk lokasimu dalam hitungan detik.
              </p>
              
              <div style={{ margin: "20px 0" }}>
                <button
                  type="button"
                  id="btn-buka-cek-lokasi"
                  className="btn-pilih btn-cek-lokasi-trigger"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, width: "auto", padding: "16px 36px",
                    borderRadius: 999,
                    fontSize: 16,
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    margin: "0 auto",
                  }}
                >
                  <MapPin size={20} style={{ flexShrink: 0 }} />
                  Mulai Cek Titik Lokasi Sekarang
                </button>
                <div style={{ marginTop: "12px", fontSize: "12px", color: "#666" }}>
                  * Izinkan akses GPS/Lokasi pada browser Anda untuk hasil akurat
                </div>
              </div>

              <div className="hero-lokal-stats">
                {[
                  ["Deteksi", "Fiber & Wireless"],
                  ["1 Menit", "Proses Pengecekan"],
                  ["Gratis", "Tanpa Biaya"],
                ].map(([num, label]) => (
                  <div className="hero-lokal-stat" key={label}>
                    <span className="num">{num}</span>
                    <span className="label">{label}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "8px 22px",
                  fontSize: 13.5,
                  color: "#3d524c",
                  fontWeight: 600,
                }}
              >
                {[
                  "Lokasi akurat via Google Maps",
                  "Data 100% aman",
                  "Langsung terhubung ke Sales",
                ].map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0 }} />
                    {t}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section style={{ padding: "40px 20px", textAlign: "center", background: "#f8f9fa", borderTop: "1px solid #eaeaea" }}>
          <ScrollReveal delay={0.2}>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
              Lebih nyaman kirim Share Location manual via WhatsApp?
            </p>
            <a 
              href="https://wa.me/6287778999141?text=Halo%20kak,%20tolong%20bantu%20cek%20ketersediaan%20jaringan%20XL%20SATU%20di%20lokasi%20rumah%20saya.%20(Berikut%20saya%20kirimkan%20Share%20Location-nya)"
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px", 
                color: "#16a34a", fontWeight: "bold", textDecoration: "none",
                fontSize: "16px"
              }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: "20px" }}></i>
              Chat Admin via WhatsApp
            </a>
          </ScrollReveal>
        </section>

      </PageTransition>
      <Footer />
      <WaFloat />
    </>
  );
}
