/**
 * Verification Test Suite for Om Ihsan / Kajian Ihsan Financial Platform
 * Tests all 5 user requirements:
 * [1] Rebrand YKPP -> Kajian Ihsan
 * [2] Nota Dinas / Doc Anomaly Spotting Structure
 * [3] Settings AI Provider Toggle (Google vs Local)
 * [4] Knowledge Base Grounding Selector (Tick/Checkboxes)
 * [5] Step-by-Step Exact Pattern Calculation Engine
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import engines using dynamic import or createRequire
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const ragEngine = require('../src/engine/ragEngine');
const geminiClient = require('../src/engine/geminiClient');
const masterParams = require('../src/data/masterParameters');
const seedData = require('../src/data/seedData');

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE VERIFICATION TEST SUITE');
console.log('====================================================\n');

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

// ----------------------------------------------------
// TEST 1: Rebrand Verification (Zero YKPP)
// ----------------------------------------------------
console.log('--- TEST 1: Rebrand Kajian Ihsan (Zero YKPP) ---');
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf-8');
const hasYkppInHtml = indexHtmlContent.includes('YKPP');
assert(!hasYkppInHtml, 'public/index.html contains 0 occurrences of YKPP');
assert(indexHtmlContent.includes('Kajian Ihsan'), 'public/index.html contains Kajian Ihsan branding');

const allRagDocs = ragEngine.getAllDocuments();
const ragHasYkpp = JSON.stringify(allRagDocs).includes('YKPP');
assert(!ragHasYkpp, 'ragEngine documents contain 0 occurrences of YKPP');
assert(allRagDocs.length >= 8, `ragEngine contains all ${allRagDocs.length} standard reference documents`);

// ----------------------------------------------------
// TEST 2: Knowledge Base Grounding Filter (Tick Selection)
// ----------------------------------------------------
console.log('\n--- TEST 2: Knowledge Base Grounding Filter (Tick Selection) ---');
// Select only Non-Pengendali doc
const filteredContext = ragEngine.buildGroundedContext('piutang dividen', ['DOC-PRD-POJ-01']);
assert(filteredContext.includes('DOC-PRD-POJ-01'), 'buildGroundedContext includes selected doc DOC-PRD-POJ-01');
assert(!filteredContext.includes('DOC-PRD-EPS-02'), 'buildGroundedContext excludes unselected doc DOC-PRD-EPS-02');

// Select only Pengendali doc
const epsContext = ragEngine.buildGroundedContext('growth gap', ['DOC-PRD-EPS-02']);
assert(epsContext.includes('DOC-PRD-EPS-02'), 'buildGroundedContext includes selected doc DOC-PRD-EPS-02');
assert(!epsContext.includes('DOC-PRD-POJ-01'), 'buildGroundedContext excludes unselected doc DOC-PRD-POJ-01');

// ----------------------------------------------------
// TEST 3: Exact Step-by-Step Pattern Calculation Engine
// ----------------------------------------------------
console.log('\n--- TEST 3: Exact Pattern Calculation Engine ---');
const formulaQueries = [
  { q: 'tampilkan rumus pola perhitungan RTC piutang', entity: 'non_pengendali', expect: ['301', '185', '61.42'] },
  { q: 'bagaimana cara hitung growth gap S7', entity: 'pengendali', expect: ['Growth Gap', '32.91', '31.45'] },
  { q: 'rumus modified z score', entity: 'investasi', expect: ['Modified Z-Score', '2.541'] },
  { q: 'cara hitung dividen minoritas', entity: 'non_pengendali', expect: ['1%', '185', '18.50'] }
];

for (const fq of formulaQueries) {
  const resp = geminiClient.generateDeterministicResponse(
    fq.q,
    { entity: fq.entity, mode: fq.entity }
  );
  let allFound = true;
  for (const exp of fq.expect) {
    if (!resp.includes(exp)) {
      allFound = false;
      console.warn(`  Missing expected pattern "${exp}" in response for "${fq.q}"`);
    }
  }
  assert(allFound, `Pattern calculation for "${fq.q}" provides exact formulas and numbers`);
}

// ----------------------------------------------------
// TEST 4: Nota Dinas & High-Level Anomaly Spotting Structure
// ----------------------------------------------------
console.log('\n--- TEST 4: Nota Dinas & High-Level Anomaly Spotting in HTML ---');
const requiredNotaDinasIds = [
  'ndPengendaliBox',
  'ndNonPengendaliBox',
  'ndInvestasiBox',
  'ndKonsolidasiBox'
];

for (const id of requiredNotaDinasIds) {
  assert(indexHtmlContent.includes(`id="${id}"`), `Executive Nota Dinas container #${id} exists`);
}

const requiredAnomalyBadges = [
  'Sinyal S7 Growth Gap',
  'Lonjakan Piutang Usaha Ekstrem (RTC 301,20%)',
  'Hak Dividen Minoritas 1%',
  'Kepatuhan Batas Legal Leverage POJK DER'
];

for (const text of requiredAnomalyBadges) {
  assert(indexHtmlContent.includes(text), `High-level anomaly spotting indicator "${text}" is present`);
}

// ----------------------------------------------------
// TEST 5: Dedicated Settings Page & Provider Toggle
// ----------------------------------------------------
console.log('\n--- TEST 5: Dedicated Settings Page & Provider Toggle ---');
assert(indexHtmlContent.includes('id="viewSettings"'), 'View #viewSettings exists');
assert(indexHtmlContent.includes('id="radioProviderGoogle"'), 'Radio #radioProviderGoogle exists');
assert(indexHtmlContent.includes('id="radioProviderLocal"'), 'Radio #radioProviderLocal exists');
assert(indexHtmlContent.includes('id="settingsInputApiKey"'), 'API Key input #settingsInputApiKey exists');
assert(indexHtmlContent.includes('id="settingsSelectModel"'), 'Model selector #settingsSelectModel exists');
assert(indexHtmlContent.includes('selectAiProvider'), 'selectAiProvider() function defined');
assert(indexHtmlContent.includes('renderSettingsView'), 'renderSettingsView() function defined');
assert(indexHtmlContent.includes('renderKnowledgeBaseSelector'), 'renderKnowledgeBaseSelector() function defined');

// ----------------------------------------------------
// TEST 6: Dual Provider Modal (Google Gemini vs OpenAI ChatGPT)
// ----------------------------------------------------
console.log('\n--- TEST 6: Dual Provider Selection (Google Gemini vs OpenAI ChatGPT) ---');
assert(indexHtmlContent.includes('id="modalApiKey"'), 'Modal #modalApiKey exists');
assert(indexHtmlContent.includes('id="tabKeyGoogle"'), 'Tab #tabKeyGoogle exists in modal');
assert(indexHtmlContent.includes('id="tabKeyOpenAI"'), 'Tab #tabKeyOpenAI exists in modal');
assert(indexHtmlContent.includes('selectModalAiProvider'), 'selectModalAiProvider() function defined');
assert(indexHtmlContent.includes('handleModalApiKeyInput'), 'handleModalApiKeyInput() function defined');
assert(indexHtmlContent.includes('callOpenAiApiFromBrowser'), 'callOpenAiApiFromBrowser() function defined');
assert(indexHtmlContent.includes('id="cardProviderOpenAI"'), 'Settings card #cardProviderOpenAI exists');
assert(indexHtmlContent.includes('id="radioProviderOpenAI"'), 'Settings radio #radioProviderOpenAI exists');
assert(indexHtmlContent.includes('id="settingsInputOpenAiKey"'), 'Settings input #settingsInputOpenAiKey exists');
assert(indexHtmlContent.includes('id="settingsSelectOpenAiModel"'), 'Settings select #settingsSelectOpenAiModel exists');

const openAiClient = require('../src/engine/openAiClient');
assert(typeof openAiClient.askCopilot === 'function', 'openAiClient.askCopilot is a function');
const openAiTestResp = await openAiClient.askCopilot('tes format forensik', { mode: 'pengendali' });
assert(openAiTestResp && openAiTestResp.answer, 'openAiClient provides robust response with local fallback');

// ----------------------------------------------------
// TEST 7: 7-Section Expected Output for Investment Analysis (PT Pindo Deli)
// ----------------------------------------------------
console.log('\n--- TEST 7: 7-Section Expected Output for Investment Analysis ---');
const updatedHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf-8');
assert(updatedHtml.includes('PT Pindo Deli Pulp and Paper Mills'), 'PT Pindo Deli entity name is rendered');
assert(updatedHtml.includes('Ringkasan Posisi Keuangan (Neraca)'), 'Section 1: Ringkasan Posisi Keuangan (Neraca) exists');
assert(updatedHtml.includes('Analisis Horizontal Laba Rugi'), 'Section 2: Analisis Horizontal Laba Rugi exists');
assert(updatedHtml.includes('Analisis Vertikal (Margin dan Struktur Biaya)'), 'Section 3: Analisis Vertikal exists');
assert(updatedHtml.includes('Pembacaan Segmen Usaha'), 'Section 4: Pembacaan Segmen Usaha exists');
assert(updatedHtml.includes('Covenant dan Headroom'), 'Section 5: Covenant dan Headroom exists');
assert(updatedHtml.includes('Penilaian dari Perspektif Investor'), 'Section 6: Penilaian dari Perspektif Investor exists');
assert(updatedHtml.includes('Kesimpulan Kajian Ihsan'), 'Section 7: Kesimpulan Kajian Ihsan exists');
assert(updatedHtml.includes('Quality of Earnings Waterfall Analysis'), 'Quality of Earnings Waterfall widget exists');
assert(updatedHtml.includes('id="btnCasePindo"'), 'Case switcher button #btnCasePindo exists');
assert(updatedHtml.includes('id="btnCaseDaaz"'), 'Case switcher button #btnCaseDaaz exists');
assert(updatedHtml.includes('selectInvestasiCase'), 'selectInvestasiCase() function defined');
assert(updatedHtml.includes('Nota_Dinas_Investasi_PT_Pindo_Deli.doc'), 'Dynamic Word export for Pindo Deli exists');

// Verify seedData contains Pindo Deli with all exact financials
const pindoSeed = seedData.investasi.find(i => i.id === 'investasi-pindodeli');
assert(pindoSeed !== undefined, 'seedData contains investasi-pindodeli');
assert(pindoSeed.financials.totalAssetsCY === 9564776, 'Pindo Deli Total Assets is USD 9.564.776k');
assert(pindoSeed.financials.netProfitCY === 455637, 'Pindo Deli Net Profit is USD 455.637k (+210,3%)');
assert(pindoSeed.financials.associateIncomeCY === 212518, 'Pindo Deli Associate Income is USD 212.518k');
assert(pindoSeed.financials.forexGainCY === 140198, 'Pindo Deli FX Gain is USD 140.198k');

// Verify RAG engine has Pindo Deli doc registered
const pindoDoc = ragEngine.getDocumentById('DOC-INV-PINDO-01');
assert(pindoDoc !== null, 'DOC-INV-PINDO-01 is present in ragEngine');
const pindoRagQuery = ragEngine.buildGroundedContext('kualitas laba pindo deli', ['DOC-INV-PINDO-01']);
assert(pindoRagQuery.includes('Pindo Deli'), 'RAG context grounding retrieves Pindo Deli expected output');

// ----------------------------------------------------
// TEST 8: AI Thinking Logic Document Parser & Dynamic Entity Binding
// ----------------------------------------------------
console.log('\n--- TEST 8: AI Thinking Logic Document Parser & Dynamic Entity Binding ---');
const documentParser = require('../src/engine/documentParser');

// 1. Parsing "expected output for the investment analysis.pdf" strictly maps to PT Pindo Deli
const pindoParsed = documentParser.parseDocumentNode({ fileName: 'expected output for the investment analysis.pdf' });
assert(pindoParsed.success, 'Parser successfully processes investment analysis file');
assert(pindoParsed.entityName.includes('Pindo Deli'), `File 'expected output for the investment analysis.pdf' maps to '${pindoParsed.entityName}' (NOT PT EPS)`);
assert(pindoParsed.targetView === 'investasi', `Target view for Pindo Deli is 'investasi' (got '${pindoParsed.targetView}')`);
assert(pindoParsed.currency.includes('USD'), `Currency for Pindo Deli is USD (got '${pindoParsed.currency}')`);
assert(pindoParsed.period.includes('30 Juni 2026'), `Period for Pindo Deli is 30 Juni 2026 (got '${pindoParsed.period}')`);
assert(pindoParsed.financials.salesCY === 1084245, 'Pindo Deli Sales CY is USD 1.084.245k');
assert(pindoParsed.financials.netProfitCY === 455637, 'Pindo Deli Net Profit CY is USD 455.637k');
assert(pindoParsed.financials.totalAssetsCY === 9564776, 'Pindo Deli Total Assets CY is USD 9.564.776k');
assert(pindoParsed.financials.footingDelta === 0, 'Pindo Deli Footing Delta is 0.00 (ISA 520 check passed)');
assert(Array.isArray(pindoParsed.thoughtTrace) && pindoParsed.thoughtTrace.length >= 7, `Thought trace contains ${pindoParsed.thoughtTrace?.length} step-by-step thinking logic stages`);

// 2. Parsing "Laporan_Keuangan_PT_A.xlsx" strictly maps to PT A
const ptAParsed = documentParser.parseDocumentNode({ fileName: 'Laporan_Keuangan_PT_A.xlsx' });
assert(ptAParsed.success, 'Parser successfully processes PT A file');
assert(ptAParsed.entityName === 'PT A', `File 'Laporan_Keuangan_PT_A.xlsx' maps strictly to 'PT A' (got '${ptAParsed.entityName}')`);
assert(ptAParsed.targetView === 'pengendali', `Target view for PT A is 'pengendali' (got '${ptAParsed.targetView}')`);

// 3. UI and Architecture Bindings in HTML
const latestHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf-8');
assert(!latestHtml.includes('Yayasan'), 'public/index.html contains 0 occurrences of "Yayasan" (Strict Kajian Ihsan standardization)');
assert(latestHtml.includes('updateDynamicEntityBindings'), 'updateDynamicEntityBindings() function defined in HTML');
assert(latestHtml.includes('parseDocumentClientSide'), 'parseDocumentClientSide() fallback defined in HTML');
assert(latestHtml.includes('id="p_verified_params_card"'), 'Verified parameters card #p_verified_params_card exists');
assert(latestHtml.includes('id="p_thought_trace_box"'), 'AI Thought trace accordion #p_thought_trace_box exists');
assert(latestHtml.includes('class="dyn-p-entity"'), 'Dynamic span .dyn-p-entity exists');
assert(latestHtml.includes('class="dyn-np-entity"'), 'Dynamic span .dyn-np-entity exists');
assert(latestHtml.includes('class="dyn-inv-entity"'), 'Dynamic span .dyn-inv-entity exists');
assert(latestHtml.includes('id="in_p_entityName"'), 'Input #in_p_entityName exists');
assert(latestHtml.includes('id="in_np_entityName"'), 'Input #in_np_entityName exists');
assert(latestHtml.includes('id="in_pindo_entityName"'), 'Input #in_pindo_entityName exists');

// ----------------------------------------------------
// TEST 9: Direct Drag-and-Drop Entry Point (Zero Sample / Template Clutter)
// ----------------------------------------------------
console.log('\n--- TEST 9: Direct Drag-and-Drop Entry Point ---');
assert(latestHtml.includes('id="blankStateHero"'), 'Hero entry box #blankStateHero exists');
assert(latestHtml.includes('handleDirectFileDrop'), 'handleDirectFileDrop() function defined');
assert(latestHtml.includes('handleDirectFileUpload'), 'handleDirectFileUpload() function defined');
assert(latestHtml.includes('ondrop="event.preventDefault(); this.classList.remove(\'dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"'), 'Hero #blankStateHero has native ondrop handler');
assert(latestHtml.includes('.empty-state-box.dragover'), 'CSS .empty-state-box.dragover styling is present');

// Verify hero does not contain the old sample button or template download link
const blankStateHeroSection = latestHtml.substring(
  latestHtml.indexOf('id="blankStateHero"'),
  latestHtml.indexOf('<!-- ACTIVE BENCHMARK STATUS BANNER')
);
assert(!blankStateHeroSection.includes('txt_btn_load_prd'), 'Hero #blankStateHero does NOT contain 1-klik sample button');
assert(!blankStateHeroSection.includes('txt_btn_download_template'), 'Hero #blankStateHero does NOT contain Excel template download button');
assert(!blankStateHeroSection.includes('/api/template-excel'), 'Hero #blankStateHero does NOT contain /api/template-excel link');

// ----------------------------------------------------
// TEST 10: Document Entity Identification & Validation Logic (Full Scan & Step A-E)
// ----------------------------------------------------
console.log('\n--- TEST 10: Document Entity Identification & Validation Logic ---');

// 1. Verify scanAndValidateEntities function export
assert(typeof documentParser.scanAndValidateEntities === 'function', 'documentParser.scanAndValidateEntities is an exported function');

// 2. Synthetic document text test (Zero Template Bias, Strict Document Truth)
const syntheticDocText = `
LAPORAN POSISI KEUANGAN KONSOLIDASIAN
PT ABC INDONESIA DAN ENTITAS ANAK
Per 31 Desember 2025
(Dinyatakan dalam Jutaan Rupiah)

Piutang Usaha kepada CV MAJU JAYA tercatat Rp 150.000.000
Fasilitas Kredit Modal Kerja dari PT Bank Central Asia Tbk Rp 500.000.000
Direksi PT ABC INDONESIA menandatangani laporan manajemen.
`;

const syntheticResult = documentParser.parseDocumentNode({
  fileName: 'Laporan_Keuangan_Tahunan.xlsx',
  textContent: syntheticDocText
});

assert(syntheticResult.success, 'Parser successfully processes multi-entity document text');
assert(syntheticResult.entityName.includes('PT ABC INDONESIA'), `Primary entity is 'PT ABC INDONESIA' (got '${syntheticResult.entityName}')`);
assert(!syntheticResult.entityName.includes('PT Teridentifikasi'), 'Entity name does NOT rely on placeholder template "PT Teridentifikasi"');
assert(Array.isArray(syntheticResult.allDetectedEntities), 'allDetectedEntities is returned as an array');
assert(syntheticResult.allDetectedEntities.length >= 3, `Full-document scan detected ${syntheticResult.allDetectedEntities.length} entities (expected >= 3)`);

// Verify CV MAJU JAYA and PT Bank Central Asia Tbk are captured
const cvEntity = syntheticResult.allDetectedEntities.find(e => e.name.includes('CV MAJU JAYA'));
assert(cvEntity !== undefined, 'CV MAJU JAYA is detected in full-document scan');
assert(cvEntity && cvEntity.prefix === 'CV', 'CV MAJU JAYA has prefix "CV"');
assert(cvEntity && cvEntity.role.includes('Mitra Dagang'), `CV MAJU JAYA role is Trade Counterparty (got '${cvEntity?.role}')`);

const bankEntity = syntheticResult.allDetectedEntities.find(e => e.name.includes('Bank Central Asia'));
assert(bankEntity !== undefined, 'PT Bank Central Asia Tbk is detected in full-document scan');
assert(bankEntity && bankEntity.role.includes('Kreditur'), `Bank entity role is Creditor/Bank (got '${bankEntity?.role}')`);

// Verify 5-Step Thinking Logic properties (Step A to E) on primary entity
const primaryE = syntheticResult.primaryEntity;
assert(primaryE !== null && primaryE !== undefined, 'primaryEntity object is returned');
assert(typeof primaryE.stepA === 'string' && primaryE.stepA.includes('prefiks'), 'Step A (Detect) is present with prefix analysis');
assert(typeof primaryE.stepB === 'string' && primaryE.stepB.includes('badan hukum'), 'Step B (Validate) is present with legal entity validation');
assert(typeof primaryE.stepC === 'string' && primaryE.stepC.includes('Pemeriksaan silang'), 'Step C (Cross-check) is present with document-wide cross-check');
assert(typeof primaryE.stepD === 'string' && primaryE.stepD.includes('Diresolusi'), 'Step D (Resolve) is present with resolution evidence');
assert(typeof primaryE.stepE === 'string' && (primaryE.confidence === 'HIGH' || primaryE.confidence === 'MEDIUM'), `Step E (Confidence) assigned valid confidence score: '${primaryE.confidence}'`);

// 3. Real PDF Verification with full-scan output
const realPindoResult = documentParser.parseDocumentNode({
  fileName: 'expected output for the investment analysis.pdf',
  textContent: 'PT Pindo Deli Pulp and Paper Mills dan Entitas Anak\nPosisi Keuangan 30 Juni 2026\nLaba Usaha PT Pindo Deli Pulp and Paper Mills'
});
assert(realPindoResult.entityName.includes('Pindo Deli'), 'Real investment doc parses as PT Pindo Deli');
assert(realPindoResult.allDetectedEntities.length >= 1, 'Pindo Deli document has verified detected entities');

// 4. UI Bindings and Audit Panels in HTML
assert(latestHtml.includes('id="mainEntityAuditContainer"'), 'Main hero entity audit container #mainEntityAuditContainer exists in HTML');
assert(latestHtml.includes('id="p_entity_audit_box"'), 'Pengendali entity audit container #p_entity_audit_box exists in HTML');
assert(latestHtml.includes('id="np_entity_audit_box"'), 'Non-pengendali entity audit container #np_entity_audit_box exists in HTML');
assert(latestHtml.includes('id="pindo_entity_audit_box"'), 'Investasi entity audit container #pindo_entity_audit_box exists in HTML');
assert(latestHtml.includes('renderEntityAuditPanels'), 'renderEntityAuditPanels() function defined in HTML');
assert(latestHtml.includes('scanAndValidateEntitiesClient'), 'scanAndValidateEntitiesClient() defined in HTML');

console.log('\n====================================================');
console.log(`🏁 SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}

