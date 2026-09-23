export const GEO_AREAS = [
  // Surakarta (Solo)
  "banjarsari", "jebres", "laweyan", "pasar-kliwon", "serengan",
  // Sukoharjo
  "grogol", "solo-baru", "baki", "kartasura", "mojolaban", "sukoharjo-kota",
  // Karanganyar
  "colomadu", "jaten", "gondangrejo", "karanganyar-kota", "palur",
  // Boyolali & Klaten (yang berbatasan)
  "ngemplak", "banyudono", "boyolali-kota",
  "delanggu", "prambanan", "klaten-kota"
];

function formatAreaName(slug: string) {
  return slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getGeoArticle(slug: string) {
  if (!slug.startsWith("pasang-wifi-xl-satu-")) return null;
  
  const areaSlug = slug.replace("pasang-wifi-xl-satu-", "");
  if (!GEO_AREAS.includes(areaSlug)) return null;

  const areaName = formatAreaName(areaSlug);

  return {
    slug: slug,
    title: "Pasang WiFi XL SATU di " + areaName + " | 100% Tanpa FUP",
    description: "Layanan pasang WiFi rumah XL SATU Fiber terdekat di " + areaName + ". Internet 100% tanpa FUP, bebas lemot, plus kuota HP sekeluarga. Pemasangan gratis!",
    keywords: ["pasang wifi " + areaName, "wifi murah " + areaName, "xl satu " + areaName, "provider internet " + areaName, "wifi tanpa fup"],
    ogTitle: "Pasang WiFi XL SATU Fiber di " + areaName,
    ogDescription: "Nikmati internet stabil tanpa batas FUP di " + areaName + ". Gratis biaya instalasi dan dapatkan kuota HP bersama.",
    ogImage: "/images/promo-wifi-rumah-koneksi-pasti.webp",
    schemas: [],
    faqs: [],
    hero: { 
      crumb: "<a href=\"https://xlsatusolo.com/\">Beranda</a> / Area Layanan / " + areaName, 
      h1: "Pasang WiFi XL SATU di " + areaName, 
      sub: "Koneksi fiber optic super stabil untuk keluarga di " + areaName + ". 100% Tanpa FUP!", 
      meta: "Area Layanan &middot; XL SATU Solo Raya" 
    },
    headerCta: "https://wa.me/6287778999141?text=Halo%20kak,%20saya%20mau%20cek%20jaringan%20XL%20SATU%20di%20" + areaName,
    bodyHtml: "<p>Mencari provider internet rumah yang cepat dan stabil di <strong>" + areaName + "</strong> kini semakin mudah. <strong>XL SATU Fiber</strong> hadir memberikan solusi koneksi tanpa batas untuk memenuhi kebutuhan digital keluarga modern, mulai dari <em>streaming</em> 4K, <em>game online</em>, hingga <em>Work From Home</em> (WFH).</p>\n\n      <div class=\"info-box\">\n        <strong>Promo Khusus Warga " + areaName + ":</strong> Daftar sekarang untuk mendapatkan promo GRATIS Biaya Instalasi (Hemat Rp 99.000) dan nikmati internet 100% Tanpa FUP.\n      </div>\n\n      <h2>Kenapa Warga " + areaName + " Memilih XL SATU?</h2>\n      <p>Berbeda dengan provider konvensional, XL SATU memelopori teknologi <em>Fixed Mobile Convergence</em> (FMC) yang menggabungkan keunggulan internet kabel rumah dengan kuota seluler.</p>\n\n      <div class=\"compare-grid\">\n        <div class=\"compare-card\">\n          <h4><i class=\"fas fa-times-circle\" style=\"color: #dc2626;\"></i> Provider Konvensional</h4>\n          <ul>\n            <li>Ada batas FUP (kecepatan turun drastis di akhir bulan).</li>\n            <li>Ada tambahan biaya pasang (biasanya Rp 99rb - 150rb).</li>\n            <li>Hanya dapat WiFi di rumah.</li>\n          </ul>\n        </div>\n        <div class=\"compare-card\">\n          <h4><i class=\"fas fa-check-circle\" style=\"color: #16a34a;\"></i> XL SATU Fiber</h4>\n          <ul>\n            <li><strong>100% Tanpa FUP</strong>, kecepatan selalu stabil dari tanggal 1 sampai 30.</li>\n            <li><strong>GRATIS</strong> biaya instalasi untuk pendaftaran bulan ini.</li>\n            <li>Dapat bonus Kuota HP Bersama untuk dipakai di luar rumah.</li>\n          </ul>\n        </div>\n      </div>\n\n      <h2>Jangkauan Cepat di " + areaName + "</h2>\n      <p>Tim teknisi kami siap melayani pemasangan di berbagai perumahan, klaster, maupun area pemukiman di sekitar " + areaName + ". Proses pendaftaran sangat mudah, cukup kirimkan *share location* via WhatsApp, tim kami akan langsung mengecek ketersediaan jaringan di titik rumah Anda.</p>\n      \n      <div class=\"step-box\">\n        <div class=\"step-num\">1</div>\n        <div>\n          <h4>Cek Jaringan (Gratis)</h4>\n          <p>Hubungi sales representatif kami dan infokan alamat lengkap di " + areaName + ". Kami akan memastikan rumah Anda masuk dalam cakupan fiber optic kami.</p>\n        </div>\n      </div>\n      \n      <div class=\"step-box\">\n        <div class=\"step-num\">2</div>\n        <div>\n          <h4>Pilih Paket Sesuai Kebutuhan</h4>\n          <p>Tersedia berbagai pilihan paket mulai dari 250 Mbps (Paket Spark) yang sangat cocok untuk penggunaan keluarga dengan 5-10 perangkat (HP, Smart TV, Laptop).</p>\n        </div>\n      </div>\n      \n      <div class=\"step-box\">\n        <div class=\"step-num\">3</div>\n        <div>\n          <h4>Pasang Dulu, Bayar Nanti</h4>\n          <p>Teknisi akan datang melakukan instalasi. Anda hanya membayar tagihan bulan pertama SETELAH internet menyala dan bisa digunakan di rumah Anda. 100% aman tanpa penipuan.</p>\n        </div>\n      </div>\n\n      <div class=\"cta-box\">\n        <h3>Cek Ketersediaan Jaringan di " + areaName + " Sekarang!</h3>\n        <p>Jangan tunggu sampai kuota HP jebol atau emosi karena WiFi lemot. Beralihlah ke jaringan andal dari XL SATU.</p>\n        <a href=\"https://wa.me/6287778999141?text=Halo%20kak,%20saya%20mau%20pasang%20XL%20SATU%20di%20" + areaName + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"btn-cta\">\n          <i class=\"fab fa-whatsapp\"></i> Chat Sales via WhatsApp\n        </a>\n      </div>"
  };
}
