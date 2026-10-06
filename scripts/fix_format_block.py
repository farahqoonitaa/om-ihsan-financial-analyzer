with open("public/app.js", "r") as f:
    text = f.read()

import re
fixed_text = re.sub(
    r'let formatted = data\.answer[\s\S]*?agentDiv\.innerHTML = formatted;',
    '''let formatted = (data.answer || "")
      .replace(/### (.*?)\\n/g, '<h4 style="margin:8px 0 4px; color:#1B4332;">$1</h4>')
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .split('\\n\\n').join('<br><br>')
      .split('\\n').join('<br>');

    if (data.ragCitations && data.ragCitations.length > 0) {
      formatted += '<br><div style="margin-top:8px; border-top:1px dashed #CCC; padding-top:4px;">';
      data.ragCitations.forEach(c => {
        formatted += `<span class="citation-chip">📖 ${c.source} (${c.page})</span> `;
      });
      formatted += '</div>';
    }

    agentDiv.innerHTML = formatted;''',
    text
)

with open("public/app.js", "w") as f:
    f.write(fixed_text)

print("Replaced formatting block successfully")
