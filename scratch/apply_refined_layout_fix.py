import os
import shutil

index_path = 'public/index.html'
preview_path = 'preview.html'

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update <head><style> to include global media print and executive compact mode
style_anchor = "    .boomer-action-btn-secondary:hover {\n      transform: translateY(-2px);\n    }\n\n  </style>"

global_print_css = """    .boomer-action-btn-secondary:hover {
      transform: translateY(-2px);
    }

    /* Executive Compact Mode: Clean, Uncluttered 3-Page Executive Standard on Screen */
    .nota-dinas-container.executive-compact-mode .boomer-chart-card,
    .nota-dinas-container.executive-compact-mode .nd-s1-s10-audit-section,
    .nota-dinas-container.executive-compact-mode #argonRagDeepDiveWidget,
    .nota-dinas-container.executive-compact-mode .interactive-rag-widget {
      display: none !important;
    }

    .page-break-after {
      page-break-after: always !important;
      break-after: page !important;
    }

    /* ========================================================================= */
    /* GLOBAL MEDIA PRINT STYLING (EXECUTIVE 3-PAGE NEAT STANDARD & ZERO CLUTTER) */
    /* ========================================================================= */
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 12mm 15mm;
    }

    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #FFFFFF !important;
        color: #0F172A !important;
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-size: 8.5pt !important;
        line-height: 1.38 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .app-header,
      .process-hub-header,
      #omIhsanExecutiveGateway,
      #boomerQuickGuide,
      #threeDedicatedPortalsGrid,
      .entity-nav-strip,
      .step-actions-bar,
      .nota-dinas-actions,
      .process-cards-container,
      .upload-box,
      .dropzone,
      .file-preview,
      .toast-container,
      .modal-backdrop,
      .modal,
      .copilot-drawer,
      .btn,
      .btn-sm,
      .btn-primary,
      .btn-secondary,
      .btn-gold,
      .btn-danger,
      .export-format-selector,
      .executive-mode-selector-bar,
      .layout-toggle-group,
      .nota-dinas-edit-banner,
      .nota-dinas-edited-badge,
      .extended-audit-details,
      .nd-s1-s10-audit-section,
      .boomer-chart-card,
      #argonRagDeepDiveWidget,
      .interactive-rag-widget,
      .no-print {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .main-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }

      .nota-dinas-container {
        display: block !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
      }

      .nota-dinas-header h3 {
        font-size: 13.5pt !important;
        font-weight: 800 !important;
        color: #0A2540 !important;
        text-align: center !important;
        margin: 0 0 2pt 0 !important;
        letter-spacing: 0.5px !important;
      }

      .nota-dinas-header h4 {
        font-size: 10.5pt !important;
        font-weight: 700 !important;
        color: #1D4ED8 !important;
        text-align: center !important;
        margin: 0 0 4pt 0 !important;
      }

      .nota-dinas-header span {
        font-size: 8pt !important;
        color: #64748B !important;
        display: block !important;
        text-align: center !important;
        margin-bottom: 8pt !important;
      }

      .nota-dinas-meta-table {
        border: 1px solid #CBD5E1 !important;
        background: #F8FAFC !important;
        width: 100% !important;
        margin-bottom: 8pt !important;
        font-size: 8pt !important;
      }

      .nota-dinas-meta-table td {
        padding: 3pt 5pt !important;
        border: none !important;
        border-bottom: 1px solid #E2E8F0 !important;
      }

      .nota-dinas-meta-label {
        font-weight: 700 !important;
        color: #334155 !important;
        width: 18% !important;
      }

      .eo-section {
        margin-bottom: 6pt !important;
        page-break-inside: auto;
      }

      .eo-section-header {
        display: flex !important;
        align-items: center !important;
        gap: 6pt !important;
        border-bottom: 1.5pt solid #0A2540 !important;
        padding-bottom: 2pt !important;
        margin-bottom: 4pt !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      .eo-section-num {
        background: #0A2540 !important;
        color: #FFFFFF !important;
        font-size: 8pt !important;
        font-weight: 800 !important;
        padding: 1pt 5pt !important;
        border-radius: 3px !important;
      }

      .eo-section-title {
        font-size: 9.5pt !important;
        font-weight: 800 !important;
        color: #0A2540 !important;
        margin: 0 !important;
      }

      table.eo-table, table.nd-signal-matrix-table, table.pattern-matrix-table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin: 4pt 0 6pt 0 !important;
        font-size: 8pt !important;
        border: 1px solid #CBD5E1 !important;
      }

      table.eo-table th, table.nd-signal-matrix-table th, table.pattern-matrix-table th {
        background: #0A2540 !important;
        color: #FFFFFF !important;
        font-weight: 700 !important;
        padding: 3.5pt 5pt !important;
        font-size: 7.5pt !important;
        border: 1px solid #CBD5E1 !important;
      }

      table.eo-table td, table.nd-signal-matrix-table td, table.pattern-matrix-table td {
        padding: 3pt 5pt !important;
        border: 1px solid #E2E8F0 !important;
        font-size: 8pt !important;
      }

      tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      p, li {
        font-size: 8pt !important;
        line-height: 1.38 !important;
        margin: 0 0 3.5pt 0 !important;
        text-align: justify !important;
      }

      .page-break-after {
        page-break-after: always !important;
        break-after: page !important;
      }
    }

  </style>"""

assert style_anchor in html, "style_anchor not found in index.html"
html = html.replace(style_anchor, global_print_css)
print("1. Injected global print CSS and executive compact mode")

# 2. Add executive-mode-selector-bar to each container
def make_selector_bar(mode):
    return f"""              <!-- EXECUTIVE LAYOUT TOGGLE BAR (STANDAR 3-HALAMAN VS LENGKAP) -->
              <div class="executive-mode-selector-bar no-print" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:10px; padding:10px 16px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:16px;">📑</span>
                  <div>
                    <strong style="font-size:13px; color:#0A2540;">Format Tampilan Layar &amp; Cetak:</strong>
                    <span style="font-size:11.5px; color:#64748B;">Pilih tingkat rincian tata letak dokumen</span>
                  </div>
                </div>
                <div class="layout-toggle-group" style="display:flex; gap:6px;">
                  <button type="button" class="btn btn-sm layout-btn" id="btnLayoutExecutive_{mode}" onclick="toggleLayoutMode('{mode}', 'executive')" style="font-weight:700; font-size:12px; padding:6px 14px; border-radius:6px; background:#0A2540; color:#FFFFFF; border:1px solid #0A2540; cursor:pointer;">
                    📄 Format Ringkas Eksekutif (Standar 3-Halaman)
                  </button>
                  <button type="button" class="btn btn-sm layout-btn" id="btnLayoutExtended_{mode}" onclick="toggleLayoutMode('{mode}', 'extended')" style="font-weight:700; font-size:12px; padding:6px 14px; border-radius:6px; background:#FFFFFF; color:#334155; border:1px solid #CBD5E1; cursor:pointer;">
                    📊 Format Lengkap (Dengan Grafik &amp; Kertas Kerja S1-S10)
                  </button>
                </div>
              </div>"""

# Container replacements with exact indentation:
# 1. Pengendali
old_pengendali = '            <div id="ndPengendaliBox" class="nota-dinas-container">\n              <div class="nota-dinas-header">'
new_pengendali = f'            <div id="ndPengendaliBox" class="nota-dinas-container executive-compact-mode">\n{make_selector_bar("pengendali")}\n              <div class="nota-dinas-header">'
assert old_pengendali in html, "old_pengendali not found"
html = html.replace(old_pengendali, new_pengendali)

# 2. Non-Pengendali
old_nonpeng = '          <div id="ndNonPengendaliBox" class="nota-dinas-container">\n            <div class="nota-dinas-header">'
new_nonpeng = f'          <div id="ndNonPengendaliBox" class="nota-dinas-container executive-compact-mode">\n{make_selector_bar("non_pengendali")}\n            <div class="nota-dinas-header">'
assert old_nonpeng in html, "old_nonpeng not found"
html = html.replace(old_nonpeng, new_nonpeng)

# 3. Investasi Pindo Deli
old_inv_pindo = '            <div id="ndInvestasiBox" class="nota-dinas-container">\n              <div class="nota-dinas-header">'
new_inv_pindo = f'            <div id="ndInvestasiBox" class="nota-dinas-container executive-compact-mode">\n{make_selector_bar("investasi")}\n              <div class="nota-dinas-header">'
assert old_inv_pindo in html, "old_inv_pindo not found"
html = html.replace(old_inv_pindo, new_inv_pindo)

# 4. Investasi DAAZ
old_inv_daaz = '            <div id="ndInvestasiDaazBox" class="nota-dinas-container">\n              <div class="nota-dinas-header">'
new_inv_daaz = f'            <div id="ndInvestasiDaazBox" class="nota-dinas-container executive-compact-mode">\n{make_selector_bar("investasi_daaz")}\n              <div class="nota-dinas-header">'
assert old_inv_daaz in html, "old_inv_daaz not found"
html = html.replace(old_inv_daaz, new_inv_daaz)

# 5. Konsolidasi
old_kons = '        <div id="ndKonsolidasiBox" class="nota-dinas-container">\n          <div class="nota-dinas-header">'
new_kons = f'        <div id="ndKonsolidasiBox" class="nota-dinas-container executive-compact-mode">\n{make_selector_bar("konsolidasi")}\n          <div class="nota-dinas-header">'
assert old_kons in html, "old_kons not found"
html = html.replace(old_kons, new_kons)

print("2. Injected executive-mode-selector-bar and executive-compact-mode to all 5 containers")

# 3. Add page-break-after markers in ndInvestasiBox
p1_break_anchor = """                  <p>
                    Sebaliknya, laba neto melonjak 210,3%. Pendorong utama bukan penjualan, melainkan kenaikan bagian laba entitas asosiasi sebesar sekitar USD136,5 juta dan kenaikan laba selisih kurs sekitar USD134,9 juta. Karena itu, kualitas laba perlu dipisahkan antara laba yang berasal dari operasi inti dan laba yang berasal dari faktor non-operasional.
                  </p>
                </div>

                <!-- SEKSI 3: ANALISIS VERTIKAL -->"""

p1_break_new = """                  <p>
                    Sebaliknya, laba neto melonjak 210,3%. Pendorong utama bukan penjualan, melainkan kenaikan bagian laba entitas asosiasi sebesar sekitar USD136,5 juta dan kenaikan laba selisih kurs sekitar USD134,9 juta. Karena itu, kualitas laba perlu dipisahkan antara laba yang berasal dari operasi inti dan laba yang berasal dari faktor non-operasional.
                  </p>
                </div>

                <div class="page-break-after"></div>

                <!-- SEKSI 3: ANALISIS VERTIKAL -->"""

assert p1_break_anchor in html, "p1_break_anchor not found"
html = html.replace(p1_break_anchor, p1_break_new)

p2_break_anchor = """                  <p>
                    Current ratio Juni 2026 sekitar 1,96x menunjukkan likuiditas yang secara indikatif masih berada di atas batas minimum 1,00x yang ditemukan pada fasilitas kredit. Leverage juga relatif rendah. Namun DSCR belum boleh disimpulkan hanya dari laporan laba rugi karena formula debt service harus mengikuti definisi kontraktual.
                  </p>
                </div>

                <!-- SEKSI 6: PENILAIAN DARI PERSPEKTIF INVESTOR -->"""

p2_break_new = """                  <p>
                    Current ratio Juni 2026 sekitar 1,96x menunjukkan likuiditas yang secara indikatif masih berada di atas batas minimum 1,00x yang ditemukan pada fasilitas kredit. Leverage juga relatif rendah. Namun DSCR belum boleh disimpulkan hanya dari laporan laba rugi karena formula debt service harus mengikuti definisi kontraktual.
                  </p>
                </div>

                <div class="page-break-after"></div>

                <!-- SEKSI 6: PENILAIAN DARI PERSPEKTIF INVESTOR -->"""

assert p2_break_anchor in html, "p2_break_anchor not found"
html = html.replace(p2_break_anchor, p2_break_new)

print("3. Added page break markers between pages 1, 2, and 3 in ndInvestasiBox")

# 4. Update setExportFormat and printNotaDinas and downloadNotaDinasDoc in JavaScript
old_export_js = """    function setExportFormat(mode, format) {
      if (!window.appState) window.appState = {};
      window.appState.exportFormat = format;
      const radios = document.querySelectorAll(`input[name="exportFormat_${mode}"]`);
      radios.forEach(r => { if (r.value === format) r.checked = true; });
      showToast(`Format ekspor diatur ke: ${format === 'executive' ? 'Format Eksekutif Resmi (~3 Hal)' : 'Kertas Kerja Lengkap S1-S10'}`, 'info');
    }

    function printNotaDinas(mode, forcedFormat) {
      const el = getNotaDinasElement(mode);
      if (!el) {
        showToast('Dokumen Nota Dinas belum tersedia', 'warning');
        return;
      }
      const format = forcedFormat || (window.appState && window.appState.exportFormat) || 'executive';
      const clone = el.cloneNode(true);

      // Remove UI actions and interactive widgets
      clone.querySelectorAll('.nota-dinas-actions, .nota-dinas-edit-banner, .nota-dinas-edited-badge, .step-actions-bar, .export-format-selector').forEach(c => c.remove());
      clone.removeAttribute('contenteditable');
      clone.querySelectorAll('[contenteditable]').forEach(c => c.removeAttribute('contenteditable'));
      clone.classList.remove('editing-mode');

      // In Executive Mode (matching official Expected Output), exclude raw 21-page 9-component diagnostic tables & interactive chat
      if (format === 'executive') {
        const deepDive = clone.querySelector('#argonRagDeepDiveWidget');
        if (deepDive) deepDive.remove();
        clone.querySelectorAll('.extended-audit-details, .no-print').forEach(c => c.remove());
      }"""

new_export_js = """    function setExportFormat(mode, format) {
      if (!window.appState) window.appState = {};
      window.appState.exportFormat = format;
      const radios = document.querySelectorAll(`input[name="exportFormat_${mode}"]`);
      radios.forEach(r => { if (r.value === format) r.checked = true; });

      // Synchronize on-screen layout class
      const box = getNotaDinasElement(mode);
      if (box) {
        if (format === 'executive') {
          box.classList.add('executive-compact-mode');
        } else {
          box.classList.remove('executive-compact-mode');
        }
      }

      // Synchronize layout toggle button styles
      const btnExec = document.getElementById(`btnLayoutExecutive_${mode}`);
      const btnExt = document.getElementById(`btnLayoutExtended_${mode}`);
      if (btnExec && btnExt) {
        if (format === 'executive') {
          btnExec.style.background = '#0A2540';
          btnExec.style.color = '#FFFFFF';
          btnExec.style.borderColor = '#0A2540';
          btnExt.style.background = '#FFFFFF';
          btnExt.style.color = '#334155';
          btnExt.style.borderColor = '#CBD5E1';
        } else {
          btnExt.style.background = '#0A2540';
          btnExt.style.color = '#FFFFFF';
          btnExt.style.borderColor = '#0A2540';
          btnExec.style.background = '#FFFFFF';
          btnExec.style.color = '#334155';
          btnExec.style.borderColor = '#CBD5E1';
        }
      }

      showToast(`Format ekspor diatur ke: ${format === 'executive' ? 'Format Eksekutif Resmi (~3 Hal)' : 'Kertas Kerja Lengkap S1-S10'}`, 'info');
    }

    function toggleLayoutMode(mode, format) {
      setExportFormat(mode, format);
    }

    function printNotaDinas(mode, forcedFormat) {
      const el = getNotaDinasElement(mode);
      if (!el) {
        showToast('Dokumen Nota Dinas belum tersedia', 'warning');
        return;
      }
      const format = forcedFormat || (window.appState && window.appState.exportFormat) || 'executive';
      const clone = el.cloneNode(true);

      // Remove UI actions, selectors, and interactive widgets
      clone.querySelectorAll('.nota-dinas-actions, .nota-dinas-edit-banner, .nota-dinas-edited-badge, .step-actions-bar, .export-format-selector, .executive-mode-selector-bar, .layout-toggle-group, .btn').forEach(c => c.remove());
      clone.removeAttribute('contenteditable');
      clone.querySelectorAll('[contenteditable]').forEach(c => c.removeAttribute('contenteditable'));
      clone.classList.remove('editing-mode');

      // In Executive Mode (matching official Expected Output 3-page standard):
      // Exclude bulky bar charts, diagnostic tables, and interactive chat
      if (format === 'executive') {
        clone.querySelectorAll('#argonRagDeepDiveWidget, .interactive-rag-widget, .boomer-chart-card, .nd-s1-s10-audit-section, .extended-audit-details, .nd-signal-card, .no-print').forEach(c => c.remove());
      } else {
        clone.querySelectorAll('#argonRagDeepDiveWidget, .no-print').forEach(c => c.remove());
      }"""

assert old_export_js in html, "old_export_js not found"
html = html.replace(old_export_js, new_export_js)
print("4. Updated setExportFormat, toggleLayoutMode, and printNotaDinas")

# 5. Update downloadNotaDinasDoc stripping
old_doc_strip = """      // In Executive Mode, exclude 21-page 9-component diagnostic tables & interactive chat
      if (format === 'executive') {
        const deepDive = clone.querySelector('#argonRagDeepDiveWidget');
        if (deepDive) deepDive.remove();
        clone.querySelectorAll('.extended-audit-details, .no-print').forEach(c => c.remove());
      }"""

new_doc_strip = """      // In Executive Mode, exclude bulky bar charts, diagnostic tables & interactive chat
      if (format === 'executive') {
        clone.querySelectorAll('#argonRagDeepDiveWidget, .interactive-rag-widget, .boomer-chart-card, .nd-s1-s10-audit-section, .extended-audit-details, .nd-signal-card, .no-print').forEach(c => c.remove());
      } else {
        clone.querySelectorAll('#argonRagDeepDiveWidget, .no-print').forEach(c => c.remove());
      }"""

assert old_doc_strip in html, "old_doc_strip not found"
html = html.replace(old_doc_strip, new_doc_strip)
print("5. Updated downloadNotaDinasDoc stripping")

# 6. Update print styling in printWin
old_print_win_style = """            body {
              font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 9.5pt;
              line-height: 1.45;
              color: #0F172A;
              padding: 20px;
              background: #FFFFFF;
              max-width: 820px;
              margin: 0 auto;
            }"""

new_print_win_style = """            body {
              font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 9pt;
              line-height: 1.4;
              color: #0F172A;
              padding: 16px;
              background: #FFFFFF;
              max-width: 800px;
              margin: 0 auto;
            }
            .page-break-after {
              page-break-after: always !important;
              break-after: page !important;
            }"""

assert old_print_win_style in html, "old_print_win_style not found"
html = html.replace(old_print_win_style, new_print_win_style)
print("6. Updated printWin body style")

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)

shutil.copyfile(index_path, preview_path)
print("7. Successfully updated public/index.html and synchronized to preview.html")
