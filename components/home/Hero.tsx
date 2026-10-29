"use client";

import { preload } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";

import { MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ADS_ID, WA_DAFTAR, WA_INFO, waLink } from "@/lib/site";

const SLIDES = [
  {
    imgWebp: "/images/banner-xlsatu-jadi-xlhome.webp",
    imgFallback: "/images/banner-xlsatu-jadi-xlhome.webp",
    alt: "XL SATU Resmi Jadi XL HOME",
    eager: true,
    action: "wa" as const,
  },
  {
    imgWebp: "/images/banner-price.webp",
    imgFallback: "/images/banner-price.webp",
    alt: "Promo Makin Hemat",
    eager: false,
    action: "wa" as const,
  },
  {
    imgWebp: "/images/banner-opensignal.webp",
    imgFallback: "/images/banner-opensignal.webp",
    alt: "Pemenang Opensignal",
    eager: false,
    action: "hubungi" as const,
  },
  {
    imgWebp: "/images/banner-apartemen.webp",
    imgFallback: "/images/banner-apartemen.webp",
    alt: "Promo Apartemen",
    eager: false,
    action: "hubungi" as const,
  },
  {
    imgWebp: "/images/banner-opensignal.webp",
    imgFallback: "/images/banner-opensignal.webp",
    alt: "Opensignal Award",
    eager: false,
    action: "hubungi" as const,
  }
];

const WA_OPEN_DEFAULT = waLink("Halo Sales XL Home Solo, mau tanya promo pasang baru WiFi (Gratis Pasang Rp 0). Mohon info paket terbaik:");

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Slider hero — dipakai home (teks WA default) & kota (teks WA per kota). */
export function HeroSlider({ waText = WA_OPEN_DEFAULT }: { waText?: string }) {
  preload("/images/banner-xlsatu-jadi-xlhome.webp", {
    as: "image",
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
    .hero-img-lcp { 
      width: 100%; 
      height: auto; 
      object-fit: contain; 
      display: block; 
    }
    /* Karena height auto, gambar akan selalu menyesuaikan proporsi aslinya (tidak akan pernah terpotong) baik di HP maupun Desktop */
  ` }} />
        <div className="slides"
        id="slides"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="slide"
            onClick={() => {
              if (s.action === "wa") {
                if (typeof (window as unknown as { gtag?: unknown }).gtag === "function") {
                  const gtagFn = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag;
                  gtagFn("event", "click_whatsapp", {
                    link_text: "Hero Banner Slide " + (i + 1),
                    link_url: WA_OPEN_DEFAULT,
                    page_path: window.location.pathname,
                  });
                  gtagFn("event", "conversion", { send_to: `${ADS_ID}/uoD7CPXb27ADEN7y1b8D` });
                }
                if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
                  const fbq = (window as unknown as { fbq: (...a: unknown[]) => void }).fbq;
                  fbq("track", "Contact");
                  fbq("track", "Lead", {
                    content_name: "Hero Banner Slide " + (i + 1),
                    content_category: "hero_banner",
                    value: 185000,
                    currency: "IDR",
                  });
                }
                let targetUrl = WA_OPEN_DEFAULT;
                try {
                  const storedUtm = sessionStorage.getItem("xlsr_utm");
                  if (storedUtm) {
                    targetUrl += encodeURIComponent(` [Sumber: ${storedUtm}]`);
                  }
                } catch {}
                window.open(targetUrl, "_blank");
              } else {
                scrollToId("hubungi");
              }
            }}
          >
            <picture>
              <source type="image/webp" srcSet={s.imgWebp} />
              <img
                src={s.imgWebp}
                alt={s.alt}
                width={1440}
                height={390}
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
          ["icon-fiber.svg", "Speed Makin Kencang"],
          ["icon-internet.svg", "Diakui Opensignal"],
          ["icon-jaringan.svg", "Area Solo Raya"],
          ["icon-kalender.svg", "Pasang Hari Ini!"],
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
          Pasang <span>WiFi Solo Murah</span> &amp; Provider Internet Terbaik Solo Raya ⚡ XL Home Resmi
        </h1>
        <p>
          Layanan pasang WiFi murah di{" "}
          <strong>
            Solo (Surakarta), Sukoharjo, Karanganyar, Klaten, dan Boyolali
          </strong>
          . Internet fiber optic 100% unlimited mulai Rp 185.000/bulan —{" "}
          <a
            href="/wifi-tanpa-fup-unlimited/"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            tanpa FUP, gratis pasang Rp 0, CS & Sales 24 Jam siap survei 1-2 hari!
          </a>
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
        
        <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px", background: "#fef3c7", padding: "6px 14px", borderRadius: "999px", border: "1px solid #fde68a" }}>
          <span style={{ fontSize: "16px" }}>🏆</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#92400e" }}>Pemenang Opensignal 2026: Jaringan Paling Andal</span>
        </div>
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
            "100% Fiber Murni Tanpa FUP (Bebas Kuota)",
            "Bukan Jebakan Promo yang Naik di Tahun ke-2",
            "Gratis Biaya Pasang Rp 0 & Sales Cepat Tanggap",
          ].map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0 }} />
              {t}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed rgba(0,0,0,0.1)", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "8px 12px", fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: "#1f2937" }}>⚡ Area Prioritas Pasang Cepat:</span>
          <a href="/pasang-wifi-xl-home-kartasura/" style={{ background: "#f0fdf4", color: "#15803d", padding: "5px 12px", borderRadius: "999px", textDecoration: "none", fontWeight: 600, border: "1px solid #bbf7d0" }}>Pasang WiFi Kartasura (Dekat UMS)</a>
          <a href="/pasang-wifi-xl-home-solo-baru/" style={{ background: "#f0fdf4", color: "#15803d", padding: "5px 12px", borderRadius: "999px", textDecoration: "none", fontWeight: 600, border: "1px solid #bbf7d0" }}>Solo Baru Sektor 1-10</a>
          <a href="/pasang-wifi-xl-home-grogol/" style={{ background: "#f0fdf4", color: "#15803d", padding: "5px 12px", borderRadius: "999px", textDecoration: "none", fontWeight: 600, border: "1px solid #bbf7d0" }}>Grogol Sukoharjo</a>
          <a href="/pasang-wifi-xl-home-colomadu/" style={{ background: "#f0fdf4", color: "#15803d", padding: "5px 12px", borderRadius: "999px", textDecoration: "none", fontWeight: 600, border: "1px solid #bbf7d0" }}>Colomadu Fajar Indah</a>
          <a href="/pasang-wifi-xl-home-laweyan/" style={{ background: "#f0fdf4", color: "#15803d", padding: "5px 12px", borderRadius: "999px", textDecoration: "none", fontWeight: 600, border: "1px solid #bbf7d0" }}>Laweyan Sentra Batik</a>
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


