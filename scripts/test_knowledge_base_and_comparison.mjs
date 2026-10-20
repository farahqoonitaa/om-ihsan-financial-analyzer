import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import ragPkg from "../src/engine/ragEngine.js";
const ragEngine = ragPkg.ragEngine || ragPkg;

console.log("==================================================================");
console.log("🧪 TESTING KNOWLEDGE BASE, CATEGORIZATION & SIDE-BY-SIDE COMPARISON");
console.log("==================================================================");

let passed = 0;
let failed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${desc}`);
    console.error(`   ${err.message}`);
    failed++;
  }
}

// 1. Structured Knowledge Repository
it("Repository initializes with minimum 13 multi-year records across 4 categories", () => {
  const records = ragEngine.knowledgeRecords;
  assert.ok(records && records.length >= 13, `Expected >= 13 records, got ${records ? records.length : 0}`);
  
  const categories = new Set(records.map(r => r.category));
  assert.ok(categories.has("Investasi"), "Missing Investasi category");
  assert.ok(categories.has("Pengendali"), "Missing Pengendali category");
  assert.ok(categories.has("Non-Pengendali"), "Missing Non-Pengendali category");
  assert.ok(categories.has("Konsolidasi Grup"), "Missing Konsolidasi Grup category");
});

// 2. Intelligent Categorization
it("Content-based categorization correctly identifies Investasi from bond covenant terms", () => {
  const classified = ragEngine.classifyKnowledgeItem({
    title: "Draft Analisis Emisi Obligasi dan Headroom",
    content: "Kajian atas rasio DSCR, Net Debt to EBITDA, dan kepatuhan covenant obligasi berdenominasi USD.",
    extractedData: { netDebtToEbitda: 2.1, dscr: 2.8 }
  });
  assert.strictEqual(classified.primaryCategory, "Investasi");
});

it("Content-based categorization correctly identifies Pengendali from S7 and Opex terms", () => {
  const classified = ragEngine.classifyKnowledgeItem({
    title: "Kajian Efisiensi Operasional dan Sinyal Pertumbuhan Biaya",
    content: "Terdeteksi pola S7 growth gap dimana beban usaha meningkat melebihi pertumbuhan omset penjualan.",
    extractedData: { s7GrowthGap: 2.5 }
  });
  assert.strictEqual(classified.primaryCategory, "Pengendali");
});

it("Content-based categorization correctly identifies Non-Pengendali from RTC and minority dividend", () => {
  const classified = ragEngine.classifyKnowledgeItem({
    title: "Laporan Arus Kas dan Distribusi Dividen Entitas Anak",
    content: "Pemeriksaan rasio RTC piutang pihak berelasi dan kepastian penerimaan dividen kepemilikan minoritas.",
    extractedData: { rtcRatio: 301.2 }
  });
  assert.strictEqual(classified.primaryCategory, "Non-Pengendali");
});

// 3. Traceable Ingestion & Zero Silent Exclusion
it("Ingestion validates required fields and preserves 0 as numeric zero (not missing)", () => {
  const ingested = ragEngine.ingestKnowledgeBaseItem({
    title: "PT Test Entity FY 2024",
    entityName: "PT Test Entity",
    reportingYear: 2024,
    reportingPeriod: "31 Des 2024",
    originalDocument: {
      fileName: "Test_Doc_2024.pdf",
      fileType: "PDF",
      fileSizeBytes: 102400,
      checksum: "sha256-test-123"
    },
    extractedData: {
      totalAssets: 5000000,
      shortTermDebt: 0, // Explicit zero
      longTermDebt: null // Explicit missing
    }
  });

  assert.ok(ingested.success, "Ingestion should succeed");
  assert.strictEqual(ingested.record.extractedData.shortTermDebt, 0, "Zero must remain numeric 0");
  assert.strictEqual(ingested.record.extractedData.longTermDebt, null, "Missing field must remain null");
  assert.strictEqual(ingested.record.originalDocument.checksum, "sha256-test-123", "Checksum must be preserved");
});

it("Ingestion rejects invalid items and records reason in failedIngestions without silent loss", () => {
  const initialFailedCount = ragEngine.failedIngestions.length;
  const result = ragEngine.ingestKnowledgeBaseItem({
    // Missing entityName, reportingYear, and originalDocument
    title: "Corrupted File Ingestion Attempt"
  });

  assert.strictEqual(result.success, false, "Should fail validation");
  assert.strictEqual(result.status, "FAILED_INGESTION", "Status should be FAILED_INGESTION");
  assert.ok(result.reason.length > 0, "Failure reason must be specified");
  assert.strictEqual(ragEngine.failedIngestions.length, initialFailedCount + 1, "Failed item must be tracked");
  
  const lastFailed = ragEngine.failedIngestions[ragEngine.failedIngestions.length - 1];
  assert.ok(lastFailed.reason.includes("entityName"), "Reason must specify missing entityName");
});

// 4. Catalog Filtering
it("Catalog returns items grouped by Category and filtered by year", () => {
  const catalog2023 = ragEngine.getKnowledgeBaseCatalog({ reportingYear: 2023 });
  assert.ok(catalog2023.items.length >= 2, "Should have 2023 records");
  catalog2023.items.forEach(item => {
    assert.strictEqual(item.reportingYear, 2023, "All returned items must be year 2023");
  });

  const invCatalog = ragEngine.getKnowledgeBaseCatalog({ category: "Investasi" });
  assert.ok(invCatalog.items.length >= 4, "Should have multiple Investasi records");
  invCatalog.items.forEach(item => {
    assert.strictEqual(item.category, "Investasi");
  });
});

// 5. Cross-Year Side-by-Side Comparison
it("Cross-year comparison calculates absolute & percentage delta and detects forensic gap", () => {
  const comparison = ragEngine.compareKnowledgeBaseItems(["KB-INV-PINDO-2023", "KB-INV-PINDO-2024"]);
  
  assert.strictEqual(comparison.success, true);
  assert.strictEqual(comparison.comparisonMode, "CROSS_YEAR_COMPARISON");
  assert.strictEqual(comparison.unitsCompatible, true);
  assert.strictEqual(comparison.alignedRows.length, 27, "Must contain all 27 aligned canonical financial rows");

  // Check Total Assets row
  const assetRow = comparison.alignedRows.find(r => r.key === "totalAssets");
  assert.ok(assetRow, "Total Assets row must exist");
  assert.strictEqual(assetRow.cells[0].raw, 8650420);
  assert.strictEqual(assetRow.cells[1].raw, 9075523);
  assert.strictEqual(assetRow.deltaAbsolute, 425103);
  assert.strictEqual(assetRow.deltaPercent, 4.91);
  assert.ok(assetRow.cells[0].sourceRef.includes("LK_Auditan_PT_Pindo_Deli_FY2023.pdf"), "Must have source citation for 2023");
  assert.ok(assetRow.cells[1].sourceRef.includes("LK_Auditan_PT_Pindo_Deli_FY2024.pdf"), "Must have source citation for 2024");

  // Check Forensic Inconsistencies detection
  assert.ok(comparison.inconsistencies.length > 0, "Should detect at least 1 cross-year inconsistency");
  const s7 = comparison.inconsistencies.find(i => i.code === "S7_GROWTH_GAP_ACROSS_YEARS");
  assert.ok(s7, "Should detect S7 Growth Gap across years");
});

it("Cross-year comparison distinguishes numeric zero from missing data", () => {
  const comparison = ragEngine.compareKnowledgeBaseItems(["KB-INV-PINDO-2023", "KB-INV-PINDO-2024"]);
  
  // Find a ratio or indicator row
  const derRow = comparison.alignedRows.find(r => r.key === "der");
  assert.ok(derRow, "DER ratio row exists");
  assert.strictEqual(derRow.cells[0].isMissing, false);
  assert.strictEqual(derRow.cells[0].isZero, false);
});

// 6. UI Structure Verification
it("HTML contains Knowledge Base & Side-by-Side comparison UI elements", () => {
  const html = fs.readFileSync(path.join(process.cwd(), "public/index.html"), "utf8");
  
  assert.ok(html.includes('id="kbMainHubSection"'), "Knowledge Base Hub section must exist");
  assert.ok(html.includes('id="kbSideBySideBox"'), "Side-by-Side comparison box must exist");
  assert.ok(html.includes('id="kbGroupedCatalogBox"'), "Grouped Catalog box must exist");
  assert.ok(html.includes('id="kbFailedIngestionsBox"'), "Failed Ingestions tracker box must exist");
  assert.ok(html.includes('id="kbSelectionActionBar"'), "Selection Action Bar must exist");
  assert.ok(html.includes('triggerKbQuickCompare'), "Quick Compare function must exist in HTML");
  assert.ok(html.includes('compareKnowledgeBaseItems'), "Client comparison caller must exist");
  assert.ok(html.includes('PT Pindo Deli: FY 2023 vs FY 2024'), "Preset 1 must exist");
  assert.ok(html.includes('PT EPS: 2024 vs 2025 vs 2026'), "Preset 4 must exist");
});

console.log("==================================================================");
console.log(`🏁 FINISHED: ${passed} Passed, ${failed} Failed`);
console.log("==================================================================");

if (failed > 0) {
  process.exit(1);
}
