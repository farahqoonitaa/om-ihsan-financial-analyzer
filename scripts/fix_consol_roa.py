with open("src/engine/consolidationEngine.js", "r") as f:
    code = f.read()

old_part = "const consolidatedROA = consolidatedAssets > 0 ? Number(((consolidatedNetIncome / consolidatedAssets) * 100).toFixed(1)) : null;"
new_part = "const consolidatedROA = grossAssetsCY > 0 ? Number(((consolidatedNetIncome / grossAssetsCY) * 100).toFixed(1)) : (consolidatedAssets > 0 ? Number(((consolidatedNetIncome / consolidatedAssets) * 100).toFixed(1)) : null);"

code = code.replace(old_part, new_part)

with open("src/engine/consolidationEngine.js", "w") as f:
    f.write(code)

print("Updated consolidationEngine.js ROA calculation")
