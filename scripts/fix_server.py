with open("server.js", "r") as f:
    code = f.read()

# Replace faulty line
bad_line = '"Content-Disposition": "attachment; filename="template_analisis_keuangan_3sheet.xlsx"",'
good_line = '"Content-Disposition": "attachment; filename=\\"template_analisis_keuangan_3sheet.xlsx\\"",'

if bad_line in code:
    code = code.replace(bad_line, good_line)
    with open("server.js", "w") as f:
        f.write(code)
    print("Fixed Content-Disposition in server.js")
else:
    # Look for any unescaped filename=
    import re
    code = re.sub(r'filename="([^"]+)"', r'filename=\\"\1\\"', code)
    with open("server.js", "w") as f:
        f.write(code)
    print("Regex fixed filename in server.js")
