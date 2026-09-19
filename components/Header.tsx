// Port 1:1 header xssr (index.html) — className parity agar globals.css langsung cocok.
// Tombol Cek Ketersediaan di-wire ke widget pada Fase 4 (CekLokasi).
export default function Header({
  anchorBase = "",
  showFiber = true,
  showWireless = true,
  ctaHref,
}: {
  anchorBase?: string;
  showFiber?: boolean;
  showWireless?: boolean;
  /** Bila diisi: tombol header jadi link WA langsung (halaman artikel), bukan pemicu modal. */
  ctaHref?: string;
}) {
  return (
    <header role="banner">
      <div className="header-inner">
        <div className="logo">
          <a href={anchorBase === "" ? "#" : "/"} title="XL SATU">
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
          {showFiber && <a href={`${anchorBase}#paket`}>Paket Fiber</a>}
          {showWireless && <a href={`${anchorBase}#wireless`}>Wireless</a>}
          <a href={`${anchorBase}#area`}>Area Layanan</a>
          <a href={`${anchorBase}#bantuan`}>Bantuan</a>
          <a href={`${anchorBase}#hubungi`}>Hubungi Kami</a>
        </nav>
        {ctaHref ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-header"
          >
            <i className="fab fa-whatsapp"></i> Chat WA
          </a>
        ) : (
          <button type="button" className="btn-wa-header btn-cek-lokasi-trigger">
            <i className="fas fa-map-marker-alt"></i> Cek Ketersediaan
          </button>
        )}
      </div>
    </header>
  );
}
