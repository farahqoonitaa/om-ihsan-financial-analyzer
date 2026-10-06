/**
 * Master Standardized Parameters & Ratio Dictionary
 * Sesuai Action Item 1: Parameter Baku Analisis Keuangan (MOM, PRD & Kajian Ihsan)
 * 
 * Mencakup:
 * - 33 Rasio Baku (Likuiditas, Solvabilitas, Profitabilitas, Coverage, Efisiensi, Z-Scores)
 * - Thresholds & Kriteria Merah / Kuning / Hijau
 * - Definisi 4 Dimensi Komparasi (Tahun Lalu / YoY, Bulan Lalu / MoM, YoY %, RTC %)
 * - 10 Sinyal Forensik (S1 - S10)
 * - Plafon Regulasi POJK & Covenant Institusional
 */

const MASTER_PARAMETERS = {
  version: "1.0-2026.10",
  lastUpdated: "2026-10-06",
  sourceBaseline: "Kajian Ihsan & YKPP Divisi Keuangan & Subsidiary",

  // 1. Definisi 4 Dimensi Komparasi (MOM Action Item 3)
  comparisonDimensions: {
    priorMonth: {
      key: "MoM",
      label: "Bulan Lalu (MoM)",
      description: "Perbandingan posisi atau realisasi terhadap 1 bulan sebelumnya untuk menangkap dinamika jangka pendek."
    },
    priorYear: {
      key: "YoY_Nominal",
      label: "Tahun Lalu (YoY Basis)",
      description: "Posisi atau realisasi pada periode yang sama di tahun sebelumnya (misal Ags 2026 vs Ags 2025)."
    },
    yoyPercentage: {
      key: "YoY_Percent",
      label: "Pertumbuhan YoY (%)",
      description: "Persentase pertumbuhan tahun-ke-tahun: ((CY - PY) / |PY|) * 100%."
    },
    rtc: {
      key: "RTC",
      label: "RTC / Realisasi Terhadap Cita-cita (%)",
      description: "Persentase realisasi capaian aktual terhadap target RKAP / Anggaran: (Realisasi Aktual / Target RKAP) * 100%."
    }
  },

  // 2. Ambang Batas RTC (Realisasi Terhadap Cita-cita / Target RKAP)
  rtcThresholds: {
    revenueAndProfit: {
      green: { min: 95.0, label: "Tercapai / Sesuai Target (≥ 95%)", color: "#3D7A56" },
      yellow: { min: 80.0, max: 94.99, label: "Perlu Perhatian (80% - 94.9%)", color: "#B8902E" },
      red: { max: 79.99, label: "Kurang / Di Bawah Target (< 80%)", color: "#A6402A" }
    },
    costAndReceivables: {
      green: { max: 105.0, label: "Terkendali (≤ 105%)", color: "#3D7A56" },
      yellow: { min: 105.01, max: 120.0, label: "Peringatan Lonjakan (105% - 120%)", color: "#B8902E" },
      red: { min: 120.01, label: "Lonjakan Kritis (> 120% terhadap RKAP)", color: "#A6402A" }
    }
  },

  // 3. Model Default Risk & Altman / Modified Z-Score
  zScores: {
    altmanZ: {
      name: "Altman Z-Score",
      formula: "1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5",
      zones: {
        safe: { min: 2.60, tier: "Hijau", label: "Kemungkinan Gagal Bayar Rendah" },
        grey: { min: 1.21, max: 2.60, tier: "Kuning", label: "Kemungkinan Gagal Bayar Meragukan (Grey Zone)"} ,
        distress: { max: 1.209, tier: "Merah", label: "Kemungkinan Gagal Bayar Tinggi" }
      }
    },
    modifiedZ: {
      name: "Modified Z-Score (Anualisasi)",
      formula: "Z = -3.337 + 0.736*WK_TA + 6.95*CASHPROF_TA + 0.864*SOLVR + 7.554*OPPROF_TA + 1.544*SALES_TA",
      weights: {
        constant: -3.337,
        wk_ta: 0.736,       // Modal Kerja Bersih / Total Aset
        cashprof_ta: 6.95,  // (Laba Bersih + Penyusutan)*2 / Total Aset
        solvr: 0.864,       // Total Ekuitas / Total Liabilitas (1/DER)
        opprof_ta: 7.554,   // (Laba Operasional*2) / Total Aset
        sales_ta: 1.544     // (Pendapatan*2) / Total Aset
      },
      zones: {
        safe: { min: 0.0, tier: "Hijau", label: "Aman (Kemungkinan Gagal Bayar Rendah)" },
        fair: { min: -0.50, max: -0.001, tier: "Kuning", label: "Cukup Aman (Perlu Monitoring)" },
        review: { min: -1.00, max: -0.501, tier: "Oranye", label: "Butuh Peninjauan" },
        distress: { max: -1.001, tier: "Merah", label: "Tidak Aman (Default Risk Tinggi)" }
      }
    }
  },

  // 4. Standar 33 Rasio Keuangan Baku (Sesuai Skema Obligasi Kajian Ihsan)
  ratios: [
    // Likuiditas
    { id: "CR", name: "Current Ratio", category: "Likuiditas", unit: "x", direction: "up", covenantNonFinancial: 1.25, thresholdYellow: 1.0, thresholdRed: 0.8, desc: "Aset Lancar / Liabilitas Lancar" },
    { id: "QR", name: "Quick Ratio", category: "Likuiditas", unit: "x", direction: "up", covenantNonFinancial: 0.8, thresholdYellow: 0.5, thresholdRed: 0.3, desc: "(Kas + Setara Kas + Efek + Piutang Lancar) / Liabilitas Lancar" },
    { id: "NWC", name: "Net Working Capital", category: "Likuiditas", unit: "Rp", direction: "up", thresholdRed: 0, desc: "Aset Lancar - Liabilitas Lancar" },
    { id: "OCF_CL", name: "OCF / Current Liabilities", category: "Likuiditas", unit: "x", direction: "up", thresholdYellow: 0.2, thresholdRed: 0.0, desc: "Arus Kas Operasi / Liabilitas Lancar" },
    
    // Solvabilitas & Leverage
    { id: "DER", name: "Debt to Equity Ratio (DER)", category: "Solvabilitas", unit: "x", direction: "down", pojkCeiling: 5.0, financialCeiling: 10.0, nonFinancialCeiling: 3.0, thresholdYellow: 3.5, thresholdRed: 5.0, desc: "Total Liabilitas / Total Ekuitas" },
    { id: "DR", name: "Debt Ratio", category: "Solvabilitas", unit: "%", direction: "down", thresholdYellow: 70.0, thresholdRed: 80.0, desc: "(Total Liabilitas / Total Aset) * 100%" },
    { id: "LTD_E", name: "Long Term Debt to Equity", category: "Solvabilitas", unit: "x", direction: "down", thresholdYellow: 1.5, thresholdRed: 2.5, desc: "Utang Jangka Panjang / Total Ekuitas" },
    { id: "LTD_TA", name: "Long Term Debt to Total Assets", category: "Solvabilitas", unit: "x", direction: "down", thresholdYellow: 0.4, thresholdRed: 0.6, desc: "Utang Jangka Panjang / Total Aset" },
    { id: "NET_GEARING", name: "Net Gearing Ratio", category: "Solvabilitas", unit: "x", direction: "down", thresholdYellow: 1.0, thresholdRed: 2.0, desc: "(Utang Berbunga - Kas) / Total Ekuitas" },
    
    // Profitabilitas
    { id: "GPM", name: "Gross Profit Margin", category: "Profitabilitas", unit: "%", direction: "up", thresholdYellow: 5.0, thresholdRed: 3.0, desc: "(Laba Kotor / Pendapatan) * 100%" },
    { id: "OPM", name: "Operating Profit Margin", category: "Profitabilitas", unit: "%", direction: "up", thresholdYellow: 4.0, thresholdRed: 2.0, desc: "(Laba Usaha / Pendapatan) * 100%" },
    { id: "NPM", name: "Net Profit Margin", category: "Profitabilitas", unit: "%", direction: "up", thresholdYellow: 2.5, thresholdRed: 1.0, desc: "(Laba Bersih / Pendapatan) * 100%" },
    { id: "EBITDA_M", name: "EBITDA Margin", category: "Profitabilitas", unit: "%", direction: "up", thresholdYellow: 5.0, thresholdRed: 3.0, desc: "(EBITDA / Pendapatan) * 100%" },
    { id: "ROA", name: "Return on Assets (ROA)", category: "Profitabilitas", unit: "%", direction: "up", benchmarkPeerMin: 3.5, benchmarkPeerMax: 5.2, thresholdYellow: 3.0, thresholdRed: 1.5, desc: "(Laba Bersih Anualisasi / Total Aset) * 100%" },
    { id: "ROE", name: "Return on Equity (ROE)", category: "Profitabilitas", unit: "%", direction: "up", thresholdYellow: 8.0, thresholdRed: 4.0, desc: "(Laba Bersih Anualisasi / Total Ekuitas) * 100%" },
    { id: "EBITDA_TA", name: "EBITDA to Total Assets", category: "Profitabilitas", unit: "%", direction: "up", thresholdYellow: 6.0, thresholdRed: 3.0, desc: "(EBITDA Anualisasi / Total Aset) * 100%" },

    // Coverage & Cash Flow
    { id: "ICR", name: "Interest Coverage Ratio (EBIT / Interest)", category: "Coverage", unit: "x", direction: "up", covenantNonFinancial: 3.0, thresholdYellow: 2.0, thresholdRed: 1.0, desc: "Laba Sebelum Bunga & Pajak / Beban Bunga" },
    { id: "EBITDA_INT", name: "EBITDA to Interest Expense", category: "Coverage", unit: "x", direction: "up", thresholdYellow: 2.5, thresholdRed: 1.2, desc: "EBITDA / Beban Bunga" },
    { id: "CFCR", name: "Cash Flow Coverage Ratio", category: "Coverage", unit: "x", direction: "up", thresholdYellow: 1.5, thresholdRed: 0.0, desc: "Arus Kas Operasi / Beban Bunga" },
    { id: "DSCR", name: "Debt Service Coverage Ratio (DSCR)", category: "Coverage", unit: "x", direction: "up", covenantNonFinancial: 1.3, thresholdYellow: 1.1, thresholdRed: 1.0, desc: "(EBITDA - Pajak) / (Bunga + Angsuran Pokok Pinjaman Jangka Pendek)"} ,
    { id: "OCF_NI", name: "Operating Cash Flow to Net Income", category: "Coverage", unit: "x", direction: "up", thresholdYellow: 0.8, thresholdRed: 0.0, desc: "Arus Kas Operasi / Laba Bersih" },

    // Kualitas Aset & Pertumbuhan
    { id: "AR_CA", name: "Piutang Usaha / Aset Lancar", category: "Kualitas Aset", unit: "%", direction: "down", thresholdYellow: 60.0, thresholdRed: 80.0, desc: "(Piutang Usaha / Aset Lancar) * 100%" },
    { id: "SALES_G", name: "Sales Growth YoY", category: "Pertumbuhan", unit: "%", direction: "up", thresholdYellow: 0.0, thresholdRed: -5.0, desc: "((Pendapatan CY - Pendapatan PY) / Pendapatan PY) * 100%" },
    { id: "OP_G", name: "Operating Income Growth YoY", category: "Pertumbuhan", unit: "%", direction: "up", thresholdYellow: 0.0, thresholdRed: -10.0, desc: "((Laba Operasi CY - Laba Operasi PY) / Laba Operasi PY) * 100%" },
    { id: "NI_G", name: "Net Income Growth YoY", category: "Pertumbuhan", unit: "%", direction: "up", thresholdYellow: 0.0, thresholdRed: -10.0, desc: "((Laba Bersih CY - Laba Bersih PY) / Laba Bersih PY) * 100%" }
  ],

  // 5. Parameter 10 Sinyal Forensik (S1 - S10 Sesuai PRD Pengendali)
  forensicSignals: [
    { code: "S1", name: "Large Movement / Fluktuasi Ekstrem", rule: "|Δ%| ≥ 50% dan nominal material", severity: "Major", desc: "Perubahan YoY di atas 50% yang berpotensi memicu ketidakseimbangan modal kerja atau operasional." },
    { code: "S2", name: "Static Balance / Saldo Macet", rule: "Δ = 0 pada akun yang seharusnya bergerak (cadangan, beban ditangguhkan)", severity: "Medium", desc: "Saldo identik antar periode mengindikasikan kemungkinan copy-forward error atau penundaan jurnal." },
    { code: "S3", name: "Anomalous Sign / Saldo Abnormal", rule: "Nilai negatif pada akun bersaldo normal debet/kredit yang tidak wajar", severity: "Major", desc: "Saldo negatif pada ekuitas (seperti cadangan tujuan negatif) atau modal kerja negatif." },
    { code: "S4", name: "Footing & Cross-Check Break", rule: "Selisih matematis antara Neraca, Laba Rugi, CALK, atau Alokasi Unit", severity: "Major", desc: "Ketidaksamaan angka rincian CALK dengan laporan muka, atau selisih penjumlahan baris/kolom." },
    { code: "S5", name: "Policy / Tax Rate Break", rule: "Perubahan tarif pajak efektif (misal 22% vs 25%) atau kebijakan depresiasi tanpa pengungkapan", severity: "Major", desc: "Perbedaan tarif pajak atau penyimpangan aturan PSAK/kebijakan akuntansi induk." },
    { code: "S6", name: "Non-Operating Spike / Distorsi Non-Operasional", rule: "Pendapatan/beban lain-lain > 20% dari laba operasional", severity: "Medium", desc: "Pertumbuhan laba bersih yang disokong oleh keuntungan satu kali (one-off gain)." },
    { code: "S7", name: "Growth Gap / Kenaikan Beban Melebihi Pendapatan", rule: "Pertumbuhan Beban Usaha > Pertumbuhan Pendapatan atau margin tertekan > 0.5 pp", severity: "BPR", desc: "Pertumbuhan pendapatan tidak menghasilkan pertumbuhan laba bersih yang proporsional (quality of earnings tertekan)." },
    { code: "S8", name: "Segment Decline / Penurunan Unit Usaha", rule: "Pendapatan lini bisnis turun > 10% atau mencatat laba setelah pembebanan negatif", severity: "Medium", desc: "Lini bisnis tertentu mengalami rugi setelah alokasi beban kantor pusat atau penurunan omzet drastis." },
    { code: "S9", name: "Budget Pacing / Keterlambatan Realisasi RKAP", rule: "Realisasi pendapatan/laba < 80% dari target prorata waktu berjalan (RTC)", severity: "BPR", desc: "Kinerja berjalan tertinggal jauh dari target RKAP tahunan yang telah ditetapkan." },
    { code: "S10", name: "Related-Party Spike & NCI Mismatch", rule: "|NCI Dilaporkan - NCI Dihitung| > 8% atau ΔPiutang Pihak Berelasi - ΔPendapatan > 30%", severity: "Major", desc: "Disparitas pembagian laba minoritas IFRS 10 atau lonjakan piutang afiliasi tanpa kesepakatan wajar." }
  ],

  // 6. Plafon Regulasi & Covenants
  covenants: {
    pojkSolvencyMax: 5.0,        // POJK Batas Maksimum DER
    financialDerCeiling: 10.0,   // Finansial DER Maksimum
    nonFinancialDerCeiling: 3.0, // Non-Finansial Non-Infra
    currentRatioMin: 1.25,       // Minimum Current Ratio
    interestCoverageMin: 3.0,    // Minimum ICR
    minBondRating: "A (Stable)"  // Peringkat Obligasi Minimal
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = MASTER_PARAMETERS;
}
