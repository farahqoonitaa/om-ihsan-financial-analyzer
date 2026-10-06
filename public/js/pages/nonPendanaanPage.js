/**
 * Mode B: Non-Pendanaan Page Component (Input & Result Views)
 */

import { formatRupiah, formatPercent, formatRatio, validatePositiveNumber } from "../logic/formatters.js";
import { calculateNonPendanaan } from "../logic/nonPendanaanLogic.js";

export function renderNonPendanaanInput(container, onCalculate, onBackToMenu, initialData = null) {
  container.innerHTML = `
    <div class="page-content animate-fade-in">
      <div class="form-header-box">
        <div>
          <h2>Mode B: Input Kalkulasi Non-Pendanaan (Operasional & Modal Kerja)</h2>
          <p style="color:var(--ink-secondary); font-size:13px; margin-top:2px;">
            Evaluasi likuiditas modal kerja, ketercapaian target RKAP (RTC), dan disparitas pertumbuhan beban usaha (Growth Gap S7).
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="btnFillSampleNon" class="btn btn-secondary btn-sm">⚡ Isi Contoh Data (PT POJ)</button>
          <button id="btnBackMenu" class="btn btn-secondary btn-sm">← Menu Utama</button>
        </div>
      </div>

      <div class="card" style="max-width:850px; margin:0 auto;">
        <form id="nonPendanaanForm">
          <div class="form-section-title">1. Kinerja Pendapatan & Beban Usaha</div>
          <div class="form-grid">
            <div class="form-group">
              <label for="revenueCY">Pendapatan Berjalan CY (Rp) *</label>
              <input type="number" id="revenueCY" name="revenueCY" placeholder="Contoh: 1512000000000" required>
              <small class="form-hint">Realisasi omzet periode berjalan.</small>
              <div class="form-error" id="err_revenueCY"></div>
            </div>

            <div class="form-group">
              <label for="revenuePY">Pendapatan Pembanding PY (Rp) *</label>
              <input type="number" id="revenuePY" name="revenuePY" placeholder="Contoh: 1062000000000" required>
              <small class="form-hint">Realisasi omzet periode pembanding tahun lalu.</small>
              <div class="form-error" id="err_revenuePY"></div>
            </div>

            <div class="form-group">
              <label for="rkapRevenue">Target RKAP Pendapatan (Rp)</label>
              <input type="number" id="rkapRevenue" name="rkapRevenue" placeholder="Contoh: 1450000000000">
              <small class="form-hint">Target anggaran pendapatan untuk perhitungan RTC.</small>
            </div>

            <div class="form-group">
              <label for="cogsCY">Beban Pokok Pendapatan COGS (Rp)</label>
              <input type="number" id="cogsCY" name="cogsCY" placeholder="Contoh: 1250000000000">
              <small class="form-hint">Beban langsung operasional.</small>
            </div>

            <div class="form-group">
              <label for="opexCY">Beban Usaha / Opex CY (Rp) *</label>
              <input type="number" id="opexCY" name="opexCY" placeholder="Contoh: 149600000000" required>
              <small class="form-hint">Total beban operasional periode berjalan.</small>
              <div class="form-error" id="err_opexCY"></div>
            </div>

            <div class="form-group">
              <label for="opexPY">Beban Usaha / Opex PY (Rp) *</label>
              <input type="number" id="opexPY" name="opexPY" placeholder="Contoh: 105000000000" required>
              <small class="form-hint">Total beban operasional tahun sebelumnya.</small>
              <div class="form-error" id="err_opexPY"></div>
            </div>
          </div>

          <div class="form-section-title" style="margin-top:20px;">2. Profitabilitas, Likuiditas & Piutang</div>
          <div class="form-grid">
            <div class="form-group">
              <label for="netProfitCY">Laba Bersih CY (Rp) *</label>
              <input type="number" id="netProfitCY" name="netProfitCY" placeholder="Contoh: 87650000000" required>
              <small class="form-hint">Laba bersih tahun berjalan.</small>
              <div class="form-error" id="err_netProfitCY"></div>
            </div>

            <div class="form-group">
              <label for="netProfitPY">Laba Bersih PY (Rp) *</label>
              <input type="number" id="netProfitPY" name="netProfitPY" placeholder="Contoh: 60510000000" required>
              <small class="form-hint">Laba bersih tahun sebelumnya.</small>
              <div class="form-error" id="err_netProfitPY"></div>
            </div>

            <div class="form-group">
              <label for="rkapNetProfit">Target RKAP Laba Bersih (Rp)</label>
              <input type="number" id="rkapNetProfit" name="rkapNetProfit" placeholder="Contoh: 80000000000">
              <small class="form-hint">Target anggaran laba bersih untuk RTC.</small>
            </div>

            <div class="form-group">
              <label for="currentAssets">Total Aset Lancar (Rp) *</label>
              <input type="number" id="currentAssets" name="currentAssets" placeholder="Contoh: 370550000000" required>
              <small class="form-hint">Kas, piutang, dan aset likuid jangka pendek.</small>
              <div class="form-error" id="err_currentAssets"></div>
            </div>

            <div class="form-group">
              <label for="currentLiabilities">Total Liabilitas Lancar (Rp) *</label>
              <input type="number" id="currentLiabilities" name="currentLiabilities" placeholder="Contoh: 717730000000" required>
              <small class="form-hint">Kewajiban jangka pendek jatuh tempo < 12 bulan.</small>
              <div class="form-error" id="err_currentLiabilities"></div>
            </div>

            <div class="form-group">
              <label for="tradeReceivables">Piutang Usaha Aktual (Rp)</label>
              <input type="number" id="tradeReceivables" name="tradeReceivables" placeholder="Contoh: 91180000000">
              <small class="form-hint">Saldo piutang pihak ketiga akhir periode.</small>
            </div>

            <div class="form-group">
              <label for="rkapReceivables">Target RKAP Piutang Usaha (Rp)</label>
              <input type="number" id="rkapReceivables" name="rkapReceivables" placeholder="Contoh: 30270000000">
              <small class="form-hint">Batas anggaran piutang untuk mendeteksi lonjakan RTC.</small>
            </div>

            <div class="form-group">
              <label for="dividendPayable">Utang Dividen Tercatat (Rp)</label>
              <input type="number" id="dividendPayable" name="dividendPayable" placeholder="Contoh: 110270000000">
              <small class="form-hint">Dividen yang telah diumumkan namun belum dibayarkan.</small>
            </div>

            <div class="form-group">
              <label for="nciPercent">Porsi Hak Non-Pengendali / NCI (%)</label>
              <input type="number" step="0.01" id="nciPercent" name="nciPercent" placeholder="Contoh: 1.00">
              <small class="form-hint">Persentase kepemilikan minoritas (contoh YKPP: 1%).</small>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:28px; border-top:1px solid var(--line); padding-top:18px;">
            <button type="button" id="btnCancelForm" class="btn btn-secondary">Batal</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 24px;">🚀 Hitung Analisis Non-Pendanaan</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Pre-fill if returning
  if (initialData) {
    for (const [k, v] of Object.entries(initialData)) {
      const el = container.querySelector(`#${k}`);
      if (el) el.value = v;
    }
  }

  // Sample filler (PT POJ case)
  container.querySelector("#btnFillSampleNon").addEventListener("click", () => {
    container.querySelector("#revenueCY").value = "1512000000000"; // 1.512 Triliun
    container.querySelector("#revenuePY").value = "1062000000000"; // 1.062 Triliun
    container.querySelector("#rkapRevenue").value = "1450000000000";
    container.querySelector("#cogsCY").value = "1250000000000";
    container.querySelector("#opexCY").value = "149600000000";
    container.querySelector("#opexPY").value = "105000000000";
    container.querySelector("#netProfitCY").value = "87650000000"; // 87.65 Miliar
    container.querySelector("#netProfitPY").value = "60510000000"; // 60.51 Miliar
    container.querySelector("#rkapNetProfit").value = "80000000000";
    container.querySelector("#currentAssets").value = "370550000000"; // 370.55 Miliar
    container.querySelector("#currentLiabilities").value = "717730000000"; // 717.73 Miliar
    container.querySelector("#tradeReceivables").value = "91180000000"; // 91.18 Miliar
    container.querySelector("#rkapReceivables").value = "30270000000"; // 30.27 Miliar (301% RTC!)
    container.querySelector("#dividendPayable").value = "110270000000"; // 110.27 Miliar
    container.querySelector("#nciPercent").value = "1.00";
  });

  container.querySelector("#btnBackMenu").addEventListener("click", onBackToMenu);
  container.querySelector("#btnCancelForm").addEventListener("click", onBackToMenu);

  container.querySelector("#nonPendanaanForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;

    container.querySelectorAll(".form-error").forEach(el => el.innerText = "");

    const requiredFields = [
      { id: "revenueCY", label: "Pendapatan CY" },
      { id: "revenuePY", label: "Pendapatan PY" },
      { id: "opexCY", label: "Beban Usaha CY" },
      { id: "opexPY", label: "Beban Usaha PY" },
      { id: "netProfitCY", label: "Laba Bersih CY" },
      { id: "netProfitPY", label: "Laba Bersih PY" },
      { id: "currentAssets", label: "Aset Lancar" },
      { id: "currentLiabilities", label: "Liabilitas Lancar" }
    ];

    const rawInputs = {};
    requiredFields.forEach(f => {
      const val = container.querySelector(`#${f.id}`).value;
      rawInputs[f.id] = val;
      const err = validatePositiveNumber(val, f.label);
      if (err) {
        hasError = true;
        const errEl = container.querySelector(`#err_${f.id}`);
        if (errEl) errEl.innerText = err;
      }
    });

    rawInputs.rkapRevenue = container.querySelector("#rkapRevenue").value || "0";
    rawInputs.cogsCY = container.querySelector("#cogsCY").value || "0";
    rawInputs.rkapNetProfit = container.querySelector("#rkapNetProfit").value || "0";
    rawInputs.tradeReceivables = container.querySelector("#tradeReceivables").value || "0";
    rawInputs.rkapReceivables = container.querySelector("#rkapReceivables").value || "0";
    rawInputs.dividendPayable = container.querySelector("#dividendPayable").value || "0";
    rawInputs.nciPercent = container.querySelector("#nciPercent").value || "0";

    if (!hasError) {
      const result = calculateNonPendanaan(rawInputs);
      onCalculate(rawInputs, result);
    }
  });
}

export function renderNonPendanaanResult(container, rawInputs, result, onRecalculate, onBackToMenu) {
  const s = result.summary;

  container.innerHTML = `
    <div class="page-content animate-fade-in">
      <div class="form-header-box">
        <div>
          <h2>Mode B: Hasil Analisis Operasional & Modal Kerja</h2>
          <p style="color:var(--ink-secondary); font-size:13px;">
            Pendapatan: ${formatRupiah(s.revCY)} (+${s.revGrowthYoY.toFixed(2)}% YoY) | Status Tiering: <strong style="color:${s.overallTier === "Merah" ? "var(--red)" : "var(--green)"};">${s.overallTier.toUpperCase()}</strong>
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="btnRecalc" class="btn btn-secondary btn-sm">✏️ Ubah Parameter / Hitung Ulang</button>
          <button id="btnBackMenu" class="btn btn-secondary btn-sm">← Menu Utama</button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Net Working Capital (NWC)</span>
            <span class="badge ${s.nwc < 0 ? "badge-red" : "badge-green"}">${s.nwc < 0 ? "Defisit Modal Kerja" : "Surplus"}</span>
          </div>
          <div class="kpi-big">${formatRupiah(s.nwc)}</div>
          <p class="kpi-sub">Current Ratio: ${s.currentRatio ? formatRatio(s.currentRatio) : "-"} (Batas Normal: Min 1.25x)</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Realisasi Piutang vs RKAP (RTC)</span>
            <span class="badge ${s.rtcReceivables && s.rtcReceivables > 120 ? "badge-red" : "badge-green"}">${s.rtcReceivables ? formatPercent(s.rtcReceivables) : "-"}</span>
          </div>
          <div class="kpi-big">${s.rtcReceivables ? formatPercent(s.rtcReceivables) : "-"}</div>
          <p class="kpi-sub">${s.rtcReceivables && s.rtcReceivables > 120 ? "⚠️ Lonjakan Ekstrem > 120% Target RKAP!" : "Dalam batas toleransi anggaran"}</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Growth Gap (Sinyal Forensik S7)</span>
            <span class="badge ${s.growthGap > 0 ? "badge-yellow" : "badge-green"}">${s.growthGap > 0 ? "Opex Outpacing" : "Sehat"}</span>
          </div>
          <div class="kpi-big">${s.growthGap > 0 ? "+" + s.growthGap.toFixed(2) + " pp" : s.growthGap.toFixed(2) + " pp"}</div>
          <p class="kpi-sub">Kenaikan Opex (+${s.opexGrowthYoY.toFixed(1)}%) vs Omzet (+${s.revGrowthYoY.toFixed(1)}%)</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Hak Minoritas NCI / Dividen</span>
            <span class="badge badge-blue">IFRS 10</span>
          </div>
          <div class="kpi-big">${formatRupiah(s.nciShareIncome)}</div>
          <p class="kpi-sub">Bagian Laba Induk: ${formatRupiah(s.parentShareIncome)} | Utang Dividen: ${formatRupiah(s.divPayable)}</p>
        </div>
      </div>

      <!-- Findings List -->
      <div class="card" style="margin-bottom:20px;">
        <h3 style="margin-bottom:12px;">Daftar Temuan Forensik & Rekomendasi Verifikator</h3>
        <div class="findings-list">
          ${result.findings.map(f => `
            <div class="finding-card ${f.tier === "Merah" ? "critical" : "moderate"}">
              <div class="finding-header">
                <span class="finding-title">${f.area}</span>
                <span class="badge ${f.tier === "Merah" ? "badge-red" : "badge-yellow"}">${f.tier}</span>
              </div>
              <p style="font-size:13px; margin:4px 0 8px 0;">${f.text}</p>
              <div style="background:var(--forest-soft); padding:8px 12px; border-radius:4px; font-size:12px;">
                <strong>Rekomendasi Governance:</strong> ${f.recommendation}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Performance & Margin Breakdown Table -->
      <div class="card">
        <h3 style="margin-bottom:12px;">Breakdown Marjin & Realisasi Target RKAP (RTC)</h3>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Indikator Kinerja</th>
                <th>Realisasi Berjalan</th>
                <th>Marjin / Rasio</th>
                <th>Target RKAP</th>
                <th>RTC (%)</th>
                <th>Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Pendapatan Usaha (Revenue)</strong></td>
                <td class="num">${formatRupiah(s.revCY)}</td>
                <td class="num">100.00%</td>
                <td class="num">${rawInputs.rkapRevenue > 0 ? formatRupiah(rawInputs.rkapRevenue) : "-"}</td>
                <td class="num">${s.rtcRevenue ? formatPercent(s.rtcRevenue) : "-"}</td>
                <td><span class="badge ${s.rtcRevenue && s.rtcRevenue >= 95 ? "badge-green" : "badge-yellow"}">${s.rtcRevenue && s.rtcRevenue >= 95 ? "Tercapai" : "Perhatian"}</span></td>
              </tr>
              <tr>
                <td><strong>Laba Bersih Tahun Berjalan</strong></td>
                <td class="num">${formatRupiah(s.npCY)}</td>
                <td class="num">${formatPercent(s.netMargin)}</td>
                <td class="num">${rawInputs.rkapNetProfit > 0 ? formatRupiah(rawInputs.rkapNetProfit) : "-"}</td>
                <td class="num">${s.rtcNetProfit ? formatPercent(s.rtcNetProfit) : "-"}</td>
                <td><span class="badge ${s.rtcNetProfit && s.rtcNetProfit >= 95 ? "badge-green" : "badge-yellow"}">${s.rtcNetProfit && s.rtcNetProfit >= 95 ? "Tercapai" : "Perhatian"}</span></td>
              </tr>
              <tr>
                <td><strong>Piutang Usaha Akhir Periode</strong></td>
                <td class="num">${formatRupiah(rawInputs.tradeReceivables)}</td>
                <td class="num">${s.revCY > 0 ? formatPercent((rawInputs.tradeReceivables / s.revCY) * 100) : "-"}</td>
                <td class="num">${rawInputs.rkapReceivables > 0 ? formatRupiah(rawInputs.rkapReceivables) : "-"}</td>
                <td class="num">${s.rtcReceivables ? formatPercent(s.rtcReceivables) : "-"}</td>
                <td><span class="badge ${s.rtcReceivables && s.rtcReceivables > 120 ? "badge-red" : "badge-green"}">${s.rtcReceivables && s.rtcReceivables > 120 ? "Lonjakan Kritis" : "Terkendali"}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; margin-top:24px;">
        <button id="btnBottomBack" class="btn btn-secondary">← Kembali ke Menu Utama</button>
        <button id="btnBottomRecalc" class="btn btn-primary">✏️ Hitung Ulang Parameter</button>
      </div>
    </div>
  `;

  container.querySelector("#btnRecalc").addEventListener("click", () => onRecalculate(rawInputs));
  container.querySelector("#btnBottomRecalc").addEventListener("click", () => onRecalculate(rawInputs));
  container.querySelector("#btnBackMenu").addEventListener("click", onBackToMenu);
  container.querySelector("#btnBottomBack").addEventListener("click", onBackToMenu);
}
