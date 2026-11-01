import re

# 1. Update public/style.css
with open('public/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add Emil Kowalski tokens to :root in style.css if not present
if '--ease-out:' not in css:
    css = css.replace(
        '  --font-sans: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}',
        '  --font-sans: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n\n  /* Emil Kowalski Animation & Easing Tokens */\n  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);\n  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);\n  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);\n  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);\n}'
    )

# Add button tactile feedback and Emil polish to style.css
if '.btn:active' not in css:
    btn_target = """.btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  text-decoration: none;
}"""
    btn_replacement = """.btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent;
  transition: transform 140ms var(--ease-out), background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
  text-decoration: none;
  user-select: none;
}

.btn:active {
  transform: scale(0.97);
}

.boomer-action-btn-primary, .boomer-action-btn-secondary, .shelf-tab-btn {
  transition: transform 140ms var(--ease-out), background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease !important;
}

.boomer-action-btn-primary:active, .boomer-action-btn-secondary:active, .shelf-tab-btn:active {
  transform: scale(0.97) !important;
}

.dedicated-portal-card {
  transition: transform 180ms var(--ease-out), border-color 180ms ease, box-shadow 180ms ease !important;
}

.dedicated-portal-card:active {
  transform: scale(0.985) !important;
}

@media (hover: hover) and (pointer: fine) {
  .dedicated-portal-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(10, 37, 64, 0.12) !important;
  }
}

.quick-dropzone-strip, .active-upload-strip, .empty-state-box {
  transition: transform 160ms var(--ease-out), border-color 160ms ease, background-color 160ms ease !important;
}

.quick-dropzone-strip.is-dragover, .active-upload-strip.is-dragover, .empty-state-box.is-dragover, .empty-state-box.dragover {
  border-color: #1D4ED8 !important;
  background: #EFF6FF !important;
  transform: scale(1.008) !important;
}

.spinner-ring, .loader-spinner, .processing-spinner {
  animation: spin 0.65s linear infinite !important;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}"""
    css = css.replace(btn_target, btn_replacement)

with open('public/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated public/style.css successfully')

# 2. Update public/index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add Emil Kowalski tokens to :root in index.html
if '--ease-out:' not in html:
    html = html.replace(
        '      --font-sans: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n    }',
        '      --font-sans: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n\n      /* Emil Kowalski Animation & Easing Tokens */\n      --ease-out: cubic-bezier(0.23, 1, 0.32, 1);\n      --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);\n      --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);\n      --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);\n    }'
    )

# Add tactile button feedback to CSS in index.html
if '.btn:active' not in html:
    html = html.replace(
        '    .btn {',
        """    .btn:active { transform: scale(0.97); }
    .boomer-action-btn-primary, .boomer-action-btn-secondary, .shelf-tab-btn {
      transition: transform 140ms var(--ease-out), background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease !important;
    }
    .boomer-action-btn-primary:active, .boomer-action-btn-secondary:active, .shelf-tab-btn:active {
      transform: scale(0.97) !important;
    }
    .dedicated-portal-card {
      transition: transform 180ms var(--ease-out), border-color 180ms ease, box-shadow 180ms ease !important;
    }
    .dedicated-portal-card:active {
      transform: scale(0.985) !important;
    }
    @media (hover: hover) and (pointer: fine) {
      .dedicated-portal-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(10, 37, 64, 0.12) !important;
      }
    }
    .quick-dropzone-strip, .active-upload-strip, .empty-state-box {
      transition: transform 160ms var(--ease-out), border-color 160ms ease, background-color 160ms ease !important;
    }
    .quick-dropzone-strip.is-dragover, .active-upload-strip.is-dragover, .empty-state-box.is-dragover, .empty-state-box.dragover {
      border-color: #1D4ED8 !important;
      background: #EFF6FF !important;
      transform: scale(1.008) !important;
    }
    .spinner-ring, .loader-spinner, .processing-spinner {
      animation: spin 0.65s linear infinite !important;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    .btn {"""
    )

# Fix modal-box in index.html to enter from scale(0.96)
html = html.replace(
    '    .modal-box {\n      background: var(--surface); border-radius: var(--radius-lg); width: 100%;\n      max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg);\n      padding: 24px; border: 1px solid var(--line);\n    }',
    '    .modal-box {\n      background: var(--surface); border-radius: var(--radius-lg); width: 100%;\n      max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg);\n      padding: 24px; border: 1px solid var(--line);\n      transform: scale(0.96); opacity: 0;\n      animation: modalEnter 220ms var(--ease-out) forwards;\n    }\n    @keyframes modalEnter {\n      to { transform: scale(1); opacity: 1; }\n    }'
)

# Update Toast CSS to Sonner-style floating card
sonner_toast_css = """    /* Toast Notification System (Sonner-style Interruptible CSS Transitions) */
    #toastContainer {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      display: flex; flex-direction: column-reverse; gap: 8px; pointer-events: none;
    }
    .toast-msg {
      pointer-events: auto; background: #0A2540; color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.15); border-left: 4px solid var(--forest);
      border-radius: 10px; padding: 11px 16px; font-size: 12.5px; font-weight: 500;
      box-shadow: 0 10px 28px rgba(10, 37, 64, 0.25); display: flex; align-items: center; gap: 10px;
      min-width: 290px; max-width: 440px;
      transform: translateY(12px) scale(0.96); opacity: 0;
      transition: transform 200ms var(--ease-out), opacity 180ms ease;
    }
    .toast-msg.toast-visible {
      transform: translateY(0) scale(1); opacity: 1;
    }
    .toast-msg.toast-exit {
      transform: translateY(-8px) scale(0.96); opacity: 0;
      transition: transform 160ms var(--ease-out), opacity 140ms ease;
    }
    .toast-msg.success { border-left-color: var(--green); }
    .toast-msg.warning { border-left-color: #F59E0B; }
    .toast-msg.error { border-left-color: var(--red); }
    .toast-msg.info { border-left-color: #3B82F6; }"""

old_toast_css_pattern = r'/\* Toast Notification System \*/\s*#toastContainer\s*\{[^}]*\}\s*\.toast-msg\s*\{[^}]*\}\s*\.toast-msg\.success\s*\{[^}]*\}\s*\.toast-msg\.warning\s*\{[^}]*\}\s*\.toast-msg\.error\s*\{[^}]*\}\s*\.toast-msg\.info\s*\{[^}]*\}\s*@keyframes slideInToast\s*\{[^}]*\}'
if re.search(old_toast_css_pattern, html):
    html = re.sub(old_toast_css_pattern, lambda m: sonner_toast_css, html)
    print('Updated toast CSS to Sonner style')

# 3. Fix all 7 dropzones in index.html to pass Array.from(event.dataTransfer.files) and use .is-dragover
# Line 2126 dropzone
html = html.replace(
    'ondrop="event.preventDefault(); this.style.borderColor=\'#93C5FD\'; this.style.background=\'#F0F7FF\'; if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"',
    'ondragover="event.preventDefault(); this.classList.add(\'is-dragover\');" ondragleave="this.classList.remove(\'is-dragover\');" ondrop="event.preventDefault(); this.classList.remove(\'is-dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(Array.from(event.dataTransfer.files));"'
)

# Line 2698 hero dropzone
html = html.replace(
    'ondrop="event.preventDefault(); this.classList.remove(\'dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"',
    'ondragover="event.preventDefault(); this.classList.add(\'is-dragover\'); this.classList.add(\'dragover\');" ondragleave="this.classList.remove(\'is-dragover\'); this.classList.remove(\'dragover\');" ondrop="event.preventDefault(); this.classList.remove(\'is-dragover\'); this.classList.remove(\'dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(Array.from(event.dataTransfer.files));"'
)

# Line 2806 active upload strip
html = html.replace(
    'ondrop="event.preventDefault(); this.style.borderColor=\'#C4DEC0\'; this.style.background=\'var(--surface)\'; if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"',
    'ondragover="event.preventDefault(); this.classList.add(\'is-dragover\');" ondragleave="this.classList.remove(\'is-dragover\');" ondrop="event.preventDefault(); this.classList.remove(\'is-dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(Array.from(event.dataTransfer.files));"'
)

# Line 3120 p_step_pane_1 dropzone
html = html.replace(
    'ondrop="event.preventDefault(); this.style.borderColor=\'#93C5FD\'; this.style.background=\'#F0F7FF\'; if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"',
    'ondragover="event.preventDefault(); this.classList.add(\'is-dragover\');" ondragleave="this.classList.remove(\'is-dragover\');" ondrop="event.preventDefault(); this.classList.remove(\'is-dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(Array.from(event.dataTransfer.files));"'
)

# Line 4029 np_step_pane_1 dropzone
html = html.replace(
    'ondrop="event.preventDefault(); this.style.borderColor=\'#93C5FD\'; this.style.background=\'#F0F7FF\'; if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"',
    'ondragover="event.preventDefault(); this.classList.add(\'is-dragover\');" ondragleave="this.classList.remove(\'is-dragover\');" ondrop="event.preventDefault(); this.classList.remove(\'is-dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(Array.from(event.dataTransfer.files));"'
)

# Line 4900 inv_step_pane_1 dropzone
html = html.replace(
    'ondrop="event.preventDefault(); this.style.borderColor=\'#93C5FD\'; this.style.background=\'#F0F7FF\'; if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"',
    'ondragover="event.preventDefault(); this.classList.add(\'is-dragover\');" ondragleave="this.classList.remove(\'is-dragover\');" ondrop="event.preventDefault(); this.classList.remove(\'is-dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(Array.from(event.dataTransfer.files));"'
)

# Line 6891 konsolidasi dropzone
html = html.replace(
    'ondrop="event.preventDefault(); this.style.borderColor=\'#93C5FD\'; this.style.background=\'#F0F7FF\'; if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(event.dataTransfer.files[0]);"',
    'ondragover="event.preventDefault(); this.classList.add(\'is-dragover\');" ondragleave="this.classList.remove(\'is-dragover\');" ondrop="event.preventDefault(); this.classList.remove(\'is-dragover\'); if(event.dataTransfer && event.dataTransfer.files.length) handleDirectFileDrop(Array.from(event.dataTransfer.files));"'
)

# 4. Insert Absorbed Multi-File Deck containers in Step 1 of all 3 portals
# In p_step_pane_1:
if 'id="absorbedFilesDeck_pengendali"' not in html:
    html = html.replace(
        '<div id="p_step_pane_1">\n        <!-- DEDICATED DOCUMENT PARSING RESULT BANNER PENGENDALI -->\n        <div id="docParsingBanner_pengendali"></div>',
        '<div id="p_step_pane_1">\n        <!-- DEDICATED DOCUMENT PARSING RESULT BANNER PENGENDALI -->\n        <div id="docParsingBanner_pengendali"></div>\n        <!-- ABSORPTION MULTI-FILE DECK PENGENDALI -->\n        <div id="absorbedFilesDeck_pengendali"></div>'
    )

# In np_step_pane_1:
if 'id="absorbedFilesDeck_nonpengendali"' not in html:
    html = html.replace(
        '<div id="np_step_pane_1">\n        <!-- DEDICATED DOCUMENT PARSING RESULT BANNER NON-PENGENDALI -->\n        <div id="docParsingBanner_nonpengendali"></div>',
        '<div id="np_step_pane_1">\n        <!-- DEDICATED DOCUMENT PARSING RESULT BANNER NON-PENGENDALI -->\n        <div id="docParsingBanner_nonpengendali"></div>\n        <!-- ABSORPTION MULTI-FILE DECK NON-PENGENDALI -->\n        <div id="absorbedFilesDeck_nonpengendali"></div>'
    )

# In inv_step_pane_1:
if 'id="absorbedFilesDeck_investasi"' not in html:
    html = html.replace(
        '<div id="inv_step_pane_1">\n        <!-- DEDICATED DOCUMENT PARSING RESULT BANNER INVESTASI -->\n        <div id="docParsingBanner_investasi"></div>',
        '<div id="inv_step_pane_1">\n        <!-- DEDICATED DOCUMENT PARSING RESULT BANNER INVESTASI -->\n        <div id="docParsingBanner_investasi"></div>\n        <!-- ABSORPTION MULTI-FILE DECK INVESTASI -->\n        <div id="absorbedFilesDeck_investasi"></div>'
    )

# 5. Update showToast JavaScript function for Sonner transitions
old_showtoast_pattern = r'function showToast\(message, type = \'info\'\) \{[\s\S]*?setTimeout\(\(\) => toast\.remove\(\), 300\);\s*\}, 3500\);\s*\}'
new_showtoast = """function showToast(message, type = 'info') {
      let container = document.getElementById('toastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast-msg ${type}`;
      const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';
      toast.innerHTML = `<span style="font-size:16px;">${icon}</span><span style="line-height:1.4;">${message}</span>`;
      container.appendChild(toast);

      // Trigger hardware-accelerated enter transition
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          toast.classList.add('toast-visible');
        });
      } else {
        toast.classList.add('toast-visible');
      }

      setTimeout(() => {
        toast.classList.remove('toast-visible');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 180);
      }, 3500);
    }"""

if re.search(old_showtoast_pattern, html):
    html = re.sub(old_showtoast_pattern, lambda m: new_showtoast, html)
    print('Updated showToast JavaScript')

# 6. Add renderAbsorbedFilesDeck and removeAbsorbedFileFromDeck functions to JavaScript
deck_js_code = """
    // Render Absorbed Multi-File Deck in Step 1 of all 3 portals
    function renderAbsorbedFilesDeck(scheme) {
      if (!scheme) scheme = appState.selectedScheme || 'investasi';
      const container = document.getElementById(`absorbedFilesDeck_${scheme}`);
      if (!container) return;
      const queue = appState.uploadedFilesQueue || [];
      if (queue.length === 0) {
        container.innerHTML = '';
        return;
      }

      const cfg = SCHEME_CONFIG[scheme] || SCHEME_CONFIG.investasi;
      const totalKB = queue.reduce((acc, f) => acc + (f.sizeKB || Math.round((f.size || 0)/1024)), 0);

      container.innerHTML = `
        <div class="absorbed-deck-card" style="background:#FFFFFF; border:1.5px solid #93C5FD; border-left:5px solid #2563EB; border-radius:10px; padding:14px 18px; margin-bottom:16px; box-shadow:0 4px 14px rgba(37,99,235,0.06); animation:modalEnter 200ms var(--ease-out) forwards;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px; border-bottom:1px solid #E2E8F0; padding-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:22px;">📚</span>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="badge badge-blue" style="font-size:10px; font-weight:800; text-transform:uppercase;">KAPASITAS PENYERAPAN AKTIF</span>
                  <span style="font-size:11px; font-weight:700; color:#1E40AF; background:#DBEAFE; padding:2px 8px; border-radius:12px;">${queue.length} Berkas Terbaca (${totalKB} KB)</span>
                </div>
                <h4 style="margin:2px 0 0 0; font-size:13.5px; font-weight:800; color:#1E3A8A;">
                  Dek Berkas Kolektif yang Telah Diserap ke ${escapeHtml(cfg.label)}
                </h4>
              </div>
            </div>
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <button type="button" onclick="triggerUniversalFileUpload()" class="btn btn-secondary btn-sm" style="font-size:11.5px; padding:6px 12px; cursor:pointer;">
                ➕ Tambah Berkas
              </button>
              <button type="button" onclick="setProcessStep('${scheme}', 2)" class="btn btn-primary btn-sm" style="background:#2563EB; border-color:#1D4ED8; font-weight:700; font-size:11.5px; padding:6px 14px; cursor:pointer;">
                ⚡ Serap &amp; Lanjut ke Langkah 2 Pratinjau →
              </button>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:10px;">
            ${queue.map((item, idx) => {
              const isPdf = (item.ext || '').toLowerCase() === 'pdf' || (item.name || '').toLowerCase().endsWith('.pdf');
              const extBadge = isPdf 
                ? '<span style="background:#FEE2E2; color:#991B1B; font-weight:800; font-size:10px; padding:2px 6px; border-radius:4px; border:1px solid #FCA5A5;">PDF</span>'
                : '<span style="background:#DCFCE7; color:#166534; font-weight:800; font-size:10px; padding:2px 6px; border-radius:4px; border:1px solid #86EFAC;">XLSX</span>';
              return `
                <div class="absorbed-file-chip" style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:8px; transition:border-color 140ms ease, transform 140ms var(--ease-out);">
                  <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                    ${extBadge}
                    <div style="overflow:hidden;">
                      <div style="font-size:12px; font-weight:700; color:#0F172A; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; max-width:180px;" title="${escapeHtml(item.name)}">
                        ${escapeHtml(item.name)}
                      </div>
                      <div style="font-size:10.5px; color:#64748B; margin-top:1px;">
                        ${escapeHtml(item.sizeKB || Math.round((item.size || 0)/1024))} KB • <span style="color:#166534; font-weight:700;">✓ Terserap Kolektif</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" onclick="removeAbsorbedFileFromDeck('${item.id}', '${scheme}')" class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:11px; color:#94A3B8; border:1px solid #E2E8F0; border-radius:6px; cursor:pointer;" title="Keluarkan berkas dari dek">
                    ✕
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    function removeAbsorbedFileFromDeck(fileId, scheme) {
      if (typeof removeSchemeUploadedFile === 'function') {
        removeSchemeUploadedFile(fileId);
      }
      renderAbsorbedFilesDeck(scheme);
    }
"""

if 'function renderAbsorbedFilesDeck' not in html:
    html = html.replace(
        '    function renderSchemeUploadedFilesQueue() {',
        deck_js_code + '\n    function renderSchemeUploadedFilesQueue() {'
    )
    print('Added renderAbsorbedFilesDeck function')

# Ensure renderAbsorbedFilesDeck is called in handleSchemeMultiFileSelect
if 'renderAbsorbedFilesDeck(appState.selectedScheme)' not in html:
    html = html.replace(
        'renderSchemeUploadedFilesQueue();',
        'renderSchemeUploadedFilesQueue();\n      if (typeof renderAbsorbedFilesDeck === "function") { renderAbsorbedFilesDeck("investasi"); renderAbsorbedFilesDeck("pengendali"); renderAbsorbedFilesDeck("nonpengendali"); }'
    )

# Ensure renderAbsorbedFilesDeck is called in setProcessStep when entering step 1
if 'renderAbsorbedFilesDeck(proc);' not in html:
    html = html.replace(
        'processSteps[proc] = step;',
        'processSteps[proc] = step;\n      if (step === 1 && typeof renderAbsorbedFilesDeck === "function") { renderAbsorbedFilesDeck(proc); }'
    )

# Ensure preview.html will match
with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('preview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated public/index.html and synchronized preview.html')
