"use client";

import { useState, useRef } from "react";

type Phase = "idle" | "ping" | "download" | "upload" | "done";

export default function Speedtest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [dlSpeed, setDlSpeed] = useState<number | null>(null);
  const [ulSpeed, setUlSpeed] = useState<number | null>(null);
  const [liveSpeed, setLiveSpeed] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const stopped = useRef(false);

  const ts = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

  // ─── PING ────────────────────────────────────────────────────────────────
  const runPing = async (): Promise<{ avg: number; jitter: number }> => {
    const results: number[] = [];
    for (let i = 0; i < 8; i++) {
      try {
        const t = ts();
        await fetch(`https://speed.cloudflare.com/__down?bytes=0&_=${Math.random()}`, {
          method: "HEAD",
          cache: "no-store",
        });
        results.push(ts() - t);
      } catch {
        // skip
      }
      await new Promise((r) => setTimeout(r, 60));
    }
    if (!results.length) return { avg: 0, jitter: 0 };
    results.sort((a, b) => a - b);
    const trimmed = results.slice(1, results.length - 1); // buang min dan max
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    const jit = trimmed.reduce((a, b) => a + Math.abs(b - avg), 0) / trimmed.length;
    return { avg: Math.round(avg), jitter: Math.round(jit) };
  };

  // ─── DOWNLOAD ─────────────────────────────────────────────────────────────
  // Pakai XHR dengan responseType blob — paling compatible di semua mobile browser
  const runDownload = (durationMs: number): Promise<number> => {
    return new Promise((resolve) => {
      stopped.current = false;
      const deadline = ts() + durationMs;
      let totalBytes = 0;
      const samples: { t: number; b: number }[] = [{ t: 0, b: 0 }];
      let completed = false;

      const finish = () => {
        if (completed) return;
        completed = true;
        stopped.current = true;
        // Hasil dari 40%-100% durasi (skip warm-up)
        const cutoff = durationMs * 0.4;
        const tail = samples.filter((s) => s.t >= cutoff);
        if (tail.length >= 2) {
          const dB = tail[tail.length - 1].b - tail[0].b;
          const dT = tail[tail.length - 1].t - tail[0].t;
          resolve(dT > 0 ? (dB * 8) / (dT / 1000) / 1e6 : 0);
        } else {
          const last = samples[samples.length - 1];
          resolve(last.t > 0 ? (last.b * 8) / (last.t / 1000) / 1e6 : 0);
        }
      };

      const doFetch = () => {
        if (stopped.current || ts() >= deadline) return finish();
        const remaining = deadline - ts();
        const xhr = new XMLHttpRequest();
        // 20MB chunk — cukup besar untuk saturasi
        xhr.open("GET", `https://speed.cloudflare.com/__down?bytes=20000000&_=${Math.random()}`, true);
        xhr.responseType = "blob";
        xhr.timeout = remaining + 3000;

        let lastBytes = 0;
        xhr.onprogress = (e) => {
          if (stopped.current) { xhr.abort(); return; }
          const elapsed = ts() - (deadline - durationMs);
          const delta = e.loaded - lastBytes;
          lastBytes = e.loaded;
          totalBytes += delta;
          const lastS = samples[samples.length - 1];
          if (elapsed - lastS.t > 150) {
            samples.push({ t: elapsed, b: totalBytes });
            const dB = totalBytes - lastS.b;
            const dT = elapsed - lastS.t;
            const mbps = dT > 0 ? (dB * 8) / (dT / 1000) / 1e6 : 0;
            setLiveSpeed(mbps);
            setDlSpeed(mbps);
            setProgress(Math.min(98, (elapsed / durationMs) * 100));
          }
          if (ts() >= deadline) { xhr.abort(); finish(); }
        };

        xhr.onload = () => {
          if (stopped.current) return finish();
          const elapsed = ts() - (deadline - durationMs);
          if (xhr.response) {
            // Kalau onprogress tidak fired (mobile), hitung dari total
            if (lastBytes === 0) {
              totalBytes += (xhr.response as Blob).size;
              samples.push({ t: elapsed, b: totalBytes });
              const mbps = (totalBytes * 8) / (elapsed / 1000) / 1e6;
              setLiveSpeed(mbps);
              setDlSpeed(mbps);
            }
          }
          if (ts() < deadline) {
            doFetch(); // loop sampai waktu habis
          } else {
            finish();
          }
        };

        xhr.onerror = () => { if (ts() < deadline) setTimeout(doFetch, 200); else finish(); };
        xhr.ontimeout = finish;
        xhr.onabort = () => { if (!stopped.current && ts() < deadline) doFetch(); else finish(); };
        xhr.send();
      };

      // Stop paksa setelah durationMs
      setTimeout(finish, durationMs + 500);
      doFetch();
    });
  };

  // ─── UPLOAD ───────────────────────────────────────────────────────────────
  const runUpload = (durationMs: number): Promise<number> => {
    return new Promise((resolve) => {
      stopped.current = false;
      const deadline = ts() + durationMs;
      let totalBytes = 0;
      const samples: { t: number; b: number }[] = [{ t: 0, b: 0 }];
      let completed = false;

      const finish = () => {
        if (completed) return;
        completed = true;
        stopped.current = true;
        const cutoff = durationMs * 0.4;
        const tail = samples.filter((s) => s.t >= cutoff);
        if (tail.length >= 2) {
          const dB = tail[tail.length - 1].b - tail[0].b;
          const dT = tail[tail.length - 1].t - tail[0].t;
          resolve(dT > 0 ? (dB * 8) / (dT / 1000) / 1e6 : 0);
        } else {
          const last = samples[samples.length - 1];
          resolve(last.t > 0 ? (last.b * 8) / (last.t / 1000) / 1e6 : 0);
        }
      };

      // 1.5MB payload — optimal untuk mobile
      const CHUNK = 1_500_000;
      const blob = new Blob([new Uint8Array(CHUNK)]);

      const doUpload = () => {
        if (stopped.current || ts() >= deadline) return finish();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://speed.cloudflare.com/__up?_=${Math.random()}`, true);
        xhr.timeout = (deadline - ts()) + 3000;

        let lastLoaded = 0;

        const onProgress = (loaded: number) => {
          const delta = loaded - lastLoaded;
          lastLoaded = loaded;
          totalBytes += delta;
          const elapsed = ts() - (deadline - durationMs);
          const lastS = samples[samples.length - 1];
          if (elapsed - lastS.t > 150) {
            samples.push({ t: elapsed, b: totalBytes });
            const dB = totalBytes - lastS.b;
            const dT = elapsed - lastS.t;
            const mbps = dT > 0 ? (dB * 8) / (dT / 1000) / 1e6 : 0;
            setLiveSpeed(mbps);
            setUlSpeed(mbps);
            setProgress(Math.min(98, (elapsed / durationMs) * 100));
          }
          if (ts() >= deadline) { xhr.abort(); finish(); }
        };

        xhr.upload.onprogress = (e) => {
          if (stopped.current) { xhr.abort(); return; }
          onProgress(e.loaded);
        };

        // Fallback: mobile yang tidak fire onprogress
        xhr.upload.onload = () => {
          if (lastLoaded === 0) onProgress(CHUNK);
        };

        xhr.onload = () => {
          if (stopped.current) return finish();
          if (ts() < deadline) doUpload();
          else finish();
        };
        xhr.onerror = () => { if (ts() < deadline) setTimeout(doUpload, 300); else finish(); };
        xhr.ontimeout = finish;
        xhr.onabort = () => { if (!stopped.current && ts() < deadline) doUpload(); else finish(); };
        xhr.send(blob);
      };

      setTimeout(finish, durationMs + 500);
      doUpload();
    });
  };

  // ─── MAIN ─────────────────────────────────────────────────────────────────
  const start = async () => {
    stopped.current = false;
    setPing(null); setJitter(null);
    setDlSpeed(null); setUlSpeed(null);
    setLiveSpeed(0); setProgress(0);

    // Ping
    setPhase("ping");
    const { avg, jitter: jit } = await runPing();
    setPing(avg);
    setJitter(jit);

    // Download
    setPhase("download");
    setLiveSpeed(0); setProgress(0);
    const dl = await runDownload(8000);
    setDlSpeed(dl);
    setLiveSpeed(0);

    // Upload
    setPhase("upload");
    setLiveSpeed(0); setProgress(0);
    const ul = await runUpload(8000);
    setUlSpeed(ul);
    setLiveSpeed(0);

    setProgress(100);
    setPhase("done");
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  const fmt = (n: number | null) =>
    n === null ? "–" : n < 10 ? n.toFixed(2) : n.toFixed(1);

  const displayMbps = phase === "done" ? fmt(dlSpeed) : fmt(liveSpeed);

  // Gauge
  const R = 88;
  const CIRC = 2 * Math.PI * R;
  const SWEEP = 250; // derajat arc
  const ratio = Math.min(Math.max(liveSpeed / 200, 0), 1);
  const offset = CIRC - ratio * (SWEEP / 360) * CIRC;
  const gaugeStroke =
    phase === "upload" ? "#a78bfa" : phase === "download" ? "#4ade80" : "#38bdf8";

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
      ? { label: "✅ Cepat", color: "#16a34a", bg: "#f0fdf4", text: "Lancar untuk streaming 4K, gaming, dan WFH sekeluarga." }
      : dlSpeed >= 20
      ? { label: "⚡ Sedang", color: "#d97706", bg: "#fffbeb", text: "Cukup untuk streaming HD dan browsing, tapi bisa lebih baik." }
      : { label: "🐢 Lambat", color: "#dc2626", bg: "#fef2f2", text: "Kurang ideal untuk keluarga aktif. Pertimbangkan XL SATU Fiber Optik!" };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", fontFamily: "system-ui, sans-serif", padding: "0 4px" }}>

      {/* Card utama */}
      <div style={{
        background: "#0f172a", borderRadius: 20, padding: "28px 20px 24px",
        color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}>

        {/* Stats row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, padding: "0 4px" }}>
          {/* Ping */}
          <div>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Ping</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {ping === null ? "–" : ping}
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}> ms</span>
            </div>
            {jitter !== null && (
              <div style={{ fontSize: 11, color: "#475569" }}>±{jitter}ms</div>
            )}
          </div>
          {/* Download */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#4ade80", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>↓ Download</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {phase === "done" ? fmt(dlSpeed) : phase === "download" ? fmt(liveSpeed) : fmt(dlSpeed)}
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}> Mbps</span>
            </div>
          </div>
          {/* Upload */}
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
            {/* Track */}
            <circle cx="100" cy="100" r={R} fill="none" stroke="#1e293b" strokeWidth="13"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - (SWEEP / 360) * CIRC}
              strokeLinecap="round" />
            {/* Fill */}
            <circle cx="100" cy="100" r={R} fill="none" stroke={gaugeStroke} strokeWidth="13"
              strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.12s ease-out, stroke 0.25s" }} />
          </svg>
          {/* Center label */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            paddingTop: 6,
          }}>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>
              {phaseLabel[phase]}
            </div>
            <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: "#f1f5f9" }}>
              {displayMbps}
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>Mbps</div>
          </div>
        </div>

        {/* Button / progress bar */}
        {phase === "idle" || phase === "done" ? (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={start}
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                color: "#fff", border: "none", borderRadius: 999,
                padding: "14px 44px", fontSize: 16, fontWeight: 700,
                cursor: "pointer", letterSpacing: 0.5,
                boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              {phase === "done" ? "↺ Uji Ulang" : "▶ MULAI"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ height: 5, background: "#1e293b", borderRadius: 99, overflow: "hidden", margin: "0 8px" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: phase === "upload" ? "#a78bfa" : "#4ade80",
                borderRadius: 99,
                transition: "width 0.15s linear",
              }} />
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 8 }}>
              {phase === "ping" && "Mengukur latensi..."}
              {phase === "download" && "Mengukur kecepatan download..."}
              {phase === "upload" && "Mengukur kecepatan upload..."}
            </div>
          </div>
        )}

        {/* Server info */}
        <div style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 18 }}>
          Server: Cloudflare Edge · Jakarta / Singapore
        </div>
      </div>

      {/* Hasil kategori */}
      {phase === "done" && category && (
        <div style={{
          marginTop: 12, padding: "14px 16px",
          background: category.bg, borderRadius: 12,
          borderLeft: `4px solid ${category.color}`,
        }}>
          <div style={{ fontWeight: 700, color: category.color, marginBottom: 4 }}>{category.label}</div>
          <div style={{ fontSize: 13, color: "#374151" }}>{category.text}</div>
        </div>
      )}

      {/* Acuan */}
      <div style={{ marginTop: 10, padding: "12px 16px", background: "#f8fafc", borderRadius: 12, fontSize: 13, color: "#475569" }}>
        <strong style={{ color: "#0f172a", display: "block", marginBottom: 6 }}>💡 Acuan kecepatan</strong>
        <div>≥50 Mbps — 4K + gaming + WFH sekeluarga</div>
        <div>20–49 Mbps — streaming HD, browsing normal</div>
        <div style={{ color: "#dc2626" }}>&lt;20 Mbps — kurang ideal untuk keluarga aktif</div>
      </div>
    </div>
  );
}
