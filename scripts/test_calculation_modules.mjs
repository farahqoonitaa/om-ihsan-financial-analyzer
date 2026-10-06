import assert from "assert";
import { calculatePendanaan } from "../public/js/logic/pendanaanLogic.js";
import { calculateNonPendanaan } from "../public/js/logic/nonPendanaanLogic.js";
import { calculateInvestasi } from "../public/js/logic/investasiLogic.js";

console.log("=== TESTING ISOLATED PURE LOGIC MODULES ===");

// 1. Test Mode A: Pendanaan
console.log("1. Testing Mode A: Pendanaan Logic...");
const pendanaanRes = calculatePendanaan({
  principal: 50000000000,
  annualRatePercent: 8.5,
  tenorYears: 5,
  amortizationType: "equal_principal",
  annualEbit: 15000000000,
  annualEbitda: 19000000000,
  annualTax: 3000000000,
  existingEquity: 35000000000,
  existingLiabilities: 45000000000
});
assert(pendanaanRes.schedule.length === 5, "Schedule length must be 5 years");
assert(pendanaanRes.summary.principal === 50000000000, "Principal must be 50M");
assert(pendanaanRes.summary.icr > 3.0, "ICR must be above 3.0x for this test case");
assert(pendanaanRes.summary.projectedDer != null, "Projected DER must be computed");
console.log("   -> Mode A: Pendanaan OK! (ICR:", pendanaanRes.summary.icr.toFixed(2), "DSCR:", pendanaanRes.summary.dscr.toFixed(2), "Projected DER:", pendanaanRes.summary.projectedDer.toFixed(2), ")");

// 2. Test Mode B: Non-Pendanaan
console.log("2. Testing Mode B: Non-Pendanaan Logic...");
const nonPendRes = calculateNonPendanaan({
  revenueCY: 1512000000000,
  revenuePY: 1062000000000,
  rkapRevenue: 1450000000000,
  cogsCY: 1250000000000,
  opexCY: 149600000000,
  opexPY: 105000000000,
  netProfitCY: 87650000000,
  netProfitPY: 60510000000,
  rkapNetProfit: 80000000000,
  currentAssets: 370550000000,
  currentLiabilities: 717730000000,
  tradeReceivables: 91180000000,
  rkapReceivables: 30270000000,
  dividendPayable: 110270000000,
  nciPercent: 1.0
});
assert(nonPendRes.summary.nwc < 0, "NWC must be negative (deficit)");
assert(Math.abs(nonPendRes.summary.rtcReceivables - 301.2) < 0.5, "RTC receivables must be ~301.2%");
assert(nonPendRes.summary.overallTier === "Merah", "Overall tier must be Merah due to NWC & receivables surge");
assert(nonPendRes.findings.length >= 2, "Must generate at least 2 findings");
console.log("   -> Mode B: Non-Pendanaan OK! (NWC:", nonPendRes.summary.nwc, "RTC Piutang:", nonPendRes.summary.rtcReceivables.toFixed(1) + "%", "Tier:", nonPendRes.summary.overallTier, ")");

// 3. Test Mode C: Skema Investasi (PT Daaz Benchmark)
console.log("3. Testing Mode C: Skema Investasi Logic (PT Daaz)...");
const invRes = calculateInvestasi({
  investmentAmount: 50000000000,
  couponRatePercent: 7.5,
  tenorYears: 3,
  isSemiAnnual: true,
  totalAssets: 6616224661283,
  totalLiabilities: 4378915557304,
  totalEquity: 2237309103979,
  currentAssets: 3809837654928,
  currentLiabilities: 2426953861957,
  revenue: 6908103651164,
  operatingProfit: 323165773107,
  netProfit: 137448447134,
  depreciation: 80097531868,
  collateralExposure: 0,
  stressLoss: 0
});
assert(Math.abs(invRes.summary.modZ - 2.541) < 0.05, `Modified Z must be ~2.54 (got ${invRes.summary.modZ})`);
assert(invRes.summary.modZTier === "Hijau", "Modified Z tier must be Hijau");
assert(invRes.yieldSchedule.length === 3, "Yield schedule must be 3 years");
console.log("   -> Mode C: Skema Investasi OK! (Modified Z:", invRes.summary.modZ, "Tier:", invRes.summary.modZTier, "Total Return:", invRes.summary.totalReturn, ")");

console.log("=== ALL PURE CALCULATION MODULE TESTS PASSED! ===");
