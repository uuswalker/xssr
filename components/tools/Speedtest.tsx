"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Activity, Download, Upload, Server, Play, RotateCcw } from "lucide-react";

export default function Speedtest() {
  const [status, setStatus] = useState<"idle" | "ping" | "download" | "upload" | "done">("idle");
  const [ping, setPing] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0); // 0 to 100

  // The actual test execution
  const runTest = async () => {
    setStatus("ping");
    setPing(null); setDownload(null); setUpload(null);
    setCurrentSpeed(0); setProgress(0);

    try {
      // 1. PING TEST
      let pingSum = 0;
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        await fetch(`/?ping=${Math.random()}`, { method: "HEAD", cache: "no-store" });
        pingSum += (performance.now() - start);
      }
      setPing(Math.round(pingSum / 3));

      // 2. DOWNLOAD TEST
      setStatus("download");
      setProgress(0);
      let dlBytes = 0;
      const dlStart = performance.now();
      let lastDlReport = dlStart;
      
      // Menggunakan Cloudflare CDN untuk beban ringan dan no-cors issues
      const res = await fetch(`https://speed.cloudflare.com/__down?bytes=15000000&r=${Math.random()}`, { cache: "no-store" });
      if (res.body) {
        const reader = res.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) dlBytes += value.length;

          const now = performance.now();
          if (now - lastDlReport > 100) { // update UI setiap 100ms
            const duration = (now - dlStart) / 1000;
            const speed = (dlBytes * 8 / duration) / 1000000;
            setCurrentSpeed(speed);
            setDownload(speed);
            setProgress(Math.min(100, (duration / 5) * 100)); // asumsi 5 detik max test
            lastDlReport = now;
          }
        }
      }
      const dlDuration = (performance.now() - dlStart) / 1000;
      setDownload((dlBytes * 8 / dlDuration) / 1000000);
      setCurrentSpeed(0);

      // 3. UPLOAD TEST
      setStatus("upload");
      setProgress(0);
      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://speed.cloudflare.com/__up?r=${Math.random()}`);
        const payload = new Blob([new Uint8Array(5000000)]); // 5MB payload
        const ulStart = performance.now();
        let lastUlReport = ulStart;

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const now = performance.now();
            if (now - lastUlReport > 100) {
              const duration = (now - ulStart) / 1000;
              const speed = (e.loaded * 8 / duration) / 1000000;
              setCurrentSpeed(speed);
              setUpload(speed);
              setProgress(Math.min(100, (e.loaded / e.total) * 100));
              lastUlReport = now;
            }
          }
        };

        xhr.onload = () => {
          const duration = (performance.now() - ulStart) / 1000;
          setUpload((payload.size * 8 / duration) / 1000000);
          setCurrentSpeed(0);
          resolve();
        };
        xhr.onerror = () => resolve();
        xhr.send(payload);
      });

      setStatus("done");
      setProgress(100);

    } catch (e) {
      console.error("Test failed", e);
      setStatus("done");
    }
  };

  // Helper untuk format angka
  const fmt = (n: number | null) => (n === null ? "--" : n.toFixed(1));

  // Animasi Gauge SVG
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  // Speed max di gauge: 100 Mbps (kalau lebih, tetap full)
  const maxSpeed = 100;
  const speedRatio = Math.min(Math.max(currentSpeed / maxSpeed, 0), 1);
  // Gauge path dari -240 deg ke 60 deg (300 degree sweep)
  const sweepAngle = 260; 
  const dashoffset = circumference - (speedRatio * (sweepAngle / 360) * circumference);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <p style={{ marginBottom: 20, fontSize: 15, color: "#4b5563", padding: "0 10px" }}>
        Versi Lokal 100% Native. Tanpa Iframe, Bebas Blokir, Ringan di HP.
      </p>

      <div style={{ 
        background: "#0f172a", 
        borderRadius: 24, 
        padding: "30px 20px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Top Stats Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>
              <Activity size={16} color="#06b6d4" /> PING
            </div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>{ping === null ? "--" : ping} <span style={{ fontSize: 12, fontWeight: "normal", color: "#94a3b8" }}>ms</span></div>
          </div>
          
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>
              <Download size={16} color="#22c55e" /> DOWNLOAD
            </div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>{fmt(download)} <span style={{ fontSize: 12, fontWeight: "normal", color: "#94a3b8" }}>Mbps</span></div>
          </div>

          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>
              <Upload size={16} color="#8b5cf6" /> UPLOAD
            </div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>{fmt(upload)} <span style={{ fontSize: 12, fontWeight: "normal", color: "#94a3b8" }}>Mbps</span></div>
          </div>
        </div>

        {/* Circular Speedometer */}
        <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto 20px auto" }}>
          {/* Background Track */}
          <svg width="260" height="260" viewBox="0 0 200 200" style={{ transform: "rotate(140deg)" }}>
            <circle
              cx="100" cy="100" r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - ((sweepAngle / 360) * circumference)}
              strokeLinecap="round"
            />
            {/* Active Track */}
            <circle
              cx="100" cy="100" r={radius}
              fill="transparent"
              stroke={status === "download" ? "#22c55e" : status === "upload" ? "#8b5cf6" : "#06b6d4"}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.1s ease-out, stroke 0.3s ease" }}
            />
          </svg>
          
          {/* Central Speed Display */}
          <div style={{ 
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            paddingTop: 10
          }}>
            <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              {status === "idle" ? "Siap Tes" : status === "ping" ? "Ping..." : status === "download" ? "Download" : status === "upload" ? "Upload" : "Selesai"}
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
              {status === "done" ? fmt(download) : fmt(currentSpeed)}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
              Mbps
            </div>
          </div>
        </div>

        {/* Action Button */}
        {status === "idle" || status === "done" ? (
          <button 
            onClick={runTest}
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "16px 40px",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
              transition: "transform 0.2s"
            }}
          >
            {status === "done" ? <RotateCcw size={20} /> : <Play size={20} />}
            {status === "done" ? "Uji Ulang" : "MULAI"}
          </button>
        ) : (
          <div style={{ height: 55, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "80%", height: 6, background: "#1e293b", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: status === "download" ? "#22c55e" : "#8b5cf6", transition: "width 0.1s linear" }} />
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 13, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Server size={14} /> Server Lokal: Cloudflare Edge Network (Solo/Jakarta)
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 16, background: "#f8fafc", borderRadius: 12, textAlign: "left", fontSize: 14, color: "#334155" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: 16, color: "#0f172a" }}>💡 Panduan Hasil Uji:</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}><strong>Cepat (50+ Mbps):</strong> Lancar streaming 4K dan main game sekeluarga.</li>
          <li style={{ marginBottom: 6 }}><strong>Sedang (20-49 Mbps):</strong> Cukup untuk browsing dan streaming HD.</li>
          <li><strong>Lambat (&lt; 20 Mbps):</strong> Saatnya beralih ke internet fiber optik XL SATU!</li>
        </ul>
      </div>
    </div>
  );
}
