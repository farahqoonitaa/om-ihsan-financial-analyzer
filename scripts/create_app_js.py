app_code = """/**
 * Solanascope & YKPP Financial Intelligence Platform - Client Application
 */

// Application State
const state = {
  currentRole: "reviewer", // 'reviewer' | 'configurator'
  activeTab: "agenda",
  geminiApiKey: localStorage.getItem("ykpp_gemini_key") || "",
  currentInvestasiId: "investasi-daaz",
  data: {
    pengendali: null,
    nonPengendali: null,
    investasi: null,
    konsolidasi: null,
    reconciliations: null,
    auditLogs: null,
    parameters: null
  }
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  if (state.geminiApiKey) {
    const input = document.getElementById("geminiApiKeyInput");
    if (input) input.value = state.geminiApiKey;
  }
  loadInitialData();
});

async function loadInitialData() {
  try {
    await Promise.all([
      loadPengendali(),
      loadNonPengendali(),
      loadInvestasi(state.currentInvestasiId),
      loadKonsolidasi(),
      loadReconciliations(),
      loadAuditLogs(),
      loadParameters()
    ]);
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

// Tab Switching
window.switchTab = function(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick").includes(`'${tabId}'`));
  });
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  const targetPane = document.getElementById(`pane-${tabId}`);
  if (targetPane) targetPane.classList.add("active");
};

// Role Switching (Action Item 7)
window.handleRoleChange = function(role) {
  state.currentRole = role;
  const notice = document.getElementById("paramEditNotice");
  if (notice) {
    notice.innerText = role === "configurator"
      ? "✏️ Mode Penyusun Parameter Aktif: Anda dapat mengubah batas threshold dan formula."
      : "* Mode Reviewer Aktif: Anda fokus memvalidasi temuan audit dan menandatangani Nota Dinas.";
  }
  // Re-render parameter tab if currently viewed
  if (state.activeTab === "parameter") {
    renderParameters(state.data.parameters);
  }
};

// --- DATA LOADERS & RENDERERS ---

// 1. Entitas Pengendali
async function loadPengendali() {
  try {
    const res = await fetch("/api/analyze/pengendali", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.pengendali = d;
    renderPengendali(d);
  } catch (e) {
    console.error("Error loading pengendali:", e);
  }
}

function renderPengendali(d) {
  const container = document.getElementById("pengendali-content");
  if (!container || !d) return;

  const ent = d.entity;
  const f = ent.financials;
  const h = d.horizontalAnalysis;

  container.innerHTML = `
    <!-- Top Summary Cards -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Pertumbuhan Omzet YoY</span>
          <span class="badge ${h.revenue.yoyPercent >= 0 ? "badge-green" : "badge-red"}">${h.revenue.yoyPercent}%</span>
        </div>
        <div class="kpi-big">Rp${f.revenueCY} M</div>
        <p class="kpi-sub">Pembanding 2025: Rp${f.revenuePY} M | Pertumbuhan didorong bisnis Outsourcing (+41,7%)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Kenaikan Beban Usaha (Opex)</span>
          <span class="badge badge-red">+${h.opex.yoyPercent}%</span>
        </div>
        <div class="kpi-big">Rp${f.opexCY} M</div>
        <p class="kpi-sub">⚠️ Opex (+32,91%) tumbuh melampaui pendapatan (+31,45%) = Growth Gap</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Net Working Capital (NWC)</span>
          <span class="badge badge-red">Defisit Likuiditas</span>
        </div>
        <div class="kpi-big">-Rp40,49 M</div>
        <p class="kpi-sub">Aset Lancar: Rp${f.currentAssetsCY} M vs Liabilitas Lancar: Rp${f.currentLiabCY} M (Current Ratio 0,57x)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Laba Usaha & Margin</span>
          <span class="badge badge-yellow">3,85% Marjin</span>
        </div>
        <div class="kpi-big">Rp${f.operatingProfitCY} M</div>
        <p class="kpi-sub">Marjin operasi turun dari 4,90% (Agustus 2025) menjadi 3,85% (Agustus 2026)</p>
      </div>
    </div>

    <!-- Analisis Vertikal & Horizontal Table -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:12px;">Tabel Analisis Vertikal & Horizontal (Laba Rugi PT EPS)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pos Akun</th>
              <th>Realisasi Ags 2026 (CY)</th>
              <th>Analisis Vertikal (% Omzet)</th>
              <th>Realisasi Ags 2025 (PY)</th>
              <th>YoY Nominal</th>
              <th>YoY %</th>
              <th>Target RKAP</th>
              <th>RTC (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Pendapatan Usaha</strong></td>
              <td class="num">Rp${f.revenueCY} M</td>
              <td class="num">100.00%</td>
              <td class="num">Rp${f.revenuePY} M</td>
              <td class="num">+Rp${h.revenue.yoyNominal} M</td>
              <td class="num"><span class="badge badge-green">+${h.revenue.yoyPercent}%</span></td>
              <td class="num">Rp${f.rkapTargetRevenue} M</td>
              <td class="num"><span class="badge ${h.revenue.rtcStatus ? h.revenue.rtcStatus.badge : "badge-green"}">${h.revenue.rtcPercent}%</span></td>
            </tr>
            <tr>
              <td>Beban Pokok Pendapatan</td>
              <td class="num">Rp${f.cogsCY} M</td>
              <td class="num">${((f.cogsCY/f.revenueCY)*100).toFixed(2)}%</td>
              <td class="num">Rp${f.cogsPY} M</td>
              <td class="num">+Rp${(f.cogsCY - f.cogsPY).toFixed(2)} M</td>
              <td class="num">+${(((f.cogsCY - f.cogsPY)/f.cogsPY)*100).toFixed(2)}%</td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td><strong>Laba Kotor</strong></td>
              <td class="num">Rp${f.grossProfitCY} M</td>
              <td class="num">${((f.grossProfitCY/f.revenueCY)*100).toFixed(2)}%</td>
              <td class="num">Rp${f.grossProfitPY} M</td>
              <td class="num">+Rp${(f.grossProfitCY - f.grossProfitPY).toFixed(2)} M</td>
              <td class="num">+${(((f.grossProfitCY - f.grossProfitPY)/f.grossProfitPY)*100).toFixed(2)}%</td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td>Beban Usaha / Operasional</td>
              <td class="num">Rp${f.opexCY} M</td>
              <td class="num">${((f.opexCY/f.revenueCY)*100).toFixed(2)}%</td>
              <td class="num">Rp${f.opexPY} M</td>
              <td class="num">+Rp${h.opex.yoyNominal} M</td>
              <td class="num"><span class="badge badge-red">+${h.opex.yoyPercent}%</span></td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td><strong>Laba Usaha (Operasional)</strong></td>
              <td class="num">Rp${f.operatingProfitCY} M</td>
              <td class="num">3.85%</td>
              <td class="num">Rp${f.operatingProfitPY} M</td>
              <td class="num">+Rp${(f.operatingProfitCY - f.operatingProfitPY).toFixed(2)} M</td>
              <td class="num">+3.13%</td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td><strong>Laba Bersih Tahun Berjalan</strong></td>
              <td class="num">Rp${f.netProfitCY} M</td>
              <td class="num">2.80%</td>
              <td class="num">Rp${f.netProfitPY} M</td>
              <td class="num">+Rp${h.netProfit.yoyNominal} M</td>
              <td class="num">+0.64%</td>
              <td class="num">Rp${f.rkapTargetNetProfit} M</td>
              <td class="num"><span class="badge badge-yellow">${h.netProfit.rtcPercent}%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Review Workspace: 6 Temuan Forensik -->
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3>Review Workspace: 6 Temuan Verifikasi & Sinyal Forensik (S1 - S10)</h3>
        <span style="font-size:12px; color:var(--ink-secondary);">Klik tombol status untuk mengubah keputusan review</span>
      </div>

      <div class="findings-list">
        ${ent.findings.map(fnd => `
          <div class="finding-card ${fnd.severity.toLowerCase().includes("major") ? "critical" : "moderate"}">
            <div class="finding-header">
              <span class="finding-title">${fnd.title}</span>
              <div>
                <span class="badge ${fnd.severity.toLowerCase().includes("major") ? "badge-red" : "badge-yellow"}">${fnd.severity}</span>
                <span class="badge badge-blue">${fnd.signal}</span>
              </div>
            </div>
            <div class="finding-delta">
              <strong>Quantified Delta:</strong> ${fnd.delta}
            </div>
            <p style="font-size:12.5px; color:var(--ink); margin-bottom:6px;">
              <strong>Dampak Audit:</strong> ${fnd.impact}
            </p>
            <p style="font-size:12px; color:var(--ink-secondary);">
              <strong>Dokumen / Kebutuhan Pembuktian:</strong> ${fnd.schedule}
            </p>
            <div class="finding-actions">
              <span style="font-size:11.5px; font-weight:600; color:var(--ink-muted);">Keputusan Verifikator:</span>
              <button class="btn btn-sm ${fnd.action.includes("Clarify") ? "btn-primary" : "btn-secondary"}" onclick="window.updateFindingStatus('${fnd.id}', 'Clarify')">Clarify</button>
              <button class="btn btn-sm ${fnd.action.includes("Audit Finding") ? "btn-primary" : "btn-secondary"}" onclick="window.updateFindingStatus('${fnd.id}', 'Audit Finding')">Audit Finding</button>
              <button class="btn btn-sm ${fnd.action.includes("Approved") ? "btn-primary" : "btn-secondary"}" onclick="window.updateFindingStatus('${fnd.id}', 'Approved')">Approved</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// 2. Entitas Non-Pengendali
async function loadNonPengendali() {
  try {
    const res = await fetch("/api/analyze/non-pengendali", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.nonPengendali = d;
    renderNonPengendali(d);
  } catch (e) {
    console.error("Error loading non-pengendali:", e);
  }
}

function renderNonPengendali(d) {
  const container = document.getElementById("nonpengendali-content");
  if (!container || !d) return;

  const ent = d.entity;
  const f = ent.financials;
  const t = d.tiering;

  container.innerHTML = `
    <!-- Top KPI Cards -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Piutang Pihak Ketiga vs RKAP</span>
          <span class="badge badge-red">RTC 301,20%</span>
        </div>
        <div class="kpi-big">Rp${f.tradeReceivablesCY} M</div>
        <p class="kpi-sub">Target RKAP: Rp${f.targetReceivablesRKAP} M (Lonjakan >3x lipat, mengunci arus kas modal kerja)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Utang Dividen Belum Dibayar</span>
          <span class="badge badge-red">Kewajiban Dividen</span>
        </div>
        <div class="kpi-big">Rp${f.dividendPayableCY} M</div>
        <p class="kpi-sub">Tercatat di Liabilitas Lancar; YKPP berhak atas pembagian dividen tunai proporsional</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Net Working Capital Defisit</span>
          <span class="badge badge-red">CR 0,52x</span>
        </div>
        <div class="kpi-big">-Rp347,18 M</div>
        <p class="kpi-sub">Aset Lancar: Rp${f.currentAssetsCY} M vs Liabilitas Lancar: Rp${f.currentLiabCY} M</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Arus Kas Operasi (CFO Conversion)</span>
          <span class="badge badge-green">1,50x Laba</span>
        </div>
        <div class="kpi-big">Rp${f.cfoCashFlow} M</div>
        <p class="kpi-sub">Pertumbuhan omzet +42,4% YoY (Rp1.512 M) & laba +44,8% (Rp87,65 M)</p>
      </div>
    </div>

    <!-- Matriks Tingkat Perhatian: Merah / Kuning / Hijau -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:14px;">Matriks Monitoring Pemegang Saham Minoritas (YKPP 1% Saham)</h3>
      
      <!-- KELOMPOK MERAH -->
      <div style="margin-bottom:18px;">
        <h4 style="color:var(--red); display:flex; align-items:center; gap:6px; margin-bottom:8px;">
          🔴 Tingkat Perhatian MERAH — Area Kritis & Memerlukan Klarifikasi RUPS/Direksi
        </h4>
        <div class="findings-list">
          ${t.merah.map(m => `
            <div class="finding-card critical">
              <div class="finding-header">
                <span class="finding-title">${m.title}</span>
                <span class="badge badge-red">MERAH</span>
              </div>
              <div class="finding-delta">${m.metric}</div>
              <p style="font-size:12.5px; margin-bottom:8px;">${m.desc}</p>
              <div style="background:var(--forest-soft); padding:10px; border-radius:var(--radius-sm); border-left:3px solid var(--forest);">
                <strong style="color:var(--forest-deep);">Pertanyaan Kritis YKPP:</strong>
                <p style="font-size:12px; margin-top:3px; color:var(--ink);">${m.pertanyaanKritis}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- KELOMPOK KUNING -->
      <div style="margin-bottom:18px;">
        <h4 style="color:var(--gold); display:flex; align-items:center; gap:6px; margin-bottom:8px;">
          🟡 Tingkat Perhatian KUNING — Pemantauan Berkala (Monitoring Zone)
        </h4>
        <div class="findings-list">
          ${t.kuning.map(k => `
            <div class="finding-card">
              <div class="finding-header">
                <span class="finding-title">${k.title}</span>
                <span class="badge badge-yellow">KUNING</span>
              </div>
              <div class="finding-delta">${k.metric}</div>
              <p style="font-size:12.5px; margin-bottom:8px;">${k.desc}</p>
              <div style="background:var(--surface-alt); padding:10px; border-radius:var(--radius-sm); border-left:3px solid var(--gold);">
                <strong style="color:var(--gold);">Pertanyaan Kritis:</strong>
                <p style="font-size:12px; margin-top:3px;">${k.pertanyaanKritis}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- KELOMPOK HIJAU -->
      <div>
        <h4 style="color:var(--green); display:flex; align-items:center; gap:6px; margin-bottom:8px;">
          🟢 Tingkat Perhatian HIJAU — Kinerja Positif yang Memenuhi Target
        </h4>
        <div class="findings-list">
          ${t.hijau.map(h => `
            <div class="finding-card" style="border-left-color:var(--green);">
              <div class="finding-header">
                <span class="finding-title">${h.title}</span>
                <span class="badge badge-green">HIJAU</span>
              </div>
              <div class="finding-delta">${h.metric}</div>
              <p style="font-size:12.5px;">${h.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

// 3. Investasi Portofolio
window.loadInvestasi = async function(invId) {
  state.currentInvestasiId = invId;
  try {
    const res = await fetch("/api/analyze/investasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invId, userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.investasi = d;
    renderInvestasi(d);
  } catch (e) {
    console.error("Error loading investasi:", e);
  }
};

function renderInvestasi(d) {
  const container = document.getElementById("investasi-content");
  if (!container || !d) return;

  const ent = d.entity;
  const r = d.comprehensiveRatios;
  const mz = d.modifiedZScore;
  const az = d.altmanZScore;
  const ro = d.riskOverlay;

  container.innerHTML = `
    <!-- Top Scoring Cards -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Modified Z-Score (Anualisasi)</span>
          <span class="badge ${mz && mz.tier === "Hijau" ? "badge-green" : "badge-yellow"}">${mz ? mz.tier : "-"}</span>
        </div>
        <div class="kpi-big">${mz ? mz.score : "-"}</div>
        <p class="kpi-sub">${mz ? mz.assessment : "-"}</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Altman Z-Score</span>
          <span class="badge ${az && az.tier === "Hijau" ? "badge-green" : "badge-yellow"}">${az ? az.tier : "-"}</span>
        </div>
        <div class="kpi-big">${az ? az.score : "-"}</div>
        <p class="kpi-sub">${az ? az.label : "-"}</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Debt to Equity Ratio (DER)</span>
          <span class="badge badge-green">Di Bawah Batas POJK</span>
        </div>
        <div class="kpi-big">${r.der || ent.ratiosComputed.der}x</div>
        <p class="kpi-sub">Batas Regulasi Finansial / POJK: Max 5,0x (Aman)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Realisasi Penjualan vs RKAP (RTC)</span>
          <span class="badge badge-green">RTC 98,45%</span>
        </div>
        <div class="kpi-big">${ent.financials.revenueCY ? "Rp" + ent.financials.revenueCY + " M" : "-"}</div>
        <p class="kpi-sub">Realisasi Laba Bersih vs RKAP: RTC 82,48% (Zona Kuning)</p>
      </div>
    </div>

    <!-- Risk Overlay Alert jika ada -->
    ${ro ? `
      <div class="card" style="border-left: 4px solid var(--gold); background:var(--gold-soft); margin-bottom:20px;">
        <h3 style="color:var(--forest-deep); margin-bottom:6px;">⚠️ ${ro.eventTitle}</h3>
        <p style="font-size:13px; margin-bottom:8px;">
          <strong>Exposure Jaminan:</strong> Rp${ro.totalExposure} Triliun | 
          <strong>Asumsi Stress Loss:</strong> Rp${ro.assumedLoss} Triliun (Loss Severity ${ro.lossSeverity}%, Recovery Rate ${ro.recoveryRate}%) |
          <strong>Status:</strong> <span class="badge badge-yellow">${ro.assessment}</span>
        </p>
        <p style="font-size:12.5px; color:var(--ink-secondary); line-height:1.5;">${ro.rationale}</p>
      </div>
    ` : ""}

    <!-- Komparasi 4 Dimensi (Tahun Lalu, Bulan Lalu, YoY %, RTC %) -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:12px;">Tabel Komparasi 4 Dimensi (Sesuai Butir 3 Alur MOM)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Metrik Keuangan</th>
              <th>Realisasi Berjalan (CY)</th>
              <th>Bulan Lalu (MoM)</th>
              <th>Tahun Lalu (YoY Basis)</th>
              <th>Pertumbuhan YoY (%)</th>
              <th>Target RKAP (Cita-cita)</th>
              <th>RTC (%)</th>
              <th>Status Evaluasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Penjualan / Pendapatan</strong></td>
              <td class="num">Rp${ent.financials.revenueCY || 0} M</td>
              <td class="num">Rp${ent.financials.revenuePM || "-"} M</td>
              <td class="num">Rp${ent.financials.revenuePY || 0} M</td>
              <td class="num"><span class="badge badge-green">+11,33%</span></td>
              <td class="num">Rp${ent.financials.rkapTargetRevenue || 0} M</td>
              <td class="num">98.45%</td>
              <td><span class="badge badge-green">Tercapai (≥ 95%)</span></td>
            </tr>
            <tr>
              <td><strong>Laba Operasional</strong></td>
              <td class="num">Rp${ent.financials.operatingProfitCY || 0} M</td>
              <td class="num">-</td>
              <td class="num">Rp${ent.financials.operatingProfitPY || 0} M</td>
              <td class="num"><span class="badge badge-yellow">-7,06%</span></td>
              <td class="num">Rp${ent.financials.rkapTargetOpProfit || 0} M</td>
              <td class="num">88.57%</td>
              <td><span class="badge badge-yellow">Perhatian (80-94%)</span></td>
            </tr>
            <tr>
              <td><strong>Laba Bersih Tahun Berjalan</strong></td>
              <td class="num">Rp${ent.financials.netProfitCY || 0} M</td>
              <td class="num">Rp${ent.financials.netProfitPM || "-"} M</td>
              <td class="num">Rp${ent.financials.netProfitPY || 0} M</td>
              <td class="num"><span class="badge badge-red">-36,60%</span></td>
              <td class="num">Rp${ent.financials.rkapTargetNetProfit || 0} M</td>
              <td class="num">82.48%</td>
              <td><span class="badge badge-yellow">Perhatian (80-94%)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 33 Rasio Lengkap Tabulasi -->
    <div class="card">
      <h3 style="margin-bottom:12px;">33 Rasio Baku Skema Obligasi & Portofolio (Kajian Ihsan)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Kelompok Rasio</th>
              <th>Nama Metrik</th>
              <th>Nilai Terhitung</th>
              <th>Batas Covenant / Benchmark</th>
              <th>Keterangan Evaluasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Likuiditas</td>
              <td>Current Ratio</td>
              <td class="num">${ent.ratiosComputed.currentRatio}x</td>
              <td>Min 1,25x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Likuiditas</td>
              <td>Quick Ratio</td>
              <td class="num">${ent.ratiosComputed.quickRatio}x</td>
              <td>Min 0,80x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Solvabilitas</td>
              <td>Debt to Equity Ratio (DER)</td>
              <td class="num">${ent.ratiosComputed.der}x</td>
              <td>Max 5,0x (POJK)</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Solvabilitas</td>
              <td>Debt Ratio</td>
              <td class="num">${ent.ratiosComputed.debtRatio}%</td>
              <td>Max 70,0%</td>
              <td><span class="badge badge-yellow">Mendekati Batas</span></td>
            </tr>
            <tr>
              <td>Solvabilitas</td>
              <td>Net Gearing Ratio</td>
              <td class="num">${ent.ratiosComputed.netGearing}x</td>
              <td>Max 1,0x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Gross Profit Margin</td>
              <td class="num">${ent.ratiosComputed.gpm}%</td>
              <td>Min 5,0%</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Operating Profit Margin</td>
              <td class="num">${ent.ratiosComputed.opm}%</td>
              <td>Min 4,0%</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Return on Assets (ROA) Anualisasi</td>
              <td class="num">${ent.ratiosComputed.roa}%</td>
              <td>Peer: 3,5% - 5,2%</td>
              <td><span class="badge badge-green">In-Range Peer</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Return on Equity (ROE) Anualisasi</td>
              <td class="num">${ent.ratiosComputed.roe}%</td>
              <td>Min 8,0%</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Coverage</td>
              <td>Interest Coverage Ratio</td>
              <td class="num">${ent.ratiosComputed.interestCoverage}x</td>
              <td>Min 3,0x</td>
              <td><span class="badge badge-yellow">Sedikit Di Bawah 3x</span></td>
            </tr>
            <tr>
              <td>Coverage</td>
              <td>Debt Service Coverage (DSCR)</td>
              <td class="num">${ent.ratiosComputed.dscr}x</td>
              <td>Min 1,30x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. Konsolidasi Akhir
async function loadKonsolidasi() {
  try {
    const res = await fetch("/api/analyze/konsolidasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.konsolidasi = d;
    renderKonsolidasi(d);
  } catch (e) {
    console.error("Error loading konsolidasi:", e);
  }
}

function renderKonsolidasi(d) {
  const container = document.getElementById("konsolidasi-content");
  if (!container || !d) return;

  const tot = d.consolidatedTotals;

  container.innerHTML = `
    <!-- Top Consolidated KPIs -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Pendapatan Konsol Bersih</span>
          <span class="badge badge-green">+6,9% YoY</span>
        </div>
        <div class="kpi-big">$${tot.revenueCY} M</div>
        <p class="kpi-sub">Setelah eliminasi omzet antar-entitas $390 M (Gross: $${tot.revenueCY + 390} M)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Laba Bersih Konsolidasi</span>
          <span class="badge badge-green">+${tot.growthNetIncomeYoY}% YoY</span>
        </div>
        <div class="kpi-big">$${tot.netIncomeCY} M</div>
        <p class="kpi-sub">Induk: $${tot.parentAttributableIncome} M (${tot.parentSharePercent}%) | NCI: $${tot.totalNciProfit} M (${tot.nciSharePercent}%)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Solvabilitas Grup (DER)</span>
          <span class="badge badge-green">${tot.derStatus}</span>
        </div>
        <div class="kpi-big">${tot.consolidatedDER}x</div>
        <p class="kpi-sub">Total Liabilitas $${tot.totalLiabilitiesCY} M vs Ekuitas $${tot.totalEquityCY} M (Plafon POJK 5,0x)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Profitabilitas Aset (ROA)</span>
          <span class="badge badge-green">${tot.roaStatus}</span>
        </div>
        <div class="kpi-big">${tot.consolidatedROA}%</div>
        <p class="kpi-sub">Rata-rata Industri: 3,5% - 5,2% | Kinerja grup di kuartil teratas</p>
      </div>
    </div>

    <!-- Review Workspace 4 Anomali Forensik Konsolidasi -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:14px;">4 Temuan Anomali Forensik Konsolidasi (Review Workspace)</h3>
      <div class="findings-list">
        ${d.anomalies.map(anom => `
          <div class="finding-card ${anom.severity === "CRITICAL" ? "critical" : "moderate"}">
            <div class="finding-header">
              <span class="finding-title">${anom.title}</span>
              <div>
                <span class="badge ${anom.severity === "CRITICAL" ? "badge-red" : "badge-yellow"}">${anom.severity}</span>
                <span class="badge badge-blue">${anom.status}</span>
              </div>
            </div>
            <div class="finding-delta"><strong>Quantified Delta:</strong> ${anom.quantifiedDelta}</div>
            <p style="font-size:12.5px; color:var(--ink);"><strong>Dampak Kepatuhan Audit:</strong> ${anom.auditImpact}</p>
            <div class="finding-actions">
              <span style="font-size:11.5px; font-weight:600; color:var(--ink-muted);">Tindakan:</span>
              <button class="btn btn-sm btn-secondary" onclick="alert('Catatan klarifikasi dikirim ke entitas anak.')">Minta Klarifikasi Anak Usaha</button>
              <button class="btn btn-sm btn-primary" onclick="alert('Temuan dicatat dalam draf konsolidasi.')">Tandai Finding Audit</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Roster 6 Entitas Grup -->
    <div class="card">
      <h3 style="margin-bottom:12px;">Rincian Kontribusi Laba & NCI 6 Entitas Grup</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Entitas</th>
              <th>Peran</th>
              <th>Hak NCI (%)</th>
              <th>Pendapatan CY</th>
              <th>Laba Bersih CY</th>
              <th>Bagian Laba NCI Terhitung</th>
              <th>Bagian NCI Dilaporkan</th>
              <th>Disparitas NCI (%)</th>
            </tr>
          </thead>
          <tbody>
            ${d.entities.map(ent => {
              const nciRow = d.nciBreakdown.find(n => n.name === ent.name);
              return `
                <tr>
                  <td><strong>${ent.name}</strong></td>
                  <td>${ent.role.toUpperCase()}</td>
                  <td class="num">${ent.nciPercent}%</td>
                  <td class="num">$${ent.revCY} M</td>
                  <td class="num">$${ent.niCY} M</td>
                  <td class="num">${nciRow ? "$" + nciRow.computedNciShare + " M" : "-"}</td>
                  <td class="num">${ent.reportedNci ? "$" + ent.reportedNci + " M" : "-"}</td>
                  <td class="num">${nciRow && nciRow.disparityPercent ? `<span class="badge badge-red">+${nciRow.disparityPercent}%</span>` : "-"}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 5. Rekonsiliasi Selisih
async function loadReconciliations() {
  try {
    const res = await fetch("/api/reconciliations");
    const d = await res.json();
    state.data.reconciliations = d;
    renderReconciliations(d);
  } catch (e) {
    console.error("Error loading reconciliations:", e);
  }
}

function renderReconciliations(items) {
  const container = document.getElementById("rekonsiliasi-content");
  if (!container || !items) return;

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Entitas</th>
              <th>Metrik / Pos</th>
              <th>Angka Excel</th>
              <th>Angka Kajian</th>
              <th>Angka AI Model</th>
              <th>Selisih (Delta)</th>
              <th>Kategori Akar Masalah</th>
              <th>Penjelasan Penyebab & Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(rec => `
              <tr>
                <td><strong>${rec.id}</strong></td>
                <td>${rec.entity}</td>
                <td><strong>${rec.metric}</strong></td>
                <td class="num">${rec.sourceExcel}</td>
                <td class="num">${rec.sourceKajian}</td>
                <td class="num">${rec.sourceAI}</td>
                <td><span class="badge badge-yellow">${rec.delta}</span></td>
                <td><span class="badge badge-blue">${rec.rootCauseCategory}</span></td>
                <td style="font-size:12px;">
                  <p><strong>Penyebab:</strong> ${rec.rootCauseExplanation}</p>
                  <p style="color:var(--forest); margin-top:4px;"><strong>Tindakan:</strong> ${rec.reconciliationAction}</p>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 6. Audit Logs & Sequencing
async function loadAuditLogs() {
  try {
    const res = await fetch("/api/logs");
    const d = await res.json();
    state.data.auditLogs = d;
    renderAuditLogs(d);
  } catch (e) {
    console.error("Error loading logs:", e);
  }
}

function renderAuditLogs(d) {
  const container = document.getElementById("auditlog-content");
  if (!container || !d) return;

  container.innerHTML = `
    <div class="dashboard-grid">
      <div class="card">
        <span class="card-title">Total Analisis Dijalankan</span>
        <div class="kpi-big">${d.totalAnalysesRun} Kali</div>
        <p class="kpi-sub">Kumulatif seluruh pipeline</p>
      </div>
      <div class="card">
        <span class="card-title">Sesi Aktif Saat Ini</span>
        <div class="kpi-big">${d.currentSessionId}</div>
        <p class="kpi-sub">Sesi ke-${d.sessionCount} hari ini</p>
      </div>
      <div class="card">
        <span class="card-title">Jumlah Analisis Sesi Ini</span>
        <div class="kpi-big">${d.analysesInCurrentSession} Analisis</div>
        <p class="kpi-sub">Pengendali, Non-Pengendali, Investasi, Konsolidasi</p>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <h3 style="margin-bottom:12px;">Riwayat Lengkap Aktivitas Audit & Urutan Proses (Sequencing Log)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Langkah (Seq)</th>
              <th>Entitas</th>
              <th>Fungsi</th>
              <th>Aktivitas Analisis</th>
              <th>Peran / PIC</th>
              <th>Hasil / Status</th>
            </tr>
          </thead>
          <tbody>
            ${d.history.map(h => `
              <tr>
                <td class="num">${new Date(h.timestamp).toLocaleTimeString()}</td>
                <td class="num">Step ${h.sequencingStep}</td>
                <td><strong>${h.entity}</strong></td>
                <td>${h.functionType}</td>
                <td>${h.action}</td>
                <td>${h.role}</td>
                <td><span class="badge badge-green">${h.outcome}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. Parameter & Ambang Batas
async function loadParameters() {
  try {
    const res = await fetch("/api/parameters");
    const d = await res.json();
    state.data.parameters = d;
    renderParameters(d);
  } catch (e) {
    console.error("Error loading params:", e);
  }
}

function renderParameters(p) {
  const container = document.getElementById("parameter-content");
  if (!container || !p) return;

  const isConfig = state.currentRole === "configurator";

  container.innerHTML = `
    <!-- Modified Z-Score Formula Box -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:8px;">Model Modified Z-Score Anualisasi (Formula Baku)</h3>
      <div style="background:var(--surface-alt); padding:14px; border-radius:var(--radius-sm); font-family:'IBM Plex Mono', monospace; font-size:13.5px; border:1px solid var(--line-strong);">
        ${p.zScores.modifiedZ.formula}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-top:14px;">
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Konstanta:</div>
          <div class="num">${p.zScores.modifiedZ.weights.constant}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot WK_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.wk_ta}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot CASHPROF_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.cashprof_ta}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot SOLVR:</div>
          <div class="num">${p.zScores.modifiedZ.weights.solvr}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot OPPROF_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.opprof_ta}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot SALES_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.sales_ta}</div>
        </div>
      </div>
    </div>

    <!-- Threshold Covenants & Regulasi -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:12px;">Plafon Covenants & Batas Regulasi Institusional</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Indikator / Covenant</th>
              <th>Ambang Batas Baku</th>
              <th>Rujukan Dasar Hukum</th>
              <th>Aksi Jika Terlampaui</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Solvabilitas POJK (DER Konsolidasi)</strong></td>
              <td class="num"><strong>Maksimum 5,0x</strong></td>
              <td>Regulasi POJK Lembaga Finansial / Holding</td>
              <td>Peringatan Kepatuhan Regulasi Kritis</td>
            </tr>
            <tr>
              <td><strong>Disparitas Laba NCI</strong></td>
              <td class="num"><strong>Toleransi ≤ 8,0%</strong></td>
              <td>IFRS 10 / PSAK 65 (Laba Kepentingan Non-Pengendali)</td>
              <td>Status "Needs Management Clarification"</td>
            </tr>
            <tr>
              <td><strong>Akselerasi Piutang Pihak Berelasi</strong></td>
              <td class="num"><strong>ΔRP - ΔRev ≤ 30,0%</strong></td>
              <td>IAS 24 / PSAK 7 (Transaksi Pihak Berelasi)</td>
              <td>Status "Audit Finding (Requires Revision)"</td>
            </tr>
            <tr>
              <td><strong>Ambang Deviasi Piutang RKAP (RTC)</strong></td>
              <td class="num"><strong>Maksimum 120,0%</strong></td>
              <td>Kajian Ihsan & Rencana Kerja Anggaran YKPP</td>
              <td>Tiering Merah & Pertanyaan Kritis Manajemen</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- PIPELINE & ACTIONS ---

window.runFullDailyPipeline = async function() {
  alert("Memulai eksekusi terpadu Agenda Hari Ini (2 Pengendali, 1 Non-Pengendali, 2 Investasi, dan Konsolidasi Akhir)...");
  await loadPengendali();
  await loadNonPengendali();
  await loadInvestasi("investasi-daaz");
  await loadKonsolidasi();
  await loadAuditLogs();
  alert("✅ Seluruh alur analisis agenda hari ini berhasil dieksekusi lengkap dengan rekam jejak audit!");
};

window.runPengendaliAnalysis = () => loadPengendali();
window.runNonPengendaliAnalysis = () => loadNonPengendali();
window.runInvestasiAnalysis = () => loadInvestasi(state.currentInvestasiId);
window.runKonsolidasiAnalysis = () => loadKonsolidasi();
window.refreshAuditLogs = () => loadAuditLogs();

window.downloadExcelTemplate = function() {
  window.location.href = "/api/template-excel";
};

// Finding Status Updater
window.updateFindingStatus = async function(findingId, newStatus) {
  if (state.data.pengendali && state.data.pengendali.entity) {
    const f = state.data.pengendali.entity.findings.find(x => x.id === findingId);
    if (f) {
      f.action = newStatus;
      renderPengendali(state.data.pengendali);
      // Record audit action
      await fetch("/api/logs/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: state.data.pengendali.entity.name,
          functionType: "Review Status Update",
          action: `Keputusan temuan ${findingId} diubah menjadi: ${newStatus}`,
          role: state.currentRole === "reviewer" ? "Reviewer Hasil" : "Penyusun Parameter",
          outcome: "Tercatat",
          sequencingStep: 1
        })
      });
      loadAuditLogs();
    }
  }
};

// Export Nota Dinas
window.exportNotaDinas = function(entityName) {
  const modal = document.getElementById("memoModal");
  const title = document.getElementById("memoModalTitle");
  const body = document.getElementById("memoModalBody");

  if (!modal || !body) return;

  title.innerText = `NOTA DINAS HASIL VERIFIKASI — ${entityName.toUpperCase()}`;
  body.innerHTML = `
    <div style="text-align:center; margin-bottom:20px; border-bottom:2px solid #000; padding-bottom:10px;">
      <h2 style="margin:0; font-size:16px;">YAYASAN KESEJAHTERAAN PEGADAIAN PERMATA</h2>
      <h3 style="margin:4px 0 0; font-size:14px; font-weight:normal;">DIVISI KEUANGAN & SUBSIDIARY</h3>
      <p style="margin:2px 0 0; font-size:11px;">Jalan Kramat Raya No. 162, Jakarta Pusat 10430</p>
    </div>

    <table style="width:100%; margin-bottom:16px; font-size:13px; border-collapse:collapse;">
      <tr><td style="width:100px; padding:3px 0;"><strong>Nomor</strong></td><td>: ND-104/YKPP-DKS/X/2026</td></tr>
      <tr><td style="padding:3px 0;"><strong>Tanggal</strong></td><td>: 06 Oktober 2026</td></tr>
      <tr><td style="padding:3px 0;"><strong>Kepada Yth.</strong></td><td>: Pengurus YKPP</td></tr>
      <tr><td style="padding:3px 0;"><strong>Dari</strong></td><td>: Divisi Keuangan & Subsidiary</td></tr>
      <tr><td style="padding:3px 0;"><strong>Perihal</strong></td><td>: Hasil Verifikasi Laporan Keuangan ${entityName} Periode Agustus 2026</td></tr>
    </table>

    <div style="border-top:1px solid #ccc; padding-top:12px;">
      <p style="margin-bottom:12px;">
        Sehubungan dengan penyampaian Laporan Keuangan ${entityName} Periode Agustus 2026, bersama ini disampaikan hasil verifikasi atas perkembangan kinerja keuangan, posisi likuiditas, dan kepatuhan transaksi.
      </p>

      <p style="margin-bottom:12px; font-style:italic; background:#f9f9f9; padding:8px; border-left:3px solid #666;">
        <strong>Pernyataan Verifikator:</strong> Perlu ditegaskan bahwa hasil verifikasi dalam Nota Dinas ini bukan merupakan opini audit dan bukan penetapan bahwa suatu pencatatan telah salah. Divisi Keuangan & Subsidiary bertindak sebagai verifikator atas data dan dokumen yang disampaikan. Kebenaran data, underlying transaction, evidence, serta klasifikasi akun tetap menjadi tanggung jawab entitas penyusun.
      </p>

      <h4 style="margin:14px 0 6px;">I. Ringkasan Kinerja Keuangan & Analisis Pertumbuhan</h4>
      <p style="margin-bottom:10px;">
        Sampai dengan 31 Agustus 2026, pendapatan usaha tercatat sebesar Rp216,88 Miliar, tumbuh +31,45% YoY dibandingkan periode yang sama tahun 2025 (Rp164,98 Miliar). Namun demikian, beban usaha meningkat sebesar +32,91% menjadi Rp208,53 Miliar, mengakibatkan marjin operasi tertekan dari 4,90% menjadi 3,85%.
      </p>

      <h4 style="margin:14px 0 6px;">II. Analisis Posisi Keuangan dan Likuiditas</h4>
      <p style="margin-bottom:10px;">
        Aset lancar tercatat Rp52,63 Miliar berbanding kewajiban lancar Rp93,12 Miliar, menghasilkan indikasi <strong>Negative Net Working Capital sebesar -Rp40,49 Miliar</strong> dengan Current Ratio sekitar 0,57 kali. Struktur modal kerja ini memerlukan perhatian ketat dalam monitoring likuiditas.
      </p>

      <h4 style="margin:14px 0 6px;">III. Temuan Forensik & Permintaan Bukti (Audit Findings)</h4>
      <ol style="padding-left:20px; margin-bottom:14px;">
        <li><strong>Lonjakan Tunjangan Bonus Jasa Produksi:</strong> Realisasi sebesar Rp12,87 Miliar (2.308% terhadap RKAP tahunan Rp557,7 Juta). Memerlukan dokumen persetujuan Direksi/Pengurus.</li>
        <li><strong>Pergeseran Tarif Pajak Efektif:</strong> ETR berubah dari 22,0% menjadi 25,0% tanpa pengungkapan rekonsiliasi fiskal di CALK Note 24.</li>
        <li><strong>Saldo Abnormal Ekuitas:</strong> Akun Cadangan Tujuan bernilai negatif -Rp12,83 Miliar di neraca muka.</li>
      </ol>

      <div style="margin-top:24px; display:flex; justify-content:flex-end;">
        <div style="text-align:center; width:220px;">
          <p>Kepala Divisi Keuangan & Subsidiary,</p>
          <br><br><br>
          <p><strong>( ________________________ )</strong></p>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";
};

window.printMemo = function() {
  window.print();
};

// Modal helpers
window.openSettingsModal = () => document.getElementById("settingsModal").style.display = "flex";
window.openUploadModal = () => document.getElementById("uploadModal").style.display = "flex";
window.closeModal = (id) => document.getElementById(id).style.display = "none";

window.saveGeminiKey = function() {
  const key = document.getElementById("geminiApiKeyInput").value;
  state.geminiApiKey = key;
  localStorage.setItem("ykpp_gemini_key", key);
  window.closeModal("settingsModal");
  alert("Konfigurasi Google Gemini API Key berhasil disimpan!");
};

window.handleFileUpload = async function(files) {
  if (!files || files.length === 0) return;
  const f = files[0];
  alert(`Memproses unggahan ${f.name}...`);
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: f.name })
    });
    const d = await res.json();
    window.closeModal("uploadModal");
    alert(`✅ ${d.message}`);
    loadAuditLogs();
  } catch (e) {
    alert("Gagal memproses file: " + e.message);
  }
};

// --- COPILOT PANEL ---
window.toggleCopilot = function() {
  const p = document.getElementById("copilotPanel");
  p.classList.toggle("collapsed");
  const icon = document.getElementById("copilotToggleIcon");
  icon.innerText = p.classList.contains("collapsed") ? "▴" : "▾";
};

window.sendCopilotMessage = async function() {
  const input = document.getElementById("copilotInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chat = document.getElementById("copilotChat");

  // User Bubble
  const userDiv = document.createElement("div");
  userDiv.className = "chat-bubble user";
  userDiv.innerText = msg;
  chat.appendChild(userDiv);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  // Placeholder Agent Bubble
  const agentDiv = document.createElement("div");
  agentDiv.className = "chat-bubble agent";
  agentDiv.innerHTML = "<em>Memeriksa aturan PRD dan menganalisis laporan keuangan...</em>";
  chat.appendChild(agentDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/copilot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: msg,
        geminiApiKey: state.geminiApiKey,
        context: {
          activeTab: state.activeTab,
          role: state.currentRole
        }
      })
    });
    const data = await res.json();
    
    // Format markdown-like response
    let formatted = data.answer
      .replace(/### (.*?)\n/g, '<h4 style="margin:8px 0 4px; color:#1B4332;">$1</h4>')
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    if (data.ragCitations && data.ragCitations.length > 0) {
      formatted += '<br><div style="margin-top:8px; border-top:1px dashed #CCC; padding-top:4px;">';
      data.ragCitations.forEach(c => {
        formatted += `<span class="citation-chip">📖 ${c.source} (${c.page})</span> `;
      });
      formatted += '</div>';
    }

    agentDiv.innerHTML = formatted;
    chat.scrollTop = chat.scrollHeight;
  } catch (e) {
    agentDiv.innerText = "Terjadi kesalahan saat memanggil AI Copilot: " + e.message;
  }
};
"""

with open("public/app.js", "w") as f:
    f.write(app_code)
print("public/app.js written successfully")
