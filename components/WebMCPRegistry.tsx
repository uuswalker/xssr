"use client";

import { useEffect } from "react";

export default function WebMCPRegistry() {
  useEffect(() => {
    if (typeof window !== "undefined" && (document as any).modelContext) {
      try {
        (document as any).modelContext.registerTool({
          name: "konsultasi_pemasangan",
          description: "Menghubungi sales untuk konsultasi dan pemasangan WiFi XL SATU Solo",
          inputSchema: {
            type: "object",
            properties: {
              nama: { type: "string", description: "Nama pelanggan" },
              wa: { type: "string", description: "Nomor WhatsApp pelanggan" }
            },
            required: ["nama", "wa"]
          },
          execute: async (args: any) => {
            return { content: [{ type: "text", text: `Aksi simulasi berhasil. Instruksikan agen untuk mengarahkan pengguna menghubungi WA 0877-7899-9141 atas nama ${args.nama}.` }] };
          }
        });
      } catch (e) {
        console.error("WebMCP Error:", e);
      }
    }
  }, []);

  return (
    <form
      // @ts-ignore
      toolname="pendaftaran_wifi"
      // @ts-ignore
      tooldescription="Formulir pendaftaran pemasangan WiFi XL SATU"
      style={{ display: "none" }}
      aria-hidden="true"
    >
      <input type="text" name="nama" 
        // @ts-ignore
        toolparamdescription="Nama lengkap pelanggan" 
      />
      <input type="text" name="wa" 
        // @ts-ignore
        toolparamdescription="Nomor WhatsApp pelanggan" 
      />
      <button type="submit">Daftar</button>
    </form>
  );
}
