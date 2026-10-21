import re
import sys

def refine():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update on-screen CSS for Executive Nota Dinas and Signal Cards
    # Find the block from /* Executive Nota Dinas Official Styling */ to /* --- BOOMER FINALIZATION
    old_css_marker = "/* Executive Nota Dinas Official Styling */"
    boomer_marker = "/* Exact Pattern Calculation Container */"
    
    start_idx = html.find(old_css_marker)
    end_idx = html.find(boomer_marker)
    
    if start_idx == -1 or end_idx == -1:
        print("ERROR: could not locate CSS block for nota dinas")
        sys.exit(1)

    new_nota_dinas_css = """/* Executive Nota Dinas Official Styling - Crisp White & Executive Navy/Blue */
    .nota-dinas-container {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 26px 30px;
      margin-top: 18px;
      box-shadow: 0 4px 24px rgba(10,37,64,0.06);
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0F172A;
      line-height: 1.6;
    }
    .nota-dinas-header {
      border-bottom: 2.5px solid #0A2540;
      padding-bottom: 14px;
      margin-bottom: 18px;
      text-align: center;
    }
    .nota-dinas-header h3 {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: #0A2540;
      margin: 0;
      text-transform: uppercase;
    }
    .nota-dinas-header h4 {
      font-size: 14px;
      font-weight: 700;
      color: #1D4ED8;
      margin: 4px 0 0;
      letter-spacing: 0.3px;
    }
    .nota-dinas-meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      font-size: 12px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      overflow: hidden;
    }
    .nota-dinas-meta-table td {
      padding: 6px 12px;
      vertical-align: top;
      border-bottom: 1px solid #E2E8F0;
    }
    .nota-dinas-meta-label {
      width: 140px;
      font-weight: 700;
      color: #475569;
    }
    .nota-dinas-body {
      font-size: 13px;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      color: #1E293B;
      line-height: 1.65;
    }
    .nota-dinas-body h5 {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      font-size: 13.5px;
      font-weight: 800;
      color: #0A2540;
      margin: 16px 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-left: 3.5px solid #1D4ED8;
      padding-left: 10px;
    }
    .nota-dinas-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #E2E8F0;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      flex-wrap: wrap;
    }
    .nota-dinas-container.editing-mode {
      border: 2px dashed #1D4ED8 !important;
      background: #F8FAFC !important;
      box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12) !important;
      transition: all 0.25s ease;
    }
    .nota-dinas-container.editing-mode .nota-dinas-body[contenteditable="true"] {
      outline: none;
      background: #ffffff;
      border-radius: 6px;
      padding: 14px;
      border: 1.5px solid #BFDBFE;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.03);
    }
    .nota-dinas-container.editing-mode .nota-dinas-body[contenteditable="true"]:focus {
      border-color: #1D4ED8;
      box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.18);
    }
    .nota-dinas-container.editing-mode .nota-dinas-meta-table td[contenteditable="true"] {
      outline: 1px dashed #1D4ED8;
      background: #EFF6FF;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .nota-dinas-edit-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      background: #EFF6FF;
      border: 1.5px dashed #1D4ED8;
      color: #1E3A8A;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 14px;
      font-size: 12px;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      animation: fadeIn 0.2s ease-in-out;
    }
    .nota-dinas-edited-badge {
      background: #DCFCE7;
      color: #166534;
      border: 1px solid #86EFAC;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-right: auto;
    }
    /* S1-S10 Complete Audit Breakdown inside Nota Dinas */
    .nd-s1-s10-audit-section {
      margin: 20px 0;
      border-top: 2px solid #0A2540;
      padding-top: 16px;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
    }
    .nd-signal-card {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      margin-bottom: 14px;
      background: #FFFFFF;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(10,37,64,0.04);
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .nd-signal-header {
      background: #F8FAFC;
      padding: 10px 14px;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .nd-signal-code {
      background: #0A2540;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 11.5px;
      padding: 3px 9px;
      border-radius: 5px;
      letter-spacing: 0.5px;
    }
    .nd-signal-title {
      font-weight: 700;
      font-size: 13px;
      color: #0A2540;
    }
    .nd-signal-badge {
      font-size: 10.5px;
      font-weight: 700;
      padding: 2.5px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .nd-badge-elevated { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }
    .nd-badge-warning { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
    .nd-badge-compliant { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
    .nd-badge-inconclusive { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
    .nd-signal-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
      line-height: 1.5;
    }
    .nd-signal-table tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .nd-signal-table td {
      padding: 7px 12px;
      border-bottom: 1px solid #F1F5F9;
      vertical-align: top;
    }
    .nd-signal-table tr:last-child td {
      border-bottom: none;
    }
    .nd-signal-label {
      width: 200px;
      font-weight: 700;
      color: #0A2540;
      background: #F8FAFC;
      border-right: 1px solid #E2E8F0;
    }
    .nd-math-box {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-left: 3px solid #0A2540;
      border-radius: 4px;
      padding: 7px 12px;
      font-family: 'JetBrains Mono', "SFMono-Regular", Consolas, Menlo, monospace;
      font-size: 11px;
      color: #0F172A;
      margin: 3px 0;
      white-space: pre-wrap;
    }
    .nd-reasoning-chain {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-left: 3px solid #1D4ED8;
      border-radius: 6px;
      padding: 9px 12px;
      font-size: 11px;
      color: #1E3A8A;
      margin-top: 4px;
      line-height: 1.5;
    }
    .nd-cross-synthesis {
      background: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      border-left: 3.5px solid #1D4ED8;
      border-radius: 8px;
      padding: 14px 16px;
      margin-top: 14px;
      font-size: 12px;
      line-height: 1.6;
      color: #0F172A;
    }
    
    """
    
    html = html[:start_idx] + new_nota_dinas_css + html[end_idx:]
    print("1. Replaced on-screen Nota Dinas & Signal Card CSS with Crisp White & Blue theme")

    # 2. Modernize boomer-chart-card, eo-table th, and boomer action button box shadows
    html = html.replace(
        ".eo-table th {\n      font-size: 13.5px !important;\n      padding: 10px 12px !important;\n      background: #EDF4F0 !important;\n      color: #0D3B26 !important;\n    }",
        ".eo-table th {\n      font-size: 13px !important;\n      padding: 9px 12px !important;\n      background: #0A2540 !important;\n      color: #FFFFFF !important;\n      font-weight: 700 !important;\n      border: 1px solid #0A2540 !important;\n    }"
    )
    
    html = html.replace(
        ".boomer-bar-fill-primary {\n      height: 100%;\n      background: linear-gradient(90deg, #0F5338, #198754);\n      border-radius: 7px;\n    }",
        ".boomer-bar-fill-primary {\n      height: 100%;\n      background: linear-gradient(90deg, #0A2540, #1D4ED8);\n      border-radius: 7px;\n    }"
    )

    html = html.replace(
        "box-shadow: 0 4px 12px rgba(15,83,56,0.18);",
        "box-shadow: 0 4px 12px rgba(29,78,216,0.18);"
    )
    html = html.replace(
        "box-shadow: 0 6px 16px rgba(15,83,56,0.25);",
        "box-shadow: 0 6px 16px rgba(29,78,216,0.25);"
    )
    print("2. Modernized table headers, bar gradient, and button shadows to Blue & Navy")

    # 3. Refactor renderExecutiveSignalMatrix to modern White & Blue theme
    matrix_fn_pattern = r"function renderExecutiveSignalMatrix\(signals, mode\) \{[\s\S]*?return `\s*<table class=\"eo-table nd-signal-matrix-table\"[\s\S]*?</table>\s*`;\s*\}"
    new_matrix_fn = """function renderExecutiveSignalMatrix(signals, mode) {
      if (!signals || !signals.length) return '';
      let rows = signals.map(s => {
        let badgeClass = 'badge-gold';
        let badgeText = (s.classificationBadge || '').split('(')[0].trim() || 'PERHATIAN';
        if (s.badgeType === 'compliant' || s.badgeType === 'safe' || (s.classificationBadge && (s.classificationBadge.includes('COMPLIANT') || s.classificationBadge.includes('AMAN') || s.classificationBadge.includes('VALID')))) {
          badgeClass = 'badge-green';
        } else if (s.badgeType === 'danger' || (s.classificationBadge && (s.classificationBadge.includes('RED') || s.classificationBadge.includes('KRITIS') || s.classificationBadge.includes('DEFISIT') || s.classificationBadge.includes('ELEVATED')))) {
          badgeClass = 'badge-red';
        }

        let metricSummary = s.confirmedFinding || (s.stepByStep ? s.stepByStep.split('\\n')[0] : '');
        if (metricSummary.length > 130) metricSummary = metricSummary.substring(0, 127) + '...';

        let benchmarkSummary = s.benchmark || '-';
        if (benchmarkSummary.length > 100) benchmarkSummary = benchmarkSummary.substring(0, 97) + '...';

        let implicationSummary = s.potentialRisk || s.rationale || '-';
        if (implicationSummary.length > 140) implicationSummary = implicationSummary.substring(0, 137) + '...';

        let paramName = s.name.split('/')[0].trim();
        let subName = s.name.includes('/') ? s.name.split('/')[1].trim() : '';

        return `
          <tr style="page-break-inside:avoid; break-inside:avoid;">
            <td style="text-align:center; font-weight:800; color:#0A2540;">${s.code}</td>
            <td><strong>${paramName}</strong>${subName ? `<br><span style="font-size:7.5pt; color:#64748B;">${subName}</span>` : ''}</td>
            <td style="font-size:8pt; font-feature-settings:'tnum' 1;">${metricSummary}</td>
            <td style="font-size:8pt;">${benchmarkSummary}</td>
            <td style="text-align:center;"><span class="badge ${badgeClass}" style="font-size:7.5pt;">${badgeText}</span></td>
            <td style="font-size:8pt;">${implicationSummary}</td>
          </tr>
        `;
      }).join('');

      return `
        <table class="eo-table nd-signal-matrix-table" style="width:100%; border-collapse:collapse; margin:8px 0; font-size:8.5pt; border:1px solid #E2E8F0; page-break-inside:auto;">
          <thead>
            <tr style="background:#0A2540; color:#FFFFFF; font-weight:700;">
              <th style="padding:6px 6px; width:6%; text-align:center; border:1px solid #0A2540;">Kode</th>
              <th style="padding:6px 8px; width:22%; border:1px solid #0A2540;">Parameter Sinyal Forensik (S1–S10)</th>
              <th style="padding:6px 8px; width:23%; border:1px solid #0A2540;">Nilai &amp; Temuan Terkonfirmasi</th>
              <th style="padding:6px 8px; width:16%; border:1px solid #0A2540;">Tolok Ukur / Standar</th>
              <th style="padding:6px 6px; width:11%; text-align:center; border:1px solid #0A2540;">Status</th>
              <th style="padding:6px 8px; width:22%; border:1px solid #0A2540;">Implikasi &amp; Mitigasi Risiko</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }"""
    
    html = re.sub(matrix_fn_pattern, lambda m: new_matrix_fn, html)
    print("3. Refactored renderExecutiveSignalMatrix")

    # 4. Refactor renderSignal9PointCard
    old_card_fn = """function renderSignal9PointCard(sig) {
      const badgeClass = sig.badgeType === 'elevated'
        ? 'nd-badge-elevated'
        : sig.badgeType === 'warning'
        ? 'nd-badge-warning'
        : sig.badgeType === 'inconclusive'
        ? 'nd-badge-inconclusive'
        : 'nd-badge-compliant';

      return `
        <div class="nd-signal-card" id="nd_card_${sig.mode}_${sig.code}">
          <div class="nd-signal-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="nd-signal-code">${sig.code}</span>
              <span class="nd-signal-title">${sig.name}</span>
            </div>
            <span class="nd-signal-badge ${badgeClass}">${sig.classificationBadge}</span>
          </div>
          <table class="nd-signal-table">
            <tr>
              <td class="nd-signal-label">1. Tujuan Analisis<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Analysis Objective)</span></td>
              <td>${sig.objective}</td>
            </tr>
            <tr>
              <td class="nd-signal-label">2. Sumber Data<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Source Data)</span></td>
              <td>${sig.sourceData}</td>
            </tr>
            <tr>
              <td class="nd-signal-label">3. Rumus Perhitungan<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Calculation Formula)</span></td>
              <td><div class="nd-math-box">${sig.formula}</div></td>
            </tr>
            <tr>
              <td class="nd-signal-label">4. Perhitungan Langkah demi Langkah<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Step-by-Step Calculation)</span></td>
              <td><div class="nd-math-box">${sig.stepByStep}</div></td>
            </tr>
            <tr>
              <td class="nd-signal-label">5. Tolok Ukur / Ambang Batas<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Benchmark or Threshold)</span></td>
              <td>${sig.benchmark}</td>
            </tr>
            <tr>
              <td class="nd-signal-label">6. Klasifikasi Hasil<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Result Classification)</span></td>
              <td><strong>${sig.classificationTitle}</strong> — ${sig.classificationCriteria}</td>
            </tr>
            <tr>
              <td class="nd-signal-label">7. Rasional Analitis &amp; Rantai Penalaran<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Detailed Analytical Rationale &amp; Reasoning Chain)</span></td>
              <td>
                <div>${sig.rationale}</div>
                <div class="nd-reasoning-chain">
                  <strong>🔗 Rantai Penalaran Bukti (Evidence Reasoning Chain):</strong><br>
                  ${sig.reasoningChain}
                </div>
              </td>
            </tr>
            <tr>
              <td class="nd-signal-label">8. Implikasi Forensik<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Forensic Implications)</span></td>
              <td>
                <div><strong>• Temuan Terkonfirmasi (Confirmed Finding):</strong> ${sig.confirmedFinding}</div>
                <div style="margin-top:3px;"><strong>• Risiko Potensial yang Memerlukan Verifikasi (Potential Risk):</strong> ${sig.potentialRisk}</div>
              </td>
            </tr>
            <tr>
              <td class="nd-signal-label">9. Keterbatasan &amp; Validasi<br><span style="font-weight:400; font-size:10px; color:#57534E;">(Limitations &amp; Validation)</span></td>
              <td>${sig.limitations}</td>
            </tr>
          </table>
        </div>
      `;
    }"""

    new_card_fn = """function renderSignal9PointCard(sig) {
      const badgeClass = sig.badgeType === 'elevated'
        ? 'nd-badge-elevated'
        : sig.badgeType === 'warning'
        ? 'nd-badge-warning'
        : sig.badgeType === 'inconclusive'
        ? 'nd-badge-inconclusive'
        : 'nd-badge-compliant';

      // Format Reasoning Chain Steps into clean visual ladder
      let formattedReasoningChain = sig.reasoningChain;
      try {
        if (sig.reasoningChain && sig.reasoningChain.includes('→')) {
          const rawSteps = sig.reasoningChain.split('→').map(s => s.trim()).filter(Boolean);
          if (rawSteps.length > 1) {
            formattedReasoningChain = `
              <div class="nd-chain-flow" style="display:flex; flex-direction:column; gap:5px; margin-top:6px;">
                ${rawSteps.map((step, idx) => {
                  let colonIdx = step.indexOf('(');
                  let title = step;
                  let body = '';
                  if (colonIdx > 0 && step.endsWith(')')) {
                    title = step.substring(0, colonIdx).trim();
                    body = step.substring(colonIdx + 1, step.length - 1).trim();
                  }
                  return `
                    <div class="nd-chain-step" style="display:flex; align-items:flex-start; gap:8px; background:#FFFFFF; border:1px solid #BFDBFE; border-radius:6px; padding:5px 8px; font-size:8pt; line-height:1.4;">
                      <span style="background:#1D4ED8; color:#FFFFFF; font-size:7pt; font-weight:800; border-radius:50%; width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${idx + 1}</span>
                      <div><strong style="color:#0A2540;">${title}${body ? ':' : ''}</strong> ${body ? `<span style="color:#1E293B;">${body}</span>` : ''}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }
        }
      } catch (e) {
        formattedReasoningChain = sig.reasoningChain;
      }

      return `
        <div class="nd-signal-card" id="nd_card_${sig.mode}_${sig.code}" style="page-break-inside:avoid !important; break-inside:avoid !important; margin-bottom:12pt;">
          <div class="nd-signal-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="nd-signal-code">${sig.code}</span>
              <span class="nd-signal-title">${sig.name}</span>
            </div>
            <span class="nd-signal-badge ${badgeClass}">${sig.classificationBadge}</span>
          </div>
          <table class="nd-signal-table" style="page-break-inside:avoid !important; break-inside:avoid !important;">
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">1. Tujuan Analisis<br><span style="font-weight:400; font-size:10px; color:#475569;">(Analysis Objective)</span></td>
              <td>${sig.objective}</td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">2. Sumber Data<br><span style="font-weight:400; font-size:10px; color:#475569;">(Source Data)</span></td>
              <td>${sig.sourceData}</td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">3. Rumus Perhitungan<br><span style="font-weight:400; font-size:10px; color:#475569;">(Calculation Formula)</span></td>
              <td><div class="nd-math-box">${sig.formula}</div></td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">4. Perhitungan Langkah demi Langkah<br><span style="font-weight:400; font-size:10px; color:#475569;">(Step-by-Step Calculation)</span></td>
              <td><div class="nd-math-box">${sig.stepByStep}</div></td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">5. Tolok Ukur / Ambang Batas<br><span style="font-weight:400; font-size:10px; color:#475569;">(Benchmark or Threshold)</span></td>
              <td>${sig.benchmark}</td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">6. Klasifikasi Hasil<br><span style="font-weight:400; font-size:10px; color:#475569;">(Result Classification)</span></td>
              <td><strong>${sig.classificationTitle}</strong> — ${sig.classificationCriteria}</td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">7. Rasional Analitis &amp; Rantai Penalaran<br><span style="font-weight:400; font-size:10px; color:#475569;">(Detailed Analytical Rationale &amp; Reasoning Chain)</span></td>
              <td>
                <div style="margin-bottom:6px; line-height:1.5;">${sig.rationale}</div>
                <div class="nd-reasoning-chain">
                  <strong>🔗 Rantai Penalaran Bukti (Evidence Reasoning Chain):</strong><br>
                  ${formattedReasoningChain}
                </div>
              </td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">8. Implikasi Forensik<br><span style="font-weight:400; font-size:10px; color:#475569;">(Forensic Implications)</span></td>
              <td>
                <div style="display:grid; grid-template-columns:1fr; gap:6px;">
                  <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-left:3px solid #059669; border-radius:5px; padding:6px 10px; font-size:8.5pt;">
                    <strong style="color:#065F46;">• Temuan Terkonfirmasi (Confirmed Finding):</strong>
                    <div style="color:#064E3B; margin-top:2px;">${sig.confirmedFinding}</div>
                  </div>
                  <div style="background:#FFFBEB; border:1px solid #FDE68A; border-left:3px solid #D97706; border-radius:5px; padding:6px 10px; font-size:8.5pt;">
                    <strong style="color:#92400E;">• Risiko Potensial yang Memerlukan Verifikasi (Potential Risk):</strong>
                    <div style="color:#78350F; margin-top:2px;">${sig.potentialRisk}</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr style="page-break-inside:avoid; break-inside:avoid;">
              <td class="nd-signal-label">9. Keterbatasan &amp; Validasi<br><span style="font-weight:400; font-size:10px; color:#475569;">(Limitations &amp; Validation)</span></td>
              <td>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-left:3px solid #64748B; border-radius:5px; padding:6px 10px; font-size:8.5pt; color:#334155; line-height:1.45;">
                  ${sig.limitations}
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;
    }"""

    if old_card_fn in html:
        html = html.replace(old_card_fn, new_card_fn)
        print("4. Refactored renderSignal9PointCard")
    else:
        print("WARNING: exact match for renderSignal9PointCard not found, inspecting regex")
        fn_pattern = r"function renderSignal9PointCard\(sig\) \{[\s\S]*?return `\s*<div class=\"nd-signal-card\"[\s\S]*?</div>\s*`;\s*\}"
        html = re.sub(fn_pattern, new_card_fn, html)
        print("4b. Refactored renderSignal9PointCard via regex")

    # 5. Overhaul printNotaDinas with executive White & Blue styling and strict page break rules
    old_print_fn_pattern = r"function printNotaDinas\(mode, forcedFormat\) \{[\s\S]*?printWin\.document\.close\(\);\s*\}"
    new_print_fn = """function printNotaDinas(mode, forcedFormat) {
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
      }

      // Resolve entity name for print window title
      let docTitle = 'Cetak Nota Dinas - Kajian Ihsan';
      const entityEl = clone.querySelector('.dyn-inv-entity, .dyn-p-entity, .dyn-np-entity');
      if (entityEl && entityEl.textContent.trim()) {
        docTitle = `Kajian Ihsan - ${entityEl.textContent.trim()}`;
      }

      const printWin = window.open('', '_blank', 'width=850,height=950');
      if (!printWin) {
        showToast('Popup diblokir peramban. Harap izinkan popup untuk mencetak.', 'warning');
        return;
      }

      printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${docTitle}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 14mm 16mm 14mm 16mm;
            }
            @media print {
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #FFFFFF !important;
                color: #0F172A !important;
                font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: 9pt !important;
                line-height: 1.45 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              .print-topbar {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                border-bottom: 2px solid #0A2540 !important;
                padding-bottom: 4pt !important;
                margin-bottom: 10pt !important;
              }
              .eo-section, .nd-section, .boomer-chart-card, .recommendation-callout, .eo-header, .nota-dinas-header, .nota-dinas-meta-table, .nd-cross-synthesis, .nd-signal-card {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              table {
                border-collapse: collapse !important;
                width: 100% !important;
                margin: 5pt 0 8pt 0 !important;
                page-break-inside: auto;
              }
              tr, td, th {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              thead {
                display: table-header-group !important;
              }
              tfoot {
                display: table-footer-group !important;
              }
              h2, h3, h4, h5, h6, .eo-section-header, .nd-signal-header {
                page-break-after: avoid !important;
                break-after: avoid !important;
              }
            }
            body {
              font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 9.5pt;
              line-height: 1.45;
              color: #0F172A;
              padding: 20px;
              background: #FFFFFF;
              max-width: 820px;
              margin: 0 auto;
            }
            .print-topbar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #0A2540;
              padding-bottom: 6px;
              margin-bottom: 14px;
              font-size: 8.5pt;
            }
            .print-topbar-brand {
              font-weight: 800;
              color: #0A2540;
              letter-spacing: 0.5px;
            }
            .print-topbar-meta {
              font-weight: 600;
              color: #1D4ED8;
            }
            h3 { font-size: 15pt; font-weight: 800; text-align: center; margin: 0; color: #0A2540; letter-spacing: 0.5pt; }
            h4 { font-size: 11.5pt; font-weight: 700; text-align: center; margin: 2pt 0 4pt; color: #1D4ED8; }
            h5 { font-size: 10.5pt; font-weight: 700; margin: 12pt 0 4pt 0; color: #0A2540; border-bottom: 1.5pt solid #1D4ED8; padding-bottom: 2.5pt; text-transform: uppercase; letter-spacing: 0.25px; }
            table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt 0; font-size: 8.5pt; border: 1px solid #E2E8F0; }
            td, th { padding: 4.5pt 7pt; vertical-align: top; border: 1px solid #E2E8F0; }
            th { background: #0A2540; color: #FFFFFF; font-weight: 700; }
            tr:nth-child(even) td { background: #F8FAFC; }
            .nota-dinas-meta-table { border: 1px solid #E2E8F0; background: #F8FAFC; border-radius: 6px; }
            .nota-dinas-meta-table td { border: none; border-bottom: 1px solid #E2E8F0; }
            .nota-dinas-meta-label { font-weight: 700; width: 16%; color: #475569; }
            .nd-signal-matrix-table th { background: #0A2540; color: #FFFFFF; font-weight: 700; }
            .nd-signal-matrix-table td { font-size: 8pt; padding: 4.5pt 6pt; border: 1px solid #E2E8F0; }
            .nd-signal-card { border: 1px solid #CBD5E1; border-radius: 6px; margin-bottom: 12pt; page-break-inside: avoid !important; break-inside: avoid !important; background: #FFFFFF; }
            .nd-signal-header { background: #F8FAFC; padding: 6pt 8pt; border-bottom: 1px solid #CBD5E1; font-weight: 700; color: #0A2540; display: flex; justify-content: space-between; align-items: center; }
            .nd-signal-code { background: #0A2540; color: #FFFFFF; font-weight: 800; padding: 1.5pt 6pt; border-radius: 3px; font-size: 8pt; }
            .nd-signal-table td { border: 1px solid #E2E8F0; font-size: 8.5pt; padding: 4pt 6pt; }
            .nd-signal-label { width: 24%; font-weight: 700; background: #F8FAFC; color: #0A2540; }
            .nd-math-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 2.5pt solid #0A2540; padding: 4pt 6pt; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 8pt; margin: 2pt 0; white-space: pre-wrap; color: #0F172A; }
            .nd-reasoning-chain { background: #EFF6FF; border: 1px solid #BFDBFE; border-left: 2.5pt solid #1D4ED8; padding: 5pt 7pt; font-size: 8pt; margin-top: 2pt; color: #1E3A8A; }
            .nd-cross-synthesis { background: #F8FAFC; border: 1px solid #CBD5E1; border-left: 3pt solid #1D4ED8; padding: 8pt 10pt; margin-top: 10pt; font-size: 8.5pt; color: #0F172A; page-break-inside: avoid !important; break-inside: avoid !important; }
            p, li { text-align: justify; margin: 0 0 4pt 0; line-height: 1.45; }
            .badge, .nd-signal-badge { display: inline-block; padding: 1.5pt 5pt; border-radius: 3px; font-size: 7pt; font-weight: 700; text-transform: uppercase; }
            .badge-green, .nd-badge-compliant { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
            .badge-gold, .nd-badge-warning { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
            .badge-red, .nd-badge-elevated { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }
            .nd-badge-inconclusive { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
            .eo-table th { background: #0A2540 !important; color: #FFFFFF !important; font-size: 8.5pt !important; padding: 5pt 7pt !important; }
            .eo-table td { font-size: 8.5pt !important; padding: 5pt 7pt !important; }
            .boomer-chart-card { border: 1px solid #E2E8F0 !important; box-shadow: none !important; page-break-inside: avoid !important; break-inside: avoid !important; padding: 10pt 12pt !important; margin: 8pt 0 !important; }
            .boomer-chart-title { color: #0A2540 !important; font-size: 10.5pt !important; }
            .boomer-bar-fill-primary { background: #1D4ED8 !important; }
            .boomer-bar-track { background: #E2E8F0 !important; height: 10px !important; }
            .boomer-chart-takeaway { background: #EFF6FF !important; border-left: 3pt solid #1D4ED8 !important; color: #1E3A8A !important; font-size: 8pt !important; padding: 6pt 8pt !important; }
          </style>
        </head>
        <body>
          <div class="print-topbar no-print">
            <span class="print-topbar-brand">KAJIAN IHSAN FINANCIAL ANALYZER</span>
            <span class="print-topbar-meta">DOKUMEN RESMI &bull; STANDAR AUDIT ISA 520</span>
          </div>
          ${clone.innerHTML}
          <script>
            window.onload = function() { window.print(); };
          <\\/script>
        </body>
        </html>
      `);
      printWin.document.close();
    }"""
    
    html = re.sub(old_print_fn_pattern, lambda m: new_print_fn, html)
    print("5. Overhauled printNotaDinas with executive White & Blue styling")

    # 6. Overhaul downloadNotaDinasDoc with clean styling
    old_doc_fn_pattern = r"function downloadNotaDinasDoc\(mode, forcedFormat\) \{[\s\S]*?showToast\(`Dokumen Word \$\{info\.file\} berhasil diunduh`, 'success'\);\s*\}"
    new_doc_fn = """function downloadNotaDinasDoc(mode, forcedFormat) {
      const el = getNotaDinasElement(mode);
      if (!el) {
        showToast('Dokumen Nota Dinas belum tersedia', 'warning');
        return;
      }
      const format = forcedFormat || (window.appState && window.appState.exportFormat) || 'executive';

      // Resolve dynamic entity name based on active mode
      let dynamicEntity = '';
      if (mode === 'pengendali') {
        const inp = document.getElementById('in_p_entityName');
        dynamicEntity = (inp && inp.value.trim()) || (appState.pengendali && appState.pengendali.entityName) || 'PT Era Permata Sejahtera';
      } else if (mode === 'non_pengendali' || mode === 'nonpengendali') {
        const inp = document.getElementById('in_np_entityName');
        dynamicEntity = (inp && inp.value.trim()) || (appState.nonPengendali && appState.nonPengendali.entityName) || 'PT Pesonna Optima Jasa';
      } else if (mode === 'investasi') {
        const inp = document.getElementById('in_inv_entityName');
        dynamicEntity = (inp && inp.value.trim()) || (appState.investasi && appState.investasi.entityName) || 'PT Pindo Deli Pulp and Paper Mills';
      } else if (mode === 'konsolidasi') {
        dynamicEntity = 'Konsolidasi Finansial Grup (6 Entitas)';
      }

      const safeEntity = dynamicEntity.replace(/[^a-zA-Z0-9_-]/g, '_');
      const dynamicFile = `Nota_Dinas_${safeEntity}.doc`;
      const dynamicTitle = `Nota Dinas Hasil Telaah - ${dynamicEntity}`;

      const titles = {
        'pengendali': {
          file: dynamicEntity === 'PT Era Permata Sejahtera' ? 'Nota_Dinas_PT_Era_Permata_Sejahtera.doc' : dynamicFile,
          title: dynamicEntity === 'PT Era Permata Sejahtera' ? 'Nota Dinas Hasil Penelaahan Forensik Keuangan PT Era Permata Sejahtera' : dynamicTitle
        },
        'non_pengendali': {
          file: dynamicEntity === 'PT Pesonna Optima Jasa' ? 'Nota_Dinas_PT_Pesonna_Optima_Jasa.doc' : dynamicFile,
          title: dynamicEntity === 'PT Pesonna Optima Jasa' ? 'Nota Dinas Monitoring PT Pesonna Optima Jasa' : dynamicTitle
        },
        'nonpengendali': {
          file: dynamicEntity === 'PT Pesonna Optima Jasa' ? 'Nota_Dinas_PT_Pesonna_Optima_Jasa.doc' : dynamicFile,
          title: dynamicEntity === 'PT Pesonna Optima Jasa' ? 'Nota Dinas Monitoring PT Pesonna Optima Jasa' : dynamicTitle
        },
        'investasi': (appState.investasiActivePreset === 'pindodeli'
          ? {
              file: dynamicEntity.includes('Pindo Deli') ? 'Nota_Dinas_Investasi_PT_Pindo_Deli.doc' : dynamicFile,
              title: dynamicEntity.includes('Pindo Deli') ? 'Nota Dinas Kajian Ihsan Investasi PT Pindo Deli' : dynamicTitle
            }
          : { file: dynamicFile, title: dynamicTitle }),
        'konsolidasi': { file: 'Nota_Dinas_Konsolidasi_Grup.doc', title: 'Nota Dinas Konsolidasi Finansial Grup (6 Entitas)' }
      };
      const info = titles[mode] || { file: dynamicFile, title: dynamicTitle };

      const clone = el.cloneNode(true);
      clone.querySelectorAll('.nota-dinas-actions, .nota-dinas-edit-banner, .nota-dinas-edited-badge, .step-actions-bar, .export-format-selector').forEach(c => c.remove());
      clone.removeAttribute('contenteditable');
      clone.querySelectorAll('[contenteditable]').forEach(c => c.removeAttribute('contenteditable'));
      clone.classList.remove('editing-mode');

      // In Executive Mode, exclude extended audit details and interactive widgets
      if (format === 'executive') {
        const deepDive = clone.querySelector('#argonRagDeepDiveWidget');
        if (deepDive) deepDive.remove();
        clone.querySelectorAll('.extended-audit-details, .no-print').forEach(c => c.remove());
      }

      const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${info.title}</title>
<style>
  @page Section1 { size: 595.3pt 841.9pt; margin: 40pt 45pt 40pt 45pt; }
  div.Section1 { page: Section1; }
  body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 10pt; line-height: 1.45; color: #0F172A; }
  h3 { font-size: 15pt; font-weight: bold; text-align: center; margin: 0; color: #0A2540; letter-spacing: 0.5pt; }
  h4 { font-size: 12pt; font-weight: bold; text-align: center; margin: 2pt 0 4pt; color: #1D4ED8; }
  h5 { font-size: 10.5pt; font-weight: bold; margin: 12pt 0 4pt 0; color: #0A2540; border-bottom: 1.5pt solid #1D4ED8; padding-bottom: 2pt; text-transform: uppercase; }
  table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt 0; font-size: 9pt; }
  td, th { padding: 4.5pt 7pt; vertical-align: top; border: 1px solid #CBD5E1; }
  th { background: #0A2540; color: #FFFFFF; font-weight: bold; }
  .nota-dinas-meta-table td { border: none; border-bottom: 1px solid #E2E8F0; }
  .nota-dinas-meta-label { font-weight: bold; width: 16%; color: #475569; }
  .nd-signal-matrix-table th { background: #0A2540; color: #FFFFFF; font-weight: bold; }
  .nd-signal-matrix-table td { font-size: 8.5pt; padding: 4pt 6pt; border: 1px solid #CBD5E1; }
  .nd-signal-card { border: 1px solid #CBD5E1; margin-bottom: 10pt; page-break-inside: avoid; }
  .nd-signal-header { background: #F8FAFC; padding: 6pt 8pt; border-bottom: 1px solid #CBD5E1; font-weight: bold; color: #0A2540; }
  .nd-signal-table td { border: 1px solid #E2E8F0; padding: 4pt 6pt; }
  .nd-signal-label { width: 24%; font-weight: bold; background: #F8FAFC; color: #0A2540; }
  .nd-math-box { background: #F8FAFC; border-left: 3pt solid #0A2540; padding: 5pt 8pt; font-family: 'Consolas', 'Courier New', monospace; font-size: 8.5pt; margin: 3pt 0; white-space: pre-wrap; color: #0F172A; }
  .nd-reasoning-chain { background: #EFF6FF; border-left: 3pt solid #1D4ED8; padding: 5pt 8pt; font-size: 8.5pt; margin-top: 3pt; color: #1E3A8A; }
  .nd-cross-synthesis { background: #F8FAFC; border: 1px solid #CBD5E1; border-left: 3pt solid #1D4ED8; padding: 8pt 10pt; margin-top: 10pt; font-size: 9pt; color: #0F172A; }
  p, li { text-align: justify; margin: 0 0 4pt 0; line-height: 1.45; }
  ol, ul { margin: 4pt 0 8pt 18pt; }
  strong { color: #000; }
  .badge { display: inline-block; padding: 1pt 5pt; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
  .badge-green { background: #DCFCE7; color: #166534; }
  .badge-gold { background: #FEF3C7; color: #92400E; }
  .badge-red { background: #FEE2E2; color: #991B1B; }
</style>
</head>
<body>
<div class='Section1'>
${clone.innerHTML}
</div>
</body>
</html>
      `;

      const blob = new Blob(['\\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = info.file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast(`Dokumen Word ${info.file} berhasil diunduh`, 'success');
    }"""

    html = re.sub(old_doc_fn_pattern, lambda m: new_doc_fn, html)
    print("6. Overhauled downloadNotaDinasDoc with clean styling")

    # 7. Clean up inline green styles in HTML templates
    html = html.replace('border-bottom:1px solid #1b3d2f; padding-bottom:3px; color:#1b3d2f; font-weight:bold;', 'border-bottom:1.5px solid #1D4ED8; padding-bottom:3px; color:#0A2540; font-weight:bold;')
    html = html.replace('color:#0F5338; cursor:pointer; user-select:none;', 'color:#0A2540; cursor:pointer; user-select:none;')
    html = html.replace('style="border:2px solid var(--forest); color:var(--forest);"', 'style="border:2px solid #0A2540; color:#0A2540;"')
    html = html.replace('color:var(--forest); cursor:pointer;', 'color:#1D4ED8; cursor:pointer;')
    
    # 8. Export format selector label text
    html = html.replace('font-weight:700; color:#0F5338; display:flex; align-items:center; gap:6px;', 'font-weight:700; color:#0A2540; display:flex; align-items:center; gap:6px;')
    html = html.replace('cursor:pointer; font-weight:700; color:#0F5338;', 'cursor:pointer; font-weight:700; color:#0A2540;')

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    # Also sync to preview.html
    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print("Refinement completed and synced to preview.html successfully.")

if __name__ == '__main__':
    refine()
