"use client";

import { useEffect, useState } from "react";

// Banner consent cookie + Consent Mode v2 — port 1:1 site-consent.js xssr@ec66035.
const KEY = "xlsr_cookie_consent";

function lsGet(): { v: string; ts: number } | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

function lsSet(v: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v, ts: Date.now() }));
  } catch {
    /* abaikan */
  }
}

function applyConsent(v: string): void {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") {
    const g = v === "granted" ? "granted" : "denied";
    w.gtag("consent", "update", {
      analytics_storage: g,
      ad_storage: g,
      ad_user_data: g,
      ad_personalization: g,
    });
  }
}

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = lsGet();
    if (saved && saved.v) {
      applyConsent(saved.v);
      return;
    }
    setShow(true);
  }, []);

  if (!show) return null;

  const pilih = (v: string) => {
    lsSet(v);
    applyConsent(v);
    setShow(false);
  };

  return (
    <div
      id="xlsr-consent"
      role="dialog"
      aria-label="Persetujuan cookie"
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: 10001,
        maxWidth: "min(92vw,360px)",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,.18)",
        padding: "16px 18px",
        fontSize: 13,
        lineHeight: 1.55,
        color: "#333",
        fontFamily: "inherit",
      }}
    >
      <strong style={{ display: "block", marginBottom: 4, color: "#1a1a1a" }}>
        Bantu tingkatkan layanan?
      </strong>
      Izinkan analitik &amp; iklan untuk bantu akurasi cek area dan kecepatan
      situs. Tidak ada data yang dijual. Detail:{" "}
      <a href="/kebijakan-privasi/" style={{ color: "#037e64", fontWeight: 600 }}>
        Kebijakan Privasi
      </a>
      .
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => pilih("granted")}
          style={{
            flex: 1.2,
            background: "#037e64",
            color: "#fff",
            border: "none",
            padding: "9px 10px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12.5,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Izinkan
        </button>
        <button
          type="button"
          onClick={() => pilih("denied")}
          style={{
            flex: 1,
            background: "#f5f5f5",
            color: "#444",
            border: "1px solid #ddd",
            padding: "9px 10px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 12.5,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Hanya Esensial
        </button>
      </div>
    </div>
  );
}
