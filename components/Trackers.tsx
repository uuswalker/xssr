"use client";

import { useEffect } from "react";
import { ADS_ID } from "@/lib/site";

// Port 1:1 perilaku xssr: tracking klik WA (GA4 + Ads conversion) + anti-copy gambar.
export default function Trackers() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const l = t?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!l) return;
      if (typeof (window as unknown as { gtag?: unknown }).gtag === "function") {
        const gtag = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag;
        gtag("event", "click_whatsapp", {
          link_text: ((l.textContent || "").trim().slice(0, 100) || l.className || "wa_link"),
          link_url: l.href,
          page_path: window.location.pathname,
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
