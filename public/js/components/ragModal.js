/**
 * RAG Entry Popup / Modal Component
 * Displays on initial app launch.
 * Provides interactive retrieval-augmented knowledge, rule citations,
 * and immediate cross-verification query testing before entering the main menu.
 */

const RAG_ARTICLES = [
  {
    title: "Batas Plafon Solvabilitas Regulasi POJK",
    badge: "POJK 5.0x",
    summary: "Batas maksimum DER konsolidasi lembaga pembiayaan / holding yayasan adalah 5.0x. Untuk emiten non-finansial non-infrastruktur maksimal 3.0x.",
    citation: "PRD Kajian Ihsan Slide 8 & Master Parameters"
  },
  {
    title: "Formula Baku Modified Z-Score Anualisasi",
    badge: "Kajian Ihsan hlm. 15",
    summary: "Z = -3,337 + 0,736·WK_TA + 6,95·CASHPROF_TA + 0,864·SOLVR + 7,554·OPPROF_TA + 1,544·SALES_TA. Pada interim semester I, komponen laba dan penjualan dikalikan 2. Z ≥ 2,0 Safe.",
    citation: "Skema Analisis Obligasi Blueprint hlm. 15"
  },
  {
    title: "Definisi Standar RTC (Realisasi Terhadap Cita-cita)",
    badge: "MOM Standard",
    summary: "RTC dihitung dengan rumus: (Realisasi Aktual / Target RKAP) × 100%. Lonjakan piutang atau beban > 120% memicu sinyal peringatan kritis (Tiering Merah).",
    citation: "Notulensi Rapat MOM Analisis Keuangan"
  },
  {
    title: "Growth Gap (Sinyal S7) & Defisit Modal Kerja",
    badge: "Forensik S7",
    summary: "Jika Opex tumbuh lebih cepat daripada omzet (contoh PT EPS: Opex +32,91% vs Omzet +31,45%), operating margin tertekan dan memicu rekomendasi efisiensi kontrak.",
    citation: "PRD Verifikasi PT EPS hlm. 8-9"
  }
];

export function renderRagModal(onContinue, onOpenCopilot) {
  const modal = document.createElement("div");
  modal.id = "ragEntryModal";
  modal.className = "modal-overlay show-entry";
  modal.innerHTML = `
    <div class="modal-content rag-modal-box" style="max-width:760px;">
      <div class="rag-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="rag-icon-badge">🧠</div>
          <div>
            <h3 style="font-size:17px; margin:0; color:var(--forest-deep);">RAG Knowledge Assistant & Cross-Verifier</h3>
            <p style="font-size:12px; color:var(--ink-secondary); margin:0;">Basis Parameter Baku Analisis Keuangan YKPP & Kajian Ihsan</p>
          </div>
        </div>
        <button id="btnCloseRagCross" class="btn-icon" style="font-size:16px;">✕</button>
      </div>

      <div class="rag-body" style="max-height:60vh; overflow-y:auto; padding-right:6px;">
        <p style="font-size:13px; line-height:1.5; color:var(--ink); margin-bottom:14px;">
          Selamat datang di <strong>Platform Analisis Keuangan Terpadu</strong>. Sistem ini menggabungkan <strong>3 Mode Kalkulasi Finansial</strong>, fitur <strong>Auto-Calculate dari Berkas</strong>, serta <strong>AI Copilot RAG</strong> untuk verifikasi silang (cross-verification) secara otomatis.
        </p>

        <!-- 4 Rule Cards Grid -->
        <div class="rag-cards-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:12px; margin-bottom:16px;">
          ${RAG_ARTICLES.map(art => `
            <div class="rag-card-item" style="background:var(--surface-alt); border:1px solid var(--line); border-radius:8px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:13px; color:var(--forest-deep);">${art.title}</strong>
                <span class="badge badge-green" style="font-size:10px;">${art.badge}</span>
              </div>
              <p style="font-size:12px; color:var(--ink); line-height:1.45;">${art.summary}</p>
              <div style="margin-top:6px; font-size:10.5px; color:var(--gold); font-weight:600;">📖 Sumber: ${art.citation}</div>
            </div>
          `).join("")}
        </div>

        <!-- Interactive Quick Cross-Verification Tester in Modal -->
        <div style="background:var(--forest-soft); border:1px solid var(--forest-light); border-radius:10px; padding:14px; margin-top:10px;">
          <strong style="font-size:12.5px; color:var(--forest-deep); display:block; margin-bottom:6px;">
            🤖 Uji Cross-Verification Langsung dengan AI RAG:
          </strong>
          <p style="font-size:12px; color:var(--ink-secondary); margin-bottom:10px;">
            Pilih pertanyaan verifikasi silang di bawah untuk membuka AI Copilot:
          </p>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm rag-prompt-chip" data-q="Cross-Verify Batas POJK DER 5.0x terhadap emiten dan holding yayasan.">
              🔍 Batas POJK 5.0x
            </button>
            <button class="btn btn-secondary btn-sm rag-prompt-chip" data-q="Cross-Verify formula Modified Z-Score anualisasi PT Daaz hlm. 15.">
              🔍 Modified Z-Score hlm. 15
            </button>
            <button class="btn btn-secondary btn-sm rag-prompt-chip" data-q="Cross-Verify Sinyal S7 Growth Gap pada PT EPS dan PT POJ.">
              🔍 Sinyal S7 Growth Gap
            </button>
            <button class="btn btn-secondary btn-sm rag-prompt-chip" data-q="Cross-Verify atribusi hak minoritas NCI di bawah IFRS 10 / PSAK 65.">
              🔍 IFRS 10 Hak Minoritas
            </button>
          </div>
        </div>
      </div>

      <div class="rag-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); padding-top:14px; margin-top:10px;">
        <div style="font-size:11.5px; color:var(--ink-muted);">
          * Seluruh kalkulasi berjalan murni di memori lokal (Zero-Persistence).
        </div>
        <button id="btnContinueRag" class="btn btn-primary btn-lg" style="font-weight:700;">
          Lanjutkan ke Menu Utama →
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  function dismiss() {
    modal.classList.add("fade-out");
    setTimeout(() => {
      modal.remove();
      if (onContinue) onContinue();
    }, 250);
  }

  document.getElementById("btnContinueRag").addEventListener("click", dismiss);
  document.getElementById("btnCloseRagCross").addEventListener("click", dismiss);

  modal.querySelectorAll(".rag-prompt-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-q");
      dismiss();
      if (onOpenCopilot) {
        setTimeout(() => onOpenCopilot(q), 300);
      }
    });
  });
}
