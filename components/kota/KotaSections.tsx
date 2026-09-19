import { Building2 } from "lucide-react";
import { HeroSlider, QuickActions, FiturPills } from "@/components/home/Hero";
import {
  areaTipe,
  kecamatanText,
  waEncode,
  type City,
} from "@/lib/kota";

const AREA_LABELS: Record<string, string> = {
  "wifi-surakarta": "Surakarta (Solo)",
  "wifi-sukoharjo": "Sukoharjo",
  "wifi-karanganyar": "Karanganyar",
  "wifi-klaten": "Klaten",
  "wifi-boyolali": "Boyolali",
};

export const KOTA_SLUGS = Object.keys(AREA_LABELS);

/** Hero kota — h1 + intro HTML per kota, CTA & stats sama pola home. */
export function KotaHero({ city }: { city: City }) {
  return (
    <>
      <HeroSlider waText={city.wa_widget_text as string} />
      <QuickActions />
      <FiturPills />
      <section className="hero-lokal">
        <div className="hero-lokal-inner">
          <h1>
            Pasang <span>WiFi Rumah di {city.h1_kota as string}</span>
            <br />
            Cepat, Stabil, dan Terjangkau
          </h1>
          <p
            dangerouslySetInnerHTML={{ __html: city.hero_intro as string }}
          />
          <button
            type="button"
            id="btn-buka-cek-lokasi"
            className="btn-pilih"
            style={{
              display: "inline-block",
              width: "auto",
              padding: "14px 32px",
              borderRadius: 999,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
            }}
          >
            <i
              className="fas fa-map-marker-alt"
              style={{ marginRight: 8 }}
            ></i>
            Cek Ketersediaan di Area Saya
          </button>
          <div className="hero-lokal-stats">
            <div className="hero-lokal-stat">
              <span className="num">5</span>
              <span className="label">Kota Soloraya</span>
            </div>
            <div className="hero-lokal-stat">
              <span className="num">{String(city.paket_count)}</span>
              <span className="label">Pilihan Paket</span>
            </div>
            <div className="hero-lokal-stat">
              <span className="num">
                1000<small style={{ fontSize: 16 }}>Mbps</small>
              </span>
              <span className="label">Kecepatan Maksimal</span>
            </div>
            <div className="hero-lokal-stat">
              <span className="num">24/7</span>
              <span className="label">Layanan Sales</span>
            </div>
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
              "Sales Resmi XL SATU",
              "Harga Transparan, Tanpa Biaya Tersembunyi",
              "Ditemani Sampai Internet Nyala",
            ].map((t) => (
              <span key={t}>
                <i
                  className="fas fa-check-circle"
                  style={{ color: "var(--green)", marginRight: 6 }}
                ></i>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** Grid area dengan highlight kota aktif (logika AREA_CARD generate.js). */
export function KotaArea({
  active,
  cities,
}: {
  active: City;
  cities: City[];
}) {
  return (
    <section className="area-section" id="area">
      <div className="area-inner">
        <h2 className="section-title">Area Layanan XL SATU di Solo Raya</h2>
        <p className="section-sub">
          Kami melayani pemasangan internet rumah fiber optic dan wireless di
          5 kabupaten/kota Soloraya
        </p>
        <div className="area-grid">
          {KOTA_SLUGS.map((slug) => {
            const c = cities.find((x) => x.slug === slug);
            const isActive = slug === active.slug;
            return (
              <a
                key={slug}
                href={`/${slug}/`}
                className="area-card"
                style={
                  isActive
                    ? {
                        textDecoration: "none",
                        borderColor: "var(--green)",
                        background: "var(--green-light)",
                      }
                    : { textDecoration: "none" }
                }
              >
                <Building2 size={24} color="var(--green)" />
                <div className="area-name">{AREA_LABELS[slug]}</div>
                <div className="area-desc">
                  {c ? `${areaTipe(c)} tersedia` : "Fiber & Wireless tersedia"}
                </div>
              </a>
            );
          })}
          <div
            className="area-card"
            style={{
              background: "var(--green)",
              borderColor: "var(--green)",
            }}
          >
            <i
              className="fas fa-question-circle"
              style={{ color: "#fff" }}
            ></i>
            <div className="area-name" style={{ color: "#fff" }}>
              Area Lain?
            </div>
            <div
              className="area-desc"
              style={{ color: "rgba(255,255,255,.85)" }}
            >
              <a
                href="https://wa.me/6287778999141?text=Halo,%20saya%20mau%20cek%20apakah%20area%20saya%20tersedia%20XL%20SATU"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                Tanya Sales Kami
              </a>
            </div>
          </div>
        </div>
        <p style={{ marginTop: 22, textAlign: "center" }}>
          <a
            href="/area-layanan/"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "var(--green-dark)",
              fontWeight: 700,
              fontSize: 13.5,
              padding: "9px 22px",
              borderRadius: 999,
              border: "1.5px solid var(--green)",
              textDecoration: "none",
            }}
          >
            <i
              className="fas fa-map-location-dot"
              style={{ marginRight: 6 }}
            ></i>
            Lihat Cakupan Lengkap: 5 Kota, 79 Kecamatan, 102 Kelurahan
          </a>
        </p>
      </div>
    </section>
  );
}

/** Blok kecamatan per kota. */
export function KecamatanBlock({ city }: { city: City }) {
  const cekUrl = `https://wa.me/6287778999141?text=${waEncode(
    city.wa_widget_text as string
  )}`;
  return (
    <section className="area-section" style={{ paddingTop: 0 }}>
      <div className="area-inner">
        <div
          style={{
            background: "#f7faf9",
            border: "1px solid #e3ece9",
            borderRadius: 16,
            padding: "24px 28px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.7,
              color: "#3a4a45",
            }}
          >
            <i
              className="fas fa-map-marker-alt"
              style={{ color: "var(--green)", marginRight: 6 }}
            ></i>
            Kami melayani pemasangan XL SATU di {city.h1_kota as string},
            termasuk kecamatan{" "}
            {kecamatanText(city.kecamatan_list as string[])}. Belum yakin area
            kamu sudah terjangkau?{" "}
            <a
              href={cekUrl}
              style={{
                color: "var(--green)",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Cek langsung ke sales kami
            </a>{" "}
            untuk kepastian jaringan di alamat spesifik Anda.
          </p>
        </div>
      </div>
    </section>
  );
}
