// Konstanta situs — disalin dari xssr@ec66035 (sumber beku, JANGAN edit xssr asli).
// Staging default ON (noindex) sampai cutover eksplisit.

export const SITE_DOMAIN = "https://xlhomesolo.com";
export const SITE_NAME = "XL Home (XL SATU) Solo Raya";
export const PHONE_DISPLAY = "0877-7899-9141";
export const PHONE_INTL = "6287778999141";
export const PHONE_TEL = "+6287778999141";
export const INSTAGRAM_URL = "https://www.instagram.com/xlhome.sukoharjo/";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61594596763493";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-5YWJ5LP9LG";
export const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID || "AW-938834270";
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "1440911638104275";
export const IS_STAGING = (process.env.NEXT_PUBLIC_STAGING ?? "false") !== "false";

export function waLink(text: string): string {
  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(text)}`;
}

export const WA_INFO = waLink("Halo Sales XL Home Solo, mau tanya promo pasang baru WiFi XL Home (d/h XL SATU)...");
export const WA_DAFTAR = waLink("Halo Sales XL Home Solo, saya mau daftar pasang baru WiFi XL Home (d/h XL SATU)...");

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
  "/cara-daftar-pasang-wifi-xl-home-solo/",
  "/5-hal-wajib-dicek-sebelum-pasang-wifi-rumah/",
  "/solusi-internet-daerah-belum-ada-fiber-optik/",
  "/penyebab-wifi-lemot-cara-mengatasi/",
  "/kecepatan-wifi-ideal-keluarga/",
  "/internet-rakyat-vs-xl-home/",
  "/250-mbps-untuk-berapa-orang/",
  "/paket-wifi-tahunan-bayar-10-dapat-12/",
  "/panduan-fiber-vs-wireless/",
  "/berapa-mbps-untuk-berapa-orang/",
  "/wifi-tanpa-fup-unlimited/",
  "/tes-kecepatan/",
  "/xl-home-vs-indihome-myrepublic-solo/",
  "/proses-pendaftaran-pemasangan-xl-home-fiber/",
  "/wfh-angkringan-solo-xl-home/",
  "/cara-berhenti-langganan-indihome-biznet-pindah-xl-home-solo/",
  "/rahasia-fup-internet-rumah/",
  "/eksperimen-game-streaming-zoom-bersamaan/",
  "/promo-perumahan-solo/",
  "/artikel/",
  "/cek-jaringan/",
];


