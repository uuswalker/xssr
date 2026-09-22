import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["lucide-react", "framer-motion"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  compiler: {
    // Hapus dead code dari framer-motion dan library animasi lain
    removeConsole: process.env.NODE_ENV === "production",
  },
};

// CATATAN: Next.js 16 + Turbopack selalu inject polyfill-nomodule.js (~14KB,
// core-js: Array.at/flat/flatMap, Object.fromEntries/hasOwn, String.trimStart/End)
// TERLEPAS dari browserslist config. Ini bug upstream yang masih open & tracked
// oleh tim Turbopack sendiri: https://github.com/vercel/next.js/issues/86785
// turbopack.resolveAlias TIDAK bisa intercept ini karena injeksinya di level
// Rust/Turbopack core, bukan lewat JS import graph biasa. Tidak ada fix yang
// bisa dilakukan dari sisi aplikasi saat ini — menunggu patch dari Vercel.

export default nextConfig;
