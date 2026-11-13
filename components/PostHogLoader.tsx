"use client";

import { useEffect } from "react";
import { POSTHOG_HOST, POSTHOG_KEY } from "@/lib/site";

// Lazy-load PostHog: bundle posthog-js hanya diunduh saat interaksi pertama
// (atau fallback 12 detik), sama seperti loader GA/Meta, agar LCP/TBT tidak terganggu.
export default function PostHogLoader() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    let started = false;
    const events = ["pointerdown", "touchstart", "scroll", "click"] as const;

    const start = () => {
      if (started) return;
      started = true;
      events.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(timer);

      import("posthog-js")
        .then(({ default: posthog }) => {
          if (posthog.__loaded) return;
          posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            person_profiles: "identified_only",
            capture_pageview: "history_change",
            capture_pageleave: true,
            autocapture: true,
            disable_session_recording: true,
          });
        })
        .catch(() => {
          // abaikan kegagalan muat analytics agar tidak mengganggu halaman
        });
    };

    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    const timer = window.setTimeout(start, 12000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
