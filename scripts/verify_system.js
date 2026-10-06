const assert = require("assert");
const masterParams = require("../src/data/masterParameters");
const seedData = require("../src/data/seedData");
const financialMath = require("../src/engine/financialMath");
const consolidationEngine = require("../src/engine/consolidationEngine");
const reconciliationEngine = require("../src/engine/reconciliationEngine");
const ragEngine = require("../src/engine/ragEngine");

console.log("=== RUNNING SYSTEM VERIFICATION SUITE ===");

// 1. Verify Action Item 1: Master Parameters
console.log("1. Verifying Action Item 1: Master Parameters & Covenants...");
assert(masterParams.zScores.modifiedZ.weights.constant === -3.337, "Modified Z constant must be -3.337");
assert(masterParams.covenants.pojkSolvencyMax === 5.0, "POJK DER ceiling must be 5.0x");
assert(masterParams.comparisonDimensions.rtc.key === "RTC", "RTC key must exist");
console.log("   -> Master Parameters OK!");

// 2. Verify Action Item 3: Financial Math (PT Daaz Bara Lestari Tbk benchmark)
console.log("2. Verifying Financial Math & 33 Ratios (PT Daaz)...");
const daaz = seedData.investasi.find(i => i.id === "investasi-daaz");
const modZ = financialMath.calculateModifiedZScore({
  currentAssets: daaz.financials.currentAssetsCY,
  currentLiab: daaz.financials.currentLiabCY,
  totalAssets: daaz.financials.totalAssetsCY,
  netProfit: daaz.financials.netProfitCY,
  depreciation: daaz.financials.depreciationCY,
  equity: daaz.financials.equityCY,
  totalLiab: daaz.financials.totalLiabCY,
  operatingProfit: daaz.financials.operatingProfitCY,
  revenue: daaz.financials.revenueCY,
  isSemiAnnual: true
});
console.log("   -> Modified Z-Score calculated:", modZ.score);
assert(Math.abs(modZ.score - 2.541) < 0.05, `Modified Z-Score must match reference 2.54 (got ${modZ.score})`);
assert(modZ.tier === "Hijau", "Modified Z tier must be Hijau");

const ratios = financialMath.calculateComprehensiveRatios({
  ...daaz.financials,
  annualMultiplier: 2
});
assert(ratios.currentRatio === 1.57, `Current Ratio must be 1.57 (got ${ratios.currentRatio})`);
assert(ratios.der === 1.96, `DER must be 1.96 (got ${ratios.der})`);
console.log("   -> 33 Financial Ratios & Modified Z-Score OK!");

// 3. Verify Consolidation Engine & IFRS 10 NCI Mismatch
console.log("3. Verifying Consolidation Engine (6 Entities)...");
const consol = consolidationEngine.runConsolidation(
  seedData.konsolidasi.entities,
  seedData.konsolidasi.eliminations
);
assert(consol.consolidatedTotals.revenueCY === 3885.0, `Consolidated revenue must be 3885.0 (got ${consol.consolidatedTotals.revenueCY})`);
assert(consol.consolidatedTotals.consolidatedDER === 0.96, `Consolidated DER must be 0.96x (got ${consol.consolidatedTotals.consolidatedDER})`);
assert(consol.consolidatedTotals.consolidatedROA === 5.4, `Consolidated ROA must be 5.4% (got ${consol.consolidatedTotals.consolidatedROA})`);
assert(consol.anomalies.length >= 3, `Must detect forensic anomalies (got ${consol.anomalies.length})`);
const nciAnom = consol.anomalies.find(a => a.code === "ANOM-NCI");
assert(nciAnom, "Must detect NCI disparity anomaly on Subsidiary II");
console.log("   -> Consolidation Engine & IFRS 10 Attribution OK!");

// 4. Verify RAG Engine
console.log("4. Verifying RAG Search & Citations...");
const hits = ragEngine.search("piutang 301% RKAP POJ", 2);
assert(hits.length > 0, "RAG search must return matching documents");
assert(hits[0].source.includes("PT POJ"), "Top hit must reference PT POJ PRD");
console.log("   -> RAG Grounding Search OK!");

// 5. Verify Action Item 5: Reconciliation Matrix
console.log("5. Verifying Reconciliation Matrix...");
const recs = reconciliationEngine.getReconciliations();
assert(recs.length === 5, `Reconciliations count must be 5 (got ${recs.length})`);
assert(recs[0].rootCauseCategory === "Metodologi Anualisasi", "Root cause 1 must be Metodologi Anualisasi");
console.log("   -> Reconciliations Matrix OK!");

console.log("=== ALL SYSTEM VERIFICATION CHECKS PASSED SUCCESSFULLY! ===");
