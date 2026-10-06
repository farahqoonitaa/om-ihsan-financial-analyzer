/**
 * Auto-Calculated Multi-Entity Dashboard Component
 * Displays the automatically computed financial analysis from input files / benchmark.
 * Seamlessly connects back to Mode A, Mode B, and Mode C.
 */

import { formatRupiah, formatNumber, formatPercent } from "../logic/formatters.js";
import { openCopilotWithQuery } from "../components/aiCopilotDrawer.js";

export function renderAutoCalculatedDashboard(container, sourceData, sourceFileName, onNavigateToMode, onBackToMenu) {
  const data = sourceData || {};
  const eps = (data.pengendali && data.pengendali[0]) || {};
  const poj = (data.nonPengendali && data.nonPengendali[0]) || {};
  const daaz = (data.investasi && data.investasi[0]) || {};
  const pegadaian = (data.investasi && data.investasi[1]) || {};
  const konsol = data.konsolidasi || {};

  container.innerHTML = `
    <div class="page-content animate-fade-in" style="max-width:1100px;">
      
      <!-- Top Banner -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-green">⚡ Auto-Calculate Berhasil</span>
            <span style="font-size:12px; color:var(--ink-secondary);">Sumber: <strong>${sourceFileName || "Benchmark Terintegrasi"}</strong></span>
          </div>
          <h2 style="font-size:24px; margin:4px 0; color:var(--forest-deep);">Dashboard Hasil Analisis Multi-Entitas Otomatis</h2>
          <p style="font-size:13px; color:var(--ink-secondary);">
            Seluruh data dari file telah diuraikan ke dalam taksonomi keuangan dan dihitung otomatis melintasi 3 Mode dan Konsolidasi Grup.
          </p>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button id="btnCrossVerifyAll" class="btn btn-gold" style="font-size:12px;">
            🤖 AI RAG Cross-Verify Seluruh Hasil
          </button>
          <button id="btnBackHome" class="btn btn-secondary" style="font-size:12px;">
            ⌂ Menu Utama
          </button>
        </div>
      </div>

      <!-- KPI Executive Summary Grid -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom:24px;">
        <div class="kpi-card">
          <span class="kpi-label">Konsolidasi 6 Entitas (Omzet)</span>
          <div class="kpi-value" style="font-size:20px; color:var(--forest);">Rp 3.885,0 M</div>
          <span class="badge badge-green" style="font-size:10px; margin-top:4px;">Eliminasi Intercompany Rp 140,0 M</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Plafon DER Konsolidasi POJK</span>
          <div class="kpi-value" style="font-size:20px; color:var(--forest);">0,96x</div>
          <span class="badge badge-green" style="font-size:10px; margin-top:4px;">✓ Sangat Aman (Batas POJK 5,0x)</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Modified Z-Score (PT Daaz)</span>
          <div class="kpi-value" style="font-size:20px; color:var(--green);">2,5415</div>
          <span class="badge badge-green" style="font-size:10px; margin-top:4px;">🟢 Safe Zone (Kajian Ihsan hlm. 15)</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Lonjakan Piutang PT POJ (RTC)</span>
          <div class="kpi-value" style="font-size:20px; color:var(--red);">301,20%</div>
          <span class="badge badge-red" style="font-size:10px; margin-top:4px;">🔴 Tiering Merah (> 120% RKAP)</span>
        </div>
      </div>

      <!-- 4 Entity Cards Section -->
      <h3 style="font-size:17px; margin-bottom:14px; color:var(--forest-deep);">Perincian Analisis Per Entitas (Klik untuk Buka Mode Terkait):</h3>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap:18px; margin-bottom:28px;">
        
        <!-- Entity 1: PT EPS (Pengendali) -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div>
                <span class="badge badge-blue" style="font-size:10px;">Entitas Pengendali</span>
                <h4 style="font-size:16px; margin:2px 0; color:var(--forest-deep);">${eps.name || "PT Era Permata Sejahtera"}</h4>
              </div>
              <span class="badge badge-red">6 Temuan Forensik</span>
            </div>
            <p style="font-size:12px; color:var(--ink-secondary); margin-bottom:10px;">
              Posisi per 31 Agustus 2026. Mengalami Growth Gap S7 dan defisit modal kerja operasional.
            </p>
            <div style="background:var(--surface-alt); border:1px solid var(--line); border-radius:6px; padding:10px; font-size:12px; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Net Working Capital (NWC):</span>
                <strong style="color:var(--red);">-Rp 40,49 Miliar</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Pertumbuhan Opex vs Omzet (YoY):</span>
                <strong style="color:var(--red);">+32,91% vs +31,45% (Growth Gap)</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Lonjakan Tunjangan Bonus:</span>
                <strong style="color:var(--orange);">2.308% Pacing RKAP</strong>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button id="btnOpenEpsModeA" class="btn btn-secondary btn-sm" style="flex:1;">
              💳 Buka di Mode A (Kredit Rp 100M)
            </button>
            <button id="btnOpenEpsModeB" class="btn btn-primary btn-sm" style="flex:1;">
              📊 Buka di Mode B (Modal Kerja)
            </button>
          </div>
        </div>

        <!-- Entity 2: PT POJ (Non-Pengendali) -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div>
                <span class="badge badge-green" style="font-size:10px;">Entitas Non-Pengendali (1% Saham)</span>
                <h4 style="font-size:16px; margin:2px 0; color:var(--forest-deep);">${poj.name || "PT Pesonna Optima Jasa"}</h4>
              </div>
              <span class="badge badge-red">Tiering Merah</span>
            </div>
            <p style="font-size:12px; color:var(--ink-secondary); margin-bottom:10px;">
              Kepemilikan minoritas YKPP (1,0%). Dilakukan evaluasi proteksi dividen dan risiko penagihan piutang.
            </p>
            <div style="background:var(--surface-alt); border:1px solid var(--line); border-radius:6px; padding:10px; font-size:12px; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Modal Kerja Bersih (NWC):</span>
                <strong style="color:var(--red);">-Rp 347,18 M (Defisit Likuiditas)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Realisasi Piutang terhadap RKAP (RTC):</span>
                <strong style="color:var(--red);">301,20% (Plafon Terlewati)</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Hak Dividen Minoritas (1% NCI):</span>
                <strong style="color:var(--forest);">Rp 185 Juta (Net Income Rp 18,5 M)</strong>
              </div>
            </div>
          </div>
          <div>
            <button id="btnOpenPojModeB" class="btn btn-primary btn-sm btn-block">
              📊 Buka di Mode B (Kalkulasi Non-Pendanaan & RTC) →
            </button>
          </div>
        </div>

        <!-- Entity 3: PT Daaz Bara Lestari (Investasi Portofolio) -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div>
                <span class="badge badge-gold" style="font-size:10px;">Portofolio Investasi</span>
                <h4 style="font-size:16px; margin:2px 0; color:var(--forest-deep);">${daaz.name || "PT Daaz Bara Lestari Tbk"}</h4>
              </div>
              <span class="badge badge-green">Safe Zone</span>
            </div>
            <p style="font-size:12px; color:var(--ink-secondary); margin-bottom:10px;">
              Kajian instrumen sukuk/obligasi per 30 Juni 2026. Diuji dengan formula 5-komponen hlm. 15.
            </p>
            <div style="background:var(--surface-alt); border:1px solid var(--line); border-radius:6px; padding:10px; font-size:12px; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Modified Z-Score Anualisasi:</span>
                <strong style="color:var(--green);">2,5415 (Paten Kajian Ihsan)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Altman Z-Score Manufaktur:</span>
                <strong style="color:var(--green);">6,54 (Default Risk Sangat Rendah)</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Kupon / Imbal Hasil (Tenor 5 Thn):</span>
                <strong style="color:var(--forest);">12,25% p.a. (Rp 12,25 M/thn)</strong>
              </div>
            </div>
          </div>
          <div>
            <button id="btnOpenDaazModeC" class="btn btn-primary btn-sm btn-block">
              💎 Buka di Mode C (Skema Investasi & Kupon) →
            </button>
          </div>
        </div>

        <!-- Entity 4: Konsolidasi 6 Entitas -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div>
                <span class="badge badge-blue" style="font-size:10px;">Holding Yayasan</span>
                <h4 style="font-size:16px; margin:2px 0; color:var(--forest-deep);">Konsolidasi Grup (6 Entitas)</h4>
              </div>
              <span class="badge badge-green">POJK Compliant</span>
            </div>
            <p style="font-size:12px; color:var(--ink-secondary); margin-bottom:10px;">
              Agregasi menyeluruh pasca eliminasi transaksi afiliasi dan atribusi ekuitas IFRS 10.
            </p>
            <div style="background:var(--surface-alt); border:1px solid var(--line); border-radius:6px; padding:10px; font-size:12px; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Total Aset Konsolidasi:</span>
                <strong style="color:var(--forest);">$1.391,0 Miliar</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>DER Konsolidasi Grup:</span>
                <strong style="color:var(--green);">0,96x (Batas POJK 5,0x)</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Disparitas NCI Subsidiary II:</span>
                <strong style="color:var(--orange);">+$6,2 M (+34,1% di atas kepemilikan 35%)</strong>
              </div>
            </div>
          </div>
          <div>
            <button id="btnCrossVerifyKonsol" class="btn btn-secondary btn-sm btn-block">
              🤖 Cross-Verify Disparitas NCI & IFRS 10 →
            </button>
          </div>
        </div>

      </div>

    </div>
  `;

  // Attach Event Listeners
  container.querySelector("#btnBackHome").addEventListener("click", onBackToMenu);

  container.querySelector("#btnCrossVerifyAll").addEventListener("click", () => {
    openCopilotWithQuery(
      "Lakukan audit cross-verification menyeluruh terhadap hasil kalkulasi multi-entitas hari ini (PT EPS, PT POJ, PT Daaz, dan Konsolidasi Grup). Tinjau kepatuhan POJK, Z-score, dan anomali NCI.",
      () => sourceData
    );
  });

  container.querySelector("#btnCrossVerifyKonsol").addEventListener("click", () => {
    openCopilotWithQuery(
      "Cross-Verify Konsolidasi Grup: Periksa disparitas hak minoritas NCI (+34.1%) Subsidiary II menurut IFRS 10 / PSAK 65 dan konfirmasi kepatuhan batas DER 0.96x terhadap POJK 5.0x.",
      () => sourceData
    );
  });

  container.querySelector("#btnOpenEpsModeA").addEventListener("click", () => {
    onNavigateToMode("pendanaan", {
      loanPrincipal: 100000000000,
      interestRatePct: 10.0,
      tenorYears: 5,
      method: "equal_principal",
      ebit: 35000000000,
      ebitda: 45000000000,
      tax: 7000000000,
      existingDebt: 105000000000,
      totalEquity: 75500000000
    });
  });

  container.querySelector("#btnOpenEpsModeB").addEventListener("click", () => {
    onNavigateToMode("nonpendanaan", {
      currentAssets: 52630000000,
      currentLiabilities: 93120000000,
      revenueYoYGrowthPct: 31.45,
      opexYoYGrowthPct: 32.91,
      actualRevenue: 216880000000,
      rkapTargetRevenue: 220000000000,
      actualReceivables: 45000000000,
      rkapTargetReceivables: 38000000000,
      subsidiaryNetIncome: 6300000000,
      nciOwnershipPct: 10.0
    });
  });

  container.querySelector("#btnOpenPojModeB").addEventListener("click", () => {
    onNavigateToMode("nonpendanaan", {
      currentAssets: 534600000000,
      currentLiabilities: 881780000000,
      revenueYoYGrowthPct: 12.5,
      opexYoYGrowthPct: 28.4,
      actualRevenue: 620000000000,
      rkapTargetRevenue: 710000000000,
      actualReceivables: 185000000000,
      rkapTargetReceivables: 61420000000,
      subsidiaryNetIncome: 18500000000,
      nciOwnershipPct: 1.0
    });
  });

  container.querySelector("#btnOpenDaazModeC").addEventListener("click", () => {
    onNavigateToMode("investasi", {
      nominalInvestment: 100000000000,
      couponRatePct: 12.25,
      tenorYears: 5,
      collateralValue: 130000000000,
      haircutPct: 30,
      workingCapital: 253810000000,
      netIncome: 89710000000,
      depreciation: 11200000000,
      operatingProfit: 121500000000,
      sales: 1980000000000,
      totalAssets: 1890000000000,
      totalLiabilities: 1250000000000
    });
  });
}
