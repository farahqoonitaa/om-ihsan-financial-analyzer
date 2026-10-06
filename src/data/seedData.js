/**
 * Seed Data & Benchmark Test Cases
 * Agenda Hari Ini: 2 Investasi, 2 Entitas Pengendali, 1 Non-Pengendali, dan Konsolidasi Akhir
 * Berdasarkan Data Riil PRD & Kajian Ihsan
 */

const SEED_DATA = {
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

if (typeof module !== "undefined" && module.exports) {
  module.exports = SEED_DATA;
}
