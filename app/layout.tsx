import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Trackers from "@/components/Trackers";
import CekLokasi from "@/components/CekLokasi";
import ConsentBanner from "@/components/ConsentBanner";
import { ADS_ID, GA_ID, IS_STAGING, SITE_NAME } from "@/lib/site";

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
    <html lang="id">
      <head>
        
        <link
          rel="preload"
          as="image"
          href="/images/promo-wifi-rumah-koneksi-pasti.webp"
          // @ts-ignore
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/images/promo-wifi-rumah-koneksi-pasti.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/css/all.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="/css/all.min.css"
          media="print"
          id="fa-css"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("load", function() {
                var fa = document.getElementById('fa-css');
                if (fa) fa.media = 'all';
              });
            `
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="/css/all.min.css"
          />
        </noscript>
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
        <Trackers />
        <CekLokasi />
        <ConsentBanner />
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
