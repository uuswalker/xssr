"use client";

import { useEffect } from "react";

// Watermark anti-kloning per halaman — parity {{wm_token}} generate.js.
// Diset saat mount (body global milik layout).
export default function Watermark({ token }: { token: string }) {
  useEffect(() => {
    document.body.dataset.wm = token;
  }, [token]);
  return null;
}
