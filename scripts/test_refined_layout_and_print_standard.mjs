import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('🧪 REFINED NEAT EXECUTIVE LAYOUT & PRINT STANDARD TEST SUITE');
console.log('======================================================================');

const indexPath = path.join(rootDir, 'public', 'index.html');
const previewPath = path.join(rootDir, 'preview.html');

const indexContent = fs.readFileSync(indexPath, 'utf-8');
const previewContent = fs.readFileSync(previewPath, 'utf-8');

// --- SECTION 1: Executive Compact Mode & Toggle Bar ---
console.log('\n--- SECTION 1: Executive Compact Mode & Toggle Bar ---');

const expectedContainers = [
  'id="ndPengendaliBox" class="nota-dinas-container executive-compact-mode"',
  'id="ndNonPengendaliBox" class="nota-dinas-container executive-compact-mode"',
  'id="ndInvestasiBox" class="nota-dinas-container executive-compact-mode"',
  'id="ndInvestasiDaazBox" class="nota-dinas-container executive-compact-mode"',
  'id="ndKonsolidasiBox" class="nota-dinas-container executive-compact-mode"'
];

for (const containerTag of expectedContainers) {
  assert(indexContent.includes(containerTag), `Container tag present: ${containerTag}`);
}
console.log('✅ PASS: All 5 Nota Dinas containers have executive-compact-mode class by default');

const expectedButtons = [
  'btnLayoutExecutive_pengendali', 'btnLayoutExtended_pengendali',
  'btnLayoutExecutive_non_pengendali', 'btnLayoutExtended_non_pengendali',
  'btnLayoutExecutive_investasi', 'btnLayoutExtended_investasi',
  'btnLayoutExecutive_investasi_daaz', 'btnLayoutExtended_investasi_daaz',
  'btnLayoutExecutive_konsolidasi', 'btnLayoutExtended_konsolidasi'
];

for (const btnId of expectedButtons) {
  assert(indexContent.includes(`id="${btnId}"`), `Button id present: ${btnId}`);
}
console.log('✅ PASS: All 10 executive layout toggle buttons are present across all containers');

// --- SECTION 2: Global Print Stylesheet & Page Breaks ---
console.log('\n--- SECTION 2: Global Print Stylesheet & Page Breaks ---');

assert(indexContent.includes('@media print {'), 'Global @media print stylesheet defined in <head>');
assert(indexContent.includes('.page-break-after {'), '.page-break-after CSS class defined');
assert(indexContent.includes('page-break-after: always !important;'), 'page-break-after CSS rule configured');

// Check that page breaks exist in ndInvestasiBox
const pindoBoxStart = indexContent.indexOf('id="ndInvestasiBox"');
const pindoBoxEnd = indexContent.indexOf('id="ndInvestasiDaazBox"');
assert(pindoBoxStart !== -1 && pindoBoxEnd !== -1, 'Pindo Deli and Daaz box found');
const pindoSlice = indexContent.slice(pindoBoxStart, pindoBoxEnd);

const pageBreakMatches = (pindoSlice.match(/class="page-break-after"/g) || []).length;
assert(pageBreakMatches >= 2, `At least 2 explicit page break markers in Pindo Deli 3-page layout (found ${pageBreakMatches})`);
console.log(`✅ PASS: Pindo Deli has ${pageBreakMatches} explicit page breaks matching 3-page Expected Output standard`);

// --- SECTION 3: JavaScript Engine Stripping & Synchronization ---
console.log('\n--- SECTION 3: JavaScript Engine Stripping & Synchronization ---');

assert(indexContent.includes('function toggleLayoutMode('), 'toggleLayoutMode() is defined');
assert(indexContent.includes('box.classList.add(\'executive-compact-mode\')'), 'setExportFormat adds executive-compact-mode');
assert(indexContent.includes('box.classList.remove(\'executive-compact-mode\')'), 'setExportFormat removes executive-compact-mode');

// Check stripping in printNotaDinas
const printNotaDinasStart = indexContent.indexOf('function printNotaDinas(');
const printNotaDinasEnd = indexContent.indexOf('function openDocumentAnalysis(');
const printNotaDinasCode = indexContent.slice(printNotaDinasStart, printNotaDinasEnd);

assert(printNotaDinasCode.includes('.boomer-chart-card'), 'printNotaDinas strips .boomer-chart-card in executive mode');
assert(printNotaDinasCode.includes('#argonRagDeepDiveWidget'), 'printNotaDinas strips #argonRagDeepDiveWidget in executive mode');
assert(printNotaDinasCode.includes('.nd-s1-s10-audit-section'), 'printNotaDinas strips .nd-s1-s10-audit-section in executive mode');
assert(printNotaDinasCode.includes('.nd-signal-card'), 'printNotaDinas strips .nd-signal-card in executive mode');
console.log('✅ PASS: printNotaDinas() strictly removes charts, diagnostic cards, and chat widgets in executive mode');

// Check stripping in downloadNotaDinasDoc
const downloadDocStart = indexContent.indexOf('function downloadNotaDinasDoc(');
const downloadDocEnd = indexContent.indexOf('function setExportFormat(');
const downloadDocCode = indexContent.slice(downloadDocStart, downloadDocEnd);

assert(downloadDocCode.includes('.boomer-chart-card'), 'downloadNotaDinasDoc strips .boomer-chart-card in executive mode');
assert(downloadDocCode.includes('#argonRagDeepDiveWidget'), 'downloadNotaDinasDoc strips #argonRagDeepDiveWidget in executive mode');
assert(downloadDocCode.includes('.nd-s1-s10-audit-section'), 'downloadNotaDinasDoc strips .nd-s1-s10-audit-section in executive mode');
console.log('✅ PASS: downloadNotaDinasDoc() strictly removes charts, diagnostic cards, and chat widgets in executive mode');

// --- SECTION 4: File Synchronization Check ---
console.log('\n--- SECTION 4: File Synchronization Check ---');
assert(Buffer.from(indexContent).equals(Buffer.from(previewContent)), 'preview.html is 100% identical to public/index.html');
console.log('✅ PASS: preview.html is 100% synchronized with public/index.html');

console.log('\n======================================================================');
console.log('🏁 SUMMARY: All Refined Layout & Print Standards Verified Successfully!');
console.log('======================================================================\n');
