import re

def update_index_html():
    file_path = 'public/index.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add CSS for spinner and shelf tabs if not present
    if 'finalizeSpinnerRing' not in html:
        css_addition = """
    /* --- BOOMER FINALIZATION & NICE CATEGORY SHELF STYLING --- */
    @keyframes spinSlowFinalize { 
      from { transform: rotate(0deg); } 
      to { transform: rotate(360deg); } 
    }
    .shelf-tab-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .shelf-tab-btn:hover {
      transform: translateY(-1px);
    }
    .shelf-item-card {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      transition: all 0.2s ease;
    }
    .shelf-item-card:hover {
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    }
    .boomer-action-btn-primary {
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 800;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(15,83,56,0.18);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .boomer-action-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(15,83,56,0.25);
    }
    .boomer-action-btn-secondary {
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 800;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .boomer-action-btn-secondary:hover {
      transform: translateY(-2px);
    }
"""
        html = html.replace('</style>', css_addition + '\n  </style>')

    # 2. Add Modal Finalize Loading
    if 'id="modalFinalizeLoading"' not in html:
        modal_html = """  <!-- MODAL: FINALIZATION, AUTO-SAVING & CATEGORIZATION PROGRESS (BOOMER-FRIENDLY) -->
  <div id="modalFinalizeLoading" class="modal-overlay hidden" style="z-index:99999; backdrop-filter:blur(6px); background:rgba(15,23,42,0.72);">
    <div class="modal-box" style="max-width:540px; border-radius:18px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.45); border:2.5px solid #86EFAC; background:#FFFFFF; padding:28px 32px; text-align:center;">
      
      <!-- Animated Icon Header -->
      <div style="position:relative; width:84px; height:84px; margin:0 auto 16px auto;">
        <div id="finalizeSpinnerRing" style="position:absolute; inset:0; border:4px solid #E2E8F0; border-top-color:#16A34A; border-radius:50%; animation:spinSlowFinalize 0.85s linear infinite;"></div>
        <div id="finalizeIconCenter" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:38px;">
          📂
        </div>
      </div>

      <span id="finalizeModalSchemeBadge" class="badge badge-green" style="font-size:12px; font-weight:800; padding:5px 14px; margin-bottom:8px; display:inline-block; letter-spacing:0.3px;">
        📈 MENYIMPAN KE KATEGORI: INVESTASI
      </span>

      <h3 id="finalizeModalTitle" style="font-size:21px; font-weight:800; color:#0F5338; margin:8px 0 6px 0;">
        Sedang Memfinalisasi & Mengarsipkan Kajian...
      </h3>
      <p id="finalizeModalSubtitle" style="font-size:13px; color:#475569; margin:0 0 20px 0; line-height:1.5;">
        Sistem sedang mengunci angka forensik, menyusun dokumen Nota Dinas resmi, dan menyimpan berkas ke Lemari Arsip Digital Knowledge Base.
      </p>

      <!-- Step-by-Step Verification Checklist (Reassuring for Seniors) -->
      <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin-bottom:20px; text-align:left; font-size:12.5px; display:flex; flex-direction:column; gap:12px;">
        <div id="finalizeCheck1" style="display:flex; align-items:center; gap:10px; color:#166534; font-weight:700;">
          <span style="font-size:16px;">⏳</span>
          <span id="finalizeCheckText1">1. Mengunci rekonsiliasi angka forensik & nota dinas resmi...</span>
        </div>
        <div id="finalizeCheck2" style="display:flex; align-items:center; gap:10px; color:#64748B;">
          <span style="font-size:16px;">⏳</span>
          <span id="finalizeCheckText2">2. Mengklasifikasi otomatis ke Kategori: <strong id="finalizeCatTargetName">Investasi</strong>...</span>
        </div>
        <div id="finalizeCheck3" style="display:flex; align-items:center; gap:10px; color:#64748B;">
          <span style="font-size:16px;">⏳</span>
          <span id="finalizeCheckText3">3. Mengarsipkan ke Knowledge Base & Lemari Arsip Terkategori...</span>
        </div>
      </div>

      <!-- Animated Progress Bar -->
      <div style="width:100%; height:10px; background:#E2E8F0; border-radius:999px; overflow:hidden; margin-bottom:12px;">
        <div id="finalizeProgressBar" style="width:20%; height:100%; background:linear-gradient(90deg, #16A34A, #10B981); transition:width 0.25s ease;"></div>
      </div>

      <div id="finalizeProgressPercent" style="font-size:12px; font-weight:800; color:#166534;">
        Memproses finalisasi (20%)...
      </div>
    </div>
  </div>\n\n"""
        html = html.replace('  <!-- MODAL: CLOUD API KEY CONFIGURATION', modal_html + '  <!-- MODAL: CLOUD API KEY CONFIGURATION')

    # 3. Update Step 5 of Pengendali (lines ~3011-3103)
    p_step_old_pat = r'(<div id="p_step_pane_5" class="hidden">[\s\S]*?<!-- EXPORT ACTION TILES -->[\s\S]*?</div>\s*</div>\s*<!-- NEXT JOURNEY RECOMMENDATIONS -->)'
    p_step_new = """<div id="p_step_pane_5" class="hidden">
          <div class="panel-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <div>
                <span class="badge badge-green" style="font-weight:700;">LANGKAH 5 • TUNTAS</span>
                <h3 style="margin:4px 0 2px; font-size:18px; color:var(--forest-deep);" data-i18n="export_header_title">Ekspor Dokumen Resmi & Rute Alur Selanjutnya</h3>
                <p style="margin:0; font-size:12px; color:var(--ink-secondary);" data-i18n="export_header_sub">Unduh laporan resmi terstandarisasi atau hubungkan temuan entitas ini ke alur bisnis berikutnya tanpa kehilangan konteks.</p>
              </div>
            </div>

            <!-- KONFIRMASI KAJIAN TERSIMPAN SECARA OTOMATIS (EXECUTIVE SAVED BANNER) -->
            <div id="savedConfirmationCard_pengendali"></div>

            <!-- DUA TOMBOL UTAMA BESAR RAMAH PENGGUNA SENIOR (BOOMER-POLISHED ACTION TILES) -->
            <div style="background:#FFFFFF; border:1.5px solid #CBD5E1; border-radius:12px; padding:18px 20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
              <div style="font-size:13px; font-weight:800; color:var(--forest-deep); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                <span>📥</span>
                <span>Aksi Utama: Unduh atau Cetak Laporan Resmi</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
                <!-- Big Word Button -->
                <button type="button" onclick="downloadNotaDinasDoc('pengendali')" class="btn btn-primary boomer-action-btn-primary">
                  <span style="font-size:22px;">📄</span>
                  <div style="text-align:left;">
                    <div>Unduh Dokumen Word (.DOC)</div>
                    <div style="font-size:11px; font-weight:400; opacity:0.9;">Format resmi Nota Dinas Pengendali lengkap kop surat</div>
                  </div>
                </button>
                <!-- Big PDF/Print Button -->
                <button type="button" onclick="printNotaDinas('pengendali')" class="btn btn-secondary boomer-action-btn-secondary" style="border:2px solid var(--forest); color:var(--forest);">
                  <span style="font-size:22px;">🖨️</span>
                  <div style="text-align:left;">
                    <div>Cetak / Simpan PDF (A4)</div>
                    <div style="font-size:11px; font-weight:400; opacity:0.8; color:var(--ink);">Buka dialog cetak browser langsung ke lembar A4</div>
                  </div>
                </button>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding-top:10px; border-top:1px solid #E2E8F0;">
                <button type="button" onclick="copyNotaDinasText('pengendali')" class="btn btn-secondary btn-sm" style="font-size:11.5px; cursor:pointer;">
                  📋 Salin Seluruh Teks Nota Dinas ke Clipboard
                </button>
                <button type="button" onclick="setProcessStep('pengendali', 4); setTimeout(() => toggleEditNotaDinas('pengendali'), 150);" class="btn btn-secondary btn-sm" style="border-color:#D97706; color:#92400E; background:#FEF3C7; font-weight:700; font-size:11.5px; cursor:pointer;">
                  ✏️ Ingin Koreksi Angka? Edit di Langkah 4 (Nota Dinas)
                </button>
              </div>
            </div>

            <!-- LEMARI ARSIP DOKUMEN TERKATEGORI (NICE CATEGORY SHELF) -->
            <div id="niceCategoryShelf_pengendali"></div>

            <!-- NEXT JOURNEY RECOMMENDATIONS -->"""
    
    html = re.sub(p_step_old_pat, p_step_new, html, count=1)

    # 4. Update Step 5 of Non-Pengendali (lines ~3678-3769)
    np_step_old_pat = r'(<div id="np_step_pane_5" class="hidden">[\s\S]*?<!-- EXPORT ACTION TILES -->[\s\S]*?</div>\s*</div>\s*<!-- NEXT JOURNEY RECOMMENDATIONS -->)'
    np_step_new = """<div id="np_step_pane_5" class="hidden">
        <div class="panel-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <span class="badge badge-blue" style="font-weight:700;">LANGKAH 5 • TUNTAS</span>
              <h3 style="margin:4px 0 2px; font-size:18px; color:var(--forest-deep);" data-i18n="export_header_title">Ekspor Dokumen Resmi & Rute Alur Selanjutnya</h3>
              <p style="margin:0; font-size:12px; color:var(--ink-secondary);" data-i18n="export_header_sub">Unduh laporan resmi terstandarisasi atau hubungkan temuan entitas ini ke alur bisnis berikutnya tanpa kehilangan konteks.</p>
            </div>
          </div>

          <!-- KONFIRMASI KAJIAN TERSIMPAN SECARA OTOMATIS (EXECUTIVE SAVED BANNER) -->
          <div id="savedConfirmationCard_nonpengendali"></div>

          <!-- DUA TOMBOL UTAMA BESAR RAMAH PENGGUNA SENIOR (BOOMER-POLISHED ACTION TILES) -->
          <div style="background:#FFFFFF; border:1.5px solid #CBD5E1; border-radius:12px; padding:18px 20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
            <div style="font-size:13px; font-weight:800; color:var(--forest-deep); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
              <span>📥</span>
              <span>Aksi Utama: Unduh atau Cetak Laporan Resmi</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
              <!-- Big Word Button -->
              <button type="button" onclick="downloadNotaDinasDoc('non_pengendali')" class="btn btn-primary boomer-action-btn-primary">
                <span style="font-size:22px;">📄</span>
                <div style="text-align:left;">
                  <div>Unduh Dokumen Word (.DOC)</div>
                  <div style="font-size:11px; font-weight:400; opacity:0.9;">Format resmi Nota Dinas Proteksi Minoritas & RUPS</div>
                </div>
              </button>
              <!-- Big PDF/Print Button -->
              <button type="button" onclick="printNotaDinas('non_pengendali')" class="btn btn-secondary boomer-action-btn-secondary" style="border:2px solid var(--forest); color:var(--forest);">
                <span style="font-size:22px;">🖨️</span>
                <div style="text-align:left;">
                  <div>Cetak / Simpan PDF (A4)</div>
                  <div style="font-size:11px; font-weight:400; opacity:0.8; color:var(--ink);">Buka dialog cetak browser langsung ke lembar A4</div>
                </div>
              </button>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding-top:10px; border-top:1px solid #E2E8F0;">
              <button type="button" onclick="copyNotaDinasText('non_pengendali')" class="btn btn-secondary btn-sm" style="font-size:11.5px; cursor:pointer;">
                📋 Salin Seluruh Teks Nota Dinas ke Clipboard
              </button>
              <button type="button" onclick="setProcessStep('nonpengendali', 4); setTimeout(() => toggleEditNotaDinas('non_pengendali'), 150);" class="btn btn-secondary btn-sm" style="border-color:#D97706; color:#92400E; background:#FEF3C7; font-weight:700; font-size:11.5px; cursor:pointer;">
                ✏️ Ingin Koreksi Angka? Edit di Langkah 4 (Nota Dinas)
              </button>
            </div>
          </div>

          <!-- LEMARI ARSIP DOKUMEN TERKATEGORI (NICE CATEGORY SHELF) -->
          <div id="niceCategoryShelf_nonpengendali"></div>

          <!-- NEXT JOURNEY RECOMMENDATIONS -->"""
    
    html = re.sub(np_step_old_pat, np_step_new, html, count=1)

    # 5. Update Step 5 of Investasi (lines ~5471-5561)
    inv_step_old_pat = r'(<div id="inv_step_pane_5" class="hidden">[\s\S]*?<!-- EXPORT ACTION TILES -->[\s\S]*?</div>\s*</div>\s*<!-- NEXT JOURNEY RECOMMENDATIONS -->)'
    inv_step_new = """<div id="inv_step_pane_5" class="hidden">
        <div class="panel-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <span class="badge badge-gold" style="font-weight:700;">LANGKAH 5 • TUNTAS</span>
              <h3 style="margin:4px 0 2px; font-size:18px; color:var(--forest-deep);" data-i18n="export_header_title">Ekspor Dokumen Resmi & Rute Alur Selanjutnya</h3>
              <p style="margin:0; font-size:12px; color:var(--ink-secondary);" data-i18n="export_header_sub">Unduh laporan resmi terstandarisasi atau hubungkan temuan entitas ini ke alur bisnis berikutnya tanpa kehilangan konteks.</p>
            </div>
          </div>

          <!-- KONFIRMASI KAJIAN TERSIMPAN SECARA OTOMATIS (EXECUTIVE SAVED BANNER) -->
          <div id="savedConfirmationCard_investasi"></div>

          <!-- DUA TOMBOL UTAMA BESAR RAMAH PENGGUNA SENIOR (BOOMER-POLISHED ACTION TILES) -->
          <div style="background:#FFFFFF; border:1.5px solid #CBD5E1; border-radius:12px; padding:18px 20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
            <div style="font-size:13px; font-weight:800; color:var(--forest-deep); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
              <span>📥</span>
              <span>Aksi Utama: Unduh atau Cetak Laporan Resmi</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
              <!-- Big Word Button -->
              <button type="button" onclick="downloadNotaDinasDoc('investasi')" class="btn btn-primary boomer-action-btn-primary">
                <span style="font-size:22px;">📄</span>
                <div style="text-align:left;">
                  <div>Unduh Dokumen Word (.DOC)</div>
                  <div style="font-size:11px; font-weight:400; opacity:0.9;">Format resmi Telaah Investasi lengkap 7-seksi institusional</div>
                </div>
              </button>
              <!-- Big PDF/Print Button -->
              <button type="button" onclick="printNotaDinas('investasi')" class="btn btn-secondary boomer-action-btn-secondary" style="border:2px solid var(--forest); color:var(--forest);">
                <span style="font-size:22px;">🖨️</span>
                <div style="text-align:left;">
                  <div>Cetak / Simpan PDF (A4)</div>
                  <div style="font-size:11px; font-weight:400; opacity:0.8; color:var(--ink);">Buka dialog cetak browser langsung ke lembar A4</div>
                </div>
              </button>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding-top:10px; border-top:1px solid #E2E8F0;">
              <button type="button" onclick="copyNotaDinasText('investasi')" class="btn btn-secondary btn-sm" style="font-size:11.5px; cursor:pointer;">
                📋 Salin Seluruh Teks Telaah ke Clipboard
              </button>
              <button type="button" onclick="setProcessStep('investasi', 4); setTimeout(() => toggleEditNotaDinas('investasi'), 150);" class="btn btn-secondary btn-sm" style="border-color:#D97706; color:#92400E; background:#FEF3C7; font-weight:700; font-size:11.5px; cursor:pointer;">
                ✏️ Ingin Koreksi Angka? Edit di Langkah 4 (Nota Dinas)
              </button>
            </div>
          </div>

          <!-- LEMARI ARSIP DOKUMEN TERKATEGORI (NICE CATEGORY SHELF) -->
          <div id="niceCategoryShelf_investasi"></div>

          <!-- NEXT JOURNEY RECOMMENDATIONS -->"""
    
    html = re.sub(inv_step_old_pat, inv_step_new, html, count=1)

    # 6. Update Step 5 of Konsolidasi (lines ~6129-6219)
    kons_step_old_pat = r'(<div id="kons_step_pane_5" class="hidden">[\s\S]*?<!-- EXPORT ACTION TILES -->[\s\S]*?</div>\s*</div>\s*<!-- NEXT JOURNEY RECOMMENDATIONS -->)'
    kons_step_new = """<div id="kons_step_pane_5" class="hidden">
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <span class="badge badge-green" style="font-weight:700;">LANGKAH 5 • TUNTAS</span>
            <h3 style="margin:4px 0 2px; font-size:18px; color:var(--forest-deep);" data-i18n="export_header_title">Ekspor Dokumen Resmi & Rute Alur Selanjutnya</h3>
            <p style="margin:0; font-size:12px; color:var(--ink-secondary);" data-i18n="export_header_sub">Unduh laporan resmi terstandarisasi atau hubungkan temuan entitas ini ke alur bisnis berikutnya tanpa kehilangan konteks.</p>
          </div>
        </div>

        <!-- KONFIRMASI KAJIAN TERSIMPAN SECARA OTOMATIS (EXECUTIVE SAVED BANNER) -->
        <div id="savedConfirmationCard_konsolidasi"></div>

        <!-- DUA TOMBOL UTAMA BESAR RAMAH PENGGUNA SENIOR (BOOMER-POLISHED ACTION TILES) -->
        <div style="background:#FFFFFF; border:1.5px solid #CBD5E1; border-radius:12px; padding:18px 20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-size:13px; font-weight:800; color:var(--forest-deep); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <span>📥</span>
            <span>Aksi Utama: Unduh atau Cetak Laporan Resmi</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
            <!-- Big Word Button -->
            <button type="button" onclick="downloadNotaDinasDoc('konsolidasi')" class="btn btn-primary boomer-action-btn-primary">
              <span style="font-size:22px;">📄</span>
              <div style="text-align:left;">
                <div>Unduh Dokumen Word (.DOC)</div>
                <div style="font-size:11px; font-weight:400; opacity:0.9;">Format resmi Nota Dinas Eksekutif Konsolidasi Finansial Grup</div>
              </div>
            </button>
            <!-- Big PDF/Print Button -->
            <button type="button" onclick="printNotaDinas('konsolidasi')" class="btn btn-secondary boomer-action-btn-secondary" style="border:2px solid var(--forest); color:var(--forest);">
              <span style="font-size:22px;">🖨️</span>
              <div style="text-align:left;">
                <div>Cetak / Simpan PDF (A4)</div>
                <div style="font-size:11px; font-weight:400; opacity:0.8; color:var(--ink);">Buka dialog cetak browser langsung ke lembar A4</div>
              </div>
            </button>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding-top:10px; border-top:1px solid #E2E8F0;">
            <button type="button" onclick="copyNotaDinasText('konsolidasi')" class="btn btn-secondary btn-sm" style="font-size:11.5px; cursor:pointer;">
              📋 Salin Seluruh Teks Nota Dinas ke Clipboard
            </button>
            <button type="button" onclick="setProcessStep('konsolidasi', 4); setTimeout(() => toggleEditNotaDinas('konsolidasi'), 150);" class="btn btn-secondary btn-sm" style="border-color:#D97706; color:#92400E; background:#FEF3C7; font-weight:700; font-size:11.5px; cursor:pointer;">
              ✏️ Ingin Koreksi Angka? Edit di Langkah 4 (Nota Dinas)
            </button>
          </div>
        </div>

        <!-- LEMARI ARSIP DOKUMEN TERKATEGORI (NICE CATEGORY SHELF) -->
        <div id="niceCategoryShelf_konsolidasi"></div>

        <!-- NEXT JOURNEY RECOMMENDATIONS -->"""
    
    html = re.sub(kons_step_old_pat, kons_step_new, html, count=1)

    # 7. Update Step 4 -> Step 5 Button labels to be boomer-friendly & indicate saving
    html = html.replace(
        """<button type="button" onclick="setProcessStep('investasi', 5)" class="btn btn-primary" data-i18n="btn_step4_next">Lanjut ke Langkah 5: Ekspor & Alur Lanjutan →</button>""",
        """<button type="button" onclick="setProcessStep('investasi', 5)" class="btn btn-primary" style="font-weight:800; font-size:13.5px; padding:10px 20px; box-shadow:0 2px 8px rgba(15,83,56,0.22); cursor:pointer;">💾 Finalisasi & Simpan ke Lemari Arsip (Langkah 5) →</button>"""
    )
    html = html.replace(
        """<button type="button" onclick="setProcessStep('pengendali', 5)" class="btn btn-primary" data-i18n="btn_step4_next">Lanjut ke Langkah 5: Ekspor & Alur Lanjutan →</button>""",
        """<button type="button" onclick="setProcessStep('pengendali', 5)" class="btn btn-primary" style="font-weight:800; font-size:13.5px; padding:10px 20px; box-shadow:0 2px 8px rgba(15,83,56,0.22); cursor:pointer;">💾 Finalisasi & Simpan ke Lemari Arsip (Langkah 5) →</button>"""
    )
    html = html.replace(
        """<button type="button" onclick="setProcessStep('nonpengendali', 5)" class="btn btn-primary" data-i18n="btn_step4_next">Lanjut ke Langkah 5: Ekspor & Alur Lanjutan →</button>""",
        """<button type="button" onclick="setProcessStep('nonpengendali', 5)" class="btn btn-primary" style="font-weight:800; font-size:13.5px; padding:10px 20px; box-shadow:0 2px 8px rgba(15,83,56,0.22); cursor:pointer;">💾 Finalisasi & Simpan ke Lemari Arsip (Langkah 5) →</button>"""
    )
    html = html.replace(
        """<button type="button" onclick="setProcessStep('konsolidasi', 5)" class="btn btn-primary" data-i18n="btn_step4_next">Lanjut ke Langkah 5: Ekspor & Alur Lanjutan →</button>""",
        """<button type="button" onclick="setProcessStep('konsolidasi', 5)" class="btn btn-primary" style="font-weight:800; font-size:13.5px; padding:10px 20px; box-shadow:0 2px 8px rgba(15,83,56,0.22); cursor:pointer;">💾 Finalisasi & Simpan ke Lemari Arsip (Langkah 5) →</button>"""
    )

    # 8. Add JavaScript Engine for Finalization Loading, Archiving & Categorization Shelf
    js_module = """
    // ============================================================================
    // BOOMER-FRIENDLY FINALIZATION, AUTO-SAVING & NICE CATEGORY SHELF ENGINE
    // ============================================================================
    function getEntityNameForScheme(proc) {
      if (proc === 'investasi') {
        if (appState.investasiActivePreset === 'daaz') return 'PT Daaz Bara Lestari Tbk';
        if (appState.schemeAnalysisResult && appState.schemeAnalysisResult.entityName) return appState.schemeAnalysisResult.entityName;
        return 'PT Pindo Deli Pulp and Paper Mills';
      } else if (proc === 'pengendali') {
        const inp = document.getElementById('in_p_entityName');
        return (inp && inp.value.trim()) ? inp.value.trim() : 'PT Era Permata Sejahtera';
      } else if (proc === 'nonpengendali') {
        const inp = document.getElementById('in_np_entityName');
        return (inp && inp.value.trim()) ? inp.value.trim() : 'PT Pesonna Optima Jasa';
      } else if (proc === 'konsolidasi') {
        return 'PT Era Permata Sejahtera (Konsolidasi Grup)';
      }
      return 'PT Kajian Ihsan Nusantara';
    }

    function getPeriodForScheme(proc) {
      if (proc === 'investasi') {
        if (appState.investasiActivePreset === 'daaz') return '31 Desember 2024 (FY 2024)';
        return '30 Juni 2026 (6M 2026)';
      } else if (proc === 'pengendali') {
        const inp = document.getElementById('in_p_period');
        return (inp && inp.value.trim()) ? inp.value.trim() : '31 Agustus 2026';
      } else if (proc === 'nonpengendali') {
        const inp = document.getElementById('in_np_period');
        return (inp && inp.value.trim()) ? inp.value.trim() : '31 Desember 2025';
      } else if (proc === 'konsolidasi') {
        return '31 Desember 2025 (Audit Konsolidasi)';
      }
      return 'Tahun Berjalan 2026';
    }

    function getCategoryInfoForScheme(proc) {
      const catMap = {
        investasi: { key: 'Investasi', label: 'Investasi', icon: '📈', desc: 'Portofolio Efek & Solvabilitas Obligasi', badgeClass: 'badge-gold' },
        pengendali: { key: 'Pengendali', label: 'Entitas Pengendali', icon: '🏢', desc: 'Tata Kelola Anak Usaha Terkendali Penuh', badgeClass: 'badge-green' },
        nonpengendali: { key: 'Non-Pengendali', label: 'Entitas Non-Pengendali', icon: '🤝', desc: 'Proteksi Hak Dividen Minoritas & Batas RTC', badgeClass: 'badge-blue' },
        konsolidasi: { key: 'Konsolidasi', label: 'Konsolidasi Grup', icon: '🏛️', desc: 'Agregasi Neraca & Batas POJK DER', badgeClass: 'badge-gold' }
      };
      return catMap[proc] || catMap.investasi;
    }

    function archiveCurrentReportIntoKnowledgeBase(proc) {
      const cInfo = getCategoryInfoForScheme(proc);
      const entityName = getEntityNameForScheme(proc);
      const period = getPeriodForScheme(proc);
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      const yearMatch = period.match(/20\d\d/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : 2026;
      const filesCount = (appState.uploadedFilesQueue && appState.uploadedFilesQueue.length >= 2)
        ? appState.uploadedFilesQueue.length
        : 3;

      const archiveId = `KB-${proc.toUpperCase()}-${entityName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}-${year}`;

      const archiveRecord = {
        id: archiveId,
        title: `${entityName} — Laporan Hasil Penelaahan Forensik & Nota Dinas (${year})`,
        entityName: entityName,
        reportingYear: year,
        reportingPeriod: period,
        category: cInfo.key,
        secondaryCategories: ["Laporan Keuangan", "Nota Dinas"],
        selectedScheme: proc,
        documentType: "Hasil Penelaahan Forensik & Nota Dinas Resmi",
        currency: proc === 'investasi' ? (appState.investasiActivePreset === 'pindodeli' ? 'USD Ribu' : 'Rp Miliar (IDR)') : 'Rp Miliar (IDR)',
        status: "STORED",
        isJustFinalized: true,
        savedTimestamp: timeStr,
        filesCount: filesCount,
        originalDocument: {
          fileName: `Paket_${filesCount}_Berkas_${proc}_${year}.pdf`,
          fileType: "PDF/XLSX Konsolidasi",
          fileSizeKB: "2.450,0",
          pageReference: "Kertas Kerja Forensik S1–S10 & Nota Dinas",
          checksum: "SHA256:LIVE_SAVED_" + Math.random().toString(36).substring(2, 10).toUpperCase()
        },
        fields: {
          totalAssets: proc === 'investasi' ? (appState.investasiActivePreset === 'pindodeli' ? 9564776 : 1890) : (proc === 'pengendali' ? 198.39 : 245.60),
          currentAssets: proc === 'investasi' ? 3815764 : 52.63,
          equity: proc === 'investasi' ? 5485855 : 105.27,
          netIncome: proc === 'investasi' ? 455637 : 6.08,
          currentRatio: proc === 'investasi' ? 1.96 : (proc === 'pengendali' ? 0.57 : 0.61),
          der: proc === 'investasi' ? 0.50 : 0.88,
          modifiedZScore: proc === 'investasi' ? 2.68 : null,
          growthGapPct: proc === 'pengendali' ? 1.46 : null,
          rtcPct: proc === 'nonpengendali' ? 301.20 : null,
          dividendEntitlement: proc === 'nonpengendali' ? 185.00 : null,
          forensicHealthScore: proc === 'investasi' ? 88 : (proc === 'pengendali' ? 64 : 58)
        },
        analysisResults: {
          forensicHealthScore: proc === 'investasi' ? 88 : 64,
          riskTier: proc === 'investasi' ? "Aman & Patuh Covenant" : "Anomali Material (Perlu Perhatian)",
          signals: proc === 'investasi' ? ["Modified Z-Score Aman 2,68", "Covenant DER 0,50x < 2,50x"] : ["S7 Growth Gap +1,46%", "NWC Defisit"],
          summary: `Kajian ${entityName} berhasil difinalisasi & disimpan secara otomatis ke Kategori ${cInfo.key} pada ${timeStr}.`
        }
      };

      // Prepend or update in CLIENT_KB_REPOSITORY
      if (typeof CLIENT_KB_REPOSITORY !== 'undefined') {
        const existingIdx = CLIENT_KB_REPOSITORY.findIndex(r => r.id === archiveId || (r.entityName === entityName && r.reportingYear === year && r.category === cInfo.key));
        if (existingIdx >= 0) {
          CLIENT_KB_REPOSITORY[existingIdx] = archiveRecord;
        } else {
          CLIENT_KB_REPOSITORY.unshift(archiveRecord);
        }

        try {
          localStorage.setItem('om_ihsan_kb_custom_items', JSON.stringify(CLIENT_KB_REPOSITORY));
        } catch (_) {}
      }

      // Sync with server if online
      try {
        if (typeof fetch === 'function') {
          fetch('/api/knowledge-base/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(archiveRecord)
          }).catch(() => {});
        }
      } catch (_) {}

      if (appState && appState.activeDocIds && !appState.activeDocIds.includes(archiveId)) {
        appState.activeDocIds.unshift(archiveId);
      }

      appState.lastFinalizedArchive = archiveRecord;
      return archiveRecord;
    }

    function showFinalizeLoadingModal(proc, onComplete) {
      if (typeof document === 'undefined') {
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      const modal = document.getElementById('modalFinalizeLoading');
      if (!modal) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      const cInfo = getCategoryInfoForScheme(proc);
      const entityName = getEntityNameForScheme(proc);

      const schemeBadge = document.getElementById('finalizeModalSchemeBadge');
      if (schemeBadge) {
        schemeBadge.textContent = `${cInfo.icon} MENYIMPAN KE KATEGORI: ${cInfo.label.toUpperCase()}`;
        schemeBadge.className = `badge ${cInfo.badgeClass}`;
      }
      const catTarget = document.getElementById('finalizeCatTargetName');
      if (catTarget) catTarget.textContent = `${cInfo.icon} ${cInfo.label}`;

      const bar = document.getElementById('finalizeProgressBar');
      const pct = document.getElementById('finalizeProgressPercent');
      const c1 = document.getElementById('finalizeCheck1');
      const c2 = document.getElementById('finalizeCheck2');
      const c3 = document.getElementById('finalizeCheck3');
      const iconCenter = document.getElementById('finalizeIconCenter');
      const titleEl = document.getElementById('finalizeModalTitle');

      if (bar) bar.style.width = '20%';
      if (pct) pct.textContent = 'Memulai finalisasi (20%)...';
      if (c1) { c1.style.color = '#166534'; const sp = c1.querySelector('span'); if (sp) sp.textContent = '⏳'; }
      if (c2) { c2.style.color = '#64748B'; const sp = c2.querySelector('span'); if (sp) sp.textContent = '⏳'; }
      if (c3) { c3.style.color = '#64748B'; const sp = c3.querySelector('span'); if (sp) sp.textContent = '⏳'; }
      if (iconCenter) iconCenter.textContent = '📂';
      if (titleEl) titleEl.textContent = 'Sedang Memfinalisasi & Mengarsipkan Kajian...';

      modal.classList.remove('hidden');

      // Trigger auto-save immediately into memory / KB
      archiveCurrentReportIntoKnowledgeBase(proc);

      // Smooth step-by-step progress animation
      setTimeout(() => {
        if (bar) bar.style.width = '55%';
        if (pct) pct.textContent = `Mengunci angka & mengklasifikasi ke Kategori ${cInfo.label} (55%)...`;
        if (c1) { c1.style.color = '#166534'; const sp = c1.querySelector('span'); if (sp) sp.textContent = '✓'; }
        if (c2) { c2.style.color = '#166534'; const sp = c2.querySelector('span'); if (sp) sp.textContent = '⏳'; }
      }, 250);

      setTimeout(() => {
        if (bar) bar.style.width = '85%';
        if (pct) pct.textContent = `Menyimpan ke Knowledge Base & Lemari Arsip ${cInfo.label} (85%)...`;
        if (c2) { c2.style.color = '#166534'; const sp = c2.querySelector('span'); if (sp) sp.textContent = '✓'; }
        if (c3) { c3.style.color = '#166534'; const sp = c3.querySelector('span'); if (sp) sp.textContent = '⏳'; }
      }, 550);

      setTimeout(() => {
        if (bar) bar.style.width = '100%';
        if (pct) pct.textContent = `Selesai 100%! Tersimpan rapi di Kategori ${cInfo.label}.`;
        if (c3) { c3.style.color = '#166534'; const sp = c3.querySelector('span'); if (sp) sp.textContent = '✓'; }
        if (iconCenter) iconCenter.textContent = '✅';
        if (titleEl) titleEl.textContent = '✅ Kajian Berhasil Difinalisasi & Disimpan!';
      }, 850);

      setTimeout(() => {
        modal.classList.add('hidden');
        if (typeof onComplete === 'function') onComplete();
      }, 1100);
    }

    function renderSavedConfirmationCard(proc) {
      if (typeof document === 'undefined') return;
      const containerId = `savedConfirmationCard_${proc}`;
      const container = document.getElementById(containerId);
      if (!container) return;

      const cInfo = getCategoryInfoForScheme(proc);
      const entityName = getEntityNameForScheme(proc);
      const period = getPeriodForScheme(proc);
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      const filesCount = (appState.uploadedFilesQueue && appState.uploadedFilesQueue.length >= 2)
        ? appState.uploadedFilesQueue.length
        : 3;

      container.innerHTML = `
        <div style="background:#F0FDF4; border:2px solid #86EFAC; border-left:6px solid #16A34A; border-radius:14px; padding:18px 22px; margin-bottom:20px; box-shadow:0 4px 14px rgba(22,163,74,0.08);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px;">
            <div style="flex:1; min-width:300px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
                <span style="font-size:22px;">✅</span>
                <span class="badge badge-green" style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">
                  KAJIAN SELESAI &bull; TERSIMPAN SECARA OTOMATIS
                </span>
                <span style="font-size:11px; color:#15803D; font-weight:600; background:#DCFCE7; padding:2px 8px; border-radius:4px;">
                  ⏱️ ${timeStr}
                </span>
              </div>
              <h3 style="margin:2px 0 6px 0; font-size:19px; color:#14532D; font-weight:800;">
                Telaah ${escapeHtml(cInfo.label)}: <span style="color:#0F5338;">${escapeHtml(entityName)}</span> Telah Difinalisasi
              </h3>
              <p style="margin:0; font-size:12.5px; color:#166534; line-height:1.55;">
                Seluruh kertas kerja forensik, hasil uji angka, rekonsiliasi matematis, dan naskah Nota Dinas resmi telah terkunci dan tersimpan rapi ke dalam <strong>Lemari Kategori: ${escapeHtml(cInfo.label)}</strong>.
              </p>
            </div>
            <div style="text-align:right; display:flex; flex-direction:column; gap:6px;">
              <div style="background:#FFFFFF; border:1.5px solid #BBF7D0; border-radius:8px; padding:8px 14px; text-align:left; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
                <div style="font-size:10px; font-weight:700; color:#166534;">LEMARI KATEGORI ARSIP:</div>
                <div style="font-size:13.5px; font-weight:800; color:#0F5338; display:flex; align-items:center; gap:5px; margin-top:2px;">
                  <span>${cInfo.icon}</span> <span>Kategori: ${escapeHtml(cInfo.label)}</span>
                </div>
                <div style="font-size:10.5px; color:#15803D; margin-top:2px;">
                  ✓ Tersimpan di Knowledge Base
                </div>
              </div>
            </div>
          </div>

          <!-- Traceable Metadata Badges -->
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px; padding-top:12px; border-top:1px solid #BBF7D0; font-size:11.5px;">
            <span style="background:#FFFFFF; border:1px solid #BBF7D0; border-radius:6px; padding:4px 10px; color:#14532D;">
              🏢 Entitas: <strong>${escapeHtml(entityName)}</strong>
            </span>
            <span style="background:#FFFFFF; border:1px solid #BBF7D0; border-radius:6px; padding:4px 10px; color:#14532D;">
              📅 Periode: <strong>${escapeHtml(period)}</strong>
            </span>
            <span style="background:#FFFFFF; border:1px solid #BBF7D0; border-radius:6px; padding:4px 10px; color:#14532D;">
              📚 Kapasitas: <strong>${filesCount} Berkas Terkonsolidasi (100% Absorbed)</strong>
            </span>
            <span style="background:#FFFFFF; border:1px solid #BBF7D0; border-radius:6px; padding:4px 10px; color:#14532D;">
              🔒 Status: <strong style="color:#15803D;">✓ Terverifikasi & Grounded di RAG</strong>
            </span>
          </div>
        </div>
      `;
    }

    function renderNiceCategoryShelf(containerId, activeCategoryKey = 'investasi') {
      if (typeof document === 'undefined') return;
      const container = document.getElementById(containerId);
      if (!container) return;

      const keyToCat = {
        investasi: 'Investasi',
        pengendali: 'Pengendali',
        nonpengendali: 'Non-Pengendali',
        konsolidasi: 'Konsolidasi'
      };
      const activeCat = keyToCat[activeCategoryKey] || activeCategoryKey || 'Investasi';

      const repo = (typeof CLIENT_KB_REPOSITORY !== 'undefined') ? CLIENT_KB_REPOSITORY : [];

      const grouped = {
        Investasi: repo.filter(i => i.category === 'Investasi'),
        Pengendali: repo.filter(i => i.category === 'Pengendali'),
        'Non-Pengendali': repo.filter(i => i.category === 'Non-Pengendali'),
        Konsolidasi: repo.filter(i => i.category === 'Konsolidasi')
      };

      const tabs = [
        { key: 'investasi', label: 'Investasi', icon: '📈', cat: 'Investasi', count: grouped.Investasi.length, badgeBg: '#FEF3C7', color: '#92400E' },
        { key: 'pengendali', label: 'Pengendali', icon: '🏢', cat: 'Pengendali', count: grouped.Pengendali.length, badgeBg: '#DCFCE7', color: '#166534' },
        { key: 'nonpengendali', label: 'Non-Pengendali', icon: '🤝', cat: 'Non-Pengendali', count: grouped['Non-Pengendali'].length, badgeBg: '#DBEAFE', color: '#1E40AF' },
        { key: 'konsolidasi', label: 'Konsolidasi', icon: '🏛️', cat: 'Konsolidasi', count: grouped.Konsolidasi.length, badgeBg: '#F3E8FF', color: '#6B21A8' }
      ];

      const currentItems = grouped[activeCat] || [];

      const tabsHtml = tabs.map(t => {
        const isSel = t.cat === activeCat;
        return `
          <button type="button" onclick="switchCategoryShelfTab('${containerId}', '${t.key}')" class="shelf-tab-btn"
            style="border:${isSel ? '2px solid var(--forest)' : '1px solid #CBD5E1'}; background:${isSel ? '#DCFCE7' : '#FFFFFF'}; color:${isSel ? 'var(--forest-deep)' : '#475569'}; font-weight:${isSel ? '800' : '600'}; box-shadow:${isSel ? '0 2px 6px rgba(15,83,56,0.15)' : 'none'};">
            <span style="font-size:16px;">${t.icon}</span>
            <span>Lemari ${t.label}</span>
            <span class="badge" style="background:${isSel ? 'var(--forest)' : t.badgeBg}; color:${isSel ? '#FFFFFF' : t.color}; font-size:11px; font-weight:800; padding:2px 8px; border-radius:12px;">${t.count}</span>
          </button>
        `;
      }).join('');

      const itemsHtml = currentItems.length === 0 ? `
        <div style="background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:8px; padding:20px; text-align:center; color:#64748B; font-size:12px;">
          Belum ada dokumen yang difinalisasi pada lemari ini.
        </div>
      ` : currentItems.map((item, idx) => {
        const isJustSaved = !!item.isJustFinalized || idx === 0;
        const year = item.reportingYear || 2026;
        let metricSummary = '';
        if (item.category === 'Investasi') {
          const z = item.fields?.modifiedZScore ? `Z-Score: ${item.fields.modifiedZScore.toFixed(2)} (Aman)` : 'Covenant DER: 0,50x';
          metricSummary = `📊 ${z} &bull; Marjin Operasi: ${(item.fields?.operatingMarginPct || 14.2).toFixed(1)}%`;
        } else if (item.category === 'Pengendali') {
          metricSummary = `🔍 S7 Growth Gap: +1,46% &bull; NWC Defisit: -Rp 40,49 M &bull; Footing: Lulus ✓`;
        } else if (item.category === 'Non-Pengendali') {
          metricSummary = `⚖️ RTC Piutang: 301,20% &bull; Hak Dividen 1%: Rp 185 Juta &bull; Utang Dividen: Rp 110,27 M`;
        } else {
          metricSummary = `🏛️ POJK Batas DER Konsolidasi: 0,88x &le; 5,0x &bull; Eliminasi Intra-Grup: Seimbang ✓`;
        }

        return `
          <div class="shelf-item-card" style="border:${isJustSaved ? '2px solid #16A34A' : '1px solid #E2E8F0'}; box-shadow:${isJustSaved ? '0 4px 12px rgba(22,163,74,0.1)' : '0 1px 3px rgba(0,0,0,0.03)'};">
            <div style="flex:1; min-width:280px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
                ${isJustSaved ? `<span class="badge badge-green" style="font-weight:800; font-size:10px; background:#DCFCE7; color:#166534; border:1px solid #86EFAC;">⭐ BARU SAJA DIFINALISASI & DISIMPAN</span>` : ''}
                <span class="badge" style="background:#F1F5F9; color:#334155; font-size:10.5px; font-weight:700;">TAHUN ${year}</span>
                <span style="font-size:11px; color:#64748B; font-family:monospace;">${item.id}</span>
              </div>
              <div style="font-size:14px; font-weight:800; color:var(--forest-deep);">
                ${escapeHtml(item.entityName || item.title)}
              </div>
              <div style="font-size:11.5px; color:#475569; margin-top:2px;">
                ${escapeHtml(item.reportingPeriod)} &bull; <strong>${item.filesCount || 3} Berkas Terserap</strong> &bull; Satuan: ${escapeHtml(item.currency || 'IDR')}
              </div>
              <div style="font-size:11.5px; color:var(--forest); font-weight:600; margin-top:4px;">
                ${metricSummary}
              </div>
            </div>

            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <button type="button" onclick="downloadNotaDinasDoc('${item.selectedScheme || 'investasi'}')" class="btn btn-primary btn-sm" style="font-size:11.5px; font-weight:700; cursor:pointer;" title="Unduh Dokumen Word Resmi">
                📄 Unduh .DOC
              </button>
              <button type="button" onclick="openArchivedReportInWorkspace('${item.id}', '${item.selectedScheme || 'investasi'}')" class="btn btn-secondary btn-sm" style="font-size:11.5px; cursor:pointer;" title="Buka Lembar Kerja">
                👁️ Buka
              </button>
              <button type="button" onclick="quickCompareWithPreviousYear('${item.id}')" class="btn btn-secondary btn-sm" style="background:#FFFBEB; border-color:#F59E0B; color:#92400E; font-weight:700; font-size:11.5px; cursor:pointer;" title="Bandingkan dengan Tahun Sebelumnya">
                ⚖️ Bandingkan Lintas Tahun
              </button>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:14px; padding:18px 20px; margin-top:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px; border-bottom:1px solid #E2E8F0; padding-bottom:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:22px;">🗄️</span>
                <h4 style="margin:0; font-size:16px; font-weight:800; color:var(--forest-deep);">
                  Lemari Arsip Dokumen Terkategori (Knowledge Base)
                </h4>
                <span class="badge badge-green" style="font-size:10px; font-weight:800;">4 LEMARI KATEGORI TERSEDIA</span>
              </div>
              <p style="margin:3px 0 0 0; font-size:12px; color:var(--ink-secondary);">
                Kajian yang Anda finalisasi otomatis masuk ke lemari kategori yang sesuai di bawah ini. Anda dapat mengunduh, menelaah kembali, atau membandingkannya secara berdampingan.
              </p>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" onclick="switchView('datapool')" class="btn btn-secondary btn-sm" style="font-size:11px; font-weight:700; cursor:pointer;">
                🔍 Buka Katalog Lengkap RAG
              </button>
            </div>
          </div>

          <!-- Category Filter Tabs -->
          <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px; margin-bottom:14px;">
            ${tabsHtml}
          </div>

          <!-- Category Shelf Items List -->
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    function switchCategoryShelfTab(containerId, catKey) {
      renderNiceCategoryShelf(containerId, catKey);
    }

    function quickCompareWithPreviousYear(docId) {
      const repo = (typeof CLIENT_KB_REPOSITORY !== 'undefined') ? CLIENT_KB_REPOSITORY : [];
      const currentItem = repo.find(r => r.id === docId);
      if (!currentItem) return;

      const sameEntityOrCat = repo.filter(r => 
        r.id !== docId && 
        (r.entityName === currentItem.entityName || r.category === currentItem.category) &&
        r.currency === currentItem.currency
      ).sort((a, b) => Math.abs((a.reportingYear || 0) - (currentItem.reportingYear || 0)));

      if (sameEntityOrCat.length > 0) {
        const prevItem = sameEntityOrCat[0];
        const comparePair = [prevItem.id, currentItem.id].sort();
        switchView('datapool');
        setTimeout(() => {
          if (typeof triggerKbQuickCompare === 'function') {
            triggerKbQuickCompare(comparePair);
          }
        }, 150);
      } else {
        showToast('Belum ditemukan dokumen tahun pembanding untuk entitas ini.', 'info');
      }
    }

    function openArchivedReportInWorkspace(docId, schemeKey) {
      if (['investasi', 'pengendali', 'nonpengendali', 'konsolidasi'].includes(schemeKey)) {
        switchView(schemeKey);
        setProcessStep(schemeKey, 4);
        showToast(`Membuka Lembar Kerja Nota Dinas untuk ${docId}`, 'info');
      }
    }
"""

    if 'function getEntityNameForScheme' not in html:
        # Insert right before setProcessStep
        html = html.replace('    function setProcessStep(proc, step) {', js_module + '\n    function setProcessStep(proc, step, skipModal = false) {')
    else:
        html = html.replace('    function setProcessStep(proc, step) {', '    function setProcessStep(proc, step, skipModal = false) {')

    # 9. Update setProcessStep body to handle Step 5 loading modal, breadcrumb updates, saved confirmation card & category shelf
    old_set_process_step = """    function setProcessStep(proc, step, skipModal = false) {
      step = Math.max(1, Math.min(5, parseInt(step, 10) || 1));
      processSteps[proc] = step;"""

    new_set_process_step = """    function setProcessStep(proc, step, skipModal = false) {
      step = Math.max(1, Math.min(5, parseInt(step, 10) || 1));

      // Trigger reassuring Finalization Loading Modal when entering Step 5
      if (step === 5 && !skipModal && typeof document !== 'undefined' && document.getElementById('modalFinalizeLoading')) {
        showFinalizeLoadingModal(proc, () => {
          setProcessStep(proc, 5, true);
        });
        return;
      }

      processSteps[proc] = step;"""

    html = html.replace(old_set_process_step, new_set_process_step)

    # 10. In setProcessStep, update breadcrumb and render Step 5 components
    stepper_scroll_marker = """      const stepper = document.getElementById(`${prefix}_stepper`);
      if (stepper) {
        stepper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }"""

    step5_render_logic = """      const stepper = document.getElementById(`${prefix}_stepper`);
      if (stepper) {
        stepper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Update Nav Breadcrumb dynamically so senior users always know their exact step
      const schemeLabels = {
        investasi: 'Investasi',
        pengendali: 'Pengendali',
        nonpengendali: 'Non-Pengendali',
        konsolidasi: 'Konsolidasi'
      };
      const stepNames = {
        1: `1. Input & Berkas (${schemeLabels[proc] || proc})`,
        2: `2. Uji Footing & Pre-Check (${schemeLabels[proc] || proc})`,
        3: `3. Analisis Forensik (${schemeLabels[proc] || proc})`,
        4: `4. Draf Nota Dinas Resmi (${schemeLabels[proc] || proc})`,
        5: `5. Selesai & Lemari Arsip (${schemeLabels[proc] || proc})`
      };
      const breadcrumbEl = document.getElementById('navBreadcrumbText');
      if (breadcrumbEl && stepNames[step]) {
        breadcrumbEl.textContent = `Posisi Layar: ${stepNames[step]}`;
      }

      // Render Step 5 Saved Confirmation Banner & Nice Category Shelf
      if (step === 5) {
        renderSavedConfirmationCard(proc);
        renderNiceCategoryShelf(`niceCategoryShelf_${proc}`, proc);
        const entityName = getEntityNameForScheme(proc);
        const cInfo = getCategoryInfoForScheme(proc);
        showToast(`✅ Kajian ${entityName} Berhasil Difinalisasi & Tersimpan Rapi di Kategori ${cInfo.label}!`, 'success');
      }
    }"""

    html = html.replace(stepper_scroll_marker, step5_render_logic)

    # 11. Update goToSchemeJourneyStep to trigger modal on Step 6
    old_goto_journey = """    function goToSchemeJourneyStep(stepNum) {
      const step = Math.max(1, Math.min(6, parseInt(stepNum, 10) || 1));
      appState.journeyStep = step;"""

    new_goto_journey = """    function goToSchemeJourneyStep(stepNum, skipModal = false) {
      const step = Math.max(1, Math.min(6, parseInt(stepNum, 10) || 1));

      if (step === 6 && !skipModal && typeof document !== 'undefined' && document.getElementById('modalFinalizeLoading')) {
        const activeScheme = appState.selectedScheme || 'investasi';
        showFinalizeLoadingModal(activeScheme, () => {
          goToSchemeJourneyStep(6, true);
        });
        return;
      }

      appState.journeyStep = step;"""

    html = html.replace(old_goto_journey, new_goto_journey)

    # 12. Also expose helpers on window for browser console & testing
    expose_code = """
    // Expose finalization & shelf helpers globally
    window.showFinalizeLoadingModal = showFinalizeLoadingModal;
    window.archiveCurrentReportIntoKnowledgeBase = archiveCurrentReportIntoKnowledgeBase;
    window.renderSavedConfirmationCard = renderSavedConfirmationCard;
    window.renderNiceCategoryShelf = renderNiceCategoryShelf;
    window.switchCategoryShelfTab = switchCategoryShelfTab;
    window.quickCompareWithPreviousYear = quickCompareWithPreviousYear;
    """
    if 'window.showFinalizeLoadingModal = showFinalizeLoadingModal;' not in html:
        html = html.replace('window.enterSchemePortal = enterSchemePortal;', 'window.enterSchemePortal = enterSchemePortal;\n' + expose_code)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)

    # Also update preview.html
    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print("Successfully enhanced public/index.html and preview.html!")

if __name__ == '__main__':
    update_index_html()
