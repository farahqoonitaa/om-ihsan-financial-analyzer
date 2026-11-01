import os
import re

ROOT_DIR = "/Users/admin/Downloads/Kajian Ihsan All /om ihsan "
INDEX_HTML = os.path.join(ROOT_DIR, "public", "index.html")
PREVIEW_HTML = os.path.join(ROOT_DIR, "preview.html")

print("Updating public/index.html and preview.html...")
with open(INDEX_HTML, "r", encoding="utf-8") as f:
    html = f.read()

old_html_sample_poj = """        const isSamplePoj = lowerFile.includes('ilovepdf_merged') || lowerFile.includes('pesonna') || lowerFile.includes('poj') ||
          ((lowerEntity.includes('pesonna') || lowerEntity.includes('poj')) && (dynMetrics.arAct === undefined || dynMetrics.arTar === undefined));"""

new_html_sample_poj = """        const isSamplePoj = lowerFile.includes('ilovepdf_merged') || lowerFile.includes('subsidiary_pt_poj') ||
          ((/(^|[^a-z0-9])poj([^a-z0-9]|$)/i.test(lowerFile) || lowerFile.includes('pesonna') || lowerEntity.includes('pesonna') || /(^|[^a-z0-9])poj([^a-z0-9]|$)/i.test(lowerEntity)) && (dynMetrics.arAct === undefined || dynMetrics.arTar === undefined));"""

assert old_html_sample_poj in html, "old_html_sample_poj not found"
html = html.replace(old_html_sample_poj, new_html_sample_poj)

old_html_sample_eps = """        const isSampleEps = lowerFile.includes('laporan_keuangan_pt_a') || lowerFile.includes('pt_a') || lowerFile.includes('eps') ||
          ((lowerEntity.includes('permata') || lowerEntity.includes('eps') || lowerEntity === 'pt a') && (dynMetrics.sales === undefined || dynMetrics.ca === undefined));"""

new_html_sample_eps = """        const isSampleEps = lowerFile.includes('laporan_keuangan_pt_a') || lowerFile.includes('subsidiary_pt_eps') ||
          ((/(^|[^a-z0-9])pt[_\-\s]?a(\.[a-z0-9]+|[^a-z0-9]|$)/i.test(lowerFile) || /(^|[^a-z0-9])eps([^a-z0-9]|$)/i.test(lowerFile) || lowerEntity.includes('permata') || /(^|[^a-z0-9])eps([^a-z0-9]|$)/i.test(lowerEntity) || lowerEntity === 'pt a') && (dynMetrics.sales === undefined || dynMetrics.ca === undefined));"""

assert old_html_sample_eps in html, "old_html_sample_eps not found"
html = html.replace(old_html_sample_eps, new_html_sample_eps)

with open(INDEX_HTML, "w", encoding="utf-8") as f:
    f.write(html)
with open(PREVIEW_HTML, "w", encoding="utf-8") as f:
    f.write(html)
print("public/index.html and preview.html updated successfully.")
