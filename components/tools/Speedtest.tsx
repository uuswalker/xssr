"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gtag } from "@/lib/lead";

function fmt(n: number | null): string {
  if (n == null || isNaN(n)) return "-";
  return n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString();
}

function verdict(d: number | null): [string, string] | null {
  if (d == null) return null;
  if (d >= 100)
    return ["Ngebut 🚀 cukup untuk 4K multi-layar + WFH + gaming bareng.", "#e6f7f3"];
  if (d >= 50)
    return ["Lancar ⚡ cukup untuk streaming HD, WFH, dan gaming santai.", "#e6f7f3"];
  if (d >= 20)
    return ["Pas-pasan ⚠️ browsing oke, tapi 4K & multi-device bakal buffering.", "#fef3c7"];
  return ["Lemot untuk standar 2026 😭 waktunya upgrade atau pindah provider.", "#fee2e2"];
}

export default function Speedtest() {
  const [phase, setPhase] = useState("Siap");
  const [big, setBig] = useState("-");
  const [up, setUp] = useState("-");
  const [srv, setSrv] = useState("-");
  const [server, setServer] = useState("Tekan mulai untuk menguji jaringanmu.");
  const [running, setRunning] = useState(false);
  const [hasilHtml, setHasilHtml] = useState("");
  const [fill, setFill] = useState(0); // For the gauge circle

  const finalD = useRef<number | null>(null);
  const finalU = useRef<number | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const gagal = useCallback((msg: string) => {
    setRunning(false);
    setPhase("Gagal");
    setServer(msg);
    setFill(0);
  }, []);

  const tampilHasil = useCallback((d: number | null, u: number | null) => {
    const v = verdict(d);
    if (!v) return;
    setHasilHtml(
      `<div style="background:${v[1]};padding:16px;border-radius:12px;margin-top:24px;">` +
        `<strong style="display:block;margin-bottom:6px;font-size:16px;color:#1f2937;">Kesimpulan:</strong>` +
        `<p style="margin:0;font-size:14px;line-height:1.5;color:#374151;">${v[0]}</p>` +
        `</div>`
    );
  }, []);

  const runDownloadTest = useCallback((): Promise<number> => {
    return new Promise((resolve, reject) => {
      setPhase("Download...");
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      
      const url = `https://speed.cloudflare.com/__down?bytes=50000000&r=${Math.random()}`;
      const startTime = performance.now();
      let lastSpeed = 0;
      
      const timeoutId = setTimeout(() => {
        xhr.abort();
        resolve(lastSpeed);
      }, 8000); // 8 seconds max

      xhr.open("GET", url, true);
      xhr.onprogress = (e) => {
        if (e.loaded > 0) {
          const duration = (performance.now() - startTime) / 1000;
          if (duration > 0.1) {
            const speedBps = (e.loaded * 8) / duration;
            lastSpeed = speedBps / 1000000;
            setBig(fmt(lastSpeed));
            setFill(Math.min(100, (lastSpeed / 500) * 100));
          }
        }
      };
      xhr.onload = () => {
        clearTimeout(timeoutId);
        resolve(lastSpeed);
      };
      xhr.onerror = () => {
        clearTimeout(timeoutId);
        if (lastSpeed > 0) resolve(lastSpeed); else reject(new Error("Download failed"));
      };
      xhr.onabort = () => {
        // Abort is called by timeout
      };
      xhr.send();
    });
  }, []);

  const runUploadTest = useCallback((): Promise<number> => {
    return new Promise((resolve, reject) => {
      setPhase("Upload...");
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      
      const url = `https://speed.cloudflare.com/__up?r=${Math.random()}`;
      const payload = new Uint8Array(15000000);
      
      const startTime = performance.now();
      let lastSpeed = 0;

      const timeoutId = setTimeout(() => {
        xhr.abort();
        resolve(lastSpeed);
      }, 8000); // 8 seconds max
      
      xhr.open("POST", url, true);
      xhr.upload.onprogress = (e) => {
        if (e.loaded > 0) {
          const duration = (performance.now() - startTime) / 1000;
          if (duration > 0.1) {
            const speedBps = (e.loaded * 8) / duration;
            lastSpeed = speedBps / 1000000;
            setUp(fmt(lastSpeed));
            setFill(Math.min(100, (lastSpeed / 200) * 100));
          }
        }
      };
      xhr.onload = () => {
        clearTimeout(timeoutId);
        resolve(lastSpeed);
      };
      xhr.onerror = () => {
        clearTimeout(timeoutId);
        if (lastSpeed > 0) resolve(lastSpeed); else reject(new Error("Upload failed"));
      };
      xhr.onabort = () => {};
      xhr.send(payload);
    });
  }, []);

  const mulai = useCallback(async () => {
    if (running) return;
    
    setRunning(true);
    setHasilHtml("");
    finalD.current = null;
    finalU.current = null;
    setBig("0");
    setUp("0");
    setFill(0);
    setServer("Menghubungi Cloudflare Edge Server...");
    setSrv("Cloudflare");

    try {
      // 1. Download Test
      const dlSpeed = await runDownloadTest();
      finalD.current = dlSpeed;
      setBig(fmt(dlSpeed));
      setFill(0); // reset gauge
      
      // 2. Upload Test
      const ulSpeed = await runUploadTest();
      finalU.current = ulSpeed;
      setUp(fmt(ulSpeed));
      
      // Done
      setRunning(false);
      setPhase("Selesai");
      setFill(100);
      setServer("Server: Cloudflare Edge - Selesai");
      tampilHasil(finalD.current, finalU.current);
      
      gtag("event", "speed_done", {
        down_mbps: Math.round(finalD.current || 0),
        up_mbps: Math.round(finalU.current || 0),
        page_path: window.location.pathname,
      });

    } catch (err: any) {
      gagal("Error: Gagal mengukur jaringan. Pastikan koneksi stabil.");
    }
  }, [running, gagal, tampilHasil, runDownloadTest, runUploadTest]);

  // Clean up XHR on unmount
  useEffect(() => {
    return () => {
      if (xhrRef.current) xhrRef.current.abort();
    };
  }, []);

  // Buka link hasil dari orang lain
  useEffect(() => {
    const h = (window.location.hash || "").replace("#speed-", "");
    const m = h.match(/^(\d+)-(\d+)(?:-(\d+|x))?$/);
    if (!m) return;
    setPhase("Hasil tes");
    setBig(m[1]);
    setUp(m[2]);
    setFill(100);
    setServer("Hasil bagikan ➔ jalankan tes sendiri untuk angka live.");
    tampilHasil(parseFloat(m[1]), parseFloat(m[2]));
    document.getElementById("speed-box")?.scrollIntoView();
  }, [tampilHasil]);

  const share = () => {
    const url = `https://xlsatusolo.com/tes-kecepatan/#speed-${Math.round(finalD.current || 0)}-${Math.round(finalU.current || 0)}`;
    const doneFn = () => {
      setShared(true);
      gtag("event", "speed_share", { page_path: window.location.pathname });
      setTimeout(() => setShared(false), 3000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(doneFn).catch(() => prompt("Salin link ini:", url));
    } else {
      prompt("Salin link ini:", url);
    }
  };
  const [shared, setShared] = useState(false);

  return (
    <div id="speed-box">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <motion.div
          animate={{ scale: running ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}
        >
          <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%" }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="2"
              strokeDasharray="100 100"
            />
            <motion.path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--green)"
              strokeWidth="3"
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${fill} 100` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
             <div style={{ fontSize: 42, fontWeight: 900, color: "var(--green-dark)", lineHeight: 1 }}>{big}</div>
             <div style={{ fontSize: 12, color: "#666", fontWeight: 700, marginTop: 4 }}>Mbps Download</div>
          </div>
        </motion.div>
      </div>

      <div className="phase" id="speed-phase" style={{ textAlign: "center", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "var(--green)" }}>
        {phase}
      </div>
      
      <div className="server" id="speed-server" style={{ textAlign: "center", fontSize: 13, color: "#666", marginBottom: 24 }}>
        {server}
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: running ? "none" : ["0 0 0 0 rgba(5,169,134,0.4)", "0 0 0 15px rgba(5,169,134,0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          type="button"
          onClick={mulai}
          disabled={running}
          style={{
            width: "100%",
            background: running ? "#9ca3af" : "var(--green)",
            color: "#fff",
            border: "none",
            padding: 14,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 800,
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Mengukur..." : "Mulai Tes Kecepatan"}
        </motion.button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#374151" }}>
            {up}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, marginTop: 4 }}>Mbps Upload</div>
        </div>
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#374151" }}>
            {srv}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, marginTop: 4 }}>Server Tes</div>
        </div>
      </div>

      {hasilHtml && (
        <div
          id="speed-hasil"
          dangerouslySetInnerHTML={{ __html: hasilHtml }}
        />
      )}

      <div style={{ display: "flex", gap: 8, margin: "16px 0 24px" }}>
        {hasilHtml && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={share}
              style={{
                flex: 1,
                background: "#fff",
                color: "var(--green-dark)",
                border: "1.5px solid var(--green)",
                padding: 10,
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {shared ? "Link Tersalin! Pamer 🚀" : "Bagikan Hasilku"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={mulai}
              style={{
                flex: 1,
                background: "#f3f4f6",
                color: "#444",
                border: "none",
                padding: 10,
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Tes Ulang
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
