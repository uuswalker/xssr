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
    <section className="reg-section py-12 px-4 sm:px-6 bg-gradient-to-b from-sky-50/70 via-white to-blue-50/50" id="daftar">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3 tracking-wide">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            PENDAFTARAN RESMI &amp; CEK JARINGAN REAL-TIME
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {mode === "daftar" ? "Daftar Pasang Baru XL Home" : "Cek Ketersediaan Jaringan XL Home"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
            {mode === "daftar"
              ? "Isi formulir dan alamat pemasangan Anda untuk registrasi cepat langsung terhubung ke WhatsApp Sales Resmi."
              : "Cukup isi nama, WhatsApp, dan alamat. Tim kami akan mengecek jangkauan fiber & wireless di lokasi Anda."}
          </p>
        </div>

        {/* Card Formulir */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 relative">
          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-xl mb-6 text-sm font-bold">
            <button
              type="button"
              onClick={() => setMode("daftar")}
              className={`py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "daftar"
                  ? "bg-white text-blue-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Wifi className="w-4 h-4 text-blue-600" />
              Daftar Pasang Baru
            </button>
            <button
              type="button"
              onClick={() => setMode("cek")}
              className={`py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "cek"
                  ? "bg-white text-blue-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              Cek Jaringan Saja
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Nama */}
            <div>
              <label htmlFor="form-nama" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 placeholder-gray-400 font-medium transition"
              />
            </div>

            {/* Input WhatsApp */}
            <div>
              <label htmlFor="form-wa" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp Aktif
              </label>
              <input
                id="form-wa"
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 placeholder-gray-400 font-medium transition"
              />
            </div>

            {/* Alamat Lengkap + Tombol GPS */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="form-alamat" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Alamat Lengkap Pemasangan
                </label>
                {mapsLink && (
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Buka Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Textarea + Tombol GPS samping */}
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
                <textarea
                  id="form-alamat"
                  required
                  rows={3}
                  maxLength={300}
                  placeholder="Ketik jalan, RT/RW, nomor rumah, perumahan, kelurahan, atau kecamatan..."
                  value={alamat}
                  onChange={(e) => handleAlamatChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 placeholder-gray-400 font-medium transition resize-y"
                />

                <button
                  type="button"
                  onClick={handleGpsClick}
                  disabled={gpsLoading}
                  className="sm:w-44 flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-75 disabled:cursor-wait"
                  title="Deteksi titik koordinat akurat melalui GPS perangkat"
                >
                  {gpsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mencari Lokasi...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 animate-pulse" />
                      <span>Pakai Lokasi Saya</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-[11px] text-gray-500 leading-tight">
                💡 Berbagi lokasi <strong>tidak wajib</strong>. Cukup ketik alamat lengkap, tim kami tetap dapat mengecek jaringan.
              </p>

              {gpsError && (
                <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {gpsError}
                </div>
              )}

              {/* Dropdown Suggestions Autocomplete */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500">
                    Saran Alamat Terdekat (Database Cloudflare D1 &amp; Peta)
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePilihSuggestion(item)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-800 hover:bg-blue-50 border-b border-gray-50 last:border-none flex items-start gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-[10px] text-gray-500">{item.subtitle || item.display_name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Verification Box (Jika Coverage Terdeteksi) */}
            {checkingCoverage && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-3 animate-pulse">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                <div className="text-xs font-semibold">
                  Mengecek ketersediaan port ODP dan sinyal wireless di database Cloudflare D1...
                </div>
              </div>
            )}

            {coverage && !checkingCoverage && (
              <div>
                {coverage.status === "fiber" ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 shadow-sm">
                    <div className="flex items-center gap-2 font-extrabold text-emerald-800 text-sm sm:text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      TERCOVER FIBER OPTIC &amp; WIRELESS (SIAP PASANG) ✅
                    </div>
                    <div className="mt-2 text-xs sm:text-sm space-y-1 font-medium">
                      <div>
                        📍 <strong>Prediksi Lokasi:</strong> {cleanAlamatResmi(coverage.alamat) || "Area Lokasi Anda"}{" "}
                        <span className="text-gray-500 text-xs font-normal">
                          (Lokasi akurat bisa Whatsapp Sales wa.me/{NOMOR_WA_SALES})
                        </span>
                      </div>
                      <div>
                        🌐 <strong>Tercover:</strong> FIBER dan WIRELESS
                      </div>
                      <div>
                        🔌 <strong>Status:</strong> Jaringan tersedia &amp; siap langsung dipasang!
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-emerald-200 text-xs text-emerald-800 leading-relaxed">
                      Selain jalur kabel (Fiber Optic), jaringan Wireless (Nirkabel 4G + 5G) juga sudah aktif dan tersedia di area ini.
                    </div>
                  </div>
                ) : coverage.status === "wireless" ? (
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-300 text-sky-950 shadow-sm">
                    <div className="flex items-center gap-2 font-extrabold text-sky-800 text-sm sm:text-base">
                      <Radio className="w-5 h-5 text-sky-600 flex-shrink-0" />
                      TERCOVER XL ULTRA 5G+ WIRELESS (SIAP PASANG) ✅
                    </div>
                    <div className="mt-2 text-xs sm:text-sm space-y-1 font-medium">
                      <div>
                        📍 <strong>Prediksi Lokasi:</strong> {cleanAlamatResmi(coverage.alamat) || "Area Lokasi Anda"}{" "}
                        <span className="text-gray-500 text-xs font-normal">
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
                    <div className="mt-2 pt-2 border-t border-sky-200 text-xs text-sky-800 leading-relaxed">
                      Sinyal nirkabel XL 5G aktif dengan jangkauan maksimal, kecepatan tinggi, dan bebas biaya penarikan kabel.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 shadow-sm">
                    <div className="flex items-center gap-2 font-extrabold text-amber-800 text-sm">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      KEMUNGKINAN TERCOVER (BUTUH CEK JALUR ODP) ⚠️
                    </div>
                    <p className="mt-1.5 text-xs text-amber-900 leading-relaxed">
                      Alamat Anda berada di sekitar area jaringan XL Home. Tim sales kami akan melakukan verifikasi fisik jarak kabel ke rumah Anda via WhatsApp.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pilihan Paket (Hanya tampil pada Mode Daftar) */}
            {mode === "daftar" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="form-paket" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Paket yang Diminati
                  </label>
                  <a href="#paket" className="text-xs text-blue-600 hover:underline font-semibold">
                    Lihat Daftar Paket di Atas ↑
                  </a>
                </div>
                <div className="relative">
                  <select
                    id="form-paket"
                    value={paket}
                    onChange={(e) => setPaket(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900 font-semibold bg-white transition appearance-none cursor-pointer pr-10"
                  >
                    {DAFTAR_PAKET_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
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
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="form-setuju"
                type="checkbox"
                checked={setuju}
                onChange={(e) => setSetuju(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="form-setuju" className="text-xs text-gray-600 font-normal leading-relaxed cursor-pointer">
                Saya menyetujui data di atas digunakan untuk konfirmasi pemasangan baru atau pengecekan jaringan resmi oleh tim sales XL Home.
              </label>
            </div>

            {/* Feedback Message */}
            {formFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  formFeedback.type === "error"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                {formFeedback.type === "error" ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{formFeedback.msg}</span>
              </div>
            )}

            {/* Tombol Submit WhatsApp */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#16994a] text-white rounded-xl font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-wait"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Meneruskan ke WhatsApp...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>
                    {mode === "daftar" ? "Daftar & Lanjut ke WhatsApp" : "Cek Coverage via WhatsApp"}
                  </span>
                </>
              )}
            </button>

            {/* Security Footnote */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Koneksi aman langsung ke WhatsApp Sales Resmi XL Home Solo Raya (0877-7899-9141)</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
