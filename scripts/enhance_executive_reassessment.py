#!/usr/bin/env python3
"""
Refine Om Ihsan UX Reassessment:
1. Merge the double green banners on Page 1 into a single authoritative Executive Gateway.
2. Ensure the 3 Choice Cards are immediately visible without forced scrolling.
3. Hide the redundant internal .entity-nav-bar in viewPengendali, viewNonPengendali, and viewInvestasi via CSS.
4. Polish the Narrowing Context Banners for maximum senior executive clarity.
5. Keep preview.html 100% synchronized with public/index.html.
"""

import re
import sys

def main():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update the omIhsanExecutiveGateway and threeDedicatedPortalsGrid header
    gateway_and_portals_pattern = r'<!-- PROCESS HUB EXECUTIVE HEADER & OM IHSAN EXECUTIVE GATEWAY[\s\S]*?<div id="threeDedicatedPortalsGrid"[^>]*>[\s\S]*?<div class="dedicated-portals-grid"'
    
    new_gateway_and_portals = '''<!-- PROCESS HUB EXECUTIVE HEADER & OM IHSAN EXECUTIVE GATEWAY (PAGE 1: SINGLE ENTRY POINT, ZERO LOGIN) -->
      <div id="omIhsanExecutiveGateway" class="process-hub-header" style="background:linear-gradient(135deg, #064E3B 0%, #0F5338 60%, #15803D 100%); border-radius:18px; padding:24px 28px; color:#FFFFFF; margin-bottom:18px; box-shadow:0 8px 30px rgba(6,78,59,0.22); border:2px solid #86EFAC;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div style="max-width:760px;">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.16); border:1px solid rgba(255,255,255,0.3); border-radius:30px; padding:5px 14px; margin-bottom:10px;">
              <span style="font-size:14px;">👋</span>
              <span class="badge badge-gold" style="font-size:11px; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; color:#14532D; background:#FEF08A; border:none; margin:0;" data-i18n="hub_badge">PILIH 1 DARI 3 PINTU MASUK KHUSUS • AKSES EKSEKUTIF</span>
            </div>
            <h1 class="process-hub-title" id="txt_brand_hub_title" data-i18n="hub_title" style="margin:0 0 8px 0; font-size:30px; font-weight:900; line-height:1.2; letter-spacing:-0.5px; color:#FFFFFF; text-shadow:0 2px 4px rgba(0,0,0,0.2);">
              Hi Ihsan, Mau Analisa Apa Hari Ini?
            </h1>
            <p class="process-hub-sub" id="txt_brand_hub_sub" data-i18n="hub_sub" style="margin:0; font-size:14.5px; color:#DCFCE7; line-height:1.55; font-weight:500;">
              Pilih Fokus Analisis untuk Mengerucutkan Layar (Narrowing). Silakan pilih <strong>1 dari 3 pintu masuk khusus</strong> di bawah ini. Sistem langsung membuka alur kerja khusus pilihan Anda dengan kapasitas penyerapan &ge; 3 berkas, kalkulasi otomatis, dan Nota Dinas siap saji tanpa perlu login.
            </p>
          </div>
          <div style="text-align:right;">
            <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.25); border-radius:14px; padding:12px 18px; display:inline-block; text-align:left; backdrop-filter:blur(6px);">
              <div style="font-size:10.5px; font-weight:700; color:#86EFAC; text-transform:uppercase; letter-spacing:0.5px;">Status Akses</div>
              <div style="font-size:13.5px; font-weight:800; color:#FFFFFF; display:flex; align-items:center; gap:8px; margin-top:2px;">
                <span style="width:10px; height:10px; border-radius:50%; background:#22C55E; box-shadow:0 0 10px #22C55E; display:inline-block;"></span>
                Langsung Terbuka (Tanpa Perlu Login)
              </div>
              <div style="font-size:11.5px; color:#E2E8F0; margin-top:4px; font-weight:600;">
                ⚡ Kapasitas Penyerapan: &ge; 3 Berkas Kolektif
              </div>
              <div style="margin-top:8px; display:flex; gap:6px;">
                <button type="button" onclick="switchView('datapool')" class="btn btn-gold btn-sm" style="font-weight:700; font-size:11px; padding:4px 10px; cursor:pointer;">
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
      <!-- DEDICATED 3-SCHEME ENTRY GATEWAY (SEPARATE ENTRY POINTS & 3+ FILES CAPACITY) -->
      <!-- ========================================================================= -->
      <div id="threeDedicatedPortalsGrid" style="margin-bottom:28px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12.5px; font-weight:800; color:#14532D; background:#DCFCE7; border:1px solid #86EFAC; border-radius:20px; padding:4px 12px;">
              🎯 3 Pintu Fokus Analisis
            </span>
            <span style="font-size:12.5px; color:var(--ink-secondary);">
              Klik salah satu kartu untuk langsung masuk ke alur kerja khusus (Narrowing):
            </span>
          </div>
          <span style="font-size:12px; font-weight:700; color:#15803D; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:12px; padding:4px 12px;">
            ⚡ Kapasitas Penyerapan: &ge; 3 Berkas Kolektif
          </span>
        </div>

        <!-- 3 Dedicated Scheme Cards -->
        <div class="dedicated-portals-grid"'''

    if re.search(gateway_and_portals_pattern, html):
        html = re.sub(gateway_and_portals_pattern, new_gateway_and_portals, html, count=1)
        print("Streamlined gateway header and eliminated double green box.")
    else:
        print("Warning: gateway_and_portals_pattern not matched!")

    # 2. Add CSS to hide redundant internal .entity-nav-bar inside the 3 scheme views
    css_to_add = '''
    /* Hide duplicate internal sub-navbar in narrowed scheme views for senior executive focus */
    #viewPengendali .entity-nav-bar,
    #viewNonPengendali .entity-nav-bar,
    #viewInvestasi .entity-nav-bar {
      display: none !important;
    }
'''
    if 'Hide duplicate internal sub-navbar in narrowed scheme views' not in html:
        html = html.replace('/* Entity Nav Tabs */', css_to_add + '\n    /* Entity Nav Tabs */')
        print("Added CSS to hide redundant internal sub-navbars in scheme views.")

    # 3. Update breadcrumbs labels in switchView
    old_labels = """        id: {
          'main_menu': 'Menu Utama',
          'pengendali': 'Input Pengendali',
          'nonpengendali': 'Input Non-Pengendali',
          'investasi': 'Input Skema Investasi',
          'konsolidasi': 'Konsolidasi Akhir Grup',
          'datapool': 'Forensic Data Pool & Pola AI',
          'settings': 'Pengaturan Mesin AI (Google vs Lokal)'
        },"""

    new_labels = """        id: {
          'main_menu': 'Beranda (Pusat Pilihan Analisis)',
          'pengendali': 'Entitas Pengendali (Fokus Terkunci)',
          'nonpengendali': 'Entitas Non-Pengendali (Fokus Terkunci)',
          'investasi': 'Skema Investasi (Fokus Terkunci)',
          'konsolidasi': 'Konsolidasi Akhir Grup',
          'datapool': 'Forensic Data Pool & Pola AI',
          'settings': 'Pengaturan Mesin AI (Google vs Lokal)'
        },"""

    if old_labels in html:
        html = html.replace(old_labels, new_labels)
        print("Updated breadcrumb labels in switchView.")

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Saved public/index.html and preview.html successfully.")

if __name__ == '__main__':
    main()
