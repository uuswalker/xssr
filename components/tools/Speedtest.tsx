"use client";

import { useState, useRef, useCallback } from "react";
import { Activity, Download, Upload, Server, Play, RotateCcw } from "lucide-react";

export default function Speedtest() {
  const [status, setStatus] = useState<"idle" | "ping" | "download" | "upload" | "done">("idle");
  const [ping, setPing] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

  // Deteksi apakah ReadableStream.getReader() benar-benar bisa streaming di browser ini
  // Mobile Chrome / Samsung Internet kadang return body sekaligus, bukan chunk-by-chunk
  const supportsStreaming = useCallback((): boolean => {
    try {
      return (
        typeof ReadableStream !== "undefined" &&
        typeof ReadableStream.prototype.getReader === "function"
      );
    } catch {
      return false;
    }
  }, []);

  // ── Ping ─────────────────────────────────────────────────────────────────
  const testPing = async (): Promise<number> => {
    const samples: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t = now();
      try {
        await fetch(
          `https://speed.cloudflare.com/__down?bytes=0&r=${Math.random()}`,
          { method: "HEAD", cache: "no-store" }
        );
        samples.push(now() - t);
      } catch {
        // abaikan
      }
      if (i < 4) await new Promise((r) => setTimeout(r, 100));
    }
    if (!samples.length) return 0;
    samples.sort((a, b) => a - b);
    // Buang tertinggi, ambil median
    const trimmed = samples.slice(0, Math.max(1, samples.length - 1));
    return Math.round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length);
  };

  // ── Download — metode adaptif ─────────────────────────────────────────
  const testDownload = async (
    durationMs: number,
    onProgress: (mbps: number, pct: number) => void
  ): Promise<number> => {
    const controller = new AbortController();
    abortRef.current = controller;
    const start = now();
    let totalBytes = 0;
    let peakMbps = 0;
    const samples: { t: number; b: number }[] = [];

    const calcMbps = (bytes: number, elapsedMs: number) =>
      (bytes * 8) / (elapsedMs / 1000) / 1_000_000;

    const tick = (addedBytes: number) => {
      totalBytes += addedBytes;
      const elapsed = now() - start;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      const mbps = calcMbps(totalBytes, elapsed);
      samples.push({ t: elapsed, b: totalBytes });
      if (mbps > peakMbps) peakMbps = mbps;
      onProgress(mbps, pct);
    };

    const deadline = start + durationMs;

    // Coba streaming dulu
    const useStream = supportsStreaming();

    const fetchOnce = async (bytes: number) => {
      if (now() >= deadline || controller.signal.aborted) return;
      try {
        const res = await fetch(
          `https://speed.cloudflare.com/__down?bytes=${bytes}&r=${Math.random()}`,
          { cache: "no-store", signal: controller.signal }
        );
        if (useStream && res.body) {
          const reader = res.body.getReader();
          while (now() < deadline) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) tick(value.length);
          }
          try { reader.cancel(); } catch { /* ignore */ }
        } else {
          // Fallback: baca sekaligus (mobile yang tidak support chunked read)
          const buf = await res.arrayBuffer();
          tick(buf.byteLength);
        }
      } catch {
        // abort normal
      }
    };

    // Paralel 4 koneksi untuk saturasi bandwidth, tiap 10 MB
    while (now() < deadline) {
      const remaining = deadline - now();
      if (remaining < 100) break;
      await Promise.race([
        Promise.all([
          fetchOnce(10_000_000),
          fetchOnce(10_000_000),
          fetchOnce(10_000_000),
          fetchOnce(10_000_000),
        ]),
        new Promise((r) => setTimeout(r, remaining)),
      ]);
    }
    controller.abort();

    // Rata-rata dari 75% sampel terakhir (skip warm-up awal)
    if (samples.length < 2) return peakMbps;
    const skip = Math.floor(samples.length * 0.25);
    const tail = samples.slice(skip);
    const finalBytes = tail[tail.length - 1].b - tail[0].b;
    const finalMs = tail[tail.length - 1].t - tail[0].t;
    return finalMs > 0 ? calcMbps(finalBytes, finalMs) : peakMbps;
  };

  // ── Upload — XHR dengan fallback untuk mobile ─────────────────────────
  const testUpload = async (
    durationMs: number,
    onProgress: (mbps: number, pct: number) => void
  ): Promise<number> => {
    const start = now();
    let totalBytes = 0;
    let active = true;
    let peakMbps = 0;
    const samples: { t: number; b: number }[] = [];

    // Stop setelah durationMs
    const stopTimer = setTimeout(() => { active = false; }, durationMs);

    // Chunk 1 MB — ramah untuk mobile
    const CHUNK = 1_000_000;
    const payload = new Uint8Array(CHUNK);

    const calcMbps = (bytes: number, elapsedMs: number) =>
      (bytes * 8) / (elapsedMs / 1000) / 1_000_000;

    const uploadOne = (): Promise<void> =>
      new Promise((resolve) => {
        if (!active) return resolve();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://speed.cloudflare.com/__up?r=${Math.random()}`);
        xhr.timeout = Math.max(500, durationMs - (now() - start) + 1000);

        // onprogress: di mobile ini kadang tidak triggered → pakai onload sebagai fallback
        let lastLoaded = 0;
        xhr.upload.onprogress = (e) => {
          if (!active) { xhr.abort(); return resolve(); }
          const added = e.loaded - lastLoaded;
          lastLoaded = e.loaded;
          totalBytes += added;
          const elapsed = now() - start;
          const mbps = calcMbps(totalBytes, elapsed);
          if (mbps > peakMbps) peakMbps = mbps;
          samples.push({ t: elapsed, b: totalBytes });
          onProgress(mbps, Math.min(100, (elapsed / durationMs) * 100));
        };

        xhr.upload.onload = () => {
          // Fallback: jika onprogress tidak fired, hitung dari total
          if (lastLoaded === 0) {
            totalBytes += CHUNK;
            const elapsed = now() - start;
            const mbps = calcMbps(totalBytes, elapsed);
            if (mbps > peakMbps) peakMbps = mbps;
            samples.push({ t: elapsed, b: totalBytes });
            onProgress(mbps, Math.min(100, (elapsed / durationMs) * 100));
          }
          resolve();
        };

        xhr.onload = resolve;
        xhr.onerror = resolve;
        xhr.ontimeout = resolve;
        xhr.onabort = resolve;

        xhr.send(new Blob([payload]));
      });

    // Upload serial (mobile bandwidthnya terbatas, paralel tidak perlu)
    while (active) {
      await uploadOne();
      if (!active) break;
      // Kecil delay antar request agar tidak spam
      await new Promise((r) => setTimeout(r, 50));
    }
    clearTimeout(stopTimer);

    if (samples.length < 2) return peakMbps;
    const skip = Math.floor(samples.length * 0.25);
    const tail = samples.slice(skip);
    if (tail.length < 2) return peakMbps;
    const finalBytes = tail[tail.length - 1].b - tail[0].b;
    const finalMs = tail[tail.length - 1].t - tail[0].t;
    return finalMs > 0 ? calcMbps(finalBytes, finalMs) : peakMbps;
  };

  // ── Main runner ──────────────────────────────────────────────────────────
  const runTest = async () => {
    setStatus("ping");
    setPing(null); setDownload(null); setUpload(null);
    setCurrentSpeed(0); setProgress(0);

    try {
      // 1. Ping
      const pingMs = await testPing();
      setPing(pingMs);

      // 2. Download (8 detik)
      setStatus("download");
      setProgress(0);
      const dlResult = await testDownload(8000, (mbps, pct) => {
        setCurrentSpeed(mbps);
        setDownload(mbps);
        setProgress(pct);
      });
      setDownload(dlResult);
      setCurrentSpeed(0);

      // 3. Upload (8 detik)
      setStatus("upload");
      setProgress(0);
      const ulResult = await testUpload(8000, (mbps, pct) => {
        setCurrentSpeed(mbps);
        setUpload(mbps);
        setProgress(pct);
      });
      setUpload(ulResult);
      setCurrentSpeed(0);

      setStatus("done");
      setProgress(100);
    } catch (e) {
      console.error("Speedtest fatal:", e);
      setStatus("done");
    }
  };

  const fmt = (n: number | null) => (n === null ? "--" : n < 10 ? n.toFixed(2) : n.toFixed(1));

  // ── Gauge SVG ────────────────────────────────────────────────────────────
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const maxSpeed = 200;
  const speedRatio = Math.min(Math.max(currentSpeed / maxSpeed, 0), 1);
  const sweepAngle = 260;
  const dashoffset = circumference - speedRatio * (sweepAngle / 360) * circumference;
  const gaugeColor =
    status === "download" ? "#22c55e" : status === "upload" ? "#8b5cf6" : "#06b6d4";

  const statusLabel = {
    idle: "Siap Tes",
    ping: "Ping...",
    download: "Download",
    upload: "Upload",
    done: "Selesai",
  }[status];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <p style={{ marginBottom: 20, fontSize: 15, color: "#4b5563", padding: "0 10px" }}>
        Tes kecepatan internet nyata — akurat di semua perangkat, termasuk HP.
      </p>

      <div
        style={{
          background: "#0f172a",
          borderRadius: 24,
          padding: "30px 20px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Stat row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          {[
            { icon: <Activity size={16} color="#06b6d4" />, label: "PING", value: ping === null ? "--" : `${ping}`, unit: "ms" },
            { icon: <Download size={16} color="#22c55e" />, label: "DOWNLOAD", value: status === "done" ? fmt(download) : status === "download" ? fmt(currentSpeed) : fmt(download), unit: "Mbps" },
            { icon: <Upload size={16} color="#8b5cf6" />, label: "UPLOAD", value: status === "done" ? fmt(upload) : status === "upload" ? fmt(currentSpeed) : fmt(upload), unit: "Mbps" },
          ].map(({ icon, label, value, unit }) => (
            <div key={label} style={{ textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>
                {icon} {label}
              </div>
              <div style={{ fontSize: 24, fontWeight: "bold" }}>
                {value} <span style={{ fontSize: 12, fontWeight: "normal", color: "#94a3b8" }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gauge */}
        <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto 20px auto" }}>
          <svg width="260" height="260" viewBox="0 0 200 200" style={{ transform: "rotate(140deg)" }}>
            <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (sweepAngle / 360) * circumference}
              strokeLinecap="round" />
            <circle cx="100" cy="100" r={radius} fill="transparent" stroke={gaugeColor} strokeWidth="12"
              strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.15s ease-out, stroke 0.3s ease" }} />
          </svg>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 10 }}>
            <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{statusLabel}</div>
            <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
              {status === "done" ? fmt(download) : fmt(currentSpeed)}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Mbps</div>
          </div>
        </div>

        {/* Button / progress */}
        {status === "idle" || status === "done" ? (
          <button
            onClick={runTest}
            style={{
              background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
              color: "#fff", border: "none", borderRadius: 999,
              padding: "16px 40px", fontSize: 18, fontWeight: 700, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 10,
              boxShadow: "0 10px 15px -3px rgba(37,99,235,.3)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {status === "done" ? <RotateCcw size={20} /> : <Play size={20} />}
            {status === "done" ? "Uji Ulang" : "MULAI"}
          </button>
        ) : (
          <div style={{ height: 55, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "80%", height: 6, background: "#1e293b", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: status === "download" ? "#22c55e" : "#8b5cf6", transition: "width 0.15s linear" }} />
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 13, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Server size={14} /> Server: Cloudflare Edge Network (Solo/Jakarta)
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#f8fafc", borderRadius: 12, textAlign: "left", fontSize: 14, color: "#334155" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: 16, color: "#0f172a" }}>💡 Panduan Hasil Uji:</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}><strong>Cepat (50+ Mbps):</strong> Lancar streaming 4K dan main game sekeluarga.</li>
          <li style={{ marginBottom: 6 }}><strong>Sedang (20–49 Mbps):</strong> Cukup untuk browsing dan streaming HD.</li>
          <li><strong>Lambat (&lt;20 Mbps):</strong> Saatnya beralih ke internet fiber optik XL SATU!</li>
        </ul>
      </div>
    </div>
  );
}
