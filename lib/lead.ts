// Pengiriman lead + pencarian alamat — port 1:1 cek-lokasi.js xssr@ec66035.
// Dipakai client-side saja (fetch/browser APIs).

import { SOLORAYA_VIEWBOX } from "./coverage";

export const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_LEAD_WEBHOOK ||
  "https://script.google.com/macros/s/AKfycbyWnOwq_bjtrpwp1K554T6U0fBlEGdU7AcV2hro9zblqe2JhEUfze1prv-LKhV-iXRs/exec";
export const LEAD_TOKEN = process.env.NEXT_PUBLIC_LEAD_TOKEN || "xlsr_2026_s0lor4y4";
export const NOMOR_WA_SALES = "6287778999141";

export const LS_KOTA = "xlsr_kota_ip";
export const LS_SUPPRESS = "xlsr_lokasi_strip_off";
export const LS_LEAD = "xlsr_lead_done";

export function lsGet<T>(k: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(k) || "null") as T | null;
  } catch {
    return null;
  }
}

export function lsSet(k: string, v: unknown): void {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* abaikan */
  }
}

export function gtag(...args: unknown[]): void {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag(...args);
}

export interface LeadPayload {
  timestamp: string;
  tipe: "lokasi-saja" | "lengkap";
  token: string;
  nama: string;
  whatsapp: string;
  latitude: number | null;
  longitude: number | null;
  alamat: string;
  kotaTerdeteksi: string;
  coverage: string;
  jarakFiberM: number | string;
  zona: string | null;
  mapsLink: string;
  halaman: string;
  referrer: string;
}

function basePayload(
  tipe: LeadPayload["tipe"],
  f: {
    nama?: string;
    whatsapp?: string;
    lat: number | null;
    lng: number | null;
    alamat: string;
    kota: string;
    coverage: string;
    jarakFiberM: number | string;
    zona: string | null;
  }
): LeadPayload {
  return {
    timestamp: new Date().toISOString(),
    tipe,
    token: LEAD_TOKEN,
    nama: f.nama || "",
    whatsapp: f.whatsapp || "",
    latitude: f.lat,
    longitude: f.lng,
    alamat: f.alamat,
    kotaTerdeteksi: f.kota,
    coverage: f.coverage,
    jarakFiberM: f.jarakFiberM,
    zona: f.zona,
    mapsLink:
      f.lat != null && f.lng != null
        ? `https://www.google.com/maps?q=${f.lat},${f.lng}`
        : "",
    halaman: window.location.pathname,
    referrer: document.referrer || "",
  };
}

export function postLead(p: LeadPayload): void {
  if (!WEBHOOK_URL || WEBHOOK_URL.indexOf("GANTI_DENGAN") !== -1) return;
  fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(p),
  }).catch(() => {});
}

export { basePayload };

export interface NominatimItem {
  lat: string;
  lon: string;
  display_name: string;
}

export function cariAlamatNominatim(
  query: string,
  limit = 5
): Promise<NominatimItem[]> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&addressdetails=0" +
    `&limit=${limit}` +
    "&countrycodes=id" +
    `&viewbox=${SOLORAYA_VIEWBOX}` +
    "&bounded=1" +
    `&q=${encodeURIComponent(query)}`;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.length > 0) return data as NominatimItem[];
      const fb =
        "https://nominatim.openstreetmap.org/search?format=json&addressdetails=0" +
          `&limit=${limit}` +
          "&countrycodes=id" +
          `&q=${encodeURIComponent(query + ", Jawa Tengah")}`;
      return fetch(fb).then((res) => res.json()) as Promise<NominatimItem[]>;
    });
}

export function normalisasiWA(input: string): string {
  let wa = input.trim().replace(/[^\d+]/g, "");
  if (wa.indexOf("+") === 0) wa = wa.slice(1);
  if (wa.indexOf("0") === 0) wa = "62" + wa.slice(1);
  else if (wa.indexOf("8") === 0) wa = "62" + wa;
  return wa;
}

// Lazy-load Leaflet (CSS+JS) on demand — persis pola xssr.
let leafletPromise: Promise<void> | null = null;

export function loadLeaflet(): Promise<void> {
  if (typeof window !== "undefined" && (window as unknown as { __leafletLoaded?: boolean }).__leafletLoaded)
    return Promise.resolve();
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise<void>((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    css.crossOrigin = "";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => {
      (window as unknown as { __leafletLoaded?: boolean }).__leafletLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("leaflet gagal dimuat"));
    document.head.appendChild(script);
  });
  return leafletPromise;
}
