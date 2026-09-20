"use client";
import { motion } from "framer-motion";
import { Ticket, HandCoins, MapPinned, Building2, HelpCircle, Map, MessageCircle } from "lucide-react";
// Seksi informatif homepage — port 1:1 dari xssr (server components, link relatif).

const AREA_CARDS = [
  { href: "/wifi-surakarta/", name: "Surakarta (Solo)", desc: "Fiber & Wifi Tanpa Kabel" },
  { href: "/wifi-sukoharjo/", name: "Sukoharjo", desc: "Fiber & Wifi Tanpa Kabel" },
  { href: "/wifi-karanganyar/", name: "Karanganyar", desc: "Fiber & Wifi Tanpa Kabel" },
  { href: "/wifi-klaten/", name: "Klaten", desc: "Wireless tersedia" },
  { href: "/wifi-boyolali/", name: "Boyolali", desc: "Fiber & Wifi Tanpa Kabel" },
];

const KENAPA = [
  {
    icon: MessageCircle,
    title: "Sigap Membalas Pesan",
    text: 'Chat langsung ke satu nomor sales yang sama dari awal konsultasi sampai internet aktif — bukan admin generik yang cuma "read" tanpa balasan.',
  },
  {
    icon: Ticket,
    title: "Kendala? Kami Buatkan Tiket Aduan",
    text: "Kalau internet bermasalah, Anda tidak perlu bingung sendiri hubungi call center. Kami yang langsung buatkan tiket aduan resmi ke pihak XL dan kawal sampai selesai.",
  },
  {
    icon: HandCoins,
    title: "Harga Transparan Sejak Awal",
    text: "Semua biaya paket dan instalasi dijelaskan di depan sebelum Anda daftar — tidak ada biaya tersembunyi yang muncul belakangan.",
  },
  {
    icon: MapPinned,
    title: "Paham Medan Solo Raya",
    text: "Sales lokal yang benar-benar tahu area Solo, Sukoharjo, Karanganyar, Klaten, dan Boyolali — bukan customer service pusat yang tidak familiar dengan lokasi Anda.",
  },
];

const TOOLS = [
  {
    href: "/tes-kecepatan/",
    emoji: "",
    title: "Tes Kecepatan Internet",
    desc: "Ukur download & upload ke server terdekat ±20 detik.",
  },
  {
    href: "/berapa-mbps-untuk-berapa-orang/",
    emoji: "",
    title: "Kalkulator Mbps",
    desc: "Isi perangkat aktif, dapat rekomendasi paket + link share.",
  },
  {
    href: "/panduan-fiber-vs-wireless/",
    emoji: "",
    title: "Kuis Fiber vs Wireless",
    desc: "5 pertanyaan, tahu mana yang pas untuk rumahmu.",
  },
  {
    href: "/250-mbps-untuk-berapa-orang/",
    emoji: "",
    title: "Panduan 250 Mbps",
    desc: "Untuk berapa orang? Tabel aktivitas + harga paket.",
  },
];

const KOTA_LINKS = [
  ["wifi-solo", "pasang WiFi Solo"],
  ["wifi-surakarta", "pasang WiFi Surakarta"],
  ["wifi-sukoharjo", "pasang WiFi Sukoharjo"],
  ["wifi-karanganyar", "pasang WiFi Karanganyar"],
  ["wifi-klaten", "pasang WiFi Klaten"],
  ["wifi-boyolali", "pasang WiFi Boyolali"],
];

export function AreaHome() {
  return (
    <>
      {/* AREA LAYANAN */}
      <section className="area-section" id="area">
        <div className="area-inner">
          <h2 className="section-title">Area Layanan XL SATU di Solo Raya</h2>
          <p className="section-sub">
            Kami melayani pemasangan internet rumah fiber optic dan wireless di
            5 kabupaten/kota Soloraya
          </p>
          <div className="area-grid">
            {AREA_CARDS.map((a) => (
              <a
                href={a.href}
                className="area-card"
                style={{ textDecoration: "none" }}
                key={a.href}
              >
                <Building2 size={24} color="var(--green)" />
                <div className="area-name">{a.name}</div>
                <div className="area-desc">{a.desc}</div>
              </a>
            ))}
            <a
              className="area-card"
              style={{
                background: "var(--green)",
                borderColor: "var(--green)",
                textDecoration: "none"
              }}
              href="https://wa.me/6287778999141?text=Halo,%20saya%20mau%20cek%20apakah%20area%20saya%20tersedia%20XL%20SATU"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HelpCircle size={24} color="#fff" />
              <div className="area-name" style={{ color: "#fff" }}>
                Area Lain?
              </div>
              <div
                className="area-desc"
                style={{ color: "rgba(255,255,255,.85)", fontWeight: 700 }}
              >
                Tanya Dulu
              </div>
            </a>
          </div>
          <p style={{ marginTop: 16, textAlign: "center", fontSize: 13 }}>
            <a
              href="/wifi-tanpa-fup-unlimited/"
              style={{ color: "var(--green)", fontWeight: 600 }}
            >
              Cek Paket Tanpa FUP
            </a>{" "}
            •{" "}
            <a
              href="/paket-wifi-tahunan-bayar-10-dapat-12/"
              style={{ color: "var(--green)", fontWeight: 600 }}
            >
              Paket Tahunan Bayar 10 Dapat 12
            </a>
          </p>
          <p
            style={{
              marginTop: 24,
              textAlign: "center",
              fontSize: 14,
              color: "#5a6b66",
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Cek harga dan ketersediaan jaringan di kotamu:{" "}
            {KOTA_LINKS.map(([slug, label], i) => (
              <span key={slug}>
                {i > 0 && (i === KOTA_LINKS.length - 1 ? ", dan " : ", ")}
                <a
                  href={`/${slug}/`}
                  style={{ color: "var(--green)", fontWeight: 600 }}
                >
                  {label}
                </a>
              </span>
            ))}
            .
          </p>
          <p style={{ marginTop: 10, textAlign: "center" }}>
            <a
              href="/area-layanan/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "var(--green-light)",
                color: "var(--green-dark)",
                fontWeight: 700,
                fontSize: 13.5,
                padding: "9px 22px",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              <Map size={16} style={{ flexShrink: 0 }} />
              Lihat Cakupan Lengkap: 5 Kota, 79 Kecamatan, 102 Kelurahan
            </a>
          </p>
        </div>
      </section>

    </>
  );
}

export function Kenapa() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <>
      {/* KENAPA PILIH KAMI */}
      <section className="area-section" style={{ background: "#f7faf9" }}>
        <div className="area-inner">
          <h2 className="section-title">Kenapa Pilih agen resmi Kami?</h2>
          <p className="section-sub">
            Bukan sekadar jualan ?" kami yang pegang tanggung jawab dari daftar
            sampai internet nyala
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="bento-grid"
              style={{ textAlign: "left" }}
          >
            {KENAPA.map((k) => {
const Icon = k.icon;
return (
              <motion.div
                key={k.title}
                variants={item}
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                style={{
                  background: "#fff",
                  border: "1px solid #e3ece9",
                  borderRadius: 14,
                  padding: 24,
                  transition: "box-shadow 0.3s"
                }}
              >
                <Icon size={28} color="var(--green)" />
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{k.title}</h3>
                <p style={{ fontSize: 14, color: "#5a6b66", margin: 0 }}>
                  {k.text}
                </p>
              </motion.div>
                );
              })}
          </motion.div>
          <p
            style={{
              marginTop: 24,
              textAlign: "center",
              fontSize: 14,
              color: "#5a6b66",
            }}
          >
            Mau tahu apa lagi yang perlu dicek sebelum daftar internet rumah
            manapun? Baca{" "}
            <a
              href="/5-hal-wajib-dicek-sebelum-pasang-wifi-rumah/"
              style={{ color: "var(--green)", fontWeight: 600 }}
            >
              5 hal wajib dicek sebelum pasang WiFi rumah
            </a>
            .
          </p>
        </div>
      </section>

    </>
  );
}

export function About() {
  return (
    <>
      {/* ABOUT */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-text">
            <h2>First Media Jadi XL SATU</h2>
            <p>
              Nikmati internet rumah tambah cepat dengan jaringan tepercaya
              XLSMART yang membuat setiap momen di rumah lebih nyaman bersama
              koneksi dan hiburan tanpa batas.
            </p>
          </div>
          <div className="about-video">
            <img
              src="/images/promo-first-media-xl-satu-banner.webp"
              alt="Promo First Media Jadi XL SATU"
              width={946}
              height={532}
              loading="lazy"
            />
            <div className="play-btn" style={{ cursor: "default" }}>
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export function Myxl() {
  return (
    <>
      {/* MYXL */}
      <section className="myxl-section">
        <div className="myxl-inner">
          <div className="myxl-img">
            <img
              src="/images/xl-cdn/myxl-app.png"
              alt="myXL App"
              width={743}
              height={656}
              loading="lazy"
            />
          </div>
          <div className="myxl-text">
            <h2>Atur Semua Layanan Kamu Cuma Butuh myXL</h2>
            <p>
              Dan nikmati berbagai promo eksklusif, poin myXL, serta fitur
              pendukung XL SATU lainnya
            </p>
            <div className="store-btns">
              <a
                href="https://apps.apple.com/id/app/myxl-cek-kuota-beli-paket-xl/id683141076"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/xl-cdn/badge-appstore.png"
                  alt="App Store"
                  width={120}
                  height={40}
                  loading="lazy"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.apps.MyXL"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/xl-cdn/badge-googleplay.png"
                  alt="Google Play"
                  width={135}
                  height={40}
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export function Tools() {
  return (
    <>
      {/* TOOLS GRATIS */}
      <section style={{ padding: "56px 24px", background: "#f5f5f5" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}
          >
            Tools Gratis XL SATU Solo Raya
          </h2>
          <p style={{ fontSize: 14, color: "#4b5563", marginBottom: 32 }}>
            Cek, hitung, dan tentukan sendiri — tanpa daftar, tanpa bayar.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
              textAlign: "left",
            }}
          >
            {TOOLS.map((t) => (
              <a
                key={t.href}
                href={t.href}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 20,
                  textDecoration: "none",
                  color: "inherit",
                  boxShadow: "0 2px 12px rgba(0,0,0,.06)",
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{t.emoji}</div>
                <div
                  style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export function Hubungi() {
  return (
    <>
      {/* HUBUNGI */}
      <section className="hubungi-section" id="hubungi">
        <div className="hubungi-inner">
          <div className="hubungi-text">
            <h2>Hubungi Kami</h2>
            <p>Kami siap bantu kamu untuk semua informasi tentang XL SATU</p>
            <div className="contact-grid">
              <div className="contact-box">
                <h3>Sales Center</h3>
                <div className="contact-item">
                  <a
                    href="https://wa.me/6287778999141"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-num"
                  >
                    0877-7899-9141
                  </a>
                </div>
                <div className="contact-item">
                  <a
                    href="https://wa.me/6287778999141?text=Halo%20kak,%20saya%20mau%20Daftar%20XL%20SATU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-num btn-daftar"
                  >
                    Daftar Sekarang!
                  </a>
                </div>
              </div>
              <div className="contact-box">
                <h3>Kami Siap Membantu Anda</h3>
                <div className="contact-item">
                  <span className="contact-label">
                    Hubungi Call Center kami di nomor berikut ini:
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">WhatsApp XL SATU Care</span>
                  <a
                    href="https://wa.me/628170010820"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-num"
                  >
                    08170010820
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">
                    Call Center (khusus pengguna XL)
                  </span>
                  <a href="tel:820" className="contact-num">
                    820
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Call Center (non-XL)</span>
                  <a href="tel:08170123442" className="contact-num">
                    08170123442
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="hubungi-img">
            <img
              src="/images/xl-cdn/support-team.webp"
              alt="Tim support XL SATU Solo Raya siap membantu"
              width={678}
              height={1080}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default function InfoSections() {
  return (
    <>
      <AreaHome />
      <Kenapa />
      <About />
      <Myxl />
      <Tools />
      <Hubungi />
    </>
  );
}
