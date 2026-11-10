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
    // Tampilkan halus setelah jeda awal 3 detik (tidak mengagetkan setelah 12 detik)
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  const pilih = (v: string) => {
    lsSet(v);
    applyConsent(v);
    setShow(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        #xlsr-consent {
          position: fixed;
          left: 20px;
          bottom: 20px;
          z-index: 10001;
          max-width: 350px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          padding: 14px 16px;
          font-size: 12.5px;
          line-height: 1.5;
          color: #334155;
          font-family: inherit;
          animation: consentFadeIn 0.3s ease-out;
        }
        @media (max-width: 768px) {
          #xlsr-consent {
            left: 12px;
            right: 12px;
            bottom: 84px; /* Posisi presisi di atas sticky mobile bar agar tidak saling menumpuk */
            max-width: calc(100vw - 24px);
            padding: 12px 14px;
          }
        }
        @keyframes consentFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />
      <div
        id="xlsr-consent"
        role="dialog"
        aria-label="Persetujuan cookie"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <strong style={{ color: "#0f172a", fontSize: "13px" }}>
            Persetujuan Privasi & Cookie
          </strong>
        </div>
        <p style={{ margin: "0 0 10px 0", color: "#475569", fontSize: "12px", lineHeight: 1.45 }}>
          Kami memakai analitik &amp; cookie untuk akurasi cek jangkauan area dan performa situs.{" "}
          <a href="/kebijakan-privasi/" style={{ color: "#037e64", fontWeight: 600, textDecoration: "underline" }}>
            Detail Privasi
          </a>
          .
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => pilih("granted")}
            style={{
              flex: 1.2,
              background: "#037e64",
              color: "#fff",
              border: "none",
              padding: "8px 10px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Izinkan Semua
          </button>
          <button
            type="button"
            onClick={() => pilih("denied")}
            style={{
              flex: 1,
              background: "#f8fafc",
              color: "#64748b",
              border: "1.5px solid #cbd5e1",
              padding: "8px 10px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Hanya Esensial
          </button>
        </div>
      </div>
    </>
  );
}
