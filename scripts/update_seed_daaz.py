with open("src/data/seedData.js", "r") as f:
    text = f.read()

# Replace daaz financials
old_str = """      financials: {
        revenueCY: 4351.60,
        revenuePY: 3908.80,
        revenuePM: 720.00,
        rkapTargetRevenue: 4420.00,
        cogsCY: 4073.90,
        grossProfitCY: 277.70,
        operatingProfitCY: 203.70,
        operatingProfitPY: 219.20,
        rkapTargetOpProfit: 230.00,
        netProfitCY: 86.60,
        netProfitPY: 136.60,
        netProfitPM: 14.50,
        rkapTargetNetProfit: 105.00,
        ebitdaCY: 254.20,
        interestExpenseCY: 70.20,
        taxExpenseCY: 28.90,
        totalAssetsCY: 2083.90,
        totalAssetsPY: 1820.00,
        currentAssetsCY: 1684.20,
        cashCY: 227.80,
        tradeReceivablesCY: 766.10,
        currentLiabCY: 1072.80,
        stDebtCY: 425.00,
        ltDebtCY: 615.00,
        totalLiabCY: 1379.10,
        totalLiabPY: 1180.00,
        equityCY: 704.80,
        equityPY: 640.00,
        depreciationCY: 50.50,
        ocfCY: -232.10
      },"""

new_str = """      financials: {
        revenueCY: 6908.10,
        revenuePY: 6205.13,
        revenuePM: 1150.00,
        rkapTargetRevenue: 7000.00,
        cogsCY: 6467.05,
        grossProfitCY: 441.06,
        operatingProfitCY: 323.17,
        operatingProfitPY: 347.73,
        rkapTargetOpProfit: 350.00,
        netProfitCY: 137.45,
        netProfitPY: 216.79,
        netProfitPM: 23.00,
        rkapTargetNetProfit: 160.00,
        ebitdaCY: 403.26,
        interestExpenseCY: 111.32,
        taxExpenseCY: 45.00,
        totalAssetsCY: 6616.22,
        totalAssetsPY: 6318.72,
        currentAssetsCY: 3809.84,
        cashCY: 494.57,
        tradeReceivablesCY: 1733.02,
        currentLiabCY: 2426.95,
        stDebtCY: 1010.04,
        ltDebtCY: 1940.99,
        totalLiabCY: 4378.92,
        totalLiabPY: 4140.97,
        equityCY: 2237.31,
        equityPY: 2177.74,
        depreciationCY: 80.10,
        ocfCY: -369.03,
        isSemiAnnual: true
      },"""

if old_str in text:
    text = text.replace(old_str, new_str)
    with open("src/data/seedData.js", "w") as f:
        f.write(text)
    print("Successfully updated PT Daaz financials in seedData.js")
else:
    print("String not found, checking...")
