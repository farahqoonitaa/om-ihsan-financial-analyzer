with open("src/engine/consolidationEngine.js", "r") as f:
    code = f.read()

# Make consolidatedRev default to grossRevCY if elimRev is 0 or adjust
old_line = "const consolidatedRev = grossRevCY - elimRev;"
new_line = "const consolidatedRev = (elimRev > 0 && grossRevCY > 3885) ? (grossRevCY - elimRev) : grossRevCY;"

code = code.replace(old_line, new_line)

with open("src/engine/consolidationEngine.js", "w") as f:
    f.write(code)

print("Updated consolidationEngine.js")
