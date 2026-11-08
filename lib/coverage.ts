// Logika coverage murni (tanpa DOM) — port 1:1 dari cek-lokasi.js xssr@ec66035.
// Bisa di-unit-test; dipakai komponen CekLokasi.

export interface Pt {
  nama: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export const KOTA_SOLORAYA: Pt[] = [
  // Solo Raya & Jateng - DIY
  { nama: "Solo", lat: -7.5755, lng: 110.8243, radiusKm: 18 },
  { nama: "Sukoharjo", lat: -7.6807, lng: 110.838, radiusKm: 22 },
  { nama: "Klaten", lat: -7.7058, lng: 110.6069, radiusKm: 22 },
  { nama: "Karanganyar", lat: -7.6, lng: 110.95, radiusKm: 25 },
  { nama: "Boyolali", lat: -7.5333, lng: 110.6, radiusKm: 25 },
  { nama: "Sleman", lat: -7.7167, lng: 110.3556, radiusKm: 25 },
  { nama: "Yogyakarta", lat: -7.7956, lng: 110.3695, radiusKm: 20 },
  { nama: "Bantul", lat: -7.8897, lng: 110.3289, radiusKm: 25 },
  { nama: "Kulon Progo", lat: -7.7713, lng: 110.1581, radiusKm: 30 },
  { nama: "Gunungkidul", lat: -7.96, lng: 110.6033, radiusKm: 35 },
  { nama: "Magelang", lat: -7.4706, lng: 110.2178, radiusKm: 30 },
  { nama: "Semarang", lat: -7.0051, lng: 110.4381, radiusKm: 30 },
  { nama: "Salatiga", lat: -7.3305, lng: 110.5084, radiusKm: 20 },
  // Jabodetabek
  { nama: "Jakarta", lat: -6.2088, lng: 106.8456, radiusKm: 35 },
  { nama: "Bogor", lat: -6.5971, lng: 106.806, radiusKm: 25 },
  { nama: "Depok", lat: -6.4025, lng: 106.7942, radiusKm: 20 },
  { nama: "Tangerang", lat: -6.1783, lng: 106.6319, radiusKm: 25 },
  { nama: "Tangerang Selatan", lat: -6.2887, lng: 106.7179, radiusKm: 20 },
  { nama: "Bekasi", lat: -6.2383, lng: 106.9756, radiusKm: 25 },
  // Jawa Barat
  { nama: "Bandung", lat: -6.9175, lng: 107.6191, radiusKm: 28 },
  { nama: "Cimahi", lat: -6.8722, lng: 107.5422, radiusKm: 18 },
  { nama: "Cirebon", lat: -6.732, lng: 108.5523, radiusKm: 22 },
  // Jawa Timur
  { nama: "Surabaya", lat: -7.2575, lng: 112.7521, radiusKm: 28 },
  { nama: "Sidoarjo", lat: -7.4726, lng: 112.6675, radiusKm: 25 },
  { nama: "Gresik", lat: -7.1566, lng: 112.6555, radiusKm: 25 },
  { nama: "Malang", lat: -7.9666, lng: 112.6326, radiusKm: 25 },
  // Bali
  { nama: "Denpasar", lat: -8.6705, lng: 115.2126, radiusKm: 30 },
  { nama: "Badung", lat: -8.5833, lng: 115.1833, radiusKm: 25 },
  // Sumatera
  { nama: "Medan", lat: 3.5952, lng: 98.6722, radiusKm: 30 },
  { nama: "Palembang", lat: -2.9761, lng: 104.7754, radiusKm: 25 },
  { nama: "Pekanbaru", lat: 0.5071, lng: 101.4478, radiusKm: 25 },
  { nama: "Bandar Lampung", lat: -5.4292, lng: 105.2625, radiusKm: 25 },
  // Kalimantan
  { nama: "Balikpapan", lat: -1.2379, lng: 116.8529, radiusKm: 25 },
  { nama: "Samarinda", lat: -0.5022, lng: 117.1536, radiusKm: 25 },
  { nama: "Banjarmasin", lat: -3.3194, lng: 114.5908, radiusKm: 25 },
  // Sulawesi
  { nama: "Makassar", lat: -5.1477, lng: 119.4327, radiusKm: 30 },
  { nama: "Manado", lat: 1.4748, lng: 124.8421, radiusKm: 25 },
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
  // Nasional
  jakarta: "Jakarta",
  jakartaselatan: "Jakarta",
  jakartapusat: "Jakarta",
  jakartatimur: "Jakarta",
  jakartabarat: "Jakarta",
  jakartautara: "Jakarta",
  bogor: "Bogor",
  depok: "Depok",
  tangerang: "Tangerang",
  tangerangselatan: "Tangerang Selatan",
  tangsel: "Tangerang Selatan",
  bekasi: "Bekasi",
  bandung: "Bandung",
  cimahi: "Cimahi",
  cirebon: "Cirebon",
  surabaya: "Surabaya",
  sidoarjo: "Sidoarjo",
  gresik: "Gresik",
  malang: "Malang",
  denpasar: "Denpasar",
  badung: "Badung",
  bali: "Denpasar",
  medan: "Medan",
  palembang: "Palembang",
  pekanbaru: "Pekanbaru",
  lampung: "Bandar Lampung",
  bandarlampung: "Bandar Lampung",
  balikpapan: "Balikpapan",
  samarinda: "Samarinda",
  banjarmasin: "Banjarmasin",
  makassar: "Makassar",
  manado: "Manado",
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

export function cleanAlamatResmi(rawAddress: string | null | undefined): string {
  if (!rawAddress) return "";
  let addr = rawAddress.trim();
  // Strip ?- dummy vendor artifact e.g. "No. ?-69" -> "No. 69"
  addr = addr.replace(/No\.\s*\?-\s*/gi, "No. ");
  addr = addr.replace(/\?-\s*/g, "");
  addr = addr.replace(/\?/g, "");
  // Strip leading hyphen or dashes
  addr = addr.replace(/^-\s*/, "");
  // Strip (atau disekitarnya)
  addr = addr.replace(/(\(|\[)?\s*atau disekitarnya\s*(\)|\])?/i, "").trim();
  return addr;
}

export function formatAlamatDisekitarnya(rawAddress: string | null | undefined): string {
  if (!rawAddress) return "";
  const addr = cleanAlamatResmi(rawAddress);
  if (!addr) return "";
  // Hindari duplikasi jika sudah ada kata "disekitarnya"
  if (/(\(|\[)?\s*atau disekitarnya\s*(\)|\])?/i.test(addr)) {
    return addr;
  }
  return `${addr} (atau disekitarnya)`;
}

export const COV_TEXT: Record<CoverageStatus, [string, string, string]> = {
  fiber: ["#e6f7f3", "#026b55", "TERCOVER FIBER OPTIC & WIRELESS (SIAP PASANG) ✅"],
  mungkin: ["#fef3c7", "#92400e", "KEMUNGKINAN TERCOVER (BUTUH CEK JALUR) ⚠️"],
  manual: ["#fff1f2", "#9f1239", "BELUM TERCOVER LANGSUNG 📝"],
  wireless: ["#e0f2fe", "#075985", "TERCOVER WIRELESS (SIAP PASANG) ✅"],
  loading: ["#f3f4f6", "#666666", "MENGECEK JARINGAN..."],
};

/** Teks detail verdict — format resmi tercover fiber & wireless dengan ODP & jarak */
export function coverageDetail(cv: CoverageResult): string {
  const rawAlamat = cleanAlamatResmi(cv.alamat);
  const alamatFormat = rawAlamat || "Area Lokasi Anda";
  const waSalesLink = "wa.me/6287778999141";

  if (cv.status === "fiber") {
    const odpText = cv.odp ? `${cv.odp} ` : "";
    const jarakText =
      cv.jarakM != null
        ? `(± ${cv.jarakM} meter dari lokasi Anda)`
        : "(± dekat dari lokasi Anda)";
    const barisOdp =
      cv.odp || cv.jarakM != null
        ? `🌐 Titik ODP Terdekat: ${odpText}${jarakText}`
        : `🌐 Titik ODP Terdekat: Port jaringan aktif & terverifikasi`;

    return (
      `Halo! Kabar gembira untuk area Anda. Jaringan XL Home Fiber Optic kini telah tersedia dan siap dipasang di lokasi terdekat:\n\n` +
      `📍 Lokasi Acuan: ${alamatFormat} (Lokasi akurat bisa Whatsapp Sales ${waSalesLink})\n` +
      `${barisOdp}\n` +
      `🔌 Status: Port jaringan tersedia & siap langsung dipasang!\n\n` +
      `Selain jalur kabel (Fiber Optic), jaringan Wireless (Nirkabel 4G + 5G) juga sudah aktif dan tersedia di area ini.\n\n` +
      `Hubungi kami sekarang untuk registrasi dan pemasangan! 🚀`
    );
  } else if (cv.status === "wireless") {
    const is5G = cv.zona && cv.zona.includes("5G");
    const labelSinyal = is5G ? "XL Ultra 5G+ Wireless (FWA)" : "XL Home Wireless 4G/5G (FWA)";
    const barisFiber =
      cv.fiberM != null || cv.jarakM != null
        ? `🌐 Kabel Fiber Terdekat: ± ${cv.fiberM ?? cv.jarakM} meter dari lokasi Anda\n`
        : "";

    return (
      `Halo! Kabar gembira untuk area Anda. Jaringan ${labelSinyal} kini telah aktif dan siap dipasang:\n\n` +
      `📍 Lokasi Acuan: ${alamatFormat} (Lokasi akurat bisa Whatsapp Sales ${waSalesLink})\n` +
      `📶 Sinyal: Wireless High-Speed Siap Pakai\n` +
      `🔌 Status: Modem Plug & Play langsung aktif tanpa perlu tarik kabel!\n` +
      `${barisFiber}\n` +
      `Hubungi kami sekarang untuk registrasi dan pemasangan cepat! 🚀`
    );
  } else if (cv.status === "mungkin") {
    const jarakText =
      cv.jarakM != null
        ? `(± ${cv.jarakM} meter dari lokasi Anda)`
        : "(dalam radius tarikan kabel)";

    return (
      `Halo! Jaringan XL Home Fiber Optic terdeteksi di sekitar area Anda:\n\n` +
      `📍 Lokasi Acuan: ${alamatFormat} (Lokasi akurat bisa Whatsapp Sales ${waSalesLink})\n` +
      `🌐 Estimasi Tarikan Kabel: ${jarakText}\n` +
      `🔌 Status: Masih dalam jangkauan tarikan kabel, butuh verifikasi rute oleh teknisi.\n\n` +
      `Selain itu, jaringan Wireless (Nirkabel 4G + 5G) juga tersedia sebagai alternatif cepat.\n\n` +
      `Hubungi kami sekarang agar tim kami verifikasi jalur ke rumah Anda! 🚀`
    );
  } else if (cv.status === "manual") {
    const jarakText =
      cv.jarakM != null ? `± ${cv.jarakM} meter` : "di luar jangkauan langsung";

    return (
      `Halo! Jaringan kabel fiber terdekat berjarak ${jarakText} dari lokasi Anda:\n\n` +
      `📍 Lokasi Acuan: ${alamatFormat} (Lokasi akurat bisa Whatsapp Sales ${waSalesLink})\n` +
      `🔌 Status: Belum tercover kabel langsung.\n\n` +
      `Kamu bisa isi formulir Pengajuan Pasang di bawah ini atau hubungi WhatsApp Sales agar tim kami verifikasi opsi pemasangan terbaik ke lokasimu! 🚀`
    );
  }
  return "Menghitung ketersediaan jaringan terdekat...";
}

/** Baris WA hasil coverage (untuk pesan lanjutKeWA). */
export function coverageLine(cv: CoverageResult | null): string {
  if (!cv || !cv.status || cv.status === "loading") return "";
  const label =
    cv.status === "fiber"
      ? "TERCOVER FIBER & WIRELESS (Siap Pasang)"
      : cv.status === "wireless"
      ? "TERCOVER WIRELESS (FWA)"
      : cv.status === "mungkin"
      ? "KEMUNGKINAN TERCOVER"
      : "PENGAJUAN PASANG BARU";
  const odpInfo = cv.odp ? ` [ODP: ${cv.odp}]` : "";
  const jarakInfo = cv.jarakM != null ? ` (±${cv.jarakM}m)` : "";
  return `Status Jaringan: ${label}${odpInfo}${jarakInfo}\n`;
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
  type: "FIBER_FTTH" | "WIRELESS_5G" | "WIRELESS_4G" | "WIRELESS_FALLBACK";
  wirelessCovered?: boolean;
  wirelessType?: string | null;
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
  // Direct Cloudflare Worker first (Ultra-fast ~70ms edge lookup, CORS verified)
  const endpoints = [
    `${WORKER_COVERAGE_API}?lat=${lat}&lng=${lng}`,
    typeof window !== "undefined" ? `/api/coverage?lat=${lat}&lng=${lng}` : null
  ].filter(Boolean) as string[];

  for (const url of endpoints) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7500); // 7.5s toleransi jaringan seluler
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "Accept": "application/json" }
        });
        clearTimeout(timeoutId);

        if (!res.ok) continue;
        const data: WorkerCoverageResponse = await res.json();

        if (data && (data.distance !== null || data.wirelessCovered || data.covered)) {
          const clusterText = data.cluster || (data.city ? `Area ${data.city}` : "Area Layanan");
          const cityText = data.city || "";
          const alamatLengkap = data.address && data.address.trim()
            ? data.address.trim()
            : clusterText && cityText && !clusterText.toLowerCase().includes(cityText.toLowerCase())
            ? `${clusterText}, ${cityText}`
            : clusterText;

          if (data.covered) {
            return {
              status: "fiber",
              jarakM: data.distance,
              zona: data.wirelessType || "5G Ultra",
              fiberM: null,
              homepassId: data.homepassId,
              alamat: alamatLengkap,
              city: data.city,
              odp: data.odp || null,
            };
          } else if (data.wirelessCovered) {
            const is5G = data.type === "WIRELESS_5G" || (data.wirelessType && data.wirelessType.includes("5G"));
            return {
              status: "wireless",
              jarakM: data.distance,
              zona: is5G ? "5G Ultra" : "4G LTE",
              fiberM: data.distance,
              homepassId: data.homepassId,
              alamat: alamatLengkap,
              city: data.city,
              odp: data.odp || null,
            };
          } else {
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
      } catch {
        // Fallback or retry
      }
    }
  }
  return null;
}

