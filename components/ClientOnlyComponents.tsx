"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const StickyMobileBar = dynamic(() => import("@/components/StickyMobileBar"), { ssr: false });
const ConsentBanner = dynamic(() => import("@/components/ConsentBanner"), { ssr: false });

const CekLokasi = dynamic(() => import("@/components/CekLokasi"), { ssr: false });
const SmartPromoPopup = dynamic(() => import("@/components/SmartPromoPopup"), { ssr: false });
const LiveSocialProof = dynamic(() => import("@/components/LiveSocialProof"), { ssr: false });

export default function ClientOnlyComponents() {
  const [loadWidgets, setLoadWidgets] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    const trigger = () => {
      setLoadWidgets(true);
      cleanup();
    };

    const cleanup = () => {
      if (timerId !== null) clearTimeout(timerId);
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("touchstart", trigger);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("mousemove", trigger);
    };

    window.addEventListener("pointerdown", trigger, { once: true, passive: true });
    window.addEventListener("touchstart", trigger, { once: true, passive: true });
    window.addEventListener("scroll", trigger, { once: true, passive: true });
    window.addEventListener("mousemove", trigger, { once: true, passive: true });

    timerId = setTimeout(trigger, 12000);

    return cleanup;
  }, []);

  return (
    <>
      <StickyMobileBar />
      <ConsentBanner />
      {loadWidgets && (
        <>
          <CekLokasi />
          <SmartPromoPopup />
          <LiveSocialProof />
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}
