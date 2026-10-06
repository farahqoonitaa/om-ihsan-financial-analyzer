with open("public/app.js", "r") as f:
    content = f.read()

# Let's inspect if fallback exists
# If fetch catches error, fallback to embedded mock
embedding_script = """
// Embedded Offline / File-Protocol Fallback Cache
const EMBEDDED_FALLBACK = {
  masterParameters: {
    version: "1.0-2026.10",
    zScores: {
      modifiedZ: {
        formula: "Z = -3.337 + 0.736*WK_TA + 6.95*CASHPROF_TA + 0.864*SOLVR + 7.554*OPPROF_TA + 1.544*SALES_TA",
        weights: { constant: -3.337, wk_ta: 0.736, cashprof_ta: 6.95, solvr: 0.864, opprof_ta: 7.554, sales_ta: 1.544 }
      }
    }
  }
};
"""

# Let's ensure fetch functions fall back smoothly
print("Enhancing app.js for standalone & HTTP dual-mode...")
