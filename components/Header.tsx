"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { MessageCircle, MapPin } from "lucide-react";

export default function Header({
  showFiber = true,
  showWireless = true,
  ctaHref,
}: {
  showFiber?: boolean;
  showWireless?: boolean;
  ctaHref?: string;
}) {
  const pathname = usePathname();
  // Automatically determine if we are on the homepage.
  // If not, prefix anchor links with "/" so they navigate back to the home page's sections.
  const isHome = pathname === "/";
  const anchorBase = isHome ? "" : "/";

  return (
    <motion.header 
      role="banner"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="header-inner">
        <div className="logo">
          {/* Logo ALWAYS goes to home */}
          <a href="/" title="XL SATU">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/images/logo-xl-satu.png"
              alt="XL SATU"
              width={106}
              height={85}
              loading="lazy"
            />
          </a>
        </div>
        <nav role="navigation">
          {showFiber && <motion.a whileHover={{ y: -2 }} href={`${anchorBase}#paket`}>Paket Fiber</motion.a>}
          {showWireless && <motion.a whileHover={{ y: -2 }} href={`${anchorBase}#wireless`}>Wireless</motion.a>}
          <motion.a whileHover={{ y: -2 }} href={`${anchorBase}#area`}>Area Layanan</motion.a>
          <motion.a whileHover={{ y: -2 }} href={`${anchorBase}#bantuan`}>Bantuan</motion.a>
          <motion.a whileHover={{ y: -2 }} href={`${anchorBase}#hubungi`}>Hubungi Kami</motion.a>
        </nav>
        {ctaHref ? (
          <motion.a
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(5,169,134,0.4)" }}
            whileTap={{ scale: 0.95 }}
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-header"
            style={{ display: "inline-block" }}
          >
            <MessageCircle size={18} /> Chat WA
          </motion.a>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(5,169,134,0.4)" }}
            whileTap={{ scale: 0.95 }}
            type="button" 
            className="btn-wa-header btn-cek-lokasi-trigger"
          >
            <MapPin size={18} /> Cek Ketersediaan
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}
