"use client";

import { useState } from "react";
import { gtag } from "@/lib/lead";

const FUP: Record<string, { f1: number; hit: string; f2: number | null; hit2: string | null }> = {
  "30": {
    f1: 700,
    hit: "kecepatanmu turun ke <strong>22,5 Mbps</strong>",
    f2: 1200,
    hit2: "lalu anjlok ke <strong>12 Mbps</strong>",
  },
  "50": {
    f1: 1200,
    hit: "kecepatanmu turun ke <strong>37,5 Mbps</strong>",
    f2: 2000,
    hit2: "lalu anjlok ke <strong>20 Mbps</strong>",
  },
  "100": {
    f1: 2000,
    hit: "kecepatanmu turun ke <strong>75 Mbps</strong>",
    f2: null,
    hit2: null,
  },
  fwa: {
    f1: 1024,
    hit: "pemakaian melewati <strong>batas wajar 1024 GB</strong> - kecepatan diturunkan sementara",
    f2: null,
    hit2: null,
  },
};

const INPUT: React.CSSProperties = {
  width: 70,
  padding: "8px 10px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 15,
  float: "right",
};

interface Hasil {
  html: string;
  p: string;
  status: string;
  gb: number;
}

export default function FupSim() {
  const [paket, setPaket] = useState("30");
  const [orang, setOrang] = useState(0);
  const [k4, setK4] = useState(0);
  const [hd, setHd] = useState(0);
  const [vc, setVc] = useState(0);
  const [sos, setSos] = useState(0);
  const [dl, setDl] = useState(0);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [shared, setShared] = useState(false);

  const num = (v: number) => (isNaN(v) || v < 0 ? 0 : v);

  function frun(): Hasil {
    const t = FUP[paket];
    const daily = num(k4) * 7 + num(hd) * 2 + num(vc) * 1 + num(orang) * num(sos) * 0.8;
    const monthly = Math.round(daily * 30 + num(dl));
    const pct = Math.min(100, Math.round((monthly / t.f1) * 100));
    const barColor = monthly <= t.f1 ? "#16a34a" : "#dc2626";
    let html =
      "<p>Estimasi pemakaianmu: <strong>" +
      monthly +
      " GB/bulan</strong> (" +
      Math.round(daily * 10) / 10 +
      " GB/hari).</p>" +
      '<p style="font-size:13px; color:#666;">Pembanding data riil: rata-rata rumah tangga 711 GB/bln, mediannya 482 GB (OpenVault 2026).</p>' +
      '<div style="background:#eef2f7; border-radius:999px; height:16px; overflow:hidden; margin:10px 0 4px;"><div style="height:100%; width:' +
      pct +
      "%; background:" +
      barColor +
      '; border-radius:999px;"></div></div>' +
      '<p style="font-size:13px; color:#666;">' +
      pct +
      "% dari FUP pertama (" +
      t.f1 +
      " GB)</p>";
    let status = "";
    if (monthly <= t.f1) {
      status = "aman";
      html +=
        '<p style="background:#e6f7f3; border-radius:8px; padding:12px 14px;"><strong>AMAN bulan ini.</strong> Sisa ' +
        (t.f1 - monthly) +
        " GB sebelum FUP. Tapi tambah 1 TV 4K tiap malam (+210 GB) dan kamu mulai mepet.</p>";
    } else if (t.f2 && monthly > t.f2) {
      status = "fup2";
      const d2 = daily > 0 ? Math.min(30, Math.ceil(t.f2 / daily)) : 30;
      html +=
        '<p style="background:#fee2e2; border-radius:8px; padding:12px 14px;"><strong>KENA FUP 2x lipat.</strong> Sekitar tanggal <strong>' +
        d2 +
        "</strong> (bisa maju/mundur beberapa hari), " +
        t.hit +
        ", " +
        t.hit2 +
        ". Sisa bulan = buffering.</p>";
    } else {
      status = "fup1";
      const d1 = daily > 0 ? Math.min(30, Math.ceil(t.f1 / daily)) : 30;
      html +=
        '<p style="background:#fef3c7; border-radius:8px; padding:12px 14px;"><strong>KENA FUP.</strong> Sekitar tanggal <strong>' +
        d1 +
        "</strong> (bisa maju/mundur beberapa hari), " +
        t.hit +
        " sampai ganti bulan.</p>";
    }
    html +=
      '<p style="background:#e6f7f3; border-left:4px solid #037e64; border-radius:8px; padding:12px 14px; margin-top:10px;"><strong>Di XL SATU Fiber, angka di atas tidak ada artinya.</strong> Tanpa FUP — 250 Mbps tanggal 1 tetap 250 Mbps tanggal 30.</p>' +
      '<a href="https://wa.me/6287778999141?text=' +
      encodeURIComponent(
        `Halo kak, hasil simulatorku ${monthly} GB/bulan dan KENA FUP (${status}). Info paket XL SATU tanpa FUP dong`
      ) +
      '" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#037e64; color:#fff; padding:12px 24px; border-radius:8px; font-weight:700; text-decoration:none; margin-top:8px;">Bebas FUP via WA</a>';
    return { html, p: paket, status, gb: monthly };
  }

  const hitung = () => {
    const r = frun();
    setHasil(r);
    gtag("event", "fup_simulate", {
      gb_bulan: r.gb,
      status_fup: r.status,
      page_path: window.location.pathname,
    });
  };

  const share = () => {
    const r = frun();
    setHasil(r);
    const url = `https://xlsatusolo.com/wifi-tanpa-fup-unlimited/#fup-${r.p}-${r.status}-${r.gb}`;
    const doneFn = () => {
      setShared(true);
      gtag("event", "fup_share", { page_path: window.location.pathname });
      setTimeout(() => setShared(false), 3000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(doneFn).catch(() => prompt("Salin link ini:", url));
    } else {
      prompt("Salin link ini:", url);
    }
  };

  const numInput = (
    label: string,
    value: number,
    set: (v: number) => void,
    max: number
  ) => (
    <label>
      {label}{" "}
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => set(parseFloat(e.target.value) || 0)}
        style={INPUT}
      />
    </label>
  );

  return (
    <div
      id="sim-fup"
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderLeft: "4px solid #037e64",
        borderRadius: 8,
        padding: "20px 24px",
        margin: "24px 0",
      }}
    >
      <strong style={{ display: "block", marginBottom: 4, fontSize: 16 }}>
        Simulator: Cek Kapan Internetmu Kena FUP
      </strong>
      <p style={{ fontSize: 14, marginBottom: 12, color: "#555" }}>
        Isi kebiasaan harian. Lihat tanggal berapa kecepatanmu dipangkas di
        provider ber-FUP - vs aman di XL SATU Fiber.
      </p>
      <label
        style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 6 }}
        htmlFor="fup-paket"
      >
        Paket pembanding (ber-FUP)
      </label>
      <select
        id="fup-paket"
        value={paket}
        onChange={(e) => setPaket(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          fontSize: 15,
          marginBottom: 12,
        }}
      >
        <option value="30">Paket 30 Mbps (FUP 700 GB ke 1200 GB)</option>
        <option value="50">Paket 50 Mbps (FUP 1200 GB ke 2000 GB)</option>
        <option value="100">Paket 100 Mbps (FUP 2000 GB)</option>
        <option value="fwa">XL SATU Wireless / FWA (FUP 1024 GB)</option>
      </select>
      <div style={{ display: "grid", gap: 10, fontSize: 14, marginBottom: 14 }}>
        {numInput("Nonton TV 4K (jam/hari, serumah)", k4, setK4, 24)}
        {numInput("TV / YouTube HD (jam/hari, serumah)", hd, setHd, 24)}
        {numInput("Video call / WFH (jam/hari)", vc, setVc, 24)}
        {numInput("Sosmed / short video (jam/hari PER ORANG)", sos, setSos, 24)}
        {numInput("Penghuni yang aktif internetan (orang)", orang, setOrang, 20)}
        {numInput("Download besar/bulan (GB, mis. game)", dl, setDl, 2000)}
      </div>
      <button
        type="button"
        onClick={hitung}
        style={{
          width: "100%",
          background: "#037e64",
          color: "#fff",
          border: "none",
          padding: 12,
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Cek Nasib FUP-ku
      </button>
      {hasil && (
        <div
          id="fup-hasil"
          style={{ marginTop: 14, fontSize: 15 }}
          dangerouslySetInnerHTML={{ __html: hasil.html }}
        />
      )}
      {hasil && (
        <button
          type="button"
          onClick={share}
          style={{
            width: "100%",
            background: "#fff",
            color: "#026b55",
            border: "1.5px solid #037e64",
            padding: 10,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          {shared ? "Link Tersalin! Pamer ke yang masih kena FUP" : "Bagikan Hasil Ini"}
        </button>
      )}
      <p style={{ fontSize: 12, color: "#888", marginTop: 10 }}>
        Simulasi ilustrasi: tarif aktivitas dari Netflix/Zoom resmi; benchmark
        OpenVault OVBI 2026 &amp; APJII 2025. Angka aktual tiap provider dapat
        berbeda dan berubah sewaktu-waktu.
      </p>
    </div>
  );
}
