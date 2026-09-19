"use client";

import { motion } from "framer-motion";

export default function Header({
  anchorBase = "",
  showFiber = true,
  showWireless = true,
  ctaHref,
}: {
  anchorBase?: string;
  showFiber?: boolean;
  showWireless?: boolean;
  ctaHref?: string;
}) {
  return (
    <motion.header 
      role="banner"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="header-inner">
        <div className="logo">
          <a href={anchorBase === "" ? "#" : "/"} title="XL SATU">
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
            <i className="fab fa-whatsapp"></i> Chat WA
          </motion.a>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(5,169,134,0.4)" }}
            whileTap={{ scale: 0.95 }}
            type="button" 
            className="btn-wa-header btn-cek-lokasi-trigger"
          >
            <i className="fas fa-map-marker-alt"></i> Cek Ketersediaan
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}
