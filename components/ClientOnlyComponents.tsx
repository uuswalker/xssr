"use client";
import dynamic from "next/dynamic";

const CekLokasi = dynamic(() => import("@/components/CekLokasi"), { ssr: false });
const StickyMobileBar = dynamic(() => import("@/components/StickyMobileBar"), { ssr: false });
const ConsentBanner = dynamic(() => import("@/components/ConsentBanner"), { ssr: false });
const SmartPromoPopup = dynamic(() => import("@/components/SmartPromoPopup"), { ssr: false });

export default function ClientOnlyComponents() {
  return (
    <>
      <CekLokasi />
      <ConsentBanner />
      <SmartPromoPopup />
      <StickyMobileBar />
    </>
  );
}
