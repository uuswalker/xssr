"use client";

import { useEffect } from "react";
import { ADS_ID } from "@/lib/site";

// Port 1:1 perilaku xssr: tracking klik WA Sales (GA4 + Ads conversion + PostHog) + anti-copy gambar + UTM tracking
const SUPPORT_WA_NUMBERS = ["628170010820", "08170010820"];

function appendUtmToWaHref(href: string, utm: string): string {
  try {
    // Jangan ubah URL custom slug pendek tanpa query text seperti https://wa.me/xlhomesolo
    if (/wa\.me\/[a-z]/i.test(href) && !/wa\.me\/62\d+/i.test(href)) return href;
    const url = new URL(href);
    let text = url.searchParams.get("text") || "";
    if (!text.includes("[Sumber:")) {
      text = text ? `${text} [Sumber: ${utm}]` : `Halo Sales XL Home Solo [Sumber: ${utm}]`;
      url.searchParams.set("text", text);
    }
    return url.toString();
  } catch {
    return href;
  }
}

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

    // Eager attach UTM ke semua tautan WA Sales yang sudah ada di DOM
    if (currentUtm) {
      document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]').forEach((a) => {
        if (a.getAttribute("data-wa-type") === "support") return;
        if (SUPPORT_WA_NUMBERS.some((num) => a.href.includes(num))) return;
        a.href = appendUtmToWaHref(a.href, currentUtm!);
      });
    }

    // 2. Intercept klik WhatsApp
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const l = t?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!l) return;

      // Kecualikan klik WA Customer Care / Gangguan agar tidak mencemari data konversi Ads
      const isSupport =
        l.getAttribute("data-wa-type") === "support" ||
        SUPPORT_WA_NUMBERS.some((num) => l.href.includes(num));
      if (isSupport) return;

      // Sisipkan UTM ke pesan WA jika ada
      const activeUtm = currentUtm || sessionStorage.getItem("xlsr_utm");
      if (activeUtm) {
        l.href = appendUtmToWaHref(l.href, activeUtm);
      }

      const linkText = (l.textContent || "").trim().slice(0, 100) || l.className || "wa_link";

      if (typeof (window as unknown as { gtag?: unknown }).gtag === "function") {
        const gtag = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag;
        gtag("event", "click_whatsapp", {
          link_text: linkText,
          link_url: l.href,
          page_path: window.location.pathname,
          utm_data: activeUtm || "organic",
        });
        gtag("event", "conversion", { send_to: `${ADS_ID}/uoD7CPXb27ADEN7y1b8D` });
      }

      if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
        const fbq = (window as unknown as { fbq: (...a: unknown[]) => void }).fbq;
        fbq("track", "Contact");
        fbq("track", "Lead", {
          content_name: linkText,
          content_category: "whatsapp",
          value: 185000,
          currency: "IDR",
        });
      }

      const posthog = (window as unknown as { posthog?: { capture: (ev: string, p?: Record<string, unknown>) => void } }).posthog;
      if (posthog && typeof posthog.capture === "function") {
        posthog.capture("click_whatsapp", {
          link_text: linkText,
          link_url: l.href,
          page_path: window.location.pathname,
          utm_data: activeUtm || "organic",
        });
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
