import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    optimizeCss: true,
  },
  compiler: {
    // Hapus dead code dari framer-motion dan library animasi lain
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
