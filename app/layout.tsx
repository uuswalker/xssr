import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import WebMCPRegistry from "@/components/WebMCPRegistry";
import Trackers from "@/components/Trackers";
import CekLokasi from "@/components/CekLokasi";
import StickyMobileBar from "@/components/StickyMobileBar";
import ConsentBanner from "@/components/ConsentBanner";
import { ADS_ID, GA_ID, IS_STAGING, SITE_NAME } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-jakarta" });

export const metadata: Metadata = {
  metadataBase: new URL("https://xlsatusolo.com"),
  robots: { index: true, follow: true },
  icons: {
    icon: [
      "/favicon.ico",
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#037e64",
};

// Google tag — port 1:1 pola consent-mode xssr: dataLayer + default denied
// sinkron di head, library gtag dimuat setelah window load.
const GTAG_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
gtag('config', '${GA_ID}');
gtag('config', '${ADS_ID}');
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={jakarta.variable}>
      <head>
        <link rel="preconnect" href="https://ipwho.is" crossOrigin="anonymous" />
        <link 
          rel="preload" 
          as="image" 
          imageSrcSet="/images/promo-wifi-rumah-koneksi-pasti-mobile.webp 500w, /images/promo-wifi-rumah-koneksi-pasti.webp 1080w"
          imageSizes="(max-width: 768px) 500px, 1080px"
          fetchPriority="high" 
        />
      </head>
      <body data-origin="xlsatusolo.com" data-wm="224CF412">
        {/* Honeypot anti-scraper — parity xssr, JANGAN dihapus */}
        <a
          href="https://xlsatusolo.com/trap/"
          className="hp-trap"
          tabIndex={-1}
          aria-hidden="true"
          rel="nofollow"
          style={{
            position: "absolute",
            left: -9999,
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          arsip
        </a>
        {children}
        <link rel="webmcp" id="webmcp" href="/webmcp.json" />
        <Trackers />
        <WebMCPRegistry />
        <CekLokasi />
        <ConsentBanner />
        <StickyMobileBar />
        {!IS_STAGING && (
          <>
            <Script id="gtag-bootstrap" strategy="beforeInteractive">
              {GTAG_BOOTSTRAP}
            </Script>
            <Script
              id="gtag-lib"
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
          </>
        )}
      </body>
    </html>
  );
}
