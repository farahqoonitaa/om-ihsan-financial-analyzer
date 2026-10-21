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
console.log('🧪 DEDICATED SCHEME ENTRY POINTS & 3+ FILES ABSORPTION CAPACITY SUITE');
console.log('======================================================================\n');

// ---------------------------------------------------------------------------
// SECTION 1: DEDICATED 3-SCHEME ENTRY GATEWAY & PORTALS
// ---------------------------------------------------------------------------
console.log('--- SECTION 1: Dedicated 3-Scheme Entry Gateway & Portals ---');
assert(html.includes('id="threeDedicatedPortalsGrid"'), 'Gateway container #threeDedicatedPortalsGrid exists');
assert(html.includes('id="portalCard_investasi"'), 'Dedicated Portal Card 1 #portalCard_investasi exists');
assert(html.includes('id="portalCard_pengendali"'), 'Dedicated Portal Card 2 #portalCard_pengendali exists');
assert(html.includes('id="portalCard_nonpengendali"'), 'Dedicated Portal Card 3 #portalCard_nonpengendali exists');
assert(html.includes('enterSchemePortal'), 'Core navigation function enterSchemePortal() exists');
assert(html.includes('Kapasitas Penyerapan: &ge; 3 Berkas Kolektif') || html.includes('Kapasitas ≥ 3 Berkas'), 'Prominent 3+ files capacity indicator is visible');

// ---------------------------------------------------------------------------
// SECTION 2: DEDICATED IN-VIEW 3+ FILES DROPZONES
// ---------------------------------------------------------------------------
console.log('\n--- SECTION 2: Dedicated In-View 3+ Files Dropzone Banners ---');
assert(html.includes('PINTU MASUK KHUSUS INVESTASI'), 'viewInvestasi contains dedicated entry banner');
assert(html.includes('PINTU MASUK KHUSUS PENGENDALI'), 'viewPengendali contains dedicated entry banner');
assert(html.includes('PINTU MASUK KHUSUS NON-PENGENDALI'), 'viewNonPengendali contains dedicated entry banner');
assert(html.includes('pengendali_3files'), 'Pengendali 3-file bundle loader option is configured');
assert(html.includes('nonpengendali_3files'), 'Non-Pengendali 3-file bundle loader option is configured');

// ---------------------------------------------------------------------------
// SECTION 3: RUNTIME SIMULATION OF 3+ FILES ABSORPTION & DEDICATED LOGIC
// ---------------------------------------------------------------------------
console.log('\n--- SECTION 3: Runtime Execution of 3+ Files Absorption ---');

const scriptMatches = html.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
const mainScript = scriptMatches ? scriptMatches[scriptMatches.length - 1].replace(/<\/?script[^>]*>/gi, '') : '';

const mockDom = new Map();
function getMockElement(id) {
  if (!mockDom.has(id)) {
    const mockObj = {
      id,
      innerHTML: '',
      _value: '',
      get value() { return this._value; },
      set value(v) { this._value = String(v ?? ''); },
      innerText: '',
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (this.classes.has(c)) this.classes.delete(c);
            else this.classes.add(c);
          } else if (force) {
            this.classes.add(c);
          } else {
            this.classes.delete(c);
          }
        }
      },
      style: {},
      scrollIntoView: () => {},
      appendChild: () => {},
      removeChild: () => {},
      remove: () => {},
      setAttribute: () => {},
      getAttribute: () => null,
      focus: () => {},
      querySelector: () => getMockElement('sub_mock'),
      querySelectorAll: () => []
    };
    mockDom.set(id, mockObj);
  }
  return mockDom.get(id);
}

const sandbox = {
  console: { log: () => {}, warn: () => {}, error: () => {} },
  setTimeout: (fn) => { fn(); return 1; },
  clearTimeout: () => {},
  performance: { now: () => Date.now() },
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

// TEST 1: Investasi Entry Way Absorbs 3 Files & Applies Investment Logic
console.log('\n--- TEST 1: Investasi Entry Way Absorbs 3 Files & Applies Investment Logic ---');
await sandbox.loadSchemeMultiFileBundle('investasi_multi');
assert(appState.selectedScheme === 'investasi', 'Selected scheme strictly set to investasi');
assert(appState.schemeAnalysisResult && appState.schemeAnalysisResult.filesProcessedCount === 3, `Investasi successfully absorbed 3 files (got ${appState.schemeAnalysisResult?.filesProcessedCount})`);
const invPreviewHtml = getMockElement('schemeDynamicPreviewContainer').innerHTML;
assert(invPreviewHtml.includes('schemeAbsorptionLedgerBox') || invPreviewHtml.includes('Kapasitas Penyerapan Multi-Berkas Aktif') || invPreviewHtml.includes('3 Berkas Berhasil Diserap'), 'Multi-File Absorption Ledger rendered in Investasi preview');
assert(invPreviewHtml.includes('Investment Scheme (33 Rasio & Z-Score)') && invPreviewHtml.includes('QUALITY OF EARNINGS'), 'Investasi preview strictly executes Investment logic (Z-Score & QoE)');

// TEST 2: Pengendali Entry Way Absorbs 3 Files & Applies Controlling Logic
console.log('\n--- TEST 2: Pengendali Entry Way Absorbs 3 Files & Applies Controlling Logic ---');
await sandbox.loadSchemeMultiFileBundle('pengendali_3files');
assert(appState.selectedScheme === 'pengendali', 'Selected scheme strictly switched to pengendali');
assert(appState.schemeAnalysisResult && appState.schemeAnalysisResult.filesProcessedCount === 3, `Pengendali successfully absorbed 3 files (got ${appState.schemeAnalysisResult?.filesProcessedCount})`);
const pengPreviewHtml = getMockElement('schemeDynamicPreviewContainer').innerHTML;
assert(pengPreviewHtml.includes('schemeAbsorptionLedgerBox') || pengPreviewHtml.includes('Kapasitas Penyerapan Multi-Berkas Aktif') || pengPreviewHtml.includes('3 Berkas Berhasil Diserap'), 'Multi-File Absorption Ledger rendered in Pengendali preview');
assert(pengPreviewHtml.includes('Pengendali Preview') && pengPreviewHtml.includes('SINYAL S7 GROWTH GAP'), 'Pengendali preview strictly executes Controlling logic (S7 Growth Gap +1,46%)');

// TEST 3: Non-Pengendali Entry Way Absorbs 3 Files & Applies Minority Logic
console.log('\n--- TEST 3: Non-Pengendali Entry Way Absorbs 3 Files & Applies Minority Logic ---');
await sandbox.loadSchemeMultiFileBundle('nonpengendali_3files');
assert(appState.selectedScheme === 'nonpengendali', 'Selected scheme strictly switched to nonpengendali');
assert(appState.schemeAnalysisResult && appState.schemeAnalysisResult.filesProcessedCount === 3, `Non-Pengendali successfully absorbed 3 files (got ${appState.schemeAnalysisResult?.filesProcessedCount})`);
const npPreviewHtml = getMockElement('schemeDynamicPreviewContainer').innerHTML;
assert(npPreviewHtml.includes('schemeAbsorptionLedgerBox') || npPreviewHtml.includes('Kapasitas Penyerapan Multi-Berkas Aktif') || npPreviewHtml.includes('3 Berkas Berhasil Diserap'), 'Multi-File Absorption Ledger rendered in Non-Pengendali preview');
assert(npPreviewHtml.includes('Non-Pengendali Preview') && npPreviewHtml.includes('RTC 301,20%') && npPreviewHtml.includes('PROTEKSI HAK DIVIDEN MINORITAS'), 'Non-Pengendali preview strictly executes Non-Pengendali logic (RTC 301% & Dividen 1%)');

// TEST 4: Smooth Dedicated Next-Page Navigation (No Scroll Down) on Portal Entry Points
console.log('\n--- TEST 4: Smooth Dedicated Next-Page Navigation (No Scroll Down) on Portal Entry Points ---');
const processSteps = vm.runInContext('processSteps', sandbox);
sandbox.enterSchemePortal('investasi', false);
assert(appState.currentView === 'investasi', 'enterSchemePortal("investasi", false) opens viewInvestasi next page');
assert(processSteps.investasi === 1, 'viewInvestasi starts cleanly at Step 1');

sandbox.enterSchemePortal('pengendali', false);
assert(appState.currentView === 'pengendali', 'enterSchemePortal("pengendali", false) opens viewPengendali next page');
assert(processSteps.pengendali === 1, 'viewPengendali starts cleanly at Step 1');

sandbox.enterSchemePortal('nonpengendali', false);
assert(appState.currentView === 'nonpengendali', 'enterSchemePortal("nonpengendali", false) opens viewNonPengendali next page');
assert(processSteps.nonpengendali === 1, 'viewNonPengendali starts cleanly at Step 1');

await sandbox.enterSchemePortal('investasi', true);
assert(appState.currentView === 'investasi', '1-Click 3-Files Investasi opens viewInvestasi next page');
assert(processSteps.investasi === 2, 'viewInvestasi transitions to Step 2 with absorbed files');

// ---------------------------------------------------------------------------
// SECTION 4: OM IHSAN EXECUTIVE SINGLE-DOOR & NARROWING JOURNEY VERIFICATION
// ---------------------------------------------------------------------------
console.log('\n--- SECTION 4: Om Ihsan Executive Single-Door & Narrowing Journey ---');

// 1. Executive Greeting on Page 1
assert(html.includes('id="omIhsanExecutiveGateway"'), '#omIhsanExecutiveGateway executive container exists');
assert(html.includes('Hi Ihsan, Mau Analisa Apa Hari Ini?'), 'Greeting "Hi Ihsan, Mau Analisa Apa Hari Ini?" is rendered in HTML');
assert(html.includes('Langsung Terbuka (Tanpa Perlu Login)'), 'Zero-login status "Langsung Terbuka (Tanpa Perlu Login)" is rendered');

// 2. 1-out-of-3 Choice Cards with Narrowing Direct Actions
assert(html.includes('PILIH 1 DARI 3 PINTU MASUK KHUSUS') || html.includes('PILIHAN 1 DARI 3 PINTU MASUK KHUSUS'), 'Headline "PILIH 1 DARI 3 PINTU MASUK KHUSUS" exists');
assert(html.includes('Pilih Fokus Analisis untuk Mengerucutkan Layar (Narrowing)'), 'Subheading mentions Narrowing concept');
assert(html.includes('PILIHAN 1 • JALUR A'), 'Pilihan 1 badge exists');
assert(html.includes('PILIHAN 2 • JALUR B'), 'Pilihan 2 badge exists');
assert(html.includes('PILIHAN 3 • JALUR C'), 'Pilihan 3 badge exists');
assert(html.includes('Pilih &amp; Mulai Analisis Investasi (Narrowing)'), 'Primary CTA for Investasi narrowing exists');
assert(html.includes('Pilih &amp; Mulai Analisis Pengendali (Narrowing)'), 'Primary CTA for Pengendali narrowing exists');
assert(html.includes('Pilih &amp; Mulai Analisis Non-Pengendali (Narrowing)'), 'Primary CTA for Non-Pengendali narrowing exists');

// 3. Narrowing Context Headers in all 3 dedicated views
assert(html.includes('🔒 FOKUS TERKUNCI (NARROWED): SKEMA INVESTASI'), 'viewInvestasi has narrowing context banner');
assert(html.includes('🔒 FOKUS TERKUNCI (NARROWED): ENTITAS PENGENDALI'), 'viewPengendali has narrowing context banner');
assert(html.includes('🔒 FOKUS TERKUNCI (NARROWED): NON-PENGENDALI'), 'viewNonPengendali has narrowing context banner');

const returnButtonMatches = html.match(/Ganti Pilihan Analisis \/ Kembali ke Beranda Om Ihsan/g) || [];
assert(returnButtonMatches.length >= 3, `All 3 views have return button "Ganti Pilihan Analisis / Kembali ke Beranda Om Ihsan" (found ${returnButtonMatches.length})`);

// 4. Collapsible Advanced Tools
assert(html.includes('id="advancedExecutiveOptionsContainer"'), '#advancedExecutiveOptionsContainer exists');
assert(html.includes('id="advancedHubCollapsibleContent" class="hidden"'), '#advancedHubCollapsibleContent is hidden by default');
assert(html.includes('toggleAdvancedHubVisibility'), 'toggleAdvancedHubVisibility() exists in JavaScript');

// ---------------------------------------------------------------------------
// SECTION 5: 1:1 REPO SYNCHRONIZATION
// ---------------------------------------------------------------------------
console.log('\n--- SECTION 5: File Synchronization Check ---');
assert(html === previewHtml, 'preview.html is 100% identical to public/index.html');

console.log('\n======================================================================');
console.log(`🏁 SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================================');

if (failCount > 0) process.exit(1);
