const fs = require('fs');
const path = require('path');
const puppeteer = require('C:/Users/uuswalker/.gemini/antigravity/brain/08f2ce9f-5520-426f-a434-fd0ea33a5456/scratch/node_modules/puppeteer-core');
const h3 = require('C:/Users/uuswalker/.gemini/antigravity/scratch/xssr/node_modules/h3-js');

const MERGED_JSON_PATH = 'C:/Users/uuswalker/.gemini/antigravity/scratch/xssr/data-mentah/homepass_dummy_merged.json';
const OUTPUT_SQL_PATH = 'C:/Users/uuswalker/.gemini/antigravity/scratch/xssr/data-mentah/homepass_dummy_d1.sql';
const DEVTOOLS_PORT_PATH = 'C:/Users/uuswalker/AppData/Local/Google/Chrome/User Data/DevToolsActivePort';
const DB_ID = '690219af-468a-4206-a10c-89581a9e0256'; // coverage-db (Solo Raya Master)
const ACCOUNT_ID = '1b43e6040ffcccca7c3d8066fc45f801';
const CHUNK_SIZE = 200;

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

async function main() {
  console.log('=== MEMULAI IMPORT DUMMY HOMEPASS KE CLOUDFLARE D1 ===');
  
  // 1. Read JSON
  console.log(`Membaca ${MERGED_JSON_PATH}...`);
  const rawData = JSON.parse(fs.readFileSync(MERGED_JSON_PATH, 'utf8'));
  const totalRows = rawData.length;
  console.log(`Total data terbaca: ${totalRows} baris`);

  // 2. Prepare SQL Chunks and write SQL file
  console.log('Menghasilkan H3 index dan memperbarui file SQL lokal...');
  const chunks = [];
  let sqlFileContent = `-- Batch Insert Homepass Dummy Solo Raya ke Cloudflare D1 (coverage-db)\n-- Total Data: ${totalRows} rows\n\n`;

  for (let i = 0; i < totalRows; i += CHUNK_SIZE) {
    const slice = rawData.slice(i, i + CHUNK_SIZE);
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
    
    const valueClauses = slice.map(item => {
      const h3Idx = h3.latLngToCell(item.lat, item.lng, 10);
      const cleanAddress = escapeSql(item.address);
      const cleanCluster = escapeSql(item.cluster);
      const cleanCity = escapeSql(item.city);
      const cleanOdp = escapeSql(item.odp);
      const cleanStatus = escapeSql(item.status);
      return `('${item.id}', '${h3Idx}', ${item.lat}, ${item.lng}, '${cleanCluster}', '${cleanStatus}', '${cleanOdp}', '${cleanCity}', '${cleanAddress}')`;
    }).join(',\n');

    const chunkSql = `INSERT OR REPLACE INTO homepass (id, h3_res10, lat, lng, cluster_name, status, odp_id, city, address) VALUES\n${valueClauses};`;
    chunks.push(chunkSql);
    sqlFileContent += `-- Chunk ${chunkNum}\n${chunkSql}\n\n`;
  }

  fs.writeFileSync(OUTPUT_SQL_PATH, sqlFileContent, 'utf8');
  console.log(`✓ File SQL lokal diperbarui: ${OUTPUT_SQL_PATH} (${chunks.length} chunks)`);

  // 3. Connect to Chrome
  console.log('Menghubungkan ke sesi Chrome...');
  const portData = fs.readFileSync(DEVTOOLS_PORT_PATH, 'utf8').trim().split('\n');
  const port = portData[0].trim();
  const wsPath = portData[1].trim();
  const wsEndpoint = `ws://127.0.0.1:${port}${wsPath}`;

  const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint, defaultViewport: null });
  const pages = await browser.pages();
  const cfPage = pages.find(p => p.url().includes('dash.cloudflare.com'));
  if (!cfPage) {
    throw new Error('Tab Cloudflare tidak ditemukan di Chrome!');
  }

  // Get dynamic token or use current atok
  const atok = '1794490067-ATOK27592a867f9de01d0a365d4937d5fe95f42589a5e480ad18';

  // Check initial count
  const initialCountRes = await cfPage.evaluate(async (acc, db, token) => {
    const res = await fetch(`https://dash.cloudflare.com/api/v4/accounts/${acc}/d1/database/${db}/raw`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-cross-site-security': 'dash', 'x-atok': token },
      body: JSON.stringify({ sql: "SELECT count(*) as total FROM homepass;" })
    });
    return await res.json();
  }, ACCOUNT_ID, DB_ID, atok);

  const initialCount = initialCountRes?.result?.[0]?.results?.rows?.[0]?.[0] || 'Unknown';
  console.log(`Jumlah baris awal di Cloudflare D1 (homepass): ${initialCount}`);

  // 4. Execute Chunks
  console.log(`\nMengeksekusi ${chunks.length} batch ke Cloudflare D1...`);
  let successCount = 0;
  let totalRowsInserted = 0;
  const startTime = Date.now();

  for (let c = 0; c < chunks.length; c++) {
    const chunkSql = chunks[c];
    const chunkNum = c + 1;
    const rowsInChunk = Math.min(CHUNK_SIZE, totalRows - c * CHUNK_SIZE);

    try {
      const res = await cfPage.evaluate(async (acc, db, token, query) => {
        const r = await fetch(`https://dash.cloudflare.com/api/v4/accounts/${acc}/d1/database/${db}/raw`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-cross-site-security': 'dash', 'x-atok': token },
          body: JSON.stringify({ sql: query })
        });
        return await r.json();
      }, ACCOUNT_ID, DB_ID, atok, chunkSql);

      if (res && res.success) {
        successCount++;
        totalRowsInserted += rowsInChunk;
        process.stdout.write(`\r[Batch ${chunkNum}/${chunks.length}] Sukses: ${totalRowsInserted}/${totalRows} baris (${((totalRowsInserted/totalRows)*100).toFixed(1)}%)`);
      } else {
        console.error(`\n[Gagal di Batch ${chunkNum}]:`, JSON.stringify(res?.errors || res));
      }
    } catch (err) {
      console.error(`\n[Error di Batch ${chunkNum}]:`, err.message);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✓ Selesai mengeksekusi dalam ${duration} detik!`);
  console.log(`Batch berhasil: ${successCount}/${chunks.length}`);

  // 5. Check final count
  const finalCountRes = await cfPage.evaluate(async (acc, db, token) => {
    const res = await fetch(`https://dash.cloudflare.com/api/v4/accounts/${acc}/d1/database/${db}/raw`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-cross-site-security': 'dash', 'x-atok': token },
      body: JSON.stringify({ sql: "SELECT count(*) as total FROM homepass;" })
    });
    return await res.json();
  }, ACCOUNT_ID, DB_ID, atok);

  const finalCount = finalCountRes?.result?.[0]?.results?.rows?.[0]?.[0] || 'Unknown';
  console.log(`Jumlah baris akhir di Cloudflare D1 (homepass): ${finalCount}`);
  console.log(`Pertambahan baris: +${finalCount - initialCount}`);

  await browser.disconnect();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
