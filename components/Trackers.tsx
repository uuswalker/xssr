"use client";

import { useEffect } from "react";
import { ADS_ID } from "@/lib/site";

// Port 1:1 perilaku xssr: tracking klik WA (GA4 + Ads conversion) + anti-copy gambar + UTM tracking
export default function Trackers() {
  useEffect(() => {
    // 1. Simpan UTM parameter ke sessionStorage agar bertahan pindah halaman
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    
    let currentUtm = sessionStorage.getItem("xlsr_utm");
    if (utmSource) {
      const parts = [utmSource, utmMedium, utmCampaign].filter(Boolean);
      currentUtm = parts.join("-");
      sessionStorage.setItem("xlsr_utm", currentUtm);
    }

    // 2. Intercept klik WhatsApp
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const l = t?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!l) return;
      
      // Sisipkan UTM ke pesan WA jika ada
      if (currentUtm) {
        try {
          const url = new URL(l.href);
          let text = url.searchParams.get("text") || "";
          if (!text.includes("[Sumber:")) {
            text += ` [Sumber: ${currentUtm}]`;
            url.searchParams.set("text", text);
            l.href = url.toString();
          }
        } catch(err) {
          // ignore parsing error
        }
      }

      if (typeof (window as unknown as { gtag?: unknown }).gtag === "function") {
        const gtag = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag;
        gtag("event", "click_whatsapp", {
          link_text: ((l.textContent || "").trim().slice(0, 100) || l.className || "wa_link"),
          link_url: l.href,
          page_path: window.location.pathname,
          utm_data: currentUtm || "organic"
        });
        gtag("event", "conversion", { send_to: `${ADS_ID}/uoD7CPXb27ADEN7y1b8D` });
      }
    };
    const onCtx = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === "IMG") e.preventDefault();
    };
    const onDrag = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === "IMG") e.preventDefault();
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onCtx, false);
    document.addEventListener("dragstart", onDrag, false);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onCtx, false);
      document.removeEventListener("dragstart", onDrag, false);
    };
  }, []);
  return null;
}