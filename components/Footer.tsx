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
              <li><a href="/pasang-wifi-xl-home-banjarsari/">Pasang WiFi Banjarsari</a></li>
              <li><a href="/pasang-wifi-xl-home-jebres/">Pasang WiFi Jebres</a></li>
              <li><a href="/pasang-wifi-xl-home-laweyan/">Pasang WiFi Laweyan</a></li>
              <li><a href="/pasang-wifi-xl-home-pasar-kliwon/">Pasang WiFi Pasar Kliwon</a></li>
              <li><a href="/pasang-wifi-xl-home-serengan/">Pasang WiFi Serengan</a></li>
              <li><a href="/wifi-solo/">Pasang WiFi Solo (Pusat)</a></li>
              <li><a href="/pasang-wifi-xl-home-solo-baru/">Pasang WiFi Solo Baru</a></li>
              <li><a href="/pasang-wifi-xl-home-kartasura/">Pasang WiFi Kartasura</a></li>
              <li><a href="/pasang-wifi-xl-home-grogol/">Pasang WiFi Grogol Sukoharjo</a></li>
              <li><a href="/pasang-wifi-xl-home-baki/">Pasang WiFi Baki Sukoharjo</a></li>
              <li><a href="/pasang-wifi-xl-home-mojolaban/">Pasang WiFi Mojolaban</a></li>
              <li><a href="/pasang-wifi-xl-home-sukoharjo-kota/">Pasang WiFi Sukoharjo Kota</a></li>
            </ul>
          </div>

          {/* Kolom 2: Karanganyar, Boyolali & Klaten */}
          <div className="footer-sitemap-col">
            <h3>Karanganyar, Boyolali &amp; Klaten</h3>
            <ul>
              <li><a href="/pasang-wifi-xl-home-colomadu/">Pasang WiFi Colomadu</a></li>
              <li><a href="/pasang-wifi-xl-home-palur/">Pasang WiFi Palur</a></li>
              <li><a href="/pasang-wifi-xl-home-jaten/">Pasang WiFi Jaten Karanganyar</a></li>
              <li><a href="/pasang-wifi-xl-home-gondangrejo/">Pasang WiFi Gondangrejo</a></li>
              <li><a href="/pasang-wifi-xl-home-karanganyar-kota/">Pasang WiFi Karanganyar Kota</a></li>
              <li><a href="/pasang-wifi-xl-home-boyolali-kota/">Pasang WiFi Boyolali Kota</a></li>
              <li><a href="/pasang-wifi-xl-home-ngemplak/">Pasang WiFi Ngemplak Boyolali</a></li>
              <li><a href="/pasang-wifi-xl-home-banyudono/">Pasang WiFi Banyudono</a></li>
              <li><a href="/pasang-wifi-xl-home-klaten-kota/">Pasang WiFi Klaten Kota</a></li>
              <li><a href="/pasang-wifi-xl-home-delanggu/">Pasang WiFi Delanggu Klaten</a></li>
              <li><a href="/pasang-wifi-xl-home-prambanan/">Pasang WiFi Prambanan</a></li>
            </ul>
          </div>

          {/* Kolom 3: Panduan & Pendaftaran */}
          <div className="footer-sitemap-col">
            <h3>Panduan &amp; Pasang Baru</h3>
            <ul>
              <li><a href="/biaya-pasang-wifi-pertama-kali-solo/">Biaya Pasang Pertama Kali Solo</a></li>
              <li><a href="/biaya-pasang-wifi-solo-raya/">Biaya Pasang WiFi Solo 2026</a></li>
              <li><a href="/perubahan-resmi-xl-home/">XL SATU Resmi Jadi XL Home</a></li>
              <li><a href="/perbedaan-paket-layanan-xl-home/">XL SATU &amp; XL Home Apakah Sama?</a></li>
              <li><a href="/panduan-wifi-kos-solo/">Panduan WiFi Kos Solo &amp; Kampus</a></li>
              <li><a href="/cara-daftar-pasang-wifi-xl-home-solo/">Syarat &amp; Cara Daftar Pasang WiFi</a></li>
              <li><a href="/proses-pendaftaran-pemasangan-xl-home-fiber/">Proses Pendaftaran &amp; Pasang Fiber</a></li>
              <li><a href="/daftar-xl-home-online-tanpa-ke-kantor/">Daftar Online Tanpa ke Kantor</a></li>
              <li><a href="/xl-center-solo-terdekat-pasang-wifi/">Lokasi XL Center Solo Terdekat</a></li>
              <li><a href="/5-hal-wajib-dicek-sebelum-pasang-wifi-rumah/">5 Hal Wajib Dicek Sebelum Pasang</a></li>
              <li><a href="/cara-cek-jaringan-xl-home-di-depan-rumah/">Cara Cek Jaringan Depan Rumah</a></li>
              <li><a href="/internet-rakyat-vs-xl-home/">Internet Rakyat vs XL Home</a></li>
              <li><a href="/cara-berhenti-langganan-indihome-biznet-pindah-xl-home-solo/">Cara Ganti Provider ke XL Home</a></li>
              <li><a href="/wfh-angkringan-solo-xl-home/">WFH &amp; Usaha Angkringan Solo</a></li>
              <li><a href="/nomor-sales-xl-home-solo-raya/">Nomor Sales &amp; Agen Resmi</a></li>
            </ul>
          </div>

          {/* Kolom 4: Fitur, Promo & Perumahan */}
          <div className="footer-sitemap-col">
            <h3>Fitur &amp; Promo Perumahan</h3>
            <ul>
              <li><a href="/wifi-tanpa-kabel-solo/">WiFi Tanpa Kabel Solo (FWA)</a></li>
              <li><a href="/tes-kecepatan/">Tes Kecepatan Internet Solo</a></li>
              <li><a href="/berapa-mbps-untuk-berapa-orang/">Kalkulator Kebutuhan Mbps</a></li>
              <li><a href="/wifi-tanpa-fup-unlimited/">WiFi Fiber 100% Tanpa FUP</a></li>
              <li><a href="/rahasia-fup-internet-rumah/">Bongkar Rahasia FUP Internet Rumah</a></li>
              <li><a href="/eksperimen-game-streaming-zoom-bersamaan/">Eksperimen Bandwidth Multi-Device</a></li>
              <li><a href="/wifi-untuk-live-streaming-jualan-solo/">WiFi untuk Live Streaming Solo</a></li>
              <li><a href="/solusi-internet-daerah-belum-ada-fiber-optik/">Solusi Daerah Belum Ada Fiber</a></li>
              <li><a href="/promo-perumahan-solo/">Promo WiFi Perumahan Solo</a></li>
              <li><a href="/promo-wifi-pondok-permai-colomadu/">Promo Pondok Permai Colomadu</a></li>
              <li><a href="/pasang-wifi-tirtamaya-residence-solo-baru/">Tirtamaya Residence Solo Baru</a></li>
              <li><a href="/layanan-internet-permata-botanical-colomadu/">Permata Botanical Colomadu</a></li>
              <li><a href="/paket-wifi-tahunan-bayar-10-dapat-12/">Paket Tahunan Bayar 10 Dapat 12</a></li>
              <li><a href="/area-layanan/">Cek 79 Kecamatan Tercover</a></li>
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
            XL Home Fiber (d/h XL SATU Fiber) • Dikelola Tim Sales Resmi Solo Raya
          </div>
          <div style={{ fontSize: 11, marginTop: 4 }}>
            <a
              href="https://wa.me/6287778999141?text=Halo%20Sales%20XL%20Home%20Solo%2C%20mau%20tanya%20promo%20pasang%20WiFi%20terbaru"
              style={{ color: "rgba(255,255,255,.9)", textDecoration: "underline" }}
            >
              0877-7899-9141
            </a>{" "}
            • <a href="https://wa.me/xlhomesolo" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.9)", textDecoration: "underline", fontWeight: 700 }}>wa.me/xlhomesolo</a> • Dikelola tim sales resmi Solo&nbsp;Raya
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
            href="https://wa.me/xlhomesolo"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Sales Resmi Solo"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </a>
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
            href="https://www.instagram.com/xlhome.sukoharjo/"
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
