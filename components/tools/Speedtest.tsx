"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gtag } from "@/lib/lead";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ndt7?: any;
  }
}

function fmt(n: number | null): string {
  if (n == null || isNaN(n)) return "-";
  return n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString();
}

function verdict(d: number | null): [string, string] | null {
  if (d == null) return null;
  if (d >= 100)
    return ["Ngebut — cukup untuk 4K multi-layar + WFH + gaming bareng.", "#e6f7f3"];
  if (d >= 50)
    return ["Lancar — cukup untuk streaming HD, WFH, dan gaming santai.", "#e6f7f3"];
  if (d >= 20)
    return ["Pas-pasan — browsing oke, tapi 4K & multi-device bakal buffering.", "#fef3c7"];
  return ["Lemot untuk standar 2026 — waktunya upgrade atau pindah provider.", "#fee2e2"];
}

export default function Speedtest() {
  const [phase, setPhase] = useState("Siap");
  const [big, setBig] = useState("-");
  const [up, setUp] = useState("-");
  const [srv, setSrv] = useState("-");
  const [server, setServer] = useState("Server terdekat dipilih otomatis saat tes dimulai");
  const [hasilHtml, setHasilHtml] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [consent, setConsent] = useState(false);
  const finalD = useRef<number | null>(null);
  const finalU = useRef<number | null>(null);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "/vendor/ndt7/ndt7.js";
    s.async = true;
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  const gagal = useCallback((msg: string) => {
    finalD.current = finalU.current = null;
    setRunning(false);
    setPhase("Gagal");
    setServer(msg + " Coba lagi, atau tes di speed.measurementlab.net.");
    gtag("event", "speed_error", { page_path: window.location.pathname });
  }, []);

  const tampilHasil = useCallback((d: number | null, u: number | null) => {
    const v = verdict(d);
    const wa =
      "https://wa.me/6287778999141?text=" +
      encodeURIComponent(
        `Halo kak, hasil tes kecepatanku: ${fmt(d)} Mbps download / ${fmt(u)} Mbps upload. Minta diagnosa + info paket dong`
      );
    const upTxt = u == null || isNaN(u) ? "tidak terukur" : fmt(u) + " Mbps";
    setHasilHtml(
      (v
        ? `<div class="info-box" style="background:${v[1]};"><strong>Hasil lengkap — Download ${fmt(d)} Mbps / Upload ${upTxt}.</strong><br>${v[0]}</div>`
        : "") +
        `<a href="${wa}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:var(--green); color:#fff; padding:12px 24px; border-radius:8px; font-weight:700; text-decoration:none; margin-top:4px;">Konsultasi Hasil Ini via WA</a>`
    );
  }, []);

  const mulai = useCallback(() => {
    if (running) return;
    if (typeof window.ndt7 === "undefined") {
      gagal("Library tes gagal dimuat.");
      return;
    }
    if (!consent) {
      setServer("Centang persetujuan data dulu untuk mulai tes.");
      return;
    }
    setRunning(true);
    setBig("-");
    setUp("-");
    setSrv("-");
    setHasilHtml(null);
    finalD.current = finalU.current = null;
    gtag("event", "speed_start", { page_path: window.location.pathname });
    setPhase("Mencari server terdekat...");
    setServer("Menghubungi jaringan M-Lab...");
    setSrv("...");
    try {
      window.ndt7
        .test(
          {
            userAcceptedDataPolicy: true,
            downloadworkerfile: "/vendor/ndt7/ndt7-download-worker.js",
            uploadworkerfile: "/vendor/ndt7/ndt7-upload-worker.js",
            metadata: { client_name: "xlsatusolo-speedtest" },
          },
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            serverChosen: (s: any) => {
              const kota = (s.location && s.location.city) || "";
              setServer(
                `Server: ${s.machine || ""}${kota ? ` (${kota})` : ""} — otomatis terdekat`
              );
              setSrv(kota || "Otomatis");
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            downloadMeasurement: (ev: any) => {
              if (ev.Source === "client" && ev.Data && ev.Data.MeanClientMbps != null) {
                setPhase("Download...");
                setBig(fmt(ev.Data.MeanClientMbps));
              }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            downloadComplete: (data: any) => {
              const d =
                data && data.LastClientMeasurement
                  ? data.LastClientMeasurement.MeanClientMbps
                  : null;
              if (d != null) {
                finalD.current = d;
                setBig(fmt(d));
              }
              setPhase("Upload...");
              setBig("-");
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            uploadMeasurement: (ev: any) => {
              if (
                ev.Source === "server" &&
                ev.Data &&
                ev.Data.TCPInfo &&
                ev.Data.TCPInfo.ElapsedTime > 0
              ) {
                const u =
                  (ev.Data.TCPInfo.BytesReceived * 8) / ev.Data.TCPInfo.ElapsedTime;
                setUp(fmt(u));
              }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            uploadComplete: (data: any) => {
              let u: number | null = null;
              try {
                const t = data.LastServerMeasurement.TCPInfo;
                u = (t.BytesReceived * 8) / t.ElapsedTime;
              } catch {
                u = null;
              }
              finalU.current = u;
              if (u != null) setUp(fmt(u));
              setRunning(false);
              setPhase("Selesai");
              tampilHasil(finalD.current, finalU.current);
              gtag("event", "speed_done", {
                down_mbps: Math.round(finalD.current || 0),
                up_mbps: Math.round(finalU.current || 0),
                page_path: window.location.pathname,
              });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: (err: any) => {
              gagal("Error: " + ((err && err.message) || "tes terputus") + ".");
            },
          }
        )
        .then((code: number) => {
          if (code !== 0 && finalD.current == null)
            gagal(`Tes tidak selesai (kode ${code}).`);
        })
        .catch(() => {
          gagal("Tes tidak selesai.");
        });
    } catch {
      gagal("Browser tidak mendukung Web Worker/WebSocket.");
    }
  }, [running, consent, gagal, tampilHasil]);

  // Buka link hasil dari orang lain → tampilkan statis
  useEffect(() => {
    const h = (window.location.hash || "").replace("#speed-", "");
    const m = h.match(/^(\d+)-(\d+)(?:-(\d+|x))?$/);
    if (!m) return;
    setPhase("Hasil tes");
    setBig(m[1]);
    setUp(m[2]);
    setServer("Hasil bagikan — jalankan tes sendiri untuk angka live.");
    tampilHasil(parseFloat(m[1]), parseFloat(m[2]));
    document.getElementById("speed-box")?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="phase" id="speed-phase">
        {phase}
      </div>
      <div className="big" id="speed-big">
        {big}
      </div>
      <div className="unit">Mbps download</div>
      <div className="server" id="speed-server">
        {server}
      </div>
      <div style={{ maxWidth: 420, margin: "18px auto 0", textAlign: "left" }}>
        <label
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            fontSize: 13,
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            id="speed-consent"
            style={{ marginTop: 4 }}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Saya setuju hasil tes (termasuk IP) dipublikasikan di arsip terbuka
            M-Lab untuk riset.{" "}
            <a
              href="https://www.measurementlab.net/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--green-dark)" }}
            >
              Kebijakan data
            </a>
            .
          </span>
        </label>
        <button
          type="button"
          id="speed-start"
          onClick={mulai}
          disabled={running}
          style={{
            width: "100%",
            marginTop: 12,
            background: "var(--green)",
            color: "#fff",
            border: "none",
            padding: 14,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {running ? "Mengukur..." : "Mulai Tes Kecepatan"}
        </button>
      </div>

      <div className="speed-cards">
        <div className="speed-card">
          <div className="v" id="speed-up">
            {up}
          </div>
          <div className="l">Mbps upload</div>
        </div>
        <div className="speed-card">
          <div className="v" id="speed-srv" style={{ fontSize: 16 }}>
            {srv}
          </div>
          <div className="l">server tes</div>
        </div>
      </div>

      {hasilHtml && (
        <div
          id="speed-hasil"
          dangerouslySetInnerHTML={{ __html: hasilHtml }}
        />
      )}

      <div style={{ display: "flex", gap: 8, margin: "8px 0 24px" }}>
        {hasilHtml && (
          <>
            <button
              type="button"
              id="speed-share"
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
              {shared ? "Link Tersalin! Pamer 📶" : "Bagikan Hasilku"}
            </button>
            <button
              type="button"
              id="speed-retest"
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
            </button>
          </>
        )}
      </div>
    </div>
  );
}
