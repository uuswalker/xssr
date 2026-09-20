"use client";

import { useState, useRef } from "react";
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

    const TEST_DURATION = 8000; // Durasi fix 8 detik (seperti Ookla) untuk kestabilan grafik

    try {
      // ==========================================
      // 1. PING TEST
      // ==========================================
      let pingSum = 0;
      let pingCount = 0;
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        try {
          await fetch(`https://speed.cloudflare.com/__down?bytes=0&r=${Math.random()}`, { method: "HEAD", cache: "no-store" });
          pingSum += (performance.now() - start);
          pingCount++;
        } catch (e) {
          // Abaikan error jaringan sementara
        }
      }
      setPing(pingCount > 0 ? Math.round(pingSum / pingCount) : 0);

      // ==========================================
      // 2. DOWNLOAD TEST
      // ==========================================
      setStatus("download");
      setProgress(0);
      let dlBytes = 0;
      let dlActive = true;
      const dlStart = performance.now();

      // Timer penghenti paksa setelah 8 detik
      const dlTimer = setTimeout(() => { dlActive = false; }, TEST_DURATION);

      while (dlActive) {
        try {
          const controller = new AbortController();
          const abortTimer = setTimeout(() => controller.abort(), TEST_DURATION - (performance.now() - dlStart) + 500);

          // Tarik data 10MB, jika selesai sebelum 8 detik, akan berulang (loop)
          const res = await fetch(`https://speed.cloudflare.com/__down?bytes=10000000&r=${Math.random()}`, { 
            cache: "no-store", 
            signal: controller.signal 
          });
          
          if (res.body) {
            const reader = res.body.getReader();
            while (dlActive) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) dlBytes += value.length;

              const now = performance.now();
              const elapsed = Math.max(10, now - dlStart); // Cegah devide by zero
              const speed = (dlBytes * 8 / (elapsed / 1000)) / 1000000;
              
              setCurrentSpeed(speed);
              setDownload(speed);
              setProgress(Math.min(100, (elapsed / TEST_DURATION) * 100));
            }
          }
          clearTimeout(abortTimer);
        } catch (e) {
          // Jika terjadi error (seperti abort timeout), tunggu 200ms agar tidak spam
          await new Promise(r => setTimeout(r, 200));
        }
      }
      clearTimeout(dlTimer);
      setCurrentSpeed(0);

      // ==========================================
      // 3. UPLOAD TEST
      // ==========================================
      setStatus("upload");
      setProgress(0);
      let ulBytes = 0;
      let ulActive = true;
      const ulStart = performance.now();

      // Timer penghenti paksa upload setelah 8 detik
      const ulTimer = setTimeout(() => { ulActive = false; }, TEST_DURATION);
      
      // Payload 1MB berulang agar ramah jaringan mobile (tidak putus)
      const chunkData = new Blob([new Uint8Array(1000000)]); 

      while (ulActive) {
        await new Promise<void>((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `https://speed.cloudflare.com/__up?r=${Math.random()}`);
          
          const timeRemaining = TEST_DURATION - (performance.now() - ulStart);
          const xhrTimeout = setTimeout(() => { 
            xhr.abort(); 
            resolve(); 
          }, Math.max(100, timeRemaining + 500));

          let lastLoaded = 0;
          xhr.upload.onprogress = (e) => {
            if (!ulActive) { 
              xhr.abort(); 
              resolve(); 
              return; 
            }
            if (e.lengthComputable) {
              const added = e.loaded - lastLoaded;
              ulBytes += added;
              lastLoaded = e.loaded;

              const now = performance.now();
              const elapsed = Math.max(10, now - ulStart);
              const speed = (ulBytes * 8 / (elapsed / 1000)) / 1000000;
              
              setCurrentSpeed(speed);
              setUpload(speed);
              setProgress(Math.min(100, (elapsed / TEST_DURATION) * 100));
            }
          };

          xhr.onload = () => { clearTimeout(xhrTimeout); resolve(); };
          xhr.onerror = () => { clearTimeout(xhrTimeout); resolve(); };
          xhr.send(chunkData);
        });
      }
      clearTimeout(ulTimer);

      // ==========================================
      // DONE
      // ==========================================
      setCurrentSpeed(0);
      setStatus("done");
      setProgress(100);

    } catch (e) {
      console.error("Test failed fatal error", e);
      setStatus("done");
    }
  };

  const fmt = (n: number | null) => (n === null ? "--" : n.toFixed(1));

  // Animasi Gauge SVG
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const maxSpeed = 150; // Skala max visual speedometer
  const speedRatio = Math.min(Math.max(currentSpeed / maxSpeed, 0), 1);
  const sweepAngle = 260; 
  const dashoffset = circumference - (speedRatio * (sweepAngle / 360) * circumference);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <p style={{ marginBottom: 20, fontSize: 15, color: "#4b5563", padding: "0 10px" }}>
        Versi Lokal 100% Native. Durasi akurat 16 detik untuk presisi tinggi di semua perangkat.
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
            <div style={{ fontSize: 24, fontWeight: "bold" }}>{status === "done" ? fmt(download) : (status === "download" ? fmt(currentSpeed) : fmt(download))} <span style={{ fontSize: 12, fontWeight: "normal", color: "#94a3b8" }}>Mbps</span></div>
          </div>

          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>
              <Upload size={16} color="#8b5cf6" /> UPLOAD
            </div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>{status === "done" ? fmt(upload) : (status === "upload" ? fmt(currentSpeed) : fmt(upload))} <span style={{ fontSize: 12, fontWeight: "normal", color: "#94a3b8" }}>Mbps</span></div>
          </div>
        </div>

        <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto 20px auto" }}>
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
