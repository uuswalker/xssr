import type { Metadata } from "next";
import { JsonLd, pageMetadata } from "@/lib/seo";
import Watermark from "@/components/Watermark";
import TrapBeacon from "./beacon";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Arsip - XL SATU Solo Raya",
    description: "Halaman arsip XL SATU Solo Raya.",
    path: "/trap/",
  }),
  robots: { index: false, follow: false },
};

export default function TrapPage() {
  return (
    <main
      style={{
        fontFamily: "system-ui,sans-serif",
        maxWidth: 640,
        margin: "80px auto",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <TrapBeacon />
      <Watermark token="TRAP0000" />
      <h1>Arsip</h1>
      <p>
        Halaman ini sudah tidak tersedia. Kembali ke{" "}
        <a href="/">beranda XL SATU Solo Raya</a>.
      </p>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Arsip - XL SATU Solo Raya",
          url: "https://xlsatusolo.com/trap/",
        }}
      />
    </main>
  );
}
