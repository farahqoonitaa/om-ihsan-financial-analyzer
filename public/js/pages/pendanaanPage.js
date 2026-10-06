/**
 * Mode A: Pendanaan Page Component (Input & Result Views)
 */

import { formatRupiah, formatPercent, formatRatio, validatePositiveNumber } from "../logic/formatters.js";
import { calculatePendanaan } from "../logic/pendanaanLogic.js";

export function renderPendanaanInput(container, onCalculate, onBackToMenu, initialData = null) {
  container.innerHTML = `
    <div class="page-content animate-fade-in">
      <div class="form-header-box">
        <div>
          <h2>Mode A: Input Kalkulasi Pendanaan</h2>
          <p style="color:var(--ink-secondary); font-size:13px; margin-top:2px;">
            Masukkan parameter fasilitas pembiayaan dan data keuangan entitas untuk menguji kapasitas debt service dan kepatuhan POJK.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button id="btnFillSample" class="btn btn-secondary btn-sm">⚡ Isi Contoh Data (PT EPS)</button>
          <button id="btnBackMenu" class="btn btn-secondary btn-sm">← Menu Utama</button>
        </div>
      </div>

      <div class="card" style="max-width:850px; margin:0 auto;">
        <form id="pendanaanForm">
          <div class="form-section-title">1. Parameter Fasilitas Pembiayaan</div>
          <div class="form-grid">
            <div class="form-group">
              <label for="principal">Plafon Pokok Pinjaman (Rp) *</label>
              <input type="number" id="principal" name="principal" placeholder="Contoh: 100000000000" required>
              <small class="form-hint">Nominal pokok kredit yang diajukan (dalam Rupiah penuh).</small>
              <div class="form-error" id="err_principal"></div>
            </div>

            <div class="form-group">
              <label for="annualRatePercent">Suku Bunga Efektif per Tahun (%) *</label>
              <input type="number" step="0.01" id="annualRatePercent" name="annualRatePercent" placeholder="Contoh: 8.75" required>
              <small class="form-hint">Tingkat suku bunga tahunan (contoh: 8.75 untuk 8,75%).</small>
              <div class="form-error" id="err_annualRatePercent"></div>
            </div>

            <div class="form-group">
              <label for="tenorYears">Tenor Fasilitas (Tahun) *</label>
              <input type="number" id="tenorYears" name="tenorYears" placeholder="Contoh: 5" min="1" max="30" required>
              <small class="form-hint">Jangka waktu pinjaman dalam tahun.</small>
              <div class="form-error" id="err_tenorYears"></div>
            </div>

            <div class="form-group">
              <label for="amortizationType">Skema Jadwal Amortisasi *</label>
              <select id="amortizationType" name="amortizationType">
                <option value="equal_principal">Pokok Tetap per Tahun (Equal Principal)</option>
                <option value="annuity">Anuitas Tetap (Annuity)</option>
                <option value="bullet">Bullet (Pelunasan Pokok di Akhir Tenor)</option>
              </select>
              <small class="form-hint">Metode cicilan pokok dan perhitungan beban bunga.</small>
            </div>
          </div>

          <div class="form-section-title" style="margin-top:20px;">2. Kapasitas Keuangan & Debt Service Pemohon</div>
          <div class="form-grid">
            <div class="form-group">
              <label for="annualEbit">EBIT Tahunan (Rp) *</label>
              <input type="number" id="annualEbit" name="annualEbit" placeholder="Contoh: 25000000000" required>
              <small class="form-hint">Laba sebelum bunga dan pajak untuk Interest Coverage Ratio.</small>
              <div class="form-error" id="err_annualEbit"></div>
            </div>

            <div class="form-group">
              <label for="annualEbitda">EBITDA Tahunan (Rp) *</label>
              <input type="number" id="annualEbitda" name="annualEbitda" placeholder="Contoh: 32000000000" required>
              <small class="form-hint">Arus kas operasi sebelum depresiasi untuk DSCR.</small>
              <div class="form-error" id="err_annualEbitda"></div>
            </div>

            <div class="form-group">
              <label for="annualTax">Beban Pajak Penghasilan Tahunan (Rp)</label>
              <input type="number" id="annualTax" name="annualTax" placeholder="Contoh: 5000000000">
              <small class="form-hint">Estimasi pajak tunai tahun berjalan.</small>
            </div>

            <div class="form-group">
              <label for="existingEquity">Total Ekuitas Eksisting (Rp) *</label>
              <input type="number" id="existingEquity" name="existingEquity" placeholder="Contoh: 75000000000" required>
              <small class="form-hint">Ekuitas pemohon untuk menghitung leverage DER.</small>
              <div class="form-error" id="err_existingEquity"></div>
            </div>

            <div class="form-group">
              <label for="existingLiabilities">Total Liabilitas Eksisting (Rp)</label>
              <input type="number" id="existingLiabilities" name="existingLiabilities" placeholder="Contoh: 90000000000">
              <small class="form-hint">Kewajiban berjalan sebelum penambahan utang baru.</small>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:28px; border-top:1px solid var(--line); padding-top:18px;">
            <button type="button" id="btnCancelForm" class="btn btn-secondary">Batal</button>
            <button type="submit" class="btn btn-primary" style="padding:10px 24px;">🚀 Hitung Analisis Pendanaan</button>
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

  // Sample filler
  container.querySelector("#btnFillSample").addEventListener("click", () => {
    container.querySelector("#principal").value = "50000000000"; // 50 Miliar
    container.querySelector("#annualRatePercent").value = "8.50";
    container.querySelector("#tenorYears").value = "5";
    container.querySelector("#amortizationType").value = "equal_principal";
    container.querySelector("#annualEbit").value = "15000000000"; // 15 Miliar
    container.querySelector("#annualEbitda").value = "19000000000"; // 19 Miliar
    container.querySelector("#annualTax").value = "3000000000"; // 3 Miliar
    container.querySelector("#existingEquity").value = "35000000000"; // 35 Miliar
    container.querySelector("#existingLiabilities").value = "45000000000"; // 45 Miliar
  });

  container.querySelector("#btnBackMenu").addEventListener("click", onBackToMenu);
  container.querySelector("#btnCancelForm").addEventListener("click", onBackToMenu);

  // Form submission & validation
  container.querySelector("#pendanaanForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;

    // Clear errors
    container.querySelectorAll(".form-error").forEach(el => el.innerText = "");

    const fields = [
      { id: "principal", label: "Pokok Pinjaman" },
      { id: "annualRatePercent", label: "Suku Bunga" },
      { id: "tenorYears", label: "Tenor" },
      { id: "annualEbit", label: "EBIT" },
      { id: "annualEbitda", label: "EBITDA" },
      { id: "existingEquity", label: "Total Ekuitas" }
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

    rawInputs.amortizationType = container.querySelector("#amortizationType").value;
    rawInputs.annualTax = container.querySelector("#annualTax").value || "0";
    rawInputs.existingLiabilities = container.querySelector("#existingLiabilities").value || "0";

    if (!hasError) {
      const result = calculatePendanaan(rawInputs);
      onCalculate(rawInputs, result);
    }
  });
}

export function renderPendanaanResult(container, rawInputs, result, onRecalculate, onBackToMenu) {
  const s = result.summary;

  container.innerHTML = `
    <div class="page-content animate-fade-in">
      <div class="form-header-box">
        <div>
          <h2>Mode A: Hasil Analisis Pendanaan & Debt Service</h2>
          <p style="color:var(--ink-secondary); font-size:13px;">
            Plafon: ${formatRupiah(s.principal)} | Suku Bunga: ${s.rateAnnualPercent}% | Tenor: ${s.tenor} Tahun (${s.amortTypeLabel})
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
            <span class="card-title">Angsuran Pokok + Bunga (Th. 1)</span>
            <span class="badge badge-blue">Tahun Pertama</span>
          </div>
          <div class="kpi-big">${formatRupiah(s.annualDebtServiceYr1)}</div>
          <p class="kpi-sub">Estimasi per bulan: ${formatRupiah(s.monthlyInstallmentYr1)}</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Interest Coverage Ratio (ICR)</span>
            <span class="badge ${s.icrStatus.badge || "badge-blue"}">${s.icrStatus.text || "-"}</span>
          </div>
          <div class="kpi-big">${s.icr ? formatRatio(s.icr) : "-"}</div>
          <p class="kpi-sub">Kebutuhan Covenant Institusional: Minimum 3.0x</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Debt Service Coverage (DSCR)</span>
            <span class="badge ${s.dscrStatus.badge || "badge-blue"}">${s.dscrStatus.text || "-"}</span>
          </div>
          <div class="kpi-big">${s.dscr ? formatRatio(s.dscr) : "-"}</div>
          <p class="kpi-sub">Kebutuhan Ketahanan Kas: Minimum 1.30x</p>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Proyeksi DER Pasca-Pinjaman</span>
            <span class="badge ${s.derStatus.badge || "badge-blue"}">${s.derStatus.text || "-"}</span>
          </div>
          <div class="kpi-big">${s.projectedDer ? formatRatio(s.projectedDer) : "-"}</div>
          <p class="kpi-sub">Plafon Regulasi POJK Maksimum: 5.0x</p>
        </div>
      </div>

      <!-- Detail Step-by-Step Breakdown -->
      <div class="card" style="margin-bottom:20px;">
        <h3 style="margin-bottom:12px;">Rincian Komponen Pembiayaan & Beban Kas</h3>
        <div class="step-metrics-grid">
          <div class="step-metric-item">
            <span>Total Beban Bunga Tenor:</span>
            <strong>${formatRupiah(s.totalInterest)}</strong>
          </div>
          <div class="step-metric-item">
            <span>Total Pengembalian (Pokok + Bunga):</span>
            <strong>${formatRupiah(s.totalPayments)}</strong>
          </div>
          <div class="step-metric-item">
            <span>Beban Pembayaran thd EBITDA:</span>
            <strong>${s.cashBurdenPercent ? formatPercent(s.cashBurdenPercent) : "-"}</strong>
          </div>
          <div class="step-metric-item">
            <span>Tingkat Kepatuhan Covenants:</span>
            <strong>${s.icr && s.icr >= 3.0 && s.dscr && s.dscr >= 1.30 ? "MEMENUHI PERSYARATAN" : "PERLU PERHATIAN KHUSUS"}</strong>
          </div>
        </div>
      </div>

      <!-- Amortization Schedule Table -->
      <div class="card">
        <h3 style="margin-bottom:12px;">Jadwal Amortisasi Pinjaman (Tahun ke Tahun)</h3>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tahun Ke-</th>
                <th>Saldo Awal Pokok</th>
                <th>Angsuran Pokok</th>
                <th>Beban Bunga</th>
                <th>Total Pembayaran (Debt Service)</th>
                <th>Saldo Akhir Pokok</th>
              </tr>
            </thead>
            <tbody>
              ${result.schedule.map(row => `
                <tr>
                  <td class="num" style="font-weight:600;">Tahun ${row.year}</td>
                  <td class="num">${formatRupiah(row.beginningBalance)}</td>
                  <td class="num" style="color:var(--forest); font-weight:600;">${formatRupiah(row.principalPayment)}</td>
                  <td class="num" style="color:var(--orange);">${formatRupiah(row.interestPayment)}</td>
                  <td class="num" style="font-weight:600;">${formatRupiah(row.totalPayment)}</td>
                  <td class="num">${formatRupiah(row.endingBalance)}</td>
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
