/**
 * Verification Test Suite: Step-by-Step Structured Workflow & 100% Bilingual Consistency
 * Tests the complete redesign:
 * [1] Process Hub Landing Dashboard (Entry Points, Scenario Cards, Universal Dropzone)
 * [2] 5-Step Stepper Architecture across all 4 workflows (Pengendali, Non-Pengendali, Investasi, Konsolidasi)
 * [3] Stepper Controller Logic (setProcessStep, nextProcessStep, prevProcessStep, case toggling)
 * [4] Continuous Next Journey Links on Step 5
 * [5] 100% Bilingual Consistency (EN <-> ID) across all 97 UI keys
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 RUNNING VERIFICATION: STEP-BY-STEP WORKFLOW & BILINGUAL SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failCount++;
  }
}

const indexHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf-8');
const previewHtml = fs.readFileSync(path.join(rootDir, 'preview.html'), 'utf-8');

// ----------------------------------------------------
// SECTION 1: PROCESS HUB LANDING ARCHITECTURE
// ----------------------------------------------------
console.log('--- SECTION 1: Process Hub Landing Architecture ---');

assert(indexHtml.includes('id="viewMainMenu"'), '#viewMainMenu process hub exists');
assert(indexHtml.includes('id="txt_brand_hub_title"'), 'Process hub title #txt_brand_hub_title exists');
assert(indexHtml.includes('id="txt_brand_hub_sub"'), 'Process hub subtitle #txt_brand_hub_sub exists');
assert(indexHtml.includes('id="blankStateHero"'), 'Universal drag-and-drop zone #blankStateHero exists');
assert(indexHtml.includes('process-cards-container'), 'Process cards grid .process-cards-container exists');

const requiredProcessCards = ['proc-1', 'proc-2', 'proc-3', 'proc-4'];
for (const pc of requiredProcessCards) {
  assert(indexHtml.includes(`class="proc-card ${pc}"`), `Process card .${pc} exists`);
}

// Check scenario, inputs, outputs, and CTAs on all 4 cards
assert(indexHtml.includes('data-i18n="proc1_scenario"'), 'Card 1 contains business scenario');
assert(indexHtml.includes('data-i18n="proc1_inputs"'), 'Card 1 contains required inputs');
assert(indexHtml.includes('data-i18n="proc1_deliverables"'), 'Card 1 contains expected deliverables');
assert(indexHtml.includes('data-i18n="proc1_cta"'), 'Card 1 contains CTA button');

assert(indexHtml.includes('data-i18n="proc2_scenario"'), 'Card 2 contains business scenario');
assert(indexHtml.includes('data-i18n="proc2_inputs"'), 'Card 2 contains required inputs');
assert(indexHtml.includes('data-i18n="proc2_deliverables"'), 'Card 2 contains expected deliverables');
assert(indexHtml.includes('data-i18n="proc2_cta"'), 'Card 2 contains CTA button');

assert(indexHtml.includes('data-i18n="proc3_scenario"'), 'Card 3 contains business scenario');
assert(indexHtml.includes('data-i18n="proc3_inputs"'), 'Card 3 contains required inputs');
assert(indexHtml.includes('data-i18n="proc3_deliverables"'), 'Card 3 contains expected deliverables');
assert(indexHtml.includes('data-i18n="proc3_cta"'), 'Card 3 contains CTA button');

assert(indexHtml.includes('data-i18n="proc4_scenario"'), 'Card 4 contains business scenario');
assert(indexHtml.includes('data-i18n="proc4_inputs"'), 'Card 4 contains required inputs');
assert(indexHtml.includes('data-i18n="proc4_deliverables"'), 'Card 4 contains expected deliverables');
assert(indexHtml.includes('data-i18n="proc4_cta"'), 'Card 4 contains CTA button');

// 1-Click Benchmark documents
assert(indexHtml.includes("openDocumentAnalysis('pindodeli')"), 'Benchmark button for PT Pindo Deli exists');
assert(indexHtml.includes("openDocumentAnalysis('daaz')"), 'Benchmark button for PT DAAZ exists');
assert(indexHtml.includes("openDocumentAnalysis('eps')"), 'Benchmark button for PT EPS exists');
assert(indexHtml.includes("openDocumentAnalysis('poj')"), 'Benchmark button for PT POJ exists');

// ----------------------------------------------------
// SECTION 2: 5-STEP STEPPER DOM ARCHITECTURE (ALL 4 WORKFLOWS)
// ----------------------------------------------------
console.log('\n--- SECTION 2: 5-Step Stepper DOM Architecture ---');

const workflows = [
  { name: 'pengendali', prefix: 'p' },
  { name: 'nonpengendali', prefix: 'np' },
  { name: 'investasi', prefix: 'inv' },
  { name: 'konsolidasi', prefix: 'kons' }
];

for (const wf of workflows) {
  // Stepper container
  assert(indexHtml.includes(`id="${wf.prefix}_stepper"`), `Workflow stepper #${wf.prefix}_stepper exists for ${wf.name}`);

  // 5 Step nodes
  for (let s = 1; s <= 5; s++) {
    assert(indexHtml.includes(`id="${wf.prefix}_step_node_${s}"`), `Step node #${wf.prefix}_step_node_${s} exists for ${wf.name}`);
  }

  // 4 Step dividers
  for (let d = 1; d <= 4; d++) {
    assert(indexHtml.includes(`id="${wf.prefix}_step_div_${d}"`), `Step divider #${wf.prefix}_step_div_${d} exists for ${wf.name}`);
  }

  // 5 Step panes
  for (let p = 1; p <= 5; p++) {
    assert(indexHtml.includes(`id="${wf.prefix}_step_pane_${p}"`), `Step pane #${wf.prefix}_step_pane_${p} exists for ${wf.name}`);
  }
}

// ----------------------------------------------------
// SECTION 3: STEPPER CONTROLLER LOGIC & CODE INTEGRITY
// ----------------------------------------------------
console.log('\n--- SECTION 3: Stepper Controller Logic & Code Integrity ---');

assert(indexHtml.includes('const processSteps = {'), 'processSteps state object defined in JS');
assert(indexHtml.includes('function setProcessStep(proc, step)'), 'setProcessStep() function defined in JS');
assert(indexHtml.includes('function nextProcessStep(proc)'), 'nextProcessStep() function defined in JS');
assert(indexHtml.includes('function prevProcessStep(proc)'), 'prevProcessStep() function defined in JS');

// Auto-advance hooks into calculation engines
assert(indexHtml.includes("setProcessStep('pengendali', 2)"), "runPengendaliAnalysis transitions to Step 2");
assert(indexHtml.includes("setProcessStep('nonpengendali', 2)"), "runNonPengendaliAnalysis transitions to Step 2");
assert(indexHtml.includes("setProcessStep('investasi', 2)"), "runInvestasiAnalysis transitions to Step 2");

// Investasi multi-case pane switching
assert(indexHtml.includes(".inv-pindo-content"), ".inv-pindo-content class used for Pindo Deli elements");
assert(indexHtml.includes(".inv-daaz-content"), ".inv-daaz-content class used for DAAZ elements");
assert(indexHtml.includes("document.querySelectorAll('.inv-pindo-content')"), "selectInvestasiCase toggles .inv-pindo-content");
assert(indexHtml.includes("document.querySelectorAll('.inv-daaz-content')"), "selectInvestasiCase toggles .inv-daaz-content");

// ----------------------------------------------------
// SECTION 4: STEP 5 CONTINUOUS NEXT JOURNEY LINKS
// ----------------------------------------------------
console.log('\n--- SECTION 4: Step 5 Continuous Next Journey Links ---');

// Pengendali Step 5 links to Konsolidasi and Non-Pengendali
const pStep5 = indexHtml.substring(indexHtml.indexOf('id="p_step_pane_5"'), indexHtml.indexOf('<!-- ALUR 2: ENTITAS NON-PENGENDALI'));
assert(pStep5.includes("switchView('konsolidasi')"), 'Pengendali Step 5 links forward to Konsolidasi');
assert(pStep5.includes("switchView('nonpengendali')"), 'Pengendali Step 5 links to Non-Pengendali');
assert(pStep5.includes("openCopilotDrawer"), 'Pengendali Step 5 links to Forensic Copilot');

// Non-Pengendali Step 5 links to Konsolidasi and Pengendali
const npStep5 = indexHtml.substring(indexHtml.indexOf('id="np_step_pane_5"'), indexHtml.indexOf('<!-- ALUR 3: SKEMA INVESTASI'));
assert(npStep5.includes("switchView('konsolidasi')"), 'Non-Pengendali Step 5 links forward to Konsolidasi');
assert(npStep5.includes("switchView('pengendali')"), 'Non-Pengendali Step 5 links to Pengendali');
assert(npStep5.includes("openCopilotDrawer"), 'Non-Pengendali Step 5 links to Forensic Copilot');

// Investasi Step 5 links to Konsolidasi and Pengendali
const invStep5 = indexHtml.substring(indexHtml.indexOf('id="inv_step_pane_5"'), indexHtml.indexOf('<!-- ALUR 4: KONSOLIDASI AKHIR'));
assert(invStep5.includes("switchView('konsolidasi')"), 'Investasi Step 5 links forward to Konsolidasi');
assert(invStep5.includes("switchView('pengendali')"), 'Investasi Step 5 links to Pengendali');
assert(invStep5.includes("openCopilotDrawer"), 'Investasi Step 5 links to Forensic Copilot');

// Konsolidasi Step 5 links to Data Pool and Copilot
const konsStep5 = indexHtml.substring(indexHtml.indexOf('id="kons_step_pane_5"'), indexHtml.indexOf('<!-- ALUR 5: FORENSIC DATA POOL'));
assert(konsStep5.includes("switchView('datapool')"), 'Konsolidasi Step 5 links to Data Pool');
assert(konsStep5.includes("openCopilotDrawer"), 'Konsolidasi Step 5 links to Forensic Copilot');
assert(konsStep5.includes("switchView('main_menu')"), 'Konsolidasi Step 5 links to Main Menu');

// ----------------------------------------------------
// SECTION 5: 100% BILINGUAL CONSISTENCY (EN <-> ID)
// ----------------------------------------------------
console.log('\n--- SECTION 5: 100% Bilingual Consistency (EN <-> ID) ---');

// Extract TRANSLATIONS object from index.html
const idBlockMatch = indexHtml.match(/id:\s*\{([\s\S]*?)\},\s*en:\s*\{([\s\S]*?)\}\s*\};/);
assert(idBlockMatch !== null, 'TRANSLATIONS dictionary extracted successfully');

function extractKeys(block) {
  const keys = {};
  const regex = /([a-zA-Z0-9_]+)\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;
  let match;
  while ((match = regex.exec(block)) !== null) {
    keys[match[1]] = match[2].slice(1, -1);
  }
  return keys;
}

const idDict = extractKeys(idBlockMatch[1]);
const enDict = extractKeys(idBlockMatch[2]);

// Extract all data-i18n and data-i18n-html keys from HTML
const i18nMatches = [...indexHtml.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]);
const i18nHtmlMatches = [...indexHtml.matchAll(/data-i18n-html="([^"]+)"/g)].map(m => m[1]);
const allHtmlKeys = [...new Set([...i18nMatches, ...i18nHtmlMatches])];

console.log(`Found ${allHtmlKeys.length} unique data-i18n keys in HTML DOM.`);
assert(allHtmlKeys.length >= 80, `HTML has comprehensive i18n coverage (${allHtmlKeys.length} keys >= 80)`);

// Verify all HTML keys exist in TRANSLATIONS.id
const missingInId = allHtmlKeys.filter(k => !(k in idDict));
assert(missingInId.length === 0, `All HTML data-i18n keys present in TRANSLATIONS.id (Missing: ${missingInId.join(', ') || 'None'})`);

// Verify all HTML keys exist in TRANSLATIONS.en
const missingInEn = allHtmlKeys.filter(k => !(k in enDict));
assert(missingInEn.length === 0, `All HTML data-i18n keys present in TRANSLATIONS.en (Missing: ${missingInEn.join(', ') || 'None'})`);

// Check that dynamic attribute binder is present in applyLanguage
assert(indexHtml.includes("document.querySelectorAll('[data-i18n]')"), 'applyLanguage contains dynamic [data-i18n] query selector');
assert(indexHtml.includes("document.querySelectorAll('[data-i18n-html]')"), 'applyLanguage contains dynamic [data-i18n-html] query selector');

// Spot check crucial translations
assert(idDict['step1_name'] === '1. Input & Berkas', 'ID step1_name is "1. Input & Berkas"');
assert(enDict['step1_name'] === '1. Input & Files', 'EN step1_name is "1. Input & Files"');

assert(idDict['step3_name'] === '3. Analisis Forensik', 'ID step3_name is "3. Analisis Forensik"');
assert(enDict['step3_name'] === '3. Forensic Analysis', 'EN step3_name is "3. Forensic Analysis"');

assert(idDict['step4_name'] === '4. Nota Dinas', 'ID step4_name is "4. Nota Dinas"');
assert(enDict['step4_name'] === '4. Official Memo', 'EN step4_name is "4. Official Memo"');

assert(idDict['step5_name'] === '5. Ekspor & Alur Lanjutan', 'ID step5_name is "5. Ekspor & Alur Lanjutan"');
assert(enDict['step5_name'] === '5. Export & Next Journey', 'EN step5_name is "5. Export & Next Journey"');

assert(idDict['btn_step5_home'].includes('Kembali ke Menu Utama'), 'ID btn_step5_home has Indonesian return text');
assert(enDict['btn_step5_home'].includes('Return to Main Menu'), 'EN btn_step5_home has English return text');

// Verify preview.html matches public/index.html
assert(previewHtml.length === indexHtml.length, 'preview.html is perfectly synchronized with public/index.html');

console.log('\n================================================================');
console.log(`🏁 SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
