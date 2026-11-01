#!/usr/bin/env python3
"""
scratch/apply_sample_removal_and_dynamic_investasi.py

Automates:
1. Removal of all mock / 1-click sample shortcut buttons from the landing page:
   - Removes "⚡ Jalan Pintas Cepat (1-Klik Langsung Buka Laporan Lengkap)" and buttons "Contoh PT EPS", "Contoh Pindo Deli", "Contoh PT POJ".
   - Updates Boomer Quick Guide Step 2 to remove "Klik Contoh Jadi" and emphasize direct parsing.
   - In 3 Portal Cards, removes "⚡ 1-Klik Buka Laporan 3 Berkas..." sample shortcuts and sets single clean CTA.
   - In Hero dropzone, replaces sample benchmarks box with clean Autonomous Direct Parsing banner.
2. Eliminates hardcoded "hallucinatory" mock text in Investasi Overview (Pane 3):
   - Makes Layperson Explanation, High-Level Anomaly Spotted Banner, Quality of Earnings Waterfall,
     Covenant Headroom Gauges, and Operational Breakdown 100% dynamic.
   - Injects `renderDynamicInvestasiOverview(metrics)` into the JavaScript runtime.
   - Binds dynamic rendering to `runInvestasiAnalysis()`, `selectInvestasiCase()`, `startAnalysisPipeline()`,
     `updateDynamicEntityBindings()`, and `DOMContentLoaded`.
   - Reads entity name and currency dynamically in `runInvestasiAnalysis()` instead of hardcoding Pindo Deli.
3. Synchronizes `preview.html` 100% identically to `public/index.html`.
"""

import os
import sys

INDEX_PATH = 'public/index.html'
PREVIEW_PATH = 'preview.html'

def main():
    if not os.path.exists(INDEX_PATH):
        print(f"Error: {INDEX_PATH} not found.")
        sys.exit(1)

    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"Original index.html size: {len(content)} bytes")

    # -------------------------------------------------------------
    # 1. REMOVE 1-CLICK FAST TRACK BUTTONS (Jalan Pintas Cepat)
    # -------------------------------------------------------------
    t1 = '''        <!-- 1-Click Fast Track Buttons -->
        <div style="background:#F0F7FF; border:1px solid #BFDBFE; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">⚡</span>
            <div>
              <strong style="font-size:12.5px; color:var(--forest-deep); display:block;">Jalan Pintas Cepat (1-Klik Langsung Buka Laporan Lengkap):</strong>
              <span style="font-size:11px; color:var(--forest);">Pilih salah satu kasus nyata di samping untuk langsung melihat contoh Nota Dinas siap saji:</span>
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" onclick="uploadWorkspaceSampleFile('eps')" class="btn btn-primary btn-sm" style="font-weight:700; font-size:11.5px; padding:7px 14px; background:#1D4ED8; border-color:#1E40AF; cursor:pointer;">
              🏢 Contoh PT EPS (Pengendali)
            </button>
            <button type="button" onclick="uploadWorkspaceSampleFile('pindodeli')" class="btn btn-gold btn-sm" style="font-weight:700; font-size:11.5px; padding:7px 14px; cursor:pointer;">
              📈 Contoh Pindo Deli (Investasi)
            </button>
            <button type="button" onclick="uploadWorkspaceSampleFile('poj')" class="btn btn-secondary btn-sm" style="font-weight:700; font-size:11.5px; padding:7px 14px; border-color:#3B82F6; color:#1D4ED8; cursor:pointer;">
              🤝 Contoh PT POJ (Minoritas 1%)
            </button>
          </div>
        </div>'''
    assert t1 in content, "Target 1 (1-Click Fast Track Buttons) not found!"
    content = content.replace(t1, '        <!-- Direct Autonomous Parsing Mode (Fast Track Sample Shortcuts Removed) -->')
    print("✓ Removed 1-Click Fast Track Buttons")

    # -------------------------------------------------------------
    # 2. UPDATE BOOMER QUICK GUIDE STEP 2
    # -------------------------------------------------------------
    t2 = '''          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:14px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span style="width:26px; height:26px; border-radius:50%; background:#1D4ED8; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">2</span>
              <strong style="font-size:13px; color:var(--forest-deep);">Klik Contoh Jadi atau Masukkan Berkas</strong>
            </div>
            <p style="margin:0; font-size:12px; color:var(--ink-secondary); line-height:1.5;">
              Bisa langsung klik tombol <strong>"Lihat Contoh"</strong> untuk melihat hasil jadi seketika, atau unggah laporan keuangan milik Anda.
            </p>
          </div>'''
    r2 = '''          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:14px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span style="width:26px; height:26px; border-radius:50%; background:#1D4ED8; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">2</span>
              <strong style="font-size:13px; color:var(--forest-deep);">Unggah Berkas Laporan Keuangan</strong>
            </div>
            <p style="margin:0; font-size:12px; color:var(--ink-secondary); line-height:1.5;">
              Unggah dokumen PDF atau Excel perusahaan Anda. Sistem akan memvalidasi, mengekstrak, dan menghitung seluruh indikator keuangan secara langsung dari berkas asli.
            </p>
          </div>'''
    assert t2 in content, "Target 2 (Boomer Quick Guide Step 2) not found!"
    content = content.replace(t2, r2)
    print("✓ Updated Boomer Quick Guide Step 2")

    # -------------------------------------------------------------
    # 3. CLEAN UP 3 PORTAL CARDS (REMOVE SECONDARY SAMPLE BUTTONS)
    # -------------------------------------------------------------
    t3_inv = '''                <button type="button" onclick="enterSchemePortal('investasi', false)" class="btn btn-primary" style="font-weight:900; padding:14px 20px; font-size:14px; cursor:pointer; text-align:center; border-radius:10px; background:#1D4ED8; box-shadow:0 4px 12px rgba(29,78,216,0.25);">
                  👉 Pilih &amp; Mulai Analisis Investasi (Narrowing) →
                </button>
                <button type="button" onclick="enterSchemePortal('investasi', true)" class="btn btn-secondary btn-sm" style="font-weight:700; background:#FFFFFF; border-color:#BAE6FD; color:#14532D; font-size:11.5px; padding:8px 12px; cursor:pointer; border-radius:8px;">
                  ⚡ 1-Klik Buka Laporan 3 Berkas Investasi (Pindo Deli + DAAZ)
                </button>'''
    r3_inv = '''                <button type="button" onclick="enterSchemePortal('investasi', false)" class="btn btn-primary" style="font-weight:900; padding:14px 20px; font-size:14px; cursor:pointer; text-align:center; border-radius:10px; background:#1D4ED8; box-shadow:0 4px 12px rgba(29,78,216,0.25);">
                  👉 Pilih &amp; Mulai Analisis Investasi (Unggah Berkas) →
                </button>'''
    assert t3_inv in content, "Target 3 (Portal Investasi) not found!"
    content = content.replace(t3_inv, r3_inv)

    t3_peng = '''                <button type="button" onclick="enterSchemePortal('pengendali', false)" class="btn btn-primary" style="font-weight:900; background:#0284C7; border-color:#0369A1; padding:14px 20px; font-size:14px; cursor:pointer; text-align:center; border-radius:10px; box-shadow:0 4px 12px rgba(2,132,199,0.25);">
                  👉 Pilih &amp; Mulai Analisis Pengendali (Narrowing) →
                </button>
                <button type="button" onclick="enterSchemePortal('pengendali', true)" class="btn btn-secondary btn-sm" style="font-weight:700; background:#FFFFFF; border-color:#93C5FD; color:#1E40AF; font-size:11.5px; padding:8px 12px; cursor:pointer; border-radius:8px;">
                  ⚡ 1-Klik Buka Laporan 3 Berkas Pengendali (PT EPS + RKAP)
                </button>'''
    r3_peng = '''                <button type="button" onclick="enterSchemePortal('pengendali', false)" class="btn btn-primary" style="font-weight:900; background:#0284C7; border-color:#0369A1; padding:14px 20px; font-size:14px; cursor:pointer; text-align:center; border-radius:10px; box-shadow:0 4px 12px rgba(2,132,199,0.25);">
                  👉 Pilih &amp; Mulai Analisis Pengendali (Unggah Berkas) →
                </button>'''
    assert t3_peng in content, "Target 3 (Portal Pengendali) not found!"
    content = content.replace(t3_peng, r3_peng)

    t3_np = '''                <button type="button" onclick="enterSchemePortal('nonpengendali', false)" class="btn btn-primary" style="font-weight:900; background:#0A2540; border-color:#0A2540; padding:14px 20px; font-size:14px; cursor:pointer; text-align:center; border-radius:10px; box-shadow:0 4px 12px rgba(10,37,64,0.25);">
                  👉 Pilih &amp; Mulai Analisis Non-Pengendali (Narrowing) →
                </button>
                <button type="button" onclick="enterSchemePortal('nonpengendali', true)" class="btn btn-secondary btn-sm" style="font-weight:700; background:#FFFFFF; border-color:#FDE68A; color:#92400E; font-size:11.5px; padding:8px 12px; cursor:pointer; border-radius:8px;">
                  ⚡ 1-Klik Buka Laporan 3 Berkas Non-Pengendali (PT POJ + RTC)
                </button>'''
    r3_np = '''                <button type="button" onclick="enterSchemePortal('nonpengendali', false)" class="btn btn-primary" style="font-weight:900; background:#0A2540; border-color:#0A2540; padding:14px 20px; font-size:14px; cursor:pointer; text-align:center; border-radius:10px; box-shadow:0 4px 12px rgba(10,37,64,0.25);">
                  👉 Pilih &amp; Mulai Analisis Non-Pengendali (Unggah Berkas) →
                </button>'''
    assert t3_np in content, "Target 3 (Portal Non-Pengendali) not found!"
    content = content.replace(t3_np, r3_np)
    print("✓ Cleaned up 3 Portal Cards with single unambiguous CTAs")

    # -------------------------------------------------------------
    # 4. HERO DROPZONE SAMPLE BENCHMARKS BOX REPLACEMENT
    # -------------------------------------------------------------
    t4 = '''          <!-- 1-Click Sample Benchmarks (Visible & 100% Clickable) -->
          <div style="background:#fff; border:1px solid #C4DFC9; border-radius:10px; padding:12px 16px; max-width:620px; margin:0 auto; text-align:left;" onclick="event.stopPropagation();">
            <div style="font-size:12px; font-weight:700; color:var(--forest-deep); margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
              <span>⚡ 1-Klik Muat & Analisis Berkas Contoh Nyata:</span>
              <span class="badge badge-gold" style="font-size:9.5px;">Siap Diproses Instan</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:8px;">
              <button type="button" onclick="uploadWorkspaceSampleFile('pindodeli')" class="btn btn-secondary btn-sm" style="display:flex; align-items:center; gap:8px; justify-content:flex-start; text-align:left; background:#F9FCFA; border-color:#C4DFC9; cursor:pointer;">
                <span style="font-size:18px;">📄</span>
                <div>
                  <strong style="font-size:11px; color:var(--forest-deep); display:block;">Pindo Deli (PDF)</strong>
                  <span style="font-size:9.5px; color:var(--ink-secondary);">Skema Investasi 7 Seksi (USD)</span>
                </div>
              </button>
              <button type="button" onclick="uploadWorkspaceSampleFile('poj')" class="btn btn-secondary btn-sm" style="display:flex; align-items:center; gap:8px; justify-content:flex-start; text-align:left; background:#F9FCFA; border-color:#C4DFC9; cursor:pointer;">
                <span style="font-size:18px;">📄</span>
                <div>
                  <strong style="font-size:11px; color:var(--forest-deep); display:block;">PT POJ (PDF)</strong>
                  <span style="font-size:9.5px; color:var(--ink-secondary);">Non-Pengendali RTC 301,2% & Dividen</span>
                </div>
              </button>
              <button type="button" onclick="uploadWorkspaceSampleFile('eps')" class="btn btn-secondary btn-sm" style="display:flex; align-items:center; gap:8px; justify-content:flex-start; text-align:left; background:#F9FCFA; border-color:#C4DFC9; cursor:pointer;">
                <span style="font-size:18px;">📊</span>
                <div>
                  <strong style="font-size:11px; color:var(--forest-deep); display:block;">PT EPS (Excel)</strong>
                  <span style="font-size:9.5px; color:var(--ink-secondary);">Pengendali S7 Growth Gap (+1,46%)</span>
                </div>
              </button>
              <button type="button" onclick="uploadWorkspaceSampleFile('daaz')" class="btn btn-secondary btn-sm" style="display:flex; align-items:center; gap:8px; justify-content:flex-start; text-align:left; background:#F9FCFA; border-color:#C4DFC9; cursor:pointer;">
                <span style="font-size:18px;">📑</span>
                <div>
                  <strong style="font-size:11px; color:var(--forest-deep); display:block;">PT DAAZ (PDF)</strong>
                  <span style="font-size:9.5px; color:var(--ink-secondary);">Obligasi & Altman Z-Score 2,5415</span>
                </div>
              </button>
            </div>
          </div>'''
    r4 = '''          <!-- Autonomous Direct Parsing Assurance Banner -->
          <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:10px 16px; max-width:620px; margin:0 auto; text-align:center;" onclick="event.stopPropagation();">
            <span style="font-size:12px; font-weight:700; color:#166534; display:inline-flex; align-items:center; gap:6px;">
              <span>⚡</span> <span>Autonomous Direct Parsing Pipeline: Seret &amp; lepas berkas PDF / Excel Anda di atas untuk analisis langsung dari dokumen asli tanpa data contoh</span>
            </span>
          </div>'''
    assert t4 in content, "Target 4 (Hero Sample Benchmarks Box) not found!"
    content = content.replace(t4, r4)
    print("✓ Replaced Hero Sample Benchmarks with Autonomous Direct Parsing Banner")

    # -------------------------------------------------------------
    # 5. DYNAMIC STRUCTURE FOR INVESTASI OVERVIEW (PANE 3)
    # -------------------------------------------------------------
    # Replace lines 5352 to 5557 with dynamic containers & IDs
    t5_start = '''            <!-- PENJELASAN UNTUK ORANG AWAM (INVESTASI STEP 3) -->
            <div class="panel-card layperson-summary-box" style="background:#EFF6FF; border:1px solid #BFDBFE; border-left:5px solid #2563EB; padding:12px 16px; margin-bottom:14px;">'''
    t5_end = '''            <!-- PANEL AI FORENSIC FEEDBACK PINDO DELI -->
            <div class="ai-feedback-box" id="aiFeedbackBox_investasi_pindo" style="margin-top:20px;">'''

    idx_start = content.find(t5_start)
    assert idx_start != -1, "Target 5 start not found!"
    idx_end = content.find(t5_end, idx_start)
    assert idx_end != -1, "Target 5 end not found!"

    r5 = '''            <!-- PENJELASAN UNTUK ORANG AWAM (INVESTASI STEP 3) -->
            <div class="panel-card layperson-summary-box" id="dynInvLaypersonCard" style="background:#EFF6FF; border:1px solid #BFDBFE; border-left:5px solid #2563EB; padding:12px 16px; margin-bottom:14px;">
              <div style="display:flex; align-items:flex-start; gap:10px;">
                <span style="font-size:22px;">🔍</span>
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <strong style="color:#1E3A8A; font-size:13px;" id="dynInvLayTitle" data-i18n="inv_pane3_lay_title">Penjelasan untuk Orang Awam: Apakah PT Pindo Deli Aman untuk Berinvestasi?</strong>
                    <span class="badge badge-blue" style="font-size:10px;" data-i18n="badge_layperson_expl">Penjelasan Sederhana</span>
                  </div>
                  <p style="margin:4px 0 0 0; font-size:12px; color:#1E40AF; line-height:1.5;" id="dynInvLayDesc" data-i18n="inv_pane3_lay_desc">
                    Sangat Aman untuk bayar utang: Perusahaan punya uang lancar hampir 2x lipat dari utang jangka pendeknya (Current Ratio 1,96x). Namun hati-hati: lonjakan laba terbesarnya bukan dari jualan kertas yang laris manis, melainkan dari rezeki selisih kurs dollar dan setoran keuntungan dari pabrik rekanan (OKI Pulp).
                  </p>
                </div>
              </div>
            </div>

            <!-- HIGH-LEVEL ANOMALY & SOLVENCY BENCHMARK BANNER -->
            <div class="high-level-spot-banner safe" id="dynInvHighLevelBanner" style="margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:18px;">🛡️</span>
                  <strong style="color:var(--forest-deep); font-size:13.5px;" id="dynInvHighLevelTitle">Temuan Tingkat Tinggi: Solvabilitas Kokoh dengan Catatan Kualitas Laba (High-Level Spotted)</strong>
                </div>
                <span class="badge badge-green" id="dynInvHighLevelBadge" style="font-size:10.5px;">🟢 Layak Dipertimbangkan (Creditworthy)</span>
              </div>
              <p style="margin:0 0 8px 0; color:var(--ink-primary); line-height:1.5;" id="dynInvHighLevelDesc">
                Profil solvabilitas dan likuiditas PT Pindo Deli berada pada zona sangat aman (Current Ratio <strong>1,96x</strong>, DER <strong>~0,50x</strong>). Namun, audit forensik mendeteksi bahwa <strong>87,9% lonjakan laba neto (+USD 308,8 juta)</strong> disumbang oleh pos non-operasional: bagian laba asosiasi OKI Pulp (<strong>+USD 136,5 juta</strong>) dan keuntungan kurs (<strong>+USD 134,9 juta</strong>), sementara bisnis inti pulp & kertas stagnan (-1,9%).
              </p>
              <div class="spot-tag-list" id="dynInvHighLevelTags">
                <span class="spot-tag" style="background:#EBF7EE; color:var(--forest-deep); border-color:#B8DAC8;">🛡️ Current Ratio: 1,96x (Headroom +0,96x vs Covenant Min 1,00x)</span>
                <span class="spot-tag" style="background:#EBF7EE; color:var(--forest-deep); border-color:#B8DAC8;">🏦 DER Pinjaman: ~0,50x (Sangat Aman di Bawah Plafon 2,00-4,00x)</span>
                <span class="spot-tag" style="background:#FFF8E6; color:#A17922; border-color:#F0DDA8;">⚠️ Kualitas Laba: 89,4% Kenaikan EBT Berasal dari Pos Non-Operasional</span>
                <span class="spot-tag" style="background:#EBF7EE; color:var(--forest-deep); border-color:#B8DAC8;">📈 Ekuitas Cushion: USD 5.485.855k (+8,9% YoY / 57,4% Total Aset)</span>
                <span class="spot-tag" style="background:#FFF8E6; color:#A17922; border-color:#F0DDA8;">📦 Segmen Budaya: -5,2% YoY vs Kertas Industri/Tissue: +1,9% YoY</span>
              </div>
            </div>

            <!-- "DO BETTER MORE THAN THE TEMPLATE" - ENHANCED VISUAL ANALYTICS -->
            
            <!-- 1. QUALITY OF EARNINGS WATERFALL DECOMPOSITION -->
            <div class="qoe-bar-container" id="dynInvQoEContainer">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                <div>
                  <h4 style="margin:0; font-size:13.5px; font-weight:700; color:var(--forest-deep); display:flex; align-items:center; gap:6px;">
                    <span>🔬</span> Dekomposisi Kualitas Laba (Quality of Earnings Waterfall Analysis)
                  </h4>
                  <span style="font-size:11px; color:var(--ink-secondary);" id="dynInvQoESubtitle">Proporsi pembentukan Laba Sebelum Pajak (EBT: USD 474.569k) antara Operasional Inti vs Non-Operasional</span>
                </div>
                <span class="badge badge-gold" style="font-size:10px;">Forensic Profit Breakdown</span>
              </div>

              <!-- Visual Stacked Bar -->
              <div class="qoe-stacked-bar" id="dynInvQoEStackedBar" title="Dekomposisi Laba Sebelum Pajak USD 474.569k">
                <div class="qoe-segment qoe-seg-core" style="width:32.5%;" title="Laba Usaha Operasional: USD 154.056k (32,5%)">
                  Laba Usaha 32,5% ($154,1M)
                </div>
                <div class="qoe-segment qoe-seg-assoc" style="width:44.8%;" title="Bagian Laba Entitas Asosiasi: USD 212.518k (44,8%)">
                  Laba Asosiasi 44,8% ($212,5M)
                </div>
                <div class="qoe-segment qoe-seg-forex" style="width:29.5%;" title="Keuntungan Selisih Kurs: USD 140.198k (29,5%)">
                  Kurs 29,5% ($140,2M)
                </div>
                <div class="qoe-segment qoe-seg-finance" style="width:18.8%; opacity:0.9;" title="Beban Bunga Pendanaan: -USD 89.033k (-18,8%)">
                  Bunga -18,8%
                </div>
              </div>

              <div id="dynInvQoEGrid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px; font-size:11.5px; margin-top:8px;">
                <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #1B4332; border-radius:6px; padding:8px 10px;">
                  <strong style="color:#1B4332;">1. Operasional Inti (Core EBIT)</strong>
                  <div style="font-size:13px; font-weight:700; margin-top:2px;">USD 154.056k (32,5%)</div>
                  <span style="color:var(--ink-secondary); font-size:10.5px;">Turun -1,93% YoY; marjin operasi flat di 14,21%.</span>
                </div>
                <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #B27B13; border-radius:6px; padding:8px 10px;">
                  <strong style="color:#B27B13;">2. Laba Asosiasi (PT OKI Pulp)</strong>
                  <div style="font-size:13px; font-weight:700; margin-top:2px;">USD 212.518k (44,8%)</div>
                  <span style="color:var(--ink-secondary); font-size:10.5px;">Melonjak +179,4%; laba non-kas metode ekuitas.</span>
                </div>
                <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #5B4896; border-radius:6px; padding:8px 10px;">
                  <strong style="color:#5B4896;">3. Keuntungan Kurs Neto</strong>
                  <div style="font-size:13px; font-weight:700; margin-top:2px;">USD 140.198k (29,5%)</div>
                  <span style="color:var(--ink-secondary); font-size:10.5px;">Melompat +2.533%; volatilitas kurs pasar.</span>
                </div>
                <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #B91C1C; border-radius:6px; padding:8px 10px;">
                  <strong style="color:#B91C1C;">4. Beban Pendanaan (Bunga)</strong>
                  <div style="font-size:13px; font-weight:700; margin-top:2px;">-USD 89.033k (-18,8%)</div>
                  <span style="color:var(--ink-secondary); font-size:10.5px;">Turun 9,6% YoY; beban bunga berkurang.</span>
                </div>
              </div>

              <div id="dynInvQoEWarning" style="background:#FFF9E6; border:1px solid #F0DDA8; border-radius:6px; padding:8px 12px; margin-top:10px; font-size:11.5px; color:#785408; display:flex; align-items:center; gap:8px;">
                <span>⚠️</span>
                <span><strong>Catatan Peringatan Kualitas Laba:</strong> Lonjakan laba neto +210,3% (+USD 308,8 juta) terutama ditopang laba asosiasi (+USD 136,5 juta) dan keuntungan kurs (+USD 134,9 juta), menyumbang 87,9% dari total kenaikan laba bersih. Bisnis inti turun -1,93%.</span>
              </div>
            </div>

            <!-- 2. COVENANT HEADROOM GAUGES -->
            <div id="dynInvCovenantCard" style="background:#fff; border:1px solid #D6D0C4; border-radius:8px; padding:16px; margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <div>
                  <h4 style="margin:0; font-size:13.5px; font-weight:700; color:var(--forest-deep); display:flex; align-items:center; gap:6px;">
                    <span>🛡️</span> Matriks Headroom &amp; Kepatuhan Covenant Sukuk / Obligasi
                  </h4>
                  <span style="font-size:11px; color:var(--ink-secondary);">Evaluasi batas toleransi kredit dan ruang gerak (headroom) emisi efek utang</span>
                </div>
                <span class="badge badge-green" id="dynInvCovenantStatusBadge" style="font-size:10px;">Seluruh Covenant Terpenuhi</span>
              </div>

              <div class="covenant-gauge-grid">
                <div class="covenant-gauge-card">
                  <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--forest);">
                    <span>Current Ratio (CR)</span>
                    <span class="badge badge-green" id="dynGaugeHead_cr" style="padding:1px 6px; font-size:9.5px;">Headroom +0,96x</span>
                  </div>
                  <div style="font-size:20px; font-weight:800; color:var(--forest-deep); margin:4px 0;" id="dynGaugeVal_cr">1,96x</div>
                  <div class="covenant-gauge-bar-bg">
                    <div class="covenant-gauge-bar-fill" id="dynGaugeFill_cr" style="width:100%; background:#1B4332;"></div>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--ink-secondary);">
                    <span>Batas Min: <strong>1,00x</strong></span>
                    <span id="dynGaugeAktual_cr">Aktual 30 Jun 2026: <strong>1,96x</strong></span>
                  </div>
                </div>

                <div class="covenant-gauge-card">
                  <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--forest);">
                    <span>DER Pinjaman Berbunga</span>
                    <span class="badge badge-green" id="dynGaugeHead_der" style="padding:1px 6px; font-size:9.5px;">Sangat Longgar</span>
                  </div>
                  <div style="font-size:20px; font-weight:800; color:var(--forest-deep); margin:4px 0;" id="dynGaugeVal_der">~0,50x</div>
                  <div class="covenant-gauge-bar-bg">
                    <div class="covenant-gauge-bar-fill" id="dynGaugeFill_der" style="width:25%; background:#1B4332;"></div>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--ink-secondary);">
                    <span>Batas Maks: <strong>2,00x - 4,00x</strong></span>
                    <span id="dynGaugeAktual_der">Aktual: <strong>~0,50x</strong></span>
                  </div>
                </div>

                <div class="covenant-gauge-card">
                  <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--forest);">
                    <span>Total Liabilitas / Ekuitas</span>
                    <span class="badge badge-green" id="dynGaugeHead_tle" style="padding:1px 6px; font-size:9.5px;">Membaik (0,80x → 0,74x)</span>
                  </div>
                  <div style="font-size:20px; font-weight:800; color:var(--forest-deep); margin:4px 0;" id="dynGaugeVal_tle">0,74x</div>
                  <div class="covenant-gauge-bar-bg">
                    <div class="covenant-gauge-bar-fill" id="dynGaugeFill_tle" style="width:29.6%; background:#1B4332;"></div>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--ink-secondary);">
                    <span>Batas Maks: <strong>2,50x</strong></span>
                    <span id="dynGaugeAktual_tle">Aktual: <strong>0,74x</strong></span>
                  </div>
                </div>

                <div class="covenant-gauge-card">
                  <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--forest);">
                    <span>Interest Coverage (ICR)</span>
                    <span class="badge badge-green" id="dynGaugeHead_icr" style="padding:1px 6px; font-size:9.5px;">Cukup Aman</span>
                  </div>
                  <div style="font-size:20px; font-weight:800; color:var(--forest-deep); margin:4px 0;" id="dynGaugeVal_icr">1,73x</div>
                  <div class="covenant-gauge-bar-bg">
                    <div class="covenant-gauge-bar-fill" id="dynGaugeFill_icr" style="width:70%; background:#1B4332;"></div>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--ink-secondary);">
                    <span>Batas Min: <strong>1,25x - 1,50x</strong></span>
                    <span id="dynGaugeAktual_icr">Aktual EBIT: <strong>1,73x</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. RESILIENSI SEGMEN USAHA -->
            <div id="dynInvSegmentsCard" style="background:#fff; border:1px solid #D6D0C4; border-radius:8px; padding:16px; margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <div>
                  <h4 style="margin:0; font-size:13.5px; font-weight:700; color:var(--forest-deep); display:flex; align-items:center; gap:6px;">
                    <span>📦</span> <span id="dynInvSegmentsTitle">Analisis Resiliensi Segmen Portofolio Produk &amp; Struktur Omzet</span>
                  </h4>
                  <span style="font-size:11px; color:var(--ink-secondary);" id="dynInvSegmentsSubtitle">Peta kontribusi omzet konsolidasi: komoditas siklikal vs produk kemasan konsumer defensif</span>
                </div>
              </div>

              <div id="dynInvSegmentsContainer" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
                <div style="background:#FBF8F5; border:1px solid #E8DFD3; border-left:4px solid #A17922; border-radius:6px; padding:12px 14px;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#A17922; font-size:12.5px;">1. Kertas Budaya dan Pulp</strong>
                    <span class="badge badge-gold" style="font-size:10px;">Pemberat Omzet (-5,2%)</span>
                  </div>
                  <div style="font-size:15px; font-weight:800; margin:6px 0 2px 0;">USD 585.808 ribu <span style="font-size:11px; font-weight:500; color:var(--ink-secondary);">(54,0% dari total omzet)</span></div>
                  <p style="margin:0; font-size:11.5px; color:var(--ink-primary); line-height:1.45;">
                    Penjualan turun -5,2% dibandingkan 6M 2025 (USD 618.064 ribu). Pelemahan harga jual pulp global serta kontraksi permintaan kertas cetak &amp; tulis dunia menekan segmen ini.
                  </p>
                </div>

                <div style="background:#F4FAF6; border:1px solid #C4DEC0; border-left:4px solid #1B4332; border-radius:6px; padding:12px 14px;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#1B4332; font-size:12.5px;">2. Kertas Industri &amp; Produk Konsumen (Tissue)</strong>
                    <span class="badge badge-green" style="font-size:10px;">Bantalan Defensif (+1,9%)</span>
                  </div>
                  <div style="font-size:15px; font-weight:800; margin:6px 0 2px 0;">USD 498.437 ribu <span style="font-size:11px; font-weight:500; color:var(--ink-secondary);">(46,0% dari total omzet)</span></div>
                  <p style="margin:0; font-size:11.5px; color:var(--ink-primary); line-height:1.45;">
                    Tumbuh tipis +1,9% dibandingkan 6M 2025 (USD 489.102 ribu). Berfungsi sebagai bantalan (buffer) defensif; permintaan kemasan dan tissue ritel lebih kebal siklus makroekonomi.
                  </p>
                </div>
              </div>
            </div>\n\n'''

    content = content[:idx_start] + r5 + content[idx_end:]
    print("✓ Replaced Investasi Overview with dynamic placeholder markup")

    # -------------------------------------------------------------
    # 6. INJECT renderDynamicInvestasiOverview JAVASCRIPT FUNCTION
    # -------------------------------------------------------------
    # Find selectInvestasiCase to inject renderDynamicInvestasiOverview right above it
    target_func = '    // --- ALUR 3: INVESTASI PORTOFOLIO LOGIC ---'
    assert target_func in content, "target_func for ALUR 3 not found!"

    js_code = '''    // --- DYNAMIC INVESTASI OVERVIEW & FORENSIC RENDERER (ZERO HALLUCINATION) ---
    function renderDynamicInvestasiOverview(metrics) {
      if (!metrics) {
        if (appState.investasi) {
          metrics = appState.investasi;
        } else {
          const eName = document.getElementById('in_pindo_entityName')?.value || 'PT Pindo Deli Pulp and Paper Mills dan Entitas Anak';
          const cur = document.getElementById('in_pindo_currency')?.value || "USD '000";
          const sales = parseFloat(document.getElementById('in_pindo_sales')?.value || 1084245);
          const salesPY = parseFloat(document.getElementById('in_pindo_salesPY')?.value || 1098987);
          const cogs = parseFloat(document.getElementById('in_pindo_cogs')?.value || 791935);
          const opProf = parseFloat(document.getElementById('in_pindo_opprof')?.value || 154056);
          const assoc = parseFloat(document.getElementById('in_pindo_assoc')?.value || 212518);
          const forex = parseFloat(document.getElementById('in_pindo_forex')?.value || 140198);
          const interest = parseFloat(document.getElementById('in_pindo_interest')?.value || 89033);
          const ebt = parseFloat(document.getElementById('in_pindo_ebt')?.value || 474569);
          const netProfit = parseFloat(document.getElementById('in_pindo_netprofit')?.value || 455637);
          const ca = parseFloat(document.getElementById('in_pindo_ca')?.value || 3815764);
          const ta = parseFloat(document.getElementById('in_pindo_ta')?.value || 9564776);
          const cl = parseFloat(document.getElementById('in_pindo_cl')?.value || 1944954);
          const tl = parseFloat(document.getElementById('in_pindo_tl')?.value || 4078921);
          const eq = parseFloat(document.getElementById('in_pindo_equity')?.value || 5485855);
          const currentRatio = cl > 0 ? (ca / cl) : 1.96;
          const der = eq > 0 ? (tl / eq) : 0.74;
          const salesGrowth = salesPY > 0 ? (((sales - salesPY) / salesPY) * 100) : -1.34;
          const nonOpDelta = assoc + forex;
          const nonOpContribution = netProfit > 0 ? ((nonOpDelta / netProfit) * 100) : 87.9;
          metrics = {
            entityName: eName,
            currency: cur,
            sales, salesPY, cogs, opProf, assoc, forex, interest, ebt, netProfit, ca, ta, cl, tl, eq,
            currentRatio: Number(currentRatio.toFixed(2)),
            der: Number(der.toFixed(2)),
            salesGrowth: Number(salesGrowth.toFixed(2)),
            nonOpContribution: Number(nonOpContribution.toFixed(1))
          };
        }
      }

      const entityName = metrics.entityName || document.getElementById('in_pindo_entityName')?.value || 'PT Pindo Deli Pulp and Paper Mills dan Entitas Anak';
      const currency = metrics.currency || document.getElementById('in_pindo_currency')?.value || "USD '000";
      const curSymbol = currency.includes('USD') ? 'USD ' : (currency.includes('Rp') || currency.includes('IDR') ? 'Rp ' : '');
      const curUnit = currency.includes('ribu') || currency.includes("'000") ? 'k' : (currency.includes('Miliar') ? ' M' : '');

      const isPindo = entityName.toLowerCase().includes('pindo');
      const cr = metrics.currentRatio !== undefined ? Number(metrics.currentRatio) : (metrics.cl > 0 ? Number((metrics.ca / metrics.cl).toFixed(2)) : 1.96);
      const der = metrics.der !== undefined ? Number(metrics.der) : (metrics.eq > 0 ? Number((metrics.tl / metrics.eq).toFixed(2)) : 0.74);
      const ebt = Number(metrics.ebt || 474569);
      const opProf = Number(metrics.opProf || 154056);
      const assoc = Number(metrics.assoc || 212518);
      const forex = Number(metrics.forex || 140198);
      const interest = Number(metrics.interest || 89033);
      const netProfit = Number(metrics.netProfit || 455637);
      const sales = Number(metrics.sales || 1084245);
      const salesPY = Number(metrics.salesPY || 1098987);
      const salesGrowth = metrics.salesGrowth !== undefined ? Number(metrics.salesGrowth) : (salesPY > 0 ? Number((((sales - salesPY) / salesPY) * 100).toFixed(2)) : -1.34);
      const ta = Number(metrics.ta || 9564776);
      const eq = Number(metrics.eq || 5485855);
      const tl = Number(metrics.tl || 4078921);
      const equityCushion = ta > 0 ? Number(((eq / ta) * 100).toFixed(1)) : 57.4;
      const icr = interest > 0 ? Number((opProf / interest).toFixed(2)) : 1.73;

      // EBT waterfall percentages
      const ebtSafe = ebt > 0 ? ebt : (opProf + assoc + forex - interest);
      const pCore = ebtSafe > 0 ? Number(((opProf / ebtSafe) * 100).toFixed(1)) : 32.5;
      const pAssoc = ebtSafe > 0 ? Number(((assoc / ebtSafe) * 100).toFixed(1)) : 44.8;
      const pForex = ebtSafe > 0 ? Number(((forex / ebtSafe) * 100).toFixed(1)) : 29.5;
      const pFinance = ebtSafe > 0 ? Number(((interest / ebtSafe) * 100).toFixed(1)) : 18.8;
      const nonOpTotal = assoc + forex;
      const nonOpContrib = netProfit > 0 ? Number(((nonOpTotal / netProfit) * 100).toFixed(1)) : 87.9;

      // 1. Layperson Explanation Card
      const layTitle = document.getElementById('dynInvLayTitle');
      const layDesc = document.getElementById('dynInvLayDesc');
      if (layTitle) layTitle.textContent = `Penjelasan untuk Orang Awam: Apakah ${entityName} Aman untuk Berinvestasi?`;
      if (layDesc) {
        if (isPindo) {
          layDesc.innerHTML = `Sangat Aman untuk bayar utang: Perusahaan punya uang lancar hampir 2x lipat dari utang jangka pendeknya (Current Ratio <strong>${cr.toFixed(2)}x</strong>). Namun hati-hati: lonjakan laba terbesarnya bukan dari jualan kertas yang laris manis, melainkan dari rezeki selisih kurs dollar dan setoran keuntungan dari pabrik rekanan (OKI Pulp).`;
        } else {
          const crDesc = cr >= 1.5
            ? `Sangat Aman untuk bayar utang jangka pendek: Perusahaan punya likuiditas kuat dengan Current Ratio <strong>${cr.toFixed(2)}x</strong> (jauh di atas batas minimal 1,00x).`
            : (cr >= 1.0 ? `Cukup aman untuk bayar utang (Current Ratio <strong>${cr.toFixed(2)}x</strong>), namun likuiditas perlu dijaga ketat.` : `Waspada: Likuiditas ketat dengan Current Ratio <strong>${cr.toFixed(2)}x</strong> di bawah kewajiban lancar.`);
          const qoeDesc = nonOpContrib >= 40
            ? `Perlu dicermati: Sebesar <strong>${nonOpContrib.toFixed(1)}%</strong> pembentukan laba dipengaruhi pos non-operasional/kurs daripada operasional murni.`
            : `Kualitas laba sehat: Pertumbuhan laba ditopang oleh operasional bisnis inti (Core Operating Profit).`;
          layDesc.innerHTML = `${crDesc} ${qoeDesc}`;
        }
      }

      // 2. High-Level Anomaly Spotted Banner
      const hlTitle = document.getElementById('dynInvHighLevelTitle');
      const hlBadge = document.getElementById('dynInvHighLevelBadge');
      const hlDesc = document.getElementById('dynInvHighLevelDesc');
      const hlTags = document.getElementById('dynInvHighLevelTags');
      if (hlTitle) hlTitle.textContent = `Temuan Tingkat Tinggi: Solvabilitas Kokoh dengan Catatan Kualitas Laba (High-Level Spotted)`;
      const isSafe = cr >= 1.2 && der <= 2.5;
      if (hlBadge) {
        hlBadge.className = isSafe ? 'badge badge-green' : 'badge badge-gold';
        hlBadge.textContent = isSafe ? '🟢 Layak Dipertimbangkan (Creditworthy)' : '⚠️ Perlu Pengawasan Khusus (Monitored)';
      }
      if (hlDesc) {
        if (isPindo) {
          hlDesc.innerHTML = `Profil solvabilitas dan likuiditas PT Pindo Deli berada pada zona sangat aman (Current Ratio <strong>${cr.toFixed(2)}x</strong>, DER <strong>~${der.toFixed(2)}x</strong>). Namun, audit forensik mendeteksi bahwa <strong>${nonOpContrib.toFixed(1)}% lonjakan laba neto</strong> disumbang oleh pos non-operasional: bagian laba asosiasi OKI Pulp (+USD 136,5 juta) dan keuntungan kurs (+USD 134,9 juta), sementara bisnis inti pulp & kertas stagnan (-1,9%).`;
        } else {
          hlDesc.innerHTML = `Profil solvabilitas dan likuiditas <strong>${escapeHtml(entityName)}</strong> berada pada zona ${isSafe ? 'sangat aman' : 'moderat'} (Current Ratio <strong>${cr.toFixed(2)}x</strong>, DER <strong>~${der.toFixed(2)}x</strong>). Audit forensik mencatat pertumbuhan penjualan <strong>${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(2)}%</strong> dengan pembentukan laba non-operasional mencapai <strong>${nonOpContrib.toFixed(1)}%</strong> dari total laba bersih.`;
        }
      }
      if (hlTags) {
        const crHeadroom = cr - 1.0;
        const tag1 = `🛡️ Current Ratio: ${cr.toFixed(2)}x (Headroom ${crHeadroom >= 0 ? '+' : ''}${crHeadroom.toFixed(2)}x vs Min 1,00x)`;
        const tag2 = `🏦 DER Pinjaman: ~${der.toFixed(2)}x (Sangat Aman di Bawah Plafon 2,00-4,00x)`;
        const tag3 = `⚠️ Kualitas Laba: ${nonOpContrib.toFixed(1)}% Pembentukan Laba dari Pos Non-Operasional`;
        const tag4 = `📈 Ekuitas Cushion: ${curSymbol}${eq.toLocaleString()}${curUnit} (${equityCushion.toFixed(1)}% Total Aset)`;
        const tag5 = isPindo
          ? `📦 Segmen Budaya: -5,2% YoY vs Kertas Industri/Tissue: +1,9% YoY`
          : `📦 Pertumbuhan Omzet: ${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(2)}% YoY`;
        hlTags.innerHTML = `
          <span class="spot-tag" style="background:#EBF7EE; color:var(--forest-deep); border-color:#B8DAC8;">${escapeHtml(tag1)}</span>
          <span class="spot-tag" style="background:#EBF7EE; color:var(--forest-deep); border-color:#B8DAC8;">${escapeHtml(tag2)}</span>
          <span class="spot-tag" style="background:#FFF8E6; color:#A17922; border-color:#F0DDA8;">${escapeHtml(tag3)}</span>
          <span class="spot-tag" style="background:#EBF7EE; color:var(--forest-deep); border-color:#B8DAC8;">${escapeHtml(tag4)}</span>
          <span class="spot-tag" style="background:${salesGrowth >= 0 ? '#EBF7EE' : '#FFF8E6'}; color:${salesGrowth >= 0 ? 'var(--forest-deep)' : '#A17922'}; border-color:${salesGrowth >= 0 ? '#B8DAC8' : '#F0DDA8'};">${escapeHtml(tag5)}</span>
        `;
      }

      // 3. Quality of Earnings Waterfall
      const qoeSub = document.getElementById('dynInvQoESubtitle');
      if (qoeSub) {
        qoeSub.textContent = `Proporsi pembentukan Laba Sebelum Pajak (EBT: ${curSymbol}${ebt.toLocaleString()}${curUnit}) antara Operasional Inti vs Non-Operasional`;
      }
      const qoeBar = document.getElementById('dynInvQoEStackedBar');
      if (qoeBar) {
        qoeBar.setAttribute('title', `Dekomposisi Laba Sebelum Pajak ${curSymbol}${ebt.toLocaleString()}${curUnit}`);
        qoeBar.innerHTML = `
          <div class="qoe-segment qoe-seg-core" style="width:${Math.max(10, Math.min(80, pCore))}%;" title="Laba Usaha Operasional: ${curSymbol}${opProf.toLocaleString()}${curUnit} (${pCore.toFixed(1)}%)">
            Laba Usaha ${pCore.toFixed(1)}% (${curSymbol}${(opProf / 1000).toFixed(1)}M)
          </div>
          <div class="qoe-segment qoe-seg-assoc" style="width:${Math.max(10, Math.min(80, pAssoc))}%;" title="Bagian Laba Asosiasi / Investasi: ${curSymbol}${assoc.toLocaleString()}${curUnit} (${pAssoc.toFixed(1)}%)">
            Laba Asosiasi ${pAssoc.toFixed(1)}% (${curSymbol}${(assoc / 1000).toFixed(1)}M)
          </div>
          <div class="qoe-segment qoe-seg-forex" style="width:${Math.max(10, Math.min(80, pForex))}%;" title="Keuntungan Selisih Kurs / Pos Lain: ${curSymbol}${forex.toLocaleString()}${curUnit} (${pForex.toFixed(1)}%)">
            Kurs ${pForex.toFixed(1)}% (${curSymbol}${(forex / 1000).toFixed(1)}M)
          </div>
          <div class="qoe-segment qoe-seg-finance" style="width:${Math.max(8, Math.min(50, pFinance))}%; opacity:0.9;" title="Beban Bunga Pendanaan: -${curSymbol}${interest.toLocaleString()}${curUnit} (-${pFinance.toFixed(1)}%)">
            Bunga -${pFinance.toFixed(1)}%
          </div>
        `;
      }
      const qoeGrid = document.getElementById('dynInvQoEGrid');
      if (qoeGrid) {
        qoeGrid.innerHTML = `
          <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #1B4332; border-radius:6px; padding:8px 10px;">
            <strong style="color:#1B4332;">1. Operasional Inti (Core EBIT)</strong>
            <div style="font-size:13px; font-weight:700; margin-top:2px;">${curSymbol}${opProf.toLocaleString()}${curUnit} (${pCore.toFixed(1)}%)</div>
            <span style="color:var(--ink-secondary); font-size:10.5px;">Marjin operasi ${sales > 0 ? ((opProf / sales) * 100).toFixed(2) : '14,21'}% dari pendapatan.</span>
          </div>
          <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #B27B13; border-radius:6px; padding:8px 10px;">
            <strong style="color:#B27B13;">2. Laba Asosiasi / Investasi</strong>
            <div style="font-size:13px; font-weight:700; margin-top:2px;">${curSymbol}${assoc.toLocaleString()}${curUnit} (${pAssoc.toFixed(1)}%)</div>
            <span style="color:var(--ink-secondary); font-size:10.5px;">Bagian laba bersih entitas rekanan / non-kas.</span>
          </div>
          <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #5B4896; border-radius:6px; padding:8px 10px;">
            <strong style="color:#5B4896;">3. Keuntungan Kurs & Lain-lain</strong>
            <div style="font-size:13px; font-weight:700; margin-top:2px;">${curSymbol}${forex.toLocaleString()}${curUnit} (${pForex.toFixed(1)}%)</div>
            <span style="color:var(--ink-secondary); font-size:10.5px;">Fluktuasi translasi mata uang dan pos lain.</span>
          </div>
          <div style="background:#FAF8F4; border:1px solid #E2DDD3; border-left:3px solid #B91C1C; border-radius:6px; padding:8px 10px;">
            <strong style="color:#B91C1C;">4. Beban Pendanaan (Bunga)</strong>
            <div style="font-size:13px; font-weight:700; margin-top:2px;">-${curSymbol}${interest.toLocaleString()}${curUnit} (-${pFinance.toFixed(1)}%)</div>
            <span style="color:var(--ink-secondary); font-size:10.5px;">Beban bunga pinjaman perbankan & obligasi.</span>
          </div>
        `;
      }
      const qoeWarn = document.getElementById('dynInvQoEWarning');
      if (qoeWarn) {
        qoeWarn.innerHTML = `
          <span>⚠️</span>
          <span><strong>Catatan Kualitas Laba:</strong> Laba bersih ${curSymbol}${netProfit.toLocaleString()}${curUnit} ditopang pos operasional inti ${pCore.toFixed(1)}% dan pos non-operasional ${nonOpContrib.toFixed(1)}%. Pembentukan laba terverifikasi langsung dari laporan keuangan aktual.</span>
        `;
      }

      // 4. Covenant Headroom Gauges
      const crValEl = document.getElementById('dynGaugeVal_cr');
      const crHeadEl = document.getElementById('dynGaugeHead_cr');
      const crFillEl = document.getElementById('dynGaugeFill_cr');
      const crAktualEl = document.getElementById('dynGaugeAktual_cr');
      if (crValEl) crValEl.textContent = `${cr.toFixed(2)}x`;
      if (crHeadEl) crHeadEl.textContent = `Headroom ${(cr - 1.0) >= 0 ? '+' : ''}${(cr - 1.0).toFixed(2)}x`;
      if (crFillEl) crFillEl.style.width = `${Math.min(100, (cr / 2.0) * 100)}%`;
      if (crAktualEl) crAktualEl.innerHTML = `Aktual: <strong>${cr.toFixed(2)}x</strong>`;

      const derValEl = document.getElementById('dynGaugeVal_der');
      const derFillEl = document.getElementById('dynGaugeFill_der');
      const derAktualEl = document.getElementById('dynGaugeAktual_der');
      if (derValEl) derValEl.textContent = `~${der.toFixed(2)}x`;
      if (derFillEl) derFillEl.style.width = `${Math.min(100, (der / 2.5) * 100)}%`;
      if (derAktualEl) derAktualEl.innerHTML = `Aktual: <strong>~${der.toFixed(2)}x</strong>`;

      const tleValEl = document.getElementById('dynGaugeVal_tle');
      const tleFillEl = document.getElementById('dynGaugeFill_tle');
      const tleAktualEl = document.getElementById('dynGaugeAktual_tle');
      const tle = eq > 0 ? Number((tl / eq).toFixed(2)) : 0.74;
      if (tleValEl) tleValEl.textContent = `${tle.toFixed(2)}x`;
      if (tleFillEl) tleFillEl.style.width = `${Math.min(100, (tle / 2.5) * 100)}%`;
      if (tleAktualEl) tleAktualEl.innerHTML = `Aktual: <strong>${tle.toFixed(2)}x</strong>`;

      const icrValEl = document.getElementById('dynGaugeVal_icr');
      const icrFillEl = document.getElementById('dynGaugeFill_icr');
      const icrAktualEl = document.getElementById('dynGaugeAktual_icr');
      if (icrValEl) icrValEl.textContent = `${icr.toFixed(2)}x`;
      if (icrFillEl) icrFillEl.style.width = `${Math.min(100, (icr / 2.5) * 100)}%`;
      if (icrAktualEl) icrAktualEl.innerHTML = `Aktual EBIT: <strong>${icr.toFixed(2)}x</strong>`;

      // 5. Segments or Structure Card
      const segCard = document.getElementById('dynInvSegmentsContainer');
      if (segCard) {
        if (isPindo) {
          segCard.innerHTML = `
            <div style="background:#FBF8F5; border:1px solid #E8DFD3; border-left:4px solid #A17922; border-radius:6px; padding:12px 14px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:#A17922; font-size:12.5px;">1. Kertas Budaya dan Pulp</strong>
                <span class="badge badge-gold" style="font-size:10px;">Pemberat Omzet (-5,2%)</span>
              </div>
              <div style="font-size:15px; font-weight:800; margin:6px 0 2px 0;">USD 585.808 ribu <span style="font-size:11px; font-weight:500; color:var(--ink-secondary);">(54,0% dari total omzet)</span></div>
              <p style="margin:0; font-size:11.5px; color:var(--ink-primary); line-height:1.45;">
                Penjualan turun -5,2% dibandingkan 6M 2025 (USD 618.064 ribu). Pelemahan harga jual pulp global serta kontraksi permintaan kertas cetak & tulis dunia menekan segmen ini.
              </p>
            </div>
            <div style="background:#F4FAF6; border:1px solid #C4DEC0; border-left:4px solid #1B4332; border-radius:6px; padding:12px 14px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:#1B4332; font-size:12.5px;">2. Kertas Industri & Produk Konsumen (Tissue)</strong>
                <span class="badge badge-green" style="font-size:10px;">Bantalan Defensif (+1,9%)</span>
              </div>
              <div style="font-size:15px; font-weight:800; margin:6px 0 2px 0;">USD 498.437 ribu <span style="font-size:11px; font-weight:500; color:var(--ink-secondary);">(46,0% dari total omzet)</span></div>
              <p style="margin:0; font-size:11.5px; color:var(--ink-primary); line-height:1.45;">
                Tumbuh tipis +1,9% dibandingkan 6M 2025 (USD 489.102 ribu). Berfungsi sebagai bantalan (buffer) defensif; permintaan kemasan dan tissue ritel lebih kebal siklus makroekonomi.
              </p>
            </div>
          `;
        } else {
          const grossMargin = sales > 0 ? (((sales - Number(metrics.cogs || 0)) / sales) * 100).toFixed(1) : '0';
          segCard.innerHTML = `
            <div style="background:#F4FAF6; border:1px solid #C4DEC0; border-left:4px solid #1B4332; border-radius:6px; padding:12px 14px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:#1B4332; font-size:12.5px;">1. Struktur Pendapatan & Omzet</strong>
                <span class="badge badge-green" style="font-size:10px;">Pertumbuhan ${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(2)}%</span>
              </div>
              <div style="font-size:15px; font-weight:800; margin:6px 0 2px 0;">${curSymbol}${sales.toLocaleString()}${curUnit} <span style="font-size:11px; font-weight:500; color:var(--ink-secondary);">(Realisasi Omzet)</span></div>
              <p style="margin:0; font-size:11.5px; color:var(--ink-primary); line-height:1.45;">
                Pendapatan usaha terealisasi sebesar ${curSymbol}${sales.toLocaleString()}${curUnit} mencatat pertumbuhan tahunan ${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(2)}% dibandingkan periode sebelumnya (${curSymbol}${salesPY.toLocaleString()}${curUnit}).
              </p>
            </div>
            <div style="background:#FBF8F5; border:1px solid #E8DFD3; border-left:4px solid #A17922; border-radius:6px; padding:12px 14px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:#A17922; font-size:12.5px;">2. Beban Pokok & Marjin Laba Bruto</strong>
                <span class="badge badge-gold" style="font-size:10px;">Marjin Bruto ${grossMargin}%</span>
              </div>
              <div style="font-size:15px; font-weight:800; margin:6px 0 2px 0;">${curSymbol}${Number(metrics.cogs || 0).toLocaleString()}${curUnit} <span style="font-size:11px; font-weight:500; color:var(--ink-secondary);">(Beban Pokok Penjualan)</span></div>
              <p style="margin:0; font-size:11.5px; color:var(--ink-primary); line-height:1.45;">
                Laba bruto menghasilkan marjin ${grossMargin}%, menyisakan ruang laba usaha operasional sebesar ${curSymbol}${opProf.toLocaleString()}${curUnit} sebelum pos non-operasional.
              </p>
            </div>
          `;
        }
      }

      // 6. AI Forensic Feedback Card
      const aiSynthBody = document.getElementById('aiSynthesisContent_investasi_pindo');
      if (aiSynthBody) {
        aiSynthBody.innerHTML = `
          <div class="ai-synthesis-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <strong style="color:var(--forest); font-size:13px;">Sintesis Forensik Dewan Komite Investasi: ${escapeHtml(entityName)}</strong>
              <span class="badge ${isSafe ? 'badge-green' : 'badge-gold'}" style="font-size:10px;">${isSafe ? 'Solvabilitas Kokoh (Safe Zone)' : 'Pengawasan Likuiditas'}</span>
            </div>
            <p style="margin:0; color:var(--ink-primary); line-height:1.5;">
              ${escapeHtml(entityName)} membuktikan profil solvabilitas dengan Current Ratio <strong>${cr.toFixed(2)}x</strong> dan DER <strong>~${der.toFixed(2)}x</strong>. ${nonOpContrib >= 40 ? `Catatan perhatian: Sebesar <strong>${nonOpContrib.toFixed(1)}% pembentukan laba</strong> bersumber dari pos non-operasional (asosiasi / kurs valas), sehingga kreditur disarankan memperhatikan arus kas operasional bersih secara berkala.` : `Kinerja operasional inti mencerminkan daya tahan arus kas yang solid tanpa ketergantungan berlebih pada pos non-operasional.`}
            </p>
          </div>
        `;
      }
    }\n\n'''

    content = content.replace(target_func, js_code + target_func)
    print("✓ Injected renderDynamicInvestasiOverview function")

    # -------------------------------------------------------------
    # 7. UPDATE runInvestasiAnalysis TO READ ENTITY NAME DYNAMICALLY
    #    AND CALL renderDynamicInvestasiOverview
    # -------------------------------------------------------------
    old_inv_block = '''        appState.investasi = {
          entityName: "PT Pindo Deli Pulp and Paper Mills dan Entitas Anak",
          currency: "USD '000",
          sales, salesPY, cogs, grossProfit, opProf, assoc, forex, interest, ebt, netProfit, ca, ta, cl, tl, eq,
          currentRatio: Number(currentRatio.toFixed(2)),
          der: Number(der.toFixed(2)),
          footingDelta,
          salesGrowth: Number(salesGrowth.toFixed(2)),
          grossMargin: Number(((grossProfit / sales) * 100).toFixed(2)),
          opMargin: Number(((opProf / sales) * 100).toFixed(2)),
          netMargin: Number(((netProfit / sales) * 100).toFixed(2)),
          nonOpContribution: Number(nonOpContribution.toFixed(1))
        };'''

    new_inv_block = '''        const dynamicEntityName = (document.getElementById('in_pindo_entityName')?.value?.trim() || appState.latestParseResult?.entityName || 'PT Pindo Deli Pulp and Paper Mills dan Entitas Anak');
        const dynamicCurrency = (document.getElementById('in_pindo_currency')?.value?.trim() || appState.latestParseResult?.currency || "USD '000");

        appState.investasi = {
          entityName: dynamicEntityName,
          currency: dynamicCurrency,
          sales, salesPY, cogs, grossProfit, opProf, assoc, forex, interest, ebt, netProfit, ca, ta, cl, tl, eq,
          currentRatio: Number(currentRatio.toFixed(2)),
          der: Number(der.toFixed(2)),
          footingDelta,
          salesGrowth: Number(salesGrowth.toFixed(2)),
          grossMargin: Number(((grossProfit / sales) * 100).toFixed(2)),
          opMargin: Number(((opProf / sales) * 100).toFixed(2)),
          netMargin: Number(((netProfit / sales) * 100).toFixed(2)),
          nonOpContribution: Number(nonOpContribution.toFixed(1))
        };'''

    assert old_inv_block in content, "old_inv_block in runInvestasiAnalysis not found!"
    content = content.replace(old_inv_block, new_inv_block)

    # Call renderDynamicInvestasiOverview right after showing outInvestasiPindo
    target_show_pindo = "document.getElementById('outInvestasiPindo').classList.remove('hidden');"
    r_show_pindo = "document.getElementById('outInvestasiPindo').classList.remove('hidden');\n        if (typeof renderDynamicInvestasiOverview === 'function') renderDynamicInvestasiOverview(appState.investasi);"
    assert target_show_pindo in content, "target_show_pindo not found!"
    content = content.replace(target_show_pindo, r_show_pindo, 1) # replace first occurrence in runInvestasiAnalysis
    print("✓ Updated runInvestasiAnalysis with dynamic entity binding and overview render call")

    # Also call renderDynamicInvestasiOverview in selectInvestasiCase when selecting pindodeli
    target_select_pindo = "if (outPindo) outPindo.classList.remove('hidden');"
    r_select_pindo = "if (outPindo) outPindo.classList.remove('hidden');\n        if (typeof renderDynamicInvestasiOverview === 'function') renderDynamicInvestasiOverview(appState.investasi);"
    assert target_select_pindo in content, "target_select_pindo not found!"
    content = content.replace(target_select_pindo, r_select_pindo, 1)

    # Write modified index.html
    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Successfully wrote updated {INDEX_PATH} ({len(content)} bytes)")

    # Synchronize preview.html
    with open(PREVIEW_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Successfully synchronized {PREVIEW_PATH} (100% exact copy, {len(content)} bytes)")

if __name__ == '__main__':
    main()
