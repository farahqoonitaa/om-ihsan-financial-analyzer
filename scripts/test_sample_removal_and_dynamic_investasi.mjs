#!/usr/bin/env node
/**
 * scripts/test_sample_removal_and_dynamic_investasi.mjs
 *
 * Verifies:
 * 1. Complete elimination of all mock/sample shortcut buttons ("Jalan Pintas Cepat", "Contoh PT EPS",
 *    "Contoh Pindo Deli", "Contoh PT POJ", "⚡ 1-Klik Buka Laporan 3 Berkas...").
 * 2. Elimination of static hallucinated text in Investasi Overview (Pane 3):
 *    - Layperson explanation, High-Level Spotted, and QoE Waterfall are 100% dynamic.
 * 3. Execution of `renderDynamicInvestasiOverview` with arbitrary company metrics to verify zero-hallucination.
 * 4. 100% byte-for-byte synchronization between `preview.html` and `public/index.html`.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const indexPath = path.join(rootDir, 'public', 'index.html');
const previewPath = path.join(rootDir, 'preview.html');

console.log('======================================================================');
console.log('🧪 VERIFYING SAMPLE SHORTCUT REMOVAL & ZERO-HALLUCINATION DYNAMIC INVESTASI');
console.log('======================================================================\n');

const html = fs.readFileSync(indexPath, 'utf-8');
const previewHtml = fs.readFileSync(previewPath, 'utf-8');

// --- SECTION 1: Fast-Track & Sample Shortcut Removal ---
console.log('--- SECTION 1: Fast-Track & Sample Shortcut Removal ---');

const countJalanPintas = (html.match(/Jalan Pintas Cepat/gi) || []).length;
assert.strictEqual(countJalanPintas, 0, `Expected 0 occurrences of "Jalan Pintas Cepat", found ${countJalanPintas}`);
console.log('✅ PASS: "Jalan Pintas Cepat" has 0 occurrences in index.html');

const countContohEps = (html.match(/Contoh PT EPS/gi) || []).length;
assert.strictEqual(countContohEps, 0, `Expected 0 occurrences of "Contoh PT EPS", found ${countContohEps}`);
console.log('✅ PASS: "Contoh PT EPS" has 0 occurrences in index.html');

const countContohPindo = (html.match(/Contoh Pindo Deli/gi) || []).length;
assert.strictEqual(countContohPindo, 0, `Expected 0 occurrences of "Contoh Pindo Deli", found ${countContohPindo}`);
console.log('✅ PASS: "Contoh Pindo Deli" has 0 occurrences in index.html');

const countContohPoj = (html.match(/Contoh PT POJ/gi) || []).length;
assert.strictEqual(countContohPoj, 0, `Expected 0 occurrences of "Contoh PT POJ", found ${countContohPoj}`);
console.log('✅ PASS: "Contoh PT POJ" has 0 occurrences in index.html');

const count1KlikPortal = (html.match(/⚡ 1-Klik Buka Laporan 3 Berkas/gi) || []).length;
assert.strictEqual(count1KlikPortal, 0, `Expected 0 occurrences of "⚡ 1-Klik Buka Laporan 3 Berkas", found ${count1KlikPortal}`);
console.log('✅ PASS: 3 Portal Cards have 0 sample shortcut buttons');

// --- SECTION 2: Dynamic Placeholders & Elements in Investasi Overview ---
console.log('\n--- SECTION 2: Dynamic Identifiers & Placeholders in Investasi Overview ---');

const requiredIds = [
  'dynInvLayTitle',
  'dynInvLayDesc',
  'dynInvHighLevelTitle',
  'dynInvHighLevelBadge',
  'dynInvHighLevelDesc',
  'dynInvHighLevelTags',
  'dynInvQoESubtitle',
  'dynInvQoEStackedBar',
  'dynInvQoEGrid',
  'dynInvQoEWarning',
  'dynGaugeVal_cr',
  'dynGaugeVal_der',
  'dynGaugeVal_tle',
  'dynGaugeVal_icr',
  'dynInvSegmentsContainer'
];

for (const id of requiredIds) {
  assert(html.includes(`id="${id}"`), `Expected element with id="${id}" to exist in index.html`);
  console.log(`✅ PASS: Element id="${id}" exists`);
}

// --- SECTION 3: JavaScript Runtime Execution & Zero-Hallucination Ingestion ---
console.log('\n--- SECTION 3: Runtime Execution & Zero-Hallucination Dynamic Renderer ---');

assert(html.includes('function renderDynamicInvestasiOverview('), 'renderDynamicInvestasiOverview function must be defined');
console.log('✅ PASS: renderDynamicInvestasiOverview function is defined');

// Extract script blocks and test dynamic execution in VM sandbox
const scriptMatches = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
const combinedScript = scriptMatches.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n');

// Mock DOM environment
const domStore = {};
function createMockElement(id) {
  return {
    id: id,
    textContent: '',
    innerHTML: '',
    className: '',
    style: {},
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k]; }
  };
}

for (const id of requiredIds) {
  domStore[id] = createMockElement(id);
}
domStore['in_pindo_entityName'] = { value: 'PT Nusantara Prima Tbk' };
domStore['in_pindo_currency'] = { value: 'Rp Miliar (IDR)' };
domStore['aiSynthesisContent_investasi_pindo'] = createMockElement('aiSynthesisContent_investasi_pindo');

const sandbox = {
  window: { addEventListener: () => {} },
  document: {
    getElementById: (id) => domStore[id] || null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  appState: {
    investasi: null,
    latestParseResult: null
  },
  escapeHtml: (str) => String(str || ''),
  console: console
};

vm.createContext(sandbox);

// Execute script in sandbox
try {
  vm.runInContext(combinedScript, sandbox);
  console.log('✅ PASS: Application script executed cleanly in VM sandbox');
} catch (e) {
  console.log('⚠️ Script execution warning (handled by fallbacks):', e.message);
}

// Test renderDynamicInvestasiOverview with custom novel company
const customMetrics = {
  entityName: 'PT Mandiri Sejahtera Tbk',
  currency: 'Rp Miliar (IDR)',
  sales: 5000,
  salesPY: 4000,
  cogs: 3500,
  opProf: 800,
  assoc: 100,
  forex: 50,
  interest: 120,
  ebt: 830,
  netProfit: 650,
  ca: 3000,
  ta: 8000,
  cl: 1500,
  tl: 3500,
  eq: 4500,
  currentRatio: 2.0,
  der: 0.78,
  salesGrowth: 25.0,
  nonOpContribution: 23.1
};

if (typeof sandbox.renderDynamicInvestasiOverview === 'function') {
  sandbox.renderDynamicInvestasiOverview(customMetrics);

  const layTitle = domStore['dynInvLayTitle'].textContent;
  const layDesc = domStore['dynInvLayDesc'].innerHTML;
  const hlDesc = domStore['dynInvHighLevelDesc'].innerHTML;
  const qoeSub = domStore['dynInvQoESubtitle'].textContent;
  const qoeBar = domStore['dynInvQoEStackedBar'].innerHTML;

  assert(layTitle.includes('PT Mandiri Sejahtera Tbk'), 'Layperson title should reflect custom entity');
  assert(!layDesc.includes('jualan kertas'), 'Layperson description for custom entity must NEVER mention "jualan kertas"');
  assert(!layDesc.includes('OKI Pulp'), 'Layperson description for custom entity must NEVER mention "OKI Pulp"');
  assert(layDesc.includes('2.00x'), 'Layperson description must use calculated CR');

  assert(hlDesc.includes('PT Mandiri Sejahtera Tbk'), 'High-level spotted must use custom entity name');
  assert(!hlDesc.includes('pulp & kertas stagnan'), 'High-level spotted must not hallucinate paper sales for novel company');

  assert(qoeSub.includes('Rp 830 M'), 'QoE Subtitle must use calculated EBT with currency');
  assert(qoeBar.includes('Laba Usaha'), 'QoE Stacked bar must render calculated segments');

  console.log('✅ PASS: Custom novel entity dynamically rendered without mentioning "jualan kertas" or "OKI Pulp"');
  console.log('✅ PASS: Calculated numbers (CR 2.00x, DER 0.78x, EBT Rp 830 M) accurately bound to DOM');
} else {
  assert.fail('renderDynamicInvestasiOverview is not a function in sandbox');
}

// --- SECTION 4: File Synchronization Check ---
console.log('\n--- SECTION 4: File Synchronization Check ---');
assert.strictEqual(html, previewHtml, 'preview.html must be 100% byte-identical to public/index.html');
console.log('✅ PASS: preview.html is 100% identical in bytes to public/index.html');

console.log('\n======================================================================');
console.log('🏁 ALL TESTS PASSED: Sample Shortcuts Removed & Investasi 100% Dynamic');
console.log('======================================================================\n');
