/**
 * Mode C: Skema Investasi Calculation Logic (Yield, Modified Z-Score & Risk Overlay)
 * Pure, isolated calculation module without side effects.
 */

import { parseNumber } from "./formatters.js";

export function calculateInvestasi(inputs) {
  const investAmt = parseNumber(inputs.investmentAmount);
  const couponRate = parseNumber(inputs.couponRatePercent) / 100;
  const tenor = Math.max(1, Math.round(parseNumber(inputs.tenorYears)));

  const ta = parseNumber(inputs.totalAssets);
  const tl = parseNumber(inputs.totalLiabilities);
  const eq = parseNumber(inputs.totalEquity);
  const ca = parseNumber(inputs.currentAssets);
  const cl = parseNumber(inputs.currentLiabilities);
  const rev = parseNumber(inputs.revenue);
  const op = parseNumber(inputs.operatingProfit);
  const np = parseNumber(inputs.netProfit);
  const dep = parseNumber(inputs.depreciation);
  const isSemi = inputs.isSemiAnnual !== false;
  const multiplier = isSemi ? 2 : 1;

  const exposure = parseNumber(inputs.collateralExposure);
  const stressLoss = parseNumber(inputs.stressLoss);

  // 1. Yield & Cash Flow Return
  const annualCoupon = investAmt * couponRate;
  const quarterlyCoupon = annualCoupon / 4;
  const totalCoupons = annualCoupon * tenor;
  const totalReturn = investAmt + totalCoupons;

  // 2. Modified Z-Score Anualisasi (Formula Baku Kajian Ihsan hlm. 15)
  let modZ = null;
  let modZComponents = null;
  let modZTier = "N/A";
  let modZAssessment = "Data Laporan Keuangan Belum Lengkap";

  if (ta > 0 && tl > 0) {
    const wk = ca - cl;
    const wk_ta = wk / ta;
    const cashprof_ta = ((np + dep) * multiplier) / ta;
    const solvr = ta / tl;
    const opprof_ta = (op * multiplier) / ta;
    const sales_ta = (rev * multiplier) / ta;

    const zScore = -3.337 +
      (0.736 * wk_ta) +
      (6.950 * cashprof_ta) +
      (0.864 * solvr) +
      (7.554 * opprof_ta) +
      (1.544 * sales_ta);

    modZ = Number(zScore.toFixed(3));
    modZComponents = {
      wk_ta: Number(wk_ta.toFixed(4)),
      cashprof_ta: Number(cashprof_ta.toFixed(4)),
      solvr: Number(solvr.toFixed(4)),
      opprof_ta: Number(opprof_ta.toFixed(4)),
      sales_ta: Number(sales_ta.toFixed(4))
    };

    if (modZ >= 0.0) {
      modZTier = "Hijau";
      modZAssessment = "Aman (Kemungkinan Gagal Bayar Rendah)";
    } else if (modZ >= -0.50) {
      modZTier = "Kuning";
      modZAssessment = "Cukup Aman (Perlu Monitoring Berkala)";
    } else if (modZ >= -1.00) {
      modZTier = "Oranye";
      modZAssessment = "Butuh Peninjauan Ekstensif";
    } else {
      modZTier = "Merah";
      modZAssessment = "Tidak Aman (Default Risk Tinggi)";
    }
  }

  // 3. Altman Z-Score
  let altmanZ = null;
  let altmanZTier = "N/A";
  if (ta > 0 && tl > 0) {
    const x1 = (ca - cl) / ta;
    const x2 = (eq * 0.4) / ta;
    const x3 = (op * multiplier) / ta;
    const x4 = eq / tl;
    const x5 = (rev * multiplier) / ta;
    const az = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5);
    altmanZ = Number(az.toFixed(2));
    if (altmanZ >= 2.60) {
      altmanZTier = "Hijau (Aman)";
    } else if (altmanZ >= 1.21) {
      altmanZTier = "Kuning (Grey Zone)";
    } else {
      altmanZTier = "Merah (Distress)";
    }
  }

  // 4. Rasio Neraca Kunci
  const currentRatio = cl > 0 ? Number((ca / cl).toFixed(2)) : null;
  const der = eq > 0 ? Number((tl / eq).toFixed(2)) : null;
  const pojkDerStatus = der != null && der <= 5.0 ? "Aman (≤ 5.0x Plafon POJK)" : "Melampaui Plafon POJK";

  // 5. Risk Overlay & Stress Scenario
  let riskOverlayResult = null;
  if (exposure > 0) {
    const recoveryEstimated = Math.max(0, exposure - stressLoss);
    const recoveryRate = (recoveryEstimated / exposure) * 100;
    const lossSeverity = (stressLoss / exposure) * 100;

    // Dampak ke Modified Z-Score
    let stressedModZ = null;
    if (ta > 0 && tl > 0 && modZ != null) {
      const stressedEq = Math.max(0, eq - stressLoss);
      const stressedTl = tl + stressLoss;
      const stressedSolvr = ta / stressedTl;
      const deltaZ = (0.864 * (stressedSolvr - (ta / tl))) - (6.950 * (stressLoss * multiplier / ta));
      stressedModZ = Number((modZ + deltaZ).toFixed(3));
    }

    let overlayStatus = "YELLOW - Enhanced Monitoring";
    if (stressedModZ != null && stressedModZ < 0) {
      overlayStatus = "RED - High Distress Probability";
    }

    riskOverlayResult = {
      exposure,
      stressLoss,
      recoveryEstimated,
      recoveryRate: Number(recoveryRate.toFixed(1)),
      lossSeverity: Number(lossSeverity.toFixed(1)),
      stressedModZ,
      overlayStatus,
      rationale: `Dengan potensi stress loss ${lossSeverity.toFixed(1)}% atas exposure Rp ${exposure.toLocaleString("id-ID")}, Modified Z-Score berpotensi tergerus dari ${modZ} menjadi ${stressedModZ != null ? stressedModZ : "-"}. Posisi ditempatkan pada ${overlayStatus}.`
    };
  }

  // Yearly coupon schedule
  const yieldSchedule = [];
  for (let y = 1; y <= tenor; y++) {
    yieldSchedule.push({
      year: y,
      annualCoupon,
      quarterlyCoupon,
      cumulativeCoupons: annualCoupon * y,
      totalRedemption: y === tenor ? investAmt + (annualCoupon * y) : annualCoupon * y
    });
  }

  return {
    summary: {
      investAmt,
      couponRatePercent: inputs.couponRatePercent,
      tenor,
      annualCoupon,
      quarterlyCoupon,
      totalCoupons,
      totalReturn,
      modZ,
      modZTier,
      modZAssessment,
      modZComponents,
      altmanZ,
      altmanZTier,
      currentRatio,
      der,
      pojkDerStatus
    },
    yieldSchedule,
    riskOverlayResult
  };
}
