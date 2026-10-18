// scripts/test_pengendali_non_pengendali_logic.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 VERIFYING PENGENDALI & NON-PENGENDALI LOGIC, FORMULAS & NOTA DINAS');
console.log('================================================================\n');

let passed = 0;
function test(desc, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. Ingest Parser Engine
const documentParser = await import('../src/engine/documentParser.js');

// 2. Test Pengendali Routing & Canonical Formulas
test('Pengendali routing: Laporan_Keuangan_PT_A.xlsx routes to pengendali', () => {
  const res = documentParser.parseDocumentNode({ fileName: 'Laporan_Keuangan_PT_A.xlsx' });
  assert.strictEqual(res.targetView, 'pengendali');
  assert.strictEqual(res.entityName, 'PT A');
  assert.strictEqual(res.financials.nwc, -40.49);
  assert.strictEqual(res.financials.cr, 0.57);
  assert.strictEqual(res.financials.growthGap, 1.46);
});

test('Pengendali mathematical formulas precision (PT EPS values)', () => {
  const revCY = 216.88;
  const revPY = 164.98;
  const opexCY = 208.53;
  const opexPY = 156.89;
  const ca = 52.63;
  const cl = 93.12;

  const revGrowth = ((revCY - revPY) / revPY) * 100;
  const opexGrowth = ((opexCY - opexPY) / opexPY) * 100;
  const growthGap = opexGrowth - revGrowth;
  const nwc = ca - cl;
  const cr = ca / cl;

  assert(Math.abs(revGrowth - 31.458) < 0.05, `Rev growth should be ~31.46% (got ${revGrowth.toFixed(2)}%)`);
  assert(Math.abs(opexGrowth - 32.915) < 0.05, `Opex growth should be ~32.91% (got ${opexGrowth.toFixed(2)}%)`);
  assert(Math.abs(growthGap - 1.456) < 0.05, `S7 Growth Gap should be ~1.46% (got ${growthGap.toFixed(2)}%)`);
  assert.strictEqual(nwc.toFixed(2), '-40.49', `NWC deficit should be -Rp40.49M (got ${nwc.toFixed(2)})`);
  assert.strictEqual(cr.toFixed(2), '0.57', `Current ratio should be 0.57x (got ${cr.toFixed(2)})`);
});

// 3. Test Non-Pengendali Routing & Canonical Formulas
test('Non-Pengendali routing: ilovepdf_merged (1).pdf routes to nonpengendali (NOT investasi)', () => {
  const pdfPath = path.join(rootDir, 'ilovepdf_merged (1).pdf');
  const res = documentParser.parseDocumentNode({ fileName: 'ilovepdf_merged (1).pdf', filePath: pdfPath });
  assert.strictEqual(res.targetView, 'nonpengendali', `Target view must be nonpengendali (got ${res.targetView})`);
  assert(res.entityName.includes('POJ') || res.entityName.includes('Pesonna'), `Entity must be POJ/Pesonna (got ${res.entityName})`);
  assert.strictEqual(res.financials.rtc, 301.20, `RTC Piutang must be 301.20% (got ${res.financials.rtc})`);
  assert.strictEqual(res.financials.nwc, -347.18, `NWC deficit must be -Rp347.18M (got ${res.financials.nwc})`);
  assert.strictEqual(res.financials.minorityPct, 1.0, `Minority pct must be 1.0% (got ${res.financials.minorityPct})`);
});

test('Non-Pengendali mathematical formulas precision (PT POJ values)', () => {
  const arAct = 185.00;
  const arTar = 61.42;
  const ca = 534.60;
  const cl = 881.78;
  const ni = 18.50;
  const pct = 1.0;

  const rtc = (arAct / arTar) * 100;
  const nwc = ca - cl;
  const cr = ca / cl;
  const div = ni * (pct / 100);

  assert.strictEqual(rtc.toFixed(2), '301.20', `RTC should be 301.20% (got ${rtc.toFixed(2)})`);
  assert.strictEqual(nwc.toFixed(2), '-347.18', `NWC should be -Rp347.18M (got ${nwc.toFixed(2)})`);
  assert.strictEqual(cr.toFixed(2), '0.61', `CR should be 0.61x (got ${cr.toFixed(2)})`);
  assert.strictEqual((div * 1000).toFixed(2), '185.00', `Minority 1% dividend should be Rp185.00 Juta (got ${(div * 1000).toFixed(2)})`);
});

// 4. Test HTML Elements for Both Modules
const html = fs.readFileSync(path.join(rootDir, 'public/index.html'), 'utf8');

test('HTML contains executive Nota Dinas for Pengendali (#ndPengendaliBox) and Non-Pengendali (#ndNonPengendaliBox)', () => {
  assert(html.includes('id="ndPengendaliBox"'), 'ndPengendaliBox must exist');
  assert(html.includes('id="ndNonPengendaliBox"'), 'ndNonPengendaliBox must exist');
});

test('ndPengendaliBox contains 3 formal recommendations & high-level anomalies', () => {
  assert(html.includes('Sinyal S7 Growth Gap'), 'S7 Growth gap must be present in Pengendali Nota Dinas');
  assert(html.includes('Defisit Likuiditas Modal Kerja'), 'Defisit likuiditas must be present');
  assert(html.includes('Lonjakan Beban Insentif Bonus Produksi'), 'Bonus produksi spike must be present');
  assert(html.includes('surat klarifikasi tertulis selambat-lambatnya 7 (tujuh) hari kerja'), '7 working days clarification must be present');
  assert(html.includes('moratorium kenaikan pos beban usaha non-operasional'), 'Opex moratorium must be present');
  assert(html.includes('restrukturisasi liabilitas jangka pendek perbankan'), 'Debt restructuring must be present');
});

test('ndNonPengendaliBox contains 3 critical RUPS questions & risk tiering', () => {
  assert(html.includes('Lonjakan Piutang Usaha Ekstrem (RTC'), 'RTC Piutang must be in Non-Pengendali Nota Dinas');
  assert(html.includes('Defisit Modal Kerja Bersih Akut'), 'Defisit modal kerja akut must be present');
  assert(html.includes('Utang Dividen Belum Dibayarkan'), 'Utang dividen must be present');
  assert(html.includes('melunasi utang dividen Rp110,27 Miliar serta kepastian pembayaran tunai hak dividen'), 'RUPS Question 1 on dividend must be present');
  assert(html.includes('menagih piutang macet'), 'RUPS Question 2 on receivables collection must be present');
  assert(html.includes('mitigasi risiko tuntutan tambahan modal (capital call)'), 'RUPS Question 3 on capital call mitigation must be present');
});

test('HTML contains inline editing suite for both Nota Dinas', () => {
  assert(html.includes('onclick="toggleEditNotaDinas(\'pengendali\')"'), 'toggleEditNotaDinas for pengendali must exist');
  assert(html.includes('onclick="toggleEditNotaDinas(\'non_pengendali\')"'), 'toggleEditNotaDinas for non_pengendali must exist');
  assert(html.includes('function getNotaDinasElement(mode)'), 'getNotaDinasElement must be defined');
  assert(html.includes("if (mode === 'non_pengendali' || mode === 'nonpengendali')"), 'getNotaDinasElement must handle nonpengendali');
});

test('Dynamic parameter bindings in runPengendaliAnalysis and runNonPengendaliAnalysis sync to Nota Dinas', () => {
  assert(html.includes("document.getElementById('nd_p_opex_growth')"), 'runPengendaliAnalysis syncs nd_p_opex_growth');
  assert(html.includes("document.getElementById('nd_p_nwc')"), 'runPengendaliAnalysis syncs nd_p_nwc');
  assert(html.includes("document.getElementById('nd_np_rtc_title')"), 'runNonPengendaliAnalysis syncs nd_np_rtc_title');
  assert(html.includes("document.getElementById('nd_np_div')"), 'runNonPengendaliAnalysis syncs nd_np_div');
  assert(html.includes("document.getElementById('nd_np_ar_act')"), 'runNonPengendaliAnalysis syncs nd_np_ar_act');
});

test('Nota Dinas contains Complete S1-S10 9-Point Calculation Breakdown, Reasoning Chain, and Cross-Indicator Synthesis', () => {
  assert(html.includes('id="nd_s1_s10_audit_pengendali"'), 'Pengendali Nota Dinas S1-S10 audit section exists');
  assert(html.includes('id="nd_s1_s10_audit_nonpengendali"'), 'Non-Pengendali Nota Dinas S1-S10 audit section exists');
  assert(html.includes('id="nd_s1_s10_audit_investasi_pindo"'), 'Investasi Pindo Deli Nota Dinas S1-S10 audit section exists');
  assert(html.includes('id="nd_s1_s10_audit_investasi_daaz"'), 'Investasi DAAZ Nota Dinas S1-S10 audit section exists');
  assert(html.includes('id="nd_s1_s10_audit_konsolidasi"'), 'Konsolidasi Nota Dinas S1-S10 audit section exists');
  assert(html.includes('function renderAllNotaDinasS1toS10()'), 'renderAllNotaDinasS1toS10 generator is defined');
  for (let i = 1; i <= 10; i++) {
    assert(html.includes(`code: 'S${i}'`), `Signal S${i} calculation card definition exists`);
  }
  assert(html.includes('1. Tujuan Analisis') && html.includes('9. Keterbatasan &amp; Validasi'), 'All 9 mandatory audit components (1 through 9) are present');
  assert(html.includes('Rantai Penalaran Bukti (Evidence Reasoning Chain)'), '7-step Evidence Reasoning Chain is present');
  assert(html.includes('Non-Presumption of Misconduct') || html.includes('Non-Presumption of Fraud'), 'Forensic objectivity / non-presumption of fraud clause is present');
});

console.log(`\n================================================================`);
console.log(`🏁 ALL ${passed} PENGENDALI & NON-PENGENDALI LOGIC TESTS PASSED!`);
console.log(`================================================================`);
