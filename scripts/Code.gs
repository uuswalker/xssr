// ============================================================
//  Code.gs — Database Lead & CRM Sales xlhomesolo.com
//  Google Apps Script — format & styling mirroring final xlsx
//  Webhook v5.1: token + validasi WA/nama/lokasi + dedup HP
//  v6.1: notifikasi WA tiap lead via Fonnte (anti-gagal)
//  v6.2: honeypot trap /trap/ → log ke sheet "Trap Log" tanpa notif
//  v6.3: COST GUARD — batasi notif Fonnte (per nomor 2/hari, global 30/jam).
//        Lead TETAP selalu disimpan; yang dibatasi hanya pesan WA.
//  v7.0: CRM SALES & SLA AUTOMATOR:
//        - Conditional formatting warna kolom 11 (Status Follow Up)
//        - Dropdown data validation kolom 11
//        - Sheet tab 'Dashboard Rekap' (KPI Scorecards, Wilayah, Coverage, Closing Rate)
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
  "Kota", "HOMEPASS_ID", "Link Maps", "Halaman", "Status Follow Up"
];

const COL_WIDTHS = [145, 180, 130, 90, 90, 300, 115, 120, 225, 165, 150]; // pixel

// ── MENU GOOGLE SHEETS ───────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 XL Home CRM")
    .addItem("📊 Buka / Perbarui Dashboard Rekap", "menuUpdateDashboard")
    .addItem("🎨 Format Sheet Lead & Status", "applyFormatting")
    .addItem("🔄 Reformat Semua Baris Data", "reformatAll")
    .addToUi();
}

function menuUpdateDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  createOrUpdateDashboardSummary(ss);
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✅ Dashboard Rekap berhasil diperbarui!");
}

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
  _applyConditionalFormatting(ws);
  _applyStatusDataValidation(ws);
  createOrUpdateDashboardSummary(ss);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✅ Formatting & Dashboard Rekap selesai diapply!");
}

// ── TITLE ROW (row 1) ────────────────────────────────────────
function _setupTitleRow(ws) {
  const lastCol = HEADERS.length;

  // Pastikan ada cukup baris di atas
  if (ws.getLastRow() < 3) {
    ws.insertRowsBefore(1, 3);
  }

  // Merge A1:K1
  const titleRange = ws.getRange(1, 1, 1, lastCol);
  titleRange.merge();
  titleRange
    .setValue("Database Lead — xlhomesolo.com")
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

    // Col 1: Timestamp
    ws.getRange(r, 1)
      .setNumberFormat("dd-mm-yyyy hh:mm")
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 2: Nama
    ws.getRange(r, 2)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 3: WhatsApp
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

    // Col 8: Homepass ID
    ws.getRange(r, 8)
      .setNumberFormat("@")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    // Col 9: Link Maps — formula otomatis dari lat/lon
    const linkCell = ws.getRange(r, 9);
    linkCell
      .setFormula(`=IF(ISBLANK(D${r}),"","https://maps.google.com/?q="&ROUND(D${r},6)&","&ROUND(E${r},6))`)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    // Col 10: Halaman
    ws.getRange(r, 10)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    // Col 11: Status Follow Up
    ws.getRange(r, 11)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");
  }
}

// ── CONDITIONAL FORMATTING STATUS FOLLOW UP (KOLOM 11) ────────
function _applyConditionalFormatting(ws) {
  const maxRows = Math.max(ws.getMaxRows(), 100);
  const statusRange = ws.getRange(DATA_START, 11, maxRows - DATA_START + 1, 1);

  // Filter out existing Column 11 rules to avoid duplicates
  const existingRules = ws.getConditionalFormatRules();
  const retainedRules = existingRules.filter(rule => {
    const ranges = rule.getRanges();
    return !ranges.some(r => r.getSheet().getName() === ws.getName() && r.getColumn() === 11);
  });

  const newRules = [];

  // Group 1: Hijau muda (#D1E7DD) untuk status: 'Deal', 'Pasang', 'Closing', 'Selesai'
  const greenKeywords = ["Deal", "Pasang", "Closing", "Selesai"];
  greenKeywords.forEach(kw => {
    newRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains(kw)
        .setBackground("#D1E7DD")
        .setFontColor("#0F5132")
        .setRanges([statusRange])
        .build()
    );
  });

  // Group 2: Kuning muda (#FFF3CD) untuk status: 'Follow Up', 'Proses', 'Menunggu', 'Chat'
  const yellowKeywords = ["Follow Up", "Proses", "Menunggu", "Chat"];
  yellowKeywords.forEach(kw => {
    newRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains(kw)
        .setBackground("#FFF3CD")
        .setFontColor("#664D03")
        .setRanges([statusRange])
        .build()
    );
  });

  // Group 3: Merah muda (#F8D7DA) untuk status: 'Pending', 'Baru', 'Belum Dihubungi'
  const redKeywords = ["Pending", "Baru", "Belum Dihubungi"];
  redKeywords.forEach(kw => {
    newRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains(kw)
        .setBackground("#F8D7DA")
        .setFontColor("#842029")
        .setRanges([statusRange])
        .build()
    );
  });

  ws.setConditionalFormatRules(retainedRules.concat(newRules));
}

// ── DATA VALIDATION DROPDOWN (KOLOM 11) ───────────────────────
function _applyStatusDataValidation(ws) {
  const maxRows = Math.max(ws.getMaxRows(), 100);
  const statusRange = ws.getRange(DATA_START, 11, maxRows - DATA_START + 1, 1);
  const statusList = [
    "Baru",
    "Belum Dihubungi",
    "Pending",
    "Follow Up",
    "Chat",
    "Proses",
    "Menunggu",
    "Deal",
    "Pasang",
    "Closing",
    "Selesai"
  ];
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusList, true)
    .setAllowInvalid(true)
    .build();
  statusRange.setDataValidation(rule);
}

// ── COLUMN WIDTHS ─────────────────────────────────────────────
function _setColumnWidths(ws) {
  COL_WIDTHS.forEach((w, i) => ws.setColumnWidth(i + 1, w));
}

// ── FREEZE + FILTER ───────────────────────────────────────────
function _freezeAndFilter(ws) {
  // Freeze 3 baris atas
  ws.setFrozenRows(HEADER_ROW);
  ws.setFrozenColumns(0);

  // Hapus filter lama
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
    true, true, true, true, true, true,
    COLOR.BORDER,
    SpreadsheetApp.BorderStyle.SOLID
  );
}

// ── FORMAT BARIS BARU OTOMATIS (onEdit trigger) ───────────────
function onEdit(e) {
  const ws = e.range.getSheet();
  if (ws.getName() !== SHEET_NAME) return;

  const row = e.range.getRow();
  if (row < DATA_START) return;

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
  ws.getRange(r, 8).setNumberFormat("@").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(r, 9)
    .setFormula(`=IF(ISBLANK(D${r}),"","https://maps.google.com/?q="&ROUND(D${r},6)&","&ROUND(E${r},6))`)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
}

// ── HELPER: STYLE KPI SCORECARD BOX ───────────────────────────
function _styleKpiCard(ws, startRow, startCol, label, formulaValue, formulaSub, theme) {
  // Label row
  const labelRange = ws.getRange(startRow, startCol, 1, 3);
  labelRange.merge()
    .setValue(label)
    .setBackground(theme.headerBg)
    .setFontColor(theme.headerFg)
    .setFontFamily("Arial")
    .setFontSize(9)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  // Value row
  const valRange = ws.getRange(startRow + 1, startCol, 1, 3);
  valRange.merge();
  if (formulaValue.startsWith("=")) {
    valRange.setFormula(formulaValue);
  } else {
    valRange.setValue(formulaValue);
  }
  valRange
    .setBackground(theme.bodyBg)
    .setFontColor(theme.valueFg)
    .setFontFamily("Arial")
    .setFontSize(20)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  if (theme.isPercent) {
    valRange.setNumberFormat("0.0%");
  } else {
    valRange.setNumberFormat("#,##0");
  }

  // Subtitle row
  const subRange = ws.getRange(startRow + 2, startCol, 1, 3);
  subRange.merge();
  if (formulaSub.startsWith("=")) {
    subRange.setFormula(formulaSub);
  } else {
    subRange.setValue(formulaSub);
  }
  subRange
    .setBackground(theme.bodyBg)
    .setFontColor("#5F6368")
    .setFontFamily("Arial")
    .setFontSize(8)
    .setFontStyle("italic")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  // Border card
  const cardBox = ws.getRange(startRow, startCol, 3, 3);
  cardBox.setBorder(
    true, true, true, true, false, false,
    theme.border,
    SpreadsheetApp.BorderStyle.SOLID
  );
}

// ── DASHBOARD REKAP & SALES SLA (v7.0) ─────────────────────────
function createOrUpdateDashboardSummary(ss) {
  if (!ss || typeof ss.getSheetByName !== "function") {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  const DASHBOARD_NAME = "Dashboard Rekap";
  let ws = ss.getSheetByName(DASHBOARD_NAME);

  if (!ws) {
    const leadSheet = ss.getSheetByName(SHEET_NAME);
    if (leadSheet) {
      ws = ss.insertSheet(DASHBOARD_NAME, leadSheet.getIndex());
    } else {
      ws = ss.insertSheet(DASHBOARD_NAME);
    }
  }

  // Set tab color
  try {
    ws.setTabColor("#1A56A0");
    const leadSheet = ss.getSheetByName(SHEET_NAME);
    if (leadSheet) leadSheet.setTabColor("#0F9D58");
  } catch (e) {}

  // Pastikan ada cukup kolom & baris
  if (ws.getMaxColumns() < 9) {
    ws.insertColumnsAfter(ws.getMaxColumns(), 9 - ws.getMaxColumns());
  }
  if (ws.getMaxRows() < 30) {
    ws.insertRowsAfter(ws.getMaxRows(), 30 - ws.getMaxRows());
  }

  // Clear format & konten lama agar sinkron rapi
  ws.clear();
  ws.clearFormats();
  ws.clearConditionalFormatRules();

  // Column Widths
  const colWidths = [20, 190, 100, 90, 25, 220, 100, 90, 20];
  colWidths.forEach((w, i) => ws.setColumnWidth(i + 1, w));

  // Row 1: Header Utama
  const titleRange = ws.getRange(1, 2, 1, 7);
  titleRange.merge()
    .setValue("DASHBOARD REKAP SALES & LEAD CRM — XLHOMESOLO.COM")
    .setBackground(COLOR.HEADER_BG)
    .setFontColor("#FFFFFF")
    .setFontFamily("Arial")
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  ws.setRowHeight(1, 40);

  // Row 2: Subtitle
  const subTitleRange = ws.getRange(2, 2, 1, 7);
  subTitleRange.merge()
    .setValue("📊 Monitoring Real-Time SLA Sales, Wilayah Coverage Solo Raya & Closing Rate")
    .setBackground(COLOR.TITLE_BG)
    .setFontColor(COLOR.TITLE_FG)
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  ws.setRowHeight(2, 26);

  // Row 3: Spacer
  ws.setRowHeight(3, 10);

  // Set Row Heights untuk KPI Cards
  ws.setRowHeight(4, 22);
  ws.setRowHeight(5, 34);
  ws.setRowHeight(6, 20);
  ws.setRowHeight(7, 10);
  ws.setRowHeight(8, 22);
  ws.setRowHeight(9, 34);
  ws.setRowHeight(10, 20);
  ws.setRowHeight(11, 12);

  // KPI Card 1: Total Lead Masuk (B4:D6)
  _styleKpiCard(
    ws, 4, 2,
    "📈 TOTAL LEAD MASUK",
    `=COUNTIF('${SHEET_NAME}'!$B$4:$B, "<>")`,
    `="Closing: " & TEXT(COUNTIF('${SHEET_NAME}'!$K$4:$K,"*Deal*")+COUNTIF('${SHEET_NAME}'!$K$4:$K,"*Pasang*")+COUNTIF('${SHEET_NAME}'!$K$4:$K,"*Closing*")+COUNTIF('${SHEET_NAME}'!$K$4:$K,"*Selesai*"), "#,##0") & " lead"`,
    {
      headerBg: "#D6E4F7", headerFg: "#1A56A0", bodyBg: "#F8FAFD",
      valueFg: "#1A56A0", border: "#1A56A0", isPercent: false
    }
  );

  // KPI Card 2: Closing Rate (% Deal) (F4:H6)
  _styleKpiCard(
    ws, 4, 6,
    "🎯 CLOSING RATE (% DEAL)",
    `=IF(B5=0, 0, (COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Deal*")+COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Pasang*")+COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Closing*")+COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Selesai*"))/B5)`,
    `="Target SLA: >15% Closing Rate"`,
    {
      headerBg: "#D1E7DD", headerFg: "#0F5132", bodyBg: "#F4FBF7",
      valueFg: "#0F5132", border: "#198754", isPercent: true
    }
  );

  // KPI Card 3: Tercover Fiber (B8:D10)
  _styleKpiCard(
    ws, 8, 2,
    "📶 TERCOVER FIBER (READY)",
    `=COUNTIFS('${SHEET_NAME}'!$B$4:$B, "<>", '${SHEET_NAME}'!$H$4:$H, "<>", '${SHEET_NAME}'!$H$4:$H, "<>-")`,
    `=IF(B5=0, "0.0%", TEXT(B9/B5, "0.0%")) & " dari total lead"`,
    {
      headerBg: "#D6E4F7", headerFg: "#1A56A0", bodyBg: "#F8FAFD",
      valueFg: "#1A56A0", border: "#1A56A0", isPercent: false
    }
  );

  // KPI Card 4: Request Pasang Baru (F8:H10)
  _styleKpiCard(
    ws, 8, 6,
    "📝 REQUEST PASANG BARU",
    `=MAX(0, B5 - B9)`,
    `=IF(B5=0, "0.0%", TEXT(F9/B5, "0.0%")) & " perlu survey ODP"`,
    {
      headerBg: "#FFF3CD", headerFg: "#664D03", bodyBg: "#FFFDF5",
      valueFg: "#B06000", border: "#FFC107", isPercent: false
    }
  );

  // ── TABEL 1: REKAP PER WILAYAH / KOTA (B12:D22) ──────────────
  ws.setRowHeight(12, 28);
  ws.setRowHeight(13, 24);

  const wilayahHeader = ws.getRange(12, 2, 1, 3);
  wilayahHeader.merge()
    .setValue("📍 REKAP LEAD PER WILAYAH / KOTA")
    .setBackground(COLOR.HEADER_BG)
    .setFontColor("#FFFFFF")
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  const wilayahSub = [["Kota / Kabupaten", "Jumlah Lead", "Rasio (%)"]];
  ws.getRange(13, 2, 1, 3)
    .setValues(wilayahSub)
    .setBackground(COLOR.TITLE_BG)
    .setFontColor(COLOR.TITLE_FG)
    .setFontFamily("Arial")
    .setFontSize(9)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  const wilayahData = [
    ["Solo / Surakarta",    `=COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Solo*") + COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Surakarta*")`],
    ["Sukoharjo",           `=COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Sukoharjo*")`],
    ["Karanganyar",         `=COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Karanganyar*")`],
    ["Klaten",              `=COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Klaten*")`],
    ["Boyolali",            `=COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Boyolali*")`],
    ["Sragen",              `=COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Sragen*")`],
    ["Wonogiri",            `=COUNTIF('${SHEET_NAME}'!$G$4:$G, "*Wonogiri*")`],
    ["Lainnya / Luar Solo", `=MAX(0, $B$5 - SUM(C14:C20))`],
  ];

  for (let i = 0; i < wilayahData.length; i++) {
    const row = 14 + i;
    ws.setRowHeight(row, 22);
    const isOdd = i % 2 === 0;
    const bg = isOdd ? COLOR.ROW_ODD : COLOR.ROW_EVEN;

    ws.getRange(row, 2).setValue(wilayahData[i][0]).setHorizontalAlignment("left").setVerticalAlignment("middle");
    ws.getRange(row, 3).setFormula(wilayahData[i][1]).setNumberFormat("#,##0").setHorizontalAlignment("center").setVerticalAlignment("middle");
    ws.getRange(row, 4).setFormula(`=IF($B$5=0, 0, C${row}/$B$5)`).setNumberFormat("0.0%").setHorizontalAlignment("center").setVerticalAlignment("middle");
    ws.getRange(row, 2, 1, 3).setBackground(bg).setFontFamily("Arial").setFontSize(9);
  }

  // Total Wilayah (Row 22)
  ws.setRowHeight(22, 24);
  ws.getRange(22, 2).setValue("TOTAL WILAYAH").setHorizontalAlignment("left").setVerticalAlignment("middle");
  ws.getRange(22, 3).setFormula("=SUM(C14:C21)").setNumberFormat("#,##0").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(22, 4).setFormula("=IF($B$5=0, 0, SUM(D14:D21))").setNumberFormat("0.0%").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(22, 2, 1, 3).setBackground(COLOR.TITLE_BG).setFontColor(COLOR.TITLE_FG).setFontFamily("Arial").setFontSize(9).setFontWeight("bold");

  _applyBorder(ws.getRange(12, 2, 11, 3));

  // ── TABEL 2: REKAP PIPELINE & STATUS FOLLOW UP (F12:H18) ─────
  const pipelineHeader = ws.getRange(12, 6, 1, 3);
  pipelineHeader.merge()
    .setValue("👥 REKAP PIPELINE & STATUS FOLLOW UP")
    .setBackground(COLOR.HEADER_BG)
    .setFontColor("#FFFFFF")
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  const pipelineSub = [["Status Follow Up", "Jumlah Lead", "Rasio (%)"]];
  ws.getRange(13, 6, 1, 3)
    .setValues(pipelineSub)
    .setBackground(COLOR.TITLE_BG)
    .setFontColor(COLOR.TITLE_FG)
    .setFontFamily("Arial")
    .setFontSize(9)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  const pipelineData = [
    { name: "Deal / Closing (Pasang)", formula: `=COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Deal*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Pasang*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Closing*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Selesai*")`, bg: "#D1E7DD", fg: "#0F5132" },
    { name: "Follow Up / Proses",      formula: `=COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Follow Up*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Proses*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Menunggu*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Chat*")`, bg: "#FFF3CD", fg: "#664D03" },
    { name: "Pending / Baru Masuk",    formula: `=COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Pending*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Baru*") + COUNTIF('${SHEET_NAME}'!$K$4:$K, "*Belum Dihubungi*")`, bg: "#F8D7DA", fg: "#842029" },
    { name: "Belum Diisi / Lainnya",   formula: `=MAX(0, $B$5 - SUM(G14:G16))`, bg: "#FFFFFF", fg: "#495057" },
  ];

  for (let i = 0; i < pipelineData.length; i++) {
    const row = 14 + i;
    ws.setRowHeight(row, 22);
    ws.getRange(row, 6).setValue(pipelineData[i].name).setHorizontalAlignment("left").setVerticalAlignment("middle");
    ws.getRange(row, 7).setFormula(pipelineData[i].formula).setNumberFormat("#,##0").setHorizontalAlignment("center").setVerticalAlignment("middle");
    ws.getRange(row, 8).setFormula(`=IF($B$5=0, 0, G${row}/$B$5)`).setNumberFormat("0.0%").setHorizontalAlignment("center").setVerticalAlignment("middle");
    ws.getRange(row, 6, 1, 3).setBackground(pipelineData[i].bg).setFontColor(pipelineData[i].fg).setFontFamily("Arial").setFontSize(9).setFontWeight("bold");
  }

  // Total Pipeline (Row 18)
  ws.setRowHeight(18, 24);
  ws.getRange(18, 6).setValue("TOTAL STATUS").setHorizontalAlignment("left").setVerticalAlignment("middle");
  ws.getRange(18, 7).setFormula("=SUM(G14:G17)").setNumberFormat("#,##0").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(18, 8).setFormula("=IF($B$5=0, 0, SUM(H14:H17))").setNumberFormat("0.0%").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(18, 6, 1, 3).setBackground(COLOR.TITLE_BG).setFontColor(COLOR.TITLE_FG).setFontFamily("Arial").setFontSize(9).setFontWeight("bold");

  _applyBorder(ws.getRange(12, 6, 7, 3));

  // ── TABEL 3: REKAP STATUS COVERAGE JARINGAN (F20:H24) ────────
  ws.setRowHeight(19, 10);
  ws.setRowHeight(20, 28);
  ws.setRowHeight(21, 24);

  const covHeader = ws.getRange(20, 6, 1, 3);
  covHeader.merge()
    .setValue("📶 REKAP STATUS COVERAGE JARINGAN")
    .setBackground(COLOR.HEADER_BG)
    .setFontColor("#FFFFFF")
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  const covSub = [["Kategori Coverage", "Jumlah Lead", "Rasio (%)"]];
  ws.getRange(21, 6, 1, 3)
    .setValues(covSub)
    .setBackground(COLOR.TITLE_BG)
    .setFontColor(COLOR.TITLE_FG)
    .setFontFamily("Arial")
    .setFontSize(9)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  ws.setRowHeight(22, 22);
  ws.getRange(22, 6).setValue("Tercover Fiber (Siap Pasang)").setHorizontalAlignment("left").setVerticalAlignment("middle");
  ws.getRange(22, 7).setFormula("=$B$9").setNumberFormat("#,##0").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(22, 8).setFormula("=IF($B$5=0, 0, G22/$B$5)").setNumberFormat("0.0%").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(22, 6, 1, 3).setBackground(COLOR.ROW_ODD).setFontFamily("Arial").setFontSize(9);

  ws.setRowHeight(23, 22);
  ws.getRange(23, 6).setValue("Request Pasang Baru (>300m)").setHorizontalAlignment("left").setVerticalAlignment("middle");
  ws.getRange(23, 7).setFormula("=$F$9").setNumberFormat("#,##0").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(23, 8).setFormula("=IF($B$5=0, 0, G23/$B$5)").setNumberFormat("0.0%").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(23, 6, 1, 3).setBackground(COLOR.ROW_EVEN).setFontFamily("Arial").setFontSize(9);

  ws.setRowHeight(24, 24);
  ws.getRange(24, 6).setValue("TOTAL COVERAGE").setHorizontalAlignment("left").setVerticalAlignment("middle");
  ws.getRange(24, 7).setFormula("=SUM(G22:G23)").setNumberFormat("#,##0").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(24, 8).setFormula("=IF($B$5=0, 0, SUM(H22:H23))").setNumberFormat("0.0%").setHorizontalAlignment("center").setVerticalAlignment("middle");
  ws.getRange(24, 6, 1, 3).setBackground(COLOR.TITLE_BG).setFontColor(COLOR.TITLE_FG).setFontFamily("Arial").setFontSize(9).setFontWeight("bold");

  _applyBorder(ws.getRange(20, 6, 5, 3));

  // ── FOOTER TIPS & OPERASIONAL SLA (Row 26) ───────────────────
  ws.setRowHeight(25, 12);
  ws.setRowHeight(26, 32);
  const footerRange = ws.getRange(26, 2, 1, 7);
  footerRange.merge()
    .setValue("💡 Tips Tim Sales: Update Kolom 11 ('Status Follow Up') di sheet 'Database Lead'. Seluruh KPI scorecards, persentase closing rate, dan status pipeline di dashboard ini terupdate otomatis secara real-time.")
    .setBackground("#EEF4FB")
    .setFontColor(COLOR.HEADER_BG)
    .setFontFamily("Arial")
    .setFontSize(8.5)
    .setFontStyle("italic")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  _applyBorder(footerRange);
}

// ── HELPER: PREDIKSI ALAMAT GOOGLE MAPS (REVERSE GEOCODING) ───
function _prediksiAlamatGoogleMaps(lat, lng) {
  try {
    if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) return "";
    const res = Maps.newGeocoder().reverseGeocode(Number(lat), Number(lng));
    if (res && res.status === "OK" && res.results && res.results.length > 0) {
      return res.results[0].formatted_address;
    }
  } catch (err) {
    console.log("GEOCODE-ERR:" + err.message);
  }
  return "";
}

// ── NOTIF WA: kirim ringkasan lead ke owner via Fonnte ─────────
function kirimNotifWA(nama, wa, alamat, kota, halaman, lat, lng, homepassId, jarakFiberM, coverage, homepassAddress, paket, odpParam) {
  try {
    // Normalisasi nomor HP ke format 08...
    let waDisplay = String(wa || "").trim();
    if (waDisplay.startsWith("62")) {
      waDisplay = "0" + waDisplay.slice(2);
    }

    // Normalisasi Nama Paket
    let paketDisplay = String(paket || "").trim();
    if (paketDisplay) {
      paketDisplay = paketDisplay
        .replace(/Saya minat paket /i, "")
        .replace(/Saya minat /i, "")
        .trim();
    }
    if (!paketDisplay || paketDisplay === "-") {
      paketDisplay = "Spark 250 Mbps";
    }

    // Jarak Fiber
    let jarakText = "-";
    if (jarakFiberM !== "" && jarakFiberM != null && !isNaN(Number(jarakFiberM))) {
      jarakText = "±" + Math.round(Number(jarakFiberM)) + " meter";
    } else if (jarakFiberM) {
      jarakText = String(jarakFiberM);
    }

    // Alamat dengan format "(atau disekitarnya)"
    let alamatFinal = String(alamat || "").trim();
    const isODP = alamatFinal.indexOf("(ODP:") !== -1 || (homepassAddress && alamatFinal === String(homepassAddress).trim());
    const isKoord = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(alamatFinal);
    if (!alamatFinal || isODP || isKoord) {
      const gMaps = _prediksiAlamatGoogleMaps(lat, lng);
      if (gMaps) {
        alamatFinal = gMaps;
      }
    }
    if (alamatFinal && !/(\([\s]*atau disekitarnya[\s]*\)|\[[\s]*atau disekitarnya[\s]*\])/i.test(alamatFinal)) {
      alamatFinal = alamatFinal + " (atau disekitarnya)";
    }

    // Homepass ID (dengan label "(atau disekitarnya)")
    let hpDisplay = "-";
    if (homepassId && String(homepassId).trim() !== "") {
      const cleanHp = String(homepassId).trim();
      hpDisplay = cleanHp.includes("atau disekitarnya") ? cleanHp : cleanHp + " (atau disekitarnya)";
    }

    // ODP Code
    let odpDisplay = String(odpParam || "").trim();
    if (!odpDisplay) {
      const odpMatch = String(homepassAddress || alamat || "").match(/ODP[:\s]+([A-Za-z0-9_-]+)/i);
      if (odpMatch) {
        odpDisplay = odpMatch[1];
      }
    }
    if (!odpDisplay || odpDisplay === "-") {
      odpDisplay = "Cek Jalur OWS";
    }

    // Google Maps Link
    const maps = (lat !== "" && lat != null && lng !== "" && lng != null)
      ? "https://maps.google.com/?q=" + lat + "," + lng : "-";

    const pesan = "🔥 LEAD BARU XL HOME SOLO\n" +
      "Nama: " + nama + " (" + waDisplay + ")\n" +
      "Paket: " + paketDisplay + "\n" +
      "Alamat: " + alamatFinal + "\n\n" +
      "📋 DATA OWS (INTERNAL SALES):\n" +
      "• Homepass ID: " + hpDisplay + "\n" +
      "• ODP: " + odpDisplay + "\n" +
      "• Jarak Fiber: " + jarakText + "\n" +
      "• Google Maps: " + maps;

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
    if (!(wa.length >= 9 && namaOk && ((latOk && lngOk) || alamatOk))) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "dropped-missing" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName(SHEET_NAME);
    const kota = data.kotaTerdeteksi || data.kota || "";
    let hpId = data.homepassId || "";
    const jarakFiber = (data.jarakFiberM !== "" && data.jarakFiberM != null) ? data.jarakFiberM : "";
    const cov = data.coverage || "";
    const hpAddr = data.homepassAddress || "";
    const paket = data.paket || "";

    // ── FILTER HOMEPASS ID RESMI OWS (BUANG UUID JIKA ADA) ────────
    hpId = String(hpId).trim();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(hpId)) {
      const parts = hpId.split(" - ");
      if (parts.length > 1 && !/^[0-9a-f]{8}-/i.test(parts[1])) {
        hpId = parts[1].trim();
      } else {
        hpId = "";
      }
    }

    // ── PREDIKSI ALAMAT FISIK JALAN / KELURAHAN (FAIL-SAFE) ───────
    let alamatFinal = String(data.alamat || "").trim();
    const isSyntheticODP = alamatFinal.indexOf("(ODP:") !== -1;
    const isKoord = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(alamatFinal);
    // Jika alamat fisik resmi OWS tersedia di hpAddr, selalu prioritaskan data resmi OWS
    if ((isSyntheticODP || isKoord || !alamatFinal) && hpAddr && hpAddr.indexOf("(ODP:") === -1) {
      alamatFinal = String(hpAddr).trim();
    } else if (!alamatFinal || isSyntheticODP || isKoord) {
      const gMaps = _prediksiAlamatGoogleMaps(data.latitude, data.longitude);
      if (gMaps) {
        alamatFinal = gMaps;
      }
    }

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
          const cur = ws.getRange(row, 1, 1, 11).getValues()[0];
          ws.getRange(row, 2).setValue(pilih(data.nama, cur[1]));
          ws.getRange(row, 4).setValue(pilih(data.latitude, cur[3]));
          ws.getRange(row, 5).setValue(pilih(data.longitude, cur[4]));
          ws.getRange(row, 6).setValue(pilih(alamatFinal, cur[5]));
          ws.getRange(row, 7).setValue(pilih(kota, cur[6]));
          ws.getRange(row, 8).setValue(pilih(hpId, cur[7]));
          ws.getRange(row, 10).setValue(pilih(data.halaman, cur[9]));
          _formatSingleRow(ws, row);
          const odp = data.odp || "";
          if (_bolehNotif(wa)) kirimNotifWA(pilih(data.nama, cur[1]), wa, pilih(alamatFinal, cur[5]), pilih(kota, cur[6]), pilih(data.halaman, cur[9]), pilih(data.latitude, cur[3]), pilih(data.longitude, cur[4]), pilih(hpId, cur[7]), jarakFiber, cov, hpAddr, paket, odp);
          return ContentService
            .createTextOutput(JSON.stringify({ status: "updated", row }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    const newRow = ws.getLastRow() + 1;
    ws.getRange(newRow, 1, 1, 11).setValues([[
      new Date(data.timestamp || Date.now()),
      String(data.nama || "").trim(),
      wa,
      (data.latitude ?? ""),
      (data.longitude ?? ""),
      alamatFinal,
      kota,
      hpId,
      "",   // Link Maps — diisi formula oleh _formatSingleRow
      data.halaman || "",
      data.status || "Baru",
    ]]);

    _formatSingleRow(ws, newRow);
    const odp = data.odp || "";
    if (_bolehNotif(wa)) kirimNotifWA(String(data.nama || "").trim(), wa, alamatFinal, kota, data.halaman || "", data.latitude, data.longitude, hpId, jarakFiber, cov, hpAddr, paket, odp);

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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName(SHEET_NAME);
  if (ws) {
    _applyDataFormatting(ws);
    _applyConditionalFormatting(ws);
    _applyStatusDataValidation(ws);
  }
  createOrUpdateDashboardSummary(ss);
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✅ Semua baris & Dashboard Rekap sudah direformat!");
}
