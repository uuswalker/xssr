// Logika coverage murni (tanpa DOM) — port 1:1 dari cek-lokasi.js xssr@ec66035.
// Bisa di-unit-test; dipakai komponen CekLokasi.

export interface Pt {
  nama: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export const KOTA_SOLORAYA: Pt[] = [
  { nama: "Solo", lat: -7.5755, lng: 110.8243, radiusKm: 15 },
  { nama: "Sukoharjo", lat: -7.6807, lng: 110.838, radiusKm: 20 },
  { nama: "Klaten", lat: -7.7058, lng: 110.6069, radiusKm: 20 },
  { nama: "Karanganyar", lat: -7.6, lng: 110.95, radiusKm: 25 },
  { nama: "Boyolali", lat: -7.5333, lng: 110.6, radiusKm: 25 },
  { nama: "Sleman", lat: -7.7167, lng: 110.3556, radiusKm: 25 },
  { nama: "Yogyakarta", lat: -7.7956, lng: 110.3695, radiusKm: 18 },
  { nama: "Bantul", lat: -7.8897, lng: 110.3289, radiusKm: 25 },
  { nama: "Kulon Progo", lat: -7.7713, lng: 110.1581, radiusKm: 30 },
  { nama: "Gunungkidul", lat: -7.96, lng: 110.6033, radiusKm: 35 },
  { nama: "Magelang", lat: -7.4706, lng: 110.2178, radiusKm: 30 },
  { nama: "Semarang", lat: -7.0051, lng: 110.4381, radiusKm: 30 },
  { nama: "Salatiga", lat: -7.3305, lng: 110.5084, radiusKm: 20 },
];

export const KOTA_ALIASES: Record<string, string> = {
  solo: "Solo",
  surakarta: "Solo",
  sukoharjo: "Sukoharjo",
  karanganyar: "Karanganyar",
  klaten: "Klaten",
  boyolali: "Boyolali",
  sleman: "Sleman",
  yogyakarta: "Yogyakarta",
  jogja: "Yogyakarta",
  bantul: "Bantul",
  kulonprogo: "Kulon Progo",
  gunungkidul: "Gunungkidul",
  magelang: "Magelang",
  semarang: "Semarang",
  salatiga: "Salatiga",
};

/** format Nominatim viewbox: left,top,right,bottom (lon,lat,lon,lat) */

export const DAFTAR_BLACKLIST: string[] = [];

export function cekAreaBlacklist(alamat: string): string | null {
  if (!alamat) return null;
  const low = alamat.toLowerCase();
  for (const b of DAFTAR_BLACKLIST) {
    const regex = new RegExp("(^|[^a-z0-9])" + b + "([^a-z0-9]|$)", "i");
    if (regex.test(low)) {
      return b.charAt(0).toUpperCase() + b.slice(1);
    }
  }
  return null;
}

export const SOLORAYA_VIEWBOX = "109.80,-6.50,111.50,-8.30";

export function haversineM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const t = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * t) / 2);
  const b = Math.sin(((lng2 - lng1) * t) / 2);
  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(a * a + Math.cos(lat1 * t) * Math.cos(lat2 * t) * b * b)
    )
  );
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function jarakKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface Deteksi {
  nama: string | null;
  dalamArea: boolean;
}

export function deteksiKota(lat: number, lng: number): Deteksi {
  let terdekat: Pt | null = null;
  let jarakTerdekat = Infinity;
  for (const k of KOTA_SOLORAYA) {
    const d = jarakKm(lat, lng, k.lat, k.lng);
    if (d < jarakTerdekat) {
      jarakTerdekat = d;
      terdekat = k;
    }
  }
  if (terdekat && jarakTerdekat <= terdekat.radiusKm) {
    return { nama: terdekat.nama, dalamArea: true };
  }
  return { nama: terdekat ? terdekat.nama : null, dalamArea: false };
}

export type CoverageStatus =
  | "fiber"
  | "mungkin"
  | "manual"
  | "wireless"
  | "loading";

export interface CoverageResult {
  status: CoverageStatus;
  jarakM: number | null;
  zona: string | null;
  fiberM: number | null;
  homepassId: string | null;
  alamat: string | null;
  city?: string | null;
  odp?: string | null;
}

export interface CoverageData {
  pts: [number, number, string?, string?][];
  wpts: [number, number, number, string?, string?][];
  wzones: string[];
}

/** Cek wireless (data KMZ Sukoharjo, radius 300 m). */
export function cekWireless(
  data: CoverageData | null,
  lat: number,
  lng: number
): { jarakM: number; zona: string | null; homepassId: string | null; alamat: string | null } | null {
  if (!data || !data.wpts.length) return null;
  let best = Infinity;
  let bz: string | null = null;
  let bestHpId: string | null = null;
  let bestAddr: string | null = null;
  for (let i = 0; i < data.wpts.length; i++) {
    const p = data.wpts[i];
    const d = haversineM(lat, lng, p[1], p[0]);
    if (d < best) {
      best = d;
      bz = data.wzones[p[2]] || null;
      bestHpId = p[3] || null;
      bestAddr = p[4] || null;
    }
    if (best <= 20) break;
  }
  best = Math.round(best);
  if (best <= 300) return { jarakM: best, zona: bz, homepassId: bestHpId, alamat: bestAddr };
  return null;
}

/** Verdict coverage — urutan deteksi fiber vs wireless presisi 5 kota. */
export function cekCoverage(
  data: CoverageData | null,
  loaded: boolean,
  lat: number,
  lng: number,
  kota: string | null
): CoverageResult {
  if (!data || !data.pts.length || !loaded)
    return { status: "loading", jarakM: null, zona: null, fiberM: null, homepassId: null, alamat: null };
  let best = Infinity;
  let bestHpId: string | null = null;
  let bestAddr: string | null = null;
  for (let i = 0; i < data.pts.length; i++) {
    const d = haversineM(lat, lng, data.pts[i][1], data.pts[i][0]);
    if (d < best) {
      best = d;
      bestHpId = data.pts[i][2] || null;
      bestAddr = data.pts[i][3] || null;
    }
    if (best <= 20) break;
  }
  const m = Math.round(best);
  const w = cekWireless(data, lat, lng);

  // 1. Fiber Optic Tercover (<= 150m di seluruh 5 kota)
  if (m <= 150)
    return { status: "fiber", jarakM: m, zona: w ? w.zona : null, fiberM: null, homepassId: bestHpId, alamat: bestAddr };

  // 2. Kemungkinan Tercover (151m - 250m)
  if (m <= 250)
    return { status: "mungkin", jarakM: m, zona: w ? w.zona : null, fiberM: null, homepassId: bestHpId, alamat: bestAddr };

  // 3. Wireless Tercover jika ada titik wireless
  if (w)
    return {
      status: "wireless",
      jarakM: w.jarakM,
      zona: w.zona,
      fiberM: null,
      homepassId: w.homepassId || bestHpId,
      alamat: w.alamat || bestAddr
    };

  // 4. Fallback Klaten jika di luar jangkauan fiber langsung
  if (kota === "Klaten")
    return { status: "wireless", jarakM: null, zona: null, fiberM: null, homepassId: bestHpId, alamat: bestAddr };

  // 5. Default: Cek manual sales / Request Pasang Baru
  return { status: "manual", jarakM: m, zona: null, fiberM: null, homepassId: bestHpId, alamat: bestAddr };
}

export function formatAlamatDisekitarnya(rawAddress: string | null | undefined): string {
  if (!rawAddress) return "";
  const addr = rawAddress.trim();
  if (!addr) return "";
  // Hindari duplikasi jika sudah ada kata "disekitarnya"
  if (/(\(|\[)?\s*atau disekitarnya\s*(\)|\])?/i.test(addr)) {
    return addr;
  }
  return `${addr} (atau disekitarnya)`;
}

export const COV_TEXT: Record<CoverageStatus, [string, string, string]> = {
  fiber: ["#e6f7f3", "#026b55", "TERCOVER FIBER OPTIC (SIAP PASANG)"],
  mungkin: ["#fef3c7", "#92400e", "KEMUNGKINAN TERCOVER (BUTUH CEK JALUR)"],
  manual: ["#fff1f2", "#9f1239", "BELUM TERCOVER LANGSUNG"],
  wireless: ["#e0f2fe", "#075985", "TERCOVER WIRELESS (FWA)"],
  loading: ["#f3f4f6", "#666666", "MENGECEK JARINGAN..."],
};

/** Teks detail verdict — ramah pelanggan tanpa istilah teknis ODP/FAT/Site ID */
export function coverageDetail(cv: CoverageResult): string {
  const alamatFormat = cv.alamat ? formatAlamatDisekitarnya(cv.alamat) : "area lokasimu";
  if (cv.status === "fiber") {
    let s = `Jaringan Fiber Optic XL Home tersedia di ${alamatFormat} (±${cv.jarakM || 0} meter dari lokasimu). Port jaringan siap dipasang! `;
    if (cv.zona) s += `Jaringan Wireless juga tersedia di area ini. `;
    return s;
  } else if (cv.status === "mungkin") {
    return `Jaringan Fiber Optic XL Home terdeteksi di ${alamatFormat} (±${cv.jarakM || 0} meter). Masih dalam jangkauan tarikan kabel, tim sales kami akan prioritaskan verifikasi jalur untukmu. `;
  } else if (cv.status === "manual") {
    return `Jaringan kabel fiber terdekat berjarak ${cv.jarakM != null ? `±${cv.jarakM} meter` : "di luar jangkauan langsung"}. Kamu bisa ajukan Request Pasang Baru agar tim teknisi kami jadwalkan pembukaan tiang di lokasimu! `;
  } else if (cv.status === "wireless") {
    let s = cv.zona
      ? `Area Sukoharjo — tercover jaringan wireless XL Home${
          cv.jarakM != null ? ` (±${cv.jarakM} m)` : ""
        }, aktivasi cepat. `
      : "Area ini tercover jalur XL Home Wireless (tanpa kabel) — aktivasi cepat tanpa tunggu tiang fiber. ";
    if (cv.fiberM) s += `Jaringan fiber terdekat ${cv.alamat ? `(${alamatFormat}) ` : ""}±${cv.fiberM} m. `;
    return s;
  }
  return "Menghitung ketersediaan jaringan terdekat...";
}

/** Baris WA hasil coverage (untuk pesan lanjutKeWA). */
export function coverageLine(cv: CoverageResult | null): string {
  if (!cv || !cv.status || cv.status === "loading") return "";
  const label =
    cv.status === "fiber"
      ? "TERCOVER FIBER (Siap Pasang)"
      : cv.status === "wireless"
      ? "TERCOVER WIRELESS (FWA)"
      : cv.status === "mungkin"
      ? "KEMUNGKINAN TERCOVER"
      : "REQUEST PASANG BARU";
  return (
    "Status Jaringan: " +
    label +
    (cv.jarakM != null ? " (±" + cv.jarakM + " m)" : "") +
    "\n"
  );
}

/** Kolom jarakFiberM payload sheet (logika v6.3 xssr). */
export function jarakFiberField(cv: CoverageResult | null): number | string {
  if (!cv) return "";
  if (cv.status === "wireless") return cv.fiberM != null ? cv.fiberM : "";
  return cv.jarakM != null ? cv.jarakM : "";
}

export const WORKER_COVERAGE_API = "https://coverage-api.oktaarrijal.workers.dev/api/coverage";

export interface WorkerCoverageResponse {
  covered: boolean;
  type: "FIBER_FTTH" | "WIRELESS_FALLBACK";
  distance: number | null;
  maxDistance: number;
  homepassId: string | null;
  cluster: string | null;
  odp: string | null;
  city: string | null;
  address?: string | null;
  status: string | null;
  lookupLatencyMs: number;
  candidateCount: number;
  source: string;
}

export async function cekCoverageWorkerAPI(
  lat: number,
  lng: number
): Promise<CoverageResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${WORKER_COVERAGE_API}?lat=${lat}&lng=${lng}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data: WorkerCoverageResponse = await res.json();

    if (data && data.distance !== null) {
      const clusterText = data.cluster || "Cluster FTTH";
      const odpText = data.odp ? `ODP: ${data.odp}` : "";
      const cityText = data.city || "Area Layanan";
      // Prioritaskan alamat fisik resmi OWS jika tersedia dari database
      const alamatLengkap = data.address && data.address.trim()
        ? data.address.trim()
        : odpText
        ? `${clusterText} (${odpText}, ${cityText})`
        : `${clusterText} (${cityText})`;

      if (data.covered) {
        return {
          status: "fiber",
          jarakM: data.distance,
          zona: null,
          fiberM: null,
          homepassId: data.homepassId,
          alamat: alamatLengkap,
          city: data.city,
          odp: data.odp || null,
        };
      } else {
        // Jarak > 300m (SOP): Request Pasang Baru / Wireless Fallback dengan ODP lokal presisi (bukan lompat ke Solo Raya)
        return {
          status: "manual",
          jarakM: data.distance,
          zona: null,
          fiberM: null,
          homepassId: data.homepassId,
          alamat: alamatLengkap,
          city: data.city,
          odp: data.odp || null,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

