"use client";


import { usePathname } from "next/navigation";
import { MessageCircle, MapPin } from "lucide-react";

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
  // Automatically determine if we are on the homepage.
  // If not, prefix anchor links with "/" so they navigate back to the home page's sections.
  const isHome = pathname === "/";
  const anchorBase = isHome ? "" : "/";

  return (
    <header role="banner" className="site-header">
      <div className="header-inner">
        <div className="logo">
          {/* Logo ALWAYS goes to home */}
          <a href="/" title="XL SATU">
            <img className="hover-scale" src="/images/logo-xl-satu.png"
              alt="XL SATU"
              width={106}
              height={85}
              loading="lazy"
            />
          </a>
        </div>
        <nav role="navigation">
          {showFiber && <a className="hover-lift" href={`${anchorBase}#paket`}>Paket Fiber</a>}
          {showWireless && <a className="hover-lift" href={`${anchorBase}#wireless`}>Wireless</a>}
          <a className="hover-lift" href={`${anchorBase}#area`}>Area Layanan</a>
          <a className="hover-lift" href={`${anchorBase}#bantuan`}>Bantuan</a>
          <a className="hover-lift" href={`${anchorBase}#hubungi`}>Hubungi Kami</a>
        </nav>
        {ctaHref ? (
          <a className="btn-chat hover-glow btn-wa-header" href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block" }}
          >
            <MessageCircle size={18} /> Chat WA
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
