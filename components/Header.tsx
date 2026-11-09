"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle, MapPin, Flame, Menu, X, Wifi, Radio, Sparkles, Gauge, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header({
  showFiber = true,
  showWireless = true,
  ctaHref,
}: {
  showFiber?: boolean;
  showWireless?: boolean;
  ctaHref?: string;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const anchorBase = isHome ? "" : "/";

  const [isTop, setIsTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsTop(window.scrollY <= 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu otomatis jika berpindah rute
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Tutup menu dengan tombol Esc
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header role="banner" className={`site-header ${isTop ? "" : "is-scrolled"}`}>
      <div className="promo-banner" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Flame size={15} color="#fbbf24" style={{ flexShrink: 0 }} aria-hidden="true" />
        <span className="shimmer-text">Promo Terbatas: Gratis Instalasi Khusus Paket 250 Mbps & XL Home Wireless s/d Akhir Bulan!</span>
      </div>
      <div className="header-inner">
        <div className="logo" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            className="btn-mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} color="#1e293b" /> : <Menu size={22} color="#1e293b" />}
          </button>
          <Link href="/" title="XL HOME" onClick={closeMenu}>
            <img className="hover-scale" src="/images/xl-home-logo.png"
              alt="XL HOME"
              width={106}
              height={85}
              loading="eager"
            />
          </Link>
        </div>
        <nav role="navigation">
          {showFiber && <Link className="hover-lift" href={`${anchorBase}#paket`}>Paket Fiber</Link>}
          {showWireless && <Link className="hover-lift" href={`${anchorBase}#wireless`}>Wireless</Link>}
          <Link className="hover-lift" href={`${anchorBase}#daftar`}>Daftar Online</Link>
          <Link className="hover-lift" href={`${anchorBase}#area`}>Area Layanan</Link>
          <Link className="hover-lift" href={`${anchorBase}#bantuan`}>Bantuan</Link>
          <Link className="hover-lift" href={`${anchorBase}#hubungi`}>Hubungi Kami</Link>
        </nav>
        {ctaHref ? (
          <a className="btn-chat hover-glow btn-wa-header" href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <MessageCircle size={18} style={{ flexShrink: 0 }} /> Tanya Dulu
          </a>
        ) : (
          <button type="button" 
            className="btn-wa-header btn-cek-lokasi-trigger hover-glow"
          >
            <MapPin size={18} /> Cek Ketersediaan
          </button>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Menu Navigasi Mobile">
          <div className="mobile-nav-list">
            {showFiber && (
              <Link className="mobile-nav-item" href={`${anchorBase}#paket`} onClick={closeMenu}>
                <span className="mobile-nav-label">
                  <Wifi size={18} color="#0066ff" />
                  <span>Paket Fiber Optik</span>
                </span>
                <ChevronRight size={16} color="#94a3b8" />
              </Link>
            )}
            {showWireless && (
              <Link className="mobile-nav-item" href={`${anchorBase}#wireless`} onClick={closeMenu}>
                <span className="mobile-nav-label">
                  <Radio size={18} color="#0ea5e9" />
                  <span>XL Ultra Wireless</span>
                </span>
                <ChevronRight size={16} color="#94a3b8" />
              </Link>
            )}
            <Link className="mobile-nav-item" href={`${anchorBase}#daftar`} onClick={closeMenu}>
              <span className="mobile-nav-label">
                <Sparkles size={18} color="#f59e0b" />
                <span>Daftar Pasang Baru</span>
              </span>
              <ChevronRight size={16} color="#94a3b8" />
            </Link>
            <Link className="mobile-nav-item" href={`${anchorBase}#area`} onClick={closeMenu}>
              <span className="mobile-nav-label">
                <MapPin size={18} color="#10b981" />
                <span>Area Layanan Solo Raya</span>
              </span>
              <ChevronRight size={16} color="#94a3b8" />
            </Link>
            <Link className="mobile-nav-item" href="/tes-kecepatan/" onClick={closeMenu}>
              <span className="mobile-nav-label">
                <Gauge size={18} color="#6366f1" />
                <span>Tes Kecepatan (Speedtest)</span>
              </span>
              <ChevronRight size={16} color="#94a3b8" />
            </Link>
            <a
              className="mobile-nav-item mobile-nav-wa"
              href="https://wa.me/6287778999141?text=Halo%20Sales%20XL%20Home%20Solo%2C%20mau%20tanya%20promo%20pasang%20WiFi%20terbaru"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              <span className="mobile-nav-label">
                <MessageCircle size={18} color="#22c55e" />
                <span>Chat Sales Resmi (0877-7899-9141)</span>
              </span>
              <ChevronRight size={16} color="#94a3b8" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
