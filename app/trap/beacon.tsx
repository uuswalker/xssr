"use client";

import { useEffect } from "react";
import { LEAD_TOKEN, WEBHOOK_URL } from "@/lib/lead";

// Honeypot anti-scraper — beacon 1:1 trap xssr (diam-diam, tanpa UI).
export default function TrapBeacon() {
  useEffect(() => {
    try {
      const payload = {
        token: LEAD_TOKEN,
        action: "trap",
        ua: navigator.userAgent || "",
        href: location.href,
        ref: document.referrer || "",
        ts: Date.now(),
      };
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(WEBHOOK_URL, new Blob([body], { type: "text/plain" }));
      } else {
        fetch(WEBHOOK_URL, { method: "POST", mode: "no-cors", body });
      }
    } catch {
      /* diam-diam */
    }
  }, []);
  return null;
}
