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

const DAFTAR_PAKET_OPTIONS = [
  { id: "starter-20", name: "XL Home Starter — 20 Mbps (Rp 185.000/bln)" },
  { id: "value-30", name: "XL Home Fiber Value — 30 Mbps (Rp 219.000/bln)" },
  { id: "smart-50", name: "XL Home Fiber Smart — 50 Mbps (Rp 269.000/bln) [Favorit]" },
  { id: "family-100", name: "XL Home Fiber Family — 100 Mbps (Rp 349.000/bln)" },
  { id: "super-200", name: "XL Home Fiber Super — 200 Mbps (Rp 499.000/bln)" },
  { id: "wireless-100", name: "XL Home Wireless 5G — 100 Mbps (Rp 219.500/bln) [Plug & Play]" },
  { id: "rekomendasi", name: "Belum Memilih — Rekomendasikan yang Terbaik di Alamat Saya" },
];

export default function FormulirRegistrasi() {
  const [mode, setMode] = useState<"daftar" | "cek">("daftar");
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [paket, setPaket] = useState(DAFTAR_PAKET_OPTIONS[1].name); // default 30 Mbps
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
        const results = await cariAlamatSmart(val, 5);
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
        `🔌 *Status Deteksi D1:* ${statusCoverageStr}\n\n` +
        `Mohon dibantu cek ketersediaan jalur dan rekomendasi paket terbaik. Terima kasih!`;
    } else {
      pesanWa =
        `Halo Sales XL Home, saya ingin *Mendaftar Pasang Baru* layanan internet:\n\n` +
        `👤 *Nama:* ${cleanNama}\n` +
        `📱 *No. WhatsApp:* ${cleanWa}\n` +
        `📍 *Alamat Pemasangan:* ${cleanAlamatVal}\n` +
        (mapsLink ? `🌐 *Titik Google Maps:* ${mapsLink}\n` : "") +
        `📦 *Paket Diminati:* ${paket}\n` +
        `🔌 *Status Deteksi D1:* ${statusCoverageStr}\n\n` +
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
          padding: 70px 20px;
          background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 50%, #f4f8fc 100%);
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
          padding: 5px 14px;
          border-radius: 999px;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(3,105,161,0.1);
        }
        .reg-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px 0;
          line-height: 1.25;
          text-align: center;
        }
        .reg-sub {
          font-size: 14.5px;
          color: #475569;
          margin: 0 auto 28px auto;
          line-height: 1.55;
          text-align: center;
          max-width: 520px;
        }
        .reg-form-wrap {
          background: #ffffff;
          border-radius: 20px;
          padding: 34px 28px;
          box-shadow: 0 12px 40px rgba(0, 51, 160, 0.08), 0 2px 6px rgba(0,0,0,0.04);
          border: 1px solid #e2e8f0;
        }
        @media (max-width: 600px) {
          .reg-form-wrap { padding: 22px 18px; border-radius: 16px; }
          .reg-title { font-size: 23px; }
        }
        .reg-mode {
          display: flex;
          gap: 6px;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 5px;
          margin-bottom: 24px;
        }
        .reg-mode button {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 8px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 700;
          color: #64748b;
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
          color: #0033a0;
          box-shadow: 0 3px 10px rgba(0, 51, 160, 0.12);
        }
        .reg-field {
          margin-bottom: 20px;
        }
        .reg-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .reg-input, .reg-select {
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          padding: 0 16px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 14.5px;
          font-family: inherit;
          color: #0f172a;
          background: #ffffff;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-input:focus, .reg-select:focus, .reg-textarea:focus {
          outline: none;
          border-color: #0066ff;
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
        }
        .reg-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230033A0' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 18px;
          padding-right: 42px;
          cursor: pointer;
        }
        .alamat-wrap {
          display: flex;
          align-items: stretch;
        }
        .reg-textarea {
          flex: 1;
          min-height: 84px;
          box-sizing: border-box;
          padding: 12px 16px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px 0 0 10px;
          border-right: none;
          font-size: 14.5px;
          font-family: inherit;
          color: #0f172a;
          background: #ffffff;
          resize: vertical;
          line-height: 1.5;
        }
        .btn-lokasi {
          flex-shrink: 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 16px;
          background: #0033a0;
          color: #ffffff;
          border: 1.5px solid #0033a0;
          border-radius: 0 10px 10px 0;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          animation: btnPulse 2.5s infinite ease-in-out;
        }
        .btn-lokasi:hover {
          background: #002277;
        }
        .btn-lokasi:disabled {
          opacity: 0.75;
          cursor: wait;
        }
        @keyframes btnPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @media (max-width: 520px) {
          .alamat-wrap {
            flex-direction: column;
          }
          .reg-textarea {
            border-radius: 10px 10px 0 0;
            border-right: 1.5px solid #cbd5e1;
            border-bottom: none;
          }
          .btn-lokasi {
            border-radius: 0 0 10px 10px;
            padding: 13px;
          }
        }
        .reg-note {
          font-size: 12px;
          color: #64748b;
          margin-top: 6px;
          line-height: 1.45;
        }
        .reg-sugg-dropdown {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
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
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-family: inherit;
        }
        .reg-sugg-item:hover {
          background: #f0f7ff;
        }
        .cov-card-fiber {
          background: #ecfdf5;
          border: 1.5px solid #10b981;
          border-radius: 12px;
          padding: 16px;
          color: #064e3b;
          margin-top: 14px;
        }
        .cov-card-wireless {
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
          color: #475569;
          line-height: 1.5;
        }
        .reg-submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: #25d366;
          color: #ffffff;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
          font-family: inherit;
        }
        .reg-submit-btn:hover {
          background: #1ebe5d;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
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
          color: #64748b;
          margin-top: 12px;
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
                    style={{ textTransform: "none", color: "#0066ff", textDecoration: "none", fontWeight: 700 }}
                  >
                    Buka Google Maps ↗
                  </a>
                )}
              </div>

              {/* Textarea + Tombol GPS samping */}
              <div className="alamat-wrap">
                <textarea
                  id="form-alamat"
                  required
                  rows={3}
                  maxLength={300}
                  placeholder="Ketik jalan, RT/RW, nomor rumah, perumahan, kelurahan, atau kecamatan..."
                  value={alamat}
                  onChange={(e) => handleAlamatChange(e.target.value)}
                  className="reg-textarea"
                />

                <button
                  type="button"
                  onClick={handleGpsClick}
                  disabled={gpsLoading}
                  className="btn-lokasi"
                  title="Deteksi titik koordinat akurat melalui GPS perangkat"
                >
                  {gpsLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Mencari...</span>
                    </>
                  ) : (
                    <>
                      <MapPin size={16} />
                      <span>Pakai Lokasi Saya</span>
                    </>
                  )}
                </button>
              </div>

              <div className="reg-note">
                💡 Berbagi lokasi <strong>tidak wajib</strong>. Cukup ketik alamat lengkap, tim kami tetap dapat mengecek jaringan.
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
                  <div style={{ padding: "8px 12px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                    SARAN ALAMAT TERDEKAT (DATABASE CLOUDFLARE D1 &amp; PETA)
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePilihSuggestion(item)}
                      className="reg-sugg-item"
                    >
                      <MapPin size={15} style={{ color: "#0066ff", flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{item.title}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{item.subtitle || item.display_name}</div>
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
                  Mengecek ketersediaan port ODP dan sinyal wireless di database Cloudflare D1...
                </span>
              </div>
            )}

            {coverage && !checkingCoverage && (
              <div>
                {coverage.status === "fiber" ? (
                  <div className="cov-card-fiber">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 15, color: "#065f46" }}>
                      <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                      TERCOVER FIBER OPTIC &amp; WIRELESS (SIAP PASANG) ✅
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "#064e3b" }}>
                      <div>
                        📍 <strong>Prediksi Lokasi:</strong> {cleanAlamatResmi(coverage.alamat) || "Area Lokasi Anda"}{" "}
                        <span style={{ color: "#6b7280", fontSize: 12, fontWeight: 400 }}>
                          (Lokasi akurat via WA wa.me/{NOMOR_WA_SALES})
                        </span>
                      </div>
                      <div>
                        🌐 <strong>Tercover:</strong> FIBER dan WIRELESS
                      </div>
                      <div>
                        🔌 <strong>Status:</strong> Jaringan tersedia &amp; siap langsung dipasang!
                      </div>
                    </div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #a7f3d0", fontSize: 12, color: "#047857" }}>
                      Selain jalur kabel (Fiber Optic), jaringan Wireless (Nirkabel 4G + 5G) juga sudah aktif dan tersedia di area ini.
                    </div>
                  </div>
                ) : coverage.status === "wireless" ? (
                  <div className="cov-card-wireless">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 15, color: "#0369a1" }}>
                      <Radio size={18} style={{ color: "#0284c7", flexShrink: 0 }} />
                      TERCOVER XL ULTRA 5G+ WIRELESS (SIAP PASANG) ✅
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "#075985" }}>
                      <div>
                        📍 <strong>Prediksi Lokasi:</strong> {cleanAlamatResmi(coverage.alamat) || "Area Lokasi Anda"}{" "}
                        <span style={{ color: "#6b7280", fontSize: 12, fontWeight: 400 }}>
                          (Lokasi akurat via WA wa.me/{NOMOR_WA_SALES})
                        </span>
                      </div>
                      <div>
                        🌐 <strong>Tercover:</strong> XL Ultra 5G+ Wireless {coverage.zona ? `[${coverage.zona}]` : ""}
                      </div>
                      <div>
                        🔌 <strong>Status:</strong> Modem Plug &amp; Play langsung aktif tanpa perlu tarik kabel!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cov-card-warning">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 14, color: "#92400e" }}>
                      <AlertCircle size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
                      KEMUNGKINAN TERCOVER (BUTUH CEK JALUR ODP) ⚠️
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
                  <a href="#paket" style={{ textTransform: "none", color: "#0066ff", textDecoration: "none", fontWeight: 700 }}>
                    Lihat Daftar Paket di Atas ↑
                  </a>
                </div>
                <select
                  id="form-paket"
                  value={paket}
                  onChange={(e) => setPaket(e.target.value)}
                  className="reg-select"
                >
                  {DAFTAR_PAKET_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
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
