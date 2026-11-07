// Pengiriman lead + pencarian alamat — port 1:1 cek-lokasi.js xssr@ec66035.
// Dipakai client-side saja (fetch/browser APIs).

import { SOLORAYA_VIEWBOX } from "./coverage";

export const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_LEAD_WEBHOOK ||
  "https://script.google.com/macros/s/AKfycbyr3978vAWjJfdzOMedOCN2eEi0LGuEIhMnPO7SRNnooVcUSYQubaq-xUMnvVfe7Q/exec";
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
  tipe: "lokasi-saja" | "lengkap" | "request-pasang-baru";
  token: string;
  nama: string;
  whatsapp: string;
  paket: string | null;
  latitude: number | null;
  longitude: number | null;
  alamat: string;
  kotaTerdeteksi: string;
  coverage: string;
  jarakFiberM: number | string;
  zona: string | null;
  homepassId: string | null;
  homepassAddress: string | null;
  mapsLink: string;
  halaman: string;
  referrer: string;
  peminatSekitar?: string | null;
  providerSaatIni?: string | null;
}

function basePayload(
  tipe: LeadPayload["tipe"],
  f: {
    nama?: string;
    whatsapp?: string;
    paket?: string | null;
    lat: number | null;
    lng: number | null;
    alamat: string;
    kota: string;
    coverage: string;
    jarakFiberM: number | string;
    zona: string | null;
    homepassId: string | null;
    homepassAddress: string | null;
    peminatSekitar?: string | null;
    providerSaatIni?: string | null;
  }

): LeadPayload {
  return {
    timestamp: new Date().toISOString(),
    tipe,
    token: LEAD_TOKEN,
    nama: f.nama || "",
    whatsapp: f.whatsapp || "",
    paket: f.paket || null,
    latitude: f.lat,
    longitude: f.lng,
    alamat: f.alamat,
    kotaTerdeteksi: f.kota,
    coverage: f.coverage,
    jarakFiberM: f.jarakFiberM,
    zona: f.zona,
    homepassId: f.homepassId,
    homepassAddress: f.homepassAddress,
    mapsLink:
      f.lat != null && f.lng != null
        ? `https://www.google.com/maps?q=${f.lat},${f.lng}`
        : "",
    halaman: window.location.pathname,
    referrer: document.referrer || "",
    peminatSekitar: f.peminatSekitar || null,
    providerSaatIni: f.providerSaatIni || null,
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

export interface SmartSuggestionItem {
  lat: string;
  lon: string;
  title: string;
  subtitle: string;
  display_name: string;
  isFiberReady: boolean;
  odp?: string;
  cluster?: string;
  city?: string;
}

export async function cariAlamatSmart(
  query: string,
  limit = 6
): Promise<SmartSuggestionItem[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const items: SmartSuggestionItem[] = [];
  const seenClusters = new Set<string>();

  try {
    const d1Promise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(
          `https://coverage-api.oktaarrijal.workers.dev/api/search?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        return (await res.json()) as { results?: Array<{
          id: string;
          cluster_name: string;
          city: string;
          odp_id: string;
          lat: number;
          lng: number;
          status: string;
        }> };
      } catch {
        return null;
      }
    })();

    const osmPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=4&countrycodes=id&viewbox=${SOLORAYA_VIEWBOX}&bounded=0&q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        return (await res.json()) as NominatimItem[];
      } catch {
        return null;
      }
    })();

    const [d1Data, osmData] = await Promise.all([d1Promise, osmPromise]);

    // 1. Prioritas Cluster D1 (Pasti ada ODP / Fiber Ready)
    if (d1Data && Array.isArray(d1Data.results)) {
      for (const r of d1Data.results) {
        if (!r.cluster_name) continue;
        const key = `${r.cluster_name}|${r.city || ""}`.toUpperCase();
        if (!seenClusters.has(key)) {
          seenClusters.add(key);
          const cityText = r.city ? r.city : "Area Fiber";
          const odpText = r.odp_id ? ` • ODP: ${r.odp_id}` : "";
          items.push({
            lat: String(r.lat),
            lon: String(r.lng),
            title: r.cluster_name,
            subtitle: `${cityText}${odpText}`,
            display_name: `${r.cluster_name}, ${cityText}`,
            isFiberReady: true,
            odp: r.odp_id,
            cluster: r.cluster_name,
            city: r.city,
          });
        }
        if (items.length >= 4) break;
      }
    }

    // 2. Fallback Nominatim (Untuk nama jalan, POI umum, kelurahan)
    if (Array.isArray(osmData)) {
      for (const r of osmData) {
        const parts = r.display_name.split(",");
        const title = parts[0].trim();
        const subtitle = parts.slice(1, 4).join(",").trim();
        items.push({
          lat: r.lat,
          lon: r.lon,
          title,
          subtitle: subtitle || "Wilayah Indonesia",
          display_name: r.display_name,
          isFiberReady: false,
        });
        if (items.length >= limit) break;
      }
    }
  } catch {
    /* fallback jika error jaringan */
  }

  return items;
}

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
    "&bounded=0" +
    `&q=${encodeURIComponent(query)}`;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.length > 0) return data as NominatimItem[];
      const fb =
        "https://nominatim.openstreetmap.org/search?format=json&addressdetails=0" +
          `&limit=${limit}` +
          "&countrycodes=id" +
          `&q=${encodeURIComponent(query)}`;
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




