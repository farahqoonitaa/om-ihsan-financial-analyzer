import re

def update_remaining():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update ndInvestasiDaazBox
    old_daaz_audit = """                <div id="nd_s1_s10_audit_investasi_daaz" class="nd-s1-s10-audit-section">
                  <h5>IV. Rincian Perhitungan Forensik Lengkap S1–S10 (9-Komponen Standar Audit)</h5>
                  <p style="font-size:12px; color:#374151; margin-bottom:10px;">
                    Rincian perhitungan lengkap S1–S10, substitusi matematis, tolok ukur, rantai penalaran bukti, serta korelasi antar-indikator untuk evaluasi Sukuk/Obligasi <strong>PT DAAZ Bara Lestari Tbk</strong>:
                  </p>
                  <div id="nd_s1_s10_cards_investasi_daaz"></div>
                </div>"""

    new_daaz_audit = """                <!-- SEKSI IV: MATRIKS EKSEKUTIF SINYAL FORENSIK S1-S10 (REFINED SYNTHESIS MATRIX) -->
                <div class="eo-section" id="eo_section_iv_daaz" style="page-break-inside:avoid;">
                  <h5 style="margin-top:14px; border-bottom:1px solid #1b3d2f; padding-bottom:3px; color:#1b3d2f; font-weight:bold;">IV. Matriks Eksekutif Sinyal Forensik S1–S10 (Refined Signal Synthesis Matrix)</h5>
                  <p style="margin-bottom:8px; font-size:12.5px; color:#374151;">
                    Ikhtisar sintesis forensik kesepuluh prosedur analitis (<strong>S1 s/d S10</strong>) pada <strong>PT DAAZ Bara Lestari Tbk</strong>:
                  </p>
                  <div id="nd_matrix_investasi_daaz"></div>
                </div>

                <!-- KERTAS KERJA DIAGNOSTIK RINCI S1-S10 (COLLAPSIBLE FOR AUDITORS) -->
                <div id="nd_s1_s10_audit_investasi_daaz" class="nd-s1-s10-audit-section">
                  <details class="no-print extended-audit-details" id="details_s1_s10_investasi_daaz" style="margin-top:16px; background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:8px; padding:10px 14px;">
                    <summary style="font-size:12.5px; font-weight:700; color:#0F5338; cursor:pointer; user-select:none;">
                      📑 Buka Rincian Lengkap Kertas Kerja Diagnostik S1–S10 (9 Komponen Standar Audit Forensik)
                    </summary>
                    <div style="margin-top:12px;">
                      <p style="font-size:11.5px; color:#475569; margin-bottom:10px;">
                        Rincian perhitungan lengkap S1–S10, substitusi matematis, tolok ukur, rantai penalaran bukti, serta korelasi antar-indikator untuk evaluasi Sukuk/Obligasi <strong>PT DAAZ Bara Lestari Tbk</strong>:
                      </p>
                      <div id="nd_s1_s10_cards_investasi_daaz"></div>
                    </div>
                  </details>
                </div>"""

    if old_daaz_audit in html:
        html = html.replace(old_daaz_audit, new_daaz_audit)
        print("1. Refined ndInvestasiDaazBox")

    # 2. Update ndKonsolidasiBox
    old_kons_audit = """            <div id="nd_s1_s10_audit_konsolidasi" class="nd-s1-s10-audit-section">
              <h5>IV. Rincian Perhitungan Forensik Lengkap S1–S10 Konsolidasi Grup (9-Komponen Standar Audit)</h5>
              <p style="font-size:12px; color:#374151; margin-bottom:10px;">
                Bagian ini menyajikan rincian perhitungan matematis langkah demi langkah, tolok ukur, klasifikasi, rantai penalaran bukti (<em>Source Evidence → Extracted Values → Calculation → Benchmark Comparison → Interpretation → Forensic Finding → Implication</em>), serta sintesis korelasi antar-indikator untuk <strong>S1 hingga S10</strong> pada <strong>Konsolidasi Finansial Grup 6 Entitas</strong> (1 Induk Holding &amp; 5 Anak Perusahaan).
              </p>
              <div id="nd_s1_s10_cards_konsolidasi"></div>
            </div>"""

    new_kons_audit = """            <!-- SEKSI IV: MATRIKS EKSEKUTIF SINYAL FORENSIK S1-S10 (REFINED SYNTHESIS MATRIX) -->
            <div class="eo-section" id="eo_section_iv_konsolidasi" style="page-break-inside:avoid;">
              <h5 style="margin-top:14px; border-bottom:1px solid #1b3d2f; padding-bottom:3px; color:#1b3d2f; font-weight:bold;">IV. Matriks Eksekutif Sinyal Forensik S1–S10 (Refined Signal Synthesis Matrix)</h5>
              <p style="margin-bottom:8px; font-size:12.5px; color:#374151;">
                Ikhtisar sintesis forensik kesepuluh prosedur analitis (<strong>S1 s/d S10</strong>) pada <strong>Konsolidasi Finansial Grup 6 Entitas</strong>:
              </p>
              <div id="nd_matrix_konsolidasi"></div>
            </div>

            <!-- KERTAS KERJA DIAGNOSTIK RINCI S1-S10 (COLLAPSIBLE FOR AUDITORS) -->
            <div id="nd_s1_s10_audit_konsolidasi" class="nd-s1-s10-audit-section">
              <details class="no-print extended-audit-details" id="details_s1_s10_konsolidasi" style="margin-top:16px; background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:8px; padding:10px 14px;">
                <summary style="font-size:12.5px; font-weight:700; color:#0F5338; cursor:pointer; user-select:none;">
                  📑 Buka Rincian Lengkap Kertas Kerja Diagnostik S1–S10 (9 Komponen Standar Audit Forensik)
                </summary>
                <div style="margin-top:12px;">
                  <p style="font-size:11.5px; color:#475569; margin-bottom:10px;">
                    Bagian ini menyajikan rincian perhitungan matematis langkah demi langkah, tolok ukur, klasifikasi, rantai penalaran bukti (<em>Source Evidence → Extracted Values → Calculation → Benchmark Comparison → Interpretation → Forensic Finding → Implication</em>), serta sintesis korelasi antar-indikator untuk <strong>S1 hingga S10</strong> pada <strong>Konsolidasi Finansial Grup 6 Entitas</strong> (1 Induk Holding &amp; 5 Anak Perusahaan).
                  </p>
                  <div id="nd_s1_s10_cards_konsolidasi"></div>
                </div>
              </details>
            </div>"""

    if old_kons_audit in html:
        html = html.replace(old_kons_audit, new_kons_audit)
        print("2. Refined ndKonsolidasiBox")

    # 3. Attach matrix rendering to Investasi Daaz and Konsolidasi builders
    daaz_ret = "return cardsHtml + synthesisHtml;\n    }\n\n    function buildS1toS10KonsolidasiHTML()"
    new_daaz_ret = """try {
        const mEl = document.getElementById('nd_matrix_investasi_daaz');
        if (mEl && typeof renderExecutiveSignalMatrix === 'function') {
          mEl.innerHTML = renderExecutiveSignalMatrix(signals, 'inv_daaz');
        }
      } catch (e) {}
      return cardsHtml + synthesisHtml;
    }

    function buildS1toS10KonsolidasiHTML()"""
    if daaz_ret in html:
        html = html.replace(daaz_ret, new_daaz_ret)
        print("3. Attached matrix rendering to Investasi Daaz")

    kons_ret = "return cardsHtml + synthesisHtml;\n    }\n\n    function renderAllNotaDinasS1toS10()"
    new_kons_ret = """try {
        const mEl = document.getElementById('nd_matrix_konsolidasi');
        if (mEl && typeof renderExecutiveSignalMatrix === 'function') {
          mEl.innerHTML = renderExecutiveSignalMatrix(signals, 'konsolidasi');
        }
      } catch (e) {}
      return cardsHtml + synthesisHtml;
    }

    function renderAllNotaDinasS1toS10()"""
    if kons_ret in html:
        html = html.replace(kons_ret, new_kons_ret)
        print("4. Attached matrix rendering to Konsolidasi")

    # 4. Add Export Format Selector to Pengendali Step 5
    old_p_step5 = """              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
                <!-- Big Word Button -->
                <button type="button" onclick="downloadNotaDinasDoc('pengendali')" class="btn btn-primary boomer-action-btn-primary">"""

    new_p_step5 = """              <!-- EXPORT FORMAT SELECTOR (OFFICIAL EXPECTED OUTPUT VS EXTENDED) -->
              <div class="export-format-selector" style="background:#F1F5F9; border:1.5px solid #CBD5E1; border-radius:8px; padding:10px 14px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                <div style="font-size:12.5px; font-weight:700; color:#0F5338; display:flex; align-items:center; gap:6px;">
                  <span>⚙️ Pilihan Format Ekspor &amp; Cetak:</span>
                </div>
                <div style="display:flex; align-items:center; gap:16px; font-size:12px;">
                  <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-weight:700; color:#0F5338;">
                    <input type="radio" name="exportFormat_pengendali" value="executive" checked onchange="setExportFormat('pengendali', 'executive')">
                    🌟 Format Eksekutif Resmi (~2-3 Hal Sesuai Expected Output)
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-weight:500; color:#475569;">
                    <input type="radio" name="exportFormat_pengendali" value="extended" onchange="setExportFormat('pengendali', 'extended')">
                    📑 Kertas Kerja Lengkap + Audit Trail S1–S10
                  </label>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
                <!-- Big Word Button -->
                <button type="button" onclick="downloadNotaDinasDoc('pengendali')" class="btn btn-primary boomer-action-btn-primary">"""

    if old_p_step5 in html:
        html = html.replace(old_p_step5, new_p_step5, 1)
        print("5. Added Export Format Selector to Pengendali Step 5")

    # 5. Add Export Format Selector to Konsolidasi Step 5
    old_kons_step5 = """          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
            <!-- Big Word Button -->
            <button type="button" onclick="downloadNotaDinasDoc('konsolidasi')" class="btn btn-primary boomer-action-btn-primary">"""

    new_kons_step5 = """          <!-- EXPORT FORMAT SELECTOR (OFFICIAL EXPECTED OUTPUT VS EXTENDED) -->
          <div class="export-format-selector" style="background:#F1F5F9; border:1.5px solid #CBD5E1; border-radius:8px; padding:10px 14px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
            <div style="font-size:12.5px; font-weight:700; color:#0F5338; display:flex; align-items:center; gap:6px;">
              <span>⚙️ Pilihan Format Ekspor &amp; Cetak:</span>
            </div>
            <div style="display:flex; align-items:center; gap:16px; font-size:12px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-weight:700; color:#0F5338;">
                <input type="radio" name="exportFormat_konsolidasi" value="executive" checked onchange="setExportFormat('konsolidasi', 'executive')">
                🌟 Format Eksekutif Resmi (~2-3 Hal Sesuai Expected Output)
              </label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-weight:500; color:#475569;">
                <input type="radio" name="exportFormat_konsolidasi" value="extended" onchange="setExportFormat('konsolidasi', 'extended')">
                📑 Kertas Kerja Lengkap + Audit Trail S1–S10
              </label>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:14px;">
            <!-- Big Word Button -->
            <button type="button" onclick="downloadNotaDinasDoc('konsolidasi')" class="btn btn-primary boomer-action-btn-primary">"""

    if old_kons_step5 in html:
        html = html.replace(old_kons_step5, new_kons_step5, 1)
        print("6. Added Export Format Selector to Konsolidasi Step 5")

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Done!")

if __name__ == '__main__':
    update_remaining()
