import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import ClientOnlyComponents from "@/components/ClientOnlyComponents";
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
  preload: false,
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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {!IS_STAGING && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});gtag('config','${GA_ID}');gtag('config','${ADS_ID}');!function(f,b){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window,document);fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body data-origin="xlhomesolo.com" data-wm="224CF412">
        {/* Honeypot anti-scraper — parity xssr, JANGAN dihapus */}
        <a
          href="https://xlhomesolo.com/trap/"
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
        <link rel="ard" href="/.well-known/ard.json" type="application/json" />
        <link rel="ai-catalog" href="/.well-known/ai-catalog.json" type="application/json" />
        <script
          id="webmcp-registry"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var mc = (typeof document !== 'undefined' && document.modelContext) || (typeof navigator !== 'undefined' && navigator.modelContext);
                  if (mc && typeof mc.registerTool === 'function') {
                    mc.registerTool({
                      name: 'cek_coverage_dan_daftar_xl_home_solo',
                      description: 'Pengecekan jangkauan tiang fiber optik dan konsultasi paket pasang baru WiFi XL Home Solo Raya resmi.',
                      inputSchema: {
                        type: 'object',
                        properties: {
                          nama: { type: 'string', description: 'Nama lengkap pemohon pemasangan WiFi' },
                          alamat: { type: 'string', description: 'Alamat rumah atau kelurahan di Kota Solo, Sukoharjo, Karanganyar, Boyolali, atau Klaten' },
                          whatsapp: { type: 'string', description: 'Nomor WhatsApp aktif pemohon untuk konfirmasi pemasangan' },
                          paket: { type: 'string', description: 'Pilihan paket (misal 20 Mbps Rp 185rb, 250 Mbps Promo Rp 229rb)' }
                        },
                        required: ['nama', 'alamat', 'whatsapp']
                      },
                      annotations: {
                        readOnlyHint: false,
                        consequentialHint: false,
                        untrustedContentHint: false
                      },
                      execute: async function(params) {
                        var n = params.nama || 'Pelanggan';
                        var a = params.alamat || 'Solo';
                        var w = params.whatsapp || '';
                        var p = params.paket || 'Promo XL Home';
                        var text = 'Halo Sales XL Home Solo, saya ' + n + ' di ' + a + ' mau pasang WiFi ' + p + '. Nomor WA: ' + w;
                        return {
                          status: 'success',
                          message: 'Permintaan pendaftaran berhasil diterima. Sales resmi XL Home Solo akan segera menghubungi Anda.',
                          salesContact: '0877-7899-9141',
                          actionUrl: 'https://wa.me/6287778999141?text=' + encodeURIComponent(text)
                        };
                      }
                    });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <Trackers />
        <ClientOnlyComponents />
        {!IS_STAGING && (
          <>
            <Script
              id="analytics-loader"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  function _loadTrackers(){
                    if(window._trackersLoaded)return;
                    window._trackersLoaded=true;
                    var g=document.createElement('script');
                    g.async=true;
                    g.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
                    document.head.appendChild(g);

                    var f=document.createElement('script');
                    f.async=true;
                    f.src='https://connect.facebook.net/en_US/fbevents.js';
                    document.head.appendChild(f);
                  }
                  ['pointerdown','touchstart','scroll','click'].forEach(function(e){
                    window.addEventListener(e,_loadTrackers,{once:true,passive:true});
                  });
                  setTimeout(_loadTrackers, 12000);
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
      </body>
    </html>
  );
}

