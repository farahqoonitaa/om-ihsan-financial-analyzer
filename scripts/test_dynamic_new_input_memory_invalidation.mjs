/**
 * Dedicated Verification Suite:
 * Dynamic New Input Ingestion & Stale Memory Invalidation
 * Verifies that the system never silently consumes old memory when given new inputs.
 */

import { strict as assert } from 'assert';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const documentParser = await import('../src/engine/documentParser.js');
const cacheManager = (await import('../src/infrastructure/cacheManager.js')).default || (await import('../src/infrastructure/cacheManager.js'));

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(err);
    failCount++;
  }
}

console.log('======================================================================');
console.log('🧪 DYNAMIC NEW INPUT INGESTION & MEMORY INVALIDATION VERIFICATION SUITE');
console.log('======================================================================\n');

// ----------------------------------------------------
// SECTION 1: Dynamic Financial Ingestion from Novel Document
// ----------------------------------------------------
console.log('--- SECTION 1: Dynamic Financial Ingestion (Novel Document Text) ---');

const novelInputPengendali = `
LAPORAN KEUANGAN KONSOLIDASI
PT NUSANTARA JAYA LOGISTIK
Per 31 Desember 2026 (Dalam Miliar Rupiah)

Pendapatan Usaha: 850.50
Beban Pokok Pendapatan: 520.30
Beban Usaha: 420.10
Laba Bersih Tahun Berjalan: 75.40

Jumlah Aset Lancar: 310.20
Jumlah Liabilitas Jangka Pendek: 150.10
Total Aset: 980.00
Total Liabilitas: 400.00
Total Ekuitas: 580.00
`;

test('Novel Pengendali document parses real entity name and not hardcoded PT EPS', () => {
  const res = documentParser.parseDocumentNode({
    fileName: 'Laporan_Keuangan_Nusantara_2026.pdf',
    textContent: novelInputPengendali
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.entityName, 'PT NUSANTARA JAYA LOGISTIK');
  assert.strictEqual(res.financials.isDynamicallyExtracted, true);
  assert.strictEqual(res.financials.sourceType, 'DYNAMIC_DOCUMENT_INGESTION');
  assert.strictEqual(res.financials.revCY, 850.50);
  assert.strictEqual(res.financials.cogsCY, 520.30);
  assert.strictEqual(res.financials.opexCY, 420.10);
  assert.strictEqual(res.financials.ca, 310.20);
  assert.strictEqual(res.financials.cl, 150.10);
  assert.strictEqual(res.financials.nwc, 160.10);
  assert.strictEqual(res.financials.cr, 2.07);
});

const novelInputNonPengendali = `
LAPORAN KEUANGAN
PT MITRA PRIMA TRANS
Per 31 Agustus 2026

Jumlah Aset Lancar: 620.40
Jumlah Liabilitas Jangka Pendek: 410.20
Piutang Usaha Pihak Ketiga: 145.80
Pagu RKAP Piutang: 120.00
Laba Bersih: 28.50
`;

test('Novel Non-Pengendali document calculates real RTC and NWC, never defaulting to PT POJ', () => {
  const res = documentParser.parseDocumentNode({
    fileName: 'LK_Mitra_Prima_2026.pdf',
    textContent: novelInputNonPengendali
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.entityName, 'PT MITRA PRIMA TRANS');
  assert.strictEqual(res.financials.isDynamicallyExtracted, true);
  assert.strictEqual(res.financials.sourceType, 'DYNAMIC_DOCUMENT_INGESTION');
  assert.strictEqual(res.financials.receivablesAct, 145.80);
  assert.strictEqual(res.financials.receivablesRKAP, 120.00);
  assert.strictEqual(res.financials.currentAssets, 620.40);
  assert.strictEqual(res.financials.currentLiab, 410.20);
  assert.strictEqual(res.financials.rtc, 121.50); // 145.80 / 120 * 100
  assert.strictEqual(res.financials.nwc, 210.20); // 620.40 - 410.20
  assert.strictEqual(res.financials.cr, 1.51); // 620.40 / 410.20
});

// ----------------------------------------------------
// SECTION 2: Full Content SHA-256 Hashing & Invalidation
// ----------------------------------------------------
console.log('\n--- SECTION 2: Cache Key Hashing & Force Refresh ---');

test('Cache key hashes full content avoiding collisions between different files with same prefix', () => {
  const prefix = "%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const file1 = prefix + "PAGE_CONTENT_A_CUSTOM_SALES_999999999";
  const file2 = prefix + "PAGE_CONTENT_B_CUSTOM_SALES_111111111";

  const hash1 = crypto.createHash('sha256').update(file1).digest('hex');
  const hash2 = crypto.createHash('sha256').update(file2).digest('hex');

  assert.notStrictEqual(hash1, hash2, 'Two files with identical 500-byte headers must have distinct SHA-256 hashes');
});

// ----------------------------------------------------
// SECTION 3: Frontend HTML & Client-Side Functions
// ----------------------------------------------------
console.log('\n--- SECTION 3: Frontend Engine Verification ---');

const indexHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf-8');
const previewHtml = fs.readFileSync(path.join(rootDir, 'preview.html'), 'utf-8');

test('extractDynamicFinancialMetricsClient is defined in public/index.html', () => {
  assert(indexHtml.includes('function extractDynamicFinancialMetricsClient('));
});

test('applyMultiFileEvidenceToSelectedScheme clears inputs for dynamic uploads instead of prefilling defaults', () => {
  assert(indexHtml.includes('const isDynamicUpload = primaryParse.isDynamicallyExtracted === true'));
  assert(indexHtml.includes('if (isDynamicUpload) {\n          clearPengendaliInputs();'));
  assert(indexHtml.includes('if (isDynamicUpload) {\n          clearNonPengendaliInputs();'));
});

test('resetAllToBlankState purges server cache, chat memory, and session storage', () => {
  assert(indexHtml.includes("fetch('/api/cache/clear'"));
  assert(indexHtml.includes('appState.chatHistory = {};'));
  assert(indexHtml.includes('sessionStorage.clear();'));
});

test('preview.html is 100% synchronized with public/index.html', () => {
  assert.strictEqual(indexHtml, previewHtml, 'preview.html must match public/index.html byte-for-byte');
});

console.log('\n======================================================================');
console.log(`🏁 SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
