import { MessageCircle, ArrowRight, ShieldCheck, Zap, CheckCircle2, Award, Clock } from "lucide-react";
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
    a: 'Paket XL Home fiber optic di Solo mulai dari <strong>Rp 185.000/bulan</strong> untuk kecepatan 20 Mbps. Tersedia juga paket Spark 250 Mbps mulai Rp 229.000/bulan dengan Gratis Pasang Rp 0. Lihat <a href="/wifi-surakarta/">daftar lengkap paket dan harga</a>.',
  },
  {
    q: "Berapa lama pemasangan WiFi di Solo?",
    a: "Proses instalasi biasanya 1–3 hari kerja setelah pendaftaran online via WhatsApp. Untuk wilayah Kota Solo biasanya lebih cepat karena jaringan kabel Link Net sudah terpasang luas di semua kecamatan.",
  },
  {
    q: "Apakah XL Home ada di semua kecamatan Solo?",
    a: "Ya! Jaringan XL Home sudah terpasang di seluruh 5 kecamatan Kota Solo: Laweyan, Serengan, Pasar Kliwon, Jebres, dan Banjarsari. Hubungi sales kami untuk cek ketersediaan tiang ODP di alamat spesifik Anda.",
  },
  {
    q: "Apakah ada paket WiFi untuk kos atau kontrakan di Solo?",
    a: 'Ya! Paket XL Home Starter 20 Mbps (Rp 185.000/bulan) sangat cocok untuk kos dan kontrakan. Untuk kebutuhan lebih besar, tersedia paket hingga 1000 Mbps. Baca <a href="/panduan-wifi-kos-solo/">panduan WiFi untuk kos di Solo</a>.',
  },
  {
    q: "Bagaimana cara daftar XL Home di Solo?",
    a: 'Cukup hubungi sales kami via WhatsApp di <strong>0877-7899-9141</strong>. Kirim nama, alamat lengkap / share lokasi GPS, dan paket yang diinginkan. Tim kami akan memverifikasi tiang terdekat dan mengatur jadwal teknisi. Baca <a href="/cara-daftar-pasang-wifi-xl-home-solo/">panduan lengkap cara daftar</a>.',
  },
  {
    q: "Berapa Mbps yang cukup untuk rumah di Solo?",
    a: 'Untuk keluarga 3–4 orang dengan WFH dan streaming, 100 Mbps sudah cukup nyaman. Untuk 5 orang ke atas atau rumah dengan TV 4K dan game online, pilih Spark 250 Mbps (Rp 229rb/bln). Lihat <a href="/berapa-mbps-untuk-berapa-orang/">kalkulator berapa Mbps untuk berapa orang</a>.',
  },
  {
    q: "Apakah XL Home di Solo ada FUP?",
    a: 'Paket Fiber XL Home di Solo 100% TIDAK ADA FUP sama sekali — unlimited murni tanpa penurunan kecepatan di akhir bulan. Baca <a href="/wifi-tanpa-fup-unlimited/">penjelasan lengkap soal FUP XL Home</a>.',
  },
  {
    q: "Apakah ada WiFi tanpa kabel di Solo?",
    a: "Ya, XL Home menyediakan paket Wireless (FWA) untuk area pelosok Solo Raya yang belum terjangkau tiang fiber optik. Hubungi sales kami untuk cek ketersediaan di alamat Anda.",
  },
  {
    q: "Apa perbedaan XL Home dan Internet Rakyat di Solo?",
    a: 'XL Home menggunakan jaringan fiber optik Link Net kecepatan hingga 1000 Mbps tanpa FUP dan simetris 1:1. Internet Rakyat adalah program subsidi dengan kecepatan terbatas. Baca <a href="/internet-rakyat-vs-xl-home/">perbandingan Internet Rakyat vs XL Home</a> untuk detail lengkap.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const base = pageMetadata({
    title: "Pasang WiFi Solo Murah Mulai 185rb [Promo Resmi 2026]",
    description:
      "Promo resmi pasang WiFi Solo 2026 mulai 185rb/bln! 100% Fiber Optic Tanpa FUP + Gratis Pasang Rp 0. Chat WhatsApp Sales Resmi: 0877-7899-9141.",
    path: "/wifi-solo/",
    image: "/images/banner-xlsatu-jadi-xlhome.jpg",
  });
  return {
    ...base,
    keywords: [
      "pasang wifi solo",
      "pasang wifi solo murah",
      "wifi murah solo 100 ribuan",
      "biaya pasang wifi solo",
      "harga pasang wifi solo",
      "rekomendasi wifi solo",
      "provider wifi solo terbaik",
      "pasang wifi surakarta",
      "xl home solo",
      "xl satu solo",
    ],
    openGraph: {
      ...base.openGraph,
      title: "Pasang WiFi Solo Murah Mulai 185rb [Promo Resmi 2026]",
      description:
        "Promo resmi pasang WiFi Solo 2026 mulai 185rb/bln! 100% Fiber Optic Tanpa FUP + Gratis Pasang Rp 0. Chat WhatsApp Sales Resmi: 0877-7899-9141.",
    },
  };
}

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "XL Home Pasang WiFi Solo Murah",
  url: "https://xlhomesolo.com/wifi-solo/",
  description:
    "Pasang WiFi Solo murah 2026 mulai Rp 185.000/bulan — XL Home fiber optic unlimited 20–1000 Mbps tanpa FUP, gratis biaya pasang.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://xlhomesolo.com/#business",
    name: "XL Home Solo Raya",
    url: "https://xlhomesolo.com",
    telephone: "+6287778999141",
    image: "https://xlhomesolo.com/images/banner-xlsatu-jadi-xlhome.jpg",
    priceRange: "Rp185.000 – Rp399.000/bulan",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Slamet Riyadi No. 120",
      addressLocality: "Surakarta",
      addressRegion: "Jawa Tengah",
      postalCode: "57100",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.5666,
      longitude: 110.8166,
    },
    areaServed: [
      { "@type": "City", name: "Surakarta" },
      { "@type": "City", name: "Solo" },
      { "@type": "AdministrativeArea", name: "Jebres" },
      { "@type": "AdministrativeArea", name: "Banjarsari" },
      { "@type": "AdministrativeArea", name: "Laweyan" },
      { "@type": "AdministrativeArea", name: "Pasar Kliwon" },
      { "@type": "AdministrativeArea", name: "Serengan" },
      { "@type": "City", name: "Sukoharjo" },
      { "@type": "City", name: "Karanganyar" },
      { "@type": "City", name: "Boyolali" },
      { "@type": "City", name: "Klaten" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "148",
      bestRating: "5",
    },
    serviceType: "Internet Service Provider",
    sameAs: [
      "https://wa.me/xlhomesolo",
      "https://satu.xl.co.id",
      "https://maps.app.goo.gl/exTMsZCCVmCvtZzs9",
      "https://www.facebook.com/profile.php?id=61594596763493",
      "https://www.instagram.com/xlhome.sukoharjo/",
    ],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Paket WiFi Murah Solo 2026",
    itemListElement: [
      {
        "@type": "Offer",
        name: "XL Home Starter 20 Mbps",
        price: "185000",
        priceCurrency: "IDR",
        description: "Paket internet fiber optic 20 Mbps unlimited tanpa FUP untuk kos dan keluarga kecil di Solo.",
      },
      {
        "@type": "Offer",
        name: "XL Home Spark 250 Mbps",
        price: "229000",
        priceCurrency: "IDR",
        description: "Paket internet super cepat 250 Mbps bebas FUP gratis pasang Rp 0 untuk streaming 4K & WFH.",
      },
    ],
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
    <div>
      <Watermark token="3D40D863" />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS["wifi-solo"] || "" }} />
      <header role="banner">
        <div className="header-inner">
          <div className="logo">
            <a href="/" title="XL HOME">
              <img
                src="/images/xl-home-logo.png"
                alt="XL HOME"
                width={106}
                height={85}
                loading="lazy"
              />
            </a>
          </div>
          <nav role="navigation">
            <a href="/wifi-surakarta/">Paket &amp; Harga</a>
            <a href="/area-layanan/">Area Layanan</a>
            <a href="#komparasi">Komparasi Provider</a>
            <a href="/wifi-surakarta/#bantuan">Bantuan</a>
          </nav>
          <a
            href="https://wa.me/6287778999141?text=Halo%20Sales%20XL%20Home%20Solo%2C%20saya%20mau%20pasang%20wifi%20murah%20di%20Solo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-header"
          >
            <MessageCircle size={18} style={{ display: "inline-block", verticalAlign: "middle" }} /> Tanya Dulu
          </a>
        </div>
      </header>

      <main>
        {/* HERO SECTION - ABOVE THE FOLD OPTIMIZED FOR SEARCH TERMINATION & HIGH CTR */}
        <section className="hero">
          <div className="breadcrumb">
            <a href="/">Beranda</a> / Pasang WiFi Solo Murah
          </div>
          
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#e6f7f3", color: "#026b55", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", marginBottom: "14px" }}>
            <Zap size={15} /> Promo Terbatas 2026: Bebas Biaya Instalasi Teknisi Rp 0
          </div>

          <h1>
            Pasang WiFi <span>Solo</span> Murah Mulai 185rb [Promo Resmi 2026]
          </h1>
          
          <p>
            Layanan resmi pasang WiFi internet rumah fiber optic di Kota Solo (Surakarta) &amp; sekitarnya. 
            Koneksi 100% Fiber Simetris tanpa batas FUP, gratis biaya instalasi teknisi, dan modem WiFi dipinjamkan cuma-cuma.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", margin: "20px 0 24px" }}>
            <span style={{ background: "#ffffff", border: "1px solid #d1fae5", color: "#065f46", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={15} color="#059669" /> Mulai 185rb/bulan
            </span>
            <span style={{ background: "#ffffff", border: "1px solid #d1fae5", color: "#065f46", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={15} color="#059669" /> Gratis Pasang Rp 0
            </span>
            <span style={{ background: "#ffffff", border: "1px solid #d1fae5", color: "#065f46", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={15} color="#059669" /> 100% Tanpa FUP Murni
            </span>
            <span style={{ background: "#ffffff", border: "1px solid #d1fae5", color: "#065f46", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={15} color="#059669" /> Teknisi Cepat 1-2 Hari
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
            <a
              href="https://wa.me/6287778999141?text=Halo%20Sales%20XL%20Home%20Solo%2C%20saya%20mau%20pasang%20WiFi%20murah%20di%20Solo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <MessageCircle size={18} /> Chat Sales WhatsApp (Aktif 24 Jam)
            </a>
            <a
              href="#komparasi"
              className="btn-hero"
              style={{ background: "#ffffff", color: "#037e64", border: "2px solid #037e64", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Lihat Komparasi Provider <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section className="section">
          {/* GOOGLE AI OVERVIEW SNIPPET TARGET BLOCK (#0) */}
          <div className="explain-card" style={{ border: "2px solid #05a986", background: "#f8fdfb" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#e6f7f3", color: "#026b55", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>
              <Award size={14} /> Ringkasan Resmi 2026
            </div>
            <h2 style={{ fontSize: "22px", marginTop: "4px", marginBottom: "12px" }}>
              Berapa Biaya &amp; Rekomendasi Pasang WiFi di Solo 2026?
            </h2>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#1f2937" }}>
              Biaya pasang WiFi di Solo (Surakarta) tahun 2026 termurah mulai <strong>Rp 185.000/bulan</strong> untuk kecepatan 20 Mbps (Paket XL Home Starter) dengan promo <strong>Gratis Biaya Pasang Rp 0</strong>. Untuk pemakaian keluarga dan streaming 4K bebas lemot, rekomendasi terbaik adalah <strong>Paket Spark 250 Mbps seharga Rp 229.000/bulan</strong> (100% Fiber Optic simetris tanpa batasan kuota FUP).
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginTop: "16px" }}>
              <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Paket Termurah Solo</span>
                <strong style={{ fontSize: "15px", color: "#037e64" }}>Starter 20 Mbps: Rp 185.000/bln</strong>
              </div>
              <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Rekomendasi Keluarga</span>
                <strong style={{ fontSize: "15px", color: "#037e64" }}>Spark 250 Mbps: Rp 229.000/bln</strong>
              </div>
              <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Biaya Pasang Baru</span>
                <strong style={{ fontSize: "15px", color: "#059669" }}>Rp 0 (Gratis Promo)</strong>
              </div>
              <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Kebijakan Kuota</span>
                <strong style={{ fontSize: "15px", color: "#059669" }}>100% Unlimited Tanpa FUP</strong>
              </div>
            </div>
          </div>

          <div className="explain-card" style={{ marginTop: "24px" }}>
            <h2>Solo = Surakarta</h2>
            <p>
              Banyak orang mengenal kota ini dengan nama &quot;Solo&quot;,
              padahal nama resminya adalah <strong>Kota Surakarta</strong>.
              Kedua nama ini merujuk ke kota yang sama. Jadi kalau Anda mencari
              &quot;pasang wifi solo murah&quot; atau &quot;pasang wifi
              surakarta&quot;, hasilnya sama — Anda akan terhubung dengan sales
              resmi lokal kami yang melayani seluruh wilayah kota.
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

          {/* PAKET FAVORIT SOLO */}
          <div className="explain-card" style={{ marginTop: "24px" }}>
            <h2>Rekomendasi Paket WiFi Murah di Solo (Kategori 100 Ribuan)</h2>
            <p>
              Mencari <strong>WiFi murah 100 ribuan di Solo</strong> yang kecepatannya stabil tanpa FUP? 
              Paket <strong>XL Home Starter 20 Mbps</strong> (Rp 185.000/bln nett) menjadi pilihan paling favorit 
              untuk kos mahasiswa di Jebres (UNS/ISI) dan Banjarsari, maupun hunian keluarga di Laweyan, Serengan, dan Pasar Kliwon.
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: "12px", lineHeight: "1.8" }}>
              <li><strong>Gratis Biaya Pasang (Rp 0):</strong> Promo bulan ini bebas biaya instalasi teknisi (hemat Rp 99.000).</li>
              <li><strong>100% Tanpa FUP:</strong> Kuota unlimited murni, bebas streaming YouTube, TikTok, dan Zoom tanpa penurunan kecepatan akhir bulan.</li>
              <li><strong>Router Fiber Optic Gratis:</strong> Perangkat WiFi sudah include dipinjamkan selama berlangganan.</li>
            </ul>
          </div>

          {/* PILLAR 2: DIRECT COMPARISON MATRIX SOLO RAYA */}
          <div id="komparasi" className="explain-card" style={{ marginTop: "32px", padding: "24px" }}>
            <h2>Perbandingan Provider WiFi di Solo 2026: Mana yang Paling Murah &amp; Bebas FUP?</h2>
            <p style={{ marginBottom: "18px" }}>
              Sebelum memutuskan langganan, simak perbandingan jujur penyedia internet rumah populer di Solo Raya berikut:
            </p>
            
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "580px" }}>
                <thead>
                  <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                    <th style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Provider</th>
                    <th style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Paket &amp; Harga Termurah</th>
                    <th style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Kebijakan FUP</th>
                    <th style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Biaya Pasang &amp; Alat</th>
                    <th style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Kecepatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#ecfdf5", fontWeight: "600" }}>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb", color: "#065f46" }}>
                      ⭐ <strong>XL Home Solo</strong>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb", color: "#065f46" }}>
                      <strong>Rp 185rb</strong> (20M)<br/><strong>Rp 229rb</strong> (250M)
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb", color: "#059669" }}>
                      <strong>100% Bebas FUP</strong>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb", color: "#059669" }}>
                      <strong>Gratis Rp 0</strong> (Dipinjamkan)
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>
                      Simetris 1:1
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>IndiHome Solo</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Rp 280.000+ (30 Mbps)</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb", color: "#dc2626" }}>Ada Batas FUP</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Rp 150rb – Rp 500rb</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Asimetris 1:3</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Biznet Solo</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Rp 250.000+ (30 Mbps)</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Tanpa FUP</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb", color: "#dc2626" }}>Beli Modem / Pasang</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Simetris 1:1</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>MyRepublic Solo</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Rp 200.000-an (30 Mbps)</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Tanpa FUP</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Promo Tertentu</td>
                    <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Simetris 1:1</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: "#e6f7f3", borderRadius: "10px", padding: "14px 18px", marginTop: "16px", fontSize: "14px", color: "#065f46" }}>
              💡 <strong>Kesimpulan Pemilihan:</strong> XL Home Solo memberikan *value for money* tertinggi di Solo Raya karena dengan <strong>Rp 229.000/bulan</strong> pelanggan sudah mendapatkan kecepatan raksasa <strong>250 Mbps</strong>, bebas biaya pasang, dan kuota unlimited tanpa FUP.
            </div>
          </div>

          <h2 className="section-title">Wilayah Kota Solo yang Kami Layani</h2>
          <p className="section-sub">
            5 kecamatan di Kota Solo (Surakarta) sudah terjangkau jaringan fiber optik FTTH XL Home (transformasi resmi XL SATU).
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
            Chat langsung dengan tim support lokal kami yang paham wilayah Solo Raya.
            Gratis konsultasi &amp; pengecekan tiang kabel ODP depan rumah.
          </p>
          <a
            href="https://wa.me/6287778999141?text=Halo%20Sales%20XL%20Home%20Solo%2C%20saya%20mau%20pasang%20wifi%20murah%20di%20Solo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta"
          >
            <MessageCircle size={18} style={{ display: "inline-block", verticalAlign: "middle" }} /> Chat WhatsApp: 0877-7899-9141
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
              ["/cara-daftar-pasang-wifi-xl-home-solo/", "Cara Daftar"],
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
                src="/images/xl-home-logo.png"
                alt="XL HOME"
                className="footer-logo"
                loading="lazy"
              />
              <div className="footer-copy">
                Copyright © 2026 XL Home Solo Raya. All rights reserved.
              </div>
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                Dilarang menyalin/menggandakan konten situs ini tanpa izin
                tertulis.
              </div>
              <div style={{ fontSize: 11, marginTop: 4 }}>
                <a
                  href="https://wa.me/6287778999141?text=Halo%20Sales%20XL%20Home%20Solo%2C%20mau%20tanya%20promo%20pasang%20WiFi%20terbaru"
                  style={{ color: "rgba(255,255,255,.6)", textDecoration: "none" }}
                >
                  0877-7899-9141
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

        <WaFloat small="Info XL Home Solo" />
      </main>
      <JsonLd data={SERVICE_JSONLD} />
    </div>
  );
}
