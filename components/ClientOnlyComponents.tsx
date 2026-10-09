"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const StickyMobileBar = dynamic(() => import("@/components/StickyMobileBar"), { ssr: false });
const ConsentBanner = dynamic(() => import("@/components/ConsentBanner"), { ssr: false });

const CekLokasi = dynamic(() => import("@/components/CekLokasi"), { ssr: false });
const SmartPromoPopup = dynamic(() => import("@/components/SmartPromoPopup"), { ssr: false });
const LiveSocialProof = dynamic(() => import("@/components/LiveSocialProof"), { ssr: false });

export default function ClientOnlyComponents() {
  const [loadWidgets, setLoadWidgets] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;

    const trigger = () => {
      setLoadWidgets(true);
      cleanup();
    };

    const cleanup = () => {
      if (idleId !== null && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
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

    if ("requestIdleCallback" in window) {
      idleId = (window as unknown as { requestIdleCallback: (fn: () => void, opts: { timeout: number }) => number }).requestIdleCallback(
        trigger,
        { timeout: 5000 }
      );
    } else {
      timerId = setTimeout(trigger, 5000);
    }

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
        </>
      )}
    </>
  );
}
