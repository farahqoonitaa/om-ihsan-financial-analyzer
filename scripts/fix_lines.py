with open("public/app.js", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, l in enumerate(lines):
    if "let formatted = (data.answer ||" in l:
        new_lines.append('    let formatted = (data.answer || "")\n')
        new_lines.append('      .replace(/### (.*?)\\n/g, \'<h4 style="margin:8px 0 4px; color:#1B4332;">$1</h4>\')\n')
        new_lines.append('      .replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>")\n')
        new_lines.append('      .replace(/\\n\\n/g, "<br><br>")\n')
        new_lines.append('      .replace(/\\n/g, "<br>");\n')
        new_lines.append('\n')
        new_lines.append('    if (data.ragCitations && data.ragCitations.length > 0) {\n')
        new_lines.append('      formatted += \'<br><div style="margin-top:8px; border-top:1px dashed #CCC; padding-top:4px;">\';\n')
        new_lines.append('      data.ragCitations.forEach(c => {\n')
        new_lines.append('        formatted += `<span class="citation-chip">📖 ${c.source} (${c.page})</span> `;\n')
        new_lines.append('      });\n')
        new_lines.append('      formatted += "</div>";\n')
        new_lines.append('    }\n')
        new_lines.append('    agentDiv.innerHTML = formatted;\n')
        skip = True
    elif skip and "agentDiv.innerHTML = formatted;" in l:
        skip = False
    elif not skip:
        new_lines.append(l)

with open("public/app.js", "w") as f:
    f.writelines(new_lines)

print("Line-by-line replacement finished successfully")
