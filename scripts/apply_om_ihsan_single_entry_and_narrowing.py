#!/usr/bin/env python3
"""
Script to apply the executive single-door entry point ("Hi Ihsan, Mau Analisa Apa Hari Ini?")
and the narrowing journey to public/index.html and preview.html.
"""

import re
import sys

def main():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update the process-hub-header and omIhsanExecutiveGateway
    # Let's check existing lines around process-hub-header
    old_header_pattern = r'<!-- PROCESS HUB EXECUTIVE HEADER -->[\s\S]*?<!-- ========================================================================= -->\s*<!-- DEDICATED 3-SCHEME ENTRY GATEWAY'
    
    new_header = '''<!-- PROCESS HUB EXECUTIVE HEADER & OM IHSAN EXECUTIVE GATEWAY (PAGE 1: SINGLE ENTRY POINT, ZERO LOGIN) -->
      <div id="omIhsanExecutiveGateway" class="process-hub-header" style="background:linear-gradient(135deg, #064E3B 0%, #0F5338 60%, #15803D 100%); border-radius:18px; padding:28px 32px; color:#FFFFFF; margin-bottom:22px; box-shadow:0 8px 30px rgba(6,78,59,0.22); border:2px solid #86EFAC;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div style="max-width:760px;">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.16); border:1px solid rgba(255,255,255,0.3); border-radius:30px; padding:6px 16px; margin-bottom:12px;">
              <span style="font-size:15px;">👋</span>
              <span class="badge badge-gold" style="font-size:11.5px; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; color:#14532D; background:#FEF08A; border:none; margin:0;" data-i18n="hub_badge">SELAMAT DATANG DI KAJIAN IHSAN • AKSES EKSEKUTIF</span>
            </div>
            <h1 class="process-hub-title" id="txt_brand_hub_title" data-i18n="hub_title" style="margin:0 0 10px 0; font-size:32px; font-weight:900; line-height:1.2; letter-spacing:-0.5px; color:#FFFFFF; text-shadow:0 2px 4px rgba(0,0,0,0.2);">
              Hi Ihsan, Mau Analisa Apa Hari Ini?
            </h1>
            <p class="process-hub-sub" id="txt_brand_hub_sub" data-i18n="hub_sub" style="margin:0; font-size:15.5px; color:#DCFCE7; line-height:1.6; font-weight:500;">
              Silakan pilih <strong>1 dari 3 pintu fokus analisis</strong> di bawah ini. Sistem langsung mengerucutkan layar (narrowing) hanya untuk alur kerja yang Anda pilih, lengkap dengan kapasitas penyerapan &ge; 3 berkas, kalkulasi otomatis, dan Nota Dinas siap saji tanpa perlu login.
            </p>
          </div>
          <div style="text-align:right;">
            <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.25); border-radius:14px; padding:14px 20px; display:inline-block; text-align:left; backdrop-filter:blur(6px);">
              <div style="font-size:11px; font-weight:700; color:#86EFAC; text-transform:uppercase; letter-spacing:0.5px;">Status Akses</div>
              <div style="font-size:14.5px; font-weight:800; color:#FFFFFF; display:flex; align-items:center; gap:8px; margin-top:3px;">
                <span style="width:10px; height:10px; border-radius:50%; background:#22C55E; box-shadow:0 0 10px #22C55E; display:inline-block;"></span>
                Langsung Terbuka (Tanpa Perlu Login)
              </div>
              <div style="font-size:12px; color:#E2E8F0; margin-top:5px; font-weight:600;">
                ⚡ Kapasitas Kolektif &ge; 3 Berkas per Skema
              </div>
              <div style="margin-top:10px; display:flex; gap:6px;">
                <button type="button" onclick="switchView('datapool')" class="btn btn-gold btn-sm" style="font-weight:700; font-size:11.5px; padding:5px 12px; cursor:pointer;">
                  📚 <span data-i18n="btn_datapool_nav">Data Pool & Pola AI</span>
                </button>
                <button type="button" onclick="switchView('settings')" class="btn btn-secondary btn-sm" style="display:none; font-weight:700;">
                  ⚙️ <span data-i18n="btn_settings_nav">Pengaturan AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- DEDICATED 3-SCHEME ENTRY GATEWAY'''

    if re.search(old_header_pattern, html):
        html = re.sub(old_header_pattern, new_header, html, count=1)
        print("Updated executive header to 'Hi Ihsan, Mau Analisa Apa Hari Ini?'")
    elif 'Hi Ihsan, Mau Analisa Apa Hari Ini?' in html:
        print("Executive header already updated")
    else:
        print("Warning: old_header_pattern not matched!")
        sys.exit(1)

    # 2. Enhance the 3 Portal Cards with big full-width buttons and clear choices
    # Let's inspect threeDedicatedPortalsGrid in html
    portal_grid_pattern = r'<div id="threeDedicatedPortalsGrid"[\s\S]*?</div>\s*</div>\s*</div>\s*</div>\s*<!-- ========================================================================= -->\s*<!-- DYNAMIC INVESTMENT SCHEME WORKFLOW HUB'

    if re.search(portal_grid_pattern, html):
        html = re.sub(portal_grid_pattern, new_portal_grid, html, count=1)
        print("Updated 3 Portal Cards in threeDedicatedPortalsGrid")
    elif '👉 Pilih &amp; Mulai Analisis Investasi (Narrowing) →' in html:
        print("Portal cards already updated")
    else:
        print("Warning: portal_grid_pattern not matched!")
        sys.exit(1)

    # 3. Wrap secondary / advanced elements in collapsible container
    advanced_wrapper_header = '''<!-- ========================================================================= -->
      <!-- ADVANCED TECHNICAL TOOLS & SECONDARY HUB (COLLAPSIBLE FOR OM IHSAN)       -->
      <!-- ========================================================================= -->
      <div id="advancedExecutiveOptionsContainer" style="margin-top:24px; border-top:2px dashed #CBD5E1; padding-top:18px;">
        <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:14px; padding:16px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="badge" style="background:#E2E8F0; color:#334155; font-size:11px; font-weight:800;">ALAT FORENSIK TEKNIS &amp; DATA POOL (OPSIONAL)</span>
            <h4 style="margin:4px 0 2px 0; font-size:15px; font-weight:800; color:var(--forest-deep);">
              🛠️ Alat Lanjutan: Dropzone Bebas, Workflow Hub 6-Tahap &amp; Ringkasan 4 Alur
            </h4>
            <p style="margin:0; font-size:12px; color:var(--ink-secondary);">
              Om Ihsan cukup memilih <strong>1 dari 3 pintu di atas</strong>. Bagian di bawah ini disediakan khusus untuk operator teknis dan analis tingkat lanjut.
            </p>
          </div>
          <button type="button" id="btnToggleAdvancedHub" onclick="toggleAdvancedHubVisibility()" class="btn btn-secondary btn-sm" style="font-weight:700; font-size:12.5px; padding:8px 16px; cursor:pointer; border-radius:8px;">
            <span id="txtToggleAdvancedHub">👁️ Buka Alat Lanjutan &amp; Dropzone Bebas</span>
          </button>
        </div>

        <div id="advancedHubCollapsibleContent" class="hidden">
        '''

    advanced_wrapper_footer = '''
        </div>
      </div>
    </section>'''

    target_region_regex = r'(<!-- ========================================================================= -->\s*<!-- DYNAMIC INVESTMENT SCHEME WORKFLOW HUB \(6-STEP EXPLICIT USER JOURNEY\)     -->[\s\S]*?<!-- SINGLE ENTRY CONTAINER[\s\S]*?</div>\s*</div>\s*</div>)\s*</section>'
    
    if re.search(target_region_regex, html):
        def repl(m):
            inner_content = m.group(1)
            return advanced_wrapper_header + inner_content + advanced_wrapper_footer
        html = re.sub(target_region_regex, repl, html, count=1)
        print("Wrapped advanced tools inside collapsible container")
    elif 'id="advancedExecutiveOptionsContainer"' in html:
        print("Advanced tools already wrapped")
    else:
        print("Warning: target_region_regex not matched!")
        sys.exit(1)

    # 4. Add Narrowing Executive Headers in viewInvestasi, viewPengendali, viewNonPengendali
    # A. In viewInvestasi
    inv_narrow_header = '''<!-- NARROWING HEADER FOR INVESTASI -->
      <div class="narrowing-top-banner" style="background:#F0FDF4; border:2px solid #86EFAC; border-left:6px solid #16A34A; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 2px 10px rgba(22,163,74,0.08);">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <button type="button" onclick="switchView('main_menu')" style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; border:2px solid #16A34A; background:#FFFFFF; color:#14532D; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.06); transition:all 0.2s;">
            <span>←</span> <span>Ganti Pilihan Analisis / Kembali ke Beranda Om Ihsan</span>
          </button>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-gold" style="font-size:11px; font-weight:800;">🔒 FOKUS TERKUNCI (NARROWED): SKEMA INVESTASI</span>
              <span style="font-size:11.5px; font-weight:700; color:#166534; background:#DCFCE7; padding:2px 8px; border-radius:12px;">Kapasitas Penyerapan &ge; 3 Berkas</span>
            </div>
            <div style="font-size:13.5px; font-weight:800; color:#14532D; margin-top:3px;">
              📈 Fokus Analisis: Kelayakan Investasi, Portofolio Obligasi, Sukuk &amp; Saham (PT Pindo Deli / PT DAAZ)
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:12px; color:#166534; font-weight:700; background:#DCFCE7; padding:6px 12px; border-radius:8px;">
            Tahap 1–5 Mengerucut untuk Investasi
          </span>
        </div>
      </div>
'''
    if '<div class="workflow-stepper" id="inv_stepper">' in html and 'NARROWING HEADER FOR INVESTASI' not in html:
        html = html.replace('<div class="workflow-stepper" id="inv_stepper">', inv_narrow_header + '      <div class="workflow-stepper" id="inv_stepper">')
        print("Added narrowing header in viewInvestasi")

    # B. In viewPengendali
    peng_narrow_header = '''<!-- NARROWING HEADER FOR PENGENDALI -->
      <div class="narrowing-top-banner" style="background:#EFF6FF; border:2px solid #93C5FD; border-left:6px solid #2563EB; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 2px 10px rgba(37,99,235,0.08);">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <button type="button" onclick="switchView('main_menu')" style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; border:2px solid #2563EB; background:#FFFFFF; color:#1E40AF; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.06); transition:all 0.2s;">
            <span>←</span> <span>Ganti Pilihan Analisis / Kembali ke Beranda Om Ihsan</span>
          </button>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-green" style="font-size:11px; font-weight:800; background:#DBEAFE; color:#1E40AF; border-color:#93C5FD;">🔒 FOKUS TERKUNCI (NARROWED): ENTITAS PENGENDALI</span>
              <span style="font-size:11.5px; font-weight:700; color:#1E40AF; background:#DBEAFE; padding:2px 8px; border-radius:12px;">Kapasitas Penyerapan &ge; 3 Berkas</span>
            </div>
            <div style="font-size:13.5px; font-weight:800; color:#1E3A8A; margin-top:3px;">
              🏢 Fokus Analisis: Pengawasan Operasional Entitas Anak &gt;50% (PT EPS)
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:12px; color:#1E40AF; font-weight:700; background:#DBEAFE; padding:6px 12px; border-radius:8px;">
            Tahap 1–5 Mengerucut untuk Pengendali
          </span>
        </div>
      </div>
'''
    if '<div class="workflow-stepper" id="p_stepper">' in html and 'NARROWING HEADER FOR PENGENDALI' not in html:
        html = html.replace('<div class="workflow-stepper" id="p_stepper">', peng_narrow_header + '      <div class="workflow-stepper" id="p_stepper">')
        print("Added narrowing header in viewPengendali")

    # C. In viewNonPengendali
    np_narrow_header = '''<!-- NARROWING HEADER FOR NON-PENGENDALI -->
      <div class="narrowing-top-banner" style="background:#FFFBEB; border:2px solid #FDE68A; border-left:6px solid #D97706; border-radius:12px; padding:14px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 2px 10px rgba(217,119,6,0.08);">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <button type="button" onclick="switchView('main_menu')" style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; border:2px solid #D97706; background:#FFFFFF; color:#92400E; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.06); transition:all 0.2s;">
            <span>←</span> <span>Ganti Pilihan Analisis / Kembali ke Beranda Om Ihsan</span>
          </button>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-gold" style="font-size:11px; font-weight:800; background:#FEF3C7; color:#92400E; border-color:#FDE68A;">🔒 FOKUS TERKUNCI (NARROWED): NON-PENGENDALI</span>
              <span style="font-size:11.5px; font-weight:700; color:#92400E; background:#FEF3C7; padding:2px 8px; border-radius:12px;">Kapasitas Penyerapan &ge; 3 Berkas</span>
            </div>
            <div style="font-size:13.5px; font-weight:800; color:#92400E; margin-top:3px;">
              🤝 Fokus Analisis: Proteksi Pemegang Saham Minoritas 1% (PT POJ)
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:12px; color:#92400E; font-weight:700; background:#FEF3C7; padding:6px 12px; border-radius:8px;">
            Tahap 1–5 Mengerucut untuk Non-Pengendali
          </span>
        </div>
      </div>
'''
    if '<div class="workflow-stepper" id="np_stepper">' in html and 'NARROWING HEADER FOR NON-PENGENDALI' not in html:
        html = html.replace('<div class="workflow-stepper" id="np_stepper">', np_narrow_header + '      <div class="workflow-stepper" id="np_stepper">')
        print("Added narrowing header in viewNonPengendali")

    # 5. Add JavaScript function toggleAdvancedHubVisibility()
    js_fn = '''
    // Toggle Advanced Executive Hub & Free Dropzone
    function toggleAdvancedHubVisibility() {
      const content = document.getElementById('advancedHubCollapsibleContent');
      const txt = document.getElementById('txtToggleAdvancedHub');
      if (!content) return;
      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        if (txt) txt.textContent = '▲ Sembunyikan Alat Lanjutan & Dropzone Bebas';
      } else {
        content.classList.add('hidden');
        if (txt) txt.textContent = '👁️ Buka Alat Lanjutan & Dropzone Bebas';
      }
    }
'''
    if 'function toggleAdvancedHubVisibility' not in html:
        html = html.replace('function enterSchemePortal(schemeKey, autoLoad3Files = false) {', js_fn + '\n    function enterSchemePortal(schemeKey, autoLoad3Files = false) {')
        print("Added toggleAdvancedHubVisibility function")

    # Save to public/index.html and preview.html
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Saved public/index.html and preview.html")

if __name__ == '__main__':
    main()
