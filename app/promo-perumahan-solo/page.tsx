import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroSlider, QuickActions, FiturPills } from "@/components/home/Hero";
import PageTransition from "@/components/animations/PageTransition";
import dynamic from "next/dynamic";
import { MapPin, CheckCircle2 } from "lucide-react";

const PaketSection = dynamic(() => import("@/components/home/PaketSection"));
const InfoSections = dynamic(() => import("@/components/home/InfoSections"));
const Faq = dynamic(() => import("@/components/home/Faq"));
const WaFloat = dynamic(() => import("@/components/WaFloat"));
import { FAQ_HOME } from "@/lib/faq-home";
import {
  JsonLd,
  jsonLdFaq,
  jsonLdLocalBusiness,
  jsonLdWebsite,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Promo Pasang WiFi XL SATU untuk Perumahan Baru di Solo Raya",
  description:
    "Baru pindah rumah di cluster Solo Baru, Colomadu, atau Karanganyar? Pasang WiFi XL SATU sekarang, internet 100% tanpa FUP & gratis biaya pasang.",
  path: "/promo-perumahan-solo/",
});

const ScrollReveal = dynamic(() => import("@/components/animations/ScrollReveal"));
import Marquee from "@/components/animations/Marquee";

export default function PromoPerumahan() {
  return (
    <>
      <Header />
      <PageTransition>
        <div className="slider" id="slider" style={{ display: 'none' }}></div>
        <HeroSlider />
        <QuickActions />
        <FiturPills />
        
        {/* Custom Hero untuk Perumahan */}
        <section className="hero-lokal">
          <div className="hero-lokal-inner">
            <h1>
              Baru Pindah ke Rumah Baru di <span>Solo Raya?</span>
              <br />
              Pasang WiFi Sekarang, Besok Langsung Online!
            </h1>
            <p>
              Promo khusus warga perumahan / cluster di{" "}
              <strong>
                Solo Baru, Colomadu, Baki, dan Karanganyar
              </strong>
              . Nikmati internet fiber unlimited sekeluarga mulai Rp
              185.000/bulan — <strong>100% tanpa FUP, tanpa kuota tersembunyi</strong>.
            </p>
            <button
              type="button"
              id="btn-buka-cek-lokasi"
              className="btn-pilih"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, width: "auto", padding: "14px 32px",
                borderRadius: 999,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
              }}
            >
              <MapPin size={18} style={{ flexShrink: 0 }} />
              Cek Ketersediaan Jaringan di Rumah Saya
            </button>
            
            <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px", background: "#fef3c7", padding: "6px 14px", borderRadius: "999px", border: "1px solid #fde68a" }}>
              <span style={{ fontSize: "16px" }}>🏆</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#92400e" }}>Pemenang Opensignal 2026: Jaringan Paling Andal</span>
            </div>

            <div className="hero-lokal-stats">
              {[
                ["GRATIS", "Biaya Instalasi"],
                ["1 Hari", "Proses Pasang"],
                ["1000Mbps", "Kecepatan Maksimal"],
                ["24/7", "Bantuan Prioritas"],
              ].map(([num, label]) => (
                <div className="hero-lokal-stat" key={label}>
                  <span className="num">
                    {num === "1000Mbps" ? (
                      <>
                        1000<small style={{ fontSize: 16 }}>Mbps</small>
                      </>
                    ) : (
                      num
                    )}
                  </span>
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
                "Marketing Resmi XL SATU",
                "Teknisi Langsung Datang",
                "Bayar Setelah WiFi Menyala",
              ].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Marquee />
        <ScrollReveal delay={0.1}>
          <PaketSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <InfoSections />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Faq faqs={FAQ_HOME} />
        </ScrollReveal>
        <WaFloat />
      </PageTransition>
      <Footer />
      <JsonLd data={jsonLdWebsite()} />
      <JsonLd data={jsonLdLocalBusiness()} />
      <JsonLd data={jsonLdFaq(FAQ_HOME)} />
    </>
  );
}
