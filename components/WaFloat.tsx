"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { PHONE_DISPLAY, waLink } from "@/lib/site";

export default function WaFloat({
  text = "Info XL SATU",
  small = "Hubungi Sales",
}: {
  text?: string;
  small?: string;
}) {
  return (
    <motion.a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className="float-wa"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        repeatDelay: 3,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.05 }}
    >
      <MessageCircle size={24} style={{ marginRight: 8 }} />
      <div className="float-wa-text">
        <small>{small}</small>
        <span>{PHONE_DISPLAY}</span>
      </div>
    </motion.a>
  );
}
