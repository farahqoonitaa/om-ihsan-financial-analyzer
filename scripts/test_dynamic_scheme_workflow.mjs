import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicHtmlPath = path.join(rootDir, 'public', 'index.html');
const previewHtmlPath = path.join(rootDir, 'preview.html');

const html = fs.readFileSync(publicHtmlPath, 'utf-8');
const previewHtml = fs.readFileSync(previewHtmlPath, 'utf-8');

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

console.log('======================================================================');
console.log('🧪 DYNAMIC INVESTMENT SCHEME WORKFLOW & MULTI-FILE PIPELINE TEST SUITE');
console.log('======================================================================\n');

// ---------------------------------------------------------------------------
// SECTION 1: 6-STEP EXPLICIT USER JOURNEY & UI CONTAINERS
// ---------------------------------------------------------------------------
console.log('--- SECTION 1: 6-Step Explicit User Journey & Top Status Bar ---');
assert(html.includes('id="dynamicSchemeWorkflowHub"'), 'Main 6-step Dynamic Scheme Workflow Hub #dynamicSchemeWorkflowHub exists');
assert(html.includes('id="schemeCurrentStageBadge"'), 'Top status bar #schemeCurrentStageBadge exists');
assert(html.includes('id="schemeActiveTruthPill"'), 'Selected Scheme Source-of-Truth pill #schemeActiveTruthPill exists');
assert(html.includes('id="schemeFilesCounterBadge"'), 'Uploaded files counter badge #schemeFilesCounterBadge exists');
assert(html.includes('id="schemePipelineStateBadge"'), 'Pipeline state badge #schemePipelineStateBadge exists');
assert(html.includes('id="schemeNextActionHint"'), 'Next available action hint #schemeNextActionHint exists');

for (let s = 1; s <= 6; s++) {
  assert(html.includes(`id="sjStepBtn${s}"`), `6-Step Journey stepper button #sjStepBtn${s} exists`);
  assert(html.includes(`id="schemeJourneyPane${s}"`), `6-Step Journey content pane #schemeJourneyPane${s} exists`);
}

assert(html.includes('id="schemeCard_investasi"'), 'Scheme selection card #schemeCard_investasi exists');
assert(html.includes('id="schemeCard_pengendali"'), 'Scheme selection card #schemeCard_pengendali exists');
assert(html.includes('id="schemeCard_nonpengendali"'), 'Scheme selection card #schemeCard_nonpengendali exists');
assert(html.includes('id="schemeRequirementsBox"'), 'Scheme-specific document requirements & rules box #schemeRequirementsBox exists');
assert(html.includes('id="schemeJourneyFileInput" multiple'), 'Multi-file input #schemeJourneyFileInput has multiple attribute');
assert(html.includes('id="globalAppFileInput" multiple'), 'Global file input #globalAppFileInput has multiple attribute');
assert(html.includes('id="heroDirectFileInput" multiple'), 'Hero file input #heroDirectFileInput has multiple attribute');
assert(html.includes('id="realFileInput" multiple'), 'Modal file input #realFileInput has multiple attribute');

// ---------------------------------------------------------------------------
// SECTION 2: CORE WORKFLOW FUNCTIONS & PIPELINE STATES
// ---------------------------------------------------------------------------
console.log('\n--- SECTION 2: Core Workflow Functions & Pipeline States ---');
const requiredFunctions = [
  'selectWorkflowScheme',
  'goToSchemeJourneyStep',
  'returnToSchemeJourneyStep',
  'openSchemeFullWorkspaceView',
  'validateSingleUploadedFile',
  'handleSchemeMultiFileSelect',
  'removeSchemeUploadedFile',
  'clearSchemeUploadedFiles',
  'renderSchemeUploadedFilesQueue',
  'validateSchemeUploadedFiles',
  'renderSchemeValidationStep',
  'renderSchemePipelineStageTracker',
  'renderSchemeProcessingStep',
  'parseSingleFileForSchemeWorkflow',
  'applyMultiFileEvidenceToSelectedScheme',
  'executeSchemeMultiFilePipeline',
  'confirmSchemeMismatchKeepSelection',
  'switchToDetectedSchemeAndReprocess',
  'renderSchemeDynamicPreview',
  'renderSchemeFinalOutputStep',
  'loadSchemeMultiFileBundle'
];

for (const fn of requiredFunctions) {
  assert(html.includes(`function ${fn}(`), `Core workflow function ${fn}() is defined`);
}

const requiredStages = [
  'Uploading',
  'Validating',
  'Extracting Data',
  'Analyzing',
  'Generating Preview',
  'Completed'
];
for (const stg of requiredStages) {
  assert(html.includes(`'${stg}'`), `Pipeline stage '${stg}' is configured in UPLOAD_CONFIG.pipelineStages`);
}

// ---------------------------------------------------------------------------
// SECTION 3: RUNTIME SIMULATION OF ACCEPTANCE CRITERIA 1–7
// ---------------------------------------------------------------------------
console.log('\n--- SECTION 3: Runtime Simulation of Acceptance Criteria 1–7 ---');

// Extract the main script block from public/index.html
const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const mainScript = scriptBlocks.find(s => s.includes('const UPLOAD_CONFIG =') && s.includes('function selectWorkflowScheme('));
assert(Boolean(mainScript), 'Extracted main application script block for runtime verification');

// Create a lightweight DOM mock to execute the workflow functions end-to-end
const elements = new Map();
function getMockElement(id) {
  if (!elements.has(id)) {
    const el = {
      id,
      _value: '',
      get value() { return String(this._value ?? ''); },
      set value(v) { this._value = String(v ?? ''); },
      textContent: '',
      innerHTML: '',
      disabled: false,
      style: {},
      dataset: {},
      children: [],
      classList: {
        _set: new Set(['hidden']),
        add(...cls) { cls.forEach(c => this._set.add(c)); },
        remove(...cls) { cls.forEach(c => this._set.delete(c)); },
        contains(c) { return this._set.has(c); },
        toggle(c) { if (this._set.has(c)) this._set.delete(c); else this._set.add(c); }
      },
      addEventListener() {},
      removeEventListener() {},
      appendChild(child) { this.children.push(child); },
      querySelector() { return getMockElement('child'); },
      querySelectorAll() { return []; },
      cloneNode() {
        const cl = getMockElement(id + '_clone');
        cl.innerHTML = this.innerHTML || `Nota Dinas Resmi ${id}`;
        return cl;
      },
      removeAttribute() {},
      setAttribute() {},
      remove() {},
      scrollIntoView() {},
      click() {}
    };
    elements.set(id, el);
  }
  return elements.get(id);
}

const sandbox = {
  console,
  setTimeout: (fn) => { fn(); return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  Date,
  Math,
  JSON,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Map,
  Set,
  Promise,
  Error,
  Uint8Array,
  Blob: class Blob { constructor(parts, opts) { this.parts = parts; this.type = opts?.type || ''; } },
  File: class File {
    constructor(parts, name, opts) {
      this._content = parts.join('');
      this.name = name;
      this.size = opts?.size || Buffer.byteLength(this._content, 'utf8');
      this.type = opts?.type || 'text/plain';
    }
    async text() { return this._content; }
  },
  FileList: class FileList {},
  AbortController: class AbortController { constructor() { this.signal = {}; } abort() {} },
  URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  fetch: async () => ({ ok: false, status: 503, json: async () => ({}) }),
  window: {
    location: { protocol: 'http:', host: 'localhost:3005' },
    addEventListener: () => {},
    scrollTo: () => {},
    open: () => ({ document: { write: () => {}, close: () => {} } })
  },
  document: {
    getElementById: (id) => getMockElement(id),
    querySelector: () => getMockElement('qs'),
    querySelectorAll: () => [],
    createElement: (tag) => getMockElement('el_' + tag + '_' + Math.random()),
    body: getMockElement('body')
  }
};
sandbox.window.document = sandbox.document;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
vm.runInContext(mainScript, sandbox);

const appState = vm.runInContext('appState', sandbox);
const UPLOAD_CONFIG = vm.runInContext('UPLOAD_CONFIG', sandbox);
const SCHEME_CONFIG = vm.runInContext('SCHEME_CONFIG', sandbox);

// Verify UPLOAD_CONFIG & SCHEME_CONFIG
assert(UPLOAD_CONFIG.maxFiles === 10, `UPLOAD_CONFIG.maxFiles is 10 (got ${UPLOAD_CONFIG.maxFiles})`);
assert(UPLOAD_CONFIG.maxFileSizeMB === 25, `UPLOAD_CONFIG.maxFileSizeMB is 25 MB (got ${UPLOAD_CONFIG.maxFileSizeMB})`);
assert(SCHEME_CONFIG.investasi && SCHEME_CONFIG.pengendali && SCHEME_CONFIG.nonpengendali, 'SCHEME_CONFIG defines all 3 schemes (investasi, pengendali, nonpengendali)');

// AC 1: Selecting Investasi and uploading multiple valid files produces an Investment-specific analysis and preview
console.log('\n--- AC 1: Investasi Multi-File Upload, Processing & Preview ---');
sandbox.selectWorkflowScheme('investasi');
assert(appState.selectedScheme === 'investasi', 'Selected scheme is set to investasi');

const invFile1 = new sandbox.File(
  ['PT Pindo Deli Pulp and Paper Mills dan Entitas Anak\nLaporan Posisi Keuangan Konsolidasian 30 Juni 2026\nPenjualan Neto USD 1.084.245 ribu\nLaba Bersih USD 455.637 ribu'],
  '01_LapKeu_Audited_PT_Pindo_Deli_2026.pdf',
  { size: 190464 }
);
const invFile2 = new sandbox.File(
  ['PT Pindo Deli Pulp and Paper Mills\nCatatan Segmen Usaha & Jadwal Covenant Perbankan 30 Juni 2026\nCurrent Ratio 1,96x (Minimum 1,00x)\nDER 0,50x (Maksimum 2,00x)'],
  '02_Prospektus_Dan_Jadwal_Covenant_Pindo_Deli.xlsx',
  { size: 96256 }
);
const invFile3 = new sandbox.File(
  ['PT Pindo Deli Pulp and Paper Mills\nRincian Laba Entitas Asosiasi PT OKI Pulp USD 212.518 ribu & Laba Kurs Valas USD 140.198 ribu'],
  '03_Kertas_Kerja_Quality_of_Earnings_QoE.csv',
  { size: 53248 }
);

sandbox.handleSchemeMultiFileSelect([invFile1, invFile2, invFile3], false, true);
assert(appState.uploadedFilesQueue.length === 3, `All 3 uploaded files are queued (got ${appState.uploadedFilesQueue.length})`);
const valReportInv = sandbox.validateSchemeUploadedFiles(false);
assert(valReportInv.validCount === 3 && valReportInv.invalidCount === 0, 'All 3 Investment files pass validation');

await sandbox.executeSchemeMultiFilePipeline();
assert(appState.pipelineStage === 'Completed', `Pipeline completed through all stages (final stage: ${appState.pipelineStage})`);
assert(appState.schemeAnalysisResult !== null, 'schemeAnalysisResult is generated');
assert(appState.schemeAnalysisResult.scheme === 'investasi', `Result scheme strictly matches 'investasi' (got '${appState.schemeAnalysisResult.scheme}')`);
assert(appState.schemeAnalysisResult.filesProcessedCount === 3, `All 3 eligible files were processed (got ${appState.schemeAnalysisResult.filesProcessedCount})`);
const invPreviewHtml = getMockElement('schemeDynamicPreviewContainer').innerHTML;
assert(invPreviewHtml.includes('Investment Scheme (33 Rasio & Z-Score)') && invPreviewHtml.includes('QUALITY OF EARNINGS'), 'Investment preview displays Investment-specific headings and QoE/Covenant metrics');

// AC 2: Selecting Pengendali produces a Pengendali-specific analysis and preview
console.log('\n--- AC 2: Pengendali Selection, Processing & Preview ---');
await sandbox.loadSchemeMultiFileBundle('pengendali_multi');
assert(appState.selectedScheme === 'pengendali', 'Selected scheme switched to pengendali');
assert(appState.schemeAnalysisResult && appState.schemeAnalysisResult.scheme === 'pengendali', `Result scheme strictly matches 'pengendali' (got '${appState.schemeAnalysisResult?.scheme}')`);
assert(appState.schemeAnalysisResult.filesProcessedCount === 2, `Both Pengendali files were processed (got ${appState.schemeAnalysisResult.filesProcessedCount})`);
const pengPreviewHtml = getMockElement('schemeDynamicPreviewContainer').innerHTML;
assert(pengPreviewHtml.includes('Pengendali Preview') && pengPreviewHtml.includes('SINYAL S7 GROWTH GAP'), 'Pengendali preview displays Pengendali-specific headings and S7 Growth Gap analysis');

// AC 3: Selecting Non-Pengendali produces a Non-Pengendali-specific analysis and preview
console.log('\n--- AC 3: Non-Pengendali Selection, Processing & Preview ---');
await sandbox.loadSchemeMultiFileBundle('nonpengendali_multi');
assert(appState.selectedScheme === 'nonpengendali', 'Selected scheme switched to nonpengendali');
assert(appState.schemeAnalysisResult && appState.schemeAnalysisResult.scheme === 'nonpengendali', `Result scheme strictly matches 'nonpengendali' (got '${appState.schemeAnalysisResult?.scheme}')`);
assert(appState.schemeAnalysisResult.filesProcessedCount === 2, `Both Non-Pengendali files were processed (got ${appState.schemeAnalysisResult.filesProcessedCount})`);
const npPreviewHtml = getMockElement('schemeDynamicPreviewContainer').innerHTML;
assert(npPreviewHtml.includes('Non-Pengendali Preview') && npPreviewHtml.includes('RTC 301,20%') && npPreviewHtml.includes('PROTEKSI HAK DIVIDEN MINORITAS'), 'Non-Pengendali preview displays Non-Pengendali-specific RTC and Minority Dividend analysis');

// AC 4: File Validation (invalid extension, oversized file, max file limit) & Explicit Per-File Error Reporting
console.log('\n--- AC 4: File Validation & Explicit Error Reporting ---');
await sandbox.loadSchemeMultiFileBundle('invalid_file_test');
const valMixed = appState.schemeValidationReport;
assert(valMixed.validCount === 1 && valMixed.invalidCount === 2, `Mixed bundle validated: 1 valid, 2 invalid (got ${valMixed.validCount} valid, ${valMixed.invalidCount} invalid)`);
const validationHtml = getMockElement('schemeValidationReportContainer').innerHTML;
assert(validationHtml.includes('berkas_aplikasi_berbahaya.exe') && validationHtml.includes('.exe') && validationHtml.includes('tidak didukung'), 'Invalid extension file is explicitly identified with reason');
assert(validationHtml.includes('scan_resolusi_tinggi_32MB.pdf') && validationHtml.includes('melebihi batas maksimum 25 MB'), 'Oversized file is explicitly identified with reason');

// AC 5 & AC 6: Scheme-Evidence Mismatch Detection & Scheme Switching Reprocessing
console.log('\n--- AC 5 & AC 6: Scheme-Evidence Mismatch Flagging & Dynamic Scheme Reprocessing ---');
// User selects 'investasi', then uploads a document containing 'Pengendali' (PT EPS)
sandbox.selectWorkflowScheme('investasi', { silentReprocess: true });
const epsDocUnderInvestasi = new sandbox.File(
  ['PT Era Permata Sejahtera\nLaporan Manajemen Entitas Pengendali 31 Agustus 2026\nS7 Growth Gap Opex vs Omzet'],
  'Dokumen_Mengandung_Kata_Pengendali_PT_EPS.xlsx',
  { size: 142000 }
);
sandbox.handleSchemeMultiFileSelect([epsDocUnderInvestasi], false, true);
await sandbox.executeSchemeMultiFilePipeline();

assert(appState.selectedScheme === 'investasi', 'Selected scheme remains "investasi" (NOT silently overridden by "pengendali" in document)');
assert(appState.schemeAnalysisResult.scheme === 'investasi', 'Preview generated under selected "investasi" scheme');
assert(appState.schemeAnalysisResult.hasSchemeMismatch === true, 'Mismatch between selected scheme (investasi) and document evidence (pengendali) is flagged (hasSchemeMismatch === true)');
const mismatchBannerHtml = getMockElement('schemeMismatchAlertContainer').innerHTML;
assert(mismatchBannerHtml.includes('Verifikasi Ketidaksesuaian Skema vs Bukti Dokumen'), 'Mismatch verification alert banner is rendered in preview');

// Now test switching to the detected scheme ('pengendali'): retains uploaded file and reprocesses it for 'pengendali'
sandbox.switchToDetectedSchemeAndReprocess('pengendali');
await new Promise(r => setTimeout(r, 50));
assert(appState.selectedScheme === 'pengendali', 'Switching scheme updates selectedScheme to "pengendali"');
assert(appState.uploadedFilesQueue.length === 1, 'Uploaded file was retained across scheme change');
assert(appState.schemeAnalysisResult.scheme === 'pengendali', 'Retained file was reprocessed into a "pengendali" preview');
assert(appState.schemeAnalysisResult.hasSchemeMismatch === false, 'Mismatch flag is cleared once scheme matches document evidence');

// AC 7: Final Nota Dinas (Step 6) uses the correct scheme, actual extracted evidence, and S1–S10 analytical results
console.log('\n--- AC 7: Final Nota Dinas (Step 6) Consistency & S1–S10 Integration ---');
sandbox.goToSchemeJourneyStep(6);
assert(appState.journeyStep === 6, 'Navigated to Step 6 (Generate Output / Nota Dinas)');
const finalNdHtml = getMockElement('schemeFinalOutputContainer').innerHTML;
assert(finalNdHtml.includes('Entitas Pengendali') && finalNdHtml.includes('PT Era Permata Sejahtera'), 'Final Nota Dinas header reflects selected scheme and extracted entity');

// Verify back-navigation preserves valid progress
sandbox.returnToSchemeJourneyStep(5);
assert(appState.journeyStep === 5 && appState.schemeAnalysisResult !== null, 'Back-navigation to Step 5 preserves valid analysis state');

// Verify file synchronization
console.log('\n--- SECTION 4: File Synchronization Check ---');
assert(html === previewHtml, 'preview.html is 100% identical to public/index.html');

console.log('\n======================================================================');
console.log(`🏁 SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
}
