
// --- INLINE EMBEDDED BENCHMARK REPOSITORY (Enables 100% offline & file:// execution) ---
const EMBEDDED_MASTER = /**
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

 {
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
const EMBEDDED_SEED = /**
 * Seed Data & Benchmark Test Cases
 * Agenda Hari Ini: 2 Investasi, 2 Entitas Pengendali, 1 Non-Pengendali, dan Konsolidasi Akhir
 * Berdasarkan Data Riil PRD & Kajian Ihsan
 */

 {
  // --- FUNGSI 1: ENTITAS PENGENDALI ---
  pengendali: [
    {
      id: "pengendali-eps",
      name: "PT Era Permata Sejahtera (PT EPS)",
      category: "Entitas Pengendali",
      ownershipRole: "Anak Perusahaan Terkendali Penuh",
      shareholder: "Yayasan Kesejahteraan Pegadaian Permata (YKPP) - Pemegang Saham Pengendali",
      period: "31 Agustus 2026",
      comparativePeriod: "31 Agustus 2025",
      unit: "Miliar Rupiah",
      summary: "Laporan Manajemen interim Agustus 2026 mencatat pertumbuhan omzet +31,45% YoY namun margin operasi tertekan akibat beban operasional tumbuh +32,91% dan indikasi defisit modal kerja negatif Rp40,49 Miliar.",
      financials: {
        revenueCY: 216.88,
        revenuePY: 164.98,
        cogsCY: 181.30,
        cogsPY: 136.20,
        grossProfitCY: 35.58,
        grossProfitPY: 28.78,
        opexCY: 208.53,
        opexPY: 156.89,
        operatingProfitCY: 8.34,
        operatingProfitPY: 8.09,
        netProfitCY: 6.08,
        netProfitPY: 6.05,
        totalAssetsCY: 117.80,
        totalAssetsPY: 117.96,
        currentAssetsCY: 52.63,
        currentAssetsPY: 45.80,
        currentLiabCY: 93.12,
        currentLiabPY: 94.46,
        totalLiabCY: 100.50,
        totalLiabPY: 102.10,
        equityCY: 17.30,
        equityPY: 15.86,
        cashCY: 12.45,
        tradeReceivablesCY: 28.90,
        rkapTargetRevenue: 240.00,
        rkapTargetNetProfit: 10.50
      },
      segments: [
        { name: "Jasa Outsourcing", revCY: 188.93, revPY: 133.30, growthYoY: 41.74, opexGrowth: 41.20, profitCY: 7.63, note: "Pilar utama omzet; beban tenaga kerja mengimbangi kenaikan omzet." },
        { name: "Jasa Non-Outsourcing (Rental & Ekspedisi)", revCY: 27.95, revPY: 31.68, growthYoY: -11.77, opexGrowth: 5.20, profitCY: 0.71, note: "Rental turun 37%; segmen properti membukukan rugi operasi -Rp29,1 jt." },
        { name: "Beban Kantor Pusat (Head Office)", totalExpense: 7.66, allocatedExpense: 6.57, unallocated: 1.09, note: "Terdapat Rp1,09 Miliar beban kantor pusat yang belum terdistribusi ke unit bisnis." }
      ],
      findings: [
        { id: "F-EPS-01", signal: "S3 / S4", title: "Negative Net Working Capital & Defisit Likuiditas", severity: "Major Finding", delta: "Current Ratio 0,57x | NWC -Rp40,49 Miliar", impact: "Aset lancar Rp52,63 M tidak cukup menutup kewajiban lancar Rp93,12 M. Risiko likuiditas jangka pendek.", action: "Audit Finding (Requires Revision)", schedule: "Rekonsiliasi arus kas 12 bulan & profil jatuh tempo utang lancar." },
        { id: "F-EPS-02", signal: "S7", title: "Growth Gap: Opex Melejit Melebihi Pertumbuhan Pendapatan", severity: "BPR", delta: "Opex +32,91% vs Omzet +31,45% | Operating Margin Turun 4,90% → 3,85%", impact: "Tekanan margin usaha; quality of earnings menurun karena kenaikan biaya overhead.", action: "Clarify", schedule: "Evaluasi efisiensi biaya per kontrak outsourcing." },
        { id: "F-EPS-03", signal: "S1 / S9", title: "Lonjakan Tunjangan Bonus Jasa Produksi Rp12,87 M (2.308% RKAP)", severity: "Major Finding", delta: "Realisasi Rp12,87 M vs Anggaran Tahunan Rp557,7 Juta", impact: "Beban pegawai ymh dibayar melesat dari Rp9,77 M menjadi Rp18,25 M tanpa pengungkapan CALK yang proporsional.", action: "Audit Finding (Requires Revision)", schedule: "Surat Keputusan Direksi/Pengurus terkait persetujuan alokasi bonus produksi." },
        { id: "F-EPS-04", signal: "S5", title: "Perbedaan Tarif Pajak Efektif (ETR 22% vs 25%)", severity: "Major Finding", delta: "Tarif pajak efektif bergeser tanpa rekonsiliasi fiskal CALK Note 24", impact: "Potensi kewajiban pajak kurang bayar atau koreksi fiskal SPT Badan.", action: "Clarify", schedule: "Kertas kerja rekonsiliasi laba akuntansi vs laba fiskal." },
        { id: "F-EPS-05", signal: "S3", title: "Cadangan Tujuan Bersaldo Negatif -Rp12,83 Miliar", severity: "Medium", delta: "Akun Cadangan Tujuan di Neraca bernilai negatif", impact: "Anomali saldo normal ekuitas yang mengindikasikan akumulasi penarikan melebihi saldo cadangan yang dibentuk.", action: "Clarify", schedule: "Rincian mutasi akun cadangan tujuan sejak awal pendirian." },
        { id: "F-EPS-06", signal: "S4", title: "Discrepancy Footing CALK Note 12 vs Neraca Muka (Hutang Pajak)", severity: "Medium", delta: "Neraca Rp4.499.425.447 vs CALK Rp4.499.425.442 (Selisih Rp5)", impact: "Ketidakkonsistenan pembulatan sistem akuntansi (footing check break).", action: "Approved", schedule: "Sinkronisasi otomatis template laporan keuangan." }
      ]
    },
    {
      id: "pengendali-sub1",
      name: "PT Anak Pengendali I (Subsidiary I)",
      category: "Entitas Pengendali",
      ownershipRole: "Anak Perusahaan Operasional 100% Kepemilikan",
      shareholder: "Yayasan Holding (Induk) - Kontrol Penuh 100%",
      period: "31 Agustus 2026",
      comparativePeriod: "31 Agustus 2025",
      unit: "Miliar Rupiah / Juta USD",
      summary: "Entitas kontributor laba terbesar (36,3% total konsolidasi); operasional stabil dengan pertumbuhan omzet +10,7% dan margin usaha 12,5%.",
      financials: {
        revenueCY: 1240.00,
        revenuePY: 1120.00,
        cogsCY: 960.00,
        cogsPY: 880.00,
        grossProfitCY: 280.00,
        grossProfitPY: 240.00,
        opexCY: 1085.00,
        opexPY: 980.00,
        operatingProfitCY: 155.00,
        operatingProfitPY: 140.00,
        netProfitCY: 118.00,
        netProfitPY: 104.00,
        totalAssetsCY: 1980.00,
        totalAssetsPY: 1780.00,
        currentAssetsCY: 820.00,
        currentAssetsPY: 710.00,
        currentLiabCY: 510.00,
        currentLiabPY: 440.00,
        totalLiabCY: 1120.00,
        totalLiabPY: 940.00,
        equityCY: 860.00,
        equityPY: 760.00,
        cashCY: 210.00,
        tradeReceivablesCY: 310.00,
        rkapTargetRevenue: 1300.00,
        rkapTargetNetProfit: 125.00
      },
      segments: [
        { name: "Core Operational Delivery", revCY: 980.00, revPY: 890.00, growthYoY: 10.11, profitCY: 94.00, note: "Kinerja stabil sesuai anggaran." },
        { name: "Ancillary Services", revCY: 260.00, revPY: 230.00, growthYoY: 13.04, profitCY: 24.00, note: "Pertumbuhan layanan pendukung melampaui target." }
      ],
      findings: [
        { id: "F-SUB1-01", signal: "S1", title: "Eskalasi Utang Berbunga Jangka Panjang", severity: "Medium", delta: "Total Liabilitas naik +19,1% (Rp940 M → Rp1.120 M)", impact: "Kenaikan DER dari 1,24x menjadi 1,30x masih berada dalam batas aman perbankan.", action: "Approved", schedule: "Monitoring jadwal pembayaran pokok pinjaman bank." }
      ]
    }
  ],

  // --- FUNGSI 2: ENTITAS NON-PENGENDALI ---
  nonPengendali: [
    {
      id: "nonpengendali-poj",
      name: "PT Pesonna Optima Jasa (PT POJ)",
      category: "Entitas Non-Pengendali",
      ownershipRole: "Penyertaan Saham Minoritas (1.000 dari 100.000 lembar = 1,00%)",
      controllingShareholder: "PT Pegadaian Galeri Dua Empat (99,00%)",
      investorEntity: "Yayasan Kesejahteraan Pegadaian Permata (YKPP)",
      period: "31 Agustus 2026",
      comparativePeriod: "31 Agustus 2025",
      unit: "Miliar Rupiah",
      summary: "Pertumbuhan pendapatan +42,4% dan laba +44,8% positif secara top-line, namun YKPP sebagai pemegang saham minoritas mencatat risiko kritis pada likuiditas (NWC -Rp347,18 M), utang dividen Rp110,27 M yang belum dibayar, serta lonjakan piutang pihak ketiga mencapai 301,20% terhadap target RKAP.",
      financials: {
        revenueCY: 1512.00,
        revenuePY: 1062.00,
        operatingProfitCY: 112.40,
        operatingProfitPY: 78.20,
        netProfitCY: 87.65,
        netProfitPY: 60.51,
        totalAssetsCY: 1197.31,
        totalAssetsPY: 920.40,
        currentAssetsCY: 370.55,
        currentAssetsPY: 295.10,
        currentLiabCY: 717.73,
        currentLiabPY: 447.94,
        totalLiabCY: 717.73,
        totalLiabPY: 447.94,
        totalBorrowingsCY: 727.97,
        equityCY: 479.58,
        equityPY: 472.46,
        dividendPayableCY: 110.27,
        tradeReceivablesCY: 91.18,
        targetReceivablesRKAP: 30.27,
        cfoCashFlow: 131.47, // CFO / Net Profit = 1.50x
        rkapTargetRevenue: 1450.00,
        rkapTargetNetProfit: 80.00
      },
      tiering: {
        merah: [
          {
            title: "Likuiditas dan Negative Working Capital Ekstrem",
            metric: "Current Ratio 0,52x | NWC -Rp347,18 Miliar",
            desc: "Aset lancar Rp370,55 M tidak mampu menutup liabilitas lancar Rp717,73 M. Terdapat utang dividen sebesar Rp110,27 M di liabilitas lancar yang belum direalisasikan pembayarannya ke pemegang saham.",
            pertanyaanKritis: "Bagaimana manajemen menilai kecukupan likuiditas PT POJ untuk 12 bulan mendatang; bagaimana profil jatuh tempo pinjaman jangka pendek Rp399,47 M; serta kapan dan dari sumber kas apa utang dividen Rp110,27 M akan dibayarkan?"
          },
          {
            title: "Leverage Tinggi dan Risiko Refinancing",
            metric: "Total Pinjaman Rp727,97 M vs Ekuitas Rp479,58 M | DER 2,19x",
            desc: "Tingginya ketergantungan modal kerja pada pinjaman luar berpotensi memicu capital call atau kebutuhan injeksi modal pemegang saham.",
            pertanyaanKritis: "Apakah terdapat covenant bank yang membatasi pembagian dividen; berapa total kebutuhan pembiayaan hingga akhir 2027; serta apakah ada rencana corporate action yang membutuhkan tambahan setoran modal YKPP?"
          },
          {
            title: "Piutang Usaha Pihak Ketiga Mencapai 301,20% terhadap RKAP",
            metric: "Realisasi Rp91,18 Miliar vs Target RKAP Rp30,27 Miliar (RTC 301,20%)",
            desc: "Penumpukan tagihan akhir bulan yang belum tertagih mengunci kas operasional dan menurunkan kualitas laba bersih.",
            pertanyaanKritis: "Bagaimana breakdown aging piutang (0-30, 31-60, 61-90, >90 hari); berapa nominal yang telah cair setelah 31 Agustus; serta apa faktor fundamental yang membuat realisasi piutang melonjak 3x lipat dari target RKAP?"
          }
        ],
        kuning: [
          {
            title: "Gross Margin Drift & Efisiensi Operasional",
            metric: "Gross Margin mengalami penyesuaian di unit sewa dan rental armada",
            desc: "Kenaikan beban pokok sewa kendaraan menekan marjin kotor unit usaha utama.",
            pertanyaanKritis: "Bagaimana strategi pengadaan armada dan manajemen depresiasi kendaraan sewa untuk mempertahankan yield investasi?"
          },
          {
            title: "Borrowing Cost Anomaly",
            metric: "Beban bunga pinjaman bergeser relatif terhadap rata-rata baki debet",
            desc: "Perlu konfirmasi suku bunga efektif pinjaman modal kerja dari lembaga pembiayaan induk/afiliasi.",
            pertanyaanKritis: "Berapa tingkat suku bunga rata-rata tertimbang (WACD) untuk seluruh fasilitas kredit modal kerja?"
          }
        ],
        hijau: [
          {
            title: "Pertumbuhan Pendapatan & Laba Sangat Kuat",
            metric: "Omzet +42,4% YoY | Laba Bersih +44,8% YoY",
            desc: "Realisasi omzet Rp1.512 M dan laba Rp87,65 M melampaui target RKAP (RTC 104,3% dan 109,6%)."
          },
          {
            title: "Konversi Kas Operasi Berkualitas (CFO Conversion)",
            metric: "Arus Kas Operasi / Laba Bersih = 1,50x",
            desc: "Arus kas bersih dari aktivitas operasi mencapai Rp131,47 M, membuktikan profitabilitas memiliki landasan kas yang sehat."
          }
        ]
      }
    }
  ],

  // --- FUNGSI 3: INVESTASI (OBLIGASI & EKUITAS) ---
  investasi: [
    {
      id: "investasi-daaz",
      name: "PT Daaz Bara Lestari Tbk",
      instrumentType: "Portofolio Ekuitas & Obligasi Korporasi",
      industry: "Perdagangan Komoditas Logam & Energi",
      baseDate: "30 Juni 2026 (Interim Semester I)",
      priorMonthDate: "31 Mei 2026",
      priorYearDate: "30 Juni 2025",
      unit: "Miliar Rupiah",
      summary: "Emiten perdagangan komoditas dengan pertumbuhan penjualan +11,33% YoY namun laba bersih tertekan -36,60% YoY. Rasio Modified Z-Score anualisasi 2,54 berada di zona Aman (Hijau).",
      financials: {
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
      },
      ratiosComputed: {
        altmanZ: 6.54,
        modifiedZ: 2.54, // Anualisasi
        currentRatio: 1.57,
        quickRatio: 1.23,
        nwc: 611.40,
        der: 1.96,
        debtRatio: 66.18,
        ltdEquity: 0.87,
        ltdAssets: 0.29,
        netGearing: 0.65,
        gpm: 6.38,
        opm: 4.68,
        npm: 1.99,
        ebitdaMargin: 5.84,
        roa: 4.15,
        roe: 12.29,
        interestCoverage: 2.90,
        ebitdaInterest: 3.62,
        cfcr: -3.32,
        dscr: 1.37,
        ocfNi: -2.68,
        arCa: 45.49,
        salesGrowth: 11.33,
        opGrowth: -7.06,
        niGrowth: -36.60
      },
      fourDimensions: {
        mom: { revGrowth: "+4,1%", niGrowth: "-2,8%", note: "Volume pengapalan stabil MoM" },
        yoyNominal: { revCY: 4351.60, revPY: 3908.80, niCY: 86.60, niPY: 136.60 },
        yoyPercent: { salesGrowth: "+11,33%", opGrowth: "-7,06%", niGrowth: "-36,60%" },
        rtc: {
          salesRtc: 98.45, // 4351.6 / 4420
          opRtc: 88.57,    // 203.7 / 230
          niRtc: 82.48,    // 86.6 / 105
          status: "Kuning (Realisasi Laba Bersih 82,48% di bawah target 100%)"
        }
      }
    },
    {
      id: "investasi-pegadaian",
      name: "PT Pegadaian",
      instrumentType: "Obligasi Berkelanjutan & Sukuk Mudharabah",
      industry: "Jasa Pembiayaan Finansial Berbasis Gadai",
      baseDate: "30 Juni 2026",
      overlayDate: "September 2026",
      unit: "Triliun Rupiah",
      summary: "Profil dasar Juni 2026 aman dengan Z-Score 6,35 dan Modified Z-Score 0,33. Namun Risk Overlay September 2026 mengidentifikasi exposure agunan sekitar Rp20 Triliun yang memerlukan realisasi jaminan dengan asumsi stress loss Rp2 Triliun, memicu kesimpulan YELLOW - Enhanced Monitoring.",
      financials: {
        totalAssetsCY: 86.40,
        totalLiabCY: 65.98,
        equityCY: 20.42,
        currentAssetsCY: 68.20,
        currentLiabCY: 50.15,
        tradeReceivablesCY: 60.05, // 88.05% dari aset lancar
        cashCY: 4.80,
        annualizedNetIncome: 4.60,
        ebitCY: 6.80,
        interestExpenseCY: 2.40,
        ocfCY: -17.20,
        rkapTargetReceivables: 55.00
      },
      ratiosComputed: {
        altmanZ: 6.35,
        modifiedZ: 0.33,
        currentRatio: 1.36,
        quickRatio: 0.12,
        der: 3.23, // Di bawah batas finansial 10.0x
        debtRatio: 76.37,
        arCa: 88.05,
        cfcr: -5.77,
        ocfNi: -3.74
      },
      riskOverlay: {
        eventTitle: "Realisasi Agunan & Stress Loss September 2026",
        totalExposure: 20.00, // Rp20 Triliun
        assumedLoss: 2.00,     // Rp2 Triliun
        recoveryEstimated: 18.00, // Rp18 Triliun
        recoveryRate: 90.0,    // 90%
        lossSeverity: 10.0,    // 10%
        assessment: "YELLOW - Enhanced Monitoring",
        rationale: "Z-Score dasar 6,35 dan Modified Z-Score 0,33 berada di zona Hijau. Namun buffer Modified Z-Score terhadap batas 0,00 relatif tipis (0,33). Apabila potensi loss Rp2 T menekan ekuitas dan laba setelah penutupan September, Modified Z-Score dapat merosot mendekati atau di bawah 0 (zona merah). Status saat ini adalah Yellow forward-looking risk, menunggu kepastian realisasi kas agunan."
      }
    }
  ],

  // --- KONSOLIDASI AKHIR: GRUP YAYASAN (6 ENTITAS) ---
  konsolidasi: {
    title: "Konsolidasi Keuangan Grup Yayasan (6 Entitas)",
    period: "Tahun Berjalan 2026 (CY) vs Tahun Sebelumnya (PY)",
    unit: "Juta USD / Miliar Rupiah Equivalent",
    entities: [
      { name: "Yayasan Holding (Induk)", role: "parent", nciPercent: 0, revCY: 820.0, revPY: 770.0, niCY: 64.0, niPY: 60.0, assetsCY: 1450.0, liabCY: 610.0, eqCY: 840.0, rpCY: 40.0, rpPY: 36.0, reportedNci: null },
      { name: "Subsidiary I (100% Control)", role: "controlling", nciPercent: 0, revCY: 1240.0, revPY: 1120.0, niCY: 118.0, niPY: 104.0, assetsCY: 1980.0, liabCY: 1120.0, eqCY: 860.0, rpCY: 55.0, rpPY: 50.0, reportedNci: null },
      { name: "Subsidiary II (35% NCI)", role: "nci", nciPercent: 35, revCY: 640.0, revPY: 610.0, niCY: 52.0, niPY: 49.0, assetsCY: 900.0, liabCY: 430.0, eqCY: 470.0, rpCY: 88.0, rpPY: 34.0, reportedNci: 24.4 },
      { name: "Subsidiary III (40% NCI)", role: "nci", nciPercent: 40, revCY: 510.0, revPY: 495.0, niCY: 31.0, niPY: 33.0, assetsCY: 740.0, liabCY: 390.0, eqCY: 350.0, rpCY: 26.0, rpPY: 24.0, reportedNci: 12.4 },
      { name: "Subsidiary IV (22% NCI)", role: "nci", nciPercent: 22, revCY: 380.0, revPY: 360.0, niCY: 41.0, niPY: 26.0, assetsCY: 520.0, liabCY: 210.0, eqCY: 310.0, rpCY: 18.0, rpPY: 16.0, reportedNci: 9.0 },
      { name: "Subsidiary V (30% NCI)", role: "nci", nciPercent: 30, revCY: 295.0, revPY: 280.0, niCY: 19.0, niPY: 18.0, assetsCY: 410.0, liabCY: 180.0, eqCY: 230.0, rpCY: 14.0, rpPY: 11.0, reportedNci: 5.7 }
    ],
    eliminations: {
      intercompanyRevenue: 390.0,
      intercompanyReceivables: 175.0,
      intercompanyDividends: 45.0
    },
    consolidatedTotals: {
      grossRevenue: 3885.0,
      netIncomeCY: 325.0,
      netIncomePY: 284.7,
      growthNetIncomeYoY: 14.16,
      parentShareIncome: 279.7, // 86.1%
      nciShareIncome: 45.3,     // 13.9%
      totalAssetsCY: 6000.0,
      totalLiabilitiesCY: 2940.0,
      totalEquityCY: 3060.0,
      consolidatedDER: 0.96,
      consolidatedROA: 5.4,
      pojkDerCeiling: 5.0,
      industryRoaBenchMin: 3.5,
      industryRoaBenchMax: 5.2
    },
    forensicAnomalies: [
      {
        id: "CONS-01",
        title: "NCI Profit Allocation Disparity — Subsidiary II",
        severity: "CRITICAL",
        status: "Needs Management Clarification",
        metric: "Dilaporkan .4M vs Terhitung .2M (Selisih +34,1%)\ = Disparitas > 8% batas toleransi IFRS 10",
        auditImpact: "Potensi distorsi laba yang diatribusikan ke induk yayasan; risiko kebocoran dividen atau alokasi terselubung ke pemegang saham minoritas."
      },
      {
        id: "CONS-02",
        title: "Related-Party Receivable Surge — Subsidiary II",
        severity: "CRITICAL",
        status: "Audit Finding (Requires Revision)",
        metric: "Piutang Pihak Berelasi melonjak +158,8% YoY (M → M) saat Pertumbuhan Omzet hanya +4,9%",
        auditImpact: "Eskalasi pinjaman internal tanpa underlying transaksi wajar (IAS 24 / PSAK 7); risiko pengalihan modal anak usaha."
      },
      {
        id: "CONS-03",
        title: "Earnings Quality Divergence — Subsidiary III",
        severity: "MEDIUM",
        status: "Under Auditor Inquiry",
        metric: "Pendapatan naik +3,0% YoY namun Laba Bersih anjlok -6,1% YoY",
        auditImpact: "Kompresi margin operasional akibat lonjakan beban administrasi yang belum terverifikasi."
      },
      {
        id: "CONS-04",
        title: "Net Margin Expansion Shift — Subsidiary IV",
        severity: "MODERATE",
        status: "Justified / Approved",
        metric: "Margin laba melompat dari 7,2% menjadi 10,8% (+3,6 pp)\ = Melampaui ambang distorsi 3,5 pp",
        auditImpact: "Verifikasi apakah ekspansi margin bersifat organik atau ditopang pendapatan luar biasa (one-off capital gain)."
      }
    ]
  }
};
/**
 * Solanascope & YKPP Financial Intelligence Platform - Client Application
 */

// Application State
const state = {
  currentRole: "reviewer", // 'reviewer' | 'configurator'
  activeTab: "agenda",
  geminiApiKey: localStorage.getItem("ykpp_gemini_key") || "",
  currentInvestasiId: "investasi-daaz",
  data: {
    pengendali: null,
    nonPengendali: null,
    investasi: null,
    konsolidasi: null,
    reconciliations: null,
    auditLogs: null,
    parameters: null
  }
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  if (state.geminiApiKey) {
    const input = document.getElementById("geminiApiKeyInput");
    if (input) input.value = state.geminiApiKey;
  }
  loadInitialData();
});

async function loadInitialData() {
  try {
    await Promise.all([
      loadPengendali(),
      loadNonPengendali(),
      loadInvestasi(state.currentInvestasiId),
      loadKonsolidasi(),
      loadReconciliations(),
      loadAuditLogs(),
      loadParameters()
    ]);
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

// Tab Switching
window.switchTab = function(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick").includes(`'${tabId}'`));
  });
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  const targetPane = document.getElementById(`pane-${tabId}`);
  if (targetPane) targetPane.classList.add("active");
};

// Role Switching (Action Item 7)
window.handleRoleChange = function(role) {
  state.currentRole = role;
  const notice = document.getElementById("paramEditNotice");
  if (notice) {
    notice.innerText = role === "configurator"
      ? "✏️ Mode Penyusun Parameter Aktif: Anda dapat mengubah batas threshold dan formula."
      : "* Mode Reviewer Aktif: Anda fokus memvalidasi temuan audit dan menandatangani Nota Dinas.";
  }
  // Re-render parameter tab if currently viewed
  if (state.activeTab === "parameter") {
    renderParameters(state.data.parameters);
  }
};

// --- DATA LOADERS & RENDERERS ---

// 1. Entitas Pengendali
async function loadPengendali() {
  try {
    const res = await fetch("/api/analyze/pengendali", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.pengendali = d;
    renderPengendali(d);
  } catch (e) {
    console.warn("Using embedded fallback for pengendali:", e);
    const ent = EMBEDDED_SEED.pengendali[0];
    const d = {
      entity: ent,
      horizontalAnalysis: {
        revenue: { yoyPercent: 31.45, yoyNominal: 51.90, rtcPercent: 90.37, rtcStatus: { badge: "badge-yellow" } },
        opex: { yoyPercent: 32.91, yoyNominal: 51.64 },
        netProfit: { yoyPercent: 0.64, yoyNominal: 0.03, rtcPercent: 57.90, rtcStatus: { badge: "badge-red" } }
      }
    };
    state.data.pengendali = d;
    renderPengendali(d);
  }
}

function renderPengendali(d) {
  const container = document.getElementById("pengendali-content");
  if (!container || !d) return;

  const ent = d.entity;
  const f = ent.financials;
  const h = d.horizontalAnalysis;

  container.innerHTML = `
    <!-- Top Summary Cards -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Pertumbuhan Omzet YoY</span>
          <span class="badge ${h.revenue.yoyPercent >= 0 ? "badge-green" : "badge-red"}">${h.revenue.yoyPercent}%</span>
        </div>
        <div class="kpi-big">Rp${f.revenueCY} M</div>
        <p class="kpi-sub">Pembanding 2025: Rp${f.revenuePY} M | Pertumbuhan didorong bisnis Outsourcing (+41,7%)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Kenaikan Beban Usaha (Opex)</span>
          <span class="badge badge-red">+${h.opex.yoyPercent}%</span>
        </div>
        <div class="kpi-big">Rp${f.opexCY} M</div>
        <p class="kpi-sub">⚠️ Opex (+32,91%) tumbuh melampaui pendapatan (+31,45%) = Growth Gap</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Net Working Capital (NWC)</span>
          <span class="badge badge-red">Defisit Likuiditas</span>
        </div>
        <div class="kpi-big">-Rp40,49 M</div>
        <p class="kpi-sub">Aset Lancar: Rp${f.currentAssetsCY} M vs Liabilitas Lancar: Rp${f.currentLiabCY} M (Current Ratio 0,57x)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Laba Usaha & Margin</span>
          <span class="badge badge-yellow">3,85% Marjin</span>
        </div>
        <div class="kpi-big">Rp${f.operatingProfitCY} M</div>
        <p class="kpi-sub">Marjin operasi turun dari 4,90% (Agustus 2025) menjadi 3,85% (Agustus 2026)</p>
      </div>
    </div>

    <!-- Analisis Vertikal & Horizontal Table -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:12px;">Tabel Analisis Vertikal & Horizontal (Laba Rugi PT EPS)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Pos Akun</th>
              <th>Realisasi Ags 2026 (CY)</th>
              <th>Analisis Vertikal (% Omzet)</th>
              <th>Realisasi Ags 2025 (PY)</th>
              <th>YoY Nominal</th>
              <th>YoY %</th>
              <th>Target RKAP</th>
              <th>RTC (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Pendapatan Usaha</strong></td>
              <td class="num">Rp${f.revenueCY} M</td>
              <td class="num">100.00%</td>
              <td class="num">Rp${f.revenuePY} M</td>
              <td class="num">+Rp${h.revenue.yoyNominal} M</td>
              <td class="num"><span class="badge badge-green">+${h.revenue.yoyPercent}%</span></td>
              <td class="num">Rp${f.rkapTargetRevenue} M</td>
              <td class="num"><span class="badge ${h.revenue.rtcStatus ? h.revenue.rtcStatus.badge : "badge-green"}">${h.revenue.rtcPercent}%</span></td>
            </tr>
            <tr>
              <td>Beban Pokok Pendapatan</td>
              <td class="num">Rp${f.cogsCY} M</td>
              <td class="num">${((f.cogsCY/f.revenueCY)*100).toFixed(2)}%</td>
              <td class="num">Rp${f.cogsPY} M</td>
              <td class="num">+Rp${(f.cogsCY - f.cogsPY).toFixed(2)} M</td>
              <td class="num">+${(((f.cogsCY - f.cogsPY)/f.cogsPY)*100).toFixed(2)}%</td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td><strong>Laba Kotor</strong></td>
              <td class="num">Rp${f.grossProfitCY} M</td>
              <td class="num">${((f.grossProfitCY/f.revenueCY)*100).toFixed(2)}%</td>
              <td class="num">Rp${f.grossProfitPY} M</td>
              <td class="num">+Rp${(f.grossProfitCY - f.grossProfitPY).toFixed(2)} M</td>
              <td class="num">+${(((f.grossProfitCY - f.grossProfitPY)/f.grossProfitPY)*100).toFixed(2)}%</td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td>Beban Usaha / Operasional</td>
              <td class="num">Rp${f.opexCY} M</td>
              <td class="num">${((f.opexCY/f.revenueCY)*100).toFixed(2)}%</td>
              <td class="num">Rp${f.opexPY} M</td>
              <td class="num">+Rp${h.opex.yoyNominal} M</td>
              <td class="num"><span class="badge badge-red">+${h.opex.yoyPercent}%</span></td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td><strong>Laba Usaha (Operasional)</strong></td>
              <td class="num">Rp${f.operatingProfitCY} M</td>
              <td class="num">3.85%</td>
              <td class="num">Rp${f.operatingProfitPY} M</td>
              <td class="num">+Rp${(f.operatingProfitCY - f.operatingProfitPY).toFixed(2)} M</td>
              <td class="num">+3.13%</td>
              <td class="num">-</td>
              <td class="num">-</td>
            </tr>
            <tr>
              <td><strong>Laba Bersih Tahun Berjalan</strong></td>
              <td class="num">Rp${f.netProfitCY} M</td>
              <td class="num">2.80%</td>
              <td class="num">Rp${f.netProfitPY} M</td>
              <td class="num">+Rp${h.netProfit.yoyNominal} M</td>
              <td class="num">+0.64%</td>
              <td class="num">Rp${f.rkapTargetNetProfit} M</td>
              <td class="num"><span class="badge badge-yellow">${h.netProfit.rtcPercent}%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Review Workspace: 6 Temuan Forensik -->
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3>Review Workspace: 6 Temuan Verifikasi & Sinyal Forensik (S1 - S10)</h3>
        <span style="font-size:12px; color:var(--ink-secondary);">Klik tombol status untuk mengubah keputusan review</span>
      </div>

      <div class="findings-list">
        ${ent.findings.map(fnd => `
          <div class="finding-card ${fnd.severity.toLowerCase().includes("major") ? "critical" : "moderate"}">
            <div class="finding-header">
              <span class="finding-title">${fnd.title}</span>
              <div>
                <span class="badge ${fnd.severity.toLowerCase().includes("major") ? "badge-red" : "badge-yellow"}">${fnd.severity}</span>
                <span class="badge badge-blue">${fnd.signal}</span>
              </div>
            </div>
            <div class="finding-delta">
              <strong>Quantified Delta:</strong> ${fnd.delta}
            </div>
            <p style="font-size:12.5px; color:var(--ink); margin-bottom:6px;">
              <strong>Dampak Audit:</strong> ${fnd.impact}
            </p>
            <p style="font-size:12px; color:var(--ink-secondary);">
              <strong>Dokumen / Kebutuhan Pembuktian:</strong> ${fnd.schedule}
            </p>
            <div class="finding-actions">
              <span style="font-size:11.5px; font-weight:600; color:var(--ink-muted);">Keputusan Verifikator:</span>
              <button class="btn btn-sm ${fnd.action.includes("Clarify") ? "btn-primary" : "btn-secondary"}" onclick="window.updateFindingStatus('${fnd.id}', 'Clarify')">Clarify</button>
              <button class="btn btn-sm ${fnd.action.includes("Audit Finding") ? "btn-primary" : "btn-secondary"}" onclick="window.updateFindingStatus('${fnd.id}', 'Audit Finding')">Audit Finding</button>
              <button class="btn btn-sm ${fnd.action.includes("Approved") ? "btn-primary" : "btn-secondary"}" onclick="window.updateFindingStatus('${fnd.id}', 'Approved')">Approved</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// 2. Entitas Non-Pengendali
async function loadNonPengendali() {
  try {
    const res = await fetch("/api/analyze/non-pengendali", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.nonPengendali = d;
    renderNonPengendali(d);
  } catch (e) {
    console.warn("Using embedded fallback for non-pengendali:", e);
    const ent = EMBEDDED_SEED.nonPengendali[0];
    const d = {
      entity: ent,
      tiering: ent.tiering
    };
    state.data.nonPengendali = d;
    renderNonPengendali(d);
  }
}

function renderNonPengendali(d) {
  const container = document.getElementById("nonpengendali-content");
  if (!container || !d) return;

  const ent = d.entity;
  const f = ent.financials;
  const t = d.tiering;

  container.innerHTML = `
    <!-- Top KPI Cards -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Piutang Pihak Ketiga vs RKAP</span>
          <span class="badge badge-red">RTC 301,20%</span>
        </div>
        <div class="kpi-big">Rp${f.tradeReceivablesCY} M</div>
        <p class="kpi-sub">Target RKAP: Rp${f.targetReceivablesRKAP} M (Lonjakan >3x lipat, mengunci arus kas modal kerja)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Utang Dividen Belum Dibayar</span>
          <span class="badge badge-red">Kewajiban Dividen</span>
        </div>
        <div class="kpi-big">Rp${f.dividendPayableCY} M</div>
        <p class="kpi-sub">Tercatat di Liabilitas Lancar; YKPP berhak atas pembagian dividen tunai proporsional</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Net Working Capital Defisit</span>
          <span class="badge badge-red">CR 0,52x</span>
        </div>
        <div class="kpi-big">-Rp347,18 M</div>
        <p class="kpi-sub">Aset Lancar: Rp${f.currentAssetsCY} M vs Liabilitas Lancar: Rp${f.currentLiabCY} M</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Arus Kas Operasi (CFO Conversion)</span>
          <span class="badge badge-green">1,50x Laba</span>
        </div>
        <div class="kpi-big">Rp${f.cfoCashFlow} M</div>
        <p class="kpi-sub">Pertumbuhan omzet +42,4% YoY (Rp1.512 M) & laba +44,8% (Rp87,65 M)</p>
      </div>
    </div>

    <!-- Matriks Tingkat Perhatian: Merah / Kuning / Hijau -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:14px;">Matriks Monitoring Pemegang Saham Minoritas (YKPP 1% Saham)</h3>
      
      <!-- KELOMPOK MERAH -->
      <div style="margin-bottom:18px;">
        <h4 style="color:var(--red); display:flex; align-items:center; gap:6px; margin-bottom:8px;">
          🔴 Tingkat Perhatian MERAH — Area Kritis & Memerlukan Klarifikasi RUPS/Direksi
        </h4>
        <div class="findings-list">
          ${t.merah.map(m => `
            <div class="finding-card critical">
              <div class="finding-header">
                <span class="finding-title">${m.title}</span>
                <span class="badge badge-red">MERAH</span>
              </div>
              <div class="finding-delta">${m.metric}</div>
              <p style="font-size:12.5px; margin-bottom:8px;">${m.desc}</p>
              <div style="background:var(--forest-soft); padding:10px; border-radius:var(--radius-sm); border-left:3px solid var(--forest);">
                <strong style="color:var(--forest-deep);">Pertanyaan Kritis YKPP:</strong>
                <p style="font-size:12px; margin-top:3px; color:var(--ink);">${m.pertanyaanKritis}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- KELOMPOK KUNING -->
      <div style="margin-bottom:18px;">
        <h4 style="color:var(--gold); display:flex; align-items:center; gap:6px; margin-bottom:8px;">
          🟡 Tingkat Perhatian KUNING — Pemantauan Berkala (Monitoring Zone)
        </h4>
        <div class="findings-list">
          ${t.kuning.map(k => `
            <div class="finding-card">
              <div class="finding-header">
                <span class="finding-title">${k.title}</span>
                <span class="badge badge-yellow">KUNING</span>
              </div>
              <div class="finding-delta">${k.metric}</div>
              <p style="font-size:12.5px; margin-bottom:8px;">${k.desc}</p>
              <div style="background:var(--surface-alt); padding:10px; border-radius:var(--radius-sm); border-left:3px solid var(--gold);">
                <strong style="color:var(--gold);">Pertanyaan Kritis:</strong>
                <p style="font-size:12px; margin-top:3px;">${k.pertanyaanKritis}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- KELOMPOK HIJAU -->
      <div>
        <h4 style="color:var(--green); display:flex; align-items:center; gap:6px; margin-bottom:8px;">
          🟢 Tingkat Perhatian HIJAU — Kinerja Positif yang Memenuhi Target
        </h4>
        <div class="findings-list">
          ${t.hijau.map(h => `
            <div class="finding-card" style="border-left-color:var(--green);">
              <div class="finding-header">
                <span class="finding-title">${h.title}</span>
                <span class="badge badge-green">HIJAU</span>
              </div>
              <div class="finding-delta">${h.metric}</div>
              <p style="font-size:12.5px;">${h.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

// 3. Investasi Portofolio
window.loadInvestasi = async function(invId) {
  state.currentInvestasiId = invId;
  try {
    const res = await fetch("/api/analyze/investasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: invId, userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.investasi = d;
    renderInvestasi(d);
  } catch (e) {
    console.warn("Using embedded fallback for investasi:", e);
    const ent = EMBEDDED_SEED.investasi.find(i => i.id === invId) || EMBEDDED_SEED.investasi[0];
    const d = {
      entity: ent,
      comprehensiveRatios: ent.ratiosComputed,
      modifiedZScore: { score: ent.ratiosComputed.modifiedZ, tier: "Hijau", assessment: "Aman (Kemungkinan Gagal Bayar Rendah)" },
      altmanZScore: { score: ent.ratiosComputed.altmanZ, tier: "Hijau", label: "Kemungkinan Gagal Bayar Rendah (Aman)" },
      riskOverlay: ent.riskOverlay || null
    };
    state.data.investasi = d;
    renderInvestasi(d);
  }
};

function renderInvestasi(d) {
  const container = document.getElementById("investasi-content");
  if (!container || !d) return;

  const ent = d.entity;
  const r = d.comprehensiveRatios;
  const mz = d.modifiedZScore;
  const az = d.altmanZScore;
  const ro = d.riskOverlay;

  container.innerHTML = `
    <!-- Top Scoring Cards -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Modified Z-Score (Anualisasi)</span>
          <span class="badge ${mz && mz.tier === "Hijau" ? "badge-green" : "badge-yellow"}">${mz ? mz.tier : "-"}</span>
        </div>
        <div class="kpi-big">${mz ? mz.score : "-"}</div>
        <p class="kpi-sub">${mz ? mz.assessment : "-"}</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Altman Z-Score</span>
          <span class="badge ${az && az.tier === "Hijau" ? "badge-green" : "badge-yellow"}">${az ? az.tier : "-"}</span>
        </div>
        <div class="kpi-big">${az ? az.score : "-"}</div>
        <p class="kpi-sub">${az ? az.label : "-"}</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Debt to Equity Ratio (DER)</span>
          <span class="badge badge-green">Di Bawah Batas POJK</span>
        </div>
        <div class="kpi-big">${r.der || ent.ratiosComputed.der}x</div>
        <p class="kpi-sub">Batas Regulasi Finansial / POJK: Max 5,0x (Aman)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Realisasi Penjualan vs RKAP (RTC)</span>
          <span class="badge badge-green">RTC 98,45%</span>
        </div>
        <div class="kpi-big">${ent.financials.revenueCY ? "Rp" + ent.financials.revenueCY + " M" : "-"}</div>
        <p class="kpi-sub">Realisasi Laba Bersih vs RKAP: RTC 82,48% (Zona Kuning)</p>
      </div>
    </div>

    <!-- Risk Overlay Alert jika ada -->
    ${ro ? `
      <div class="card" style="border-left: 4px solid var(--gold); background:var(--gold-soft); margin-bottom:20px;">
        <h3 style="color:var(--forest-deep); margin-bottom:6px;">⚠️ ${ro.eventTitle}</h3>
        <p style="font-size:13px; margin-bottom:8px;">
          <strong>Exposure Jaminan:</strong> Rp${ro.totalExposure} Triliun | 
          <strong>Asumsi Stress Loss:</strong> Rp${ro.assumedLoss} Triliun (Loss Severity ${ro.lossSeverity}%, Recovery Rate ${ro.recoveryRate}%) |
          <strong>Status:</strong> <span class="badge badge-yellow">${ro.assessment}</span>
        </p>
        <p style="font-size:12.5px; color:var(--ink-secondary); line-height:1.5;">${ro.rationale}</p>
      </div>
    ` : ""}

    <!-- Komparasi 4 Dimensi (Tahun Lalu, Bulan Lalu, YoY %, RTC %) -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:12px;">Tabel Komparasi 4 Dimensi (Sesuai Butir 3 Alur MOM)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Metrik Keuangan</th>
              <th>Realisasi Berjalan (CY)</th>
              <th>Bulan Lalu (MoM)</th>
              <th>Tahun Lalu (YoY Basis)</th>
              <th>Pertumbuhan YoY (%)</th>
              <th>Target RKAP (Cita-cita)</th>
              <th>RTC (%)</th>
              <th>Status Evaluasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Penjualan / Pendapatan</strong></td>
              <td class="num">Rp${ent.financials.revenueCY || 0} M</td>
              <td class="num">Rp${ent.financials.revenuePM || "-"} M</td>
              <td class="num">Rp${ent.financials.revenuePY || 0} M</td>
              <td class="num"><span class="badge badge-green">+11,33%</span></td>
              <td class="num">Rp${ent.financials.rkapTargetRevenue || 0} M</td>
              <td class="num">98.45%</td>
              <td><span class="badge badge-green">Tercapai (≥ 95%)</span></td>
            </tr>
            <tr>
              <td><strong>Laba Operasional</strong></td>
              <td class="num">Rp${ent.financials.operatingProfitCY || 0} M</td>
              <td class="num">-</td>
              <td class="num">Rp${ent.financials.operatingProfitPY || 0} M</td>
              <td class="num"><span class="badge badge-yellow">-7,06%</span></td>
              <td class="num">Rp${ent.financials.rkapTargetOpProfit || 0} M</td>
              <td class="num">88.57%</td>
              <td><span class="badge badge-yellow">Perhatian (80-94%)</span></td>
            </tr>
            <tr>
              <td><strong>Laba Bersih Tahun Berjalan</strong></td>
              <td class="num">Rp${ent.financials.netProfitCY || 0} M</td>
              <td class="num">Rp${ent.financials.netProfitPM || "-"} M</td>
              <td class="num">Rp${ent.financials.netProfitPY || 0} M</td>
              <td class="num"><span class="badge badge-red">-36,60%</span></td>
              <td class="num">Rp${ent.financials.rkapTargetNetProfit || 0} M</td>
              <td class="num">82.48%</td>
              <td><span class="badge badge-yellow">Perhatian (80-94%)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 33 Rasio Lengkap Tabulasi -->
    <div class="card">
      <h3 style="margin-bottom:12px;">33 Rasio Baku Skema Obligasi & Portofolio (Kajian Ihsan)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Kelompok Rasio</th>
              <th>Nama Metrik</th>
              <th>Nilai Terhitung</th>
              <th>Batas Covenant / Benchmark</th>
              <th>Keterangan Evaluasi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Likuiditas</td>
              <td>Current Ratio</td>
              <td class="num">${ent.ratiosComputed.currentRatio}x</td>
              <td>Min 1,25x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Likuiditas</td>
              <td>Quick Ratio</td>
              <td class="num">${ent.ratiosComputed.quickRatio}x</td>
              <td>Min 0,80x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Solvabilitas</td>
              <td>Debt to Equity Ratio (DER)</td>
              <td class="num">${ent.ratiosComputed.der}x</td>
              <td>Max 5,0x (POJK)</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Solvabilitas</td>
              <td>Debt Ratio</td>
              <td class="num">${ent.ratiosComputed.debtRatio}%</td>
              <td>Max 70,0%</td>
              <td><span class="badge badge-yellow">Mendekati Batas</span></td>
            </tr>
            <tr>
              <td>Solvabilitas</td>
              <td>Net Gearing Ratio</td>
              <td class="num">${ent.ratiosComputed.netGearing}x</td>
              <td>Max 1,0x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Gross Profit Margin</td>
              <td class="num">${ent.ratiosComputed.gpm}%</td>
              <td>Min 5,0%</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Operating Profit Margin</td>
              <td class="num">${ent.ratiosComputed.opm}%</td>
              <td>Min 4,0%</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Return on Assets (ROA) Anualisasi</td>
              <td class="num">${ent.ratiosComputed.roa}%</td>
              <td>Peer: 3,5% - 5,2%</td>
              <td><span class="badge badge-green">In-Range Peer</span></td>
            </tr>
            <tr>
              <td>Profitabilitas</td>
              <td>Return on Equity (ROE) Anualisasi</td>
              <td class="num">${ent.ratiosComputed.roe}%</td>
              <td>Min 8,0%</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
            <tr>
              <td>Coverage</td>
              <td>Interest Coverage Ratio</td>
              <td class="num">${ent.ratiosComputed.interestCoverage}x</td>
              <td>Min 3,0x</td>
              <td><span class="badge badge-yellow">Sedikit Di Bawah 3x</span></td>
            </tr>
            <tr>
              <td>Coverage</td>
              <td>Debt Service Coverage (DSCR)</td>
              <td class="num">${ent.ratiosComputed.dscr}x</td>
              <td>Min 1,30x</td>
              <td><span class="badge badge-green">Aman</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. Konsolidasi Akhir
async function loadKonsolidasi() {
  try {
    const res = await fetch("/api/analyze/konsolidasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userRole: state.currentRole })
    });
    const d = await res.json();
    state.data.konsolidasi = d;
    renderKonsolidasi(d);
  } catch (e) {
    console.warn("Using embedded fallback for konsolidasi:", e);
    const d = {
      title: EMBEDDED_SEED.konsolidasi.title,
      entities: EMBEDDED_SEED.konsolidasi.entities,
      consolidatedTotals: EMBEDDED_SEED.konsolidasi.consolidatedTotals,
      anomalies: EMBEDDED_SEED.konsolidasi.forensicAnomalies,
      nciBreakdown: [
        { name: "Subsidiary II (35% NCI)", nciPercent: 35, netIncome: 52, computedNciShare: 18.2, reportedNci: 24.4, disparityPercent: 34.1 }
      ]
    };
    state.data.konsolidasi = d;
    renderKonsolidasi(d);
  }
}

function renderKonsolidasi(d) {
  const container = document.getElementById("konsolidasi-content");
  if (!container || !d) return;

  const tot = d.consolidatedTotals;

  container.innerHTML = `
    <!-- Top Consolidated KPIs -->
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Pendapatan Konsol Bersih</span>
          <span class="badge badge-green">+6,9% YoY</span>
        </div>
        <div class="kpi-big">$${tot.revenueCY} M</div>
        <p class="kpi-sub">Setelah eliminasi omzet antar-entitas $390 M (Gross: $${tot.revenueCY + 390} M)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Laba Bersih Konsolidasi</span>
          <span class="badge badge-green">+${tot.growthNetIncomeYoY}% YoY</span>
        </div>
        <div class="kpi-big">$${tot.netIncomeCY} M</div>
        <p class="kpi-sub">Induk: $${tot.parentAttributableIncome} M (${tot.parentSharePercent}%) | NCI: $${tot.totalNciProfit} M (${tot.nciSharePercent}%)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Solvabilitas Grup (DER)</span>
          <span class="badge badge-green">${tot.derStatus}</span>
        </div>
        <div class="kpi-big">${tot.consolidatedDER}x</div>
        <p class="kpi-sub">Total Liabilitas $${tot.totalLiabilitiesCY} M vs Ekuitas $${tot.totalEquityCY} M (Plafon POJK 5,0x)</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Profitabilitas Aset (ROA)</span>
          <span class="badge badge-green">${tot.roaStatus}</span>
        </div>
        <div class="kpi-big">${tot.consolidatedROA}%</div>
        <p class="kpi-sub">Rata-rata Industri: 3,5% - 5,2% | Kinerja grup di kuartil teratas</p>
      </div>
    </div>

    <!-- Review Workspace 4 Anomali Forensik Konsolidasi -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:14px;">4 Temuan Anomali Forensik Konsolidasi (Review Workspace)</h3>
      <div class="findings-list">
        ${d.anomalies.map(anom => `
          <div class="finding-card ${anom.severity === "CRITICAL" ? "critical" : "moderate"}">
            <div class="finding-header">
              <span class="finding-title">${anom.title}</span>
              <div>
                <span class="badge ${anom.severity === "CRITICAL" ? "badge-red" : "badge-yellow"}">${anom.severity}</span>
                <span class="badge badge-blue">${anom.status}</span>
              </div>
            </div>
            <div class="finding-delta"><strong>Quantified Delta:</strong> ${anom.quantifiedDelta}</div>
            <p style="font-size:12.5px; color:var(--ink);"><strong>Dampak Kepatuhan Audit:</strong> ${anom.auditImpact}</p>
            <div class="finding-actions">
              <span style="font-size:11.5px; font-weight:600; color:var(--ink-muted);">Tindakan:</span>
              <button class="btn btn-sm btn-secondary" onclick="alert('Catatan klarifikasi dikirim ke entitas anak.')">Minta Klarifikasi Anak Usaha</button>
              <button class="btn btn-sm btn-primary" onclick="alert('Temuan dicatat dalam draf konsolidasi.')">Tandai Finding Audit</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Roster 6 Entitas Grup -->
    <div class="card">
      <h3 style="margin-bottom:12px;">Rincian Kontribusi Laba & NCI 6 Entitas Grup</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Entitas</th>
              <th>Peran</th>
              <th>Hak NCI (%)</th>
              <th>Pendapatan CY</th>
              <th>Laba Bersih CY</th>
              <th>Bagian Laba NCI Terhitung</th>
              <th>Bagian NCI Dilaporkan</th>
              <th>Disparitas NCI (%)</th>
            </tr>
          </thead>
          <tbody>
            ${d.entities.map(ent => {
              const nciRow = d.nciBreakdown.find(n => n.name === ent.name);
              return `
                <tr>
                  <td><strong>${ent.name}</strong></td>
                  <td>${ent.role.toUpperCase()}</td>
                  <td class="num">${ent.nciPercent}%</td>
                  <td class="num">$${ent.revCY} M</td>
                  <td class="num">$${ent.niCY} M</td>
                  <td class="num">${nciRow ? "$" + nciRow.computedNciShare + " M" : "-"}</td>
                  <td class="num">${ent.reportedNci ? "$" + ent.reportedNci + " M" : "-"}</td>
                  <td class="num">${nciRow && nciRow.disparityPercent ? `<span class="badge badge-red">+${nciRow.disparityPercent}%</span>` : "-"}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 5. Rekonsiliasi Selisih
async function loadReconciliations() {
  try {
    const res = await fetch("/api/reconciliations");
    const d = await res.json();
    state.data.reconciliations = d;
    renderReconciliations(d);
  } catch (e) {
    console.warn("Using embedded fallback for reconciliations:", e);
    const d = [
      { id: "REC-01", entity: "PT Daaz Bara Lestari Tbk", metric: "Modified Z-Score", sourceExcel: 0.33, sourceKajian: 2.54, sourceAI: 2.541, delta: "+2.21", rootCauseCategory: "Metodologi Anualisasi", rootCauseExplanation: "Excel mentah belum menerapkan pengali x2 anualisasi semester I. Kajian Ihsan menerapkan x2 sesuai formula baku.", reconciliationAction: "Gunakan 2,54 sebagai standar baku." },
      { id: "REC-02", entity: "PT Pesonna Optima Jasa", metric: "Pertumbuhan Omzet YoY", sourceExcel: "+42,40%", sourceKajian: "+28,15%", sourceAI: "+42,40% (Mismatch)", delta: "+14,25 pp", rootCauseCategory: "Period Mismatch", rootCauseExplanation: "Excel membandingkan YTD 8 bulan 2026 dengan YTD 7 bulan 2025. Kajian Ihsan mengidentifikasi pembanding setara adalah Juli-on-July.", reconciliationAction: "Gunakan pembanding setara di Nota Dinas." },
      { id: "REC-03", entity: "PT Era Permata Sejahtera", metric: "Hutang Pajak CALK vs Neraca", sourceExcel: "Rp4.499.425.447", sourceKajian: "Rp4.499.425.442", sourceAI: "Rp4.499.425.447", delta: "Rp5", rootCauseCategory: "Rounding / Footing", rootCauseExplanation: "Pembulatan pecahan desimal subsistem PPh di Note 12.", reconciliationAction: "Catat sebagai varians non-material." },
      { id: "REC-04", entity: "PT Era Permata Sejahtera", metric: "Beban Kantor Pusat Unallocated", sourceExcel: "Rp7,66 M", sourceKajian: "Rp6,57 M", sourceAI: "Rp1,09 M", delta: "Rp1,09 M", rootCauseCategory: "Alokasi Pembebanan", rootCauseExplanation: "Beban Rp7,66 M hanya dialokasi Rp6,57 M ke unit bisnis.", reconciliationAction: "Wajibkan cost driver 100% terserap." },
      { id: "REC-05", entity: "PT Pegadaian", metric: "Status Default Risk Sep 2026", sourceExcel: "GREEN (6,35)", sourceKajian: "YELLOW", sourceAI: "YELLOW (Risk Overlay)", delta: "Statis vs Stress Overlay", rootCauseCategory: "Risk Overlay & Kualitas Aset", rootCauseExplanation: "Excel hanya membaca neraca historis Juni. Kajian Ihsan menyertakan exposure agunan Rp20 T dengan stress loss Rp2 T.", reconciliationAction: "Tetapkan status resmi pada YELLOW - Enhanced Monitoring." }
    ];
    state.data.reconciliations = d;
    renderReconciliations(d);
  }
}

function renderReconciliations(items) {
  const container = document.getElementById("rekonsiliasi-content");
  if (!container || !items) return;

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Entitas</th>
              <th>Metrik / Pos</th>
              <th>Angka Excel</th>
              <th>Angka Kajian</th>
              <th>Angka AI Model</th>
              <th>Selisih (Delta)</th>
              <th>Kategori Akar Masalah</th>
              <th>Penjelasan Penyebab & Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(rec => `
              <tr>
                <td><strong>${rec.id}</strong></td>
                <td>${rec.entity}</td>
                <td><strong>${rec.metric}</strong></td>
                <td class="num">${rec.sourceExcel}</td>
                <td class="num">${rec.sourceKajian}</td>
                <td class="num">${rec.sourceAI}</td>
                <td><span class="badge badge-yellow">${rec.delta}</span></td>
                <td><span class="badge badge-blue">${rec.rootCauseCategory}</span></td>
                <td style="font-size:12px;">
                  <p><strong>Penyebab:</strong> ${rec.rootCauseExplanation}</p>
                  <p style="color:var(--forest); margin-top:4px;"><strong>Tindakan:</strong> ${rec.reconciliationAction}</p>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 6. Audit Logs & Sequencing
async function loadAuditLogs() {
  try {
    const res = await fetch("/api/logs");
    const d = await res.json();
    state.data.auditLogs = d;
    renderAuditLogs(d);
  } catch (e) {
    console.warn("Using embedded fallback for audit logs:", e);
    const d = {
      totalAnalysesRun: 15,
      currentSessionId: "SES-20261006-001",
      sessionCount: 3,
      analysesInCurrentSession: 5,
      history: [
        { id: "LOG-101", timestamp: "2026-10-06T08:15:20+07:00", sequencingStep: 1, entity: "PT Era Permata Sejahtera", functionType: "Pengendali", action: "Verifikasi Laporan Manajemen & Footing CALK", role: "Analis Keuangan (PIC)", outcome: "6 Temuan Terdeteksi (Defisit NWC -Rp40,49 M & Opex Gap)" },
        { id: "LOG-102", timestamp: "2026-10-06T08:45:10+07:00", sequencingStep: 2, entity: "PT Pesonna Optima Jasa", functionType: "Non-Pengendali", action: "Monitoring Investasi & Penentuan Tiering", role: "Analis Keuangan (PIC)", outcome: "Tier Merah: Likuiditas CR 0,52x, Piutang 301,2% RKAP, Utang Dividen Rp110,27 M" },
        { id: "LOG-103", timestamp: "2026-10-06T09:12:44+07:00", sequencingStep: 3, entity: "PT Daaz Bara Lestari Tbk", functionType: "Investasi", action: "Perhitungan 33 Rasio & Modified Z-Score", role: "Analis Keuangan (PIC)", outcome: "Modified Z-Score 2,54 (Aman) | RTC Omzet 98,45%" },
        { id: "LOG-104", timestamp: "2026-10-06T09:30:15+07:00", sequencingStep: 3, entity: "PT Pegadaian", functionType: "Investasi", action: "Stress Testing Risk Overlay September 2026", role: "Reviewer (Konsultan / Advisor)", outcome: "Status Yellow Enhanced Monitoring (Exposure Agunan Rp20 T, Stress Loss Rp2 T)" },
        { id: "LOG-105", timestamp: "2026-10-06T10:05:00+07:00", sequencingStep: 4, entity: "Konsolidasi Grup Yayasan (6 Entitas)", functionType: "Konsolidasi Akhir", action: "Agregasi, Eliminasi & NCI Disparity Check", role: "Reviewer (Konsultan / Advisor)", outcome: "DER 0,96x (POJK Safe) | Disparitas NCI Sub II +34,1% (Critical Flag)" }
      ]
    };
    state.data.auditLogs = d;
    renderAuditLogs(d);
  }
}

function renderAuditLogs(d) {
  const container = document.getElementById("auditlog-content");
  if (!container || !d) return;

  container.innerHTML = `
    <div class="dashboard-grid">
      <div class="card">
        <span class="card-title">Total Analisis Dijalankan</span>
        <div class="kpi-big">${d.totalAnalysesRun} Kali</div>
        <p class="kpi-sub">Kumulatif seluruh pipeline</p>
      </div>
      <div class="card">
        <span class="card-title">Sesi Aktif Saat Ini</span>
        <div class="kpi-big">${d.currentSessionId}</div>
        <p class="kpi-sub">Sesi ke-${d.sessionCount} hari ini</p>
      </div>
      <div class="card">
        <span class="card-title">Jumlah Analisis Sesi Ini</span>
        <div class="kpi-big">${d.analysesInCurrentSession} Analisis</div>
        <p class="kpi-sub">Pengendali, Non-Pengendali, Investasi, Konsolidasi</p>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <h3 style="margin-bottom:12px;">Riwayat Lengkap Aktivitas Audit & Urutan Proses (Sequencing Log)</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Langkah (Seq)</th>
              <th>Entitas</th>
              <th>Fungsi</th>
              <th>Aktivitas Analisis</th>
              <th>Peran / PIC</th>
              <th>Hasil / Status</th>
            </tr>
          </thead>
          <tbody>
            ${d.history.map(h => `
              <tr>
                <td class="num">${new Date(h.timestamp).toLocaleTimeString()}</td>
                <td class="num">Step ${h.sequencingStep}</td>
                <td><strong>${h.entity}</strong></td>
                <td>${h.functionType}</td>
                <td>${h.action}</td>
                <td>${h.role}</td>
                <td><span class="badge badge-green">${h.outcome}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. Parameter & Ambang Batas
async function loadParameters() {
  try {
    const res = await fetch("/api/parameters");
    const d = await res.json();
    state.data.parameters = d;
    renderParameters(d);
  } catch (e) {
    console.warn("Using embedded fallback for parameters:", e);
    state.data.parameters = EMBEDDED_MASTER;
    renderParameters(EMBEDDED_MASTER);
  }
}

function renderParameters(p) {
  const container = document.getElementById("parameter-content");
  if (!container || !p) return;

  const isConfig = state.currentRole === "configurator";

  container.innerHTML = `
    <!-- Modified Z-Score Formula Box -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:8px;">Model Modified Z-Score Anualisasi (Formula Baku)</h3>
      <div style="background:var(--surface-alt); padding:14px; border-radius:var(--radius-sm); font-family:'IBM Plex Mono', monospace; font-size:13.5px; border:1px solid var(--line-strong);">
        ${p.zScores.modifiedZ.formula}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-top:14px;">
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Konstanta:</div>
          <div class="num">${p.zScores.modifiedZ.weights.constant}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot WK_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.wk_ta}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot CASHPROF_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.cashprof_ta}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot SOLVR:</div>
          <div class="num">${p.zScores.modifiedZ.weights.solvr}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot OPPROF_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.opprof_ta}</div>
        </div>
        <div style="background:#FFF; padding:10px; border:1px solid var(--line); border-radius:4px;">
          <div style="font-weight:600; font-size:12px;">Bobot SALES_TA:</div>
          <div class="num">${p.zScores.modifiedZ.weights.sales_ta}</div>
        </div>
      </div>
    </div>

    <!-- Threshold Covenants & Regulasi -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-bottom:12px;">Plafon Covenants & Batas Regulasi Institusional</h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Indikator / Covenant</th>
              <th>Ambang Batas Baku</th>
              <th>Rujukan Dasar Hukum</th>
              <th>Aksi Jika Terlampaui</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Solvabilitas POJK (DER Konsolidasi)</strong></td>
              <td class="num"><strong>Maksimum 5,0x</strong></td>
              <td>Regulasi POJK Lembaga Finansial / Holding</td>
              <td>Peringatan Kepatuhan Regulasi Kritis</td>
            </tr>
            <tr>
              <td><strong>Disparitas Laba NCI</strong></td>
              <td class="num"><strong>Toleransi ≤ 8,0%</strong></td>
              <td>IFRS 10 / PSAK 65 (Laba Kepentingan Non-Pengendali)</td>
              <td>Status "Needs Management Clarification"</td>
            </tr>
            <tr>
              <td><strong>Akselerasi Piutang Pihak Berelasi</strong></td>
              <td class="num"><strong>ΔRP - ΔRev ≤ 30,0%</strong></td>
              <td>IAS 24 / PSAK 7 (Transaksi Pihak Berelasi)</td>
              <td>Status "Audit Finding (Requires Revision)"</td>
            </tr>
            <tr>
              <td><strong>Ambang Deviasi Piutang RKAP (RTC)</strong></td>
              <td class="num"><strong>Maksimum 120,0%</strong></td>
              <td>Kajian Ihsan & Rencana Kerja Anggaran YKPP</td>
              <td>Tiering Merah & Pertanyaan Kritis Manajemen</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- PIPELINE & ACTIONS ---

window.runFullDailyPipeline = async function() {
  alert("Memulai eksekusi terpadu Agenda Hari Ini (2 Pengendali, 1 Non-Pengendali, 2 Investasi, dan Konsolidasi Akhir)...");
  await loadPengendali();
  await loadNonPengendali();
  await loadInvestasi("investasi-daaz");
  await loadKonsolidasi();
  await loadAuditLogs();
  alert("✅ Seluruh alur analisis agenda hari ini berhasil dieksekusi lengkap dengan rekam jejak audit!");
};

window.runPengendaliAnalysis = () => loadPengendali();
window.runNonPengendaliAnalysis = () => loadNonPengendali();
window.runInvestasiAnalysis = () => loadInvestasi(state.currentInvestasiId);
window.runKonsolidasiAnalysis = () => loadKonsolidasi();
window.refreshAuditLogs = () => loadAuditLogs();

window.downloadExcelTemplate = function() {
  window.location.href = "/api/template-excel";
};

// Finding Status Updater
window.updateFindingStatus = async function(findingId, newStatus) {
  if (state.data.pengendali && state.data.pengendali.entity) {
    const f = state.data.pengendali.entity.findings.find(x => x.id === findingId);
    if (f) {
      f.action = newStatus;
      renderPengendali(state.data.pengendali);
      // Record audit action
      await fetch("/api/logs/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: state.data.pengendali.entity.name,
          functionType: "Review Status Update",
          action: `Keputusan temuan ${findingId} diubah menjadi: ${newStatus}`,
          role: state.currentRole === "reviewer" ? "Reviewer Hasil" : "Penyusun Parameter",
          outcome: "Tercatat",
          sequencingStep: 1
        })
      });
      loadAuditLogs();
    }
  }
};

// Export Nota Dinas
window.exportNotaDinas = function(entityName) {
  const modal = document.getElementById("memoModal");
  const title = document.getElementById("memoModalTitle");
  const body = document.getElementById("memoModalBody");

  if (!modal || !body) return;

  title.innerText = `NOTA DINAS HASIL VERIFIKASI — ${entityName.toUpperCase()}`;
  body.innerHTML = `
    <div style="text-align:center; margin-bottom:20px; border-bottom:2px solid #000; padding-bottom:10px;">
      <h2 style="margin:0; font-size:16px;">YAYASAN KESEJAHTERAAN PEGADAIAN PERMATA</h2>
      <h3 style="margin:4px 0 0; font-size:14px; font-weight:normal;">DIVISI KEUANGAN & SUBSIDIARY</h3>
      <p style="margin:2px 0 0; font-size:11px;">Jalan Kramat Raya No. 162, Jakarta Pusat 10430</p>
    </div>

    <table style="width:100%; margin-bottom:16px; font-size:13px; border-collapse:collapse;">
      <tr><td style="width:100px; padding:3px 0;"><strong>Nomor</strong></td><td>: ND-104/YKPP-DKS/X/2026</td></tr>
      <tr><td style="padding:3px 0;"><strong>Tanggal</strong></td><td>: 06 Oktober 2026</td></tr>
      <tr><td style="padding:3px 0;"><strong>Kepada Yth.</strong></td><td>: Pengurus YKPP</td></tr>
      <tr><td style="padding:3px 0;"><strong>Dari</strong></td><td>: Divisi Keuangan & Subsidiary</td></tr>
      <tr><td style="padding:3px 0;"><strong>Perihal</strong></td><td>: Hasil Verifikasi Laporan Keuangan ${entityName} Periode Agustus 2026</td></tr>
    </table>

    <div style="border-top:1px solid #ccc; padding-top:12px;">
      <p style="margin-bottom:12px;">
        Sehubungan dengan penyampaian Laporan Keuangan ${entityName} Periode Agustus 2026, bersama ini disampaikan hasil verifikasi atas perkembangan kinerja keuangan, posisi likuiditas, dan kepatuhan transaksi.
      </p>

      <p style="margin-bottom:12px; font-style:italic; background:#f9f9f9; padding:8px; border-left:3px solid #666;">
        <strong>Pernyataan Verifikator:</strong> Perlu ditegaskan bahwa hasil verifikasi dalam Nota Dinas ini bukan merupakan opini audit dan bukan penetapan bahwa suatu pencatatan telah salah. Divisi Keuangan & Subsidiary bertindak sebagai verifikator atas data dan dokumen yang disampaikan. Kebenaran data, underlying transaction, evidence, serta klasifikasi akun tetap menjadi tanggung jawab entitas penyusun.
      </p>

      <h4 style="margin:14px 0 6px;">I. Ringkasan Kinerja Keuangan & Analisis Pertumbuhan</h4>
      <p style="margin-bottom:10px;">
        Sampai dengan 31 Agustus 2026, pendapatan usaha tercatat sebesar Rp216,88 Miliar, tumbuh +31,45% YoY dibandingkan periode yang sama tahun 2025 (Rp164,98 Miliar). Namun demikian, beban usaha meningkat sebesar +32,91% menjadi Rp208,53 Miliar, mengakibatkan marjin operasi tertekan dari 4,90% menjadi 3,85%.
      </p>

      <h4 style="margin:14px 0 6px;">II. Analisis Posisi Keuangan dan Likuiditas</h4>
      <p style="margin-bottom:10px;">
        Aset lancar tercatat Rp52,63 Miliar berbanding kewajiban lancar Rp93,12 Miliar, menghasilkan indikasi <strong>Negative Net Working Capital sebesar -Rp40,49 Miliar</strong> dengan Current Ratio sekitar 0,57 kali. Struktur modal kerja ini memerlukan perhatian ketat dalam monitoring likuiditas.
      </p>

      <h4 style="margin:14px 0 6px;">III. Temuan Forensik & Permintaan Bukti (Audit Findings)</h4>
      <ol style="padding-left:20px; margin-bottom:14px;">
        <li><strong>Lonjakan Tunjangan Bonus Jasa Produksi:</strong> Realisasi sebesar Rp12,87 Miliar (2.308% terhadap RKAP tahunan Rp557,7 Juta). Memerlukan dokumen persetujuan Direksi/Pengurus.</li>
        <li><strong>Pergeseran Tarif Pajak Efektif:</strong> ETR berubah dari 22,0% menjadi 25,0% tanpa pengungkapan rekonsiliasi fiskal di CALK Note 24.</li>
        <li><strong>Saldo Abnormal Ekuitas:</strong> Akun Cadangan Tujuan bernilai negatif -Rp12,83 Miliar di neraca muka.</li>
      </ol>

      <div style="margin-top:24px; display:flex; justify-content:flex-end;">
        <div style="text-align:center; width:220px;">
          <p>Kepala Divisi Keuangan & Subsidiary,</p>
          <br><br><br>
          <p><strong>( ________________________ )</strong></p>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";
};

window.printMemo = function() {
  window.print();
};

// Modal helpers
window.openSettingsModal = () => document.getElementById("settingsModal").style.display = "flex";
window.openUploadModal = () => document.getElementById("uploadModal").style.display = "flex";
window.closeModal = (id) => document.getElementById(id).style.display = "none";

window.saveGeminiKey = function() {
  const key = document.getElementById("geminiApiKeyInput").value;
  state.geminiApiKey = key;
  localStorage.setItem("ykpp_gemini_key", key);
  window.closeModal("settingsModal");
  alert("Konfigurasi Google Gemini API Key berhasil disimpan!");
};

window.handleFileUpload = async function(files) {
  if (!files || files.length === 0) return;
  const f = files[0];
  alert(`Memproses unggahan ${f.name}...`);
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: f.name })
    });
    const d = await res.json();
    window.closeModal("uploadModal");
    alert(`✅ ${d.message}`);
    loadAuditLogs();
  } catch (e) {
    alert("Gagal memproses file: " + e.message);
  }
};

// --- COPILOT PANEL ---
window.toggleCopilot = function() {
  const p = document.getElementById("copilotPanel");
  p.classList.toggle("collapsed");
  const icon = document.getElementById("copilotToggleIcon");
  icon.innerText = p.classList.contains("collapsed") ? "▴" : "▾";
};

window.sendCopilotMessage = async function() {
  const input = document.getElementById("copilotInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chat = document.getElementById("copilotChat");

  // User Bubble
  const userDiv = document.createElement("div");
  userDiv.className = "chat-bubble user";
  userDiv.innerText = msg;
  chat.appendChild(userDiv);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  // Placeholder Agent Bubble
  const agentDiv = document.createElement("div");
  agentDiv.className = "chat-bubble agent";
  agentDiv.innerHTML = "<em>Memeriksa aturan PRD dan menganalisis laporan keuangan...</em>";
  chat.appendChild(agentDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/copilot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: msg,
        geminiApiKey: state.geminiApiKey,
        context: {
          activeTab: state.activeTab,
          role: state.currentRole
        }
      })
    });
    const data = await res.json();
    
    // Format markdown-like response
    let formatted = (data.answer || "")
      .replace(/### (.*?)\n/g, '<h4 style="margin:8px 0 4px; color:#1B4332;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");

    if (data.ragCitations && data.ragCitations.length > 0) {
      formatted += '<br><div style="margin-top:8px; border-top:1px dashed #CCC; padding-top:4px;">';
      data.ragCitations.forEach(c => {
        formatted += `<span class="citation-chip">📖 ${c.source} (${c.page})</span> `;
      });
      formatted += "</div>";
    }
    agentDiv.innerHTML = formatted;
    chat.scrollTop = chat.scrollHeight;
  } catch (e) {
    agentDiv.innerText = "Terjadi kesalahan saat memanggil AI Copilot: " + e.message;
  }
};
