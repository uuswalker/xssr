"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle, MapPin } from "lucide-react";
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

  useEffect(() => {
    const onScroll = () => setIsTop(window.scrollY <= 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Trigger sekali saat mount untuk set state awal
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header role="banner" className={`site-header ${isTop ? "" : "is-scrolled"}`}>
      <div className="promo-banner">
          🔥 <span className="shimmer-text">Promo Terbatas: Gratis Instalasi Khusus Paket 250 Mbps & XL SATU Wireless s/d Akhir Bulan!</span>
        </div>
      <div className="header-inner">
        <div className="logo">
          <Link href="/" title="XL SATU">
            <img className="hover-scale" src="/images/logo-xl-satu.png"
              alt="XL SATU"
              width={106}
              height={85}
              loading="lazy"
            />
          </Link>
        </div>
        <nav role="navigation">
          {showFiber && <Link className="hover-lift" href={`${anchorBase}#paket`}>Paket Fiber</Link>}
          {showWireless && <Link className="hover-lift" href={`${anchorBase}#wireless`}>Wireless</Link>}
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
    </header>
  );
}
