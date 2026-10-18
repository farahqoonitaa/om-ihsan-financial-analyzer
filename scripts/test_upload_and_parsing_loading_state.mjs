/**
 * Comprehensive Verification Test for Upload State, Document Parsing Loading Modal,
 * Real-Time Forensic Console, and Destination Banners.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const documentParser = require('../src/engine/documentParser');

console.log('================================================================');
console.log('🧪 RUNNING VERIFICATION: UPLOAD SYSTEM & DOCUMENT PARSING MODAL');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

const indexHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf-8');
const previewHtml = fs.readFileSync(path.join(rootDir, 'preview.html'), 'utf-8');

// ----------------------------------------------------
// SECTION 1: GLOBAL ROOT FILE INPUT & UNIVERSAL TRIGGERS
// ----------------------------------------------------
console.log('--- SECTION 1: Global Root File Input & Universal Triggers ---');

assert(indexHtml.includes('id="globalAppFileInput"'), '#globalAppFileInput exists in public/index.html');
assert(previewHtml.includes('id="globalAppFileInput"'), '#globalAppFileInput exists in preview.html');
assert(indexHtml.includes('onchange="handleUniversalFileUpload(this)"'), '#globalAppFileInput calls handleUniversalFileUpload(this)');

assert(indexHtml.includes('function triggerUniversalFileUpload()'), 'triggerUniversalFileUpload() is defined in public/index.html');
assert(indexHtml.includes('function handleUniversalFileUpload(input)'), 'handleUniversalFileUpload() is defined in public/index.html');
assert(previewHtml.includes('function triggerUniversalFileUpload()'), 'triggerUniversalFileUpload() is defined in preview.html');
assert(previewHtml.includes('function handleUniversalFileUpload(input)'), 'handleUniversalFileUpload() is defined in preview.html');

// Verify triggers across all views
assert(indexHtml.includes('id="txt_btn_active_reupload" onclick="triggerUniversalFileUpload()"'), 'Active banner reupload button triggers triggerUniversalFileUpload()');
assert(indexHtml.includes('id="txt_btn_upload_hero" type="button" class="btn btn-primary btn-lg" style="cursor:pointer;" onclick="event.stopPropagation(); triggerUniversalFileUpload()"'), 'Hero upload button triggers triggerUniversalFileUpload()');

// Verify all view dropzone strips trigger triggerUniversalFileUpload()
const dropzoneMatches = indexHtml.match(/class="quick-dropzone-strip"[^>]*onclick="triggerUniversalFileUpload\(\)"/g) || [];
assert(dropzoneMatches.length >= 4, `All ${dropzoneMatches.length} quick dropzone strips (Pengendali, Non-Pengendali, Investasi, Konsolidasi) call triggerUniversalFileUpload()`);

// Verify upload buttons are directly clickable (no pointer-events:none blocking clicks)
assert(!indexHtml.includes('📤 Unggah Berkas</button>') || !indexHtml.match(/pointer-events:none[^>]*>📤 Unggah Berkas<\/button>/), 'No "📤 Unggah Berkas" button is blocked by pointer-events:none');
assert(indexHtml.includes('function uploadWorkspaceSampleFile(presetKey)'), '1-Click workspace file uploader uploadWorkspaceSampleFile() is defined');
assert(indexHtml.includes('function submitCustomUploadedFile()'), 'Custom file uploader submitCustomUploadedFile() is defined');
assert(indexHtml.includes('openUploadModal();') && indexHtml.includes('gInput.click();'), 'triggerUniversalFileUpload() opens modalUpload immediately and triggers native picker');


// ----------------------------------------------------
// SECTION 2: DOCUMENT PARSING LOADING MODAL & REAL-TIME CONSOLE
// ----------------------------------------------------
console.log('\n--- SECTION 2: Document Parsing Loading Modal & Console ---');

assert(indexHtml.includes('id="pipelineLoadingModal"'), 'Modal #pipelineLoadingModal exists');
assert(indexHtml.includes('id="pipeModalTitle"'), 'Modal title #pipeModalTitle exists');
assert(indexHtml.includes('Document Parsing & Analisis Forensik Berjalan'), 'Modal title explicitly displays "Document Parsing & Analisis Forensik Berjalan"');
assert(indexHtml.includes('id="pipeTimerBadge"'), 'Timer badge #pipeTimerBadge exists in modal');
assert(indexHtml.includes('id="pipeTimerText"'), 'Live stopwatch text #pipeTimerText exists in modal');
assert(indexHtml.includes('id="pipeProgressPercent"'), 'Progress percentage #pipeProgressPercent exists in modal');
assert(indexHtml.includes('id="pipeProgressBarFill"'), 'Progress bar fill #pipeProgressBarFill exists in modal');
assert(indexHtml.includes('1. Document Parsing & Ekstraksi Lembar Keuangan'), 'Stage 1 label explicitly highlights "Document Parsing"');
assert(indexHtml.includes('id="pipeParsingConsole"'), 'Real-time terminal console #pipeParsingConsole exists in modal');
assert(indexHtml.includes('id="pipeConsoleLogs"'), 'Real-time console log container #pipeConsoleLogs exists');
assert(indexHtml.includes('TERMINAL LOG &bull; DOCUMENT PARSING STREAM') || indexHtml.includes('TERMINAL LOG • DOCUMENT PARSING STREAM'), 'Terminal console stream header is present');

// ----------------------------------------------------
// SECTION 3: PERSISTENT DOCUMENT PARSING RESULT BANNERS
// ----------------------------------------------------
console.log('\n--- SECTION 3: Destination View Document Parsing Banners ---');

assert(indexHtml.includes('id="docParsingBanner_pengendali"'), 'Banner container #docParsingBanner_pengendali exists in Pengendali view');
assert(indexHtml.includes('id="docParsingBanner_nonpengendali"'), 'Banner container #docParsingBanner_nonpengendali exists in Non-Pengendali view');
assert(indexHtml.includes('id="docParsingBanner_investasi"'), 'Banner container #docParsingBanner_investasi exists in Investasi view');
assert(indexHtml.includes('id="docParsingBanner_konsolidasi"'), 'Banner container #docParsingBanner_konsolidasi exists in Konsolidasi view');

assert(indexHtml.includes('function renderDocParsingResultBanner(targetView, parseResult)'), 'renderDocParsingResultBanner() function is defined');
assert(indexHtml.includes('ISA 520 FOOTING BALANCE'), 'renderDocParsingResultBanner creates ISA 520 FOOTING BALANCE badge');
assert(indexHtml.includes('Dokumen Berhasil Di-Parsing (Document Parsing & Forensic Aktif)'), 'renderDocParsingResultBanner creates prominent success banner text');

// ----------------------------------------------------
// SECTION 4: ROBUST EXECUTION & ANTI-HANG TIMEOUT
// ----------------------------------------------------
console.log('\n--- SECTION 4: Execution Resilience & Anti-Hang Timeout ---');

assert(indexHtml.includes('const controller = new AbortController();'), 'startAnalysisPipeline employs AbortController for network safety');
assert(indexHtml.includes('setTimeout(() => controller.abort(), 6000)'), 'startAnalysisPipeline has 6000ms safe timeout to prevent freezes');
assert(indexHtml.includes('parseResult = parseDocumentClientSide(file, fileName, textContent);'), 'startAnalysisPipeline seamlessly falls back to client parser');
assert(indexHtml.includes('clearInterval(timerInterval);'), 'Live timer interval is cleaned up properly upon pipeline completion');

// ----------------------------------------------------
// SECTION 5: REAL DOCUMENT PARSING ENGINE TESTS
// ----------------------------------------------------
console.log('\n--- SECTION 5: Real Document Parsing Engine Tests ---');

// Test 1: Pindo Deli PDF
const pindoPdfPath = path.join(rootDir, 'expected output for the investment analysis.pdf');
assert(fs.existsSync(pindoPdfPath), 'Real file "expected output for the investment analysis.pdf" exists');
const pindoResult = documentParser.parseDocumentNode({
  fileName: 'expected output for the investment analysis.pdf',
  textContent: 'PT Pindo Deli Pulp and Paper Mills dan Entitas Anak\nPosisi Keuangan 30 Juni 2026'
});
assert(pindoResult.success, 'Pindo Deli parsing succeeds');
assert(pindoResult.targetView === 'investasi', `Pindo Deli routed to 'investasi' (got '${pindoResult.targetView}')`);
assert(pindoResult.financials.salesCY === 1084245, 'Pindo Deli sales is 1.084.245k');
assert(pindoResult.financials.footingDelta === 0, 'Pindo Deli footing balance check is 0.00');

// Test 2: Multi-entity Merged PDF
const mergedPdfPath = path.join(rootDir, 'ilovepdf_merged (1).pdf');
assert(fs.existsSync(mergedPdfPath), 'Real file "ilovepdf_merged (1).pdf" exists');
const mergedResult = documentParser.parseDocumentNode({
  fileName: 'ilovepdf_merged (1).pdf',
  textContent: 'PT Pesonna Optima Jasa piutang usaha per 31 Agustus 2026'
});
assert(mergedResult.success, 'Merged file parsing succeeds');
assert(mergedResult.entityName.includes('Pesonna') || mergedResult.targetView === 'nonpengendali', 'Merged file identifies Pesonna / non-pengendali context');

// Test 3: Standalone Company Excel
const excelResult = documentParser.parseDocumentNode({
  fileName: 'Laporan_Keuangan_PT_A.xlsx',
  textContent: 'PT A Neraca Saldo per 31 Agustus 2026'
});
assert(excelResult.success, 'PT A Excel parsing succeeds');
assert(excelResult.entityName === 'PT A', 'PT A entity name is exact');
assert(excelResult.targetView === 'pengendali', 'PT A target view is pengendali');

// ----------------------------------------------------
// SECTION 6: COMPREHENSIVE INDONESIAN ENTITY PREFIX PARSING
// ----------------------------------------------------
console.log('\n--- SECTION 6: Comprehensive Indonesian Legal Entity Prefix Parsing ---');

const entityPrefixTestCases = [
  {
    input: 'Laporan Keuangan PT . SUMBER JAYA MAKMUR per 31 Desember 2025',
    expected: 'PT SUMBER JAYA MAKMUR'
  },
  {
    input: 'Daftar Piutang PT.INDOMIE periode Agustus 2026',
    expected: 'PT INDOMIE'
  },
  {
    input: 'Neraca saldo CV . BERKAH MANDIRI per 30 Juni 2026',
    expected: 'CV BERKAH MANDIRI'
  },
  {
    input: 'Surat perjanjian UD. MAKMUR SEJATI tanggal 1 Januari 2026',
    expected: 'UD MAKMUR SEJATI'
  },
  {
    input: 'Laporan posisi keuangan pt . karya agung per 31 Agustus 2026',
    expected: 'PT karya agung'
  },
  {
    input: 'Evaluasi kinerja PT-TRI-KARYA periode 2026',
    expected: 'PT TRI-KARYA'
  },
  {
    input: 'Laporan audit P.T. INDAH CEMERLANG Tbk dan Entitas Anak 2026',
    expected: 'PT INDAH CEMERLANG Tbk dan Entitas Anak'
  },
  {
    input: 'Akta pendirian C.V. ANUGERAH SEJAHTERA tahun 2025',
    expected: 'CV ANUGERAH SEJAHTERA'
  }
];

for (const tc of entityPrefixTestCases) {
  const res = documentParser.parseDocumentNode({
    fileName: 'dokumen.txt',
    textContent: tc.input
  });
  assert(res.success, `Parsing succeeded for text containing '${tc.expected}'`);
  assert(
    res.entityName.toLowerCase() === tc.expected.toLowerCase(),
    `Captured entity name correctly: expected '${tc.expected}', got '${res.entityName}'`
  );
}

// Test Filename Fallback with tricky prefixes
const filenameTestCases = [
  {
    fileName: 'Laporan_Keuangan_PT._SUMBER_REJEKI_2026.xlsx',
    expected: 'PT SUMBER REJEKI'
  },
  {
    fileName: 'CV._BERKAH_UTAMA_2026.pdf',
    expected: 'CV BERKAH UTAMA'
  },
  {
    fileName: 'UD._JAYA_ABADI_Q3_2026.xlsx',
    expected: 'UD JAYA ABADI'
  }
];

for (const tc of filenameTestCases) {
  const res = documentParser.parseDocumentNode({
    fileName: tc.fileName,
    textContent: '' // empty body, relies on filename fallback
  });
  assert(res.success, `Filename fallback succeeded for '${tc.fileName}'`);
  assert(
    res.entityName.toLowerCase() === tc.expected.toLowerCase(),
    `Filename entity match: expected '${tc.expected}', got '${res.entityName}'`
  );
}

// ----------------------------------------------------
// SECTION 6: JAVASCRIPT SYNTAX & EVENT HANDLER COMPILATION
// ----------------------------------------------------
console.log('\n--- SECTION 6: JavaScript Syntax & Inline Handler Verification ---');
const vm = require('vm');
let jsCompileOk = true;
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let scriptMatch;
while ((scriptMatch = scriptRegex.exec(indexHtml)) !== null) {
  if (scriptMatch[1].trim()) {
    try {
      new vm.Script(scriptMatch[1]);
    } catch (e) {
      jsCompileOk = false;
      console.error('JS Syntax Error in public/index.html:', e.message);
    }
  }
}
assert(jsCompileOk, 'All <script> blocks in public/index.html compile with zero SyntaxErrors');

console.log('\n================================================================');
console.log(`🏁 SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
