"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CheckCircle2,
  Target,
  Search,
  ArrowRight,
  Zap,
  Loader2,
  AlertCircle,
  Send,
  ArrowLeft,
  ShieldCheck,
  Info,
} from "lucide-react";
import {
  COV_TEXT,
  KOTA_ALIASES,
  cekCoverageWorkerAPI,
  coverageDetail,
  coverageLine,
  cleanAlamatResmi,
  formatAlamatDisekitarnya,
  cekAreaBlacklist,
  deteksiKota,
  jarakFiberField,
  type CoverageResult,
} from "@/lib/coverage";
import { ADS_ID } from "@/lib/site";
import {
  NOMOR_WA_SALES,
  basePayload,
  cariAlamatNominatim,
  cariAlamatSmart,
  gtag,
  normalisasiWA,
  postLead,
  reverseGeocodeNominatim,
  type SmartSuggestionItem,
} from "@/lib/lead";

export interface PaketOption {
  id: string;
  name: string;
  group: "fiber" | "wireless" | "tahunan" | "lainnya";
}

export const DAFTAR_PAKET_OPTIONS: PaketOption[] = [
  // 1. Fiber Optic (True Unlimited — 100% Tanpa FUP)
  { id: "spark-250", name: "XL Home Spark 250 Mbps — Promo Rp 229.000/bln [Best Seller]", group: "fiber" },
  { id: "starter-20", name: "XL Home Starter 20 Mbps — Rp 185.000/bln", group: "fiber" },
  { id: "spark-300", name: "XL Home Spark 300 Mbps — Rp 239.000/bln", group: "fiber" },
  { id: "spark-400", name: "XL Home Spark 400 Mbps — Rp 299.000/bln", group: "fiber" },
  { id: "spark-500", name: "XL Home Spark 500 Mbps — Rp 399.000/bln", group: "fiber" },
  { id: "spark-1000", name: "XL Home Spark 1000 Mbps (1 Gbps) — Rp 899.000/bln", group: "fiber" },

  // 2. WiFi Rumah Tanpa Kabel (FWA Nirkabel)
  { id: "fwa-advance-100", name: "WiFi Tanpa Kabel (FWA) 100 Mbps Advance — Rp 790.000 / 4 bln [Best Seller]", group: "wireless" },
  { id: "fwa-advance-50", name: "WiFi Tanpa Kabel (FWA) 50 Mbps Advance — Rp 650.000 / 4 bln (≈ Rp 162.500/bln)", group: "wireless" },
  { id: "fwa-monthly-100", name: "WiFi Tanpa Kabel (FWA Bulanan) 100 Mbps — Rp 219.500/bln", group: "wireless" },

  // 3. Paket Promo Tahunan (Bayar 10 Dapat 12)
  { id: "tahunan-family-100", name: "Tahunan Basic Family 100 Mbps — Rp 3.190.000/thn (≈ Rp 265.800/bln) [Best Seller]", group: "tahunan" },
  { id: "tahunan-smart-50", name: "Tahunan Basic Smart 50 Mbps — Rp 2.490.000/thn (≈ Rp 207.500/bln)", group: "tahunan" },
  { id: "tahunan-superuser-150", name: "Tahunan Basic Superuser 150 Mbps — Rp 3.690.000/thn (≈ Rp 307.500/bln)", group: "tahunan" },

  // 4. Konsultasi / Rekomendasi
  { id: "rekomendasi", name: "Belum Memilih — Rekomendasikan Paket yang Paling Pas", group: "lainnya" },
];

const MAX_TUNGGU_DETIK = 8;
const TARGET_AKURASI_METER = 30;

export default function FormulirRegistrasi() {
  const [step, setStep] = useState<"lokasi" | "form">("lokasi");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SmartSuggestionItem[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [searching, setSearching] = useState(false);
  const [geoDisabled, setGeoDisabled] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusClass, setStatusClass] = useState("reg-status");
  const [tanpaPeta, setTanpaPeta] = useState<string | null>(null);

  // Form Fields
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [paketPilihan, setPaketPilihan] = useState<string>(DAFTAR_PAKET_OPTIONS[0].name);
  const [setuju, setSetuju] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Location & Coverage Data
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [lokasiInfo, setLokasiInfo] = useState("");
  const posRef = useRef<{ lat: number | null; lng: number | null; kota: string | null; alamat: string | null }>({
    lat: null,
    lng: null,
    kota: null,
    alamat: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const watchId = useRef<number | null>(null);
  const timers = useRef<number[]>([]);
  const intervals = useRef<number[]>([]);
  const debounce = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      intervals.current.forEach(clearInterval);
      if (watchId.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Listen to external triggers e.g. clicking a package CTA or #daftar
  useEffect(() => {
    const handleTrigger = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("[data-paket], a[href='#daftar']") as HTMLElement | null;
      if (el) {
        const p = el.getAttribute("data-paket");
        if (p) {
          const match = DAFTAR_PAKET_OPTIONS.find((item) =>
            item.name.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(item.id.toLowerCase())
          );
          if (match) setPaketPilihan(match.name);
          else setPaketPilihan(p);
        }
      }
    };
    document.addEventListener("click", handleTrigger, true);
    return () => document.removeEventListener("click", handleTrigger, true);
  }, []);

  // Autocomplete debouncer
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setShowSugg(false);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      cariAlamatSmart(q, 8).then(
        (data) => {
          setSuggestions(data || []);
          setShowSugg(true);
        },
        () => setShowSugg(false)
      );
    }, 350);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest?.(".reg-autocomplete-wrap") && e.target !== inputRef.current) {
        setShowSugg(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // Core Location Processing
  const prosesLokasi = useCallback((lat: number, lng: number, alamatExplicit: string | null) => {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timers.current = [];
    intervals.current = [];

    const bl = cekAreaBlacklist(alamatExplicit || "");
    if (bl) {
      setStatusClass("reg-status error");
      setStatusMsg(`Mohon maaf, area ${bl} saat ini belum masuk jangkauan resmi XL Home.`);
      return;
    }

    const det = deteksiKota(lat, lng);
    const k = det.nama || "Solo";
    const kota = KOTA_ALIASES[k.toLowerCase()] || k;

    setStatusClass("reg-status success");
    setStatusMsg("Lokasi terdeteksi! Memverifikasi ketersediaan jaringan...");

    if (alamatExplicit) {
      posRef.current = { lat, lng, kota, alamat: alamatExplicit };
      setLokasiInfo(`${alamatExplicit} (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      cekCoverageWorkerAPI(lat, lng).then((cv) => {
        setCoverage(cv);
        setStep("form");
        setStatusMsg("");
      });
      return;
    }

    // Deteksi via GPS (Titik Lokasi) - Paralel & Cepat (Zero Waterfall Delay)
    Promise.all([
      cekCoverageWorkerAPI(lat, lng),
      reverseGeocodeNominatim(lat, lng).catch(() => null)
    ]).then(([cv, res]) => {
      setCoverage(cv);
      const osmAddr = res || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      // Prioritaskan titik Homepass / Cluster FTTH resmi dari database XL Home jika terdeteksi
      const rawDbAddr = cv?.alamat ? cleanAlamatResmi(cv.alamat) : null;
      const finalAddr = rawDbAddr || osmAddr;

      posRef.current = { lat, lng, kota: cv?.city || kota, alamat: finalAddr };
      setLokasiInfo(`${finalAddr} (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      setStep("form");
      setStatusMsg("");
    });
  }, []);

  const prosesLokasiTanpaKoordinat = useCallback((alamat: string) => {
    posRef.current = { lat: null, lng: null, kota: "Solo", alamat };
    setLokasiInfo(alamat);
    setCoverage({
      status: "manual",
      jarakM: null,
      zona: null,
      fiberM: null,
      homepassId: null,
      alamat: alamat,
    });
    setStep("form");
    setStatusMsg("");
  }, []);

  // GPS Geolocation
  const gunakanLokasi = useCallback(() => {
    if (!navigator.geolocation) {
      setStatusClass("reg-status error");
      setStatusMsg("Browser kamu tidak mendukung deteksi lokasi otomatis. Silakan gunakan pencarian alamat manual di bawah.");
      return;
    }
    setGeoDisabled(true);
    let bestPos: GeolocationPosition | null = null;
    let detik = MAX_TUNGGU_DETIK;

    const upd = () => {
      const ak = bestPos ? `±${Math.round(bestPos.coords.accuracy)}m` : "mencari satelit...";
      setStatusClass("reg-status");
      setStatusMsg(`Menyempurnakan titik presisi GPS... (${detik}s) — Akurasi: ${ak}`);
    };
    upd();

    const countdown = window.setInterval(() => {
      detik -= 1;
      if (detik > 0) upd();
    }, 1000);
    intervals.current.push(countdown);

    const bersih = () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      clearInterval(countdown);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    timers.current.push(
      window.setTimeout(() => {
        bersih();
        setGeoDisabled(false);
        if (bestPos) {
          prosesLokasi(bestPos.coords.latitude, bestPos.coords.longitude, null);
        } else {
          setStatusClass("reg-status error");
          setStatusMsg("Izin lokasi belum diberikan. Silakan aktifkan izin lokasi di browser atau ketik alamat di bawah.");
        }
      }, MAX_TUNGGU_DETIK * 1000) as unknown as number
    );

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (!bestPos || pos.coords.accuracy < bestPos.coords.accuracy) bestPos = pos;
        upd();
        if (pos.coords.accuracy <= TARGET_AKURASI_METER) {
          bersih();
          setGeoDisabled(false);
          prosesLokasi(bestPos.coords.latitude, bestPos.coords.longitude, null);
        }
      },
      () => {
        if (!bestPos) {
          bersih();
          setGeoDisabled(false);
          setStatusClass("reg-status error");
          setStatusMsg("Gagal mengakses GPS. Pastikan GPS aktif atau gunakan input alamat manual di bawah.");
        }
      },
      { enableHighAccuracy: true, timeout: MAX_TUNGGU_DETIK * 1000, maximumAge: 0 }
    );
  }, [prosesLokasi]);

  // Alamat Manual Search
  const cariAlamat = useCallback(
    (alamat: string) => {
      setTanpaPeta(null);
      if (!alamat || alamat.trim().length < 3) {
        setStatusClass("reg-status error");
        setStatusMsg("Ketik alamat minimal 3 karakter untuk pengecekan jaringan.");
        return;
      }
      setShowSugg(false);
      setStatusClass("reg-status");
      setStatusMsg("Mencari titik alamat & ketersediaan jalur fiber...");
      setSearching(true);

      cariAlamatSmart(alamat, 1).then(
        (data) => {
          setSearching(false);
          if (data && data.length > 0) {
            prosesLokasi(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name);
          } else {
            setTanpaPeta(alamat);
            setStatusClass("reg-status error");
            setStatusMsg("Alamat tidak ditemukan di peta satelit. Klik tombol di bawah untuk tetap melanjutkan pendaftaran.");
          }
        },
        () => {
          setSearching(false);
          setTanpaPeta(alamat);
          setStatusClass("reg-status error");
          setStatusMsg("Alamat tidak ditemukan di peta. Klik tombol di bawah untuk tetap melanjutkan pendaftaran.");
        }
      );
    },
    [prosesLokasi]
  );

  // Submit Form ke WhatsApp & Google Sheets Webhook
  const handleKirim = useCallback(() => {
    const nm = nama.trim();
    const w = normalisasiWA(wa);

    if (!nm || nm.length < 2) {
      setFormError("Mohon isi nama lengkap pemohon terlebih dahulu.");
      return;
    }
    if (!w) {
      setFormError("Nomor WhatsApp aktif wajib diisi. Contoh: 081234567890.");
      return;
    }
    if (w.length < 10 || w.length > 14) {
      setFormError("Nomor WhatsApp belum valid (minimal 10-14 digit). Contoh: 081234567890.");
      return;
    }
    if (!paketPilihan) {
      setFormError("Silakan tentukan paket yang diminati.");
      return;
    }

    setFormError(null);
    setSending(true);

    const p = posRef.current;
    const mapsLink = p.lat != null && p.lng != null ? `https://www.google.com/maps?q=${p.lat},${p.lng}` : "";
    const kotaKirim = p.kota || coverage?.city || "Solo Raya";
    const alamatKirim = p.alamat || (p.lat && p.lng ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : "Area Solo Raya");
    const isManual = coverage?.status === "manual";

    // 1. Google Sheets Webhook Lead Telemetry (Internal Sales)
    postLead(
      basePayload(isManual ? "request-pasang-baru" : "lengkap", {
        nama: nm,
        whatsapp: w,
        lat: p.lat,
        lng: p.lng,
        alamat: alamatKirim,
        kota: kotaKirim,
        coverage: coverage?.status || "",
        jarakFiberM: jarakFiberField(coverage),
        zona: coverage?.zona || null,
        homepassId: coverage?.homepassId || null,
        homepassAddress: coverage?.alamat || null,
        odp: coverage?.odp || null,
        paket: paketPilihan || null,
      })
    );

    // 2. Google Analytics & Meta Ads Tracking
    gtag("event", "submit_cek_lokasi", {
      kota_terdeteksi: kotaKirim,
      page_path: typeof window !== "undefined" ? window.location.pathname : "/",
    });
    if (typeof (window as unknown as { gtag?: unknown }).gtag === "function") {
      const g = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag;
      g("event", "conversion", { send_to: `${ADS_ID}/uoD7CPXb27ADEN7y1b8D` });
    }
    if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
      const fbq = (window as unknown as { fbq: (...a: unknown[]) => void }).fbq;
      fbq("track", "Lead", {
        content_name: paketPilihan || "Formulir Registrasi Home",
        content_category: "homepage_inline_form",
        value: 229000,
        currency: "IDR",
      });
    }

    let utmSuffix = "";
    try {
      const u = sessionStorage.getItem("xlsr_utm");
      if (u) utmSuffix = `\n[Sumber: ${u}]`;
    } catch {}

    const covLine = coverageLine(coverage);
    const paketLine = paketPilihan ? `Paket: ${paketPilihan}\n` : "";

    // Pesan WhatsApp ke Sales Resmi (Privasi Aman: Tidak menampilkan ODP / Homepass ID ke customer)
    const pesan =
      `Halo kak, saya ${nm}, mau ${isManual ? "ajukan pemasangan baru" : "daftar pasang baru"} XL Home.\n` +
      paketLine +
      (alamatKirim ? `Alamat: ${alamatKirim}\n` : "") +
      (mapsLink ? `Peta lokasi: ${mapsLink}\n` : "") +
      (kotaKirim ? `Area/Kota: ${kotaKirim}\n` : "") +
      covLine +
      utmSuffix;

    window.open(`https://wa.me/${NOMOR_WA_SALES}?text=${encodeURIComponent(pesan)}`, "_blank");
    setSending(false);
  }, [nama, wa, paketPilihan, coverage]);

  const covStyle = coverage ? COV_TEXT[coverage.status] : null;

  return (
    <section className="reg-section" id="daftar">
      <style>{`
        .reg-section {
          padding: 64px 20px;
          background: var(--gray-bg);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          font-family: inherit;
        }
        .reg-container {
          max-width: 520px;
          margin: 0 auto;
        }
        .reg-badge-top {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: var(--green-light);
          color: var(--green-dark);
          border: 1px solid rgba(3, 126, 100, 0.2);
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .reg-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid var(--border);
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          padding: 28px 24px;
          box-sizing: border-box;
          position: relative;
        }
        .reg-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
        }
        .reg-sub {
          font-size: 13.5px;
          color: #64748b;
          text-align: center;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }
        .reg-btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #0d7a5f 0%, #037e64 100%);
          color: #ffffff;
          border: none;
          padding: 13px 18px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(3,126,100,0.22);
          transition: opacity 0.15s, transform 0.1s;
          font-family: inherit;
        }
        .reg-btn-primary:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }
        .reg-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .reg-divider {
          text-align: center;
          margin: 18px 0;
          position: relative;
          color: #94a3b8;
          font-size: 13px;
        }
        .reg-divider::before, .reg-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: #e2e8f0;
        }
        .reg-divider::before { left: 0; }
        .reg-divider::after { right: 0; }
        .reg-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin: 14px 0 6px 0;
        }
        .reg-input, .reg-select {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 14px;
          box-sizing: border-box;
          background: #ffffff;
          color: #0f172a;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-input:focus, .reg-select:focus {
          outline: none;
          border-color: #037e64;
          box-shadow: 0 0 0 3px rgba(3,126,100,0.12);
        }
        .reg-btn-secondary {
          width: 100%;
          background: #f0f9f7;
          color: #037e64;
          border: 1.5px solid #037e64;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
          font-family: inherit;
          transition: background 0.15s;
        }
        .reg-btn-secondary:hover {
          background: #e6f7f3;
        }
        .reg-btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .reg-btn-text {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          margin-top: 12px;
          font-family: inherit;
        }
        .reg-btn-text:hover {
          color: #0f172a;
        }
        .reg-autocomplete-wrap {
          position: relative;
        }
        .reg-suggestions {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          max-height: 220px;
          overflow-y: auto;
          z-index: 20;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .reg-suggestion-item {
          padding: 10px 14px;
          font-size: 13.5px;
          color: #334155;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          transition: background 0.15s ease;
        }
        .reg-suggestion-item:last-child {
          border-bottom: none;
        }
        .reg-suggestion-item:hover {
          background: #f0fdf4;
        }
        .reg-suggestion-item.fiber-ready {
          background: #fcfdfc;
        }
        .reg-suggestion-item.fiber-ready:hover {
          background: #ecfdf5;
        }
        .reg-sugg-icon {
          color: #0284c7;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .reg-suggestion-item.fiber-ready .reg-sugg-icon {
          color: #059669;
        }
        .reg-sugg-content {
          flex: 1;
          min-width: 0;
        }
        .reg-sugg-title {
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          font-size: 13px;
          line-height: 1.4;
        }
        .reg-sugg-title span:first-child {
          flex: 1;
          min-width: 0;
          word-break: break-word;
        }
        .reg-sugg-sub {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 3px;
          line-height: 1.35;
          word-break: break-word;
        }
        .reg-badge-fiber {
          font-size: 10px;
          font-weight: 700;
          color: #047857;
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          padding: 1.5px 6px;
          border-radius: 9999px;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .reg-badge-street {
          font-size: 10px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 1.5px 6px;
          border-radius: 9999px;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .reg-status {
          font-size: 13px;
          color: #64748b;
          margin-top: 12px;
          text-align: center;
          min-height: 18px;
          line-height: 1.45;
        }
        .reg-status.error {
          color: #dc2626;
          font-weight: 600;
        }
        .reg-status.success {
          color: #037e64;
          font-weight: 600;
        }
        .reg-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }
        @media (max-width: 480px) {
          .reg-section { padding: 48px 14px; }
          .reg-card { padding: 22px 16px; border-radius: 14px; }
          .reg-title { font-size: 18px; }
          .reg-sub { font-size: 13px; }
          .reg-btn-primary { padding: 12px 16px; font-size: 14px; }
        }
      `}</style>

      <div className="reg-container">
        <div style={{ textAlign: "center" }}>
          <div className="reg-badge-top">
            <Zap size={14} /> PENDAFTARAN RESMI &amp; CEK JARINGAN REAL-TIME
          </div>
        </div>

        <div className="reg-card">
          <AnimatePresence mode="wait">
            {step === "lokasi" ? (
              <motion.div
                key="lokasi"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="reg-title">
                  <MapPin size={20} color="var(--green)" /> Cek Ketersediaan &amp; Pasang Baru
                </h2>
                <p className="reg-sub">
                  Bagikan lokasimu — sistem kami mengecek ketersediaan Fiber Optic &amp; Wireless secara instan di titikmu.
                </p>

                {/* Tombol Deteksi GPS Otomatis */}
                <button
                  type="button"
                  className="reg-btn-primary"
                  disabled={geoDisabled}
                  onClick={gunakanLokasi}
                >
                  <Target size={18} /> Gunakan Lokasi Saya Sekarang
                </button>

                <div className="reg-divider">
                  <span>atau</span>
                </div>

                {/* Input Alamat Manual dengan Autocomplete */}
                <label htmlFor="reg-alamat-input" className="reg-label">
                  Masukkan Alamat Pemasangan Manual
                </label>
                <div className="reg-autocomplete-wrap">
                  <input
                    type="text"
                    id="reg-alamat-input"
                    className="reg-input"
                    placeholder="Contoh: Jl. Slamet Riyadi, Solo atau nama perumahan..."
                    autoComplete="off"
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        cariAlamat(query.trim());
                      }
                    }}
                  />
                  {showSugg && (
                    <div className="reg-suggestions">
                      {suggestions.length === 0 ? (
                        <div style={{ padding: "12px 14px", fontSize: 13, color: "#94a3b8", textAlign: "center" }}>
                          Tidak ada saran. Coba kata kunci lain atau tekan &quot;Cari Alamat&quot;.
                        </div>
                      ) : (
                        suggestions.map((s, i) => (
                          <div
                            key={i}
                            className={`reg-suggestion-item ${s.isFiberReady ? "fiber-ready" : ""}`}
                            onClick={() => {
                              const formatted = formatAlamatDisekitarnya(s.display_name);
                              setQuery(formatted);
                              setShowSugg(false);
                              prosesLokasi(parseFloat(s.lat), parseFloat(s.lon), formatted);
                            }}
                          >
                            <div className="reg-sugg-icon">
                              {s.isFiberReady ? <Zap size={16} /> : <MapPin size={16} />}
                            </div>
                            <div className="reg-sugg-content">
                              <div className="reg-sugg-title">
                                <span>{s.title}</span>
                                {s.isFiberReady ? (
                                  <span className="reg-badge-fiber">
                                    <Zap size={11} style={{ display: "inline", marginRight: 2 }} /> Siap Pasang
                                  </span>
                                ) : (
                                  <span className="reg-badge-street">
                                    <MapPin size={11} style={{ display: "inline", marginRight: 2 }} /> Alamat
                                  </span>
                                )}
                              </div>
                              <div className="reg-sugg-sub">{s.subtitle}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="reg-btn-secondary"
                  disabled={searching}
                  onClick={() => cariAlamat(query.trim())}
                >
                  {searching ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Memeriksa Jalur Jaringan...
                    </>
                  ) : (
                    <>
                      <Search size={17} /> Cari Alamat &amp; Cek Jaringan
                    </>
                  )}
                </button>

                {tanpaPeta && (
                  <button
                    type="button"
                    className="reg-btn-secondary"
                    style={{ marginTop: 10, borderColor: "#cbd5e1", color: "#334155" }}
                    onClick={() => prosesLokasiTanpaKoordinat(tanpaPeta)}
                  >
                    <ArrowRight size={17} /> Tetap Lanjutkan dengan Alamat Ini
                  </button>
                )}

                <div className="reg-status" style={{ marginTop: 10 }}>
                  {statusMsg && <div className={statusClass}>{statusMsg}</div>}
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 12, fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
                  <Info size={14} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />
                  <span>Berbagi lokasi GPS tidak wajib. Ketik alamat manual di atas, tim kami tetap dapat mengecek jalur jaringan.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="reg-title" style={{ color: "#0f172a" }}>
                  <CheckCircle2 size={20} color="var(--green)" /> Lokasi Terkonfirmasi!
                </h3>
                <p className="reg-sub" style={{ margin: "0 0 14px 0" }}>
                  {cleanAlamatResmi(lokasiInfo) || "Area Solo Raya dan sekitarnya"}
                </p>

                {/* Banner Status Coverage Resmi */}
                {coverage && covStyle && (
                  <div
                    style={{
                      background: covStyle[0],
                      color: covStyle[1],
                      border: `1px solid ${covStyle[1]}30`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      marginBottom: 18,
                    }}
                  >
                    <strong style={{ display: "block", fontSize: 13.5, marginBottom: 4 }}>
                      {covStyle[2]}
                    </strong>
                    <div style={{ fontSize: 12.5, opacity: 0.95 }}>
                      {coverageDetail(coverage)
                        .split(/(wa\.me\/[^\s)]+)/g)
                        .map((part, i) =>
                          part.startsWith("wa.me/") ? (
                            <a
                              key={i}
                              href={`https://${part}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "inherit", fontWeight: 700, textDecoration: "underline" }}
                            >
                              {part}
                            </a>
                          ) : (
                            part
                          )
                        )}
                    </div>
                  </div>
                )}

                {/* Form Pendaftaran Nama, WhatsApp & Paket */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="reg-label" style={{ marginTop: 0 }}>
                      Nama Lengkap Pemohon
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="reg-input"
                    />
                  </div>

                  <div>
                    <label className="reg-label" style={{ marginTop: 0 }}>
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={wa}
                      onChange={(e) => setWa(e.target.value)}
                      className="reg-input"
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="reg-label" style={{ margin: 0 }}>
                        Pilihan Paket yang Diminati
                      </label>
                      <a
                        href="#paket"
                        style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, textDecoration: "none" }}
                      >
                        Lihat Rincian Paket ↑
                      </a>
                    </div>
                    <select
                      value={paketPilihan}
                      onChange={(e) => setPaketPilihan(e.target.value)}
                      className="reg-select"
                    >
                      <optgroup label="FIBER OPTIC (UNLIMITED TANPA FUP)">
                        {DAFTAR_PAKET_OPTIONS.filter((p) => p.group === "fiber").map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="WIFI RUMAH TANPA KABEL (WIRELESS FWA)">
                        {DAFTAR_PAKET_OPTIONS.filter((p) => p.group === "wireless").map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="PAKET PROMO TAHUNAN (BAYAR 10 DAPAT 12)">
                        {DAFTAR_PAKET_OPTIONS.filter((p) => p.group === "tahunan").map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="KONSULTASI">
                        {DAFTAR_PAKET_OPTIONS.filter((p) => p.group === "lainnya").map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#475569", cursor: "pointer", marginTop: 4 }}>
                    <input
                      type="checkbox"
                      checked={setuju}
                      onChange={(e) => setSetuju(e.target.checked)}
                      style={{ marginTop: 2, accentColor: "#037e64" }}
                    />
                    <span>
                      Saya menyetujui data di atas digunakan untuk verifikasi jaringan dan konfirmasi pemasangan baru oleh tim sales resmi XL Home.
                    </span>
                  </label>

                  {formError && (
                    <div style={{ color: "#dc2626", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                      <AlertCircle size={15} />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={sending || !setuju}
                    onClick={handleKirim}
                    className="reg-btn-primary"
                    style={{ marginTop: 6 }}
                  >
                    {sending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Menghubungkan ke Sales...
                      </>
                    ) : (
                      <>
                        <Send size={17} /> Daftar &amp; Lanjut ke WhatsApp
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => setStep("lokasi")}
                      className="reg-btn-text"
                    >
                      <ArrowLeft size={14} /> Ubah Alamat / Cek Lokasi Lain
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="reg-trust">
            <ShieldCheck size={16} color="var(--green)" />
            <span>Koneksi langsung ke WhatsApp Sales Resmi XL Home Solo Raya (0877-7899-9141)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
