/**
 * Navigation Component (Header, Breadcrumbs & Global Quick Actions)
 */

export function renderHeader(container, currentView, onNavigate, onOpenUpload, onRunAutoCalculate, onOpenCopilot) {
  let breadcrumbText = "Menu Utama";
  if (currentView.startsWith("pendanaan")) breadcrumbText = "Mode A • Pendanaan";
  else if (currentView.startsWith("nonpendanaan")) breadcrumbText = "Mode B • Non-Pendanaan";
  else if (currentView.startsWith("investasi")) breadcrumbText = "Mode C • Skema Investasi";
  else if (currentView === "auto_dashboard") breadcrumbText = "Dashboard Auto-Calculate";

  container.innerHTML = `
    <header class="app-header">
      <div class="brand-section">
        <div class="brand-logo" style="cursor:pointer;" id="brandLogoHome">YK</div>
        <div class="brand-title">
          <h1>Platform Terpadu Analisis Keuangan</h1>
          <p>YKPP & Solanascope · Zero-Persistence & AI RAG Cross-Verifier</p>
        </div>
      </div>

      <div class="header-nav-actions" style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <div class="breadcrumb-chip">
          <span>Tampilan:</span>
          <strong>${breadcrumbText}</strong>
        </div>

        <button id="btnHeaderAutoCalc" class="btn btn-gold btn-sm" title="Jalankan Auto-Calculate Seluruh Alur & Entitas">
          ⚡ Auto-Calculate Semua
        </button>

        <button id="btnHeaderUpload" class="btn btn-secondary btn-sm" title="Unggah Excel 3-Sheet / PDF">
          📤 Unggah File
        </button>

        <button id="btnHeaderCopilot" class="btn btn-secondary btn-sm" style="background:var(--forest-soft); color:var(--forest); border:1px solid var(--forest-light);" title="Buka AI Copilot & Cross-Verifier">
          🤖 AI RAG Verify
        </button>

        ${currentView !== "main_menu" ? `
          <button id="btnHeaderHome" class="btn btn-primary btn-sm">
            ⌂ Menu Utama
          </button>
        ` : ""}
      </div>
    </header>
  `;

  // Attach Listeners
  const btnHome = container.querySelector("#btnHeaderHome");
  if (btnHome) btnHome.addEventListener("click", () => onNavigate("main_menu"));

  const brandHome = container.querySelector("#brandLogoHome");
  if (brandHome) brandHome.addEventListener("click", () => onNavigate("main_menu"));

  const btnAuto = container.querySelector("#btnHeaderAutoCalc");
  if (btnAuto) btnAuto.addEventListener("click", onRunAutoCalculate);

  const btnUpload = container.querySelector("#btnHeaderUpload");
  if (btnUpload) btnUpload.addEventListener("click", onOpenUpload);

  const btnCopilot = container.querySelector("#btnHeaderCopilot");
  if (btnCopilot) btnCopilot.addEventListener("click", onOpenCopilot);
}
