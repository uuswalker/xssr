import { MessageCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import WaFloat from "@/components/WaFloat";
import Watermark from "@/components/Watermark";
import Faq from "@/components/home/Faq";
import { PAGE_CSS } from "@/lib/page-css";
import { JsonLd, pageMetadata } from "@/lib/seo";

const SOLO_FAQS = [
  {
    q: "Kenapa ada dua nama, Solo dan Surakarta?",
    a: 'Kota ini secara resmi bernama Surakarta, tapi masyarakat lebih mengenalnya dengan sebutan Solo. Keduanya merujuk ke kota yang sama. Nama "Solo" berasal dari sungai yang melintasi kota ini.',
  },
  {
    q: "Berapa harga WiFi di Solo?",
    a: 'Paket XL SATU fiber optic di Solo mulai dari <strong>Rp 185.000/bulan</strong> untuk kecepatan 20 Mbps. Tersedia juga paket wireless mulai Rp 650.000/bulan (sistem 3 bulan + 1 gratis). Lihat <a href="/wifi-surakarta/">daftar lengkap paket dan harga</a>.',
  },
  {
    q: "Berapa lama pemasangan WiFi di Solo?",
    a: "Proses instalasi biasanya 3–7 hari kerja setelah pendaftaran. Untuk wilayah Kota Solo biasanya lebih cepat karena jaringan sudah terpasang luas di semua kecamatan.",
  },
  {
    q: "Apakah XL SATU ada di semua kecamatan Solo?",
    a: "Ya! Jaringan XL SATU sudah terpasang di seluruh 5 kecamatan Kota Solo: Laweyan, Serengan, Pasar Kliwon, Jebres, dan Banjarsari. Hubungi sales kami untuk cek ketersediaan di alamat spesifik Anda.",
  },
  {
    q: "Apakah ada paket WiFi untuk kos atau kontrakan di Solo?",
    a: 'Ya! Paket XL SATU Starter 20 Mbps (Rp 185.000/bulan) cocok untuk kos dan kontrakan. Untuk kebutuhan lebih besar, tersedia paket hingga 1000 Mbps. Baca <a href="/panduan-wifi-kos-solo/">panduan WiFi untuk kos di Solo</a>.',
  },
  {
    q: "Bagaimana cara daftar XL SATU di Solo?",
    a: 'Cukup hubungi sales kami via WhatsApp di <strong>0877-7899-9141</strong>. Kirim nama, alamat lengkap, dan paket yang diinginkan. Tim kami akan memproses dan mengatur jadwal survei serta instalasi. Baca <a href="/cara-daftar-pasang-wifi-xl-satu-solo/">panduan lengkap cara daftar</a>.',
  },
  {
    q: "Berapa Mbps yang cukup untuk rumah di Solo?",
    a: 'Untuk keluarga 3–4 orang dengan WFH dan streaming, 100 Mbps sudah cukup nyaman. Untuk 5 orang ke atas atau rumah dengan smart home, pilih 250–400 Mbps. Lihat <a href="/berapa-mbps-untuk-berapa-orang/">panduan berapa Mbps untuk berapa orang</a> untuk kalkulasi lebih presisi.',
  },
  {
    q: "Apakah XL SATU di Solo ada FUP?",
    a: 'Paket Fiber XL SATU di Solo tidak ada FUP sama sekali — unlimited tanpa batas kuota. Paket Wireless (FWA) ada batas wajar 1 TB/bulan yang sangat jarang tersentuh pengguna rumahan. Baca <a href="/wifi-tanpa-fup-unlimited/">penjelasan lengkap soal FUP XL SATU</a>.',
  },
  {
    q: "Apakah ada WiFi tanpa kabel di Solo?",
    a: "Ya, XL SATU menyediakan paket Wireless (FWA) untuk area Solo yang belum terjangkau kabel fiber optic. Cocok untuk perumahan baru atau lokasi yang sulit pemasangan kabel. Hubungi sales kami untuk cek ketersediaan di alamat Anda.",
  },
  {
    q: "Apa perbedaan XL SATU dan Internet Rakyat di Solo?",
    a: 'XL SATU menggunakan jaringan fiber optik XLSMART dengan kecepatan hingga 1000 Mbps dan tanpa FUP (untuk paket Fiber). Internet Rakyat adalah program subsidi pemerintah dengan kecepatan terbatas. Baca <a href="/internet-rakyat-vs-xl-satu/">perbandingan Internet Rakyat vs XL SATU</a> untuk detail lengkap.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const base = pageMetadata({
    title: "Pasang WiFi di Solo (Surakarta) Mulai Rp 185rb/bln | XL SATU",
    description:
      "Pasang WiFi di Solo (Surakarta) mulai Rp 185.000/bulan — XL SATU fiber optic unlimited, cover 5 kecamatan: Laweyan, Jebres, Banjarsari, Serengan, Pasar Kliwon. Cek ketersediaan.",
    path: "/wifi-solo/",
    image: "/images/promo-wifi-rumah-koneksi-pasti.webp",
  });
  return {
    ...base,
    keywords:
      "pasang wifi solo gerbang, wifi solo laweyan jebres banjarsari, pasang wifi solo surakarta sukoharjo karanganyar klaten boyolali".split(
        /,?\s+/
      ),
    openGraph: {
      ...base.openGraph,
      title: "Pasang WiFi di Solo (Surakarta) Mulai Rp 185rb/bln | XL SATU",
      description:
        "Pasang WiFi di Solo (Surakarta) mulai Rp 185.000/bulan — XL SATU fiber optic unlimited tanpa FUP, cover 5 kecamatan Kota Solo. Cek ketersediaan.",
    },
  };
}

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "XL SATU Internet Rumah Solo",
  description:
    "Pasang WiFi di Solo (Surakarta) — paket XL SATU fiber optic unlimited 20–1000 Mbps, mulai Rp 185.000/bulan.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://xlsatusolo.com/#business",
    name: "XL SATU Solo Raya",
    url: "https://xlsatusolo.com",
    telephone: "+6287778999141",
    image: "https://xlsatusolo.com/images/promo-wifi-rumah-koneksi-pasti.webp",
    priceRange: "Rp185.000 – Rp399.000/bulan",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surakarta",
      addressRegion: "Jawa Tengah",
      postalCode: "57100",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.57533,
      longitude: 110.82481,
    },
    areaServed: [
      { "@type": "City", name: "Surakarta" },
      { "@type": "City", name: "Solo" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
    serviceType: "Internet Service Provider",
    sameAs: ["https://satu.xl.co.id", "https://maps.app.goo.gl/exTMsZCCVmCvtZzs9"],
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "185000",
    highPrice: "399000",
    priceCurrency: "IDR",
    offerCount: "9",
  },
};

export default function Page() {
  return (
    <div >
      <Watermark token="3D40D863" />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS["wifi-solo"] || "" }} />
      <header role="banner">
        <div className="header-inner">
          <div className="logo">
            <a href="/" title="XL SATU">
              <img
                src="/images/logo-xl-satu.png"
                alt="XL SATU"
                width={106}
                height={85}
                loading="lazy"
              />
            </a>
          </div>
          <nav role="navigation">
            <a href="/wifi-surakarta/">Paket &amp; Harga</a>
            <a href="/area-layanan/">Area Layanan</a>
            <a href="/wifi-surakarta/#bantuan">Bantuan</a>
          </nav>
          <a
            href="https://wa.me/6287778999141?text=Daftar%20XL%20SATU"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-header"
          >
            <MessageCircle size={18} style={{ display: "inline-block", verticalAlign: "middle" }} /> Hubungi Sales
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="breadcrumb">
            <a href="/">Beranda</a> / Pasang WiFi Solo
          </div>
          <h1>
            Pasang WiFi Rumah di <span>Solo</span>
          </h1>
          <p>
            Solo dan Surakarta adalah nama yang sama untuk satu kota. XL SATU
            melayani pemasangan internet rumah fiber optic &amp; wireless di
            seluruh wilayah Kota Solo (Surakarta).
          </p>
          <a
            href="https://wa.me/6287778999141?text=Halo%20kak,%20saya%20mau%20info%20XL%20SATU%20di%20Solo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero"
          >
            <MessageCircle size={18} style={{ display: "inline-block", verticalAlign: "middle" }} /> Chat Sales Solo
          </a>
        </section>

        <section className="section">
          <div className="explain-card">
            <h2> Solo = Surakarta</h2>
            <p>
              Banyak orang mengenal kota ini dengan nama &quot;Solo&quot;,
              padahal nama resminya adalah <strong>Kota Surakarta</strong>.
              Kedua nama ini merujuk ke kota yang sama. Jadi kalau Anda mencari
              &quot;pasang wifi solo&quot; atau &quot;pasang wifi
              surakarta&quot;, hasilnya sama — Anda akan terhubung dengan sales
              kami yang melayani seluruh wilayah kota.
            </p>
            <p>
              Untuk melihat daftar paket lengkap, harga, dan detail coverage,
              kunjungi:
            </p>
          </div>

          <div className="link-card">
            <h3>Lihat Paket WiFi Surakarta</h3>
            <p>7 paket fiber + 3 paket wireless, harga mulai Rp 185.000/bulan.</p>
            <a href="/wifi-surakarta/" className="btn-link">
              Lihat Semua Paket <ArrowRight size={16} />
            </a>
          </div>

          <h2 className="section-title">Wilayah Kota Solo yang Kami Layani</h2>
          <p className="section-sub">
            5 kecamatan di Kota Solo (Surakarta) sudah terjangkau jaringan XL
            SATU fiber &amp; wireless.
          </p>
          <div className="kecamatan">
            {["Laweyan", "Serengan", "Pasar Kliwon", "Jebres", "Banjarsari"].map(
              (k) => (
                <span key={k}>{k}</span>
              )
            )}
          </div>
        </section>

        <Faq
          faqs={SOLO_FAQS}
          activeClass="active"
          title="Pertanyaan Umum tentang WiFi di Solo"
          sub="Jawaban atas pertanyaan yang paling sering ditanyakan warga Solo soal pasang internet rumah."
        />

        <section className="cta-section">
          <h2>Siap Pasang WiFi di Solo?</h2>
          <p>
            Chat langsung dengan sales lokal kami yang paham wilayah Solo Raya.
            Gratis konsultasi, tanpa komitmen.
          </p>
          <a
            href="https://wa.me/6287778999141?text=Halo%20kak,%20saya%20mau%20info%20XL%20SATU%20di%20Solo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta"
          >
            <MessageCircle size={18} style={{ display: "inline-block", verticalAlign: "middle" }} /> 0877-7899-9141
          </a>
        </section>

        <div className="related">
          <h3>Lihat Juga:</h3>
          <div className="related-grid">
            {[
              ["/wifi-surakarta/", "Paket WiFi Surakarta"],
              ["/wifi-sukoharjo/", "WiFi Sukoharjo"],
              ["/wifi-karanganyar/", "WiFi Karanganyar"],
              ["/wifi-klaten/", "WiFi Klaten"],
              ["/wifi-boyolali/", "WiFi Boyolali"],
              ["/area-layanan/", "Area Layanan Lengkap"],
              ["/cara-daftar-pasang-wifi-xl-satu-solo/", "Cara Daftar"],
              ["/kebijakan-privasi/", "Kebijakan Privasi"],
            ].map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
        </div>

        <footer>
          <div className="footer-inner">
            <div className="footer-left">
              <img
                src="/images/logo-xl-satu.png"
                alt="XL SATU"
                className="footer-logo"
                loading="lazy"
              />
              <div className="footer-copy">
                Copyright © 2026 XL SATU Solo Raya. All rights reserved.
              </div>
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                Dilarang menyalin/menggandakan konten situs ini tanpa izin
                tertulis.
              </div>
              <div style={{ fontSize: 11, marginTop: 4 }}>
                <a
                  href="https://wa.me/xlsatusolo"
                  style={{ color: "rgba(255,255,255,.6)", textDecoration: "none" }}
                >
                  wa.me/xlsatusolo
                </a>{" "}
                • 0877-7899-9141
              </div>
            </div>
            <div className="footer-links">
              <a href="/area-layanan/">Area Layanan</a>
              <a href="/kebijakan-privasi/">Privasi &amp; Cookie</a>
            </div>
          </div>
        </footer>

        <WaFloat small="Info XL SATU Solo" />
      </main>
      <JsonLd data={SERVICE_JSONLD} />
    </div>
  );
}
