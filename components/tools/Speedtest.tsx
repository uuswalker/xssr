"use client";

import { useState, useRef, useCallback } from "react";

type Phase = "idle" | "ping" | "download" | "upload" | "done";

// Same-origin endpoints — guaranteed to work on all devices
const PING_URL = "/speedtest/chunk.bin";
const DOWN_URL = "/speedtest/chunk.bin"; // 1MB static file
// Upload: POST to our own domain — body still transmits even though server returns 404.
// Vercel Edge receives the full request body before responding.
const UP_URL = "/speedtest/ul";

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
    // Warm-up
    try {
      await fetch(`${PING_URL}?_=w`, { method: "HEAD", cache: "no-store", signal });
    } catch { /* */ }

    for (let i = 0; i < 12; i++) {
      if (signal.aborted) break;
      try {
        const t = now();
        await fetch(`${PING_URL}?_=${Date.now()}${i}`, {
          method: "HEAD",
          cache: "no-store",
          signal,
        });
        results.push(now() - t);
      } catch { /* */ }
      await new Promise((r) => setTimeout(r, 40));
    }
    if (!results.length) return { avg: 0, jitter: 0 };
    results.sort((a, b) => a - b);
    const trimmed = results.length > 4 ? results.slice(1, -1) : results;
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    const jit = trimmed.length > 1
      ? trimmed.reduce((a, b) => a + Math.abs(b - avg), 0) / trimmed.length
      : 0;
    return { avg: Math.round(avg), jitter: Math.round(jit) };
  };

  // ─── DOWNLOAD ──────────────────────────────────────────────────────────────
  // Fetch same-origin 1MB file repeatedly with cache-busting.
  // ReadableStream for live progress, arrayBuffer fallback.
  const runDownload = async (durationMs: number, signal: AbortSignal): Promise<number> => {
    const startTime = now();
    const deadline = startTime + durationMs;
    let totalBytes = 0;
    let lastUI = 0;

    const updateUI = () => {
      const elapsed = now() - startTime;
      if (elapsed - lastUI < 150 && elapsed < durationMs) return;
      lastUI = elapsed;
      const mbps = elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
      setLiveSpeed(mbps);
      setDlSpeed(mbps);
      setProgress(Math.min(95, (elapsed / durationMs) * 100));
    };

    const downloadOne = async () => {
      if (signal.aborted || now() >= deadline) return;
      try {
        const res = await fetch(`${DOWN_URL}?_=${Date.now()}${Math.random()}`, {
          cache: "no-store",
          signal,
        });
        if (res.body && typeof res.body.getReader === "function") {
          const reader = res.body.getReader();
          while (true) {
            if (signal.aborted || now() >= deadline) { reader.cancel(); break; }
            const { done, value } = await reader.read();
            if (done) break;
            totalBytes += value.byteLength;
            updateUI();
          }
        } else {
          const buf = await res.arrayBuffer();
          totalBytes += buf.byteLength;
          updateUI();
        }
      } catch {
        if (!signal.aborted && now() < deadline) {
          await new Promise((r) => setTimeout(r, 50));
        }
      }
    };

    // 4 parallel workers — saturate connection with 1MB chunks
    const worker = async () => {
      while (!signal.aborted && now() < deadline) {
        await downloadOne();
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);

    const elapsed = now() - startTime;
    return elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
  };

  // ─── UPLOAD ────────────────────────────────────────────────────────────────
  // POST blob to same-origin. Server returns 404/405 but the body is still
  // transmitted over the network. We measure round-trip time.
  // Since the 404 response is tiny (<1KB), the dominant factor is upload time.
  const runUpload = async (durationMs: number, signal: AbortSignal): Promise<number> => {
    const startTime = now();
    const deadline = startTime + durationMs;
    let totalBytes = 0;
    let lastUI = 0;
    let chunkSize = 256_000; // start 256KB (safe for mobile)

    const updateUI = () => {
      const elapsed = now() - startTime;
      if (elapsed - lastUI < 150 && elapsed < durationMs) return;
      lastUI = elapsed;
      const mbps = elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
      setLiveSpeed(mbps);
      setUlSpeed(mbps);
      setProgress(Math.min(95, (elapsed / durationMs) * 100));
    };

    const uploadOne = async () => {
      if (signal.aborted || now() >= deadline) return;
      const blob = new Blob([new ArrayBuffer(chunkSize)]);
      try {
        // POST to same-origin — body is fully transmitted before response
        await fetch(`${UP_URL}?_=${Date.now()}${Math.random()}`, {
          method: "POST",
          body: blob,
          signal,
          // Don't follow redirects, just measure upload time
          redirect: "manual",
        });
      } catch {
        // 404/405 response throws in some cases — that's OK
      }
      // Body was sent regardless of response status
      totalBytes += chunkSize;
      updateUI();

      // Scale up after warm-up
      if (now() - startTime > 2000 && chunkSize < 2_000_000) {
        chunkSize = Math.min(chunkSize * 2, 2_000_000);
      }
    };

    // 2 parallel upload workers
    const worker = async () => {
      while (!signal.aborted && now() < deadline) {
        await uploadOne();
      }
    };
    await Promise.all([worker(), worker()]);

    const elapsed = now() - startTime;
    return elapsed > 0 ? (totalBytes * 8) / (elapsed / 1000) / 1e6 : 0;
  };

  // ─── MAIN ──────────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setPing(null); setJitter(null);
    setDlSpeed(null); setUlSpeed(null);
    setLiveSpeed(0); setProgress(0);

    try {
      setPhase("ping");
      const { avg, jitter: jit } = await runPing(ac.signal);
      if (ac.signal.aborted) return;
      setPing(avg); setJitter(jit);

      setPhase("download");
      setLiveSpeed(0); setProgress(0);
      const dl = await runDownload(10000, ac.signal);
      if (ac.signal.aborted) return;
      setDlSpeed(dl); setLiveSpeed(0);

      setPhase("upload");
      setLiveSpeed(0); setProgress(0);
      const ul = await runUpload(10000, ac.signal);
      if (ac.signal.aborted) return;
      setUlSpeed(ul); setLiveSpeed(0);

      setProgress(100);
      setPhase("done");
    } catch { /* aborted */ }
  }, []);

  // ─── UI ────────────────────────────────────────────────────────────────────
  const fmt = (n: number | null) =>
    n === null ? "–" : n < 10 ? n.toFixed(2) : n.toFixed(1);

  const displayMbps = phase === "done" ? fmt(dlSpeed) : fmt(liveSpeed);

  const R = 88;
  const CIRC = 2 * Math.PI * R;
  const SWEEP = 250;
  const ratio = Math.min(Math.max(liveSpeed / 200, 0), 1);
  const offset = CIRC - ratio * (SWEEP / 360) * CIRC;
  const gaugeStroke = phase === "upload" ? "#a78bfa" : phase === "download" ? "#4ade80" : "#38bdf8";

  const phaseLabel: Record<Phase, string> = {
    idle: "Siap", ping: "Ping...", download: "Download", upload: "Upload", done: "Selesai",
  };

  const category = dlSpeed === null ? null
    : dlSpeed >= 50 ? { label: "✅ Cepat", color: "#16a34a", bg: "#f0fdf4", text: "Lancar untuk streaming 4K, gaming, dan WFH sekeluarga." }
    : dlSpeed >= 20 ? { label: "⚡ Sedang", color: "#d97706", bg: "#fffbeb", text: "Cukup untuk streaming HD dan browsing, tapi bisa lebih baik." }
    : { label: "🐢 Lambat", color: "#dc2626", bg: "#fef2f2", text: "Kurang ideal untuk keluarga aktif. Pertimbangkan XL SATU Fiber Optik!" };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", fontFamily: "system-ui, sans-serif", padding: "0 4px" }}>
      <div style={{ background: "#0f172a", borderRadius: 20, padding: "28px 20px 24px", color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>

        {/* Stats row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, padding: "0 4px" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Ping</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {ping === null ? "–" : ping}<span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}> ms</span>
            </div>
            {jitter !== null && <div style={{ fontSize: 11, color: "#475569" }}>±{jitter}ms</div>}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#4ade80", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>↓ Download</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {phase === "done" ? fmt(dlSpeed) : phase === "download" ? fmt(liveSpeed) : fmt(dlSpeed)}
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}> Mbps</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>↑ Upload</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {phase === "done" ? fmt(ulSpeed) : phase === "upload" ? fmt(liveSpeed) : fmt(ulSpeed)}
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}> Mbps</span>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 20px" }}>
          <svg width="220" height="220" viewBox="0 0 200 200" style={{ transform: "rotate(145deg)" }}>
            <circle cx="100" cy="100" r={R} fill="none" stroke="#1e293b" strokeWidth="13"
              strokeDasharray={CIRC} strokeDashoffset={CIRC - (SWEEP / 360) * CIRC} strokeLinecap="round" />
            <circle cx="100" cy="100" r={R} fill="none" stroke={gaugeStroke} strokeWidth="13"
              strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.12s ease-out, stroke 0.25s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 6 }}>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>{phaseLabel[phase]}</div>
            <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: "#f1f5f9" }}>{displayMbps}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>Mbps</div>
          </div>
        </div>

        {/* Button / progress */}
        {phase === "idle" || phase === "done" ? (
          <div style={{ textAlign: "center" }}>
            <button onClick={start} style={{
              background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", border: "none", borderRadius: 999,
              padding: "14px 44px", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5,
              boxShadow: "0 4px 20px rgba(37,99,235,0.35)", WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              {phase === "done" ? "↺ Uji Ulang" : "▶ MULAI"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ height: 5, background: "#1e293b", borderRadius: 99, overflow: "hidden", margin: "0 8px" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: phase === "upload" ? "#a78bfa" : "#4ade80", borderRadius: 99, transition: "width 0.15s linear" }} />
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 8 }}>
              {phase === "ping" && "Mengukur latensi..."}
              {phase === "download" && "Mengukur kecepatan download..."}
              {phase === "upload" && "Mengukur kecepatan upload..."}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 18 }}>
          Server: Vercel CDN · Nearest Edge
        </div>
      </div>

      {phase === "done" && category && (
        <div style={{ marginTop: 12, padding: "14px 16px", background: category.bg, borderRadius: 12, borderLeft: `4px solid ${category.color}` }}>
          <div style={{ fontWeight: 700, color: category.color, marginBottom: 4 }}>{category.label}</div>
          <div style={{ fontSize: 13, color: "#374151" }}>{category.text}</div>
        </div>
      )}

      <div style={{ marginTop: 10, padding: "12px 16px", background: "#f8fafc", borderRadius: 12, fontSize: 13, color: "#475569" }}>
        <strong style={{ color: "#0f172a", display: "block", marginBottom: 6 }}>💡 Acuan kecepatan</strong>
        <div>≥50 Mbps — 4K + gaming + WFH sekeluarga</div>
        <div>20–49 Mbps — streaming HD, browsing normal</div>
        <div style={{ color: "#dc2626" }}>&lt;20 Mbps — kurang ideal untuk keluarga aktif</div>
      </div>
    </div>
  );
}
