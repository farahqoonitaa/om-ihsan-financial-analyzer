/**
 * Mode B: Non-Pendanaan Calculation (Operational & Working Capital Logic)
 * Pure calculation module without side effects.
 */

import { parseNumber } from "./formatters.js";

export function calculateNonPendanaan(inputs) {
  const revCY = parseNumber(inputs.revenueCY);
  const revPY = parseNumber(inputs.revenuePY);
  const rkapRev = parseNumber(inputs.rkapRevenue);
  const cogsCY = parseNumber(inputs.cogsCY);
  const opexCY = parseNumber(inputs.opexCY);
  const opexPY = parseNumber(inputs.opexPY);
  const npCY = parseNumber(inputs.netProfitCY);
  const npPY = parseNumber(inputs.netProfitPY);
  const rkapNP = parseNumber(inputs.rkapNetProfit);
  const ca = parseNumber(inputs.currentAssets);
  const cl = parseNumber(inputs.currentLiabilities);
  const ar = parseNumber(inputs.tradeReceivables);
  const rkapAR = parseNumber(inputs.rkapReceivables);
  const divPayable = parseNumber(inputs.dividendPayable);
  const nciPct = parseNumber(inputs.nciPercent);

  // 1. Pertumbuhan Horizontal YoY
  const revGrowthYoY = revPY > 0 ? ((revCY - revPY) / revPY) * 100 : 0;
  const opexGrowthYoY = opexPY > 0 ? ((opexCY - opexPY) / opexPY) * 100 : 0;
  const npGrowthYoY = npPY > 0 ? ((npCY - npPY) / Math.abs(npPY)) * 100 : 0;
  const growthGap = opexGrowthYoY - revGrowthYoY;

  // 2. Marjin Usaha
  const grossProfit = Math.max(0, revCY - cogsCY);
  const operatingProfit = Math.max(0, grossProfit - opexCY);
  const grossMargin = revCY > 0 ? (grossProfit / revCY) * 100 : 0;
  const operatingMargin = revCY > 0 ? (operatingProfit / revCY) * 100 : 0;
  const netMargin = revCY > 0 ? (npCY / revCY) * 100 : 0;

  // 3. Realisasi Terhadap Cita-cita (RTC / RKAP Target)
  const rtcRevenue = rkapRev > 0 ? (revCY / rkapRev) * 100 : null;
  const rtcNetProfit = rkapNP > 0 ? (npCY / rkapNP) * 100 : null;
  const rtcReceivables = rkapAR > 0 ? (ar / rkapAR) * 100 : null;

  // 4. Likuiditas & Modal Kerja
  const nwc = ca - cl;
  const currentRatio = cl > 0 ? ca / cl : null;

  // 5. Hak Minoritas & Dividen (IFRS 10)
  const nciShareIncome = nciPct > 0 ? npCY * (nciPct / 100) : 0;
  const parentShareIncome = npCY - nciShareIncome;
  const dividendToCurrentAssets = ca > 0 ? (divPayable / ca) * 100 : 0;

  // 6. Tiering Matrix & Rekomendasi Temuan
  const findings = [];
  let overallTier = "Hijau";

  // Check NWC
  if (nwc < 0) {
    findings.push({
      tier: "Merah",
      area: "Likuiditas Modal Kerja",
      text: `Defisit Modal Kerja (Negative NWC): ${nwc < 0 ? "-" : ""}Rp ${Math.abs(Math.round(nwc)).toLocaleString("id-ID")} dengan Current Ratio ${currentRatio ? currentRatio.toFixed(2) : "-"}x.`,
      recommendation: "Kewajiban jangka pendek melampaui aset lancar; evaluasi jadwal penagihan piutang dan restrukturisasi utang lancar."
    });
    overallTier = "Merah";
  }

  // Check RTC Piutang
  if (rtcReceivables && rtcReceivables > 120) {
    findings.push({
      tier: "Merah",
      area: "Penumpukan Piutang Usaha",
      text: `Realisasi Piutang mencapai ${rtcReceivables.toFixed(1)}% dari target RKAP (Lonjakan abnormal > 120%).`,
      recommendation: "Teliti aging piutang (0-30, 31-60, 61-90, >90 hari); lakukan percepatan penagihan (collection recovery)."
    });
    overallTier = "Merah";
  }

  // Check Utang Dividen
  if (divPayable > 0 && dividendToCurrentAssets > 20) {
    findings.push({
      tier: "Merah",
      area: "Kewajiban Dividen Menggantung",
      text: `Utang dividen sebesar ${dividendToCurrentAssets.toFixed(1)}% dari total aset lancar belum dibayarkan.`,
      recommendation: "Konfirmasi sumber kas likuid untuk realisasi pembayaran dividen kepada pemegang saham."
    });
    overallTier = "Merah";
  }

  // Check Growth Gap
  if (growthGap > 0) {
    findings.push({
      tier: "Kuning",
      area: "Growth Gap (Sinyal S7)",
      text: `Kenaikan Beban Usaha (+${opexGrowthYoY.toFixed(1)}%) tumbuh lebih cepat dari Pendapatan (+${revGrowthYoY.toFixed(1)}%) selisih ${growthGap.toFixed(1)} pp.`,
      recommendation: "Lakukan audit efisiensi atas kenaikan komponen biaya operasional dan administrasi."
    });
    if (overallTier !== "Merah") overallTier = "Kuning";
  }

  // Check RTC Profit
  if (rtcNetProfit && rtcNetProfit < 90) {
    findings.push({
      tier: "Kuning",
      area: "Pencapaian Target Laba (RTC)",
      text: `Realisasi laba bersih hanya mencapai ${rtcNetProfit.toFixed(1)}% dari target RKAP.`,
      recommendation: "Evaluasi disparitas marjin usaha per lini bisnis untuk mengidentifikasi unit yang mengalami underperformance."
    });
    if (overallTier !== "Merah") overallTier = "Kuning";
  }

  return {
    summary: {
      revCY,
      revGrowthYoY,
      opexGrowthYoY,
      growthGap,
      npCY,
      npGrowthYoY,
      grossMargin,
      operatingMargin,
      netMargin,
      nwc,
      currentRatio,
      rtcRevenue,
      rtcNetProfit,
      rtcReceivables,
      nciShareIncome,
      parentShareIncome,
      divPayable,
      dividendToCurrentAssets,
      overallTier
    },
    findings
  };
}
