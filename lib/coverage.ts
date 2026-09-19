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
export const SOLORAYA_VIEWBOX = "110.45,-7.30,111.15,-7.95";

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
}

export interface CoverageData {
  pts: [number, number][];
  wpts: [number, number, number][];
  wzones: string[];
}

/** Cek wireless (data KMZ Sukoharjo, radius 300 m). */
export function cekWireless(
  data: CoverageData | null,
  lat: number,
  lng: number
): { jarakM: number; zona: string | null } | null {
  if (!data || !data.wpts.length) return null;
  let best = Infinity;
  let bz: string | null = null;
  for (let i = 0; i < data.wpts.length; i++) {
    const p = data.wpts[i];
    const d = haversineM(lat, lng, p[1], p[0]);
    if (d < best) {
      best = d;
      bz = data.wzones[p[2]] || null;
    }
    if (best <= 20) break;
  }
  best = Math.round(best);
  if (best <= 300) return { jarakM: best, zona: bz };
  return null;
}

/** Verdict coverage — urutan persis cekCoverage() xssr. */
export function cekCoverage(
  data: CoverageData | null,
  loaded: boolean,
  lat: number,
  lng: number,
  kota: string | null
): CoverageResult {
  if (kota === "Klaten" || kota === "Boyolali")
    return { status: "wireless", jarakM: null, zona: null, fiberM: null };
  if (!data || !data.pts.length || !loaded)
    return { status: "loading", jarakM: null, zona: null, fiberM: null };
  let best = Infinity;
  for (let i = 0; i < data.pts.length; i++) {
    const d = haversineM(lat, lng, data.pts[i][1], data.pts[i][0]);
    if (d < best) best = d;
    if (best <= 20) break;
  }
  const m = Math.round(best);
  const w = cekWireless(data, lat, lng);
  if (m <= 100)
    return { status: "fiber", jarakM: m, zona: w ? w.zona : null, fiberM: null };
  if (w)
    return {
      status: "wireless",
      jarakM: w.jarakM,
      zona: w.zona,
      fiberM: m <= 250 ? m : null,
    };
  if (m <= 250) return { status: "mungkin", jarakM: m, zona: null, fiberM: null };
  return { status: "manual", jarakM: m, zona: null, fiberM: null };
}

export const COV_TEXT: Record<CoverageStatus, [string, string, string]> = {
  fiber: ["#e6f7f3", "#026b55", "TERCOVER FIBER OPTIC"],
  mungkin: ["#fef3c7", "#92400e", "KEMUNGKINAN TERCOVER"],
  manual: ["#f3f4f6", "#444444", "CEK MANUAL SALES"],
  wireless: ["#e0f2fe", "#075985", "WIRELESS TERCOVER"],
  loading: ["#f3f4f6", "#666666", "MENGECEK COVERAGE..."],
};

/** Teks detail verdict — persis tampilCoverage() xssr (HTML). */
export function coverageDetail(cv: CoverageResult): string {
  if (cv.status === "fiber") {
    let s = `Titik fiber terdekat hanya sekitar ${cv.jarakM} m dari lokasimu. `;
    if (cv.zona) s += `Wireless (Zona ${cv.zona}) juga tersedia di area ini. `;
    return s;
  } else if (cv.status === "mungkin") {
    return `Titik fiber terdekat sekitar ${cv.jarakM} m. Sales verifikasi + siapkan opsi wireless. `;
  } else if (cv.status === "manual") {
    return "Di luar jangkauan data fiber kami. Sales cek manual / tawarkan wireless. ";
  } else if (cv.status === "wireless") {
    let s = cv.zona
      ? `Masuk Zona ${cv.zona} — wireless tercover${
          cv.jarakM != null ? ` (±${cv.jarakM} m)` : ""
        }, aktif cepat. `
      : "Area ini jalur wireless (tanpa kabel) — aktif cepat. ";
    if (cv.fiberM) s += `Fiber terdekat ±${cv.fiberM} m — sales bisa cek opsi fiber dahulu. `;
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
    (cv.zona ? " Zona " + cv.zona : "") +
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
