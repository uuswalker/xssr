import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaFloat from "@/components/WaFloat";
import { Share2, Copy, CheckCircle2, Gift, Users, Wallet } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import ReferralShareClient from "@/components/referral/ReferralShareClient";

export const metadata: Metadata = {
  title: "Program Ajak Teman XL Home - Dapat Saldo!",
  description: "Dapatkan saldo GoPay/OVO Rp 50.000 hingga Rp 100.000 untuk setiap teman atau tetangga yang berhasil Anda ajak pasang XL Home Fiber.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReferralPage() {
  return (
    <>
      <Header />
      <PageTransition>
        <div style={{ backgroundColor: "#026b55", color: "white", padding: "60px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              <Gift size={16} /> Program Spesial Pelanggan XL Home
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
              Ajak Tetangga Pasang XL Home, <span style={{ color: "#fde68a" }}>Dapatkan Saldo Rp 50.000 hingga Rp 100.000!</span>
            </h1>
            <p style={{ fontSize: "clamp(16px, 2vw, 18px)", opacity: 0.9, lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
              Internet rumah sudah lancar? Yuk sebar kebaikannya ke teman, tetangga, atau anak kos lain. Untuk setiap orang yang berhasil terpasang, Anda akan mendapat komisi cair langsung ke *e-wallet* Anda.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "-40px auto 60px", padding: "0 24px", position: "relative", zIndex: 3 }}>
          <div style={{ background: "white", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", padding: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "#037e64", color: "white", borderRadius: "50%", fontSize: 16 }}>1</span>
                Cara Kerjanya Sangat Mudah
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <Users size={28} color="#037e64" style={{ flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Bagikan Info ke Teman</h3>
                    <p style={{ fontSize: 14, color: "#555" }}>Sebarkan link khusus atau bagikan nomor kontak Admin XL Home ke calon pelanggan.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <CheckCircle2 size={28} color="#037e64" style={{ flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Teman Mendaftar</h3>
                    <p style={{ fontSize: 14, color: "#555" }}>Pastikan teman Anda menyebutkan bahwa dia mendapat referensi dari Anda saat mendaftar via WhatsApp.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <Wallet size={28} color="#037e64" style={{ flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Terpasang = Cair!</h3>
                    <p style={{ fontSize: 14, color: "#555" }}>Setelah WiFi berhasil terpasang dan aktif di rumah teman Anda, komisi Rp 50.000 hingga Rp 100.000 akan langsung ditransfer ke OVO/GoPay/Dana Anda di hari yang sama.</p>
                  </div>
                </div>
              </div>
            </div>

            <ReferralShareClient />

          </div>
        </div>
      </PageTransition>
      <Footer />
      <WaFloat />
    </>
  );
}

