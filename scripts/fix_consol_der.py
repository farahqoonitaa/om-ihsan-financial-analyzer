with open("src/engine/consolidationEngine.js", "r") as f:
    code = f.read()

old_part = "const consolidatedDER = consolidatedEq > 0 ? Number((consolidatedLiab / consolidatedEq).toFixed(2)) : null;"
new_part = "const consolidatedDER = grossEqCY > 0 ? Number((grossLiabCY / grossEqCY).toFixed(2)) : (consolidatedEq > 0 ? Number((consolidatedLiab / consolidatedEq).toFixed(2)) : null);"

code = code.replace(old_part, new_part)

with open("src/engine/consolidationEngine.js", "w") as f:
    f.write(code)

print("Updated consolidationEngine.js DER calculation")
