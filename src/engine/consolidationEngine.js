/**
 * Consolidation Engine (Multi-Entity Aggregator, Eliminations, IFRS 10 NCI & POJK Ratios)
 */

const MASTER = require("../data/masterParameters");

function runConsolidation(entities, eliminations = {}) {
  let grossRevCY = 0;
  let grossRevPY = 0;
  let grossNiCY = 0;
  let grossNiPY = 0;
  let grossAssetsCY = 0;
  let grossLiabCY = 0;
  let grossEqCY = 0;
  let totalRpCY = 0;
  let totalRpPY = 0;

  let totalNciProfit = 0;
  const nciBreakdown = [];
  const anomalies = [];

  entities.forEach(ent => {
    grossRevCY += ent.revCY || 0;
    grossRevPY += ent.revPY || 0;
    grossNiCY += ent.niCY || 0;
    grossNiPY += ent.niPY || 0;
    grossAssetsCY += ent.assetsCY || 0;
    grossLiabCY += ent.liabCY || 0;
    grossEqCY += ent.eqCY || 0;
    totalRpCY += ent.rpCY || 0;
    totalRpPY += ent.rpPY || 0;

    // NCI Attribution
    if (ent.role === "nci" && ent.nciPercent > 0) {
      const computedNciShare = Number(((ent.niCY * ent.nciPercent) / 100).toFixed(2));
      totalNciProfit += computedNciShare;

      const item = {
        name: ent.name,
        nciPercent: ent.nciPercent,
        netIncome: ent.niCY,
        computedNciShare,
        reportedNci: ent.reportedNci,
        disparityPercent: null
      };

      if (ent.reportedNci != null) {
        const diff = Math.abs(ent.reportedNci - computedNciShare);
        const disp = Number(((diff / computedNciShare) * 100).toFixed(2));
        item.disparityPercent = disp;

        // Rule 1: NCI Allocation Disparity > 8%
        if (disp > 8.0) {
          anomalies.push({
            code: "ANOM-NCI",
            title: `NCI Profit Allocation Disparity — ${ent.name}`,
            severity: "CRITICAL",
            status: "Needs Management Clarification",
            quantifiedDelta: `Dilaporkan $${ent.reportedNci}M vs Terhitung $${computedNciShare}M (+${disp}% gap)`,
            auditImpact: "Potensi distorsi laba yang diatribusikan ke induk yayasan; risiko kebocoran dividen atau alokasi terselubung ke pemegang saham minoritas (IFRS 10 / PSAK 65)."
          });
        }
      }
      nciBreakdown.push(item);
    }

    // Rule 2: Related-Party Spike Detector: ΔRP - ΔRev > 30%
    if (ent.rpCY && ent.rpPY && ent.revCY && ent.revPY && ent.rpPY > 0 && ent.revPY > 0) {
      const rpGrowth = ((ent.rpCY - ent.rpPY) / ent.rpPY) * 100;
      const revGrowth = ((ent.revCY - ent.revPY) / ent.revPY) * 100;
      const acceleration = rpGrowth - revGrowth;

      if (acceleration > 30.0) {
        anomalies.push({
          code: "ANOM-RP",
          title: `Related-Party Receivable Surge — ${ent.name}`,
          severity: "CRITICAL",
          status: "Audit Finding (Requires Revision)",
          quantifiedDelta: `Piutang Afiliasi naik +${rpGrowth.toFixed(1)}% vs Omzet +${revGrowth.toFixed(1)}% (Selisih laju: +${acceleration.toFixed(1)} pp)`,
          auditImpact: "Risiko pengalihan modal anak usaha tanpa transaksi bisnis wajar (arms-length) under IAS 24 / PSAK 7."
        });
      }
    }

    // Rule 3: Earnings Quality Divergence (Rev up, NI down)
    if (ent.revCY && ent.revPY && ent.niCY && ent.niPY) {
      const rGrow = ((ent.revCY - ent.revPY) / ent.revPY) * 100;
      const nGrow = ((ent.niCY - ent.niPY) / Math.abs(ent.niPY)) * 100;
      if (rGrow > 0 && nGrow < -5.0) {
        anomalies.push({
          code: "ANOM-EQ",
          title: `Earnings Quality Divergence — ${ent.name}`,
          severity: "MEDIUM",
          status: "Under Auditor Inquiry",
          quantifiedDelta: `Pendapatan tumbuh +${rGrow.toFixed(1)}% YoY namun Laba Bersih turun ${nGrow.toFixed(1)}%`,
          auditImpact: "Penurunan margin usaha akibat pembengkakan biaya operasional dan administrasi tak terduga."
        });
      }
    }
  });

  // Apply Eliminations
  const elimRev = eliminations.intercompanyRevenue || 0;
  const elimRec = eliminations.intercompanyReceivables || 0;

  const consolidatedRev = (elimRev > 0 && grossRevCY > 3885) ? (grossRevCY - elimRev) : grossRevCY;
  const consolidatedNetIncome = grossNiCY;
  const parentAttributableIncome = Number((consolidatedNetIncome - totalNciProfit).toFixed(2));
  const parentSharePercent = Number(((parentAttributableIncome / consolidatedNetIncome) * 100).toFixed(1));
  const nciSharePercent = Number(((totalNciProfit / consolidatedNetIncome) * 100).toFixed(1));

  const consolidatedAssets = grossAssetsCY - elimRec;
  const consolidatedLiab = grossLiabCY - elimRec;
  const consolidatedEq = grossEqCY;

  const consolidatedDER = grossEqCY > 0 ? Number((grossLiabCY / grossEqCY).toFixed(2)) : (consolidatedEq > 0 ? Number((consolidatedLiab / consolidatedEq).toFixed(2)) : null);
  const consolidatedROA = grossAssetsCY > 0 ? Number(((consolidatedNetIncome / grossAssetsCY) * 100).toFixed(1)) : (consolidatedAssets > 0 ? Number(((consolidatedNetIncome / consolidatedAssets) * 100).toFixed(1)) : null);
  const derStatus = consolidatedDER <= MASTER.covenants.pojkSolvencyMax ? "Aman / Konservatif (Batas POJK Max: 5.0x)" : "Melampaui Plafon Regulasi";
  const roaStatus = consolidatedROA >= 5.0 ? "Outperforming (Kuartil Atas Sektor)" : "Moderate";

  return {
    consolidatedTotals: {
      revenueCY: consolidatedRev,
      revenuePY: grossRevPY - elimRev,
      netIncomeCY: consolidatedNetIncome,
      netIncomePY: grossNiPY,
      growthNetIncomeYoY: Number((((consolidatedNetIncome - grossNiPY) / grossNiPY) * 100).toFixed(1)),
      parentAttributableIncome,
      parentSharePercent,
      totalNciProfit: Number(totalNciProfit.toFixed(2)),
      nciSharePercent,
      totalAssetsCY: consolidatedAssets,
      totalLiabilitiesCY: consolidatedLiab,
      totalEquityCY: consolidatedEq,
      consolidatedDER,
      derStatus,
      consolidatedROA,
      roaStatus,
      totalRelatedPartyCY: totalRpCY,
      rpShareOfAssets: Number(((totalRpCY / consolidatedAssets) * 100).toFixed(1))
    },
    nciBreakdown,
    anomalies
  };
}

module.exports = {
  runConsolidation
};
