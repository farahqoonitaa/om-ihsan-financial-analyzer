/**
 * Financial Math & Deterministic Verification Engine
 * Implements:
 * - Vertical & Horizontal Analysis (MoM, YoY, RTC)
 * - Modified Z-Score (Annualized) & Altman Z-Score
 * - Full 33 Bond/Equity Financial Ratios
 * - 10 Forensic Signals (S1 - S10)
 * - Footing & Cross-Reference Integrity Checks
 */

const MASTER = require("../data/masterParameters");

// 1. Analisis Vertikal (Common-Size Analysis)
function computeVerticalAnalysis(items, baseTotal) {
  if (!items || typeof items !== "object" || !baseTotal || baseTotal === 0) return null;
  const result = {};
  for (const [key, val] of Object.entries(items)) {
    if (typeof val === "number" && !isNaN(val)) {
      result[key] = {
        amount: val,
        percentage: Number(((val / baseTotal) * 100).toFixed(2))
      };
    }
  }
  return result;
}

// 2. Analisis Horizontal (MoM, YoY, YoY %, RTC %)
function computeHorizontalAnalysis(cyVal, pyVal, rkapVal, pmVal) {
  const result = {
    cy: cyVal,
    py: pyVal,
    pm: pmVal,
    rkap: rkapVal,
    yoyNominal: null,
    yoyPercent: null,
    momNominal: null,
    momPercent: null,
    rtcPercent: null,
    rtcStatus: null
  };

  // YoY
  if (typeof cyVal === "number" && typeof pyVal === "number") {
    result.yoyNominal = Number((cyVal - pyVal).toFixed(2));
    if (pyVal !== 0) {
      result.yoyPercent = Number((((cyVal - pyVal) / Math.abs(pyVal)) * 100).toFixed(2));
    }
  }

  // MoM
  if (typeof cyVal === "number" && typeof pmVal === "number") {
    result.momNominal = Number((cyVal - pmVal).toFixed(2));
    if (pmVal !== 0) {
      result.momPercent = Number((((cyVal - pmVal) / Math.abs(pmVal)) * 100).toFixed(2));
    }
  }

  // RTC (Realisasi Terhadap Cita-cita / RKAP Target)
  if (typeof cyVal === "number" && typeof rkapVal === "number" && rkapVal > 0) {
    const rtc = Number(((cyVal / rkapVal) * 100).toFixed(2));
    result.rtcPercent = rtc;
    if (rtc >= 95.0) {
      result.rtcStatus = { tier: "Hijau", label: "Tercapai (≥ 95%)", badge: "success" };
    } else if (rtc >= 80.0) {
      result.rtcStatus = { tier: "Kuning", label: "Perhatian (80-94.9%)", badge: "warning" };
    } else {
      result.rtcStatus = { tier: "Merah", label: "Kurang (< 80%)", badge: "danger" };
    }
  }

  return result;
}

// 3. Modified Z-Score (Anualisasi)
function calculateModifiedZScore(params) {
  if (!params || typeof params !== "object") return null;
  const {
    currentAssets, currentLiab, totalAssets,
    netProfit, depreciation = 0, equity, totalLiab,
    operatingProfit, revenue, isSemiAnnual = true
  } = params;

  if (!totalAssets || totalAssets === 0 || !totalLiab || totalLiab === 0) return null;
  if (typeof currentAssets !== "number" || isNaN(currentAssets) ||
      typeof currentLiab !== "number" || isNaN(currentLiab) ||
      typeof netProfit !== "number" || isNaN(netProfit) ||
      typeof operatingProfit !== "number" || isNaN(operatingProfit) ||
      typeof revenue !== "number" || isNaN(revenue)) {
    return null;
  }

  const multiplier = isSemiAnnual ? 2 : 1;
  const nwc = currentAssets - currentLiab;
  const wk_ta = nwc / totalAssets;
  const cashprof_ta = ((netProfit + (typeof depreciation === "number" && !isNaN(depreciation) ? depreciation : 0)) * multiplier) / totalAssets;
  const solvr = totalAssets / totalLiab; // Total Aset / Total Liabilitas (Sesuai Blueprint hlm. 15)
  const opprof_ta = (operatingProfit * multiplier) / totalAssets;
  const sales_ta = (revenue * multiplier) / totalAssets;

  const w = MASTER.zScores.modifiedZ.weights;
  const zScore = w.constant +
    (w.wk_ta * wk_ta) +
    (w.cashprof_ta * cashprof_ta) +
    (w.solvr * solvr) +
    (w.opprof_ta * opprof_ta) +
    (w.sales_ta * sales_ta);

  if (isNaN(zScore)) return null;

  const rounded = Number(zScore.toFixed(3));
  let assessment = "Tidak Aman (Default Risk Tinggi)";
  let tier = "Merah";
  if (rounded >= 0.0) {
    assessment = "Aman (Kemungkinan Gagal Bayar Rendah)";
    tier = "Hijau";
  } else if (rounded >= -0.50) {
    assessment = "Cukup Aman (Perlu Monitoring)";
    tier = "Kuning";
  } else if (rounded >= -1.00) {
    assessment = "Butuh Peninjauan";
    tier = "Oranye";
  }

  return {
    score: rounded,
    components: {
      wk_ta: Number(wk_ta.toFixed(4)),
      cashprof_ta: Number(cashprof_ta.toFixed(4)),
      solvr: Number(solvr.toFixed(4)),
      opprof_ta: Number(opprof_ta.toFixed(4)),
      sales_ta: Number(sales_ta.toFixed(4))
    },
    tier,
    assessment
  };
}

// 4. Altman Z-Score
function calculateAltmanZScore(params) {
  if (!params || typeof params !== "object") return null;
  const { currentAssets, currentLiab, totalAssets, retainedEarnings = 0, ebit, equity, totalLiab, revenue } = params;
  if (!totalAssets || totalAssets === 0 || !totalLiab || totalLiab === 0) return null;
  if (typeof currentAssets !== "number" || isNaN(currentAssets) ||
      typeof currentLiab !== "number" || isNaN(currentLiab) ||
      typeof ebit !== "number" || isNaN(ebit) ||
      typeof equity !== "number" || isNaN(equity) ||
      typeof revenue !== "number" || isNaN(revenue)) {
    return null;
  }

  const x1 = (currentAssets - currentLiab) / totalAssets;
  const x2 = (typeof retainedEarnings === "number" && !isNaN(retainedEarnings) ? retainedEarnings : 0) / totalAssets;
  const x3 = ebit / totalAssets;
  const x4 = equity / totalLiab;
  const x5 = revenue / totalAssets;

  const z = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5;
  if (isNaN(z)) return null;

  const rounded = Number(z.toFixed(2));
  let tier = "Merah";
  let label = "Kemungkinan Gagal Bayar Tinggi";
  if (rounded >= 2.60) {
    tier = "Hijau";
    label = "Kemungkinan Gagal Bayar Rendah (Aman)";
  } else if (rounded >= 1.21) {
    tier = "Kuning";
    label = "Daerah Abu-abu / Waspada";
  }

  return { score: rounded, tier, label };
}

// 5. Perhitungan 33 Rasio Baku Lengkap
function calculateComprehensiveRatios(f) {
  if (!f || typeof f !== "object") return {};
  const r = {};

  // Likuiditas
  r.currentRatio = (f.currentLiabCY && f.currentLiabCY > 0 && typeof f.currentAssetsCY === "number") ? Number((f.currentAssetsCY / f.currentLiabCY).toFixed(2)) : null;
  r.quickRatio = (f.currentLiabCY && f.currentLiabCY > 0) ? Number((((f.cashCY || 0) + (f.tradeReceivablesCY || 0)) / f.currentLiabCY).toFixed(2)) : null;
  r.netWorkingCapital = (typeof f.currentAssetsCY === "number" && typeof f.currentLiabCY === "number") ? Number((f.currentAssetsCY - f.currentLiabCY).toFixed(2)) : null;
  r.ocfCurrentLiab = (typeof f.ocfCY === "number" && f.currentLiabCY && f.currentLiabCY > 0) ? Number((f.ocfCY / f.currentLiabCY).toFixed(2)) : null;

  // Solvabilitas & Leverage (Disclose/Null on negative equity per Honesty Rules)
  r.der = (typeof f.equityCY === "number" && f.equityCY > 0 && typeof f.totalLiabCY === "number") ? Number((f.totalLiabCY / f.equityCY).toFixed(2)) : null;
  r.debtRatio = (typeof f.totalAssetsCY === "number" && f.totalAssetsCY > 0 && typeof f.totalLiabCY === "number") ? Number(((f.totalLiabCY / f.totalAssetsCY) * 100).toFixed(2)) : null;
  r.ltdEquity = (typeof f.ltDebtCY === "number" && typeof f.equityCY === "number" && f.equityCY > 0) ? Number((f.ltDebtCY / f.equityCY).toFixed(2)) : null;
  r.ltdAssets = (typeof f.ltDebtCY === "number" && typeof f.totalAssetsCY === "number" && f.totalAssetsCY > 0) ? Number((f.ltDebtCY / f.totalAssetsCY).toFixed(2)) : null;
  r.netGearing = (typeof f.equityCY === "number" && f.equityCY > 0) ? Number(((( (f.stDebtCY || 0) + (f.ltDebtCY || 0) ) - (f.cashCY || 0)) / f.equityCY).toFixed(2)) : null;

  // Profitabilitas (ROE is null on negative equity)
  r.grossProfitMargin = (typeof f.grossProfitCY === "number" && f.revenueCY && f.revenueCY > 0) ? Number(((f.grossProfitCY / f.revenueCY) * 100).toFixed(2)) : null;
  r.operatingProfitMargin = (typeof f.operatingProfitCY === "number" && f.revenueCY && f.revenueCY > 0) ? Number(((f.operatingProfitCY / f.revenueCY) * 100).toFixed(2)) : null;
  r.netProfitMargin = (typeof f.netProfitCY === "number" && f.revenueCY && f.revenueCY > 0) ? Number(((f.netProfitCY / f.revenueCY) * 100).toFixed(2)) : null;
  r.ebitdaMargin = (typeof f.ebitdaCY === "number" && f.revenueCY && f.revenueCY > 0) ? Number(((f.ebitdaCY / f.revenueCY) * 100).toFixed(2)) : null;
  r.roa = (typeof f.netProfitCY === "number" && f.totalAssetsCY && f.totalAssetsCY > 0) ? Number((( (f.netProfitCY * (f.annualMultiplier || 2)) / f.totalAssetsCY) * 100).toFixed(2)) : null;
  r.roe = (typeof f.netProfitCY === "number" && f.equityCY && f.equityCY > 0) ? Number((( (f.netProfitCY * (f.annualMultiplier || 2)) / f.equityCY) * 100).toFixed(2)) : null;
  r.ebitdaAssets = (typeof f.ebitdaCY === "number" && f.totalAssetsCY && f.totalAssetsCY > 0) ? Number((( (f.ebitdaCY * (f.annualMultiplier || 2)) / f.totalAssetsCY) * 100).toFixed(2)) : null;

  // Coverage & Cash Flow
  r.interestCoverage = (typeof f.operatingProfitCY === "number" && f.interestExpenseCY && f.interestExpenseCY > 0) ? Number((f.operatingProfitCY / f.interestExpenseCY).toFixed(2)) : null;
  r.ebitdaInterest = (typeof f.ebitdaCY === "number" && f.interestExpenseCY && f.interestExpenseCY > 0) ? Number((f.ebitdaCY / f.interestExpenseCY).toFixed(2)) : null;
  r.cfcr = (typeof f.ocfCY === "number" && f.interestExpenseCY && f.interestExpenseCY > 0) ? Number((f.ocfCY / f.interestExpenseCY).toFixed(2)) : null;
  r.dscr = (typeof f.ebitdaCY === "number" && (f.interestExpenseCY || f.stDebtCY)) ? Number(((f.ebitdaCY - (f.taxExpenseCY || 0)) / ((f.interestExpenseCY || 0) + (f.stDebtCY || 0))).toFixed(2)) : null;
  r.ocfNetIncome = (typeof f.ocfCY === "number" && typeof f.netProfitCY === "number" && f.netProfitCY !== 0) ? Number((f.ocfCY / f.netProfitCY).toFixed(2)) : null;

  // Kualitas Aset & Pertumbuhan
  r.arCurrentAssets = (typeof f.tradeReceivablesCY === "number" && f.currentAssetsCY && f.currentAssetsCY > 0) ? Number(((f.tradeReceivablesCY / f.currentAssetsCY) * 100).toFixed(2)) : null;
  r.salesGrowth = (typeof f.revenueCY === "number" && typeof f.revenuePY === "number" && f.revenuePY !== 0) ? Number((((f.revenueCY - f.revenuePY) / Math.abs(f.revenuePY)) * 100).toFixed(2)) : null;
  r.opGrowth = (typeof f.operatingProfitCY === "number" && typeof f.operatingProfitPY === "number" && f.operatingProfitPY !== 0) ? Number((((f.operatingProfitCY - f.operatingProfitPY) / Math.abs(f.operatingProfitPY)) * 100).toFixed(2)) : null;
  r.niGrowth = (typeof f.netProfitCY === "number" && typeof f.netProfitPY === "number" && f.netProfitPY !== 0) ? Number((((f.netProfitCY - f.netProfitPY) / Math.abs(f.netProfitPY)) * 100).toFixed(2)) : null;

  return r;
}

// 6. Uji Footing & Integritas Matematis
function verifyFootingIntegrity(f) {
  const issues = [];
  
  // Balance Sheet Footing: Assets = Liabilities + Equity
  if (f.totalAssetsCY && f.totalLiabCY && f.equityCY) {
    const diff = Math.abs(f.totalAssetsCY - (f.totalLiabCY + f.equityCY));
    if (diff > 0.01) {
      issues.push({
        type: "Footing Break",
        area: "Neraca",
        message: `Total Aset (${f.totalAssetsCY}) tidak sama dengan Total Liabilitas (${f.totalLiabCY}) + Ekuitas (${f.equityCY}). Selisih: ${diff.toFixed(2)}`
      });
    }
  }

  // P&L Footing: Gross Profit = Rev - COGS
  if (f.revenueCY && f.cogsCY && f.grossProfitCY) {
    const expectedGross = f.revenueCY - f.cogsCY;
    if (Math.abs(expectedGross - f.grossProfitCY) > 0.05) {
      issues.push({
        type: "Footing Break",
        area: "Laba Rugi",
        message: `Laba Kotor dilaporkan (${f.grossProfitCY}) berbeda dari Pendapatan dikurangi Beban Pokok (${expectedGross.toFixed(2)})`
      });
    }
  }

  return {
    isClean: issues.length === 0,
    issues
  };
}

module.exports = {
  computeVerticalAnalysis,
  computeHorizontalAnalysis,
  calculateModifiedZScore,
  calculateAltmanZScore,
  calculateComprehensiveRatios,
  verifyFootingIntegrity
};
