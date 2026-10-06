/**
 * Mode C: Skema Investasi Page Component (Input & Result Views)
 */

import { formatRupiah, formatPercent, formatRatio, validatePositiveNumber } from "../logic/formatters.js";
import { calculateInvestasi } from "../logic/investasiLogic.js";

export function renderInvestasiInput(container, onCalculate, onBackToMenu, initialData = null) {
  container.innerHTML = `
    <div class="page-content animate-fade-in">
      <div class="form-header-box">
        <div>
          <h2>Mode C: Input Skema Investasi & Obligasi</h2>
          <p style="color:var(--ink-secondary); font-size:13px; margin-top:2px;">
            Perhitungan imbal hasil kupon, pengujian risiko gagal bayar (Modified Z-Score Anualisasi hlm. 15), dan simulasi Stress Loss Agunan.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="btnFillSampleDaaz" class="btn btn-secondary btn-sm">⚡ Contoh PT Daaz (Z=2.54)</button>
          <button id="btnFillSamplePegadaian" class="btn btn-secondary btn-sm">⚡ Contoh PT Pegadaian (Overlay)</button>
          <button id="btnBackMenu" class="btn btn-secondary btn-sm">← Menu Utama</button>
        </div>
      </div>

      <div class="card" style="max-width:880px; margin:0 auto;">
        <form id="investasiForm">
          <div class="form-section-title">1. Parameter Instrumen Investasi / Obligasi</div>
          <div class="form-grid">
            <div class="form-group">
              <label for="investmentAmount">Nilai Pokok Portofolio / Sukuk (Rp) *</label>
              <input type="number" id="investmentAmount" name="investmentAmount" placeholder="Contoh: 100000000000" required>
              <small class="form-hint">Nominal penempatan investasi YKPP.</small>
              <div class="form-error" id="err_investmentAmount"></div>
            </div>

            <div class="form-group">
              <label for="couponRatePercent">Kupon / Imbal Hasil Tahunan (%) *</label>
              <input type="number" step="0.01" id="couponRatePercent" name="couponRatePercent" placeholder="Contoh: 7.75" required>
              <small class="form-hint">Tingkat kupon per tahun.</small>
              <div class="form-error" id="err_couponRatePercent"></div>
            </div>

            <div class="form-group">
              <label for="tenorYears">Tenor / Jatuh Tempo (Tahun) *</label>
              <input type="number" id="tenorYears" name="tenorYears" placeholder="Contoh: 3" min="1" max="30" required>
              <small class="form-hint">Jangka waktu jatuh tempo obligasi.</small>
              <div class="form-error" id="err_tenorYears"></div>
            </div>

            <div class="form-group">
              <label for="isSemiAnnual">Periode Laporan Keuangan Emiten *</label>
              <select id="isSemiAnnual" name="isSemiAnnual">
                <option value="true">Interim Semester I (Terapkan Pengali Anualisasi x2)</option>
                <option value="false">Audit Tahunan Penuh (Tanpa Pengali x2)</option>
              </select>
              <small class="form-hint">Wajib x2 untuk laporan semester I sesuai formula Kajian Ihsan.</small>
            </div>
          </div>

          <div class="form-section-title" style="margin-top:20px;">2. Pos Neraca & Laba Rugi Emiten (Untuk Model Modified Z-Score)</div>
          <div class="form-grid">
            <div class="form-group">
              <label for="totalAssets">Total Aset Emiten (Rp) *</label>
              <input type="number" id="totalAssets" name="totalAssets" placeholder="Contoh: 6616224661283" required>
              <div class="form-error" id="err_totalAssets"></div>
            </div>

            <div class="form-group">
              <label for="totalLiabilities">Total Liabilitas Emiten (Rp) *</label>
              <input type="number" id="totalLiabilities" name="totalLiabilities" placeholder="Contoh: 4378915557304" required>
              <div class="form-error" id="err_totalLiabilities"></div>
            </div>

            <div class="form-group">
              <label for="totalEquity">Total Ekuitas Emiten (Rp) *</label>
              <input type="number" id="totalEquity" name="totalEquity" placeholder="Contoh: 2237309103979" required>
              <div class="form-error" id="err_totalEquity"></div>
            </div>

            <div class="form-group">
              <label for="currentAssets">Total Aset Lancar (Rp) *</label>
              <input type="number" id="currentAssets" name="currentAssets" placeholder="Contoh: 3809837654928" required>
              <div class="form-error" id="err_currentAssets"></div>
            </div>

            <div class="form-group">
              <label for="currentLiabilities">Liabilitas Jangka Pendek (Rp) *</label>
              <input type="number" id="currentLiabilities" name="currentLiabilities" placeholder="Contoh: 2426953861957" required>
              <div class="form-error" id="err_currentLiabilities"></div>
            </div>

            <div class="form-group">
              <label for="revenue">Pendapatan / Penjualan (Rp) *</label>
              <input type="number" id="revenue" name="revenue" placeholder="Contoh: 6908103651164" required>
              <div class="form-error" id="err_revenue"></div>
            </div>

            <div class="form-group">
              <label for="operatingProfit">Laba Operasional (Rp) *</label>
              <input type="number" id="operatingProfit" name="operatingProfit" placeholder="Contoh: 323165773107" required>
              <div class="form-error" id="err_operatingProfit"></div>
            </div>

            <div class="form-group">
              <label for="netProfit">Laba Bersih (Rp) *</label>
              <input type="number" id="netProfit" name="netProfit" placeholder="Contoh: 137448447134" required>
              <div class="form-error" id="err_netProfit"></div>
            </div>

            <div class="form-group">
              <label for="depreciation">Penyusutan / Depresiasi (Rp)</label>
              <input type="number" id="depreciation" name="depreciation" placeholder="Contoh: 80097531868">
              <small class="form-hint">Digunakan dalam komponen CASHPROF_TA.</small>
            </div>
          </div>

          <div class="form-section-title" style="margin-top:20px;">3. Skenario Risk Overlay & Stress Loss Agunan (Opsional)</div>
          <div class="form-grid">
            <div class="form-group">
              <label for="collateralExposure">Exposure Agunan Memerlukan Realisasi (Rp)</label>
              <input type="number" id="collateralExposure" name="collateralExposure" placeholder="Contoh: 20000000000000">
              <small class="form-hint">Total exposure jaminan yang dalam proses eksekusi.</small>
            </div>

            <div class="form-group">
              <label for="stressLoss">Asumsi Potensi Stress Loss (Rp)</label>
              <input type="number" id="stressLoss" name="stressLoss" placeholder="Contoh: 2000000000000">
              <small class="form-hint">Estimasi haircut / kerugian lelang jaminan.</small>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:28px; border-top:1px solid var(--line); padding-top:18px;">
            <button type="button" id="btnCancelForm" class="btn btn-secondary">Batal</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 24px;">🚀 Hitung Analisis Skema Investasi</button>
          </div>
        </form>
      </div>
    </div>
  `;

  if (initialData) {
    for (const [k, v] of Object.entries(initialData)) {
      const el = container.querySelector(`#${k}`);
      if (el) el.value = v;
    }
  }

  // Pre-fill Daaz
  container.querySelector("#btnFillSampleDaaz").addEventListener("click", () => {
    container.querySelector("#investmentAmount").value = "50000000000"; // 50 Miliar
    container.querySelector("#couponRatePercent").value = "7.50";
    container.querySelector("#tenorYears").value = "3";
    container.querySelector("#isSemiAnnual").value = "true";
    container.querySelector("#totalAssets").value = "6616224661283";
    container.querySelector("#totalLiabilities").value = "4378915557304";
    container.querySelector("#totalEquity").value = "2237309103979";
    container.querySelector("#currentAssets").value = "3809837654928";
    container.querySelector("#currentLiabilities").value = "2426953861957";
    container.querySelector("#revenue").value = "6908103651164";
    container.querySelector("#operatingProfit").value = "323165773107";
    container.querySelector("#netProfit").value = "137448447134";
    container.querySelector("#depreciation").value = "80097531868";
    container.querySelector("#collateralExposure").value = "0";
    container.querySelector("#stressLoss").value = "0";
  });

  // Pre-fill Pegadaian
  container.querySelector("#btnFillSamplePegadaian").addEventListener("click", () => {
    container.querySelector("#investmentAmount").value = "100000000000"; // 100 Miliar
    container.querySelector("#couponRatePercent").value = "6.85";
    container.querySelector("#tenorYears").value = "3";
    container.querySelector("#isSemiAnnual").value = "true";
    container.querySelector("#totalAssets").value = "86400000000000"; // 86.4 Triliun
    container.querySelector("#totalLiabilities").value = "65980000000000";
    container.querySelector("#totalEquity").value = "20420000000000";
    container.querySelector("#currentAssets").value = "68200000000000";
    container.querySelector("#currentLiabilities").value = "50150000000000";
    container.querySelector("#revenue").value = "14500000000000";
    container.querySelector("#operatingProfit").value = "6800000000000";
    container.querySelector("#netProfit").value = "2300000000000";
    container.querySelector("#depreciation").value = "500000000000";
    container.querySelector("#collateralExposure").value = "20000000000000"; // Rp20 T
    container.querySelector("#stressLoss").value = "2000000000000"; // Rp2 T
  });

  container.querySelector("#btnBackMenu").addEventListener("click", onBackToMenu);
  container.querySelector("#btnCancelForm").addEventListener("click", onBackToMenu);

  container.querySelector("#investasiForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;

    container.querySelectorAll(".form-error").forEach(el => el.innerText = "");

    const fields = [
      { id: "investmentAmount", label: "Nilai Investasi" },
      { id: "couponRatePercent", label: "Kupon Tahunan" },
      { id: "tenorYears", label: "Tenor" },
      { id: "totalAssets", label: "Total Aset" },
      { id: "totalLiabilities", label: "Total Liabilitas" },
      { id: "totalEquity", label: "Total Ekuitas" },
      { id: "currentAssets", label: "Aset Lancar" },
      { id: "currentLiabilities", label: "Liabilitas Lancar" },
      { id: "revenue", label: "Pendapatan" },
      { id: "operatingProfit", label: "Laba Operasional" },
      { id: "netProfit", label: "Laba Bersih" }
    ];

    const rawInputs = {};
    fields.forEach(f => {
      const val = container.querySelector(`#${f.id}`).value;
      rawInputs[f.id] = val;
      const err = validatePositiveNumber(val, f.label);
      if (err) {
        hasError = true;
        const errEl = container.querySelector(`#err_${f.id}`);
        if (errEl) errEl.innerText = err;
      }
    });

    rawInputs.isSemiAnnual = container.querySelector("#isSemiAnnual").value === "true";
    rawInputs.depreciation = container.querySelector("#depreciation").value || "0";
    rawInputs.collateralExposure = container.querySelector("#collateralExposure").value || "0";
    rawInputs.stressLoss = container.querySelector("#stressLoss").value || "0";

    if (!hasError) {
      const result = calculateInvestasi(rawInputs);
      onCalculate(rawInputs, result);
    }
  });
}

export function renderInvestasiResult(container, rawInputs, result, onRecalculate, onBackToMenu) {
  const s = result.summary;
  const ro = result.riskOverlayResult;

  container.innerHTML = `
    <div class="page-content animate-fade-in">
      <div class="form-header-box">
        <div>
          <h2>Mode C: Hasil Analisis Skema Investasi & Obligasi</h2>
          <p style="color:var(--ink-secondary); font-size:13px;">
            Pokok Investasi: ${formatRupiah(s.investAmt)} | Kupon: ${s.couponRatePercent}% | Tenor: ${s.tenor} Tahun | Total Return: ${formatRupiah(s.totalReturn)}
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="btnRecalc" class="btn btn-secondary btn-sm">✏️ Ubah Parameter / Hitung Ulang</button>
          <button id="btnBackMenu" class="btn btn-secondary btn-sm">← Menu Utama</button>
        </div>
      </div>

      <!-- Scoring Cards -->
      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Modified Z-Score Anualisasi</span>
            <span class="badge ${s.modZTier === "Hijau" ? "badge-green" : (s.modZTier === "Kuning" ? "badge-yellow" : "badge-red")}">${s.modZTier}</span>
          </div>
          <div class="kpi-big">${s.modZ != null ? s.modZ.toFixed(3) : "-"}</div>
          <p class="kpi-sub">${s.modZAssessment}</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Altman Z-Score</span>
            <span class="badge ${s.altmanZTier.includes("Hijau") ? "badge-green" : "badge-yellow"}">${s.altmanZTier}</span>
          </div>
          <div class="kpi-big">${s.altmanZ != null ? s.altmanZ.toFixed(2) : "-"}</div>
          <p class="kpi-sub">Batas Safe Zone: > 2.60 | Grey Zone: 1.21 - 2.60</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Debt to Equity Ratio (DER)</span>
            <span class="badge ${s.der <= 5.0 ? "badge-green" : "badge-red"}">${s.pojkDerStatus}</span>
          </div>
          <div class="kpi-big">${s.der ? formatRatio(s.der) : "-"}</div>
          <p class="kpi-sub">Plafon POJK Maksimum: 5.0x</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Estimasi Arus Kas Kupon Tahunan</span>
            <span class="badge badge-green">Yield Kas</span>
          </div>
          <div class="kpi-big">${formatRupiah(s.annualCoupon)}</div>
          <p class="kpi-sub">Kupon Kuartalan: ${formatRupiah(s.quarterlyCoupon)} / triwulan</p>
        </div>
      </div>

      <!-- Risk Overlay Box jika ada -->
      ${ro ? `
        <div class="card" style="border-left:4px solid var(--gold); background:var(--gold-soft); margin-bottom:20px;">
          <h3 style="color:var(--forest-deep); margin-bottom:8px;">⚠️ Hasil Simulasi Risk Overlay & Stress Loss Agunan</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:10px;">
            <div><span>Total Exposure Agunan:</span><br><strong>${formatRupiah(ro.exposure)}</strong></div>
            <div><span>Asumsi Stress Loss:</span><br><strong>${formatRupiah(ro.stressLoss)}</strong></div>
            <div><span>Recovery Rate:</span><br><strong>${ro.recoveryRate}%</strong></div>
            <div><span>Loss Severity:</span><br><strong>${ro.lossSeverity}%</strong></div>
          </div>
          <p style="font-size:12.5px; line-height:1.5;">${ro.rationale}</p>
        </div>
      ` : ""}

      <!-- 5 Komponen Modified Z-Score Breakdown -->
      ${s.modZComponents ? `
        <div class="card" style="margin-bottom:20px;">
          <h3 style="margin-bottom:12px;">Dekomposisi 5 Komponen Modified Z-Score (Formula Kajian Ihsan)</h3>
          <div style="background:var(--surface-alt); padding:10px 14px; border-radius:4px; font-family:'IBM Plex Mono', monospace; font-size:12.5px; margin-bottom:14px;">
            Z = -3,337 + (0,736 × WK_TA) + (6,950 × CASHPROF_TA) + (0,864 × SOLVR) + (7,554 × OPPROF_TA) + (1,544 × SALES_TA)
          </div>
          <div class="step-metrics-grid">
            <div class="step-metric-item">
              <span>WK_TA (Modal Kerja / Aset):</span>
              <strong>${s.modZComponents.wk_ta}</strong>
            </div>
            <div class="step-metric-item">
              <span>CASHPROF_TA (Laba Kas Anualisasi / Aset):</span>
              <strong>${s.modZComponents.cashprof_ta}</strong>
            </div>
            <div class="step-metric-item">
              <span>SOLVR (Total Aset / Total Liabilitas):</span>
              <strong>${s.modZComponents.solvr}</strong>
            </div>
            <div class="step-metric-item">
              <span>OPPROF_TA (Laba Operasional Anualisasi / Aset):</span>
              <strong>${s.modZComponents.opprof_ta}</strong>
            </div>
            <div class="step-metric-item">
              <span>SALES_TA (Penjualan Anualisasi / Aset):</span>
              <strong>${s.modZComponents.sales_ta}</strong>
            </div>
            <div class="step-metric-item">
              <span>Hasil Akhir Modified Z-Score:</span>
              <strong style="color:var(--forest);">${s.modZ.toFixed(3)}</strong>
            </div>
          </div>
        </div>
      ` : ""}

      <!-- Yield Schedule Table -->
      <div class="card">
        <h3 style="margin-bottom:12px;">Jadwal Penerimaan Imbal Hasil Kupon Tenor</h3>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tahun Ke-</th>
                <th>Kupon Tahunan</th>
                <th>Kupon Kuartalan</th>
                <th>Kumulatif Kupon</th>
                <th>Total Penerimaan Kas (+ Pokok Akhir)</th>
              </tr>
            </thead>
            <tbody>
              ${result.yieldSchedule.map(row => `
                <tr>
                  <td class="num" style="font-weight:600;">Tahun ${row.year}</td>
                  <td class="num" style="color:var(--forest);">${formatRupiah(row.annualCoupon)}</td>
                  <td class="num">${formatRupiah(row.quarterlyCoupon)}</td>
                  <td class="num">${formatRupiah(row.cumulativeCoupons)}</td>
                  <td class="num" style="font-weight:600;">${formatRupiah(row.totalRedemption)}</td>
                </tr>
              `).join("")}
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
