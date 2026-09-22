"use client";

import { preload } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";

import { MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { WA_DAFTAR, WA_INFO, waLink } from "@/lib/site";

const SLIDES = [
  {
    imgDesktop: "/images/banner-first-media.jpg",
    imgMobile: "/images/promo-wifi-rumah-koneksi-pasti.webp",
    alt: "Promo First Media Jadi XL SATU",
    eager: true,
    action: "wa" as const,
  },
  {
    imgDesktop: "/images/banner-makin-hemat.jpg",
    imgMobile: "/images/promo-paket-internet.webp",
    alt: "Promo Makin Hemat",
    eager: false,
    action: "wa" as const,
  },
  {
    imgDesktop: "/images/banner-bayar-tagihan.jpg",
    imgMobile: "/images/banner-bayar-tagihan.jpg",
    alt: "Bayar Tagihan",
    eager: false,
    action: "hubungi" as const,
  },
  {
    imgDesktop: "/images/banner-apartemen.jpg",
    imgMobile: "/images/promo-first-media-xl-satu-square.webp",
    alt: "Promo Apartemen",
    eager: false,
    action: "hubungi" as const,
  },
  {
    imgDesktop: "/images/banner-opensignal.jpg",
    imgMobile: "/images/promo-first-media-xl-satu-square.webp",
    alt: "Opensignal Award",
    eager: false,
    action: "hubungi" as const,
  }
];

const WA_OPEN_DEFAULT = waLink("Halo kak, saya mau info XL SATU");

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Slider hero — dipakai home (teks WA default) & kota (teks WA per kota). */
export function HeroSlider({ waText = WA_OPEN_DEFAULT }: { waText?: string }) {
  preload("/images/promo-wifi-rumah-koneksi-pasti.webp", {
    as: "image",
    imageSrcSet: "/images/promo-wifi-rumah-koneksi-pasti-mobile.webp 500w, /images/promo-wifi-rumah-koneksi-pasti.webp 1080w",
    imageSizes: "(max-width: 768px) 500px, 1080px",
    fetchPriority: "high"
  });

  const [cur, setCur] = useState(0);
  const total = SLIDES.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback(
    (n: number) => setCur(((n % total) + total) % total),
    [total]
  );

  useEffect(() => {
    timer.current = setInterval(() => setCur((c) => (c + 1) % total), 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [total]);

  return (
    <div className="slider" id="slider">
      <style dangerouslySetInnerHTML={{ __html: `
    .hero-img-lcp { width: 100%; height: 480px; object-fit: cover; object-position: center; display: block; }
    @media (max-width: 768px) { .hero-img-lcp { height: 240px; } }
    @media (max-width: 480px) { .hero-img-lcp { height: 160px; } }
  ` }} />
        <div className="slides"
        id="slides"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="slide"
            onClick={() =>
              s.action === "wa"
                ? window.open(WA_OPEN_DEFAULT, "_blank")
                : scrollToId("hubungi")
            }
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={s.imgDesktop} />
              <img
                src={s.imgMobile}
                alt={s.alt}
                className="hero-img-lcp"
                fetchPriority={s.eager ? "high" : "auto"}
                loading={s.eager ? "eager" : "lazy"}
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>
      <button
        className="slider-btn prev"
        onClick={() => goToSlide(cur - 1)}
        aria-label="Slide sebelumnya"
      >
        &#8249;
      </button>
      <button
        className="slider-btn next"
        onClick={() => goToSlide(cur + 1)}
        aria-label="Slide berikutnya"
      >
        &#8250;
      </button>
      <div className="slider-dots" id="dots">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            className={"dot" + (i === cur ? " active" : "")}
            aria-label={"Ke slide " + (i + 1)}
            onClick={() => goToSlide(i)} />
        ))}
      </div>
    </div>
  );
}

export function QuickActions() {
  return (
    <div className="quick-actions">
      <div className="quick-actions-inner">
        <a
          href={WA_DAFTAR}
          target="_blank"
          rel="noopener noreferrer"
          className="qa-item"
        >
          <Image
            src="/images/xl-cdn/icon-kalender.svg"
            alt=""
            width={22}
            height={22}
            loading="lazy" />
          Daftar Sekarang
        </a>
        <a href="#paket" className="qa-item">
          <Image
            src="/images/xl-cdn/icon-jaringan.svg"
            alt=""
            width={22}
            height={22}
            loading="lazy" />
          Cek Paket
        </a>
        <a
          href={WA_INFO}
          target="_blank"
          rel="noopener noreferrer"
          className="qa-item"
        >
          <Image
            src="/images/xl-cdn/icon-prabayar.svg"
            alt=""
            width={22}
            height={22}
            loading="lazy" />
          Tanya Dulu
        </a>
      </div>
    </div>
  );
}

export function FiturPills() {
  return (
    <div className="fitur-pills">
      <div className="fitur-pills-inner">
        {[
          ["icon-fiber.svg", "Fiber Optic"],
          ["icon-internet.svg", "WiFi Unlimited"],
          ["icon-transaksi.svg", "SATU Tagihan"],
          ["icon-xl-satu.svg", "SATU Aplikasi"],
        ].map(([icon, label]) => (
          <div className="pill-item" key={label}>
            <Image
              src={`/images/xl-cdn/${icon}`}
              alt=""
              width={28}
              height={28}
              loading="lazy" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeHeroLokal() {
  return (
    <section className="hero-lokal">
      <div className="hero-lokal-inner">
        <h1>
          Pasang <span>WiFi Rumah di Solo Raya</span>
          <br />
          Cepat, Stabil, dan Terjangkau
        </h1>
        <p>
          XL SATU hadir untuk keluarga di{" "}
          <strong>
            Solo (Surakarta), Sukoharjo, Karanganyar, Klaten, dan Boyolali
          </strong>
          . Internet fiber optic unlimited dan terjangkau mulai Rp
          185.000/bulan —{" "}
          <a
            href="/wifi-tanpa-fup-unlimited/"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            tanpa FUP, tanpa gangguan
          </a>
          .
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
          Cek Ketersediaan di Area Saya
        </button>
        <div className="hero-lokal-stats">
          {[
            ["5", "Kota Soloraya"],
            ["7", "Pilihan Paket"],
            ["1000Mbps", "Kecepatan Maksimal"],
            ["24/7", "Layanan Sales"],
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
            "agen resmi XL SATU",
            "Harga Transparan, Tanpa Biaya Tersembunyi",
            "Ditemani Sampai Internet Nyala",
          ].map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0 }} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <>
      <HeroSlider />
      <QuickActions />
      <FiturPills />
      <HomeHeroLokal />
    </>
  );
}
