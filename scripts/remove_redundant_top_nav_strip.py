#!/usr/bin/env python3
"""
Script to remove the redundant top entity nav strip (.entity-nav-strip)
so that Page 1 is purely the single executive gateway with 1-out-of-3 choice cards,
eliminating the duplicate '3 pengendali' buttons at the top.
"""

import re
import sys

def main():
    with open('public/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Move btnNavArgonRag into header-actions if not already there,
    # and hide .entity-nav-strip completely.
    # Let's inspect where header-actions ends
    header_end_target = '<button id="btnHeaderReset" onclick="resetAllToBlankState()"'
    
    rag_button_header = '''<button type="button" id="btnHeaderArgonRag" onclick="openArgonDeepDiveExplorer('pindo_qoe')" class="btn btn-gold btn-sm" style="display:inline-flex; align-items:center; gap:6px; font-weight:800; cursor:pointer; padding:7px 14px; border-radius:8px;">
        <span>🧠</span> <span>Tanya Argon RAG</span>
      </button>
      <button id="btnHeaderReset" onclick="resetAllToBlankState()"'''

    if 'id="btnHeaderArgonRag"' not in html and header_end_target in html:
        html = html.replace(header_end_target, rag_button_header, 1)
        print("Added btnHeaderArgonRag into header-actions")

    # 2. Hide .entity-nav-strip completely so it does not clutter the page
    # Look for <nav class="entity-nav-strip"
    nav_strip_pattern = r'<nav class="entity-nav-strip"[^>]*>'
    if re.search(nav_strip_pattern, html):
        html = re.sub(nav_strip_pattern, '<nav class="entity-nav-strip" style="display:none !important;">', html, count=1)
        print("Hidden .entity-nav-strip completely")
    else:
        print("Warning: .entity-nav-strip not found!")

    # 3. In CSS, also add rule:
    css_rule = '''
    /* Completely hide top entity nav strip to avoid duplicate choice buttons on Page 1 */
    .entity-nav-strip {
      display: none !important;
    }
'''
    if 'Completely hide top entity nav strip' not in html:
        html = html.replace('/* Dedicated Scheme Portals', css_rule + '\n    /* Dedicated Scheme Portals')
        print("Added CSS rule to hide .entity-nav-strip")

    # 4. Clean up threeDedicatedPortalsGrid header so it does not repeat "⚡ Kapasitas Penyerapan: ≥ 3 Berkas Kolektif"
    # Let's check lines inside threeDedicatedPortalsGrid
    old_grid_subhead = '''        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
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
        </div>'''

    new_grid_subhead = '''        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:13px; font-weight:800; color:#14532D; background:#DCFCE7; border:1.5px solid #86EFAC; border-radius:20px; padding:5px 14px;">
              🎯 3 Pilihan Fokus Analisis Om Ihsan
            </span>
            <span style="font-size:13px; font-weight:600; color:var(--ink-secondary);">
              Pilih 1 kartu di bawah untuk mengerucutkan layar (narrowing):
            </span>
          </div>
          <span style="font-size:12px; font-weight:700; color:#15803D; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:12px; padding:4px 12px;">
            ⚡ Kapasitas Penyerapan: &ge; 3 Berkas Kolektif
          </span>
        </div>'''

    if old_grid_subhead in html:
        html = html.replace(old_grid_subhead, new_grid_subhead)
        print("Updated grid subhead for clearer executive guidance")

    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Saved public/index.html and preview.html successfully.")

if __name__ == '__main__':
    main()
