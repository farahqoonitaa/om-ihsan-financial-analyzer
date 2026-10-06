/**
 * Main Menu Page Component
 * Features:
 * 1. 3 Clear Primary Entry Point Cards (Mode A: Pendanaan, Mode B: Non-Pendanaan, Mode C: Skema Investasi)
 * 2. Executive File Ingestion & 1-Click Auto-Calculate Banner (Processes all files automatically)
 * 3. AI Chatbot RAG Cross-Verification Access
 */

export function renderMainMenu(container, onSelectMode, onOpenUpload, onRunAutoCalculate, onOpenCopilot) {
  container.innerHTML = `
    <div class="page-content animate-fade-in" style="max-width:1100px;">
      
      <!-- Top Section -->
      <div style="text-align:center; max-width:760px; margin:0 auto 28px auto;">
        <span class="badge badge-gold" style="font-size:11px; margin-bottom:8px;">Platform Analisis Keuangan Terpadu YKPP</span>
        <h2 style="font-size:26px; margin:4px 0 8px 0; color:var(--forest-deep);">Kalkulator Laporan Keuangan 3 Mode</h2>
        <p style="color:var(--ink-secondary); font-size:14px; line-height:1.5;">
          Pilih salah satu dari 3 mode kalkulasi manual di bawah, atau manfaatkan fitur <strong>Auto-Calculate dari File</strong> untuk memproses seluruh entitas sekaligus dengan verifikasi silang AI Copilot RAG.
        </p>
      </div>

      <!-- FEATURED HERO: AUTO-CALCULATE FROM FILES & BENCHMARK -->
      <div class="auto-calc-hero-card" style="background:linear-gradient(135deg, #0D261A 0%, #1B4332 100%); border-radius:14px; padding:24px 28px; color:#FFFFFF; margin-bottom:32px; box-shadow:0 8px 24px rgba(13,38,26,0.18);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div style="max-width:620px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span style="background:rgba(207,166,70,0.25); border:1px solid #CFA646; color:#F9F3E3; font-size:11px; font-weight:700; padding:2px 8px; rounded:4px; border-radius:4px;">
                ⚡ FITUR OTOMATISASI MULTI-ENTITAS
              </span>
              <span style="font-size:12px; color:#A7D7C5;">MOM Agenda Terstruktur</span>
            </div>
            <h3 style="font-size:19px; color:#FFFFFF; font-weight:700; margin-bottom:6px;">
              Input Semua File & Auto-Calculate Seluruh Alur Otomatis
            </h3>
            <p style="font-size:13px; color:#D2E5DC; line-height:1.5;">
              Ingin langsung melihat hasil tanpa mengetik manual? Unggah file Excel 3-Sheet / PDF Anda, atau klik tombol di sebelah kanan untuk langsung menjalankan kalkulasi otomatis atas <strong>2 Entitas Pengendali (PT EPS), Entitas Non-Pengendali (PT POJ), 2 Investasi (PT Daaz & Pegadaian), dan Konsolidasi Akhir</strong>.
            </p>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; min-width:240px;">
            <button id="btnHeroAutoCalc" class="btn btn-gold btn-lg" style="box-shadow:0 4px 12px rgba(161,121,34,0.4); font-weight:700;">
              ⚡ Jalankan Auto-Calculate Semua Entitas →
            </button>
            <div style="display:flex; gap:8px;">
              <button id="btnHeroUpload" class="btn btn-secondary btn-sm" style="flex:1; background:rgba(255,255,255,0.15); color:#FFFFFF; border:1px solid rgba(255,255,255,0.25);">
                📤 Unggah File (.xlsx)
              </button>
              <button id="btnHeroCopilot" class="btn btn-secondary btn-sm" style="flex:1; background:rgba(255,255,255,0.15); color:#FFFFFF; border:1px solid rgba(255,255,255,0.25);">
                🤖 AI RAG Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION TITLE FOR 3 ENTRY MODES -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="font-size:17px; color:var(--forest-deep); margin:0;">3 Pintu Masuk Kalkulasi Terstruktur (Mode Input Terpisah):</h3>
          <p style="font-size:12.5px; color:var(--ink-secondary); margin:2px 0 0 0;">Klik kartu untuk membuka kalkulator formulir mandiri setiap mode.</p>
        </div>
      </div>

      <!-- 3 MODE CARDS GRID -->
      <div class="menu-cards-grid">
        <!-- Card 1: Pendanaan -->
        <div class="mode-card" id="cardModePendanaan">
          <div class="mode-card-icon">💳</div>
          <div class="mode-card-badge">Mode A</div>
          <h3 class="mode-card-title">Kalkulasi Pendanaan (Debt Financing)</h3>
          <p class="mode-card-desc">
            Simulasi pembiayaan utang bank & pinjaman subordinasi, jadwal amortisasi (Pokok Tetap, Anuitas, Bullet), rasio kemampuan bayar (ICR & DSCR), serta batas <em>covenant</em> DER POJK (maks. 5.0x).
          </p>
          <ul class="mode-card-bullets">
            <li>Jadwal Angsuran Pokok & Bunga Tenor 1-30 Thn</li>
            <li>Uji Kecukupan Bunga: ICR (EBIT / Bunga)</li>
            <li>Uji Kemampuan Bayar: DSCR ((EBITDA-Pajak) / Cicilan)</li>
            <li>Verifikasi Batas Plafon POJK DER ≤ 5,0x</li>
          </ul>
          <button class="btn btn-primary btn-block">Buka Kalkulasi Pendanaan →</button>
        </div>

        <!-- Card 2: Non-Pendanaan -->
        <div class="mode-card" id="cardModeNonPendanaan">
          <div class="mode-card-icon">📊</div>
          <div class="mode-card-badge">Mode B</div>
          <h3 class="mode-card-title">Kalkulasi Non-Pendanaan (Modal Kerja)</h3>
          <p class="mode-card-desc">
            Analisis kesehatan operasional modal kerja, deteksi Sinyal S7 <em>Growth Gap</em> (Opex YoY melampaui Omzet YoY), evaluasi target RKAP (RTC Bands), dan atribusi ekuitas non-pengendali (IFRS 10).
          </p>
          <ul class="mode-card-bullets">
            <li>Defisit Modal Kerja Bersih (Net Working Capital)</li>
            <li>Deteksi Sinyal S7 (Kesenjangan Biaya Operasional)</li>
            <li>Pencapaian Target RKAP (RTC Bands Hijau/Kuning/Merah)</li>
            <li>Atribusi Laba Hak Minoritas NCI (1% Saham)</li>
          </ul>
          <button class="btn btn-primary btn-block">Buka Kalkulasi Non-Pendanaan →</button>
        </div>

        <!-- Card 3: Skema Investasi -->
        <div class="mode-card" id="cardModeInvestasi">
          <div class="mode-card-icon">💎</div>
          <div class="mode-card-badge">Mode C</div>
          <h3 class="mode-card-title">Skema Investasi (Sukuk & Z-Score)</h3>
          <p class="mode-card-desc">
            Kalkulator imbal hasil/kupon instrumen sukuk & obligasi, Altman Z-Score, <strong>Modified Z-Score Anualisasi</strong> (paten Kajian Ihsan hlm. 15), serta simulasi <em>Stress Loss</em> dan haircut agunan.
          </p>
          <ul class="mode-card-bullets">
            <li>Jadwal Arus Kas Kupon Tahunan / Kuartalan</li>
            <li>Modified Z-Score Anualisasi (PT Daaz = 2,5415 Safe)</li>
            <li>Altman Z-Score 5 Rasio Keuangan</li>
            <li>Simulasi Stres Agunan & Taksiran Loss Severity</li>
          </ul>
          <button class="btn btn-primary btn-block">Buka Skema Investasi →</button>
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners for 3 Modes
  container.querySelector("#cardModePendanaan").addEventListener("click", () => onSelectMode("pendanaan"));
  container.querySelector("#cardModeNonPendanaan").addEventListener("click", () => onSelectMode("nonpendanaan"));
  container.querySelector("#cardModeInvestasi").addEventListener("click", () => onSelectMode("investasi"));

  // Attach Event Listeners for Hero Actions
  container.querySelector("#btnHeroAutoCalc").addEventListener("click", onRunAutoCalculate);
  container.querySelector("#btnHeroUpload").addEventListener("click", onOpenUpload);
  container.querySelector("#btnHeroCopilot").addEventListener("click", onOpenCopilot);
}
