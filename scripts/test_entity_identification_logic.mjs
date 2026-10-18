#!/usr/bin/env node
/**
 * ============================================================================
 * TEST SUITE: Document Entity Identification & Validation Logic
 * ============================================================================
 * Verifies all 6 mandatory rules from the user specification:
 *  1. Identify every company/entity explicitly stated in the document (PT, CV, PT., CV., etc.)
 *  2. Do NOT trust the template (PT TERIDENTIFIKASI vs PT ABC INDONESIA)
 *  3. Entity-by-Entity Thinking Logic (Steps A, B, C, D, E)
 *  4. Critical Rule: Check ALL PT/CV Entities across the entire document
 *  5. Conflict Detection (e.g., Header: PT ABC INDONESIA vs Invoice issuer: PT XYZ NUSANTARA)
 *  6. Evidence-Based Output Format & NOT IDENTIFIED fallback
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const {
  parseDocumentNode,
  scanAndValidateEntities,
  formatEvidenceBasedReport
} = require(path.join(ROOT_DIR, 'src/engine/documentParser.js'));

const {
  COPILOT_SYSTEM_PROMPT
} = require(path.join(ROOT_DIR, 'src/engine/copilotSystemPrompt.js'));

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('🧪 RUNNING VERIFICATION: DOCUMENT ENTITY IDENTIFICATION & VALIDATION LOGIC');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// SECTION 1: Identify Every Company/Entity Explicitly Stated in Document
// ----------------------------------------------------------------------------
console.log('--- SECTION 1: Rule 1 — Identify Every Company/Entity & Exact Spelling ---');

const rule1Text = `
Dokumen Evaluasi:
1. PT TERIDENTIFIKASI tercantum pada kolom contoh.
2. PT ABC INDONESIA menerbitkan laporan posisi keuangan.
3. CV MAJU JAYA merupakan pelanggan aktif.
4. PT. Sinar Mas Agro dan CV. Berkah Mandiri tercatat sebagai mitra.
`;

const rule1Scan = scanAndValidateEntities(rule1Text, null, 'dokumen_uji.pdf');
const mapByFull = Object.fromEntries(rule1Scan.entities.map(e => [e.fullEntity, e]));

assert(Boolean(mapByFull['PT TERIDENTIFIKASI']), 'Detected PT TERIDENTIFIKASI');
assert(mapByFull['PT TERIDENTIFIKASI']?.companyPrefix === 'PT', 'PT TERIDENTIFIKASI -> Company Prefix = PT');
assert(mapByFull['PT TERIDENTIFIKASI']?.companyName === 'TERIDENTIFIKASI', 'PT TERIDENTIFIKASI -> Company Name = TERIDENTIFIKASI');

assert(Boolean(mapByFull['PT ABC INDONESIA']), 'Detected PT ABC INDONESIA');
assert(mapByFull['PT ABC INDONESIA']?.companyPrefix === 'PT', 'PT ABC INDONESIA -> Company Prefix = PT');
assert(mapByFull['PT ABC INDONESIA']?.companyName === 'ABC INDONESIA', 'PT ABC INDONESIA -> Company Name = ABC INDONESIA');

assert(Boolean(mapByFull['CV MAJU JAYA']), 'Detected CV MAJU JAYA');
assert(mapByFull['CV MAJU JAYA']?.companyPrefix === 'CV', 'CV MAJU JAYA -> Company Prefix = CV');
assert(mapByFull['CV MAJU JAYA']?.companyName === 'MAJU JAYA', 'CV MAJU JAYA -> Company Name = MAJU JAYA');

assert(Boolean(mapByFull['PT Sinar Mas Agro']), 'Detected PT. Sinar Mas Agro preserving exact case');
assert(mapByFull['PT Sinar Mas Agro']?.companyName === 'Sinar Mas Agro', 'PT. Sinar Mas Agro -> Company Name = Sinar Mas Agro');

assert(Boolean(mapByFull['CV Berkah Mandiri']), 'Detected CV. Berkah Mandiri preserving exact case');
assert(mapByFull['CV Berkah Mandiri']?.companyName === 'Berkah Mandiri', 'CV. Berkah Mandiri -> Company Name = Berkah Mandiri');

// ----------------------------------------------------------------------------
// SECTION 2: Rule 2 — Do NOT Trust the Template
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 2: Rule 2 — Do NOT Trust the Template (PT TERIDENTIFIKASI vs PT ABC INDONESIA) ---');

const templateVsActualText = `
Template Field: PT TERIDENTIFIKASI
Kolom Predefined Template: PT Teridentifikasi
Laporan Posisi Keuangan PT ABC INDONESIA per 31 Agustus 2026
Direksi PT ABC INDONESIA menyatakan laporan keuangan ini telah disusun sesuai standar akuntansi.
`;

const rule2Result = parseDocumentNode({
  fileName: 'Template_PT_TERIDENTIFIKASI.xlsx',
  textContent: templateVsActualText
});

assert(
  rule2Result.entityName === 'PT ABC INDONESIA',
  `When template says PT TERIDENTIFIKASI but document contains PT ABC INDONESIA, extracted entity MUST be 'PT ABC INDONESIA' (got '${rule2Result.entityName}')`
);
assert(
  rule2Result.primaryEntity?.companyName === 'ABC INDONESIA',
  `Primary entity companyName is 'ABC INDONESIA' (got '${rule2Result.primaryEntity?.companyName}')`
);
const tplEnt = rule2Result.allDetectedEntities.find(e => e.companyName.toUpperCase() === 'TERIDENTIFIKASI');
assert(
  Boolean(tplEnt && tplEnt.isTemplatePlaceholder && !tplEnt.isPrimary),
  'PT TERIDENTIFIKASI is explicitly flagged as a template placeholder and rejected as primary subject'
);

// ----------------------------------------------------------------------------
// SECTION 3: Rule 3 — Entity-by-Entity Thinking Logic (Steps A, B, C, D, E)
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 3: Rule 3 — Entity-by-Entity 5-Step Thinking Logic (Steps A–E) ---');

for (const ent of rule2Result.allDetectedEntities) {
  assert(Boolean(ent.stepA && ent.stepA.includes('prefiks')), `Entity '${ent.fullEntity}' has Step A (Detect)`);
  assert(Boolean(ent.stepB && ent.stepB.length > 15), `Entity '${ent.fullEntity}' has Step B (Validate)`);
  assert(Boolean(ent.stepC && ent.stepC.includes('Pemeriksaan silang')), `Entity '${ent.fullEntity}' has Step C (Cross-check)`);
  assert(Boolean(ent.stepD && ent.stepD.length > 15), `Entity '${ent.fullEntity}' has Step D (Resolve)`);
  assert(['HIGH', 'MEDIUM', 'LOW'].includes(ent.confidence), `Entity '${ent.fullEntity}' has valid Step E Confidence (${ent.confidence})`);
  assert(Boolean(ent.stepE && ent.stepE.includes(ent.confidence)), `Entity '${ent.fullEntity}' Step E explains confidence level`);
}

// ----------------------------------------------------------------------------
// SECTION 4: Rule 4 — Check ALL PT/CV Entities Across Full Document
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 4: Rule 4 — Full-Document Scan & Multi-Entity Role Separation ---');

const multiEntityDoc = `
Laporan Keuangan Konsolidasian PT ABC INDONESIA periode berjalan
1. Tagihan piutang pelanggan kepada CV MAJU JAYA sebesar Rp 12,5 Miliar.
2. Pembelian bahan baku dari vendor pemasok PT XYZ NUSANTARA sebesar Rp 8,2 Miliar dan fasilitas kreditur PT Bank Mandiri.
3. Direksi PT ABC INDONESIA menandatangani laporan posisi keuangan ini pada halaman terakhir.
`;

const multiRes = parseDocumentNode({
  fileName: 'Multi_Entity_Scan.pdf',
  textContent: multiEntityDoc
});

const detectedNames = multiRes.allDetectedEntities.map(e => e.fullEntity);
assert(detectedNames.includes('PT ABC INDONESIA'), 'Full scan detected PT ABC INDONESIA');
assert(detectedNames.includes('CV MAJU JAYA'), 'Full scan detected CV MAJU JAYA');
assert(detectedNames.includes('PT XYZ NUSANTARA'), 'Full scan detected PT XYZ NUSANTARA');
assert(detectedNames.includes('PT Bank Mandiri'), 'Full scan detected PT Bank Mandiri (same line as PT XYZ NUSANTARA)');
assert(multiRes.entityName === 'PT ABC INDONESIA', `Primary entity resolved as 'PT ABC INDONESIA' (got '${multiRes.entityName}')`);

const cvEnt = multiRes.allDetectedEntities.find(e => e.fullEntity === 'CV MAJU JAYA');
const xyzEnt = multiRes.allDetectedEntities.find(e => e.fullEntity === 'PT XYZ NUSANTARA');
assert(cvEnt && !cvEnt.isPrimary && cvEnt.role.includes('Mitra Dagang'), `CV MAJU JAYA distinguished as Trade Counterparty (${cvEnt?.role})`);
assert(xyzEnt && !xyzEnt.isPrimary && xyzEnt.role.includes('Vendor'), `PT XYZ NUSANTARA distinguished as Vendor/Supplier (${xyzEnt?.role})`);

// ----------------------------------------------------------------------------
// SECTION 5: Rule 5 — Conflict Detection (Header vs Invoice Issuer)
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 5: Rule 5 — Conflict Detection Across Document Sections ---');

const conflictDoc = `
Header: PT ABC INDONESIA
Invoice issuer: PT XYZ NUSANTARA
Tagihan diterbitkan oleh PT XYZ NUSANTARA untuk pembayaran jasa konstruksi.
`;

const conflictRes = parseDocumentNode({
  fileName: 'Invoice_Dispute.pdf',
  textContent: conflictDoc
});

assert(conflictRes.hasEntityConflict === true, 'Conflict flag is true when Header and Invoice Issuer differ');
assert(conflictRes.entityConflicts.length >= 1, `Detected ${conflictRes.entityConflicts.length} conflict record(s)`);
assert(
  conflictRes.entityName === 'PT XYZ NUSANTARA',
  `Does NOT blindly pick Header entity; resolves explicit Invoice Issuer 'PT XYZ NUSANTARA' (got '${conflictRes.entityName}')`
);
assert(
  conflictRes.entityConflictReport.includes('Entity 1: PT ABC INDONESIA') &&
  conflictRes.entityConflictReport.includes('Entity 2: PT XYZ NUSANTARA') &&
  conflictRes.entityConflictReport.includes('Conflict:'),
  'Conflict report matches exact required format (Entity 1 / Role / Entity 2 / Role / Conflict)'
);

// ----------------------------------------------------------------------------
// SECTION 6: Rule 6 — Evidence-Based Output & NOT IDENTIFIED Fallback
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 6: Rule 6 — Evidence-Based Output Format & NOT IDENTIFIED Fallback ---');

const reportStr = multiRes.evidenceBasedEntityReport;
assert(reportStr.includes('Company Prefix: PT'), 'Evidence report includes "Company Prefix: PT"');
assert(reportStr.includes('Company Name: ABC INDONESIA'), 'Evidence report includes "Company Name: ABC INDONESIA"');
assert(reportStr.includes('Full Entity: PT ABC INDONESIA'), 'Evidence report includes "Full Entity: PT ABC INDONESIA"');
assert(reportStr.includes('Role:'), 'Evidence report includes "Role:"');
assert(reportStr.includes('Evidence:'), 'Evidence report includes "Evidence:"');
assert(reportStr.includes('Confidence: HIGH'), 'Evidence report includes "Confidence: HIGH"');

const noEntityRes = parseDocumentNode({
  fileName: 'PT_FAKE_FILENAME_SHOULD_NOT_BE_USED.pdf',
  textContent: 'Dokumen memo internal tanpa penyebutan badan hukum sama sekali pada isi teks dokumen.'
});

assert(
  noEntityRes.companyEntity === 'NOT IDENTIFIED' && noEntityRes.entityName === 'NOT IDENTIFIED',
  `When document text has no PT/CV entity, returns 'NOT IDENTIFIED' even if filename has a PT name (got '${noEntityRes.entityName}')`
);
assert(
  noEntityRes.evidenceBasedEntityReport.includes('Company Entity: NOT IDENTIFIED') &&
  noEntityRes.evidenceBasedEntityReport.includes('Reason: No sufficiently reliable PT/CV/legal-entity occurrence was found in the document.'),
  'Unidentified entity report matches exact required format (Company Entity: NOT IDENTIFIED / Reason: ...)'
);

// ----------------------------------------------------------------------------
// SECTION 7: Sync Across Copilot System Prompt & Frontend HTML
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 7: Synchronization Across System Prompt & Frontend UI ---');

assert(
  COPILOT_SYSTEM_PROMPT.includes('DOCUMENT ENTITY IDENTIFICATION & VALIDATION LOGIC') &&
  COPILOT_SYSTEM_PROMPT.includes('Never infer the company from the template. Detect → validate → cross-check → resolve.'),
  'COPILOT_SYSTEM_PROMPT includes Section 9 Document Entity Identification & Validation Logic'
);

const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'public/index.html'), 'utf8');
const previewHtml = fs.readFileSync(path.join(ROOT_DIR, 'preview.html'), 'utf8');

assert(indexHtml.includes('detectDocumentSectionClient'), 'public/index.html has detectDocumentSectionClient()');
assert(indexHtml.includes('determineEntityRoleFromContextClient'), 'public/index.html has determineEntityRoleFromContextClient()');
assert(indexHtml.includes('formatEvidenceBasedReportClient'), 'public/index.html has formatEvidenceBasedReportClient()');
assert(indexHtml.includes('Never infer the company from the template. Detect → validate → cross-check → resolve.'), 'public/index.html embeds core principle');
assert(previewHtml.includes('formatEvidenceBasedReportClient'), 'preview.html is synchronized with public/index.html');

console.log('\n================================================================');
console.log(`🏁 SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
}
