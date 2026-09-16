// ============================================================
//  Code.gs — Database Lead xlsatusolo.com
//  Google Apps Script — format & styling mirroring final xlsx
//  Webhook v5.1: token + validasi WA/nama/lokasi + dedup HP
//  v6.1: notifikasi WA tiap lead via Fonnte (anti-gagal)
//  v6.2: honeypot trap /trap/ → log ke sheet "Trap Log" tanpa notif
//  v6.3: COST GUARD — batasi notif Fonnte (per nomor 2/hari, global 30/jam).
//        Lead TETAP selalu disimpan; yang dibatasi hanya pesan WA.
//  CATATAN: file ini cermin repo. Token asli hanya di Apps Script live.
// ============================================================

// ── KONFIGURASI ─────────────────────────────────────────────
const SHEET_NAME   = "Database Lead";
const HEADER_ROW   = 3;   // baris header (1=title, 2=spacer, 3=header)
const DATA_START   = 4;   // baris data mulai
const SECRET_TOKEN = "xlsr_2026_s0lor4y4"; // sama dengan TOKEN di cek-lokasi.js
const FONNTE_TOKEN = "GANTI_DENGAN_TOKEN_FONNTE"; // token device, isi di Apps Script live saja
const NOMOR_NOTIF  = "6287778999141"; // WA owner penerima notif lead (format 62, tanpa 0)

// Batas notif (v6.3)
const NOTIF_MAX_PER_NOMOR_HARI = 2;
const NOTIF_MAX_GLOBAL_JAM     = 30;

const COLOR = {
  HEADER_BG  : "#1A56A0",
  HEADER_FG  : "#FFFFFF",
  TITLE_BG   : "#D6E4F7",
  TITLE_FG   : "#1A56A0",
  ROW_ODD    : "#EEF4FB",
  ROW_EVEN   : "#FFFFFF",
  BORDER     : "#B8CCE4",
};

const HEADERS = [
  "Timestamp", "Nama", "WhatsApp",
  "Latitude", "Longitude", "Alamat",
  "Kota", "Link Maps", "Halaman", "Status Follow Up"
];

const COL_WIDTHS = [145, 180, 130, 90, 90, 300, 115, 225, 165, 150]; // pixel

// ── ENTRY POINT: jalankan sekali untuk apply semua formatting ─
function applyFormatting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ws   = ss.getSheetByName(SHEET_NAME);

  if (!ws) {
    ws = ss.getActiveSheet();
    ws.setName(SHEET_NAME);
  }

  _setupTitleRow(ws);
  _setupHeaderRow(ws);
  _applyDataFormatting(ws);
  _setColumnWidths(ws);
  _freezeAndFilter(ws);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✅ Formatting selesai diapply!");
}

// ── TITLE ROW (row 1) ────────────────────────────────────────
function _setupTitleRow(ws) {
  const lastCol = HEADERS.length;

  // Pastikan ada cukup baris di atas
  if (ws.getLastRow() < 3) {
    ws.insertRowsBefore(1, 3);
  }

  // Merge A1:J1
  const titleRange = ws.getRange(1, 1, 1, lastCol);
  titleRange.merge();
  titleRange
    .setValue("Database Lead — xlsatusolo.com")
    .setBackground(COLOR.TITLE_BG)
    .setFontColor(COLOR.TITLE_FG)
    .setFontFamily("Arial")
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  ws.setRowHeight(1, 36);

  // Row 2 = spacer
  ws.setRowHeight(2, 8);
  ws.getRange(2, 1, 1, lastCol).setBackground("#FFFFFF");
}

// ── HEADER ROW (row 3) ───────────────────────────────────────
function _setupHeaderRow(ws) {
  const headerRange = ws.getRange(HEADER_ROW, 1, 1, HEADERS.length);

  headerRange
    .setValues([HEADERS])
    .setBackground(COLOR.HEADER_BG)
    .setFontColor(COLOR.HEADER_FG)
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  _applyBorder(headerRange);
  ws.setRowHeight(HEADER_ROW, 40);
}

// ── DATA ROWS ─────────────────────────────────────────────────
function _applyDataFormatting(ws) {
  const lastRow = ws.getLastRow();
  if (lastRow < DATA_START) return;

  for (let r = DATA_START; r <= lastRow; r++) {
    const isOdd    = (r - DATA_START) % 2 === 0;  // row pertama = odd
    const rowBg    = isOdd ? COLOR.ROW_ODD : COLOR.ROW_EVEN;
    const rowRange = ws.getRange(r, 1, 1, HEADERS.length);

    // Background zebra
    rowRange.setBackground(rowBg);
    rowRange.setFontFamily("Arial").setFontSize(9).setFontColor("#000000");
    _applyBorder(rowRange);
    ws.setRowHeight(r, 22);

    // Col 1: Timestamp — format tanggal
    ws.getRange(r, 1)
      .setNumberFormat("dd-mm-yyyy hh:mm")
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 2: Nama
    ws.getRange(r, 2)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 3: WhatsApp — plain text, jangan jadi angka
    ws.getRange(r, 3)
      .setNumberFormat("@")
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 4: Latitude
    ws.getRange(r, 4)
      .setNumberFormat("0.000000")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    // Col 5: Longitude
    ws.getRange(r, 5)
      .setNumberFormat("0.000000")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    // Col 6: Alamat
    ws.getRange(r, 6)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle")
      .setWrap(true);

    // Col 7: Kota
    ws.getRange(r, 7)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 8: Link Maps — formula otomatis dari lat/lon
    const linkCell = ws.getRange(r, 8);
    linkCell
      .setFormula(`=IF(ISBLANK(D${r}),"","https://maps.google.com/?q="&ROUND(D${r},6)&","&ROUND(E${r},6))`)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    // Col 9: Halaman
    ws.getRange(r, 9)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 10: Status Follow Up
    ws.getRange(r, 10)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");
  }
}

// ── COLUMN WIDTHS ─────────────────────────────────────────────
function _setColumnWidths(ws) {
  COL_WIDTHS.forEach((w, i) => ws.setColumnWidth(i + 1, w));
}

// ── FREEZE + FILTER ───────────────────────────────────────────
function _freezeAndFilter(ws) {
  // Freeze 3 baris atas (title + spacer + header)
  ws.setFrozenRows(HEADER_ROW);
  ws.setFrozenColumns(0);

  // Hapus filter lama dulu biar tidak error createFilter ganda
  const existing = ws.getFilter();
  if (existing) existing.remove();

  // Auto-filter di header row
  const lastRow = ws.getLastRow();
  const lastCol = HEADERS.length;
  if (lastRow >= HEADER_ROW) {
    ws.getRange(HEADER_ROW, 1, lastRow - HEADER_ROW + 1, lastCol)
      .createFilter();
  }
}

// ── BORDER HELPER ─────────────────────────────────────────────
function _applyBorder(range) {
  range.setBorder(
    true, true, true, true, true, true,   // top,left,bottom,right,vertical,horizontal
    COLOR.BORDER,
    SpreadsheetApp.BorderStyle.SOLID
  );
}

// ── FORMAT BARIS BARU OTOMATIS (onEdit trigger) ───────────────
// Pasang trigger: Extensions > Apps Script > Triggers > onEdit (event: On edit)
function onEdit(e) {
  const ws = e.range.getSheet();
  if (ws.getName() !== SHEET_NAME) return;

  const row = e.range.getRow();
  if (row < DATA_START) return;

  // Cukup reformat baris yang diedit
  _formatSingleRow(ws, row);
}

// ── FORMAT SATU BARIS (dipakai onEdit & webhook) ──────────────
function _formatSingleRow(ws, r) {
  const isOdd = (r - DATA_START) % 2 === 0;
  const rowBg = isOdd ? COLOR.ROW_ODD : COLOR.ROW_EVEN;
  const rowRange = ws.getRange(r, 1, 1, HEADERS.length);

  rowRange.setBackground(rowBg).setFontFamily("Arial").setFontSize(9);
  _applyBorder(rowRange);
  ws.setRowHeight(r, 22);

  ws.getRange(r, 1).setNumberFormat("dd-mm-yyyy hh:mm").setVerticalAlignment("middle").setHorizontalAlignment("left");
  ws.getRange(r, 3).setNumberFormat("@").setVerticalAlignment("middle").setHorizontalAlignment("left");
  ws.getRange(r, 4).setNumberFormat("0.000000").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(r, 5).setNumberFormat("0.000000").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(r, 6).setWrap(true).setHorizontalAlignment("left").setVerticalAlignment("middle");
  ws.getRange(r, 8)
    .setFormula(`=IF(ISBLANK(D${r}),"","https://maps.google.com/?q="&ROUND(D${r},6)&","&ROUND(E${r},6))`)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
}

// ── NOTIF WA: kirim ringkasan lead ke owner via Fonnte ─────────
// Gagal kirim = lead tetap tersimpan (try/catch di dalam).
function kirimNotifWA(nama, wa, alamat, kota, halaman, lat, lng) {
  try {
    const d = new Date();
    const pad = (n) => (n < 10 ? "0" : "") + n;
    const waktu = pad(d.getDate()) + "-" + pad(d.getMonth() + 1) + "-" + d.getFullYear() +
      " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
    const maps = (lat !== "" && lat != null && lng !== "" && lng != null)
      ? "https://maps.google.com/?q=" + lat + "," + lng : "-";
    const pesan = "Lead baru xlsatusolo.com\nWaktu: " + waktu + "\nNama: " + nama + "\nWA: " + wa +
      "\nAlamat: " + alamat + "\nKota: " + kota + "\nMaps: " + maps + "\nHalaman: " + halaman;
    const res = UrlFetchApp.fetch("https://api.fonnte.com/send", {
      method: "post",
      headers: { Authorization: FONNTE_TOKEN },
      payload: { target: NOMOR_NOTIF, message: pesan },
      muteHttpExceptions: true
    });
    console.log("FONNTE:" + res.getContentText());
  } catch (err) {
    console.log("FONNTE-ERR:" + err.message);
  }
}

// ── COST GUARD (v6.3): batasi notif, lead TETAP selalu disimpan ──
// Per nomor: maks NOTIF_MAX_PER_NOMOR_HARI per 24 jam.
// Global: maks NOTIF_MAX_GLOBAL_JAM per jam rolling.
// Gagal baca cache = fail-open (tetap kirim, lead tidak hilang).
function _bolehNotif(wa) {
  try {
    const cache = CacheService.getScriptCache();
    const gKey = "nG_" + Math.floor(Date.now() / 3600000);
    const g = parseInt(cache.get(gKey) || "0", 10);
    if (g >= NOTIF_MAX_GLOBAL_JAM) { console.log("COSTGUARD: global cap"); return false; }
    const pKey = "nP_" + wa;
    const p = parseInt(cache.get(pKey) || "0", 10);
    if (p >= NOTIF_MAX_PER_NOMOR_HARI) { console.log("COSTGUARD: per-nomor cap " + wa); return false; }
    cache.put(gKey, String(g + 1), 3600);
    cache.put(pKey, String(p + 1), 86400);
    return true;
  } catch (e) { return true; }
}

// ── HONEYPOT TRAP LOG (v6.2): catat hit ke /trap/ — tanpa notif ──
function _logTrap(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ws = ss.getSheetByName("Trap Log");
  if (!ws) {
    ws = ss.insertSheet("Trap Log");
    ws.getRange(1, 1, 1, 5).setValues([["Timestamp", "User-Agent", "URL", "Referrer", "Client-TS"]]);
    ws.setFrozenRows(1);
  }
  ws.appendRow([new Date(), String(data.ua || ""), String(data.href || ""),
    String(data.ref || ""), String(data.ts || "")]);
}

// ── WEBHOOK: Terima lead dari website (v5.1 gabungan) ─────────
// URL Deploy as Web App → sudah dipasang di cek-lokasi.js
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data.token || data.token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "forbidden" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    // ── HONEYPOT TRAP (v6.2): catat hit /trap/ tanpa notif ──
    if (data.action === "trap") {
      _logTrap(data);
      return ContentService
        .createTextOutput(JSON.stringify({ status: "ok-trap" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const norm = (w) => String(w || "").replace(/\D/g, "").replace(/^0/, "62");
    const wa = norm(data.whatsapp);
    const namaOk = String(data.nama || "").trim().length >= 2;
    const latOk = !isNaN(Number(data.latitude)) && String(data.latitude ?? "").trim() !== "";
    const lngOk = !isNaN(Number(data.longitude)) && String(data.longitude ?? "").trim() !== "";
    const alamatOk = String(data.alamat || "").trim().length >= 5;
    // WAJIB: WA + nama, lokasi cukup pin peta ATAU alamat teks (ngetest 123 lolos kalau WA ada)
    if (!(wa.length >= 9 && namaOk && ((latOk && lngOk) || alamatOk))) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "dropped-missing" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName(SHEET_NAME);
    const kota = data.kotaTerdeteksi || data.kota || "";

    // DEDUP BY NOMOR HP: update baris terbaru milik nomor ini
    const lastRow = ws.getLastRow();
    if (lastRow >= DATA_START) {
      const waVals = ws.getRange(DATA_START, 3, lastRow - DATA_START + 1, 1).getValues();
      for (let r = waVals.length - 1; r >= 0; r--) {
        if (waVals[r][0] && norm(waVals[r][0]) === wa) {
          const row = r + DATA_START;
          const pilih = (baru, lama) => {
            const b = String(baru ?? "").trim();
            return (b && b !== "undefined" && b !== "null") ? b : String(lama ?? "");
          };
          const cur = ws.getRange(row, 1, 1, 10).getValues()[0];
          ws.getRange(row, 2).setValue(pilih(data.nama, cur[1]));
          ws.getRange(row, 4).setValue(pilih(data.latitude, cur[3]));
          ws.getRange(row, 5).setValue(pilih(data.longitude, cur[4]));
          ws.getRange(row, 6).setValue(pilih(data.alamat, cur[5]));
          ws.getRange(row, 7).setValue(pilih(kota, cur[6]));
          ws.getRange(row, 9).setValue(pilih(data.halaman, cur[8]));
          _formatSingleRow(ws, row);
          if (_bolehNotif(wa)) kirimNotifWA(pilih(data.nama, cur[1]), wa, pilih(data.alamat, cur[5]), pilih(kota, cur[6]), pilih(data.halaman, cur[8]), pilih(data.latitude, cur[3]), pilih(data.longitude, cur[4]));
          return ContentService
            .createTextOutput(JSON.stringify({ status: "updated", row }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    const newRow = ws.getLastRow() + 1;
    ws.getRange(newRow, 1, 1, 10).setValues([[
      new Date(data.timestamp || Date.now()),
      String(data.nama || "").trim(),
      wa,
      (data.latitude ?? ""),
      (data.longitude ?? ""),
      String(data.alamat || "").trim(),
      kota,
      "",   // Link Maps — diisi formula oleh _formatSingleRow
      data.halaman || "",
      data.status || "",
    ]]);

    _formatSingleRow(ws, newRow);
    if (_bolehNotif(wa)) kirimNotifWA(String(data.nama || "").trim(), wa, String(data.alamat || "").trim(), kota, data.halaman || "", data.latitude, data.longitude);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", row: newRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── REFORMAT ULANG SEMUA BARIS (kalau ada perubahan masif) ────
function reformatAll() {
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  _applyDataFormatting(ws);
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✅ Semua baris sudah direformat!");
}
