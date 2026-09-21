"use client";
import { motion } from "framer-motion";
import { MapPin, Gift, CheckCircle2, Settings, PlayCircle, ChevronUp, ChevronDown, CalendarCheck } from "lucide-react";
import NumberCounter from "@/components/animations/NumberCounter";

import { useEffect, useState } from "react";
import {
  FIBER_TIERS,
  TAHUNAN_TIERS,
  WIRELESS_ADVANCE,
  WIRELESS_MONTHLY,
  tierWa,
  type FiberTier,
} from "@/lib/paket";

function FiberCard({ t }: { t: FiberTier }) {
  return (
    <motion.div className={`paket-card ${t.badge ? "best-seller" : ""}`} whileHover={{ scale: 1.03, boxShadow: "0px 20px 40px -5px rgba(5,169,134,0.12)" }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      {t.badge && <div className="badge-laris">{t.badge}</div>}
      <div className={`paket-card-header ${t.headerClass}`}>
        <div className="paket-title">{t.name}</div>
        <div className="paket-subtitle">{t.subtitle}</div>
      </div>
      <div style={{ padding: "16px 24px 0" }}>
        <div className="speed-label">
            <span>0 Mbps</span>
            <span>
              {t.speedNormal && (
                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px' }}>
                  {t.speedNormal}
                </span>
              )}
              {t.speedMax} Mbps
            </span>
          </div>
        <div className="speed-bar-bg">
            <motion.div
              className="speed-bar-fill"
              initial={{ width: "0%" }}
              whileInView={{ width: `${t.barWidth}%` }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              style={{ background: t.barGradient }}
            ></motion.div>
            <motion.div
              className="speed-bar-dot"
              initial={{ left: "0%" }}
              whileInView={{ left: `calc(${t.barWidth}% - 8px)` }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              style={{ borderColor: t.barDotColor }}
            ></motion.div>
          </div>
        <div className="speed-note">{t.speedNote}</div>
        {t.boosterNote && (
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 6,
            }}
          >
            {t.boosterNote}
          </div>
        )}
      </div>
      <div className="paket-body">
        <div className="ideal-tags">
          {t.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="fitur-list">
          {t.feats.map((f) => (
            <div className="fitur-item" key={f.text}>
              <img src={f.img} alt="" width={28} height={28} loading="lazy" />
              {f.text}
            </div>
          ))}
        </div>
        <div className="price-box">
          <div className="price-main">
            {t.price.includes("Rp") ? <NumberCounter value={parseInt(t.price.replace(/\D/g, ""), 10)} prefix="Rp " /> : t.price}
            <span>/bulan</span>
          </div>
          <div className="price-ppn">Belum termasuk PPN</div>
          <a
            href={tierWa(t)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pilih"
          >
            Tanya Paket Ini
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function FiberPaket({ promoBadge = "Promo XL Satu Soloraya" }: { promoBadge?: string }) {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const visibleFiber = FIBER_TIERS.slice(0, 3);
  const extraFiber = FIBER_TIERS.slice(3);
  const showExtra = !isMobile || showAll;

  return (
    <>
      {/* PAKET FIBER */}
      <section className="paket-section" id="paket">
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span
            style={{
              background: "var(--green)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              padding: "6px 18px",
              borderRadius: 999,
              display: "inline-block",
              letterSpacing: ".3px",
            }}
          >
            {promoBadge}
          </span>
        </div>
        <h2 className="section-title">Internet Cepat untuk Keluarga Bahagia!</h2>
        <p className="section-sub">
          Nikmati koneksi stabil untuk streaming, belajar, bekerja, dan hiburan
          tanpa batas · Harga belum termasuk PPN · Syarat &amp; ketentuan
          berlaku
        </p>

        <div className="paket-grid">
          {visibleFiber.map((t) => (
            <FiberCard key={t.name} t={t} />
          ))}
          {showExtra && (
            <div id="paket-extra" style={{ display: "contents" }}>
              {extraFiber.map((t) => (
                <FiberCard key={t.name} t={t} />
              ))}
            </div>
          )}
        </div>

        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 14,
            color: "#5a6b66",
          }}
        >
          Mau hitung total biaya? Lihat{" "}
          <a
            href="/biaya-pasang-wifi-solo-raya/"
            style={{ color: "var(--green)", fontWeight: 700 }}
          >
            rincian biaya pasang WiFi Solo Raya 2026 — mulai Rp185rb/bulan
          </a>{" "}
          (instalasi Rp100rb/gratis) + simulasi bulan pertama.
        </p>

        {isMobile && (
          <div id="toggle-wrap" style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={() => setShowAll((s) => !s)}
              id="toggle-btn"
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--green)",
                color: "var(--green)",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              {showAll ? "Sembunyikan Paket " : "Lihat Semua Paket "}
              <i
                className={`fas fa-chevron-${showAll ? "up" : "down"}`}
                id="toggle-icon"
                style={{ marginLeft: 6 }}
              ></i>
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export function TahunanPaket() {
  return (
    <>
      {/* PAKET TAHUNAN */}
      <section
        className="paket-section"
        id="paket-tahunan"
        style={{
          background:
            "linear-gradient(180deg, #f8f7ff 0%, var(--gray-bg) 100%)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #6d28d9 100%)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              padding: "6px 18px",
              borderRadius: 999,
              display: "inline-block",
              letterSpacing: ".3px",
            }}
          >
            Hemat 2 Bulan — Bayar 10 Dapat 12
          </span>
        </div>
        <h2 className="section-title">Paket Tahunan Lebih Hemat</h2>
        <p className="section-sub">
          Bayar 10 bulan, pakai 12 bulan. Bonus Speed Booster + Kuota HP
          se-keluarga. Harga belum termasuk PPN 11%.
        </p>

        <div className="paket-grid">
          {TAHUNAN_TIERS.map((t) => (
            <motion.div className="paket-card" key={t.name} whileHover={{ scale: 1.03, y: -5, boxShadow: "0px 20px 40px -5px rgba(5,169,134,0.10)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <div
                className="paket-card-header"
                style={{ background: t.headerGradient }}
              >
                <div className="paket-title">{t.name}</div>
                <div className="paket-subtitle">
                  Paket Tahunan — Bayar 10 Dapat 12
                </div>
              </div>
              <div style={{ padding: "16px 24px 0" }}>
                <div className="speed-label">
            <span>0 Mbps</span>
            <span>
              {t.speedNormal && (
                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px' }}>
                  {t.speedNormal}
                </span>
              )}
              {t.speedMax} Mbps
            </span>
          </div>
                <div className="speed-bar-bg">
                    <motion.div
                      className="speed-bar-fill"
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${t.barWidth}%` }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      style={{ background: "linear-gradient(90deg, #1e1b4b 0%, #7c3aed 100%)" }}
                    ></motion.div>
                    <motion.div
                      className="speed-bar-dot"
                      initial={{ left: "0%" }}
                      whileInView={{ left: `calc(${t.barWidth}% - 8px)` }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      style={{ borderColor: "#7c3aed" }}
                    ></motion.div>
                  </div>
                <div className="speed-note">Ideal untuk perangkat keluarga</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 6,
                  }}
                >
                  {t.boosterNote}
                </div>
                
                <div
                  style={{
                    margin: "14px 0 0",
                    padding: "8px 12px",
                    background: "#f5f3ff",
                    borderRadius: 8,
                    fontSize: 11.5,
                    color: "#4c1d95",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  🎁 Bonus Kuota HP <strong>{t.kuota}</strong> ({t.members})
                </div>
              </div>
              <div className="paket-body">
                <div className="ideal-tags">
                  {t.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="fitur-list">
                  {t.feats.map((f) => (
                    <div className="fitur-item" key={f.text}>
                      <img src={f.img} alt="" width={28} height={28} loading="lazy" />
                      {f.text}
                    </div>
                  ))}
                </div>
                <div className="price-box">
                  <div className="price-before">{t.before}</div>
                  <div className="price-main">
                    {t.price}
                    <span>/tahun</span>
                  </div>
                  <div className="price-ppn">
                    Belum termasuk PPN 11% — Bayar 10 dapat 12 bulan
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      color: "var(--green)",
                      fontWeight: 700,
                      marginTop: 4,
                    }}
                  >
                    {t.perMonth} • {t.save}
                  </div>
                  <a
                    href={tierWa(t)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pilih"
                  >
                    Tanya Paket Ini
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          Semua paket tahunan sudah termasuk <strong>gratis instalasi</strong>.
          Tanya sales untuk simulasi total + PPN sesuai alamat.
        </p>
        <p style={{ marginTop: "auto", textAlign: "center", fontSize: 13 }}>
          <a
            href="/paket-wifi-tahunan-bayar-10-dapat-12/"
            style={{ color: "var(--green)", fontWeight: 700 }}
          >
            Baca penjelasan lengkap: Paket WiFi Tahunan Bayar 10 Dapat 12 →
          </a>
        </p>
      </section>
    </>
  );
}

export function WirelessPaket({
  badge = "Khusus Area Soloraya",
  intro = "home",
}: {
  badge?: string;
  intro?: "home" | "kota";
}) {
  const [wirelessTab, setWirelessTab] = useState<"advance" | "monthly">(
    "advance"
  );

  return (
    <>
      {/* WIRELESS */}
      <section className="wireless-section" id="wireless">
        <div className="wireless-inner">
          <div style={{ textAlign: "center" }}>
            <span className="wireless-region-badge">
              <MapPin size={16} /> {badge}
            </span>
            <h2 className="section-title">WiFi Rumah Tanpa Kabel</h2>
            {intro === "home" ? (
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Internet cepat, stabil, tanpa ribet — solusi wifi tanpa kabel
                untuk area Solo Raya yang belum terjangkau fiber. Alternatif
                EZnet Wireless Telkomsel Solo. Baca{" "}
                <a
                  href="/solusi-internet-daerah-belum-ada-fiber-optik/"
                  style={{ color: "var(--green)", fontWeight: 600 }}
                >
                  kenapa daerahmu mungkin belum ada fiber &amp; solusinya
                </a>
                .
              </p>
            ) : (
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Internet cepat, stabil, tanpa ribet - solusi wireless untuk
                area yang belum terjangkau kabel fiber. Baca{" "}
                <a
                  href="/solusi-internet-daerah-belum-ada-fiber-optik/"
                  style={{ color: "var(--green)", fontWeight: 600 }}
                >
                  kenapa daerahmu mungkin belum ada fiber &amp; solusinya
                </a>
                .
              </p>
            )}
          </div>

          <div className="wireless-pills">
            {[
              ["fa-wifi", "Sinyal Stabil Di Setiap Ruangan"],
              ["fa-gauge-high", "Internet Cepat Tanpa Batas Kuota"],
              ["fa-plug-circle-check", "Praktis, Tanpa Kabel Tanpa Repot"],
            ].map(([icon, label]) => (
              <div className="pill-item" key={label}>
                <i
                  className={`fas ${icon}`}
                  style={{ color: "var(--green)", fontSize: 20 }}
                ></i>
                {label}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              margin: "24px 0 32px",
            }}
          >
            {(["advance", "monthly"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setWirelessTab(tab)}
                id={tab === "advance" ? "tab-advance" : "tab-monthly"}
                style={{
                  padding: "10px 28px",
                  borderRadius: 999,
                  border: "2px solid var(--green)",
                  background:
                    wirelessTab === tab ? "var(--green)" : "#fff",
                  color: wirelessTab === tab ? "#fff" : "var(--green)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                {tab === "advance" ? "Advance Payment" : "Monthly Plan"}
              </button>
            ))}
          </div>

          {wirelessTab === "advance" ? (
            <div id="wireless-advance">
              <div
                style={{
                  maxWidth: 420,
                    margin: "0 auto 24px",
                    background: "var(--green-light)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--green-dark)",
                }}
              >
                <Gift size={16} style={{ flexShrink: 0 }} />
                Semua paket include{" "}
                <strong>Free 3 Bulan Vidio Lite + Catchplay</strong>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(230px,1fr))",
                  gap: 16,
                  maxWidth: 680,
                  margin: "0 auto 32px",
                }}
              >
                {WIRELESS_ADVANCE.map((w) => (
                  <div
                    className="wireless-card"
                    style={{ position: "relative" }}
                    key={w.speed}
                  >
                    {w.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "#6d28d9",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {w.badge}
                      </span>
                    )}
                    <i
                      className={`fas ${w.icon}`}
                      style={{
                        color: "var(--green)",
                        fontSize: 36,
                        marginBottom: 8,
                      }}
                    ></i>
                    <div className="speed-num">
                      {w.speed} <span>Mbps</span>
                    </div>
                    <div className="harga-label">{w.label}</div>
                    <div className="harga-value">{w.price}</div>
                    <div className="harga-note">{w.note}</div>
                    <a
                      href={tierWa(w)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pilih"
                      style={{ width: "100%", marginTop: "auto" }}
                    >
                      Tanya Paket Ini
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div id="wireless-monthly">
              <div
                style={{
                  maxWidth: 420,
                    margin: "0 auto 24px",
                    background: "#fff3e0",
                    borderRadius: 12,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#ac3c00",
                }}
              >
                <CalendarCheck size={16} style={{ flexShrink: 0 }} />
                Bayar bulanan, tanpa advance
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(230px,1fr))",
                  gap: 16,
                  maxWidth: 400,
                  margin: "0 auto 32px",
                }}
              >
                {WIRELESS_MONTHLY.map((w) => (
                  <div
                    className="wireless-card"
                    style={{ position: "relative" }}
                    key={w.speed}
                  >
                    <i
                      className={`fas ${w.icon}`}
                      style={{
                        color: "var(--green)",
                        fontSize: 36,
                        marginBottom: 8,
                      }}
                    ></i>
                    <div className="speed-num">
                      {w.speed} <span>Mbps</span>
                    </div>
                    <div className="harga-label">{w.label}</div>
                    <div className="harga-value">{w.price}</div>
                    <div className="harga-note">{w.note}</div>
                    <a
                      href={tierWa(w)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pilih"
                      style={{ width: "100%", marginTop: "auto" }}
                    >
                      Tanya Paket Ini
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="wireless-perks">
            <div className="perk-item">
              <CheckCircle2 size={16} /> Belum Termasuk PPN
            </div>
            <div className="perk-item">
              <Settings size={16} /> Bebas Biaya Instalasi
            </div>
            <div className="perk-item">
              <PlayCircle size={16} /> Free Vidio Lite &amp;
              Catchplay (3 Bulan)
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function PaketSection() {
  return (
    <>
      <FiberPaket />
      <TahunanPaket />
      <WirelessPaket badge="Khusus Area Soloraya" intro="home" />
    </>
  );
}
