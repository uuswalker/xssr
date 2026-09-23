// Konstanta situs — disalin dari xssr@ec66035 (sumber beku, JANGAN edit xssr asli).
// Staging default ON (noindex) sampai cutover eksplisit.

export const SITE_DOMAIN = "https://xlsatusolo.com";
export const SITE_NAME = "XL SATU Solo Raya";
export const PHONE_DISPLAY = "0877-7899-9141";
export const PHONE_INTL = "6287778999141";
export const PHONE_TEL = "+6287778999141";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-9R0LKSXL8Y";
export const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID || "AW-938834270";
export const IS_STAGING = (process.env.NEXT_PUBLIC_STAGING ?? "true") !== "false";

export function waLink(text: string): string {
  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(text)}`;
}

export const WA_INFO = waLink("Info XL SATU");
export const WA_DAFTAR = waLink("Daftar XL SATU");

// Rute v1 (tumbuh per fase; dipakai sitemap + QA paritas)
export const V1_ROUTES: string[] = [
  "/",
  "/wifi-solo/",
  "/wifi-surakarta/",
  "/wifi-sukoharjo/",
  "/wifi-karanganyar/",
  "/wifi-klaten/",
  "/wifi-boyolali/",
  "/area-layanan/",
  "/kebijakan-privasi/",
  "/panduan-wifi-kos-solo/",
  "/biaya-pasang-wifi-solo-raya/",
  "/cara-daftar-pasang-wifi-xl-satu-solo/",
  "/5-hal-wajib-dicek-sebelum-pasang-wifi-rumah/",
  "/solusi-internet-daerah-belum-ada-fiber-optik/",
  "/penyebab-wifi-lemot-cara-mengatasi/",
  "/kecepatan-wifi-ideal-keluarga/",
  "/internet-rakyat-vs-xl-satu/",
  "/250-mbps-untuk-berapa-orang/",
  "/paket-wifi-tahunan-bayar-10-dapat-12/",
  "/panduan-fiber-vs-wireless/",
  "/berapa-mbps-untuk-berapa-orang/",
  "/wifi-tanpa-fup-unlimited/",
  "/tes-kecepatan/",
  "/xl-satu-vs-indihome-myrepublic-solo/",
  "/proses-pendaftaran-pemasangan-xl-satu-fiber/",
  "/wfh-angkringan-solo-xl-satu/",
  "/rahasia-fup-internet-rumah/",
  "/eksperimen-game-streaming-zoom-bersamaan/",
];
