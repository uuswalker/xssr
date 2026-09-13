/* ============================================================
   Apps Script — Google Sheets webhook lead capture xlsatusolo.com
   Deploy sebagai Web App (Execute as: Me, whoHasAccess: Anyone).

   RIWAYAT:
   - v1-v4: sheet 'Lead' (append mentah, soft-lead merge, dedup HP, token+validasi).
   - v5.1: WAJIB WA+nama, lokasi cukup alamat ATAU lat/lng.
   - v6 (13 Sep 2026): sheet baru 'Database Lead' (header baris 3,
     format zebra + freeze + filter) — doPost gabungan: token,
     validasi v5.1, dedup HP, mapping kotaTerdeteksi.
   ============================================================ */

// ── KONFIGURASI ─────────────────────────────────────────────
var SHEET_NAME   = "Database Lead";
var HEADER_ROW   = 3;
var DATA_START   = 4;
var SECRET_TOKEN = "xlsr_2026_s0lor4y4"; // sama dengan TOKEN di cek-lokasi.js
var FONNTE_TOKEN = "GANTI_DENGAN_TOKEN_FONNTE"; // token device Fonnte (isi di Apps Script saja)
var NOMOR_NOTIF = "6287778999141"; // WA owner penerima notif lead (format 62, tanpa 0)

var COLOR = {
  HEADER_BG  : "#1A56A0",
  HEADER_FG  : "#FFFFFF",
  TITLE_BG   : "#D6E4F7",
  TITLE_FG   : "#1A56A0",
  ROW_ODD    : "#EEF4FB",
  ROW_EVEN   : "#FFFFFF",
  BORDER     : "#B8CCE4",
};

var HEADERS = [
  "Timestamp", "Nama", "WhatsApp",
  "Latitude", "Longitude", "Alamat",
  "Kota", "Link Maps", "Halaman", "Status Follow Up"
];

var COL_WIDTHS = [145, 180, 130, 90, 90, 300, 115, 225, 165, 150]; // pixel

// ── ENTRY POINT: jalankan sekali untuk apply semua formatting ─
function applyFormatting() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws   = ss.getSheetByName(SHEET_NAME);

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
  SpreadsheetApp.getUi().alert("Formatting selesai diapply!");
}

// ── TITLE ROW (row 1) ────────────────────────────────────────
function _setupTitleRow(ws) {
  var lastCol = HEADERS.length;

  if (ws.getLastRow() < 3) {
    ws.insertRowsBefore(1, 3);
  }

  var titleRange = ws.getRange(1, 1, 1, lastCol);
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

  ws.setRowHeight(2, 8);
  ws.getRange(2, 1, 1, lastCol).setBackground("#FFFFFF");
}

// ── HEADER ROW (row 3) ───────────────────────────────────────
function _setupHeaderRow(ws) {
  var headerRange = ws.getRange(HEADER_ROW, 1, 1, HEADERS.length);

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
  var lastRow = ws.getLastRow();
  if (lastRow < DATA_START) return;

  for (var r = DATA_START; r <= lastRow; r++) {
    _formatSingleRow(ws, r);
  }
}

// ── COLUMN WIDTHS ─────────────────────────────────────────────
function _setColumnWidths(ws) {
  COL_WIDTHS.forEach(function (w, i) { ws.setColumnWidth(i + 1, w); });
}

// ── FREEZE + FILTER ───────────────────────────────────────────
function _freezeAndFilter(ws) {
  ws.setFrozenRows(HEADER_ROW);
  ws.setFrozenColumns(0);

  var lastRow = ws.getLastRow();
  var lastCol = HEADERS.length;
  if (lastRow >= HEADER_ROW) {
    ws.getRange(HEADER_ROW, 1, lastRow - HEADER_ROW + 1, lastCol)
      .createFilter();
  }
}

// ── BORDER HELPER ─────────────────────────────────────────────
function _applyBorder(range) {
  range.setBorder(
    true, true, true, true, true, true,
    COLOR.BORDER,
    SpreadsheetApp.BorderStyle.SOLID
  );
}

// ── FORMAT SATU BARIS (dipakai onEdit & webhook) ──────────────
function _formatSingleRow(ws, r) {
  var isOdd = (r - DATA_START) % 2 === 0;
  var rowBg = isOdd ? COLOR.ROW_ODD : COLOR.ROW_EVEN;
  var rowRange = ws.getRange(r, 1, 1, HEADERS.length);

  rowRange.setBackground(rowBg).setFontFamily("Arial").setFontSize(9);
  _applyBorder(rowRange);
  ws.setRowHeight(r, 22);

  ws.getRange(r, 1).setNumberFormat("dd-mm-yyyy hh:mm").setVerticalAlignment("middle").setHorizontalAlignment("left");
  ws.getRange(r, 3).setNumberFormat("@").setVerticalAlignment("middle").setHorizontalAlignment("left");
  ws.getRange(r, 4).setNumberFormat("0.000000").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(r, 5).setNumberFormat("0.000000").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(r, 6).setWrap(true).setHorizontalAlignment("left").setVerticalAlignment("middle");
  ws.getRange(r, 8)
    .setFormula("=IF(ISBLANK(D" + r + '),"","https://maps.google.com/?q="&ROUND(D' + r + ",6)&\",\"&ROUND(E" + r + ",6))")
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
}

// ── NOTIF WA: kirim ringkasan lead ke owner via Fonnte ─────────
// Gagal kirim = lead tetap tersimpan (try/catch di dalam).
function kirimNotifWA(nama, wa, alamat, kota, halaman) {
  try {
    var pesan = "Lead baru xlsatusolo.com\nNama: " + nama + "\nWA: " + wa +
      "\nAlamat: " + alamat + "\nKota: " + kota + "\nHalaman: " + halaman;
    var res = UrlFetchApp.fetch("https://api.fonnte.com/send", {
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

// ── WEBHOOK: Terima lead dari website (v5.1 gabungan) ─────────
function doPost(e) {
  try {
    var json = JSON.parse(e.postData.contents);
    if (!json.token || json.token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "forbidden" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var norm = function (w) { return String(w || "").replace(/\D/g, "").replace(/^0/, "62"); };
    var wa = norm(json.whatsapp);
    var namaOk = String(json.nama || "").trim().length >= 2;
    var latOk = !isNaN(Number(json.latitude)) && String(json.latitude == null ? "" : json.latitude).trim() !== "";
    var lngOk = !isNaN(Number(json.longitude)) && String(json.longitude == null ? "" : json.longitude).trim() !== "";
    var alamatOk = String(json.alamat || "").trim().length >= 5;
    if (!(wa.length >= 9 && namaOk && ((latOk && lngOk) || alamatOk))) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "dropped-missing" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ws = ss.getSheetByName(SHEET_NAME);
    var kota = json.kotaTerdeteksi || json.kota || "";

    var lastRow = ws.getLastRow();
    if (lastRow >= DATA_START) {
      var waVals = ws.getRange(DATA_START, 3, lastRow - DATA_START + 1, 1).getValues();
      for (var r = waVals.length - 1; r >= 0; r--) {
        if (waVals[r][0] && norm(waVals[r][0]) === wa) {
          var row = r + DATA_START;
          var pilih = function (baru, lama) {
            var b = String(baru == null ? "" : baru).trim();
            return (b && b !== "undefined" && b !== "null") ? b : String(lama == null ? "" : lama);
          };
          var cur = ws.getRange(row, 1, 1, 10).getValues()[0];
          ws.getRange(row, 2).setValue(pilih(json.nama, cur[1]));
          ws.getRange(row, 4).setValue(pilih(json.latitude, cur[3]));
          ws.getRange(row, 5).setValue(pilih(json.longitude, cur[4]));
          ws.getRange(row, 6).setValue(pilih(json.alamat, cur[5]));
          ws.getRange(row, 7).setValue(pilih(kota, cur[6]));
          ws.getRange(row, 9).setValue(pilih(json.halaman, cur[8]));
          _formatSingleRow(ws, row);
          kirimNotifWA(pilih(json.nama, cur[1]), wa, pilih(json.alamat, cur[5]), pilih(kota, cur[6]), pilih(json.halaman, cur[8]));
          return ContentService
            .createTextOutput(JSON.stringify({ status: "updated", row: row }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    var newRow = ws.getLastRow() + 1;
    ws.getRange(newRow, 1, 1, 10).setValues([[
      new Date(json.timestamp || Date.now()),
      String(json.nama || "").trim(),
      wa,
      (json.latitude == null ? "" : json.latitude),
      (json.longitude == null ? "" : json.longitude),
      String(json.alamat || "").trim(),
      kota,
      "",
      json.halaman || "",
      json.status || ""
    ]]);

    _formatSingleRow(ws, newRow);
    kirimNotifWA(String(json.nama || "").trim(), wa, String(json.alamat || "").trim(), kota, json.halaman || "");

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
  var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  _applyDataFormatting(ws);
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("Semua baris sudah direformat!");
}
