"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Radio,
  Wifi,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Navigation,
  ShieldCheck,
  Zap,
  Info,
} from "lucide-react";
import {
  cekCoverageWorkerAPI,
  cleanAlamatResmi,
  type CoverageResult,
} from "@/lib/coverage";
import {
  NOMOR_WA_SALES,
  LEAD_TOKEN,
  cariAlamatSmart,
  reverseGeocodeNominatim,
  postLead,
  normalisasiWA,
  gtag,
  type SmartSuggestionItem,
} from "@/lib/lead";

export interface PaketOption {
  id: string;
  name: string;
  group: "fiber" | "wireless" | "tahunan" | "lainnya";
}

const DAFTAR_PAKET_OPTIONS: PaketOption[] = [
  // 1. Fiber Optic (True Unlimited — 100% Tanpa FUP)
  { id: "spark-250", name: "XL Home Spark 250 Mbps — Promo Rp 229.000/bln [Best Seller]", group: "fiber" },
  { id: "starter-20", name: "XL Home Starter 20 Mbps — Rp 185.000/bln", group: "fiber" },
  { id: "spark-300", name: "XL Home Spark 300 Mbps — Rp 239.000/bln", group: "fiber" },
  { id: "spark-400", name: "XL Home Spark 400 Mbps — Rp 299.000/bln", group: "fiber" },
  { id: "spark-500", name: "XL Home Spark 500 Mbps — Rp 399.000/bln", group: "fiber" },
  { id: "spark-1000", name: "XL Home Spark 1000 Mbps (1 Gbps) — Rp 899.000/bln", group: "fiber" },

  // 2. WiFi Rumah Tanpa Kabel (FWA Nirkabel)
  { id: "fwa-advance-100", name: "WiFi Tanpa Kabel (FWA) 100 Mbps — Rp 790.000 / 4 bln [Best Seller]", group: "wireless" },
  { id: "fwa-advance-50", name: "WiFi Tanpa Kabel (FWA) 50 Mbps — Rp 650.000 / 4 bln (≈ Rp 162.500/bln)", group: "wireless" },
  { id: "fwa-monthly-100", name: "WiFi Tanpa Kabel (FWA Bulanan) 100 Mbps — Rp 219.500/bln", group: "wireless" },

  // 3. Paket Promo Tahunan (Bayar 10 Dapat 12)
  { id: "tahunan-smart-50", name: "Tahunan Basic Smart 50 Mbps — Rp 2.490.000/thn (≈ Rp 207.500/bln)", group: "tahunan" },
  { id: "tahunan-family-100", name: "Tahunan Basic Family 100 Mbps — Rp 3.190.000/thn (≈ Rp 265.800/bln)", group: "tahunan" },
  { id: "tahunan-superuser-150", name: "Tahunan Basic Superuser 150 Mbps — Rp 3.690.000/thn (≈ Rp 307.500/bln)", group: "tahunan" },

  // 4. Konsultasi / Rekomendasi
  { id: "rekomendasi", name: "Belum Memilih — Rekomendasikan Paket yang Paling Pas", group: "lainnya" },
];

export default function FormulirRegistrasi() {
  const [mode, setMode] = useState<"daftar" | "cek">("daftar");
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [paket, setPaket] = useState(DAFTAR_PAKET_OPTIONS[0].name); // default Spark 250 Mbps Best Seller
  const [setuju, setSetuju] = useState(true);

  // GPS & Coverage state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [mapsLink, setMapsLink] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [checkingCoverage, setCheckingCoverage] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<SmartSuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Anti-spam state
  const [honeypot, setHoneypot] = useState("");
  const pageT0 = useRef<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: "error" | "success"; msg: string } | null>(null);

  // Sinkronisasi jika ada event klik paket dari komponen lain
  useEffect(() => {
    const handlePaketEvent = (e: CustomEvent<{ paketName: string }>) => {
      if (e.detail && e.detail.paketName) {
        setPaket(e.detail.paketName);
        setMode("daftar");
        const el = document.getElementById("daftar");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("xl-pilih-paket" as unknown as keyof WindowEventMap, handlePaketEvent as EventListener);
    return () => {
      window.removeEventListener("xl-pilih-paket" as unknown as keyof WindowEventMap, handlePaketEvent as EventListener);
    };
  }, []);

  // Debounce Autocomplete Smart Search saat user mengetik alamat
  const handleAlamatChange = (val: string) => {
    setAlamat(val);
    setFormFeedback(null);

    if (searchDebounce.current) clearTimeout(searchDebounce.current);

    if (val.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchDebounce.current = setTimeout(async () => {
      try {
        const results = await cariAlamatSmart(val, 10);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        // abaikan error background search
      }
    }, 350);
  };

  // Pilih item dari autocomplete
  const handlePilihSuggestion = async (item: SmartSuggestionItem) => {
    const numLat = parseFloat(item.lat);
    const numLng = parseFloat(item.lon);

    setAlamat(item.display_name || item.title);
    setShowSuggestions(false);
    setLat(numLat);
    setLng(numLng);

    const gmaps = `https://www.google.com/maps?q=${numLat.toFixed(6)},${numLng.toFixed(6)}`;
    setMapsLink(gmaps);
    setGpsError(null);

    // Cek coverage instan via Cloudflare Worker D1
    setCheckingCoverage(true);
    try {
      const res = await cekCoverageWorkerAPI(numLat, numLng);
      setCoverage(res);
    } catch {
      // fallback jika timeout
    } finally {
      setCheckingCoverage(false);
    }
  };

  // Deteksi GPS "Pakai Lokasi Saya"
  const handleGpsClick = () => {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung fitur GPS. Silakan ketik alamat secara manual.");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setLat(latitude);
        setLng(longitude);

        const gmaps = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setMapsLink(gmaps);

        // Reverse geocoding alamat ramah manusia
        try {
          const revAddress = await reverseGeocodeNominatim(latitude, longitude);
          if (revAddress) {
            setAlamat(revAddress);
          } else {
            setAlamat(`Titik GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
          }
        } catch {
          setAlamat(`Titik GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
        }

        // Cek database Cloudflare D1 instan
        setCheckingCoverage(true);
        try {
          const res = await cekCoverageWorkerAPI(latitude, longitude);
          setCoverage(res);
        } catch {
          // toleransi error
        } finally {
          setCheckingCoverage(false);
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) {
          setGpsError("Izin lokasi tidak diberikan. Cukup ketik alamat lengkap Anda di bawah.");
        } else {
          setGpsError("Gagal mendeteksi lokasi GPS. Cukup ketik alamat lengkap Anda di bawah.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Submit Handler (Synchronous WhatsApp Trigger + Async Background Lead)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    // Validasi Dasar
    const cleanNama = nama.trim();
    const cleanWa = wa.trim();
    const cleanAlamatVal = alamat.trim();

    if (!cleanNama || !cleanWa || !cleanAlamatVal) {
      setFormFeedback({ type: "error", msg: "Mohon lengkapi Nama, WhatsApp, dan Alamat Anda." });
      return;
    }

    // Honeypot trap
    if (honeypot) return;

    // Speed guard: jika submit < 3 detik sejak load
    if (Date.now() - pageT0.current < 3000) {
      setFormFeedback({ type: "error", msg: "Mohon tunggu 3 detik sebelum mengirim." });
      return;
    }

    // Persetujuan privasi
    if (!setuju) {
      setFormFeedback({ type: "error", msg: "Mohon centang persetujuan kebijakan data." });
      return;
    }

    // Validasi Nomor WA Indonesia
    const digitsOnly = cleanWa.replace(/[\s-]/g, "");
    if (!/^(\+62|62|0)8\d{8,12}$/.test(digitsOnly)) {
      setFormFeedback({ type: "error", msg: "Nomor WhatsApp tidak valid. Contoh: 081234567890" });
      return;
    }

    // Rate Limiting 30 detik
    try {
      const last = Number(localStorage.getItem("last_form_submit") || 0);
      if (Date.now() - last < 30000) {
        setFormFeedback({ type: "error", msg: "Mohon tunggu 30 detik sebelum mengirim kembali." });
        return;
      }
      localStorage.setItem("last_form_submit", String(Date.now()));
    } catch {
      // abaikan storage error
    }

    setSubmitting(true);

    // Tracking Event Google Ads
    gtag("event", "conversion", {
      send_to: "AW-18450429750/WqVOCLX_4YcdELbu7N1E",
    });

    // Ringkasan Status Coverage
    let statusCoverageStr = "Menunggu verifikasi lapangan";
    if (coverage) {
      if (coverage.status === "fiber") {
        statusCoverageStr = "TERCOVER FIBER OPTIC & WIRELESS (SIAP PASANG) ✅";
      } else if (coverage.status === "wireless") {
        statusCoverageStr = `TERCOVER XL ULTRA 5G+ WIRELESS (${coverage.zona || "FWA Active"}) ✅`;
      } else if (coverage.status === "mungkin") {
        statusCoverageStr = `AREA DEKAT JALUR FIBER (~${coverage.jarakM || ""}m dari ODP)`;
      }
    }

    // Susun Teks Pesan WhatsApp
    const isCekOnly = mode === "cek";
    let pesanWa = "";

    if (isCekOnly) {
      pesanWa =
        `Halo Sales XL Home, saya ingin *Cek Ketersediaan Jaringan (Coverage)* di alamat saya:\n\n` +
        `👤 *Nama:* ${cleanNama}\n` +
        `📱 *No. WhatsApp:* ${cleanWa}\n` +
        `📍 *Alamat Lengkap:* ${cleanAlamatVal}\n` +
        (mapsLink ? `🌐 *Titik Google Maps:* ${mapsLink}\n` : "") +
        `🔌 *Status Jaringan:* ${statusCoverageStr}\n\n` +
        `Mohon dibantu cek ketersediaan jalur dan rekomendasi paket terbaik. Terima kasih!`;
    } else {
      pesanWa =
        `Halo Sales XL Home, saya ingin *Mendaftar Pasang Baru* layanan internet:\n\n` +
        `👤 *Nama:* ${cleanNama}\n` +
        `📱 *No. WhatsApp:* ${cleanWa}\n` +
        `📍 *Alamat Pemasangan:* ${cleanAlamatVal}\n` +
        (mapsLink ? `🌐 *Titik Google Maps:* ${mapsLink}\n` : "") +
        `📦 *Paket Diminati:* ${paket}\n` +
        `🔌 *Status Jaringan:* ${statusCoverageStr}\n\n` +
        `Mohon informasi proses pendaftaran dan jadwal pemasangan teknisi. Terima kasih!`;
    }

    // 1. BUKA WHATSAPP SECARA LANGSUNG (Synchronous User Gesture agar tidak diblokir browser mobile)
    const waUrl = `https://wa.me/${NOMOR_WA_SALES}?text=${encodeURIComponent(pesanWa)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // 2. Kirim Data Lead ke Google Sheets Webhook di background (Non-blocking)
    postLead({
      timestamp: new Date().toISOString(),
      tipe: isCekOnly ? "lokasi-saja" : "lengkap",
      token: LEAD_TOKEN,
      nama: cleanNama,
      whatsapp: normalisasiWA(cleanWa),
      alamat: cleanAlamatVal,
      paket: isCekOnly ? "Mode Cek Coverage Saja" : paket,
      latitude: lat,
      longitude: lng,
      kotaTerdeteksi: coverage?.city || "Solo Raya",
      coverage: coverage?.status || "formulir-web",
      jarakFiberM: coverage?.jarakM ?? "",
      zona: coverage?.zona ?? null,
      homepassId: coverage?.homepassId ?? null,
      homepassAddress: coverage?.alamat ?? null,
      odp: coverage?.odp ?? null,
      mapsLink: mapsLink || "",
      halaman: typeof window !== "undefined" ? window.location.href : "https://xlhomesolo.com/",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    setSubmitting(false);
    setFormFeedback({
      type: "success",
      msg: "Data Anda berhasil diteruskan ke WhatsApp Sales resmi XL Home. Tim kami akan segera merespons!",
    });
  };

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
          max-width: 600px;
          margin: 0 auto;
        }
        .reg-badge {
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
        .reg-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 10px 0;
          line-height: 1.25;
          text-align: center;
        }
        .reg-sub {
          font-size: 14.5px;
          color: var(--text-muted);
          margin: 0 auto 28px auto;
          line-height: 1.55;
          text-align: center;
          max-width: 520px;
        }
        .reg-form-wrap {
          background: #ffffff;
          border-radius: 18px;
          padding: 32px 26px;
          box-shadow: var(--shadow-card);
          border: 1.5px solid var(--border);
        }
        @media (max-width: 600px) {
          .reg-section { padding: 48px 16px; }
          .reg-form-wrap { padding: 20px 16px; border-radius: 14px; }
          .reg-title { font-size: 22px; }
          .reg-sub { font-size: 13.5px; margin-bottom: 22px; }
          .reg-select { font-size: 13.5px; padding-left: 12px; padding-right: 36px; }
          .cov-card-fiber, .cov-card-wireless, .cov-card-warning { padding: 12px; }
        }
        .reg-mode {
          display: flex;
          gap: 6px;
          background: var(--color-paper-3);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 5px;
          margin-bottom: 24px;
        }
        .reg-mode button {
          flex: 1;
          border: none;
          background: transparent;
          padding: 11px 8px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-family: inherit;
        }
        .reg-mode button.active {
          background: #ffffff;
          color: var(--green-dark);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }
        .reg-field {
          margin-bottom: 20px;
        }
        .reg-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .reg-input, .reg-select {
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          padding: 0 16px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 14.5px;
          font-family: inherit;
          color: var(--text);
          background: #ffffff;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-input:focus, .reg-select:focus, .reg-textarea:focus {
          outline: none;
          border-color: var(--green);
          box-shadow: 0 0 0 3px var(--green-light);
        }
        .reg-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23037E64' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 18px;
          padding-right: 42px;
          cursor: pointer;
        }
        .reg-textarea {
          width: 100%;
          min-height: 84px;
          box-sizing: border-box;
          padding: 12px 16px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 14.5px;
          font-family: inherit;
          color: var(--text);
          background: #ffffff;
          resize: vertical;
          line-height: 1.5;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .btn-lokasi-action {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          margin-top: 8px;
          background: var(--green-light);
          color: var(--green-dark);
          border: 1.5px solid rgba(3, 126, 100, 0.25);
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
        }
        .btn-lokasi-action:hover {
          background: rgba(3, 126, 100, 0.15);
          border-color: var(--green);
        }
        .btn-lokasi-action:disabled {
          opacity: 0.75;
          cursor: wait;
        }
        .reg-note {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 8px;
          line-height: 1.45;
        }
        .reg-sugg-dropdown {
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          box-shadow: var(--shadow-card-hover);
          margin-top: 6px;
          max-height: 220px;
          overflow-y: auto;
        }
        .reg-sugg-item {
          width: 100%;
          text-align: left;
          padding: 10px 14px;
          border: none;
          background: transparent;
          border-bottom: 1px solid var(--color-rule-2);
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-family: inherit;
        }
        .reg-sugg-item:hover {
          background: var(--green-light);
        }
        .cov-card-fiber {
          word-break: break-word;
          overflow-wrap: anywhere;
          background: var(--green-light);
          border: 1.5px solid var(--green);
          border-radius: 12px;
          padding: 16px;
          color: var(--green-dark);
          margin-top: 14px;
        }
        .cov-card-wireless {
          word-break: break-word;
          overflow-wrap: anywhere;
          background: #f0f9ff;
          border: 1.5px solid #0284c7;
          border-radius: 12px;
          padding: 16px;
          color: #0c4a6e;
          margin-top: 14px;
        }
        .cov-card-warning {
          background: #fffbeb;
          border: 1.5px solid #f59e0b;
          border-radius: 12px;
          padding: 16px;
          color: #78350f;
          margin-top: 14px;
        }
        .reg-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 18px 0;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .reg-checkbox-wrap input[type="checkbox"] {
          accent-color: var(--green);
        }
        .reg-submit-btn {
          width: 100%;
          padding: 15px 20px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--green-dark) 0%, var(--green) 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(3, 126, 100, 0.25);
          font-family: inherit;
        }
        .reg-submit-btn:hover {
          opacity: 0.94;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(3, 126, 100, 0.35);
        }
        .reg-submit-btn:disabled {
          opacity: 0.75;
          cursor: wait;
        }
        .reg-footer-shield {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 14px;
          text-align: center;
        }
      `}</style>

      <div className="reg-container">
        {/* Header Section */}
        <div style={{ textAlign: "center" }}>
          <div className="reg-badge">
            <Zap size={14} />
            PENDAFTARAN RESMI &amp; CEK JARINGAN REAL-TIME
          </div>
          <h2 className="reg-title">
            {mode === "daftar" ? "Daftar Pasang Baru XL Home" : "Cek Ketersediaan Jaringan XL Home"}
          </h2>
          <p className="reg-sub">
            {mode === "daftar"
              ? "Isi formulir dan alamat pemasangan Anda untuk registrasi cepat langsung terhubung ke WhatsApp Sales Resmi."
              : "Cukup isi nama, WhatsApp, dan alamat. Tim kami akan mengecek jangkauan fiber & wireless di lokasi Anda."}
          </p>
        </div>

        {/* Card Formulir */}
        <div className="reg-form-wrap">
          {/* Mode Switcher Buttons */}
          <div className="reg-mode" role="group" aria-label="Pilih keperluan formulir">
            <button
              type="button"
              onClick={() => setMode("daftar")}
              className={mode === "daftar" ? "active" : ""}
            >
              <Wifi size={16} />
              Daftar Pasang Baru
            </button>
            <button
              type="button"
              onClick={() => setMode("cek")}
              className={mode === "cek" ? "active" : ""}
            >
              <Navigation size={16} />
              Cek Jaringan Saja
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Input Nama */}
            <div className="reg-field">
              <label htmlFor="form-nama" className="reg-label">
                Nama Lengkap
              </label>
              <input
                id="form-nama"
                type="text"
                required
                maxLength={100}
                placeholder="Contoh: Budi Santoso"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="reg-input"
              />
            </div>

            {/* Input WhatsApp */}
            <div className="reg-field">
              <label htmlFor="form-wa" className="reg-label">
                Nomor WhatsApp Aktif
              </label>
              <input
                id="form-wa"
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                className="reg-input"
              />
            </div>

            {/* Alamat Lengkap + Tombol GPS */}
            <div className="reg-field" style={{ position: "relative" }}>
              <div className="reg-label">
                <span>Alamat Lengkap Pemasangan</span>
                {mapsLink && (
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textTransform: "none", color: "var(--green)", textDecoration: "underline", fontWeight: 700 }}
                  >
                    Buka Google Maps ↗
                  </a>
                )}
              </div>

              {/* Textarea Alamat Full-Width Proporsional */}
              <textarea
                id="form-alamat"
                aria-label="Alamat lengkap pemasangan"
                required
                rows={3}
                maxLength={300}
                placeholder="Ketik jalan, RT/RW, nomor rumah, perumahan, kelurahan, atau kecamatan..."
                value={alamat}
                onChange={(e) => handleAlamatChange(e.target.value)}
                className="reg-textarea"
              />

              {/* Tombol Deteksi Lokasi GPS Elegan & Nyaman Ditekan */}
              <button
                type="button"
                onClick={handleGpsClick}
                disabled={gpsLoading}
                className="btn-lokasi-action"
                title="Deteksi titik koordinat akurat melalui GPS perangkat"
              >
                {gpsLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Mencari titik koordinat GPS Anda...</span>
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    <span>Pakai Lokasi Saya Sekarang (Deteksi GPS Otomatis)</span>
                  </>
                )}
              </button>

              <div className="reg-note" style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <Info size={14} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                <span>Berbagi lokasi <strong>tidak wajib</strong>. Cukup ketik alamat lengkap, tim kami tetap dapat mengecek jaringan.</span>
              </div>

              {gpsError && (
                <div style={{ color: "#dc2626", fontSize: 13, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertCircle size={15} />
                  <span>{gpsError}</span>
                </div>
              )}

              {/* Dropdown Suggestions Autocomplete */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="reg-sugg-dropdown">
                  <div style={{ padding: "8px 12px", background: "var(--color-paper-2)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>
                    PILIH ALAMAT PEMASANGAN TERDEKAT
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePilihSuggestion(item)}
                      className="reg-sugg-item"
                    >
                      <MapPin size={15} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.35, whiteSpace: "normal", wordBreak: "break-word" }}>{item.title}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.35, whiteSpace: "normal", wordBreak: "break-word" }}>{item.subtitle || item.display_name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Verification Box (Jika Coverage Terdeteksi) */}
            {checkingCoverage && (
              <div style={{ padding: 14, background: "#f0f7ff", border: "1.5px solid #bae6fd", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                <Loader2 size={18} className="animate-spin" style={{ color: "#0284c7" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0369a1" }}>
                  Memverifikasi ketersediaan jaringan fiber &amp; wireless di lokasi Anda...
                </span>
              </div>
            )}

            {coverage && !checkingCoverage && (
              <div>
                {coverage.status === "fiber" ? (
                  <div className="cov-card-fiber">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontWeight: 800, fontSize: 14, color: "#065f46", lineHeight: 1.35 }}>
                      <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} aria-hidden="true" />
                      TERCOVER FIBER OPTIC &amp; WIRELESS (SIAP PASANG)
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "#064e3b" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <MapPin size={15} style={{ color: "#059669", flexShrink: 0, marginTop: 4 }} aria-hidden="true" />
                        <div>
                          <strong>Prediksi Lokasi:</strong> {cleanAlamatResmi(coverage.alamat) || "Area Lokasi Anda"}{" "}
                          <span style={{ color: "#6b7280", fontSize: 12, fontWeight: 400 }}>
                            (Lokasi akurat via WA wa.me/{NOMOR_WA_SALES})
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <Wifi size={15} style={{ color: "#059669", flexShrink: 0 }} aria-hidden="true" />
                        <div><strong>Tercover:</strong> FIBER dan WIRELESS</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <CheckCircle2 size={15} style={{ color: "#059669", flexShrink: 0 }} aria-hidden="true" />
                        <div><strong>Status:</strong> Jaringan tersedia &amp; siap langsung dipasang!</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #a7f3d0", fontSize: 12, color: "#047857" }}>
                      Selain jalur kabel (Fiber Optic), jaringan Wireless (Nirkabel 4G + 5G) juga sudah aktif dan tersedia di area ini.
                    </div>
                  </div>
                ) : coverage.status === "wireless" ? (
                  <div className="cov-card-wireless">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontWeight: 800, fontSize: 14, color: "#0369a1", lineHeight: 1.35 }}>
                      <Radio size={18} style={{ color: "#0284c7", flexShrink: 0 }} aria-hidden="true" />
                      TERCOVER XL ULTRA 5G+ WIRELESS (SIAP PASANG)
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "#075985" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <MapPin size={15} style={{ color: "#0284c7", flexShrink: 0, marginTop: 4 }} aria-hidden="true" />
                        <div>
                          <strong>Prediksi Lokasi:</strong> {cleanAlamatResmi(coverage.alamat) || "Area Lokasi Anda"}{" "}
                          <span style={{ color: "#6b7280", fontSize: 12, fontWeight: 400 }}>
                            (Lokasi akurat via WA wa.me/{NOMOR_WA_SALES})
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <Wifi size={15} style={{ color: "#0284c7", flexShrink: 0 }} aria-hidden="true" />
                        <div><strong>Tercover:</strong> XL Ultra 5G+ Wireless {coverage.zona ? `[${coverage.zona}]` : ""}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <CheckCircle2 size={15} style={{ color: "#0284c7", flexShrink: 0 }} aria-hidden="true" />
                        <div><strong>Status:</strong> Modem Plug &amp; Play langsung aktif tanpa perlu tarik kabel!</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cov-card-warning">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 14, color: "#92400e" }}>
                      <AlertCircle size={18} style={{ color: "#f59e0b", flexShrink: 0 }} aria-hidden="true" />
                      KEMUNGKINAN TERCOVER (BUTUH CEK JALUR ODP)
                    </div>
                    <p style={{ margin: "6px 0 0 0", fontSize: 12.5, lineHeight: 1.5, color: "#78350f" }}>
                      Alamat Anda berada di sekitar area jaringan XL Home. Tim sales kami akan memverifikasi jarak tarikan kabel ke rumah Anda via WhatsApp.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pilihan Paket (Hanya tampil pada Mode Daftar) */}
            {mode === "daftar" && (
              <div className="reg-field" style={{ marginTop: 20 }}>
                <div className="reg-label">
                  <span>Paket yang Diminati</span>
                  <a href="#paket" style={{ textTransform: "none", color: "var(--green)", textDecoration: "underline", fontWeight: 700 }}>
                    Lihat Daftar Paket di Atas ↑
                  </a>
                </div>
                <select
                  id="form-paket"
                  aria-label="Pilihan paket internet"
                  value={paket}
                  onChange={(e) => setPaket(e.target.value)}
                  className="reg-select"
                >
                  <optgroup label="Fiber Optic (True Unlimited — 100% Bebas FUP)">
                    {DAFTAR_PAKET_OPTIONS.filter((o) => o.group === "fiber").map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="WiFi Rumah Tanpa Kabel (FWA Nirkabel)">
                    {DAFTAR_PAKET_OPTIONS.filter((o) => o.group === "wireless").map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Paket Promo Tahunan (Bayar 10 Dapat 12)">
                    {DAFTAR_PAKET_OPTIONS.filter((o) => o.group === "tahunan").map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Konsultasi Kebutuhan">
                    {DAFTAR_PAKET_OPTIONS.filter((o) => o.group === "lainnya").map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}

            {/* Honeypot anti-bot (Hidden) */}
            <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
              <label htmlFor="form-website">Website</label>
              <input
                type="text"
                id="form-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Checkbox Kebijakan Privasi */}
            <div className="reg-checkbox-wrap">
              <input
                id="form-setuju"
                type="checkbox"
                checked={setuju}
                onChange={(e) => setSetuju(e.target.checked)}
                style={{ marginTop: 3, width: 16, height: 16, cursor: "pointer" }}
              />
              <label htmlFor="form-setuju" style={{ cursor: "pointer" }}>
                Saya menyetujui data di atas digunakan untuk konfirmasi pemasangan baru atau pengecekan jaringan resmi oleh tim sales XL Home.
              </label>
            </div>

            {/* Feedback Message */}
            {formFeedback && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: formFeedback.type === "error" ? "#fef2f2" : "#ecfdf5",
                  color: formFeedback.type === "error" ? "#b91c1c" : "#047857",
                  border: `1px solid ${formFeedback.type === "error" ? "#fecaca" : "#a7f3d0"}`,
                }}
              >
                {formFeedback.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{formFeedback.msg}</span>
              </div>
            )}

            {/* Tombol Submit WhatsApp */}
            <button
              type="submit"
              disabled={submitting}
              className="reg-submit-btn"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Meneruskan ke WhatsApp...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>
                    {mode === "daftar" ? "Daftar & Lanjut ke WhatsApp" : "Cek Coverage via WhatsApp"}
                  </span>
                </>
              )}
            </button>

            {/* Security Footnote */}
            <div className="reg-footer-shield">
              <ShieldCheck size={14} style={{ color: "#10b981" }} />
              <span>Koneksi aman langsung ke WhatsApp Sales Resmi XL Home Solo Raya (0877-7899-9141)</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
