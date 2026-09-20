"use client";

import { useState, useRef } from "react";
import { Activity, Download, Upload, Server, Play, RotateCcw } from "lucide-react";

// LibreSpeed public servers — no CORS issue, work on all mobile browsers
const SERVERS = [
  { name: "Jakarta (IDC)", url: "https://bouygues.testdebit.info" },
  { name: "Singapore (Vultr)", url: "https://speedtest.singapore.linode.com" },
];

type Phase = "idle" | "ping" | "download" | "upload" | "done";

export default function Speedtest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [server, setServer] = useState("Cloudflare Edge (Jakarta/SG)");
  const stopRef = useRef(false);

  const now = () =>
    typeof performance !== "undefined" ? performance.now() : Date.now();

  // ── Ping via Cloudflare HEAD requests ───────────────────────────────────
  const runPing = async () => {
    const pings: number[] = [];
    for (let i = 0; i < 10; i++) {
      try {
        const t = now();
        await fetch(
          `https://speed.cloudflare.com/__down?bytes=0&r=${Math.random()}`,
          { method: "HEAD", cache: "no-store" }
        );
        pings.push(now() - t);
      } catch { /* skip */ }
      await new Promise((r) => setTimeout(r, 80));
    }
    if (!pings.length) return;
    pings.sort((a, b) => a - b);
    // Buang 2 tertinggi
    const trimmed = pings.slice(0, pings.length - 2);
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
    const jit = trimmed.reduce((acc, v) => acc + Math.abs(v - avg), 0) / trimmed.length;
    setPing(Math.round(avg));
    setJitter(Math.round(jit));
  };

  // ── Download via XHR (works on ALL mobile browsers, no streaming needed) ─
  const runDownload = async (durationMs: number): Promise<number> => {
    const start = now();
    let totalBytes = 0;
    stopRef.current = false;

    // Sliding window samples untuk hasil yang akurat
    const samples: { t: number; b: number }[] = [{ t: 0, b: 0 }];

    const fetchChunk = (): Promise<number> =>
      new Promise((resolve) => {
        if (stopRef.current) return resolve(0);
        const xhr = new XMLHttpRequest();
        // 25MB chunks — cukup besar untuk mengukur bandwidth tinggi
        xhr.open("GET", `https://speed.cloudflare.com/__down?bytes=25000000&r=${Math.random()}`);
        xhr.responseType = "arraybuffer";
        xhr.timeout = durationMs + 2000;

        xhr.onprogress = (e) => {
          if (stopRef.current) { xhr.abort(); return resolve(0); }
          if (e.loaded > 0) {
            const elapsed = now() - start;
            const newBytes = e.loaded;
            // Hitung delta dari sample terakhir
            const lastSample = samples[samples.length - 1];
            const deltaBytes = (totalBytes + newBytes) - lastSample.b;
            const deltaT = elapsed - lastSample.t;
            if (deltaT > 200) {
              samples.push({ t: elapsed, b: totalBytes + newBytes });
              const instantMbps = (deltaBytes * 8) / (deltaT / 1000) / 1_000_000;
              setCurrentSpeed(instantMbps);
              setDownload(instantMbps);
              setProgress(Math.min(99, (elapsed / durationMs) * 100));
            }
          }
        };

        xhr.onload = () => {
          if (xhr.response) {
            totalBytes += xhr.response.byteLength;
            samples.push({ t: now() - start, b: totalBytes });
          }
          resolve(totalBytes);
        };
        xhr.onerror = () => resolve(totalBytes);
        xhr.ontimeout = () => resolve(totalBytes);
        xhr.onabort = () => resolve(totalBytes);
        xhr.send();
      });

    // Stop paksa setelah durationMs
    const stopTimer = setTimeout(() => { stopRef.current = true; }, durationMs);

    // Loop fetch sampai waktu habis
    while (!stopRef.current && now() - start < durationMs) {
      await fetchChunk();
    }
    clearTimeout(stopTimer);
    stopRef.current = false;

    // Ambil rata-rata dari 50-100% durasi (skip warm-up)
    const half = durationMs * 0.5;
    const tail = samples.filter((s) => s.t >= half);
    if (tail.length >= 2) {
      const bytes = tail[tail.length - 1].b - tail[0].b;
      const ms = tail[tail.length - 1].t - tail[0].t;
      return ms > 0 ? (bytes * 8) / (ms / 1000) / 1_000_000 : 0;
    }
    // Fallback: semua data
    const totalMs = samples[samples.length - 1]?.t || 1;
    return (totalBytes * 8) / (totalMs / 1000) / 1_000_000;
  };

  // ── Upload via XHR dengan fallback onload ───────────────────────────────
  const runUpload = async (durationMs: number): Promise<number> => {
    const start = now();
    let totalBytes = 0;
    stopRef.current = false;
    const samples: { t: number; b: number }[] = [{ t: 0, b: 0 }];

    // 2MB chunks — optimal untuk mobile
    const CHUNK = 2_000_000;
    const payload = new Blob([new Uint8Array(CHUNK)]);

    const stopTimer = setTimeout(() => { stopRef.current = true; }, durationMs);

    const uploadOne = (): Promise<void> =>
      new Promise((resolve) => {
        if (stopRef.current) return resolve();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://speed.cloudflare.com/__up?r=${Math.random()}`);
        xhr.timeout = durationMs + 2000;

        let lastLoaded = 0;

        const updateSpeed = (loaded: number) => {
          const delta = loaded - lastLoaded;
          lastLoaded = loaded;
          totalBytes += delta;
          const elapsed = now() - start;
          const lastS = samples[samples.length - 1];
          if (elapsed - lastS.t > 200) {
            const deltaB = totalBytes - lastS.b;
            const deltaT = elapsed - lastS.t;
            samples.push({ t: elapsed, b: totalBytes });
            const mbps = (deltaB * 8) / (deltaT / 1000) / 1_000_000;
            setCurrentSpeed(mbps);
            setUpload(mbps);
            setProgress(Math.min(99, (elapsed / durationMs) * 100));
          }
        };

        xhr.upload.onprogress = (e) => {
          if (stopRef.current) { xhr.abort(); return resolve(); }
          updateSpeed(e.loaded);
        };

        // Fallback: mobile yang onprogress tidak fire → hitung dari onload
        xhr.upload.onload = () => {
          if (lastLoaded === 0) updateSpeed(CHUNK);
        };

        xhr.onload = resolve;
        xhr.onerror = resolve;
        xhr.ontimeout = resolve;
        xhr.onabort = resolve;
        xhr.send(payload);
      });

    while (!stopRef.current && now() - start < durationMs) {
      await uploadOne();
      if (!stopRef.current) await new Promise((r) => setTimeout(r, 30));
    }
    clearTimeout(stopTimer);
    stopRef.current = false;

    const half = durationMs * 0.5;
    const tail = samples.filter((s) => s.t >= half);
    if (tail.length >= 2) {
      const bytes = tail[tail.length - 1].b - tail[0].b;
      const ms = tail[tail.length - 1].t - tail[0].t;
      return ms > 0 ? (bytes * 8) / (ms / 1000) / 1_000_000 : 0;
    }
    const totalMs = samples[samples.length - 1]?.t || 1;
    return (totalBytes * 8) / (totalMs / 1000) / 1_000_000;
  };

  // ── Main ────────────────────────────────────────────────────────────────
  const runTest = async () => {
    stopRef.current = false;
    setPing(null); setJitter(null); setDownload(null); setUpload(null);
    setCurrentSpeed(0); setProgress(0);

    try {
      setPhase("ping");
      await runPing();

      setPhase("download");
      setCurrentSpeed(0); setProgress(0);
      const dl = await runDownload(8000);
      setDownload(dl);
      setCurrentSpeed(0);

      setPhase("upload");
      setCurrentSpeed(0); setProgress(0);
      const ul = await runUpload(8000);
      setUpload(ul);
      setCurrentSpeed(0);

      setProgress(100);
      setPhase("done");
    } catch (e) {
      console.error("Speedtest error:", e);
      setPhase("done");
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────
  const fmt = (n: number | null) =>
    n === null ? "--" : n < 10 ? n.toFixed(2) : n.toFixed(1);

  const radius = 90;
  const circ = 2 * Math.PI * radius;
  const sweep = 260;
  const ratio = Math.min(Math.max(currentSpeed / 200, 0), 1);
  const dashoffset = circ - ratio * (sweep / 360) * circ;
  const gaugeColor =
    phase === "download" ? "#22c55e" : phase === "upload" ? "#8b5cf6" : "#06b6d4";

  const label = { idle: "Siap Tes", ping: "Ping...", download: "Download", upload: "Upload", done: "Selesai" }[phase];

  const displaySpeed = phase === "done" ? fmt(download) : fmt(currentSpeed);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <p style={{ marginBottom: 20, fontSize: 15, color: "#4b5563", padding: "0 10px" }}>
        Tes kecepatan internet — akurat di semua perangkat termasuk HP.
      </p>

      <div style={{
        background: "#0f172a", borderRadius: 24, padding: "30px 20px",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,.1)", color: "#fff",
      }}>
        {/* Stats row */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 30, flexWrap: "wrap", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>
              <Activity size={14} color="#06b6d4" /> PING
            </div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>
              {ping === null ? "--" : ping}
              <span style={{ fontSize: 11, fontWeight: "normal", color: "#94a3b8" }}> ms</span>
            </div>
            {jitter !== null && (
              <div style={{ fontSize: 11, color: "#64748b" }}>±{jitter}ms jitter</div>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>
              <Download size={14} color="#22c55e" /> DOWNLOAD
            </div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>
              {phase === "done" ? fmt(download) : phase === "download" ? fmt(currentSpeed) : fmt(download)}
              <span style={{ fontSize: 11, fontWeight: "normal", color: "#94a3b8" }}> Mbps</span>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>
              <Upload size={14} color="#8b5cf6" /> UPLOAD
            </div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>
              {phase === "done" ? fmt(upload) : phase === "upload" ? fmt(currentSpeed) : fmt(upload)}
              <span style={{ fontSize: 11, fontWeight: "normal", color: "#94a3b8" }}> Mbps</span>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div style={{ position: "relative", width: 240, height: 240, margin: "0 auto 20px auto" }}>
          <svg width="240" height="240" viewBox="0 0 200 200" style={{ transform: "rotate(140deg)" }}>
            <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="14"
              strokeDasharray={circ} strokeDashoffset={circ - (sweep / 360) * circ} strokeLinecap="round" />
            <circle cx="100" cy="100" r={radius} fill="transparent" stroke={gaugeColor} strokeWidth="14"
              strokeDasharray={circ} strokeDashoffset={dashoffset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.1s ease-out, stroke 0.3s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1 }}>{displaySpeed}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Mbps</div>
          </div>
        </div>

        {/* Button / progress */}
        {phase === "idle" || phase === "done" ? (
          <button onClick={runTest} style={{
            background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
            color: "#fff", border: "none", borderRadius: 999,
            padding: "15px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 10,
            boxShadow: "0 10px 15px -3px rgba(37,99,235,.3)",
            WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
          }}>
            {phase === "done" ? <RotateCcw size={18} /> : <Play size={18} />}
            {phase === "done" ? "Uji Ulang" : "MULAI"}
          </button>
        ) : (
          <div style={{ height: 52, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: "75%", height: 6, background: "#1e293b", borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                width: `${progress}%`, height: "100%",
                background: phase === "download" ? "#22c55e" : "#8b5cf6",
                transition: "width 0.15s linear",
              }} />
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {phase === "download" ? "Mengukur kecepatan download..." : phase === "upload" ? "Mengukur kecepatan upload..." : "Mengukur ping..."}
            </div>
          </div>
        )}

        <div style={{ marginTop: 20, fontSize: 12, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Server size={12} /> Cloudflare Edge Network (Jakarta / Singapore)
        </div>
      </div>

      {/* Hasil & panduan */}
      {phase === "done" && download !== null && (
        <div style={{ marginTop: 16, padding: 16, background: download >= 50 ? "#f0fdf4" : download >= 20 ? "#fffbeb" : "#fef2f2", borderRadius: 12, textAlign: "left", fontSize: 14 }}>
          <strong style={{ fontSize: 15 }}>
            {download >= 50 ? "✅ Koneksi Cepat!" : download >= 20 ? "⚡ Koneksi Sedang" : "🐢 Koneksi Lambat"}
          </strong>
          <p style={{ margin: "6px 0 0", color: "#334155" }}>
            {download >= 50
              ? "Lancar untuk streaming 4K, video call, dan game online sekeluarga."
              : download >= 20
              ? "Cukup untuk browsing dan streaming HD, tapi bisa lebih baik."
              : "Kurang ideal untuk streaming. Saatnya pertimbangkan XL SATU Fiber Optik!"}
          </p>
        </div>
      )}

      <div style={{ marginTop: 12, padding: 16, background: "#f8fafc", borderRadius: 12, textAlign: "left", fontSize: 13, color: "#475569" }}>
        <strong style={{ color: "#0f172a" }}>💡 Acuan kecepatan:</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
          <li>≥50 Mbps — streaming 4K + gaming + WFH sekeluarga</li>
          <li>20–49 Mbps — streaming HD + browsing normal</li>
          <li>&lt;20 Mbps — kurang ideal untuk keluarga aktif</li>
        </ul>
      </div>
    </div>
  );
}
