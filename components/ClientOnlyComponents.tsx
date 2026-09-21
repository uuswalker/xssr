"use client";
import dynamic from "next/dynamic";

const CekLokasi = dynamic(() => import("@/components/CekLokasi"), { ssr: false });
const StickyMobileBar = dynamic(() => import("@/components/StickyMobileBar"), { ssr: false });
const ConsentBanner = dynamic(() => import("@/components/ConsentBanner"), { ssr: false });

export default function ClientOnlyComponents() {
  return (
    <>
      <CekLokasi />
      <ConsentBanner />
      <StickyMobileBar />
    </>
  );
}
