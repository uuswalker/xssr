import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Situs statis penuh (parity dengan xssr): prerender saat build, deploy ke mana saja.
  output: "export",
  // Samakan struktur URL xssr: /wifi-solo/ -> /wifi-solo/index.html
  trailingSlash: true,
  // Gambar sudah teroptimasi (AVIF/WebP) di public/images; tanpa image optimizer server.
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    optimizeCss: true,
  },
};

export default nextConfig;
