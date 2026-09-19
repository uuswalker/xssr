"use client";
import { MessageCircle, MapPin, CheckCircle2, Target, Search, ArrowRight } from "lucide-react";


import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ceklokasi.css";
import "./ceklokasi.css";
import {
  COV_TEXT,
  KOTA_ALIASES,
  cekCoverage,
  coverageDetail,
  coverageLine,
  deteksiKota,
  jarakFiberField,
  type CoverageData,
  type CoverageResult,
} from "@/lib/coverage";
import {
  LS_KOTA,
  LS_LEAD,
  LS_SUPPRESS,
  NOMOR_WA_SALES,
  basePayload,
  cariAlamatNominatim,
  gtag,
  loadLeaflet,
  lsSet,
  normalisasiWA,
  postLead,
  type NominatimItem,
} from "@/lib/lead";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L?: any;
  }
}

const MAX_TUNGGU_DETIK = 8;
const TARGET_AKURASI_METER = 500;

interface IpCache {
  kota: string;
  ts: number;
}

export default function CekLokasi() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"lokasi" | "form">("lokasi");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusClass, setStatusClass] = useState("cl-status");
  const [lokasiInfo, setLokasiInfo] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [suggestions, setSuggestions] = useState<NominatimItem[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [query, setQuery] = useState("");
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [geoFallback, setGeoFallback] = useState(false);
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [strip, setStrip] = useState<string | null>(null);

  const dataRef = useRef<{ data: CoverageData | null; loaded: boolean; promise: Promise<void> | null }>({
    data: null,
    loaded: false,
    promise: null,
  });
  const posRef = useRef<{ lat: number | null; lng: number | null; kota: string | null; alamat: string | null }>({
    lat: null,
    lng: null,
    kota: null,
    alamat: null,
  });
  const mapRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapObj = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerObj = useRef<any>(null);
  const softSent = useRef(false);
  const timers = useRef<number[]>([]);
  const intervals = useRef<number[]>([]);
  const watchId = useRef<number | null>(null);
  const stripShown = useRef(false);
  const modalOpened = useRef(false);
  const lastCovKey = useRef("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
      intervals.current.forEach((t) => clearInterval(t));
      if (watchId.current !== null && navigator.geolocation)
        navigator.geolocation.clearWatch(watchId.current);
    },
    []
  );

  // ---- coverage lazy-load (1x) ----
  const loadCoverage = useCallback(() => {
    const c = dataRef.current;
    if (c.data || c.promise) return c.promise;
    c.promise = (async () => {
      try {
        const [a, b] = await Promise.all([
          fetch("/data/coverage.json").then((r) => r.json()),
          fetch("/data/coverage-wireless.json").then((r) => r.json()),
        ]);
        c.data = {
          pts: a.pts || [],
          wpts: (b.pts || []).map((p: number[]) => [p[0], p[1], p[2]]),
          wzones: b.zones || [],
        };
      } catch {
        c.data = { pts: [], wpts: [], wzones: [] };
      }
      c.loaded = true;
    })();
    return c.promise;
  }, []);

  const fireCoverageEvent = useCallback(
    (lat: number, lng: number, cv: CoverageResult) => {
      if (!cv || cv.status === "loading") return;
      const key = `${lat.toFixed(5)},${lng.toFixed(5)}${cv.status}`;
      if (key === lastCovKey.current) return;
      lastCovKey.current = key;
      gtag("event", "coverage_check", {
        status: cv.status,
        jarak_m: cv.jarakM == null ? -1 : cv.jarakM,
        zona: cv.zona || "",
        page_path: window.location.pathname,
      });
    },
    []
  );

  // ---- soft lead (baca state WA — input form belum tentu ter-mount) ----
  const kirimSoftLead = useCallback(() => {
    if (softSent.current) return;
    const waTmp = normalisasiWA(wa).replace(/^0/, "62");
    const p = posRef.current;
    const alamatOk = !!p.alamat && p.alamat.trim().length >= 5;
    const latOk = p.lat != null && p.lng != null;
    if (waTmp.length < 9 || !(alamatOk || latOk)) return;
    softSent.current = true;
    postLead(
      basePayload("lokasi-saja", {
        lat: p.lat,
        lng: p.lng,
        alamat: p.alamat || "",
        kota: p.kota || "",
        coverage: coverage?.status || "",
        jarakFiberM: jarakFiberField(coverage),
        zona: coverage?.zona || null,
      })
    );
  }, [coverage, wa]);

  const fokusForm = useCallback(() => {
    later(() => {
      document.getElementById("cl-nama")?.focus();
    }, 950);
  }, [later]);

  // ---- peta ----
  const tampilkanPeta = useCallback(
    (lat: number, lng: number) => {
      setShowMap(true);
      loadLeaflet()
        .then(() => {
          const L = window.L;
          if (!L || !mapRef.current) return;
          if (!mapObj.current) {
            mapObj.current = L.map(mapRef.current).setView([lat, lng], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "&copy; OpenStreetMap contributors",
              maxZoom: 18,
            }).addTo(mapObj.current);
            markerObj.current = L.marker([lat, lng]).addTo(mapObj.current);
          } else {
            mapObj.current.setView([lat, lng], 13);
            markerObj.current.setLatLng([lat, lng]);
          }
          setTimeout(() => mapObj.current?.invalidateSize(), 100);
        })
        .catch(() => {});
    },
    []
  );

  // ---- alur lokasi ----
  const prosesLokasi = useCallback(
    (lat: number, lng: number, alamatText: string | null) => {
      setTanpaPeta(null);
      setGeoFallback(false);
      const p = posRef.current;
      p.lat = lat;
      p.lng = lng;
      p.alamat = alamatText;
      tampilkanPeta(lat, lng);
      const hasil = deteksiKota(lat, lng);
      p.kota = hasil.nama;
      const c = dataRef.current;
      const cv = cekCoverage(c.data, c.loaded, lat, lng, p.kota);
      setCoverage(cv);
      fireCoverageEvent(lat, lng, cv);
      if (cv.status === "loading" && c.promise) {
        c.promise.then(() => {
          const q = posRef.current;
          if (q.lat === lat && q.lng === lng) {
            const cv2 = cekCoverage(dataRef.current.data, true, lat, lng, q.kota);
            setCoverage(cv2);
            fireCoverageEvent(lat, lng, cv2);
          }
        });
      }
      if (cv.status === "loading" && c.promise) {
        c.promise.then(() => {
          const q = posRef.current;
          if (q.lat === lat && q.lng === lng) {
            const cv2 = cekCoverage(
              dataRef.current.data,
              true,
              lat,
              lng,
              q.kota
            );
            setCoverage(cv2);
            fireCoverageEvent(lat, lng, cv2);
          }
        });
      }
      gtag("event", "lokasi_dikonfirmasi", {
        kota_terdeteksi: p.kota || "unknown",
        page_path: window.location.pathname,
      });
      if (hasil.dalamArea) {
        setStatusClass("cl-status success");
        setStatusMsg(` Lokasi terdeteksi di area ${hasil.nama}`);
      } else {
        setStatusClass("cl-status");
        setStatusMsg(
          `Lokasi terdeteksi dekat ${hasil.nama || "Solo Raya"}. Tetap bisa dicek manual oleh sales kami.`
        );
      }
      later(() => {
        setLokasiInfo(
          `Lokasi: ${alamatText ? alamatText : lat.toFixed(5) + ", " + lng.toFixed(5)}` +
            (hasil.nama ? ` (dekat ${hasil.nama})` : "")
        );
        setStep("form");
      }, 900);
      kirimSoftLead();
      fokusForm();
    },
    [fireCoverageEvent, fokusForm, kirimSoftLead, later, tampilkanPeta]
  );

  const prosesLokasiTanpaKoordinat = useCallback(
    (alamatText: string) => {
      const p = posRef.current;
      p.lat = null;
      p.lng = null;
      p.alamat = alamatText;
      p.kota = null;
      setShowMap(false);
      gtag("event", "lokasi_dikonfirmasi", {
        kota_terdeteksi: "unknown",
        page_path: window.location.pathname,
      });
      setStatusClass("cl-status");
      setStatusMsg(
        "Alamat dicatat tanpa titik peta pasti. Sales kami akan konfirmasi lokasi lebih lanjut."
      );
      later(() => {
        setLokasiInfo(`Alamat: ${alamatText} (lokasi belum terverifikasi peta)`);
        setStep("form");
      }, 600);
      kirimSoftLead();
      fokusForm();
    },
    [fokusForm, kirimSoftLead, later]
  );

  // ---- buka/tutup ----
  const bukaModal = useCallback(
    (trigger?: string) => {
      setOpen(true);
      setStep("lokasi");
      modalOpened.current = true;
      setStrip(null);
      loadCoverage();
      loadLeaflet().catch(() => {});
      gtag("event", "open_cek_lokasi", {
        page_path: window.location.pathname,
        ...(trigger ? { trigger } : {}),
      });
      later(() => mapObj.current?.invalidateSize(), 200);
    },
    [later, loadCoverage]
  );

  // Delegasi global: semua tombol #btn-buka-cek-lokasi / .btn-cek-lokasi-trigger
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("#btn-buka-cek-lokasi, .btn-cek-lokasi-trigger");
      if (!el) return;
      modalOpened.current = true;
      setStrip(null);
      if (el.classList.contains("btn-cek-lokasi-trigger")) bukaModal("header");
      else bukaModal();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [bukaModal]);

  // ---- geolocation ----
  const gunakanLokasi = useCallback(() => {
    if (!navigator.geolocation) {
      setStatusClass("cl-status error");
      setStatusMsg(
        "Browser kamu tidak mendukung deteksi lokasi. Gunakan input alamat manual."
      );
      return;
    }
    setGeoDisabled(true);
    let bestPos: GeolocationPosition | null = null;
    let detik = MAX_TUNGGU_DETIK;
    const upd = () => {
      const ak = bestPos ? `±${Math.round(bestPos.coords.accuracy)}m` : "mencari sinyal...";
      setStatusClass("cl-status");
      setStatusMsg(
        `Menyempurnakan lokasi presisi... (${detik} detik) — Akurasi saat ini: ${ak}`
      );
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
    };
    timers.current.push(
      window.setTimeout(() => {
        bersih();
        setGeoDisabled(false);
        if (bestPos) {
          prosesLokasi(bestPos.coords.latitude, bestPos.coords.longitude, null);
        } else {
          setGeoFallback(true);
          setStatusClass("cl-status error");
          setStatusMsg("Aktifkan izin lokasi di browser lalu coba lagi, atau isi alamat di bawah.");
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
          setGeoFallback(true);
          setStatusClass("cl-status error");
          setStatusMsg("Aktifkan izin lokasi di browser lalu coba lagi, atau isi alamat di bawah.");
        }
      },
      { enableHighAccuracy: true, timeout: MAX_TUNGGU_DETIK * 1000, maximumAge: 0 }
    );
  }, [prosesLokasi]);

  const [geoDisabled, setGeoDisabled] = useState(false);

  // ---- alamat manual ----
  const cariAlamat = useCallback(
    (alamat: string) => {
      setTanpaPeta(null);
      if (!alamat) {
        setStatusClass("cl-status error");
        setStatusMsg("Masukkan alamat terlebih dahulu.");
        return;
      }
      setShowSugg(false);
      setStatusClass("cl-status");
      setStatusMsg("Mencari alamat...");
      setSearching(true);
      cariAlamatNominatim(alamat, 1).then(
        (data) => {
          setSearching(false);
          if (data && data.length > 0) {
            prosesLokasi(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name);
          } else {
            setTanpaPeta(alamat);
          }
        },
        () => {
          setSearching(false);
          setTanpaPeta(alamat);
        }
      );
    },
    [prosesLokasi]
  );

  const [searching, setSearching] = useState(false);
  const [tanpaPeta, setTanpaPeta] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setShowSugg(false);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      cariAlamatNominatim(q, 5).then(
        (data) => {
          setSuggestions(data || []);
          setShowSugg(true);
        },
        () => setShowSugg(false)
      );
    }, 450);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        !(e.target as HTMLElement).closest?.(".cl-autocomplete-wrap") &&
        e.target !== inputRef.current
      )
        setShowSugg(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // ---- kirim ----
  const kirim = useCallback(() => {
    const nm = nama.trim();
    let w = normalisasiWA(wa);
    if (!nm || nm.length < 2) {
      setFormError("Mohon isi nama lengkap dulu.");
      return;
    }
    if (!w) {
      setFormError("Nomor WhatsApp wajib diisi agar sales bisa menghubungi kamu. Contoh: 0812xxxxxxx.");
      return;
    }
    if (w.length < 11 || w.length > 14) {
      setFormError("Nomor WhatsApp sepertinya belum benar. Contoh: 081234567890 (8-13 digit).");
      return;
    }
    const p = posRef.current;
    const alamatOk = !!p.alamat && p.alamat.trim().length >= 5;
    const latOk = p.lat != null && p.lng != null;
    if (!alamatOk && !latOk) {
      setFormError("Silakan pilih lokasi via GPS atau tulis alamat minimal 5 karakter (salah satu cukup).");
      return;
    }
    setWa(w);
    setSending(true);
    const mapsLink =
      p.lat != null && p.lng != null
        ? `https://www.google.com/maps?q=${p.lat},${p.lng}`
        : "";
    postLead(
      basePayload("lengkap", {
        nama: nm,
        whatsapp: w,
        lat: p.lat,
        lng: p.lng,
        alamat: p.alamat || "",
        kota: p.kota || "",
        coverage: coverage?.status || "",
        jarakFiberM: jarakFiberField(coverage),
        zona: coverage?.zona || null,
      })
    );
    gtag("event", "submit_cek_lokasi", {
      kota_terdeteksi: p.kota || "unknown",
      page_path: window.location.pathname,
    });
    try {
      const ls = localStorage;
      ls.setItem("xlsr_lead_done", JSON.stringify({ ts: Date.now() }));
    } catch {
      /* abaikan */
    }
    const covLine = coverageLine(coverage);
    const pesan =
      `Halo kak, saya ${nm}, mau cek ketersediaan XL SATU.\n` +
      (p.alamat ? `Alamat: ${p.alamat}\n` : "") +
      (mapsLink ? `Peta lokasi: ${mapsLink}\n` : "") +
      (p.kota ? `Area terdekat: ${p.kota}\n` : "") +
      covLine;
    window.open(`https://wa.me/${NOMOR_WA_SALES}?text=${encodeURIComponent(pesan)}`, "_blank");
    setOpen(false);
    setSending(false);
  }, [nama, wa, coverage]);

  // ---- strip + IP layer ----
  useEffect(() => {
    let kotaIP = "";
    try {
      const c = JSON.parse(localStorage.getItem(LS_KOTA) || "null") as IpCache | null;
      if (c && Date.now() - c.ts < 24 * 3600 * 1000 && c.kota) {
        kotaIP = c.kota;
        gtag("event", "ip_kota_terdeteksi", { kota_ip: kotaIP, page_path: location.pathname });
      } else if (!c) {
        fetch("https://ipwho.is/")
          .then((r) => r.json())
          .then((d: { success?: boolean; city?: string }) => {
            if (!d?.success || !d.city) return;
            const k = KOTA_ALIASES[String(d.city).toLowerCase().trim()];
            if (!k) {
              try {
                localStorage.setItem(LS_KOTA, JSON.stringify({ kota: "", ts: Date.now() }));
              } catch {
                /* abaikan */
              }
              return;
            }
            try {
              localStorage.setItem(LS_KOTA, JSON.stringify({ kota: k, ts: Date.now() }));
            } catch {
              /* abaikan */
            }
            gtag("event", "ip_kota_terdeteksi", { kota_ip: k, page_path: location.pathname });
          })
          .catch(() => {});
      }
    } catch {
      /* abaikan */
    }

    const boleh = () => {
      try {
        if (localStorage.getItem(LS_LEAD)) return false;
        const off = JSON.parse(localStorage.getItem(LS_SUPPRESS) || "null") as { ts: number } | null;
        if (off && Date.now() - off.ts < 7 * 24 * 3600 * 1000) return false;
      } catch {
        /* abaikan */
      }
      return true;
    };
    const mungkin = () => {
      if (stripShown.current || modalOpened.current) return;
      if (!boleh()) return;
      stripShown.current = true;
      try {
        const c = JSON.parse(localStorage.getItem(LS_KOTA) || "null") as IpCache | null;
        setStrip(c?.kota || "");
      } catch {
        setStrip("");
      }
      gtag("event", "lokasi_strip_muncul", { page_path: location.pathname });
    };
    const t = window.setTimeout(mungkin, 12000);
    const onScroll = () => {
      const progress =
        window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress >= 0.4) mungkin();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const tutupStrip = useCallback((suppress: boolean) => {
    setStrip(null);
    stripShown.current = false;
    if (suppress) lsSet(LS_SUPPRESS, { ts: Date.now() });
  }, []);

  const stripCek = useCallback(() => {
    tutupStrip(true);
    if (!navigator.geolocation) {
      bukaModal();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        bukaModal("strip");
        gtag("event", "open_cek_lokasi", {
          page_path: location.pathname,
          trigger: "strip",
        });
        prosesLokasi(pos.coords.latitude, pos.coords.longitude, null);
      },
      () => {
        bukaModal("strip");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [bukaModal, prosesLokasi, tutupStrip]);

  if (!open && strip === null) return null;

  const t = coverage ? COV_TEXT[coverage.status] : COV_TEXT.loading;

  return (
    <>
      {strip !== null && !open && (
        <div
          id="xlsr-lokasi-strip"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "calc(96px + env(safe-area-inset-bottom))",
            zIndex: 9998,
            width: "min(92%,440px)",
            background: "#0d7a5f",
            color: "#fff",
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
            fontSize: 13.5,
            lineHeight: 1.4,
          }}
        >
          <Target size={18} />
          <span style={{ flex: 1 }}>
            {strip
              ? `Kamu di area ${strip}? Aktifkan lokasi untuk cek ketersediaan cepat.`
              : "Aktifkan lokasi untuk cek ketersediaan di areamu secara otomatis."}
          </span>
          <button
            type="button"
            onClick={stripCek}
            style={{
              background: "#fff",
              color: "#037e64",
              border: "none",
              borderRadius: 9,
              padding: "8px 12px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Cek
          </button>
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => {
              tutupStrip(true);
              gtag("event", "lokasi_strip_tutup", { page_path: location.pathname });
            }}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,.75)",
              fontSize: 20,
              cursor: "pointer",
              padding: "2px 4px",
              flexShrink: 0,
            }}
          >
            &times;
          </button>
        </div>
      )}

      {open && (
        <div id="modal-cek-lokasi" className="cl-modal-overlay" style={{ display: "flex" }}>
          <motion.div className="cl-modal-box" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
            <button
              type="button"
              className="cl-modal-close"
              aria-label="Tutup"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>

            <AnimatePresence mode="wait">
              {step === "lokasi" ? (
              <motion.div key="lokasi" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} id="cl-step-lokasi">
                <h3 className="cl-title">
                  <MapPin size={18} /> Cek Ketersediaan di Lokasimu
                </h3>
                <p className="cl-sub">
                  Bagikan lokasimu — sistem cek otomatis coverage fiber di lokasimu.
                </p>
                <button
                  type="button"
                  className="cl-btn-primary"
                  disabled={geoDisabled}
                  onClick={gunakanLokasi}
                >
                  <Target size={18} /> Gunakan Lokasi Saya Sekarang
                </button>
                <div className="cl-divider">
                  <span>atau</span>
                </div>
                <label htmlFor="cl-alamat-manual" className="cl-label">
                  Masukkan alamat manual
                </label>
                <div className="cl-autocomplete-wrap">
                  <input
                    type="text"
                    id="cl-alamat-manual"
                    className="cl-input"
                    placeholder="Contoh: Jl. Slamet Riyadi, Solo"
                    autoComplete="off"
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {showSugg && (
                    <div id="cl-suggestions" className="cl-suggestions">
                      {suggestions.length === 0 ? (
                        <div className="cl-suggestion-empty">
                          Tidak ada saran. Coba kata kunci lain atau tekan &quot;Cari Alamat&quot;.
                        </div>
                      ) : (
                        suggestions.map((s, i) => (
                          <div
                            key={i}
                            className="cl-suggestion-item"
                            onClick={() => {
                              setQuery(s.display_name);
                              setShowSugg(false);
                              prosesLokasi(parseFloat(s.lat), parseFloat(s.lon), s.display_name);
                            }}
                          >
                            <MapPin size={18} />
                            <span>{s.display_name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="cl-btn-secondary"
                  disabled={searching}
                  onClick={() => cariAlamat(query.trim())}
                >
                  <Search size={18} /> Cari Alamat
                </button>
                {tanpaPeta && (
                  <button
                    type="button"
                    className="cl-btn-secondary"
                    style={{ marginTop: 10 }}
                    onClick={() => prosesLokasiTanpaKoordinat(tanpaPeta)}
                  >
                    <ArrowRight size={18} /> Tetap Lanjutkan dengan Alamat Ini
                  </button>
                )}
                <div
                  id="cl-map"
                  ref={mapRef}
                  style={{ display: showMap ? "block" : "none" }}
                ></div>
                <p id="cl-status-lokasi" className={statusClass}>
                  {statusMsg}
                </p>
                {geoFallback && (
                  <GeoFallback
                    onLanjut={(alamat) => {
                      if (!alamat) {
                        setStatusClass("cl-status error");
                        setStatusMsg(
                          "Isi alamat manual dulu (contoh: Jl. Slamet Riyadi, Solo) atau coba aktifkan izin lokasi."
                        );
                        return;
                      }
                      cariAlamatNominatim(alamat, 1).then(
                        (res) => {
                          if (res && res.length > 0) {
                            prosesLokasi(
                              parseFloat(res[0].lat),
                              parseFloat(res[0].lon),
                              res[0].display_name
                            );
                          } else {
                            prosesLokasiTanpaKoordinat(alamat);
                          }
                        },
                        () => prosesLokasiTanpaKoordinat(alamat)
                      );
                    }}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} id="cl-step-form">
                <h3 className="cl-title">
                  <CheckCircle2 size={18} color="var(--green)" />{" "}
                  Lokasi Ditemukan!
                </h3>
                <p className="cl-sub" id="cl-lokasi-info">
                  {lokasiInfo}
                </p>
                {coverage && (
                  <div
                    id="cl-coverage"
                    style={{
                      display: "block",
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontSize: 14,
                      margin: "0 0 16px",
                      background: t[0],
                      color: t[1],
                    }}
                  >
                    <strong>{t[2]}</strong>
                    <br />
                    <span style={{ fontSize: 13 }}>
                      {coverageDetail(coverage)}
                    </span>
                  </div>
                )}
                <label htmlFor="cl-nama" className="cl-label">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="cl-nama"
                  className="cl-input"
                  placeholder="Nama kamu"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      kirim();
                    }
                  }}
                />
                <label htmlFor="cl-wa" className="cl-label">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  id="cl-wa"
                  className="cl-input"
                  placeholder="0812xxxxxxx"
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      kirim();
                    }
                  }}
                />
                {formError && (
                  <p className="cl-status error" style={{ marginTop: 10 }}>
                    {formError}
                  </p>
                )}
                <button
                  type="button"
                  className="cl-btn-primary"
                  disabled={sending}
                  onClick={kirim}
                  style={{ marginTop: 12 }}
                >
                  <MessageCircle size={18} />{" "}
                  {sending ? "Memproses..." : "Kirim & Lanjut ke WhatsApp"}
                </button>
                <button
                  type="button"
                  className="cl-btn-text"
                  onClick={() => {
                    setStep("lokasi");
                    setStatusMsg("");
                    setStatusClass("cl-status");
                  }}
                >
                  Ganti lokasi
                </button>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </>
  );

  function GeoFallback({ onLanjut }: { onLanjut: (alamat: string) => void }) {
    const [v, setV] = useState("");
    return (
      <div className="cl-geo-fallback">
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#9a3412",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MapPin size={18} /> Opsional: Isi Alamat Manual
        </div>
        <label htmlFor="cl-fallback-alamat" className="cl-label">
          Nama area / jalan / landmark
        </label>
        <input
          type="text"
          id="cl-fallback-alamat"
          className="cl-input"
          placeholder="Contoh: Jl. Slamet Riyadi, Solo"
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
        <button
          type="button"
          className="cl-btn-secondary"
          onClick={() => onLanjut(v.trim())}
        >
          <ArrowRight size={18} /> Lanjutkan dengan Alamat Ini
        </button>
      </div>
    );
  }
}
