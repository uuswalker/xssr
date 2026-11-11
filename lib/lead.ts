// Pengiriman lead + pencarian alamat — port 1:1 cek-lokasi.js xssr@ec66035.
// Dipakai client-side saja (fetch/browser APIs).

import { SOLORAYA_VIEWBOX, cleanAlamatResmi } from "./coverage";

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
  odp?: string | null;
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
    odp?: string | null;
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
    odp: f.odp || null,
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

export interface D1SearchResult {
  id: string;
  cluster_name: string;
  city: string;
  odp_id: string;
  lat: number;
  lng: number;
  status: string;
  address?: string;
}

const ADMIN_CITY_WORDS = new Set([
  "jl", "jalan", "jln", "gang", "gg", "gng", "lorong", "lrg",
  "no", "nomor", "rt", "rw", "blok", "kav",
  "perum", "perumahan", "graha", "residence", "residences", "cluster",
  "kel", "kelurahan", "desa", "ds",
  "kec", "kecamatan", "kab", "kabupaten", "kota",
  "indonesia", "jawa", "tengah", "barat", "timur", "jateng", "jabar", "jatim", "dki", "diy",
  "sukoharjo", "surakarta", "solo", "karanganyar", "boyolali", "klaten", "sragen", "wonogiri",
  "jakarta", "surabaya", "semarang", "bandung", "medan", "bekasi", "tangerang", "depok",
  "bogor", "sidoarjo", "gresik", "makassar", "denpasar", "bali", "batam", "pekanbaru",
  "sleman", "bantul", "yogyakarta", "jogja", "malang"
]);

const COMPOUND_ROOTS = [
  "semen", "karang", "suko", "rawa", "banyu", "colo", "kebon", "kelapa", 
  "tanjung", "muara", "pondok", "pasar", "kali", "gunung", "batu"
];

export function generateSearchVariants(rawQ: string): string[] {
  const q = rawQ.trim().toLowerCase();
  const variants: string[] = [];

  // 1. Ekstrak pola ODP (misal FKS181, FRK053, FRS101)
  const odpMatch = q.match(/\b([a-z]{3}\s*\d+[a-z0-9]*)\b/i);
  if (odpMatch) {
    variants.push(odpMatch[1].replace(/\s+/g, ""));
  }

  // 2. Tokenisasi cerdas & strip prefix jalan / kata henti administratif
  const rawTokens = q.replace(/[,._\-/]/g, " ").split(/\s+/).filter((w) => w.length > 0);

  // Preserve frasa populer seperti "solo baru" agar tidak terpotong oleh stopword "solo"
  const isSoloBaru = q.includes("solo baru");
  if (isSoloBaru) {
    variants.push("solo baru");
  }

  let subTokens: string[] = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const t = rawTokens[i];
    if (t === "solo" && rawTokens[i + 1] === "baru") {
      subTokens.push("solo");
      continue;
    }
    if (t === "baru" && i > 0 && rawTokens[i - 1] === "solo") {
      subTokens.push("baru");
      continue;
    }
    if (!ADMIN_CITY_WORDS.has(t)) {
      subTokens.push(t);
    }
  }
  if (subTokens.length === 0) subTokens = rawTokens;

  // 3. Decompounding kata majemuk Indonesia tanpa spasi (misal: "semenromo" -> ["semen", "romo"])
  const decompounded: string[] = [];
  for (const tok of subTokens) {
    let split = false;
    for (const root of COMPOUND_ROOTS) {
      if (tok.startsWith(root) && tok.length > root.length + 2) {
        decompounded.push(root, tok.slice(root.length));
        split = true;
        break;
      }
    }
    if (!split) decompounded.push(tok);
  }

  // 4. Deteksi nama kota nasional untuk routing cerdas
  const KNOWN_CITIES = [
    "jakarta", "jaksel", "jaktim", "jakpus", "jakbar", "jakut",
    "surabaya", "sidoarjo", "gresik", "malang",
    "bandung", "cimahi", "cirebon", "bogor", "depok", "tangerang", "tangsel", "bekasi",
    "semarang", "jogja", "yogyakarta", "sleman", "bantul",
    "denpasar", "bali", "badung", "medan", "palembang", "pekanbaru", "batam", "makassar",
    "solo", "surakarta", "sukoharjo", "karanganyar", "klaten", "boyolali", "sragen", "wonogiri"
  ];
  const detectedCityToken = rawTokens.find((t) => KNOWN_CITIES.includes(t));

  // Varian Prioritas 1: Gabungan kata substantif bersih (menghasilkan akurasi instan & kilat di D1)
  if (decompounded.length >= 2) {
    variants.push(decompounded.join(" "));
    variants.push(decompounded.slice(0, 2).join(" "));
  } else if (decompounded.length === 1) {
    variants.push(decompounded[0]);
  }
  if (subTokens.length >= 1) {
    variants.push(subTokens.join(" "));
  }

  // Varian 2: Jika nama kota Solo dideteksi, sediakan juga alias Surakarta (agar pas dengan DB 'KOTA SURAKARTA')
  if (detectedCityToken === "solo" && decompounded.length > 0) {
    variants.push(`${decompounded.join(" ")} surakarta`);
    variants.push(`${decompounded.join(" ")} solo`);
  } else if (detectedCityToken && decompounded.length > 0) {
    variants.push(`${decompounded.join(" ")} ${detectedCityToken}`);
  }

  // Sertakan query asli jika belum ada sebagai fallback
  if (q.length >= 2 && !variants.includes(q)) {
    variants.push(q);
  }

  // Deduplikasi varian tetap menjaga prioritas urutan
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of variants) {
    const cleanV = v.trim();
    if (cleanV.length >= 2 && !seen.has(cleanV)) {
      seen.add(cleanV);
      result.push(cleanV);
    }
  }
  return result;
}

function scoreD1Result(r: D1SearchResult, queryTokens: string[]): number {
  const addr = (r.address || "").toLowerCase();
  const cluster = (r.cluster_name || "").toLowerCase();
  const city = (r.city || "").toLowerCase();
  const odp = (r.odp_id || "").toLowerCase();
  const full = `${addr} ${cluster} ${city} ${odp}`;

  let score = 0;
  for (const tok of queryTokens) {
    if (full.includes(tok)) {
      score += 10;
      if (addr.includes(tok)) score += 8;
      if (city.includes(tok)) score += 15; // Bobot prioritas kota pencarian
      if (odp.includes(tok)) score += 15;
      if (cluster.includes(tok)) score += 5;
    }
  }
  return score;
}

function dedupeAddressSegments(str: string): string {
  const parts = str.split(",").map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const res: string[] = [];
  for (const p of parts) {
    const key = p.toUpperCase();
    if (!seen.has(key)) {
      seen.add(key);
      res.push(p);
    }
  }
  return res.join(", ");
}

export async function cariAlamatSmart(
  query: string,
  limit = 12
): Promise<SmartSuggestionItem[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const items: SmartSuggestionItem[] = [];
  const seenAddresses = new Set<string>();
  const queryTokens = q.toLowerCase().split(/[\s,]+/).filter((w) => w.length >= 2);

  try {
    const d1Promise = (async (): Promise<D1SearchResult[]> => {
      const variants = generateSearchVariants(q).slice(0, 3);
      const collected: D1SearchResult[] = [];
      const seenIds = new Set<string>();

      // Fetch top variants in parallel direct to Cloudflare Worker (Zero redundant 404s)
      const fetchVariant = async (variant: string): Promise<D1SearchResult[]> => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const res = await fetch(
            `https://coverage-api.oktaarrijal.workers.dev/api/search?q=${encodeURIComponent(variant)}`,
            {
              signal: controller.signal,
              headers: { Accept: "application/json" }
            }
          );
          clearTimeout(timeoutId);
          if (!res.ok) return [];
          const json = (await res.json()) as { results?: D1SearchResult[] };
          return Array.isArray(json?.results) ? json.results : [];
        } catch {
          return [];
        }
      };

      const resultsArray = await Promise.all(variants.map(fetchVariant));
      for (const resList of resultsArray) {
        for (const item of resList) {
          if (item && item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            collected.push(item);
          }
        }
      }

      // Sortir hasil berdasarkan relevansi skor terhadap query pengguna
      collected.sort((a, b) => scoreD1Result(b, queryTokens) - scoreD1Result(a, queryTokens));
      return collected;
    })();

    const osmPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=6&countrycodes=id&viewbox=${SOLORAYA_VIEWBOX}&bounded=0&q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (!res.ok) return null;
        return (await res.json()) as NominatimItem[];
      } catch {
        return null;
      }
    })();

    const [d1Results, osmData] = await Promise.all([d1Promise, osmPromise]);

    // 1. Prioritas Titik Resmi D1 (Alamat jalan presisi + ODP aktif + Fiber Ready)
    if (Array.isArray(d1Results) && d1Results.length > 0) {
      for (const r of d1Results) {
        const cleanAddr = dedupeAddressSegments(cleanAlamatResmi(r.address));
        const itemTitle = cleanAddr || r.cluster_name;
        if (!itemTitle) continue;

        const dedupeKey = `${cleanAddr || r.cluster_name}|${r.city || ""}`.toUpperCase();
        if (!seenAddresses.has(dedupeKey)) {
          seenAddresses.add(dedupeKey);
          const cityText = r.city ? r.city : "Solo Raya";
          const odpPart = r.odp_id ? ` • ODP: ${r.odp_id}` : "";
          const clusterPart = r.cluster_name ? `Cluster ${r.cluster_name}` : "Jaringan Fiber";

          const hasCityInTitle = itemTitle.toUpperCase().includes(cityText.toUpperCase());
          const fullDisplayName = hasCityInTitle ? itemTitle : `${itemTitle}, ${cityText}`;

          items.push({
            lat: String(r.lat),
            lon: String(r.lng),
            title: itemTitle,
            subtitle: `${clusterPart}${odpPart} • Siap Pasang Fiber & Wireless`,
            display_name: fullDisplayName,
            isFiberReady: true,
            odp: r.odp_id,
            cluster: r.cluster_name,
            city: r.city,
          });
        }
        if (items.length >= limit) break;
      }
    }

    // 2. Fallback Nominatim jika kuota suggestions masih ada (POI/Jalan Umum)
    if (Array.isArray(osmData) && items.length < limit) {
      for (const r of osmData) {
        const parts = r.display_name.split(",");
        const title = parts[0].trim();
        const subtitle = parts.slice(1, 4).join(",").trim();
        const dedupeKey = title.toUpperCase();
        if (!seenAddresses.has(dedupeKey)) {
          seenAddresses.add(dedupeKey);
          items.push({
            lat: r.lat,
            lon: r.lon,
            title,
            subtitle: subtitle || "Area Layanan Tercover",
            display_name: dedupeAddressSegments(r.display_name),
            isFiberReady: false,
          });
        }
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

export async function reverseGeocodeNominatim(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.address) {
      const a = data.address;
      const road = a.road || a.pedestrian || a.residential || a.path || "";
      const village = a.village || a.neighbourhood || a.quarter || a.hamlet || a.suburb || "";
      const district = a.city_district || a.district || a.subdistrict || "";
      const city = a.city || a.town || a.county || "";
      const parts = [road, village, district, city].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : (data.display_name || null);
    }
  } catch {
    /* fallback jika error */
  }
  return null;
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




