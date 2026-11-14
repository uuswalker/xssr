"use client";
import { MessageCircle, MapPin, CheckCircle2, Target, Search, ArrowRight, Zap, Sparkles } from "lucide-react";


import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  isWirelessSelection,
  type CoverageResult,
} from "@/lib/coverage";
import { ADS_ID } from "@/lib/site";
import {
  LS_KOTA,
  LS_LEAD,
  LS_SUPPRESS,
  NOMOR_WA_SALES,
  basePayload,
  cariAlamatNominatim,
  cariAlamatSmart,
  gtag,
  
  lsSet,
  normalisasiWA,
  postLead,
  reverseGeocodeNominatim,
  type NominatimItem,
  type SmartSuggestionItem,
} from "@/lib/lead";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L?: any;
  }
}

const MAX_TUNGGU_DETIK = 8;
const TARGET_AKURASI_METER = 30;

interface IpCache {
  kota: string;
  ts: number;
}

export const SOLO_RAYA_CITIES = new Set([
  "solo", "surakarta", "sukoharjo", "karanganyar", "boyolali", "klaten", "sragen", "wonogiri",
  "baki", "grogol", "kartasura", "colomadu", "palur"
]);

export function normalizePaketOption(input: string | null | undefined): string {
  if (!input) return "";
  const s = input.toLowerCase();
  if (s.includes("20") && s.includes("mbps")) return "Saya minat paket XL Home Starter 20 Mbps Rp185.000";
  if (s.includes("250") && s.includes("mbps")) return "Saya minat paket XL Home Spark 250 Mbps Rp229.000";
  if (s.includes("300") && s.includes("mbps")) return "Saya minat paket XL Home Spark 300 Mbps Rp239.000";
  if (s.includes("400") && s.includes("mbps")) return "Saya minat paket XL Home Spark 400 Mbps Rp299.000";
  if (s.includes("500") && s.includes("mbps")) return "Saya minat paket XL Home Spark 500 Mbps Rp399.000";
  if (s.includes("1000") && s.includes("mbps")) return "Saya minat paket XL Home Spark 1000 Mbps Rp899.000";
  if (s.includes("advance") && s.includes("50")) return "Saya minat XL Home Wireless 50 Mbps Advance Rp650.000";
  if (s.includes("advance") && s.includes("100")) return "Saya minat XL Home Wireless 100 Mbps Advance Rp790.000";
  if (s.includes("wireless") || s.includes("fwa")) return "Saya minat XL Home Wireless Monthly 100 Mbps Rp219.500";
  return input;
}

export default function CekLokasi() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("modal-open", open);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("modal-open");
      }
    };
  }, [open]);
  const [step, setStep] = useState<"lokasi" | "form">("lokasi");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusClass, setStatusClass] = useState("cl-status");
  const [lokasiInfo, setLokasiInfo] = useState("");
  
  const [suggestions, setSuggestions] = useState<SmartSuggestionItem[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [query, setQuery] = useState("");
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [geoFallback, setGeoFallback] = useState(false);
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [strip, setStrip] = useState<string | null>(null);
  const [paketPilihan, setPaketPilihan] = useState<string | null>(null);
  const [peminatSekitar, setPeminatSekitar] = useState("1 Rumah (Hanya rumah saya)");
  const [providerSaatIni, setProviderSaatIni] = useState("Belum ada internet kabel / Kuota HP");

  useEffect(() => {
    if (coverage && coverage.status === "wireless") {
      if (
        !paketPilihan ||
        (!paketPilihan.toLowerCase().includes("monthly") &&
          !paketPilihan.toLowerCase().includes("advance") &&
          !paketPilihan.toLowerCase().includes("wireless") &&
          !paketPilihan.toLowerCase().includes("request") &&
          !paketPilihan.toLowerCase().includes("kabel"))
      ) {
        setPaketPilihan("Saya minat XL Home Wireless Monthly 100 Mbps Rp219.500");
      }
    }
  }, [coverage, paketPilihan]);

  const posRef = useRef<{ lat: number | null; lng: number | null; kota: string | null; alamat: string | null }>({
    lat: null,
    lng: null,
    kota: null,
    alamat: null,
  });
  const reqIdRef = useRef(0);
  
  
  
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
    const kotaKirim = p.kota || coverage?.city || "";
    const alamatKirim = p.alamat || (p.lat && p.lng ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : "");
    const isWirelessSoft = isWirelessSelection(paketPilihan, coverage?.status);
    const effStatusSoft = isWirelessSoft ? "wireless" : (coverage?.status || "manual");
    const effHpIdSoft = effStatusSoft === "fiber" ? (coverage?.homepassId || null) : null;
    const effOdpSoft = effStatusSoft === "fiber" ? (coverage?.odp || null) : null;
    const effClusterSoft = effStatusSoft === "fiber" ? (coverage?.cluster || null) : null;
    const rawHpAddrSoft = coverage?.alamat ? cleanAlamatResmi(coverage.alamat) : null;
    const isKoordOnlySoft = rawHpAddrSoft ? /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(rawHpAddrSoft) : false;
    const effHpAddrSoft = (effStatusSoft === "fiber" && !isKoordOnlySoft) ? rawHpAddrSoft : null;
    const effJarakSoft = effStatusSoft === "fiber" ? jarakFiberField(coverage) : "";

    postLead(
      basePayload("lokasi-saja", {
        lat: p.lat,
        lng: p.lng,
        alamat: alamatKirim,
        kota: kotaKirim,
        coverage: effStatusSoft,
        jarakFiberM: effJarakSoft,
        zona: coverage?.zona || (isWirelessSoft ? "5G Ultra" : null),
        homepassId: effHpIdSoft,
        homepassAddress: effHpAddrSoft,
        odp: effOdpSoft,
        cluster: effClusterSoft,
        paket: paketPilihan || null,
      })
    );
  }, [coverage, wa]);

  const fokusForm = useCallback(() => {
    later(() => {
      document.getElementById("cl-nama")?.focus();
    }, 950);
  }, [later]);

  // ---- peta ----
  // ---- alur lokasi ----
  const prosesLokasi = useCallback(
    (lat: number, lng: number, alamatText: string | null, suggItem?: SmartSuggestionItem) => {
      setTanpaPeta(null);
      setGeoFallback(false);
      const currentReqId = ++reqIdRef.current;
      const p = posRef.current;
      p.lat = lat;
      p.lng = lng;
      p.alamat = alamatText;

      const hasil = deteksiKota(lat, lng);
      p.kota = hasil.nama;

      // Prediksi alamat jalan/kelurahan via reverse geocoding jika deteksi via GPS (tanpa input teks manual)
      if (!alamatText) {
        reverseGeocodeNominatim(lat, lng).then((prediksi) => {
          if (prediksi && currentReqId === reqIdRef.current) {
            setLokasiInfo((current) => {
              // Jika alamat resmi FTTH dari database sudah tampil, jangan timpa dengan generic nominatim
              if (!current || current.includes("Mengecek ketersediaan") || current.startsWith("Mengecek")) {
                const kotaFinal = posRef.current.kota || hasil.nama || "";
                return `Lokasi: ${prediksi}${kotaFinal && !prediksi.toLowerCase().includes(kotaFinal.toLowerCase()) ? ` (${kotaFinal})` : ""}`;
              }
              return current;
            });
            setCoverage((prev) => {
              if (!prev) return prev;
              if (!prev.alamat || prev.alamat.startsWith("Area Layanan") || prev.alamat.startsWith("Area ")) {
                return { ...prev, alamat: prediksi };
              }
              return prev;
            });
          }
        });
      }
      
      if (suggItem && suggItem.isFiberReady) {
        setCoverage({
          status: "fiber",
          jarakM: null,
          zona: "5G Ultra",
          fiberM: null,
          homepassId: null,
          alamat: alamatText || suggItem.display_name,
          city: suggItem.city || hasil.nama,
          odp: suggItem.odp || null,
          cluster: suggItem.cluster || null,
        });
      }

      const cvLoading: CoverageResult = {
        status: "loading",
        jarakM: null,
        zona: null,
        fiberM: null,
        homepassId: null,
        alamat: null,
      };
      if (!suggItem || !suggItem.isFiberReady) {
        setCoverage(cvLoading);
      }

      // Cek Cloudflare D1 National FTTH API (Multi-Database Edge SQLite)
      cekCoverageWorkerAPI(lat, lng).then((apiCv) => {
        if (currentReqId === reqIdRef.current) {
          const q = posRef.current;
          // Fallback cerdas: Jika API tidak merespons tapi koordinat berada di Area Layanan Terkonfirmasi (Solo Raya dll),
          // anggap tercover fiber aktif agar calon pelanggan tidak terlempar ke "Request Pasang Baru".
          const finalCv: CoverageResult = apiCv || (hasil.dalamArea ? {
            status: "fiber",
            jarakM: null,
            zona: "5G Ultra",
            fiberM: null,
            homepassId: null,
            alamat: q.alamat || `Area Layanan ${hasil.nama}`,
            city: hasil.nama,
            odp: suggItem?.odp || null,
            cluster: suggItem?.cluster || null,
          } : {
            status: "manual",
            jarakM: null,
            zona: null,
            fiberM: null,
            homepassId: null,
            alamat: null,
            city: q.kota || hasil.nama,
          });

          if (suggItem) {
            if (!finalCv.odp && suggItem.odp) finalCv.odp = suggItem.odp;
            if (!finalCv.cluster && suggItem.cluster) finalCv.cluster = suggItem.cluster;
          }
          if (finalCv.city) {
            q.kota = finalCv.city;
          }
          setCoverage(finalCv);
          fireCoverageEvent(lat, lng, finalCv);
          const rawAlamat = cleanAlamatResmi(finalCv.alamat || q.alamat || alamatText);
          finalCv.alamat = rawAlamat;
          const alamatDisplay = rawAlamat || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          q.alamat = alamatDisplay;
          setQuery(alamatDisplay);
          if (finalCv.status === "fiber") {
            setStatusClass("cl-status success");
            setStatusMsg(`Tercover Fiber Optic & Wireless XL Home (${alamatDisplay})!`);
            setLokasiInfo(`Lokasi: ${alamatDisplay}`);
          } else if (finalCv.status === "wireless") {
            const is5G = finalCv.zona && finalCv.zona.includes("5G");
            setStatusClass("cl-status success");
            setStatusMsg(
              is5G
                ? `Tercover XL Ultra 5G+ Wireless (FWA)! Siap pasang hari ini (${alamatDisplay}).`
                : `Tercover XL Home Wireless (FWA)! Siap pasang hari ini (${alamatDisplay}).`
            );
            setLokasiInfo(`Lokasi: ${alamatDisplay}`);
          } else {
            setStatusClass("cl-status");
            setStatusMsg(
              finalCv.jarakM != null
                ? `Jaringan fiber di sekitar ${alamatDisplay} berjarak ±${finalCv.jarakM}m.`
                : `Lokasi tercatat. Sales kami akan konfirmasi ketersediaan jaringan terdekat.`
            );
            setLokasiInfo(`Lokasi: ${alamatDisplay}`);
          }
        }
      });

      gtag("event", "lokasi_dikonfirmasi", {
        kota_terdeteksi: p.kota || "unknown",
        page_path: window.location.pathname,
      });

      const bl = cekAreaBlacklist(alamatText || "");
      if (bl) {
        setStatusClass("cl-status error");
        setStatusMsg(`Area ${bl} belum tercover kabel fiber langsung. Kamu bisa kirim Pengajuan Pasang di bawah ini untuk diverifikasi tim sales.`);
      } else if (hasil.dalamArea) {
        setStatusClass("cl-status success");
        setStatusMsg(`Lokasi terdeteksi di area ${hasil.nama}`);
      } else {
        setStatusClass("cl-status");
        setStatusMsg(
          `Mengecek ketersediaan jaringan fiber XL Home di lokasimu...`
        );
      }

      later(() => {
        if (currentReqId === reqIdRef.current) {
          const q = posRef.current;
          const tagLuar = bl ? ` [LUAR JANGKAUAN - ${bl}]` : "";
          const curAlamat = q.alamat || alamatText;
          const alamatDisplay = curAlamat ? formatAlamatDisekitarnya(curAlamat) : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          q.alamat = alamatDisplay;
          setLokasiInfo(
            `Lokasi Terpilih: ${alamatDisplay}` + tagLuar
          );
          setStep("form");
        }
      }, 900);
      kirimSoftLead();
      fokusForm();
    },
    [fireCoverageEvent, fokusForm, kirimSoftLead, later]
  );

  const prosesLokasiTanpaKoordinat = useCallback(
    (alamatText: string) => {
      const p = posRef.current;
      p.lat = null;
      p.lng = null;
      p.alamat = alamatText;
      p.kota = null;
      
      gtag("event", "lokasi_dikonfirmasi", {
        kota_terdeteksi: "unknown",
        page_path: window.location.pathname,
      });
      const bl = cekAreaBlacklist(alamatText);
      if (bl) {
        setStatusClass("cl-status error");
        setStatusMsg(
          `Area ${bl} di luar jangkauan jaringan fiber XL Home. Layanan kami fokus di Solo, Sukoharjo, Karanganyar, Boyolali & Klaten.`
        );
        later(() => {
          setLokasiInfo(`Alamat: ${alamatText} [LUAR JANGKAUAN - ${bl}]`);
          setStep("form");
        }, 800);
      } else {
        setStatusClass("cl-status");
        setStatusMsg(
          "Alamat dicatat tanpa titik peta pasti. Sales kami akan konfirmasi lokasi lebih lanjut."
        );
        later(() => {
          setLokasiInfo(`Alamat: ${alamatText} (lokasi belum terverifikasi peta)`);
          setStep("form");
        }, 600);
      }
      kirimSoftLead();
      fokusForm();
    },
    [fokusForm, kirimSoftLead, later]
  );

  // ---- buka/tutup ----
  const tutupModal = useCallback(() => {
    setOpen(false);
    setCoverage(null);
    setStatusMsg("");
    setStatusClass("cl-status");
    setFormError(null);
  }, []);

  const bukaModal = useCallback(
    (trigger?: string) => {
      setOpen(true);
      setStep("lokasi");
      modalOpened.current = true;
      setStrip(null);
      setCoverage(null);
      
      gtag("event", "open_cek_lokasi", {
        page_path: window.location.pathname,
        ...(trigger ? { trigger } : {}),
      });
      
    },
    []
  );

  // Delegasi global: semua tombol #btn-buka-cek-lokasi / .btn-cek-lokasi-trigger + deep-link param (?cek=1)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).__pendingCekLokasi) {
        const p = (window as any).__pendingCekLokasi;
        (window as any).__pendingCekLokasi = null;
        setPaketPilihan(p !== "trigger" ? (normalizePaketOption(p) || null) : null);
        bukaModal(p !== "trigger" ? "paket" : "header");
      } else {
        try {
          const sp = new URLSearchParams(window.location.search);
          const hash = window.location.hash;
          const cekParam = sp.get("cek") || (sp.has("open") ? sp.get("open") : null);
          const paketParam = sp.get("paket");
          if (cekParam || hash === "#modal-cek-lokasi") {
            modalOpened.current = true;
            setStrip(null);
            if (paketParam) {
              setPaketPilihan(normalizePaketOption(paketParam) || null);
            } else if (cekParam && cekParam !== "1" && cekParam !== "lokasi" && cekParam !== "true") {
              setPaketPilihan(normalizePaketOption(`Spark ${cekParam} Mbps`) || null);
            }
            window.setTimeout(() => {
              bukaModal("url_param");
            }, 250);
          }
        } catch {
          /* abaikan */
        }
      }
    }

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("#btn-buka-cek-lokasi, .btn-cek-lokasi-trigger") as HTMLElement | null;
      if (!el) return;
      modalOpened.current = true;
      setStrip(null);
      // Tangkap info paket dari data-paket attribute (jika ada) dan normalisasi ke exact option value
      const paketData = el.getAttribute("data-paket");
      const norm = paketData ? normalizePaketOption(paketData) : null;
      setPaketPilihan(norm || null);
      if (el.classList.contains("btn-cek-lokasi-trigger")) bukaModal(paketData ? "paket" : "header");
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
      setStatusMsg("Mencari alamat & klaster fiber...");
      setSearching(true);
      cariAlamatSmart(alamat, 1).then(
        (data) => {
          setSearching(false);
          if (data && data.length > 0) {
            prosesLokasi(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name, data[0]);
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
      cariAlamatSmart(q, 10).then(
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
  const kirim = useCallback(async () => {
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
    const isRequestPasangBaru = coverage?.status === "manual";
    if (!paketPilihan && !isRequestPasangBaru) {
      setFormError("Mohon pilih paket yang ingin dipasang.");
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
    const isWireless = isWirelessSelection(paketPilihan, coverage?.status);
    const effectiveStatus = isWireless ? "wireless" : (coverage?.status || "manual");
    const isReq = effectiveStatus === "manual";
    const kotaKirim = p.kota || coverage?.city || "Area Layanan";
    const alamatKirim = p.alamat || (p.lat && p.lng ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : "");

    let effectiveHpId = effectiveStatus === "fiber" ? (coverage?.homepassId || null) : null;
    let effectiveOdp = effectiveStatus === "fiber" ? (coverage?.odp || null) : null;
    let effectiveCluster = effectiveStatus === "fiber" ? (coverage?.cluster || null) : null;
    let activeCv = coverage;

    // Fail-safe D1 Cloudflare Worker: jika ODP / Cluster / Homepass belum terisi tapi koordinat tersedia
    if (effectiveStatus === "fiber" && (!effectiveOdp || !effectiveHpId || !effectiveCluster) && p.lat != null && p.lng != null) {
      try {
        const freshCv = await cekCoverageWorkerAPI(p.lat, p.lng);
        if (freshCv) {
          activeCv = freshCv;
          if (!effectiveOdp && freshCv.odp) effectiveOdp = freshCv.odp;
          if (!effectiveCluster && freshCv.cluster) effectiveCluster = freshCv.cluster;
          if (!effectiveHpId && freshCv.homepassId) effectiveHpId = freshCv.homepassId;
        }
      } catch {
        /* abaikan */
      }
    }

    const rawHpAddr = activeCv?.alamat ? cleanAlamatResmi(activeCv.alamat) : null;
    const isKoordOnly = rawHpAddr ? /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(rawHpAddr) : false;
    const effectiveHpAddress = (effectiveStatus === "fiber" && !isKoordOnly) ? rawHpAddr : null;
    const effectiveJarak = effectiveStatus === "fiber" ? jarakFiberField(activeCv) : "";

    if (isReq) {
      postLead(
        basePayload("request-pasang-baru", {
          nama: nm,
          whatsapp: w,
          lat: p.lat,
          lng: p.lng,
          alamat: alamatKirim,
          kota: kotaKirim,
          coverage: "request-pasang-baru",
          jarakFiberM: "",
          zona: coverage?.zona || null,
          homepassId: null,
          homepassAddress: null,
          odp: null,
          cluster: null,
          paket: paketPilihan || null,
          peminatSekitar: peminatSekitar,
          providerSaatIni: providerSaatIni,
        })
      );
      gtag("event", "submit_request_pasang_baru", {
        kota_terdeteksi: p.kota || "unknown",
        jarak_m: coverage?.jarakM || -1,
        page_path: window.location.pathname,
      });
      if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
        const fbq = (window as unknown as { fbq: (...a: unknown[]) => void }).fbq;
        fbq("track", "Contact");
        fbq("track", "Lead", {
          content_name: "Request Pasang Baru",
          content_category: "request_pasang_baru_unserved",
          value: 185000,
          currency: "IDR",
        });
      }
      let utmSuffix = "";
      try {
        const u = sessionStorage.getItem("xlsr_utm");
        if (u) utmSuffix = "\n[Sumber: " + u + "]";
      } catch {}
      try {
        localStorage.setItem("xlsr_lead_done", JSON.stringify({ ts: Date.now() }));
      } catch {}

      const pesan =
        "*PENGAJUAN PASANG BARU XL HOME*\n" +
        "Halo Admin XL Home, saya ingin mengajukan *Pemasangan Baru* untuk alamat saya:\n\n" +
        "👤 *Nama:* " + nm + "\n" +
        "📱 *No. WhatsApp:* " + w + "\n" +
        (alamatKirim ? "📍 *Alamat:* " + alamatKirim + "\n" : "") +
        (kotaKirim ? "🏙️ *Kota/Area:* " + kotaKirim + "\n" : "") +
        (mapsLink ? "🧭 *Titik Koordinat:* " + mapsLink + "\n" : "") +
        (coverage?.jarakM != null ? "📏 *Jarak Jaringan Terdekat:* ±" + coverage.jarakM + " meter\n" : "") +
        (paketPilihan ? "📦 *Minat Paket:* " + paketPilihan + "\n" : "") +
        (providerSaatIni ? "📡 *Provider Saat Ini:* " + providerSaatIni + "\n\n" : "\n") +
        "Mohon dibantu pengecekan dan verifikasi jadwal pemasangan baru ya min. Terima kasih!" +
        utmSuffix;

      window.open("https://wa.me/" + NOMOR_WA_SALES + "?text=" + encodeURIComponent(pesan), "_blank");
      tutupModal();
      setSending(false);
      return;
    }

    postLead(
      basePayload("lengkap", {
        nama: nm,
        whatsapp: w,
        lat: p.lat,
        lng: p.lng,
        alamat: alamatKirim,
        kota: kotaKirim,
        coverage: effectiveStatus,
        jarakFiberM: effectiveJarak,
        zona: coverage?.zona || (isWireless ? "5G Ultra" : null),
        homepassId: effectiveHpId,
        homepassAddress: effectiveHpAddress,
        odp: effectiveOdp,
        cluster: effectiveCluster,
        paket: paketPilihan || null,
      })
    );
    gtag("event", "submit_cek_lokasi", {
      kota_terdeteksi: p.kota || "unknown",
      page_path: window.location.pathname,
    });
    if (typeof (window as unknown as { gtag?: unknown }).gtag === "function") {
      const g = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag;
      g("event", "conversion", { send_to: `${ADS_ID}/uoD7CPXb27ADEN7y1b8D` });
    }
    if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
      const fbq = (window as unknown as { fbq: (...a: unknown[]) => void }).fbq;
      fbq("track", "Contact");
      fbq("track", "Lead", {
        content_name: paketPilihan || "Form Cek Lokasi",
        content_category: "location_check_modal",
        value: paketPilihan && (paketPilihan.includes("250") || paketPilihan.includes("300")) ? 229000 : 185000,
        currency: "IDR",
      });
    }
    let utmSuffix = "";
    try {
      const u = sessionStorage.getItem("xlsr_utm");
      if (u) {
        utmSuffix = `\n[Sumber: ${u}]`;
      }
    } catch {
      /* abaikan */
    }
    try {
      const ls = localStorage;
      ls.setItem("xlsr_lead_done", JSON.stringify({ ts: Date.now() }));
    } catch {
      /* abaikan */
    }
    const covLine = isWireless
      ? "Status Jaringan: TERCOVER WIRELESS (FWA)\n"
      : coverageLine(coverage);
    const paketLine = paketPilihan ? `Paket: ${paketPilihan}\n` : "";
    // Customer tidak perlu tahu Homepass ID atau Site ID / ODP (laporan teknis dikirim lengkap via Fonnte & Sheets)
    const pesan =
      `Halo kak, saya ${nm}, mau ${paketPilihan ? "daftar" : "cek ketersediaan"} XL Home.\n` +
      paketLine +
      (alamatKirim ? `Alamat: ${alamatKirim}\n` : "") +
      (mapsLink ? `Peta lokasi: ${mapsLink}\n` : "") +
      (kotaKirim ? `Area/Kota: ${kotaKirim}\n` : "") +
      covLine +
      utmSuffix;
    window.open(`https://wa.me/${NOMOR_WA_SALES}?text=${encodeURIComponent(pesan)}`, "_blank");
    tutupModal();
    setSending(false);
    setPaketPilihan(null);
  }, [nama, wa, coverage, paketPilihan, tutupModal]);

  // ---- strip + IP layer ----
  useEffect(() => {
    let kotaIP = "";
    try {
      const c = JSON.parse(localStorage.getItem(LS_KOTA) || "null") as IpCache | null;
      if (c && Date.now() - c.ts < 24 * 3600 * 1000 && c.kota) {
        const cachedRaw = c.kota.toLowerCase().trim();
        kotaIP = SOLO_RAYA_CITIES.has(cachedRaw) ? c.kota : "Solo Raya";
        gtag("event", "ip_kota_terdeteksi", { kota_ip: kotaIP, page_path: location.pathname });
      } else if (!c) {
        fetch("https://ipwho.is/")
          .then((r) => r.json())
          .then((d: { success?: boolean; city?: string }) => {
            if (!d?.success || !d.city) return;
            const raw = String(d.city).toLowerCase().trim();
            // Hanya tampilkan jika IP berada di wilayah Solo Raya; bila di luar (cth: Tangerang, Jakarta, atau ISP datacenter), set fallback aman "Solo Raya"
            const k = SOLO_RAYA_CITIES.has(raw) ? (KOTA_ALIASES[raw] || "Solo") : "Solo Raya";
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
      const formEl = document.getElementById("form-registrasi") || document.querySelector(".reg-form-wrap");
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) return;
      }
      stripShown.current = true;
      try {
        const c = JSON.parse(localStorage.getItem(LS_KOTA) || "null") as IpCache | null;
        const raw = (c?.kota || "").toLowerCase().trim();
        setStrip(SOLO_RAYA_CITIES.has(raw) ? (c?.kota || "Solo Raya") : "Solo Raya");
      } catch {
        setStrip("Solo Raya");
      }
      gtag("event", "lokasi_strip_muncul", { page_path: location.pathname });
    };
    const t = window.setTimeout(mungkin, 12000);
    const onScroll = () => {
      const formEl = document.getElementById("form-registrasi") || document.querySelector(".reg-form-wrap");
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setStrip(null);
          return;
        }
      }
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
      <style>{`/* Port 1:1 CSS modal cek-lokasi xssr@ec66035 */

  .cl-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    z-index: 100000; display: flex; align-items: center; justify-content: center;
    padding: 16px;
  }
  .cl-modal-box {
    background: #fff; border-radius: 16px; max-width: 480px; width: 100%;
    max-height: 90vh; overflow-y: auto; padding: 28px 24px; position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .cl-modal-close {
    position: absolute; top: 14px; right: 16px; background: none; border: none;
    font-size: 28px; line-height: 1; color: #999; cursor: pointer; padding: 4px;
  }
  .cl-modal-close:hover { color: #333; }
  .cl-title { font-size: 19px; font-weight: 700; margin: 0 0 8px 0; color: #1a1a1a; display:flex; align-items:center; gap:8px; }
  .cl-title i { color: #037e64; }
  .cl-sub { font-size: 14px; color: #666; margin: 0 0 20px 0; line-height: 1.5; }
  .cl-btn-primary {
    width: 100%; background: linear-gradient(135deg, #0d7a5f 0%, #037e64 100%);
    color: #fff; border: none; padding: 14px; border-radius: 12px; font-size: 15px;
    font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; transition: opacity 0.2s;
  }
  .cl-btn-primary:hover { opacity: 0.9; }
  .cl-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .cl-btn-secondary {
    width: 100%; background: #f0f9f7; color: #037e64; border: 1.5px solid #037e64;
    padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px;
  }
  .cl-btn-text {
    width: 100%; background: none; border: none; color: #888; font-size: 13px;
    text-decoration: underline; cursor: pointer; margin-top: 10px; padding: 6px;
  }
  .cl-geo-fallback { background: #fff8f0; border: 1px solid #fed7aa; border-radius: 12px; padding: 16px; margin-top: 14px; }
  .cl-geo-fallback .cl-label { margin-top: 10px; }
  .cl-geo-fallback .cl-input { border-color: #fdba74; }
  .cl-divider { text-align: center; margin: 18px 0; position: relative; color: #aaa; font-size: 13px; }
  .cl-divider::before, .cl-divider::after {
    content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: #e5e5e5;
  }
  .cl-divider::before { left: 0; }
  .cl-divider::after { right: 0; }
  .cl-label { display: block; font-size: 13px; font-weight: 600; color: #444; margin: 14px 0 6px 0; }
  .cl-input {
    width: 100%; padding: 12px 14px; border: 1.5px solid #e0e0e0; border-radius: 10px;
    font-size: 14px; box-sizing: border-box;
  }
  .cl-input:focus { outline: none; border-color: #037e64; }
  .cl-autocomplete-wrap { position: relative; }
  .cl-suggestions {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 10px;
    max-height: 220px; overflow-y: auto; z-index: 10;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
  .cl-suggestion-item {
    padding: 10px 14px; font-size: 13.5px; color: #333; cursor: pointer;
    border-bottom: 1px solid #f0f0f0; display: flex; align-items: flex-start; gap: 10px;
    transition: background 0.15s ease;
  }
  .cl-suggestion-item:last-child { border-bottom: none; }
  .cl-suggestion-item:hover, .cl-suggestion-item.active { background: #f0fdf4; }
  .cl-suggestion-item.fiber-ready { background: #fcfdfc; }
  .cl-suggestion-item.fiber-ready:hover { background: #ecfdf5; }
  .cl-sugg-icon { color: #0284c7; margin-top: 2px; flex-shrink: 0; }
  .cl-suggestion-item.fiber-ready .cl-sugg-icon { color: #059669; }
  .cl-sugg-content { flex: 1; min-width: 0; }
  .cl-sugg-title {
    font-weight: 700; color: #1e293b; display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
    font-size: 13px; line-height: 1.4;
  }
  .cl-sugg-title span:first-child {
    flex: 1; min-width: 0; white-space: normal; word-break: break-word; overflow-wrap: anywhere;
  }
  .cl-sugg-sub {
    font-size: 11.5px; color: #64748b; margin-top: 3px;
    white-space: normal; word-break: break-word; overflow-wrap: anywhere; line-height: 1.35;
  }
  .cl-badge-fiber {
    font-size: 10px; font-weight: 700; color: #047857; background: #d1fae5; border: 1px solid #a7f3d0;
    padding: 1.5px 6px; border-radius: 9999px; text-transform: uppercase; white-space: nowrap; flex-shrink: 0;
    letter-spacing: 0.3px;
  }
  .cl-badge-street {
    font-size: 10px; font-weight: 600; color: #475569; background: #f1f5f9; border: 1px solid #e2e8f0;
    padding: 1.5px 6px; border-radius: 9999px; text-transform: uppercase; white-space: nowrap; flex-shrink: 0;
  }
  .cl-suggestion-empty { padding: 12px 14px; font-size: 13px; color: #999; text-align: center; }
  
  .cl-status {
    font-size: 13px; color: #666; margin-top: 12px; text-align: center; min-height: 18px;
  }
  .cl-status.error { color: #d33; }
  .cl-status.success { color: #037e64; font-weight: 600; }
  @media (max-width: 480px) {
    .cl-modal-overlay { padding: 8px; }
    .cl-modal-box { padding: 18px 14px; border-radius: 14px; max-height: 94vh; width: 100%; box-sizing: border-box; }
    .cl-title { font-size: 17px; }
    .cl-sub { font-size: 13px; margin: 0 0 14px 0; }
    .cl-btn-primary { padding: 12px; font-size: 14px; }
    .cl-suggestions { max-height: 240px; }
  }
  body.modal-open .promo-popup-overlay,
  body.modal-open .live-social-proof-wrap,
  body.modal-open #xlsr-lokasi-strip,
  body:has(#form-registrasi:focus-within) #xlsr-lokasi-strip,
  body:has(.reg-sugg-dropdown) #xlsr-lokasi-strip,
  body:has(#form-alamat:focus) #xlsr-lokasi-strip {
    display: none !important;
  }`}</style>
      <AnimatePresence>
        {strip !== null && !open && (
          <motion.div
            id="xlsr-lokasi-strip"
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            style={{
              position: "fixed",
              left: "50%",
              bottom: "calc(96px + env(safe-area-inset-bottom))",
              zIndex: 9998,
              width: "min(92%,340px)",
              background: "#fff",
              color: "var(--text)",
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              boxShadow: "0 10px 40px rgba(0,0,0,.15)",
              border: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ background: "var(--green-light)", color: "var(--green)", padding: 10, borderRadius: 12 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2, marginBottom: 2 }}>Cek Jaringan XL Home</div>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.3 }}>
                    Apakah rumahmu di {strip || 'areamu'} sudah ter-cover Fiber?
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  tutupStrip(true);
                  gtag("event", "lokasi_strip_tutup", { page_path: location.pathname });
                }}
                aria-label="Tutup"
                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <button
              onClick={() => { tutupStrip(true); bukaModal("strip"); }}
              style={{
                background: "var(--green)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                transition: "background .2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--green-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--green)"}
            >
              Cek Lokasi Saya <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
        </AnimatePresence>

      {open && (
        <div
          id="modal-cek-lokasi"
          className="cl-modal-overlay"
          style={{ display: "flex" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) tutupModal();
          }}
        >
          <motion.div className="cl-modal-box" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
            <button
              type="button"
              className="cl-modal-close"
              aria-label="Tutup"
              onClick={tutupModal}
            >
              &times;
            </button>

            <AnimatePresence mode="wait">
              {step === "lokasi" ? (
              <motion.div key="lokasi" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} id="cl-step-lokasi">
                <h3 className="cl-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <MapPin size={18} /> {paketPilihan ? "Satu Langkah Lagi!" : "Cek Ketersediaan"}
                </h3>
                <p className="cl-sub">
                  {paketPilihan
                    ? `Kamu memilih ${paketPilihan.replace(/Saya minat paket /i, '').replace(/Saya minat /i, '')}. Cek ketersediaan di lokasimu dulu ya!`
                    : "Bagikan lokasimu — sistem cek otomatis coverage fiber di lokasimu."}
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
                            className={`cl-suggestion-item ${s.isFiberReady ? "fiber-ready" : ""}`}
                            onClick={() => {
                              const formatted = formatAlamatDisekitarnya(s.display_name);
                              setQuery(formatted);
                              setShowSugg(false);
                              prosesLokasi(parseFloat(s.lat), parseFloat(s.lon), formatted, s);
                            }}
                          >
                            <div className="cl-sugg-icon">
                              {s.isFiberReady ? <Zap size={16} /> : <MapPin size={16} />}
                            </div>
                            <div className="cl-sugg-content">
                              <div className="cl-sugg-title">
                                <span>{s.title}</span>
                                {s.isFiberReady ? (
                                  <span className="cl-badge-fiber" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Zap size={11} aria-hidden="true" /> Siap Pasang</span>
                                ) : (
                                  <span className="cl-badge-street" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><MapPin size={11} aria-hidden="true" /> Alamat</span>
                                )}
                              </div>
                              <div className="cl-sugg-sub">{s.subtitle}</div>
                            </div>
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
                  <CheckCircle2 size={18} color="var(--green)" style={{ flexShrink: 0 }} />
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
                      padding: "14px 16px",
                      fontSize: 14,
                      margin: "0 0 16px",
                      background: t[0],
                      color: t[1],
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <strong style={{ display: "block", marginBottom: 8, fontSize: 14, letterSpacing: "-0.2px" }}>
                      {t[2]}
                    </strong>
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                      {coverageDetail(coverage)
                        .split(/(wa\.me\/[^\s)]+)/g)
                        .map((part, i) => {
                          if (part.startsWith("wa.me/")) {
                            return (
                              <a
                                key={i}
                                href={`https://${part}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "inherit",
                                  textDecoration: "underline",
                                  fontWeight: 700,
                                }}
                              >
                                {part}
                              </a>
                            );
                          }
                          return part;
                        })}
                    </div>
                  </div>
                )}
                <form 
                  // @ts-ignore
                  toolname="daftarPasangWifiSolo" 
                  // @ts-ignore
                  tooldescription="Formulir resmi pendaftaran pasang baru dan pengecekan jangkauan jaringan fiber optik XL Home Solo Raya."
                  // @ts-ignore
                  toolautosubmit="true"
                  onSubmit={(e) => { e.preventDefault(); kirim(); }}
                >
                  <label htmlFor="cl-nama" className="cl-label">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="cl-nama"
                    name="nama"
                    required
                    className="cl-input"
                    placeholder="Nama kamu"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    // @ts-ignore
                    toolparamdescription="Nama lengkap pemohon pemasangan WiFi XL Home"
                  />
                  <label htmlFor="cl-wa" className="cl-label">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    id="cl-wa"
                    name="whatsapp"
                    required
                    className="cl-input"
                    placeholder="0812xxxxxxx"
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                    // @ts-ignore
                    toolparamdescription="Nomor WhatsApp aktif pemohon untuk konfirmasi jadwal pasang teknisi"
                  />
                  {coverage?.status === "manual" ? (
                    <>
                      <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: "14px 0", fontSize: 13, color: "#991b1b" }}>
                        <strong><Sparkles size={14} style={{ display: "inline-block", marginRight: 5, verticalAlign: "-2px" }} aria-hidden="true" /> Formulir Pengajuan Pasang Baru</strong><br />
                        Data ini langsung diteruskan ke tim sales XL Home Solo Raya untuk verifikasi opsi pemasangan ke lokasimu.
                      </div>

                      <label htmlFor="cl-paket-manual" className="cl-label">
                        Pilihan Paket yang Ingin Dipasang
                      </label>
                      <select
                        id="cl-paket-manual"
                        name="paket"
                        className="cl-input"
                        value={paketPilihan || ""}
                        onChange={(e) => setPaketPilihan(e.target.value)}
                      >
                        <option value="">-- Pilih Paket Internet --</option>
                        <option value="Saya minat paket XL Home Starter 20 Mbps Rp185.000">XL Home Starter 20 Mbps (Rp185.000)</option>
                        <option value="Saya minat paket XL Home Spark 250 Mbps Rp229.000">XL Home Spark 250 Mbps (Rp229.000)</option>
                        <option value="Saya minat paket XL Home Spark 300 Mbps Rp239.000">XL Home Spark 300 Mbps (Rp239.000)</option>
                        <option value="Saya minat paket XL Home Spark 400 Mbps Rp299.000">XL Home Spark 400 Mbps (Rp299.000)</option>
                        <option value="Saya minat paket XL Home Spark 500 Mbps Rp399.000">XL Home Spark 500 Mbps (Rp399.000)</option>
                        <option value="Saya minat XL Home Wireless Monthly 100 Mbps Rp219.500">XL Home Wireless 100 Mbps (Rp219.500)</option>
                      </select>

                      <label htmlFor="cl-provider" className="cl-label">
                        Provider internet saat ini di rumah (opsional)
                      </label>
                      <select
                        id="cl-provider"
                        className="cl-input"
                        value={providerSaatIni}
                        onChange={(e) => setProviderSaatIni(e.target.value)}
                      >
                        <option value="Belum ada internet kabel / Kuota HP">Belum ada internet kabel / Pakai kuota HP</option>
                        <option value="IndiHome (Mau beralih ke XL Home)">IndiHome (Mau beralih ke XL Home)</option>
                        <option value="Biznet / MyRepublic / First Media">Biznet / MyRepublic / First Media</option>
                        <option value="Provider lokal lainnya / RT-RW Net">Provider lokal lainnya / RT-RW Net</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <label htmlFor="cl-paket" className="cl-label">
                        Pilihan Paket
                      </label>
                  <select
                    id="cl-paket"
                    name="paket"
                    className="cl-input"
                    value={paketPilihan || ""}
                    onChange={(e) => setPaketPilihan(e.target.value)}
                    // @ts-ignore
                    toolparamdescription="Pilihan paket internet WiFi XL Home yang diinginkan"
                  >
                    <option value="">-- Pilih Paket --</option>
                    {(!coverage || coverage.status !== "wireless") && (
                      <>
                        <option value="Saya minat paket XL Home Starter 20 Mbps Rp185.000">XL Home Starter 20 Mbps (Rp185.000)</option>
                        <option value="Saya minat paket XL Home Spark 250 Mbps Rp229.000">XL Home Spark 250 Mbps (Rp229.000)</option>
                        <option value="Saya minat paket XL Home Spark 300 Mbps Rp239.000">XL Home Spark 300 Mbps (Rp239.000)</option>
                        <option value="Saya minat paket XL Home Spark 400 Mbps Rp299.000">XL Home Spark 400 Mbps (Rp299.000)</option>
                        <option value="Saya minat paket XL Home Spark 500 Mbps Rp399.000">XL Home Spark 500 Mbps (Rp399.000)</option>
                        <option value="Saya minat paket XL Home Spark 1000 Mbps Rp899.000">XL Home Spark 1000 Mbps (Rp899.000)</option>
                      </>
                    )}
                    <option value="Saya minat XL Home Wireless Monthly 100 Mbps Rp219.500">Wireless Monthly 100 Mbps (Rp219.500)</option>
                    <option value="Saya minat XL Home Wireless 50 Mbps Advance Rp650.000">Wireless Advance 50 Mbps (Rp650.000)</option>
                    <option value="Saya minat XL Home Wireless 100 Mbps Advance Rp790.000">Wireless Advance 100 Mbps (Rp790.000)</option>
                    {coverage?.status === "wireless" && (
                      <option value="Saya ingin konsultasi pasang kabel fiber">Konsultasi Opsi Pasang Kabel Fiber</option>
                    )}
                  </select>
                    </>
                  )}
                  {formError && (
                    <p className="cl-status error" style={{ marginTop: 10 }}>
                      {formError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="cl-btn-primary"
                    disabled={sending}
                    style={{ marginTop: 12 }}
                  >
                    <MessageCircle size={18} />{" "}
                    {sending ? "Memproses..." : coverage?.status === "manual" ? "Kirim Pengajuan Pasang via WhatsApp" : coverage?.status === "mungkin" ? "Konsultasi Jalur via WhatsApp" : coverage?.status === "wireless" ? "Daftar XL Home Wireless via WhatsApp" : paketPilihan ? "Daftar via WhatsApp" : "Daftar Pasang Baru via WhatsApp"}
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
                </form>
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
















