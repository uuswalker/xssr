import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import ClientOnlyComponents from "@/components/ClientOnlyComponents";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Trackers from "@/components/Trackers";
import { ADS_ID, GA_ID, FB_PIXEL_ID, IS_STAGING, SITE_NAME } from "@/lib/site";

const jakarta = localFont({
  src: [
    { path: "../public/fonts/pjs-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/pjs-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/pjs-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/pjs-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/pjs-800.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-jakarta",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xlhomesolo.com"),
  verification: { google: "BpDlI8rnAmviY2YawnXFbbBoJfOdpaG1jT9vNctq71I" },
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
  applicationName: "XL Home Solo Raya",
  appleWebApp: { title: "XL Home Solo Raya" },
};

export const viewport: Viewport = {
  themeColor: "#037e64",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={jakarta.variable}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/banner-xlsatu-jadi-xlhome.webp"
          type="image/webp"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        {!IS_STAGING && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});gtag('config','${GA_ID}');gtag('config','${ADS_ID}');`,
            }}
          />
        )}
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
        <ClientOnlyComponents />
        {!IS_STAGING && (
          <>
            <Script
              id="gtag-lib"
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="fb-pixel"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b){
                    if(f.fbq)return;var n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];
                  }(window, document);
                  fbq('init', '${FB_PIXEL_ID}');
                  fbq('track', 'PageView');

                  function _loadFb(){
                    if(window._fbLoaded)return;
                    window._fbLoaded=true;
                    var t=document.createElement('script');
                    t.async=true;
                    t.src='https://connect.facebook.net/en_US/fbevents.js';
                    document.head.appendChild(t);
                  }
                  ['pointerdown','touchstart','scroll','click'].forEach(function(e){
                    window.addEventListener(e,_loadFb,{once:true,passive:true});
                  });
                  setTimeout(_loadFb, 8500);
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

