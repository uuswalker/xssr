import Link from "next/link";
import { PHONE_DISPLAY } from "@/lib/site";

export default function Footer() {
  return (
    <footer role="contentinfo">
      {/* ── INTERNAL LINKING SILO FOR GOOGLE INDEXING ── */}
      <nav aria-label="Area dan Panduan Layanan" className="footer-sitemap">
        <div className="footer-sitemap-grid">
          {/* Kolom 1: Solo & Sukoharjo */}
          <div className="footer-sitemap-col">
            <h3>Area Solo &amp; Sukoharjo</h3>
            <ul>
              <li><a href="/pasang-wifi-xl-satu-banjarsari/">Pasang WiFi Banjarsari</a></li>
              <li><a href="/pasang-wifi-xl-satu-jebres/">Pasang WiFi Jebres</a></li>
              <li><a href="/pasang-wifi-xl-satu-laweyan/">Pasang WiFi Laweyan</a></li>
              <li><a href="/pasang-wifi-xl-satu-pasar-kliwon/">Pasang WiFi Pasar Kliwon</a></li>
              <li><a href="/pasang-wifi-xl-satu-serengan/">Pasang WiFi Serengan</a></li>
              <li><a href="/wifi-solo/">Pasang WiFi Solo (Pusat)</a></li>
              <li><a href="/pasang-wifi-xl-satu-solo-baru/">Pasang WiFi Solo Baru</a></li>
              <li><a href="/pasang-wifi-xl-satu-kartasura/">Pasang WiFi Kartasura</a></li>
              <li><a href="/pasang-wifi-xl-satu-grogol/">Pasang WiFi Grogol Sukoharjo</a></li>
              <li><a href="/pasang-wifi-xl-satu-baki/">Pasang WiFi Baki Sukoharjo</a></li>
              <li><a href="/pasang-wifi-xl-satu-mojolaban/">Pasang WiFi Mojolaban</a></li>
              <li><a href="/pasang-wifi-xl-satu-sukoharjo-kota/">Pasang WiFi Sukoharjo Kota</a></li>
            </ul>
          </div>

          {/* Kolom 2: Karanganyar, Boyolali & Klaten */}
          <div className="footer-sitemap-col">
            <h3>Karanganyar, Boyolali &amp; Klaten</h3>
            <ul>
              <li><a href="/pasang-wifi-xl-satu-colomadu/">Pasang WiFi Colomadu</a></li>
              <li><a href="/pasang-wifi-xl-satu-palur/">Pasang WiFi Palur</a></li>
              <li><a href="/pasang-wifi-xl-satu-jaten/">Pasang WiFi Jaten Karanganyar</a></li>
              <li><a href="/pasang-wifi-xl-satu-gondangrejo/">Pasang WiFi Gondangrejo</a></li>
              <li><a href="/pasang-wifi-xl-satu-karanganyar-kota/">Pasang WiFi Karanganyar Kota</a></li>
              <li><a href="/pasang-wifi-xl-satu-boyolali-kota/">Pasang WiFi Boyolali Kota</a></li>
              <li><a href="/pasang-wifi-xl-satu-ngemplak/">Pasang WiFi Ngemplak Boyolali</a></li>
              <li><a href="/pasang-wifi-xl-satu-banyudono/">Pasang WiFi Banyudono</a></li>
              <li><a href="/pasang-wifi-xl-satu-klaten-kota/">Pasang WiFi Klaten Kota</a></li>
              <li><a href="/pasang-wifi-xl-satu-delanggu/">Pasang WiFi Delanggu Klaten</a></li>
              <li><a href="/pasang-wifi-xl-satu-prambanan/">Pasang WiFi Prambanan</a></li>
            </ul>
          </div>

          {/* Kolom 3: Panduan & Pendaftaran */}
          <div className="footer-sitemap-col">
            <h3>Panduan &amp; Pasang Baru</h3>
            <ul>
              <li><a href="/biaya-pasang-wifi-solo-raya/">Biaya Pasang WiFi Solo 2026</a></li>
              <li><a href="/panduan-wifi-kos-solo/">Panduan WiFi Kos Solo &amp; Kampus</a></li>
              <li><a href="/cara-daftar-pasang-wifi-xl-satu-solo/">Syarat &amp; Cara Daftar Pasang WiFi</a></li>
              <li><a href="/daftar-xl-home-online-tanpa-ke-kantor/">Daftar Online Tanpa ke Kantor</a></li>
              <li><a href="/xl-center-solo-terdekat-pasang-wifi/">Lokasi XL Center Solo Terdekat</a></li>
              <li><a href="/5-hal-wajib-dicek-sebelum-pasang-wifi-rumah/">5 Hal Wajib Dicek Sebelum Pasang</a></li>
              <li><a href="/cara-cek-jaringan-xl-home-di-depan-rumah/">Cara Cek Jaringan Depan Rumah</a></li>
              <li><a href="/internet-rakyat-vs-xl-satu/">Internet Rakyat vs XL Home</a></li>
              <li><a href="/cara-berhenti-langganan-indihome-biznet-pindah-xl-satu-solo/">Cara Ganti Provider ke XL Home</a></li>
              <li><a href="/nomor-sales-xl-home-solo-raya/">Nomor Sales &amp; Agen Resmi</a></li>
            </ul>
          </div>

          {/* Kolom 4: Fitur, Promo & Perumahan */}
          <div className="footer-sitemap-col">
            <h3>Fitur &amp; Promo Perumahan</h3>
            <ul>
              <li><a href="/tes-kecepatan/">Tes Kecepatan Internet Solo</a></li>
              <li><a href="/berapa-mbps-untuk-berapa-orang/">Kalkulator Kebutuhan Mbps</a></li>
              <li><a href="/area-layanan/">Cek 79 Kecamatan Tercover</a></li>
              <li><a href="/wifi-tanpa-fup-unlimited/">WiFi Fiber 100% Tanpa FUP</a></li>
              <li><a href="/solusi-internet-daerah-belum-ada-fiber-optik/">Solusi Daerah Belum Ada Fiber</a></li>
              <li><a href="/promo-perumahan-solo/">Promo WiFi Perumahan Solo</a></li>
              <li><a href="/promo-wifi-pondok-permai-colomadu/">Promo Pondok Permai Colomadu</a></li>
              <li><a href="/pasang-wifi-tirtamaya-residence-solo-baru/">Tirtamaya Residence Solo Baru</a></li>
              <li><a href="/layanan-internet-permata-botanical-colomadu/">Permata Botanical Colomadu</a></li>
              <li><a href="/paket-wifi-tahunan-bayar-10-dapat-12/">Paket Tahunan Bayar 10 Dapat 12</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ── FOOTER BOTTOM BAR ── */}
      <div className="footer-inner">
        <div className="footer-left">
          <img
            src="/images/xl-home-logo.png"
            alt="XL HOME"
            className="footer-logo"
            width={84}
            height={28}
            loading="lazy"
          />
          <div className="footer-copy">
            Copyright © 2026 XL Home Solo Raya. All rights reserved.
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 2 }}>
            Dilarang menyalin/menggandakan konten situs ini tanpa izin tertulis.
          </div>
          <div style={{ fontSize: 11, marginTop: 4 }}>
            <a
              href="https://wa.me/xlsatusolo"
              style={{ color: "rgba(255,255,255,.9)", textDecoration: "underline" }}
            >
              wa.me/xlsatusolo
            </a>{" "}
            • {PHONE_DISPLAY} • Dikelola agen resmi Solo&nbsp;Raya
          </div>
        </div>
        
        <div className="footer-links">
          <a href="/nomor-sales-xl-home-solo-raya/" style={{ color: "inherit" }}>
            Nomor Sales &amp; Agen
          </a>
          <a href="/kebijakan-privasi/" style={{ color: "inherit" }}>
            Privasi &amp; Cookie
          </a>
          <a
            href="https://satu.xl.co.id/syarat-ketentuan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Syarat &amp; Ketentuan
          </a>
          <a
            href="https://www.xlsmart.co.id/id/pemberitahuan-privasi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kebijakan Privasi
          </a>
        </div>
        <div className="footer-socials">
          <a
            href="https://www.facebook.com/profile.php?id=61594596763493"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a
            href="https://www.instagram.com/xlhome.solo/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
