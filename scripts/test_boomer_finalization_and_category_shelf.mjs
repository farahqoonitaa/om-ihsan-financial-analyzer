/**
 * Verification Test Suite: Boomer-Friendly Finalization Loading State,
 * Auto-Save Confirmation, and Nice Categorized Archive Shelf (Knowledge Base)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('🧪 BOOMER-FRIENDLY FINALIZATION & CATEGORIZED SHELF TEST SUITE');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failCount++;
    process.exitCode = 1;
  }
}

const indexHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf-8');
const previewHtml = fs.readFileSync(path.join(rootDir, 'preview.html'), 'utf-8');

// ----------------------------------------------------
// SECTION 1: MODAL FINALIZE LOADING STATE ARCHITECTURE
// ----------------------------------------------------
console.log('--- SECTION 1: Finalization Loading Modal & Visual Polish ---');

assert(indexHtml.includes('id="modalFinalizeLoading"'), 'Modal #modalFinalizeLoading exists in HTML');
assert(indexHtml.includes('id="finalizeSpinnerRing"'), 'Spinner ring #finalizeSpinnerRing exists');
assert(indexHtml.includes('id="finalizeModalSchemeBadge"'), 'Scheme badge #finalizeModalSchemeBadge exists');
assert(indexHtml.includes('id="finalizeModalTitle"'), 'Title #finalizeModalTitle exists');
assert(indexHtml.includes('id="finalizeProgressBar"'), 'Progress bar #finalizeProgressBar exists');
assert(indexHtml.includes('id="finalizeCheck1"'), 'Check step 1 #finalizeCheck1 exists');
assert(indexHtml.includes('id="finalizeCheck2"'), 'Check step 2 #finalizeCheck2 exists');
assert(indexHtml.includes('id="finalizeCheck3"'), 'Check step 3 #finalizeCheck3 exists');

// ----------------------------------------------------
// SECTION 2: STEP 5 SAVED CONFIRMATION & CATEGORY SHELF DOM
// ----------------------------------------------------
console.log('\n--- SECTION 2: Step 5 DOM Elements in All 4 Workflows ---');

const workflows = ['investasi', 'pengendali', 'nonpengendali', 'konsolidasi'];
for (const wf of workflows) {
  assert(indexHtml.includes(`id="savedConfirmationCard_${wf}"`), `#savedConfirmationCard_${wf} exists on Step 5`);
  assert(indexHtml.includes(`id="niceCategoryShelf_${wf}"`), `#niceCategoryShelf_${wf} exists on Step 5`);
}

// Check Big Senior Boomer Action Buttons exist in Step 5
assert(indexHtml.includes('boomer-action-btn-primary'), 'High-contrast primary boomer action buttons exist');
assert(indexHtml.includes('boomer-action-btn-secondary'), 'High-contrast secondary boomer action buttons exist');

// ----------------------------------------------------
// SECTION 3: JAVASCRIPT ENGINE & CATEGORY CLASSIFICATION RUNTIME
// ----------------------------------------------------
console.log('\n--- SECTION 3: JavaScript Engine & Runtime Categorization ---');

assert(indexHtml.includes('function showFinalizeLoadingModal'), 'showFinalizeLoadingModal() is defined');
assert(indexHtml.includes('function archiveCurrentReportIntoKnowledgeBase'), 'archiveCurrentReportIntoKnowledgeBase() is defined');
assert(indexHtml.includes('function renderSavedConfirmationCard'), 'renderSavedConfirmationCard() is defined');
assert(indexHtml.includes('function renderNiceCategoryShelf'), 'renderNiceCategoryShelf() is defined');
assert(indexHtml.includes('function switchCategoryShelfTab'), 'switchCategoryShelfTab() is defined');
assert(indexHtml.includes('function quickCompareWithPreviousYear'), 'quickCompareWithPreviousYear() is defined');

// Extract and execute JS in mock sandbox
const jsCodeMatches = indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g);
let combinedJs = '';
for (const m of jsCodeMatches) {
  combinedJs += m[1] + '\n';
}

const mockDom = new Map();
function getMockElement(id) {
  if (!mockDom.has(id)) {
    mockDom.set(id, {
      id,
      innerHTML: '',
      textContent: '',
      style: {},
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (this._classes.has(c)) this._classes.delete(c);
            else this._classes.add(c);
          } else if (force) {
            this._classes.add(c);
          } else {
            this._classes.delete(c);
          }
        }
      },
      querySelector: () => getMockElement(id + '_child'),
      querySelectorAll: () => [],
      scrollIntoView: () => {},
      _value: '',
      get value() { return this._value; },
      set value(v) { this._value = String(v ?? ''); }
    });
  }
  return mockDom.get(id);
}

const sandbox = {
  console: { log: () => {}, error: () => {}, warn: () => {} },
  setTimeout: (fn, ms) => { fn(); return 1; },
  clearTimeout: () => {},
  document: {
    getElementById: (id) => getMockElement(id),
    querySelector: (sel) => getMockElement(sel.replace(/[^a-zA-Z0-9_-]/g, '')),
    querySelectorAll: () => [],
    createElement: (tag) => getMockElement(`elem_${tag}_${Math.random()}`),
    body: getMockElement('body')
  },
  window: {
    addEventListener: () => {},
    scrollTo: () => {}
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  },
  fetch: async () => ({ ok: true, json: async () => ({ success: true }) })
};

vm.createContext(sandbox);

try {
  vm.runInContext(combinedJs, sandbox);
  assert(true, 'Combined JavaScript compiled and executed without errors in sandbox');
} catch (e) {
  assert(false, `Sandbox execution error: ${e.message}`);
}

// Test Runtime Archiving for all 3 schemes into the nice categories:
if (sandbox.archiveCurrentReportIntoKnowledgeBase) {
  // Test Investasi
  const invRecord = sandbox.archiveCurrentReportIntoKnowledgeBase('investasi');
  assert(invRecord.category === 'Investasi', 'Investasi correctly archives to "Investasi" category');
  assert(invRecord.isJustFinalized === true, 'Investasi record marked as isJustFinalized');
  assert(invRecord.status === 'STORED', 'Investasi status is STORED');

  // Test Pengendali
  const pRecord = sandbox.archiveCurrentReportIntoKnowledgeBase('pengendali');
  assert(pRecord.category === 'Pengendali', 'Pengendali correctly archives to "Pengendali" category');
  assert(pRecord.isJustFinalized === true, 'Pengendali record marked as isJustFinalized');
  assert(pRecord.status === 'STORED', 'Pengendali status is STORED');

  // Test Non-Pengendali
  const npRecord = sandbox.archiveCurrentReportIntoKnowledgeBase('nonpengendali');
  assert(npRecord.category === 'Non-Pengendali', 'Non-Pengendali correctly archives to "Non-Pengendali" category');
  assert(npRecord.isJustFinalized === true, 'Non-Pengendali record marked as isJustFinalized');
  assert(npRecord.status === 'STORED', 'Non-Pengendali status is STORED');

  // Test renderNiceCategoryShelf
  const shelfContainer = getMockElement('niceCategoryShelf_investasi');
  sandbox.renderNiceCategoryShelf('niceCategoryShelf_investasi', 'investasi');
  assert(shelfContainer.innerHTML.includes('Lemari Investasi'), 'Category shelf renders "Lemari Investasi" tab');
  assert(shelfContainer.innerHTML.includes('Lemari Pengendali'), 'Category shelf renders "Lemari Pengendali" tab');
  assert(shelfContainer.innerHTML.includes('Lemari Non-Pengendali'), 'Category shelf renders "Lemari Non-Pengendali" tab');
  assert(shelfContainer.innerHTML.includes('BARU SAJA DIFINALISASI'), 'Category shelf highlights freshly finalized report');
}

// ----------------------------------------------------
// SECTION 4: FILE SYNCHRONIZATION
// ----------------------------------------------------
console.log('\n--- SECTION 4: File Synchronization Check ---');
assert(indexHtml === previewHtml, 'preview.html is 100% identical to public/index.html');

console.log('\n======================================================================');
console.log(`🏁 SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
}
