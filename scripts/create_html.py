html_content = """<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YKPP & Solanascope — AI Financial Analysis Platform</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="app-container">
    <!-- Top Executive Header -->
    <header class="app-header">
      <div class="brand-section">
        <div class="brand-logo">YK</div>
        <div class="brand-title">
          <h1>Platform Terpadu AI Analisis Laporan Keuangan</h1>
          <p>YKPP Divisi Keuangan & Subsidiary · Sesuai MOM Kajian Keuangan Terstruktur</p>
        </div>
      </div>

      <div class="header-controls">
        <div class="role-badge">
          <span>Peran Pengguna:</span>
          <select id="userRoleSelect" onchange="window.handleRoleChange(this.value)">
            <option value="reviewer">Reviewer Hasil (Konsultan / Kepala Divisi)</option>
            <option value="configurator">Penyusun Parameter (Advisor / Metodologi)</option>
          </select>
        </div>

        <button class="btn btn-gold" onclick="window.downloadExcelTemplate()">
          📥 Unduh Template Excel 3-Sheet
        </button>

        <button class="btn btn-secondary" onclick="window.openUploadModal()">
          📤 Unggah File (Excel/PDF)
        </button>

        <button class="btn btn-secondary" onclick="window.openSettingsModal()" title="Pengaturan Gemini API">
          ⚙️ Gemini API
        </button>
      </div>
    </header>

    <!-- 8 Action Items Tracker Bar -->
    <div class="action-items-bar">
      <div style="font-weight: 600; display:flex; align-items:center; gap:6px;">
        <span>Status 8 Action Items MOM:</span>
      </div>
      <div class="ai-status-group">
        <div class="ai-chip done" title="Action Item 1">✅ #1 Parameter Baku</div>
        <div class="ai-chip done" title="Action Item 2">✅ #2 Template 3-Sheet</div>
        <div class="ai-chip done" title="Action Item 3">✅ #3 Prompt Standar (RTC/YoY/MoM)</div>
        <div class="ai-chip done" title="Action Item 4">✅ #4 Log & Sequencing</div>
        <div class="ai-chip done" title="Action Item 5">✅ #5 Rekonsiliasi Selisih</div>
        <div class="ai-chip done" title="Action Item 6">✅ #6 File Ingestion</div>
        <div class="ai-chip done" title="Action Item 7">✅ #7 Dual-Role Reviewer</div>
        <div class="ai-chip done" title="Action Item 8">🚀 #8 Agenda Hari Ini (Live)</div>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <nav class="nav-tabs">
      <button class="nav-tab-btn active" onclick="window.switchTab('agenda')">📋 Agenda Hari Ini</button>
      <button class="nav-tab-btn" onclick="window.switchTab('pengendali')">🏢 Entitas Pengendali (2)</button>
      <button class="nav-tab-btn" onclick="window.switchTab('nonpengendali')">🤝 Entitas Non-Pengendali</button>
      <button class="nav-tab-btn" onclick="window.switchTab('investasi')">📈 Investasi Portofolio (2)</button>
      <button class="nav-tab-btn" onclick="window.switchTab('konsolidasi')">🏛️ Konsolidasi Akhir Grup</button>
      <button class="nav-tab-btn" onclick="window.switchTab('rekonsiliasi')">⚖️ Rekonsiliasi Selisih</button>
      <button class="nav-tab-btn" onclick="window.switchTab('auditlog')">📜 Log Analisis & Sesi</button>
      <button class="nav-tab-btn" onclick="window.switchTab('parameter')">⚙️ Parameter & Ambang Batas</button>
    </nav>

    <!-- Main Dynamic Content Container -->
    <main class="main-content">
      
      <!-- TAB 1: AGENDA HARI INI -->
      <section id="pane-agenda" class="tab-pane active">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <h2>Eksekusi Terpadu Agenda Analisis Hari Ini</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Sesuai butir 8 MOM: Melakukan analisis terpadu atas 2 Investasi, 2 Entitas Pengendali, dan Non-Pengendali, lalu ditutup dengan Konsolidasi Akhir.
            </p>
          </div>
          <button class="btn btn-primary" onclick="window.runFullDailyPipeline()" style="font-size:13.5px; padding:10px 18px;">
            ⚡ Jalankan Seluruh Alur Analisis Otomatis
          </button>
        </div>

        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <span class="card-title">1. Entitas Pengendali (2)</span>
              <span class="badge badge-red">6 Temuan</span>
            </div>
            <div class="kpi-big">PT EPS & Anak I</div>
            <p class="kpi-sub">Defisit NWC -Rp40,49 M | Opex Growth +32,91% melampaui Omzet +31,45% | Bonus 2.308% RKAP</p>
            <div style="margin-top:14px;">
              <button class="btn btn-secondary" onclick="window.switchTab('pengendali')">Buka Analisis Pengendali →</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">2. Entitas Non-Pengendali (1)</span>
              <span class="badge badge-red">Tier Merah</span>
            </div>
            <div class="kpi-big">PT POJ (1% Saham)</div>
            <p class="kpi-sub">Piutang Pihak Ketiga 301,20% RKAP (Rp91,18 M) | Utang Dividen Rp110,27 M | Current Ratio 0,52x</p>
            <div style="margin-top:14px;">
              <button class="btn btn-secondary" onclick="window.switchTab('nonpengendali')">Buka Monitoring Non-Pengendali →</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">3. Investasi Portofolio (2)</span>
              <span class="badge badge-yellow">Risk Overlay</span>
            </div>
            <div class="kpi-big">PT Daaz & Pegadaian</div>
            <p class="kpi-sub">Daaz: Modified Z 2,54 (Aman) | Pegadaian: Risk Overlay Rp20 T Agunan / Stress Loss Rp2 T (Yellow)</p>
            <div style="margin-top:14px;">
              <button class="btn btn-secondary" onclick="window.switchTab('investasi')">Buka Analisis Investasi →</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">4. Konsolidasi Akhir Grup</span>
              <span class="badge badge-green">DER 0.96x (POJK Safe)</span>
            </div>
            <div class="kpi-big">$3.885,0 M Omzet</div>
            <p class="kpi-sub">Laba Bersih Konsol $325,0 M (+14,2%) | ROA 5,4% | NCI Mismatch Sub II +34,1% (Critical Flag)</p>
            <div style="margin-top:14px;">
              <button class="btn btn-secondary" onclick="window.switchTab('konsolidasi')">Buka Konsolidasi Akhir →</button>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:18px;">
          <h3 style="margin-bottom:12px;">Urutan Proses Baku Eksekusi Analisis (Standardized Sequencing Workflow)</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            <div style="background:var(--surface-alt); padding:14px; border-radius:var(--radius-md); border-left:4px solid var(--forest);">
              <div style="font-weight:600; font-size:13px;">Langkah 1: Pengendali</div>
              <p style="font-size:12px; color:var(--ink-secondary);">Ekstraksi Laporan Manajemen, footing 23 hlm, verifikasi CALK, deteksi sinyal forensik S1-S10.</p>
            </div>
            <div style="background:var(--surface-alt); padding:14px; border-radius:var(--radius-md); border-left:4px solid var(--gold);">
              <div style="font-weight:600; font-size:13px;">Langkah 2: Non-Pengendali</div>
              <p style="font-size:12px; color:var(--ink-secondary);">Evaluasi hak dividen YKPP, risiko refinancing, tiering Merah/Kuning/Hijau, rumusan pertanyaan kritis.</p>
            </div>
            <div style="background:var(--surface-alt); padding:14px; border-radius:var(--radius-md); border-left:4px solid var(--orange);">
              <div style="font-weight:600; font-size:13px;">Langkah 3: Investasi</div>
              <p style="font-size:12px; color:var(--ink-secondary);">Perhitungan 33 rasio, Altman & Modified Z-Score anualisasi, komparasi 4-dimensi (MoM/YoY/RTC), stress test.</p>
            </div>
            <div style="background:var(--surface-alt); padding:14px; border-radius:var(--radius-md); border-left:4px solid var(--blue);">
              <div style="font-weight:600; font-size:13px;">Langkah 4: Konsolidasi Akhir</div>
              <p style="font-size:12px; color:var(--ink-secondary);">Agregasi 6 entitas, eliminasi transaksi afiliasi, pembagian NCI IFRS 10, POJK benchmarking.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 2: ENTITAS PENGENDALI -->
      <section id="pane-pengendali" class="tab-pane">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2>Fungsi 1: Analisis Entitas Pengendali (PT EPS & Anak I)</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Analisis Vertikal & Horizontal, Uji Matematis Footing Neraca-Laba Rugi, 10 Sinyal Forensik, dan Draf Nota Dinas Hasil Verifikasi 19 Bagian.
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary" onclick="window.exportNotaDinas('PT Era Permata Sejahtera')">📄 Cetak / Ekspor Nota Dinas</button>
            <button class="btn btn-primary" onclick="window.runPengendaliAnalysis()">🔄 Jalankan Verifikasi Ulang</button>
          </div>
        </div>

        <div id="pengendali-content">
          <div style="text-align:center; padding:40px; color:var(--ink-muted);">Memuat data analisis pengendali...</div>
        </div>
      </section>

      <!-- TAB 3: ENTITAS NON-PENGENDALI -->
      <section id="pane-nonpengendali" class="tab-pane">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2>Fungsi 2: Analisis Entitas Non-Pengendali (PT POJ - Saham 1%)</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Monitoring Investasi Minoritas YKPP, Tiering Perhatian Merah/Kuning/Hijau, Proteksi Dividen, dan Perumusan Pertanyaan Kritis Tata Kelola.
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary" onclick="window.exportNotaDinas('PT Pesonna Optima Jasa')">📄 Draf Memo Monitoring YKPP</button>
            <button class="btn btn-primary" onclick="window.runNonPengendaliAnalysis()">🔄 Perbarui Analisis Non-Pengendali</button>
          </div>
        </div>

        <div id="nonpengendali-content">
          <div style="text-align:center; padding:40px; color:var(--ink-muted);">Memuat data analisis non-pengendali...</div>
        </div>
      </section>

      <!-- TAB 4: INVESTASI PORTOFOLIO -->
      <section id="pane-investasi" class="tab-pane">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2>Fungsi 3: Analisis Investasi (Obligasi & Saham)</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Komparasi 4 Dimensi (Tahun Lalu, Bulan Lalu, YoY %, RTC / Realisasi Terhadap RKAP %), 33 Rasio Baku, Modified Z-Score Anualisasi, dan Risk Overlay.
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <select id="investasiSelector" onchange="window.loadInvestasi(this.value)" style="padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--line-strong); font-weight:600;">
              <option value="investasi-daaz">PT Daaz Bara Lestari Tbk (Interim Juni 2026)</option>
              <option value="investasi-pegadaian">PT Pegadaian (Obligasi + Risk Overlay September 2026)</option>
            </select>
            <button class="btn btn-primary" onclick="window.runInvestasiAnalysis()">🔄 Hitung Ulang 33 Rasio</button>
          </div>
        </div>

        <div id="investasi-content">
          <div style="text-align:center; padding:40px; color:var(--ink-muted);">Memuat data analisis investasi...</div>
        </div>
      </section>

      <!-- TAB 5: KONSOLIDASI AKHIR -->
      <section id="pane-konsolidasi" class="tab-pane">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2>Konsolidasi Akhir: Grup Yayasan Holding (6 Entitas)</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Multi-Entity Consolidation Engine, Eliminasi Antar-Perusahaan, Atribusi Hak Minoritas (IFRS 10 / PSAK 65), dan Tolok Ukur Regulasi POJK.
            </p>
          </div>
          <button class="btn btn-primary" onclick="window.runKonsolidasiAnalysis()">🔄 Jalankan Mesin Konsolidasi</button>
        </div>

        <div id="konsolidasi-content">
          <div style="text-align:center; padding:40px; color:var(--ink-muted);">Memuat data konsolidasi grup...</div>
        </div>
      </section>

      <!-- TAB 6: REKONSILIASI SELISIH -->
      <section id="pane-rekonsiliasi" class="tab-pane">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2>Action Item 5: Matriks Rekonsiliasi Selisih Angka Antar Sumber</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Dokumentasi akar penyebab disparitas angka antara spreadsheet Excel, dokumen kajian fisik/PDF, dan keluaran model AI.
            </p>
          </div>
        </div>

        <div id="rekonsiliasi-content"></div>
      </section>

      <!-- TAB 7: LOG ANALISIS & SESI -->
      <section id="pane-auditlog" class="tab-pane">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2>Action Item 4: Buku Log Analisis, Sequencing & Riwayat Sesi</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Pencatatan frekuensi eksekusi, urutan alur proses (sequencing), dan rekam jejak keputusan review pengguna.
            </p>
          </div>
          <button class="btn btn-secondary" onclick="window.refreshAuditLogs()">🔄 Segarkan Log Audit</button>
        </div>

        <div id="auditlog-content"></div>
      </section>

      <!-- TAB 8: PARAMETER & AMBANG BATAS -->
      <section id="pane-parameter" class="tab-pane">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2>Action Item 1: Kamus Parameter Baku, Bobot & Ambang Batas</h2>
            <p style="color:var(--ink-secondary); font-size:13px;">
              Parameter baku resmi YKPP: formula 33 rasio, formula Modified Z-Score, threshold RTC, dan plafon regulasi POJK.
            </p>
          </div>
          <div id="paramEditNotice" style="font-size:12px; color:var(--gold); font-weight:600;">
            * Mode Reviewer Aktif (Pilih Mode 'Penyusun Parameter' di kanan atas untuk mengedit batas)
          </div>
        </div>

        <div id="parameter-content"></div>
      </section>

    </main>

    <!-- FLOATING AI FORENSIC COPILOT PANEL -->
    <div id="copilotPanel" class="copilot-panel">
      <div class="copilot-header" onclick="window.toggleCopilot()">
        <div class="copilot-title">
          <span>🤖 AI Forensic Copilot</span>
          <span style="font-size:11px; background:rgba(255,255,255,0.2); padding:2px 6px; border-radius:10px;">RAG + Gemini</span>
        </div>
        <div id="copilotToggleIcon">▾</div>
      </div>

      <div class="copilot-chat" id="copilotChat">
        <div class="chat-bubble agent">
          Halo, saya <strong>AI Forensic Copilot YKPP</strong>. Saya telah mengindeks seluruh aturan PRD, kajian obligasi, batas POJK, dan laporan keuangan interim 2026.
          <br><br>
          Silakan ajukan pertanyaan seputar:
          <br>• Disparitas NCI pada Subsidiary II
          <br>• Lonjakan piutang PT POJ 301,20% RKAP (RTC)
          <br>• Skor Modified Z-Score PT Daaz (2,54) vs PT Pegadaian
          <br>• Defisit modal kerja dan lonjakan opex PT EPS
        </div>
      </div>

      <div class="copilot-input-area">
        <input type="text" id="copilotInput" placeholder="Ketik pertanyaan audit forensik..." onkeydown="if(event.key==='Enter') window.sendCopilotMessage()">
        <button class="btn btn-primary" onclick="window.sendCopilotMessage()">Kirim</button>
      </div>
    </div>

    <!-- MODAL GEMINI API SETTINGS -->
    <div id="settingsModal" class="modal-overlay">
      <div class="modal-content">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3>Konfigurasi Google Gemini API</h3>
          <button style="border:none; background:none; font-size:18px; cursor:pointer;" onclick="window.closeModal('settingsModal')">✕</button>
        </div>
        <p style="font-size:13px; color:var(--ink-secondary); margin-bottom:16px;">
          Platform ini dilengkapi dengan integrasi langsung Google Gemini API (model default: <code>gemini-2.5-flash</code>) yang diperkuat dengan local RAG (Retrieval-Augmented Generation).
        </p>
        <div style="margin-bottom:16px;">
          <label style="display:block; font-weight:600; font-size:12.5px; margin-bottom:6px;">Google Gemini API Key:</label>
          <input type="password" id="geminiApiKeyInput" placeholder="Masukkan Google Gemini API Key Anda (AIza...)" style="width:100%; padding:10px; border:1px solid var(--line-strong); border-radius:var(--radius-sm); font-family:monospace; font-size:13px;">
          <small style="color:var(--ink-muted); display:block; margin-top:4px;">
            * Jika tidak diisi, platform secara otomatis menggunakan Deterministic Forensic Reasoning Engine berbasis RAG lokal tanpa kendala.
          </small>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn btn-secondary" onclick="window.closeModal('settingsModal')">Batal</button>
          <button class="btn btn-primary" onclick="window.saveGeminiKey()">Simpan Konfigurasi</button>
        </div>
      </div>
    </div>

    <!-- MODAL FILE UPLOAD -->
    <div id="uploadModal" class="modal-overlay">
      <div class="modal-content">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3>Unggah Laporan Keuangan (File Ingestion)</h3>
          <button style="border:none; background:none; font-size:18px; cursor:pointer;" onclick="window.closeModal('uploadModal')">✕</button>
        </div>
        <p style="font-size:13px; color:var(--ink-secondary);">
          Unggah file Excel (3-sheet template), PDF Laporan Manajemen, atau JSON canonical untuk diuraikan otomatis oleh parser.
        </p>

        <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
          <div style="font-size:32px; margin-bottom:8px;">📁</div>
          <div style="font-weight:600; font-size:14px;">Klik untuk memilih file atau Drag & Drop ke sini</div>
          <p style="font-size:12px; color:var(--ink-muted); margin-top:4px;">Mendukung format .XLSX, .PDF, .JSON</p>
          <input type="file" id="fileInput" style="display:none;" onchange="window.handleFileUpload(this.files)">
        </div>

        <div style="background:var(--surface-alt); padding:12px; border-radius:var(--radius-sm); font-size:12px; border:1px solid var(--line);">
          <strong>Catatan Ingestion:</strong> Sistem akan mencocokkan nama akun dengan taksonomi canonical (22 akun dasar) dan memverifikasi keseimbangan neraca serta footing CALK secara instan.
        </div>
      </div>
    </div>

    <!-- MODAL NOTA DINAS EXPORT PREVIEW -->
    <div id="memoModal" class="modal-overlay">
      <div class="modal-content" style="max-width:850px; max-height:85vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; position:sticky; top:0; background:#FFF; padding-bottom:8px; border-bottom:1px solid var(--line);">
          <h3 id="memoModalTitle">Nota Dinas Hasil Verifikasi</h3>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary" onclick="window.printMemo()">🖨️ Cetak / Simpan PDF</button>
            <button style="border:none; background:none; font-size:18px; cursor:pointer;" onclick="window.closeModal('memoModal')">✕</button>
          </div>
        </div>
        <div id="memoModalBody" style="font-size:13.5px; line-height:1.6; color:#222; font-family:'IBM Plex Sans', sans-serif;"></div>
      </div>
    </div>

  </div>

  <script src="/app.js"></script>
</body>
</html>
"""

with open("public/index.html", "w") as f:
    f.write(html_content)
print("public/index.html written successfully via helper script")
