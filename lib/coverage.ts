// Logika coverage murni (tanpa DOM) — port 1:1 dari cek-lokasi.js xssr@ec66035.
// Bisa di-unit-test; dipakai komponen CekLokasi.

export interface Pt {
  nama: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export const KOTA_SOLORAYA: Pt[] = [
  { nama: "Solo", lat: -7.5755, lng: 110.8243, radiusKm: 12 },
  { nama: "Sukoharjo", lat: -7.6807, lng: 110.838, radiusKm: 15 },
  { nama: "Klaten", lat: -7.7058, lng: 110.6069, radiusKm: 18 },
  { nama: "Karanganyar", lat: -7.6, lng: 110.95, radiusKm: 18 },
  { nama: "Boyolali", lat: -7.5333, lng: 110.6, radiusKm: 18 },
];

export const KOTA_ALIASES: Record<string, string> = {
  solo: "Solo",
  surakarta: "Solo",
  sukoharjo: "Sukoharjo",
  karanganyar: "Karanganyar",
  klaten: "Klaten",
  boyolali: "Boyolali",
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

export const COV_TEXT: Record<CoverageStatus, [string, string, string]> = {
  fiber: ["#e6f7f3", "#026b55", "TERCOVER FIBER OPTIC (SIAP PASANG)"],
  mungkin: ["#fef3c7", "#92400e", "KEMUNGKINAN TERCOVER (BUTUH CEK JALUR)"],
  manual: ["#fff1f2", "#9f1239", "BELUM TERCOVER LANGSUNG"],
  wireless: ["#e0f2fe", "#075985", "TERCOVER WIRELESS (FWA)"],
  loading: ["#f3f4f6", "#666666", "MENGECEK JARINGAN ODP..."],
};

/** Teks detail verdict — persis tampilCoverage() xssr (HTML). */
export function coverageDetail(cv: CoverageResult): string {
  if (cv.status === "fiber") {
    let s = `Titik ODP fiber terdekat ${cv.alamat ? `di ${cv.alamat} ` : ""}hanya sekitar ${cv.jarakM} meter dari lokasimu. Port siap pasang! `;
    if (cv.zona) s += `Jaringan Wireless (Area Sukoharjo) juga tersedia di area ini. `;
    return s;
  } else if (cv.status === "mungkin") {
    return `Titik ODP fiber terdekat ${cv.alamat ? `di ${cv.alamat} ` : ""}berjarak sekitar ${cv.jarakM} meter. Masih dalam jangkauan tarikan kabel, tim kami akan verifikasi jalur teknisi. `;
  } else if (cv.status === "manual") {
    return `Jarak ke titik ODP fiber terdekat sekitar ${cv.jarakM != null ? `${cv.jarakM} meter` : "di luar jangkauan"}. Kamu bisa ajukan Request Pasang Baru agar tim kami jadwalkan pembukaan titik di lokasimu! `;
  } else if (cv.status === "wireless") {
    let s = cv.zona
      ? `Masuk Area Sukoharjo — jaringan wireless tercover${
          cv.jarakM != null ? ` (±${cv.jarakM} m)` : ""
        }, aktif cepat. `
      : "Area ini jalur wireless (tanpa kabel) — aktif cepat. ";
    if (cv.fiberM) s += `Fiber terdekat ${cv.alamat ? `(${cv.alamat}) ` : ""}±${cv.fiberM} m — sales bisa cek opsi fiber dahulu. `;
    return s;
  }
  return "Menghitung jarak ke titik fiber terdekat...";
}

/** Baris WA hasil coverage (untuk pesan lanjutKeWA). */
export function coverageLine(cv: CoverageResult | null): string {
  if (!cv || !cv.status || cv.status === "loading") return "";
  return (
    "Hasil cek coverage: " +
    cv.status.toUpperCase() +
    (cv.zona ? " (Area Sukoharjo)" : "") +
    (cv.jarakM != null ? " (sekitar " + cv.jarakM + " m)" : "") +
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

    if (data.covered && data.distance !== null) {
      const clusterText = data.cluster || "Cluster FTTH";
      const odpText = data.odp ? `ODP: ${data.odp}` : "";
      const cityText = data.city || "Solo Raya";
      const alamatLengkap = odpText
        ? `${clusterText} (${odpText}, ${cityText})`
        : `${clusterText} (${cityText})`;

      return {
        status: "fiber",
        jarakM: data.distance,
        zona: null,
        fiberM: null,
        homepassId: data.homepassId,
        alamat: alamatLengkap,
      };
    }
    return null;
  } catch {
    return null;
  }
}

