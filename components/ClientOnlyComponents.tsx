"use client";

import dynamic from "next/dynamic";

const StickyMobileBar = dynamic(() => import("@/components/StickyMobileBar"), { ssr: false });
const ConsentBanner = dynamic(() => import("@/components/ConsentBanner"), { ssr: false });
const CekLokasi = dynamic(() => import("@/components/CekLokasi"), { ssr: false });

export default function ClientOnlyComponents() {
  return (
    <>
      <StickyMobileBar />
      <ConsentBanner />
      <CekLokasi />
    </>
  );
}
