"use client";

import { useState, useRef, useCallback } from "react";

type Phase = "idle" | "ping" | "download" | "upload" | "done";

const CF_DOWN = "https://speed.cloudflare.com/__down";
const CF_UP = "https://speed.cloudflare.com/__up";

export default function Speedtest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [dlSpeed, setDlSpeed] = useState<number | null>(null);
  const [ulSpeed, setUlSpeed] = useState<number | null>(null);
  const [liveSpeed, setLiveSpeed] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  const now = () => performance.now();

  // ─── PING ──────────────────────────────────────────────────────────────────
  const runPing = async (signal: AbortSignal) => {
    const results: number[] = [];
    for (let i = 0; i < 10; i++) {
      if (signal.aborted) break;
      try {
        const t = now();
        await fetch(`${CF_DOWN}?bytes=0&_=${Date.now()}${i}`, {
          method: "HEAD",
          cache: "no-store",
          mode: "cors",
          signal,
        });
        results.push(now() - t);
      } catch {
        /* skip */
      }
      await new Promise((r) => setTimeout(r, 50));
    }
    if (!results.length) return { avg: 0, jitter: 0 };
    results.sort((a, b) => a - b);
    // Trim min & max outliers
    const trimmed = results.length > 4 ? results.slice(1, -1) : results;
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    const jit =
      trimmed.length > 1
        ? trimmed.reduce((a, b) => a + Math.abs(b - avg), 0) / trimmed.length
        : 0;
    return { avg: Math.round(avg), jitter: Math.round(jit) };
  };

  // ─── DOWNLOAD ──────────────────────────────────────────────────────────────
  // Strategi: banyak request paralel, pakai ReadableStream jika tersedia,
  // fallback ke arrayBuffer(). Tidak bergantung pada XHR onprogress sama sekali.
  const runDownload = async (
    durationMs: number,
    signal: AbortSignal
  ): Promise<number> => {
    const startTime = now();
    const deadline = startTime + durationMs;
    let totalBytes = 0;
    let lastUIUpdate = 0;

    const updateUI = () => {
      const elapsed = now() - startTime;
      if (elapsed - lastUIUpdate < 200 && elapsed < durationMs) return;
      lastUIUpdate = elapsed;
      const mbps = elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
      setLiveSpeed(mbps);
      setDlSpeed(mbps);
      setProgress(Math.min(95, (elapsed / durationMs) * 100));
    };

    // Adaptive chunk: mulai kecil (1MB), naik sampai 10MB setelah warm-up
    let chunkSize = 1_000_000;

    const downloadOne = async () => {
      if (signal.aborted || now() >= deadline) return;
      try {
        const res = await fetch(
          `${CF_DOWN}?bytes=${chunkSize}&_=${Date.now()}${Math.random()}`,
          { cache: "no-store", signal }
        );
        // Coba streaming reader (modern browsers, termasuk mobile)
        if (res.body && typeof res.body.getReader === "function") {
          const reader = res.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done || signal.aborted || now() >= deadline) break;
            totalBytes += value.byteLength;
            updateUI();
          }
        } else {
          // Fallback: tunggu seluruh response
          const buf = await res.arrayBuffer();
          totalBytes += buf.byteLength;
          updateUI();
        }
      } catch {
        // Network error, skip
      }
      // Adaptive: naikkan chunk setelah warm-up
      if (now() - startTime > 2000 && chunkSize < 10_000_000) {
        chunkSize = Math.min(chunkSize * 2, 10_000_000);
      }
    };

    // 3 worker paralel — saturasi pipa tanpa overload mobile
    const worker = async () => {
      while (!signal.aborted && now() < deadline) {
        await downloadOne();
      }
    };

    await Promise.all([worker(), worker(), worker()]);

    const elapsed = now() - startTime;
    const finalMbps =
      elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
    return finalMbps;
  };

  // ─── UPLOAD ────────────────────────────────────────────────────────────────
  // Strategi: kirim blob kecil berulang kali, ukur total bytes / total waktu.
  // 2 worker paralel.
  const runUpload = async (
    durationMs: number,
    signal: AbortSignal
  ): Promise<number> => {
    const startTime = now();
    const deadline = startTime + durationMs;
    let totalBytes = 0;
    let lastUIUpdate = 0;

    // Adaptive chunk: 500KB awal, naik sampai 4MB
    let chunkSize = 500_000;

    const updateUI = () => {
      const elapsed = now() - startTime;
      if (elapsed - lastUIUpdate < 200 && elapsed < durationMs) return;
      lastUIUpdate = elapsed;
      const mbps = elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
      setLiveSpeed(mbps);
      setUlSpeed(mbps);
      setProgress(Math.min(95, (elapsed / durationMs) * 100));
    };

    const uploadOne = async () => {
      if (signal.aborted || now() >= deadline) return;
      const blob = new Blob([new ArrayBuffer(chunkSize)]);
      try {
        await fetch(`${CF_UP}?_=${Date.now()}${Math.random()}`, {
          method: "POST",
          body: blob,
          signal,
        });
        totalBytes += chunkSize;
        updateUI();
      } catch {
        // Network error, skip
      }
      // Adaptive: naikkan chunk setelah warm-up
      if (now() - startTime > 2000 && chunkSize < 4_000_000) {
        chunkSize = Math.min(chunkSize * 2, 4_000_000);
      }
    };

    const worker = async () => {
      while (!signal.aborted && now() < deadline) {
        await uploadOne();
      }
    };

    await Promise.all([worker(), worker()]);

    const elapsed = now() - startTime;
    const finalMbps =
      elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
    return finalMbps;
  };

  // ─── MAIN ──────────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    // Abort previous run if any
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setPing(null);
    setJitter(null);
    setDlSpeed(null);
    setUlSpeed(null);
    setLiveSpeed(0);
    setProgress(0);

    try {
      // Ping
      setPhase("ping");
      const { avg, jitter: jit } = await runPing(ac.signal);
      if (ac.signal.aborted) return;
      setPing(avg);
      setJitter(jit);

      // Download (10 detik)
      setPhase("download");
      setLiveSpeed(0);
      setProgress(0);
      const dl = await runDownload(10000, ac.signal);
      if (ac.signal.aborted) return;
      setDlSpeed(dl);
      setLiveSpeed(0);

      // Upload (10 detik)
      setPhase("upload");
      setLiveSpeed(0);
      setProgress(0);
      const ul = await runUpload(10000, ac.signal);
      if (ac.signal.aborted) return;
      setUlSpeed(ul);
      setLiveSpeed(0);

      setProgress(100);
      setPhase("done");
    } catch {
      // aborted
    }
  }, []);

  // ─── UI ────────────────────────────────────────────────────────────────────
  const fmt = (n: number | null) =>
    n === null ? "–" : n < 10 ? n.toFixed(2) : n.toFixed(1);

  const displayMbps = phase === "done" ? fmt(dlSpeed) : fmt(liveSpeed);

  // Gauge
  const R = 88;
  const CIRC = 2 * Math.PI * R;
  const SWEEP = 250;
  const ratio = Math.min(Math.max(liveSpeed / 200, 0), 1);
  const offset = CIRC - ratio * (SWEEP / 360) * CIRC;
  const gaugeStroke =
    phase === "upload"
      ? "#a78bfa"
      : phase === "download"
      ? "#4ade80"
      : "#38bdf8";

  const phaseLabel: Record<Phase, string> = {
    idle: "Siap",
    ping: "Ping...",
    download: "Download",
    upload: "Upload",
    done: "Selesai",
  };

  // Hasil kategori
  const category =
    dlSpeed === null
      ? null
      : dlSpeed >= 50
      ? {
          label: "✅ Cepat",
          color: "#16a34a",
          bg: "#f0fdf4",
          text: "Lancar untuk streaming 4K, gaming, dan WFH sekeluarga.",
        }
      : dlSpeed >= 20
      ? {
          label: "⚡ Sedang",
          color: "#d97706",
          bg: "#fffbeb",
          text: "Cukup untuk streaming HD dan browsing, tapi bisa lebih baik.",
        }
      : {
          label: "🐢 Lambat",
          color: "#dc2626",
          bg: "#fef2f2",
          text: "Kurang ideal untuk keluarga aktif. Pertimbangkan XL SATU Fiber Optik!",
        };

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        padding: "0 4px",
      }}
    >
      {/* Card utama */}
      <div
        style={{
          background: "#0f172a",
          borderRadius: 20,
          padding: "28px 20px 24px",
          color: "#fff",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
            padding: "0 4px",
          }}
        >
          {/* Ping */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              Ping
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {ping === null ? "–" : ping}
              <span
                style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}
              >
                {" "}
                ms
              </span>
            </div>
            {jitter !== null && (
              <div style={{ fontSize: 11, color: "#475569" }}>±{jitter}ms</div>
            )}
          </div>
          {/* Download */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 11,
                color: "#4ade80",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              ↓ Download
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {phase === "done"
                ? fmt(dlSpeed)
                : phase === "download"
                ? fmt(liveSpeed)
                : fmt(dlSpeed)}
              <span
                style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}
              >
                {" "}
                Mbps
              </span>
            </div>
          </div>
          {/* Upload */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 11,
                color: "#a78bfa",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 3,
              }}
            >
              ↑ Upload
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {phase === "done"
                ? fmt(ulSpeed)
                : phase === "upload"
                ? fmt(liveSpeed)
                : fmt(ulSpeed)}
              <span
                style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}
              >
                {" "}
                Mbps
              </span>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div
          style={{
            position: "relative",
            width: 220,
            height: 220,
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="220"
            height="220"
            viewBox="0 0 200 200"
            style={{ transform: "rotate(145deg)" }}
          >
            {/* Track */}
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="#1e293b"
              strokeWidth="13"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - (SWEEP / 360) * CIRC}
              strokeLinecap="round"
            />
            {/* Fill */}
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={gaugeStroke}
              strokeWidth="13"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition:
                  "stroke-dashoffset 0.12s ease-out, stroke 0.25s",
              }}
            />
          </svg>
          {/* Center label */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 6,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {phaseLabel[phase]}
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1,
                color: "#f1f5f9",
              }}
            >
              {displayMbps}
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>
              Mbps
            </div>
          </div>
        </div>

        {/* Button / progress bar */}
        {phase === "idle" || phase === "done" ? (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={start}
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "14px 44px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: 0.5,
                boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {phase === "done" ? "↺ Uji Ulang" : "▶ MULAI"}
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                height: 5,
                background: "#1e293b",
                borderRadius: 99,
                overflow: "hidden",
                margin: "0 8px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background:
                    phase === "upload" ? "#a78bfa" : "#4ade80",
                  borderRadius: 99,
                  transition: "width 0.15s linear",
                }}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#475569",
                marginTop: 8,
              }}
            >
              {phase === "ping" && "Mengukur latensi..."}
              {phase === "download" && "Mengukur kecepatan download..."}
              {phase === "upload" && "Mengukur kecepatan upload..."}
            </div>
          </div>
        )}

        {/* Server info */}
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#334155",
            marginTop: 18,
          }}
        >
          Server: Cloudflare Edge · Jakarta / Singapore
        </div>
      </div>

      {/* Hasil kategori */}
      {phase === "done" && category && (
        <div
          style={{
            marginTop: 12,
            padding: "14px 16px",
            background: category.bg,
            borderRadius: 12,
            borderLeft: `4px solid ${category.color}`,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: category.color,
              marginBottom: 4,
            }}
          >
            {category.label}
          </div>
          <div style={{ fontSize: 13, color: "#374151" }}>
            {category.text}
          </div>
        </div>
      )}

      {/* Acuan */}
      <div
        style={{
          marginTop: 10,
          padding: "12px 16px",
          background: "#f8fafc",
          borderRadius: 12,
          fontSize: 13,
          color: "#475569",
        }}
      >
        <strong
          style={{ color: "#0f172a", display: "block", marginBottom: 6 }}
        >
          💡 Acuan kecepatan
        </strong>
        <div>≥50 Mbps — 4K + gaming + WFH sekeluarga</div>
        <div>20–49 Mbps — streaming HD, browsing normal</div>
        <div style={{ color: "#dc2626" }}>
          &lt;20 Mbps — kurang ideal untuk keluarga aktif
        </div>
      </div>
    </div>
  );
}
