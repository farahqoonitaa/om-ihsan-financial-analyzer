import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('🧪 DETAILED FORENSIC ANALYSIS PDF EXPORT VERIFICATION TEST');
console.log('======================================================================\n');

const indexPath = path.join(rootDir, 'public', 'index.html');
const previewPath = path.join(rootDir, 'preview.html');

const indexHtml = fs.readFileSync(indexPath, 'utf-8');
const previewHtml = fs.readFileSync(previewPath, 'utf-8');

// TEST 1: Parity & Zero YKPP
console.log('--- TEST 1: Parity & Invariants ---');
assert.strictEqual(
  Buffer.from(indexHtml).equals(Buffer.from(previewHtml)),
  true,
  'preview.html must be 100% byte-for-byte identical to public/index.html'
);
console.log('  ✅ PASS: preview.html is byte-for-byte identical to public/index.html');

const ykppMatches = (indexHtml.match(/YKPP/gi) || []).length;
assert.strictEqual(ykppMatches, 0, 'Zero occurrences of YKPP');
console.log('  ✅ PASS: Zero occurrences of YKPP confirmed');

// TEST 2: printDetailedAnalysis function existence & structure
console.log('\n--- TEST 2: printDetailedAnalysis Implementation ---');
assert(indexHtml.includes('function printDetailedAnalysis(mode) {'), 'printDetailedAnalysis function is defined');
assert(indexHtml.includes('p_step_pane_3'), 'References p_step_pane_3');
assert(indexHtml.includes('np_step_pane_3'), 'References np_step_pane_3');
assert(indexHtml.includes('inv_step_pane_3'), 'References inv_step_pane_3');
assert(indexHtml.includes('kons_step_pane_3'), 'References kons_step_pane_3');
assert(indexHtml.includes('outInvestasiPindo'), 'Handles Pindo Deli sub-view');
assert(indexHtml.includes('outInvestasiDaaz'), 'Handles Daaz sub-view');
assert(indexHtml.includes('printDetailedAnalysisIframe'), 'Includes popup-blocker iframe fallback');
assert(indexHtml.includes('detail-print-header'), 'Generates institutional print header');
assert(indexHtml.includes('detail-meta-table'), 'Generates forensic metadata table');
console.log('  ✅ PASS: printDetailedAnalysis contains pane mappings, sub-views, iframe fallback, and letterhead header');

// TEST 3: Step 3 Header & Action Bar Buttons
console.log('\n--- TEST 3: Step 3 Header & Action Bar Export Buttons ---');
const step3Buttons = [
  "printDetailedAnalysis('pengendali')",
  "printDetailedAnalysis('nonpengendali')",
  "printDetailedAnalysis('investasi')",
  "printDetailedAnalysis('konsolidasi')"
];

for (const btn of step3Buttons) {
  const count = (indexHtml.match(new RegExp(btn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  // Each mode has at least 3 occurrences: Step 3 top header, Step 3 bottom actions, Step 4 actions, Step 5 tile
  assert(count >= 3, `Expected at least 3 occurrences of ${btn}, found ${count}`);
  console.log(`  ✅ PASS: Found ${count} instances of button ${btn}`);
}

// TEST 4: Step 4 Actions Bar Buttons
console.log('\n--- TEST 4: Step 4 Nota Dinas Action Bars ---');
assert(indexHtml.includes('📊 Cetak / PDF Analisis Detail'), 'Step 4 contains Cetak / PDF Analisis Detail button');

// TEST 5: Step 5 Big Action Tiles
console.log('\n--- TEST 5: Step 5 Big Action Tiles ---');
assert(indexHtml.includes('Ekspor Lembar Kerja S7 Growth Gap, Footing &amp; Forensik'), 'Pengendali Step 5 tile exists');
assert(indexHtml.includes('Ekspor Lembar Kerja RTC 301% &amp; Dividen 1% Minoritas'), 'Non-Pengendali Step 5 tile exists');
assert(indexHtml.includes('Ekspor Lembar Kerja 33 Rasio, Z-Score &amp; QoE Waterfall'), 'Investasi Step 5 tile exists');
assert(indexHtml.includes('Ekspor Lembar Kerja POJK DER &amp; Eliminasi Saldo Grup'), 'Konsolidasi Step 5 tile exists');
console.log('  ✅ PASS: Step 5 big action tiles present across all 4 workflows');

// TEST 6: Extended Mode in printNotaDinas unmasks S1-S10
console.log('\n--- TEST 6: printNotaDinas Extended Mode Unmasking ---');
const printNdStart = indexHtml.indexOf('function printNotaDinas(');
const printNdEnd = indexHtml.indexOf('function printDetailedAnalysis(');
const printNdCode = indexHtml.slice(printNdStart, printNdEnd);

assert(printNdCode.includes(".extended-audit-details"), 'Targets .extended-audit-details');
assert(printNdCode.includes("classList.remove('no-print')"), 'Removes no-print class from extended details');
assert(printNdCode.includes("setAttribute('open', '')"), 'Expands details with open attribute');
assert(printNdCode.includes(".nd-s1-s10-audit-section"), 'Targets .nd-s1-s10-audit-section');
console.log('  ✅ PASS: printNotaDinas extended mode correctly unmasks and opens diagnostic workpaper cards');

console.log('\n======================================================================');
console.log('🏁 ALL DETAILED ANALYSIS PDF EXPORT TESTS PASSED PERFECTLY!');
console.log('======================================================================\n');
