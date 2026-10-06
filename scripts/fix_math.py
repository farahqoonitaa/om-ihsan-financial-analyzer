# Fix SOLVR in financialMath.js
with open("src/engine/financialMath.js", "r") as f:
    code = f.read()

# Replace solvr formula
code = code.replace("const solvr = equity / totalLiab; // 1 / DER", "const solvr = totalAssets / totalLiab; // Total Aset / Total Liabilitas (Sesuai Blueprint hlm. 15)")

with open("src/engine/financialMath.js", "w") as f:
    f.write(code)

print("Updated financialMath.js with correct SOLVR definition.")
