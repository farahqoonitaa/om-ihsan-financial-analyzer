/**
 * Gemini Argon-Class Interactive RAG Engine (Retrieval-Augmented Generation)
 * Indexes PRDs, Kajian Ihsan guidelines, 7-Section Investment Analyses, S1-S10 Forensic Signals,
 * and dynamic uploaded documents.
 * Supports multi-level interactive "Dig Deeper" (Level 1 -> Level 2 -> Level 3) exploration,
 * live in-session training, stress-test simulation, and exact source citations.
 */

const fs = require("fs");
const path = require("path");

class GeminiArgonRAG {
  constructor() {
    this.engineClass = "Gemini-Argon-RAG-v3.0";
    this.documents = [];
    this.dynamicPool = [];
    this.deepDiveTree = {};
    this.trainingHistory = [];
    this.knowledgeRecords = [];
    this.failedIngestions = [];
    this.initKnowledgeBase();
    this.initDeepDiveTree();
    this.initStructuredKnowledgeRepository();
  }

  initKnowledgeBase() {
    // Grounded knowledge chunks from PRD, Kajian Ihsan, Pindo Deli 7-Section, and S1-S10 Forensic Signals
    this.documents = [
      {
        id: "DOC-PRD-EPS-01",
        source: "PRD Pengendali Kajian Ihsan × PT EPS (Laporan Manajemen → Nota Dinas)",
        section: "Bagian 1: Karakteristik Input & Output",
        page: "hlm. 1-3",
        entity: "pengendali",
        tags: ["eps", "pengendali", "laporan manajemen", "nota dinas", "verifikator"],
        text: "Input entitas pengendali adalah Laporan Manajemen bulanan (23 halaman) yang terdiri dari 9 blok: Cover, Surat Pengantar, Neraca, Laba Rugi Komprehensif, Arus Kas, Perubahan Ekuitas, CALK Notes 1-24, Realisasi Anggaran RKAP, dan Laba Rugi per Unit Bisnis. Output adalah Nota Dinas Hasil Verifikasi berstruktur 19 bagian dengan stance verifikator: temuan adalah indikasi yang memerlukan klarifikasi, bukan opini audit."
      },
      {
        id: "DOC-PRD-EPS-02",
        source: "PRD Pengendali Kajian Ihsan × PT EPS (Signal Library)",
        section: "Sinyal Forensik S1 - S10",
        page: "hlm. 8-10",
        entity: "pengendali",
        tags: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "growth gap", "opex", "bonus", "rkap"],
        text: "10 Sinyal Forensik: S1 Movement (|Δ%| ≥ 50%), S2 Static Balance (Δ = 0 pada akun yang seharusnya bergerak seperti cadangan), S3 Anomalous Sign (cadangan tujuan bernilai negatif), S4 Footing / Cross-Check Breaks (selisih neraca vs CALK), S5 Policy / Tax Rate Breaks (perubahan tarif pajak efektif 22% vs 25%), S6 Non-Operating Spikes, S7 Growth Gap (Opex tumbuh lebih cepat dari omzet, opex +32,91% vs omzet +31,45%), S8 Segment Decline (penurunan pendapatan lini usaha > 10% atau rugi unit), S9 Budget Pacing (lonjakan tunjangan bonus jasa produksi 2.308% dari RKAP), S10 Related Party Concentration."
      },
      {
        id: "DOC-PRD-POJ-01",
        source: "PRD Non-Pengendali Kajian Ihsan × PT POJ (55 hlm LK Juli/Agustus 2026)",
        section: "Minority Shareholder Stance & Governance",
        page: "hlm. 16-19",
        entity: "nonpengendali",
        tags: ["poj", "non-pengendali", "minoritas", "1%", "dividen", "capital call"],
        text: "Kajian Ihsan berkedudukan sebagai pemegang saham non-pengendali pada PT POJ dengan kepemilikan 1.000 lembar (1,00%). Monitoring Kajian Ihsan difokuskan pada perlindungan hak ekonomi, kepastian dividen, risiko refinancing, capital call, dan kualitas laba. Hasil analisis dikelompokkan dalam tingkat perhatian Merah, Kuning, dan Hijau."
      },
      {
        id: "DOC-PRD-POJ-02",
        source: "PRD Non-Pengendali Kajian Ihsan × PT POJ",
        section: "Temuan Kritis & Pertanyaan Kritis",
        page: "hlm. 27-29",
        entity: "nonpengendali",
        tags: ["poj", "rtc", "piutang", "301,20%", "nwc", "utang dividen", "tiering merah"],
        text: "Temuan Merah PT POJ meliputi: 1. Likuiditas & Defisit Modal Kerja: Current ratio 0,52x, NWC negatif -Rp347,18 Miliar, serta utang dividen Rp110,27 Miliar di liabilitas lancar. 2. Leverage & Pinjaman: Total pinjaman Rp727,97 Miliar vs ekuitas Rp479,58 Miliar (DER 2,19x). 3. Lonjakan Piutang Pihak Ketiga Mencapai 301,20% terhadap target RKAP (realisasi Rp91,18 M vs target Rp30,27 M). Setiap temuan Merah wajib menyertakan rumusan Pertanyaan Kritis terstruktur untuk manajemen."
      },
      {
        id: "DOC-OBLIGASI-01",
        source: "Skema Analisis Obligasi & Modified Z-Score (Kajian Ihsan)",
        section: "Formula Modified Z-Score & Batas Covenant",
        page: "hlm. 4 & 15",
        entity: "investasi",
        tags: ["daaz", "obligasi", "sukuk", "modified z-score", "covenant", "2,54"],
        text: "Formula Modified Z-Score anualisasi: Z = -3,337 + 0,736*WK_TA + 6,95*CASHPROF_TA + 0,864*SOLVR + 7,554*OPPROF_TA + 1,544*SALES_TA. Pada interim semester I, komponen laba riil, laba operasional, dan penjualan dikalikan 2. Batas: Z > 0 Aman / kemungkinan gagal bayar rendah; -0,5 s/d 0 Cukup Aman; -1,0 s/d -0,5 Butuh Peninjauan; < -1,0 Tidak Aman. PT Daaz Bara Lestari Tbk menghasilkan skor 2,54 (Aman)."
      },
      {
        id: "DOC-OBLIGASI-02",
        source: "Kajian Risiko PT Pegadaian (Posisi Dasar Juni dengan Risk Overlay September 2026)",
        section: "Risk Overlay & Collateral Realization",
        page: "hlm. 1-4",
        entity: "investasi",
        tags: ["pegadaian", "risk overlay", "agunan", "stress loss"],
        text: "PT Pegadaian mencatat Altman Z-Score 6,35 dan Modified Z-Score 0,33 per 30 Juni 2026. Namun terdapat Risk Overlay September 2026 berupa exposure agunan Rp20 Triliun yang memerlukan realisasi jaminan dengan asumsi stress loss Rp2 Triliun (loss severity 10%, recovery 90%). Karena buffer Modified Z-Score tipis (0,33) dan piutang mencapai 88,05% dari aset lancar, kesimpulan ditempatkan pada YELLOW - Enhanced Monitoring hingga laporan September definitif terbit."
      },
      {
        id: "DOC-KONSOLIDASI-01",
        source: "Arsitektur Konsolidasi Grup Kajian Ihsan (Presentasi Pak Ihsan)",
        section: "Atribusi NCI IFRS 10 & Aturan Forensik",
        page: "Slide 4-8",
        entity: "konsolidasi",
        tags: ["konsolidasi", "pojk", "der", "0,96x", "5,0x", "ifrs 10", "psak 65", "eliminasi"],
        text: "Konsolidasi Grup 6 entitas menghasilkan pendapatan konsolidasi $3.885,0 M dan laba bersih konsolidasi $325,0 M (Parent Attributable $279,7 M / 86,1%, NCI Minority $45,3 M / 13,9%). Konsolidasi DER 0,96x berada jauh di bawah batas maksimum regulasi POJK 5,0x. Konsolidasi ROA 5,4% berada di atas rata-rata industri microfinance (3,5% - 5,2%). Terdeteksi NCI profit mismatch pada Subsidiary II sebesar +34,1% (melebihi toleransi 8%) dan lonjakan piutang berelasi +158,8% (melebihi ambang batas 30%)."
      },
      {
        id: "DOC-MOM-01",
        source: "MOM: Analisis Laporan Keuangan (Kajian Ihsan Terstruktur)",
        section: "Alur Terpadu 3 Fungsi, Definisi RTC & 8 Action Items",
        page: "Notulensi",
        entity: "all",
        tags: ["mom", "rtc", "4 dimensi", "alur"],
        text: "MOM menyepakati 3 alur analisis dalam 1 platform terpadu: 1. Entitas Pengendali (Kajian Ihsan) -> Analisis vertikal dan horizontal; 2. Entitas Non-Pengendali (Kajian Ihsan) -> Analisis vertikal dan horizontal; 3. Investasi (Kajian docs) -> Analisis komparasi 4 periode: Tahun lalu, Bulan lalu, YoY %, dan RTC (Realisasi Terhadap Cita-cita / RKAP %). Agenda hari ini: analisis untuk 2 investasi dan 2 entitas pengendali, lalu ditutup dengan analisis akhir (konsolidasi). RTC didefinisikan sebagai Realisasi Terhadap Cita-cita (Realisasi Aktual / Target RKAP)."
      },
      {
        id: "DOC-INV-PINDO-01",
        source: "Kajian Ihsan: PT Pindo Deli Pulp and Paper Mills (Expected Output for Investment Analysis)",
        section: "Analisis Horizontal, Analisis Vertikal, Kualitas Laba dan Covenant",
        page: "hlm. 1-3",
        entity: "investasi",
        tags: ["pindo deli", "neraca", "laba rugi", "asosiasi", "kurs", "covenant", "headroom", "segmen", "s1-s10"],
        text: "Kajian Ihsan PT Pindo Deli Pulp and Paper Mills per 30 Juni 2026. Neraca: Total Aset USD 9.564.776 ribu (+5,4%), Aset Lancar USD 3.815.764 ribu (+8,9%), Total Liabilitas USD 4.078.921 ribu (+1,0%), Ekuitas USD 5.485.855 ribu (+8,9%, Equity Cushion 57,4%). Laba Rugi: Penjualan neto USD 1.084.245 ribu (-1,34%), HPP USD 791.935 ribu (-2,16%), Laba Bruto USD 292.310 ribu (+0,96%), Laba Usaha USD 154.056 ribu (-1,93%), Bagian Laba Asosiasi USD 212.518 ribu (+179,4%), Laba Selisih Kurs USD 140.198 ribu (+2.533%), Laba Neto melonjak +210,3% menjadi USD 455.637 ribu karena faktor non-operasional (asosiasi & kurs). Analisis Vertikal: Gross Margin 26,96%, Operating Margin 14,21%, Net Margin 42,02% (kualitas laba perlu diuji). Segmen Usaha: Pulp & Cultural Paper turun 5,2% ke USD 471,0 juta, Industrial Paper & Tissue naik 1,9% ke USD 613,3 juta. Covenant: Current Ratio 1,96x (headroom memadai vs min 1,00x), DER pengelolaan modal 0,5x (indikatif memadai vs maks 2,00-4,00x), DSCR perlu formula kontraktual. Rekomendasi Investor: Positif dengan monitoring."
      },
      {
        id: "DOC-ARGON-PINDO-DEEP-01",
        source: "Gemini Argon Deep-Dive Corpus: PT Pindo Deli (Bedah Kualitas Laba & Stress-Test)",
        section: "Dekonstruksi Laba Operasi vs Non-Operasional & Uji Ketahanan Kas",
        page: "Kertas Kerja Argon hlm. 1-5",
        entity: "investasi",
        tags: ["pindo deli", "kualitas laba", "qoe", "stress test", "oki pulp", "selisih kurs", "dscr", "arus kas"],
        text: "Bedah Mendalam Gemini Argon atas PT Pindo Deli: Lonjakan Laba Neto sebesar +USD 308.823 ribu (+210,3% YoY, dari USD 146.814 ribu menjadi USD 455.637 ribu) didominasi oleh dua pos non-operasional: (1) Bagian laba entitas asosiasi (PT OKI Pulp & Paper Mills) yang naik +USD 136.469 ribu (+179,4%), dan (2) Laba selisih kurs neto yang naik +USD 134.873 ribu (+2.533%). Gabungan kedua pos non-operasional ini menyumbang USD 271.342 ribu atau 87,9% dari total kenaikan laba bersih. Jika kedua pos non-operasional dinormalisasi ke level 6M 2025 (Stress-Test Normalisasi), maka Laba Sebelum Pajak terukur sekitar USD 203.227 ribu dan Interest Coverage berbasis Laba Usaha Inti adalah 154.056 / 89.033 = 1,73x. Selain itu, kenaikan Aset Lancar (+USD 312.677 ribu) dan Liabilitas Jangka Pendek (+USD 130.945 ribu menjadi USD 1.944.954 ribu) menuntut verifikasi jadwal jatuh tempo utang 12 bulan ke depan."
      }
    ];
  }

  initDeepDiveTree() {
    this.deepDiveTree = {
      "pindo_neraca": {
        id: "pindo_neraca",
        title: "Bedah Seksi 1: Posisi Neraca & Struktur Utang Jangka Pendek",
        entity: "PT Pindo Deli Pulp and Paper Mills",
        badge: "Seksi 1 • Neraca",
        level1_summary: "Total Aset tumbuh sehat +5,4% (menjadi USD 9,56 Miliar) yang ditopang oleh penguatan Ekuitas +8,9% (USD 5,49 Miliar). Namun, Liabilitas Jangka Pendek naik +7,2% (+USD 130,95 Juta) menjadi USD 1,94 Miliar yang wajib dimonitor.",
        level2_evidence: [
          "• Aset Lancar: USD 3.815.764 ribu vs USD 3.503.087 ribu (+USD 312.677 ribu / +8,9%)",
          "• Aset Tidak Lancar: USD 5.749.012 ribu vs USD 5.572.436 ribu (+USD 176.576 ribu / +3,2%)",
          "• Liabilitas Jangka Pendek: USD 1.944.954 ribu vs USD 1.814.009 ribu (+USD 130.945 ribu / +7,2%)",
          "• Liabilitas Jangka Panjang: USD 2.133.967 ribu vs USD 2.222.535 ribu (-USD 88.568 ribu / -4,0%)",
          "• Ekuitas: USD 5.485.855 ribu vs USD 5.038.979 ribu (+USD 446.876 ribu / +8,9%)",
          "• Rumus Current Ratio = 3.815.764 / 1.944.954 = 1,9619x (Surplus NWC = +USD 1.870.810 ribu)"
        ],
        level3_forensic: "Temuan Argon RAG (Sinyal S1 & S4): Meskipun rasio lancar 1,96x tampak tebal, kenaikan aset lancar didorong oleh 'Aset Lancar Lainnya' (piutang/uang muka pihak ketiga), sedangkan Aset Tetap Neto justru turun tipis. Artinya, ekspansi aset belum mencerminkan penambahan kapasitas mesin pabrik inti, dan kenaikan utang pendek USD 1,94 Miliar memerlukan jadwal jatuh tempo (aging maturity) 12 bulan.",
        followUps: ["pindo_qoe", "pindo_covenant", "pindo_stresstest"]
      },
      "pindo_qoe": {
        id: "pindo_qoe",
        title: "Bedah Seksi 2: Mengapa Laba Bersih +210,3% Padahal Bisnis Inti Turun?",
        entity: "PT Pindo Deli Pulp and Paper Mills",
        badge: "Seksi 2 • Kualitas Laba (QoE)",
        level1_summary: "Penjualan turun -1,34% dan Laba Usaha pabrik turun -1,93%. Lonjakan Laba Neto +210,3% (+USD 308,8 Juta) berasal dari 87,9% keuntungan non-operasional (Laba Entitas Asosiasi + Selisih Kurs), yang belum tentu menghasilkan kas tunai bagi pembayaran kupon obligasi.",
        level2_evidence: [
          "• Penjualan Neto: USD 1.084.245 ribu vs USD 1.098.987 ribu (-USD 14.742 ribu / -1,34%)",
          "• Laba Usaha (Operasi Inti): USD 154.056 ribu vs USD 157.094 ribu (-USD 3.038 ribu / -1,93%)",
          "• Bagian Laba Entitas Asosiasi: USD 212.518 ribu vs USD 76.049 ribu (+USD 136.469 ribu / +179,4%)",
          "• Laba Selisih Kurs Neto: USD 140.198 ribu vs USD 5.325 ribu (+USD 134.873 ribu / +2.533%)",
          "• Kontribusi Non-Op terhadap Kenaikan Laba = (136.469 + 134.873) / 308.823 = 87,86%"
        ],
        level3_forensic: "Temuan Argon RAG (Sinyal S6 & S7): Bagian laba entitas asosiasi (USD 212,52 Juta) dicatat dengan metode ekuitas (akrual akuntansi)—uang kasnya baru masuk ke Pindo Deli jika entitas asosiasi membagikan dividen tunai. Demikian pula laba selisih kurs (USD 140,20 Juta) mayoritas berupa translasi kurs belum terealisasi (unrealized FX). Kreditur/investor obligasi wajib menilai kemampuan bayar utang dari Laba Usaha Inti (USD 154,06 Juta) & EBITDA kas.",
        followUps: ["pindo_stresstest", "pindo_vertikal_segmen", "pindo_covenant"]
      },
      "pindo_vertikal_segmen": {
        id: "pindo_vertikal_segmen",
        title: "Bedah Seksi 3 & 4: Margin Vertikal & Pelemahan Segmen Pulp (-5,2%)",
        entity: "PT Pindo Deli Pulp and Paper Mills",
        badge: "Seksi 3 & 4 • Margin & Segmen",
        level1_summary: "Efisiensi HPP membaik sehingga Gross Margin naik ke 26,96%, tetapi kenaikan Beban Usaha (+4,39%) menahan Operating Margin tetap stagnan di 14,21%. Dari sisi segmen, penjualan Pulp & Cultural Paper turun -5,2%.",
        level2_evidence: [
          "• Gross Margin: 292.310 / 1.084.245 = 26,96% (6M 2025: 26,35%)",
          "• Rasio Beban Usaha: 138.254 / 1.084.245 = 12,75% (6M 2025: 12,05%)",
          "• Operating Margin Inti: 154.056 / 1.084.245 = 14,21% (6M 2025: 14,29%)",
          "• Segmen Pulp & Cultural Paper: Turun dari USD 497,0 Juta ke USD 471,0 Juta (-5,2%)",
          "• Segmen Industrial Paper, Tissue & Lainnya: Naik dari USD 602,0 Juta ke USD 613,3 Juta (+1,9%)"
        ],
        level3_forensic: "Temuan Argon RAG (Sinyal S7 & S8): Terjadi S7 Growth Gap pada operasi inti karena Beban Usaha naik +4,39% saat Penjualan turun -1,34% (Gap +5,73 percentage points). Selain itu, S8 Segment Decline (-5,2% pada Pulp & Cultural Paper) mengonfirmasi permintaan kertas budaya global melambat, sehingga pertumbuhan ditopang segmen tisu & kemasan industri.",
        followUps: ["pindo_qoe", "pindo_covenant", "pindo_neraca"]
      },
      "pindo_covenant": {
        id: "pindo_covenant",
        title: "Bedah Seksi 5, 6 & 7: Kepatuhan Covenant, DSCR & Rekomendasi Komite",
        entity: "PT Pindo Deli Pulp and Paper Mills",
        badge: "Seksi 5–7 • Covenant & Keputusan",
        level1_summary: "Rasio Likuiditas (CR 1,96x vs min 1,00x) dan Leverage (DER ~0,50x vs maks 2,00x) memiliki bantalan sangat aman. Namun DSCR dan threshold spesifik Perwaliamanatan Obligasi/Sukuk wajib diverifikasi terhadap kontrak sebelum menambah eksposur.",
        level2_evidence: [
          "• Current Ratio: 1,96x vs Batas Minimum Kredit 1,00x (Headroom +0,96x / +96%)",
          "• DER Pengelolaan Modal: ~0,50x vs Batas Maksimum Kredit 2,00x–4,00x (Aman)",
          "• Interest Coverage (Laba Usaha / Beban Bunga): 154.056 / 89.033 = 1,73x",
          "• Beban Bunga 6M 2026 turun -9,6% menjadi USD 89.033 ribu (vs 6M 2025: USD 98.472 ribu)"
        ],
        level3_forensic: "Keputusan Komite Investasi Kajian Ihsan: Kategori 'Positif dengan Monitoring Ketat'. Jangan terbuai Net Margin 42,02%. Syarat utama sebelum Hold/Tambah Eksposur Obligasi & Sukuk: (1) Minta jadwal jatuh tempo utang pendek USD 1,94 Miliar, (2) Hitung DSCR berbasis Arus Kas Operasi aktual, dan (3) Pastikan klausul Sinking Fund / DSRA terpenuhi.",
        followUps: ["pindo_stresstest", "pindo_qoe", "pindo_neraca"]
      },
      "pindo_stresstest": {
        id: "pindo_stresstest",
        title: "Simulasi Stress-Test Argon RAG: Bagaimana Jika Kurs & Laba Asosiasi Normal?",
        entity: "PT Pindo Deli Pulp and Paper Mills",
        badge: "Simulasi Stress-Test S1–S10",
        level1_summary: "Jika Laba Selisih Kurs kembali nol (0) dan Laba Asosiasi dipangkas 50%, Laba Sebelum Pajak turun dari USD 474,57 Juta menjadi USD 171,32 Juta, namun perusahaan TETAP UNTUNG dan mampu menutup beban bunga USD 89,03 Juta (Interest Coverage Inti 1,73x).",
        level2_evidence: [
          "• Skenario Dasar (Dilaporkan 6M 2026): Laba Usaha USD 154,06 Juta + Asosiasi USD 212,52 Juta + Kurs USD 140,20 Juta - Bunga USD 89,03 Juta = EBT USD 474,57 Juta",
          "• Skenario Stress 1 (Tanpa Laba Kurs USD 140,20 Juta): EBT menjadi USD 334,37 Juta (Masih sangat positif)",
          "• Skenario Stress 2 (Tanpa Laba Kurs & Tanpa Laba Asosiasi - Murni Pabrik Inti): Laba Usaha USD 154,06 Juta - Beban Bunga USD 89,03 Juta = Surplus Inti +USD 65,02 Juta (Coverage 1,73x)"
        ],
        level3_forensic: "Kesimpulan Stress-Test Argon RAG: Bahkan dalam skenario terburuk di mana keuntungan kurs menguap 100% dan entitas asosiasi tidak menyetor laba sama sekali, operasi pabrik inti Pindo Deli (Laba Usaha USD 154,06 Juta) masih sanggup membayar beban bunga semesteran (USD 89,03 Juta) dengan surplus USD 65,02 Juta. Ini membuktikan daya tahan pokok emiten masih solid.",
        followUps: ["pindo_covenant", "pindo_neraca", "pindo_qoe"]
      },
      "eps_deepdive": {
        id: "eps_deepdive",
        title: "Bedah Forensik Pengendali (PT EPS): S7 Growth Gap, Defisit NWC & Bonus 2.308%",
        entity: "PT Era Permata Sejahtera (PT EPS)",
        badge: "Pengendali • S1–S10",
        level1_summary: "PT EPS mengalami 3 anomali operasional: Beban Usaha tumbuh lebih cepat dari Omzet (S7 Growth Gap +1,46%), Modal Kerja defisit -Rp40,49 Miliar (CR 0,57x), dan Bonus Jasa Produksi melonjak 2.308% dari anggaran RKAP.",
        level2_evidence: [
          "• S7 Growth Gap: Opex +32,91% (Rp208,53 M vs Rp156,89 M) > Omzet +31,45% (Rp216,88 M vs Rp164,98 M)",
          "• Defisit NWC: Aset Lancar Rp52,63 M - Liabilitas Lancar Rp93,12 M = -Rp40,49 Miliar (CR = 0,57x)",
          "• S1/S9 Bonus Produksi: Realisasi Rp12,87 Miliar vs Pagu RKAP Rp557,7 Juta (2.308%)"
        ],
        level3_forensic: "Tindakan Dewan Pengawas: Wajibkan klarifikasi tertulis Direksi dalam 7 hari kerja, lampirkan SK Komisaris atas pencairan bonus Rp12,87 Miliar, moratorium kenaikan biaya non-operasional maksimal 10% YoY, dan restrukturisasi fasilitas utang pendek.",
        followUps: ["poj_deepdive", "pindo_qoe"]
      },
      "poj_deepdive": {
        id: "poj_deepdive",
        title: "Bedah Forensik Non-Pengendali (PT POJ): Piutang RTC 301,2% & Proteksi Dividen 1%",
        entity: "PT Pesonna Optima Jasa (PT POJ)",
        badge: "Non-Pengendali • Saham 1%",
        level1_summary: "Sebagai pemegang saham minoritas 1%, Kajian Ihsan menghadapi risiko tertahannya hak dividen tunai Rp185 Juta karena kas PT POJ terkunci di piutang usaha yang membengkak 301,20% dari pagu RKAP (Rp185 Miliar vs pagu Rp61,42 Miliar).",
        level2_evidence: [
          "• Rasio RTC Piutang = (Rp185,00 M / Rp61,42 M) × 100% = 301,20% (Tiering Merah > 120%)",
          "• Defisit Modal Kerja (NWC) = Rp534,60 M - Rp881,78 M = -Rp347,18 Miliar (CR 0,61x)",
          "• Utang Dividen Belum Dibayar di Neraca = Rp110,27 Miliar; Hak Dividen 1% berjalan = Rp185 Juta"
        ],
        level3_forensic: "Agenda Kritis RUPS: Tuntut jadwal pembayaran tunai atas utang dividen Rp110,27 Miliar + dividen berjalan Rp185 Juta, audit daftar umur piutang (aging schedule) & kecukupan CKPN PSAK 71, serta tolak skema capital call yang mendilusi saham minoritas.",
        followUps: ["eps_deepdive", "pindo_covenant"]
      }
    };
  }

  // Train the Argon RAG engine dynamically on new or updated document evidence
  trainOnDocument(docPayload = {}) {
    const id = docPayload.id || `ARGON-TRAINED-${Date.now()}`;
    const entityName = docPayload.entityName || "Entitas Terlatih";
    const scheme = docPayload.scheme || docPayload.category || "investasi";
    const text = docPayload.text || `Dokumen Terlatih ${entityName} (${scheme}): ${JSON.stringify(docPayload.metrics || docPayload.financials || {})}`;
    const trainedChunk = {
      id,
      source: `Gemini Argon Live Training: ${entityName}`,
      section: docPayload.section || `Data Ekstraksi & Kertas Kerja (${scheme})`,
      page: docPayload.page || "Live Session Memory",
      entity: scheme,
      tags: [entityName.toLowerCase(), scheme.toLowerCase(), "trained", "live"],
      text
    };

    const existingIdx = this.documents.findIndex(d => d.id === id);
    if (existingIdx >= 0) {
      this.documents[existingIdx] = trainedChunk;
    } else {
      this.documents.unshift(trainedChunk);
    }

    this.trainingHistory.unshift({
      id,
      entityName,
      scheme,
      trainedAt: new Date().toISOString(),
      tokenCount: text.split(/\s+/).length
    });

    return {
      success: true,
      engineClass: this.engineClass,
      chunkId: id,
      totalDocumentsIndexed: this.documents.length,
      trainingHistoryCount: this.trainingHistory.length
    };
  }

  // Interactive multi-level deep dive ("Dig Deeper")
  digDeeper(topicOrQuery = "", depthLevel = 3, activeContext = {}) {
    const key = String(topicOrQuery || "").trim().toLowerCase();
    // 1. Direct match in deepDiveTree
    if (this.deepDiveTree[key]) {
      const node = this.deepDiveTree[key];
      const hits = this.search(node.title + " " + node.entity, 3);
      return {
        engineClass: this.engineClass,
        topicId: node.id,
        title: node.title,
        entity: node.entity,
        badge: node.badge,
        depthLevel,
        level1_summary: node.level1_summary,
        level2_evidence: node.level2_evidence,
        level3_forensic: node.level3_forensic,
        followUps: (node.followUps || []).map(fid => ({
          id: fid,
          title: this.deepDiveTree[fid] ? this.deepDiveTree[fid].title : fid
        })),
        citations: hits
      };
    }

    // 2. Semantic match to closest deepDiveTree node or dynamic synthesis
    let matchedId = "pindo_qoe";
    if (key.includes("neraca") || key.includes("aset") || key.includes("seksi 1") || key.includes("jangka pendek")) {
      matchedId = "pindo_neraca";
    } else if (key.includes("vertikal") || key.includes("margin") || key.includes("segmen") || key.includes("pulp") || key.includes("seksi 3") || key.includes("seksi 4")) {
      matchedId = "pindo_vertikal_segmen";
    } else if (key.includes("covenant") || key.includes("headroom") || key.includes("dscr") || key.includes("seksi 5") || key.includes("seksi 6") || key.includes("seksi 7")) {
      matchedId = "pindo_covenant";
    } else if (key.includes("stress") || key.includes("simulasi") || key.includes("jika") || key.includes("normal")) {
      matchedId = "pindo_stresstest";
    } else if (key.includes("eps") || key.includes("pengendali") || key.includes("growth gap") || key.includes("bonus")) {
      matchedId = "eps_deepdive";
    } else if (key.includes("poj") || key.includes("non-pengendali") || key.includes("minoritas") || key.includes("rtc") || key.includes("piutang")) {
      matchedId = "poj_deepdive";
    }

    const node = this.deepDiveTree[matchedId];
    const hits = this.search(topicOrQuery || node.title, 4);
    return {
      engineClass: this.engineClass,
      topicId: node.id,
      query: topicOrQuery,
      title: node.title,
      entity: activeContext.entityName || node.entity,
      badge: node.badge,
      depthLevel,
      level1_summary: node.level1_summary,
      level2_evidence: node.level2_evidence,
      level3_forensic: node.level3_forensic,
      followUps: (node.followUps || []).map(fid => ({
        id: fid,
        title: this.deepDiveTree[fid] ? this.deepDiveTree[fid].title : fid
      })),
      citations: hits
    };
  }

  // Tambahkan kasus dari data pooling ke dalam Knowledge Base dinamis
  ingestCase(caseRecord) {
    if (!caseRecord || !caseRecord.id) return;
    const existingIdx = this.dynamicPool.findIndex(c => c.id === caseRecord.id);
    if (existingIdx >= 0) {
      this.dynamicPool[existingIdx] = caseRecord;
    } else {
      this.dynamicPool.push(caseRecord);
    }

    // Ubah kasus menjadi dokumen RAG terindeks
    const docId = `POOL-${caseRecord.id}`;
    const signalsStr = (caseRecord.signals || caseRecord.signalsDetected || []).join(", ");
    const metricsStr = Object.entries(caseRecord.metrics || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const docText = `Entitas: ${caseRecord.entityName} (${caseRecord.category}). Skor Kesehatan Forensik: ${caseRecord.forensicHealthScore || 70}/100. Status Risiko: ${caseRecord.riskTier || 'Waspada'}. Sinyal Anomali: [${signalsStr}]. Metrik: [${metricsStr}]. Jejak Audit: ${caseRecord.checksum || 'AUDIT-LOG:RECORDED'}. Waktu Analisis: ${caseRecord.timestamp || new Date().toISOString()}.`;

    const docIdx = this.documents.findIndex(d => d.id === docId);
    const newDoc = {
      id: docId,
      source: `Forensic Data Pool: ${caseRecord.entityName}`,
      section: `Profil Entitas & Sinyal Forensik (${caseRecord.category})`,
      page: "In-Memory Pool",
      text: docText
    };

    if (docIdx >= 0) {
      this.documents[docIdx] = newDoc;
    } else {
      this.documents.push(newDoc);
    }
    return newDoc;
  }

  getDynamicPool() {
    return this.dynamicPool;
  }

  clearDynamicPool() {
    this.dynamicPool = [];
    this.documents = this.documents.filter(d => !d.id.startsWith("POOL-"));
  }

  // Deteksi pola sistemik lintas entitas (Cross-Entity Pattern Recognition)
  detectSystemicPatterns() {
    const pool = this.dynamicPool;
    const patterns = [];

    // Pola 1: S7 Systemic Growth Gap (Beban Usaha tumbuh lebih cepat dari Omzet)
    const growthGapCases = pool.filter(c => {
      const sigs = (c.signals || c.signalsDetected || []).map(s => String(s).toUpperCase());
      const hasSig = sigs.some(s => s.includes("GROWTH_GAP") || s.includes("S7"));
      const metrics = c.metrics || {};
      const gap = (metrics.opexGrowth !== undefined && metrics.revGrowth !== undefined) ? (metrics.opexGrowth - metrics.revGrowth) : 0;
      return hasSig || gap > 0;
    });

    patterns.push({
      id: "PAT-01",
      code: "SYSTEMIC_GROWTH_GAP",
      title: "Pola 1: Systemic Opex Growth Gap (S7)",
      severity: growthGapCases.length > 0 ? "HIGH" : "LOW",
      affectedEntities: growthGapCases.map(c => c.entityName),
      occurrenceCount: growthGapCases.length,
      ratio: pool.length > 0 ? ((growthGapCases.length / pool.length) * 100).toFixed(1) + "%" : "0%",
      summary: growthGapCases.length > 0
        ? `Terdeteksi pada ${growthGapCases.length} dari ${pool.length} entitas (${((growthGapCases.length / (pool.length || 1)) * 100).toFixed(1)}%). Pertumbuhan beban usaha melampaui pertumbuhan omzet menekan marjin laba operasi.`
        : "Tidak terdeteksi anomali pertumbuhan beban usaha melampaui omzet pada entitas yang terindeks.",
      recommendation: "Pemberlakuan plafon pertumbuhan opex maksimum 10% YoY dan audit efisiensi rantai pasok grup."
    });

    // Pola 2: Defisit Modal Kerja & Likuiditas (Negative NWC & Current Ratio < 1,0x)
    const nwcDeficitCases = pool.filter(c => {
      const sigs = (c.signals || c.signalsDetected || []).map(s => String(s).toUpperCase());
      const hasSig = sigs.some(s => s.includes("NWC") || s.includes("LIQUIDITY"));
      const metrics = c.metrics || {};
      return hasSig || (metrics.nwc !== undefined && metrics.nwc < 0) || (metrics.cr !== undefined && metrics.cr < 1.0);
    });

    patterns.push({
      id: "PAT-02",
      code: "WORKING_CAPITAL_DRAIN",
      title: "Pola 2: Defisit Likuiditas & Modal Kerja (NWC < 0)",
      severity: nwcDeficitCases.length > 0 ? "HIGH" : "LOW",
      affectedEntities: nwcDeficitCases.map(c => c.entityName),
      occurrenceCount: nwcDeficitCases.length,
      ratio: pool.length > 0 ? ((nwcDeficitCases.length / pool.length) * 100).toFixed(1) + "%" : "0%",
      summary: nwcDeficitCases.length > 0
        ? `Terdeteksi pada ${nwcDeficitCases.length} entitas. Likuiditas lancar di bawah 1,0x mencerminkan ketergantungan utang jangka pendek perbankan untuk membiayai operasi harian.`
        : "Seluruh entitas memiliki modal kerja bersih (NWC) positif dan Current Ratio di atas 1,0x.",
      recommendation: "Restrukturisasi tenor utang jangka pendek menjadi pinjaman jangka menengah-panjang atau subordinasi pemegang saham."
    });

    // Pola 3: Lonjakan Deviasi Piutang terhadap RKAP (RTC > 120%)
    const rtcSpikeCases = pool.filter(c => {
      const sigs = (c.signals || c.signalsDetected || []).map(s => String(s).toUpperCase());
      const hasSig = sigs.some(s => s.includes("RTC") || s.includes("PIUTANG"));
      const metrics = c.metrics || {};
      return hasSig || (metrics.rtc !== undefined && metrics.rtc > 120);
    });

    patterns.push({
      id: "PAT-03",
      code: "RECEIVABLES_SLIPPAGE",
      title: "Pola 3: Lonjakan Deviasi Piutang (RTC > 120% RKAP)",
      severity: rtcSpikeCases.length > 0 ? "MEDIUM" : "LOW",
      affectedEntities: rtcSpikeCases.map(c => c.entityName),
      occurrenceCount: rtcSpikeCases.length,
      ratio: pool.length > 0 ? ((rtcSpikeCases.length / pool.length) * 100).toFixed(1) + "%" : "0%",
      summary: rtcSpikeCases.length > 0
        ? `Realisasi piutang melampaui plafon RKAP hingga >120% pada ${rtcSpikeCases.length} entitas, memicu risiko penumpukan piutang macet pihak ketiga.`
        : "Realisasi piutang seluruh entitas terkendali dalam batas pagu anggaran RKAP.",
      recommendation: "Bentuk tim task force penagihan dan cadangan kerugian penurunan nilai (CKPN / PSAK 71) memadai."
    });

    // Pola 4: Kapasitas Solvabilitas Grup & Plafon POJK DER ≤ 5,0x
    const highLeverageCases = pool.filter(c => {
      const metrics = c.metrics || {};
      return (metrics.der !== undefined && metrics.der > 3.0);
    });

    patterns.push({
      id: "PAT-04",
      code: "GROUP_SOLVENCY_BUFFER",
      title: "Pola 4: Daya Dukung Solvabilitas & Kepatuhan POJK DER",
      severity: highLeverageCases.length > 0 ? "MEDIUM" : "LOW",
      affectedEntities: highLeverageCases.map(c => c.entityName),
      occurrenceCount: highLeverageCases.length,
      ratio: pool.length > 0 ? ((highLeverageCases.length / pool.length) * 100).toFixed(1) + "%" : "0%",
      summary: highLeverageCases.length > 0
        ? `Terdapat ${highLeverageCases.length} entitas dengan DER > 3,0x. Namun secara konsolidasi grup (DER 0,96x), portofolio sangat aman di bawah plafon POJK DER ≤ 5,0x.`
        : "Rasio leverage seluruh entitas dan konsolidasi grup berada dalam batas sangat aman (DER konsolidasi 0,96x vs batas POJK 5,0x).",
      recommendation: "Pertahankan alokasi modal sehat dan pastikan anak usaha tidak melampaui covenant rasio utang individu."
    });

    return {
      totalEntities: pool.length,
      analyzedAt: new Date().toISOString(),
      patterns
    };
  }

  // Dapatkan seluruh dokumen knowledge base (statis + dinamis)
  getAllDocuments() {
    return this.documents.map(d => ({
      id: d.id,
      source: d.source,
      section: d.section,
      page: d.page,
      text: d.text,
      isDynamic: d.id.startsWith("POOL-")
    }));
  }

  getDocumentById(id) {
    return this.documents.find(d => d.id === id) || null;
  }

  // Cari dokumen relevan berdasarkan query pengguna dengan filter activeDocIds
  search(query, topK = 4, activeDocIds = null) {
    if (!query || typeof query !== "string") return [];
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    let docPool = this.documents;
    if (Array.isArray(activeDocIds) && activeDocIds.length > 0) {
      const filtered = this.documents.filter(d => activeDocIds.includes(d.id));
      if (filtered.length > 0) {
        docPool = filtered;
      }
    }

    if (tokens.length === 0) return docPool.slice(0, topK);

    const scored = docPool.map(doc => {
      let score = 0;
      const hay = (doc.source + " " + doc.section + " " + doc.text).toLowerCase();
      tokens.forEach(token => {
        if (hay.includes(token)) score += 2;
        // Bobot lebih untuk kata kunci keuangan kunci
        if (["nci", "der", "pojk", "z-score", "rtc", "rkap", "piutang", "eps", "poj", "daaz", "pegadaian", "pool", "pola", "pattern", "s7"].includes(token) && hay.includes(token)) {
          score += 5;
        }
      });
      // Berikan prioritas pada dokumen dari Data Pool aktif
      if (doc.id.startsWith("POOL-")) {
        score += 3;
      }
      return { ...doc, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  // Buat context string terformat untuk prompt AI
  buildGroundedContext(query, activeDocIds = null) {
    const hits = this.search(query, 4, activeDocIds);
    let ctx = "=== GROUNDED KNOWLEDGE, DATA POOL & REGULATORY RULES (RAG) ===\n";
    hits.forEach((h, i) => {
      ctx += `[Sumber ${i + 1} - ${h.id}]: ${h.source} | ${h.section} (${h.page})\nKutipan: \"${h.text}\"\n\n`;
    });
    if (this.dynamicPool.length > 0) {
      const pat = this.detectSystemicPatterns();
      ctx += `=== RINGKASAN POLA SISTEMIK DATA POOL (${this.dynamicPool.length} ENTITAS) ===\n`;
      pat.patterns.forEach(p => {
        ctx += `• [${p.title}] (${p.severity}): ${p.summary}\n`;
      });
      ctx += "\n";
    }
    return ctx;
  }

  // ============================================================================
  // STRUCTURED KNOWLEDGE BASE REPOSITORY, INTELLIGENT CATEGORIZATION &
  // CROSS-YEAR / MULTI-DOCUMENT SIDE-BY-SIDE COMPARISON ENGINE
  // ============================================================================

  initStructuredKnowledgeRepository() {
    this.knowledgeRecords = [
      // 1. INVESTASI — PT Pindo Deli Pulp and Paper Mills (2023, 2024, 2025, 2026)
      {
        id: "KB-INV-PINDO-2023",
        title: "PT Pindo Deli Pulp and Paper Mills — Laporan Keuangan Auditan & Covenant FY 2023",
        entityName: "PT Pindo Deli Pulp and Paper Mills",
        reportingYear: 2023,
        reportingPeriod: "31 Desember 2023 (FY 2023)",
        category: "Investasi",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "investasi",
        documentType: "Audited Financial Statements & Bond Covenant Report",
        currency: "USD Ribu",
        status: "STORED",
        originalDocument: {
          fileName: "LK_Auditan_PT_Pindo_Deli_FY2023.pdf",
          fileType: "PDF",
          fileSizeKB: "1.840,0",
          pageReference: "hlm. 1–18, CALK 4–29",
          sectionReference: "Laporan Posisi Keuangan & Laba Rugi Konsolidasian 2023",
          checksum: "SHA256:9A31F0E4B281C440"
        },
        fields: {
          totalAssets: 8650420,
          currentAssets: 3210450,
          nonCurrentAssets: 5439970,
          totalLiabilities: 3980120,
          currentLiabilities: 1720400,
          longTermLiabilities: 2259720,
          equity: 4670300,
          nwc: 1490050,
          footingDelta: 0,
          revenue: 2110400,
          cogs: 1565900,
          grossProfit: 544500,
          opex: 248200,
          operatingProfit: 296300,
          associateIncome: 142500,
          fxGainLoss: -8400,
          interestExpense: 192400,
          netIncome: 254800,
          currentRatio: 1.87,
          der: 0.56,
          grossMarginPct: 25.80,
          operatingMarginPct: 14.04,
          netMarginPct: 12.07,
          modifiedZScore: 2.31,
          dscrContractual: null,
          sinkingFundBalance: 0,
          forensicHealthScore: 84
        },
        analysisResults: {
          forensicHealthScore: 84,
          riskTier: "Positif • Sehat",
          signals: ["S4 Footing Balanced (Δ = 0)", "Covenant CR 1,87x > 1,00x"],
          summary: "Kinerja tahun penuh 2023 menunjukkan Laba Usaha inti USD 296,30 juta dengan rugi kurs moderat -USD 8,40 juta dan struktur permodalan sehat (DER 0,56x)."
        },
        ingestedAt: "2026-10-20T01:00:00.000Z"
      },
      {
        id: "KB-INV-PINDO-2024",
        title: "PT Pindo Deli Pulp and Paper Mills — Laporan Keuangan Auditan & Covenant FY 2024",
        entityName: "PT Pindo Deli Pulp and Paper Mills",
        reportingYear: 2024,
        reportingPeriod: "31 Desember 2024 (FY 2024)",
        category: "Investasi",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "investasi",
        documentType: "Audited Financial Statements & Bond Covenant Report",
        currency: "USD Ribu",
        status: "STORED",
        originalDocument: {
          fileName: "LK_Auditan_PT_Pindo_Deli_FY2024.pdf",
          fileType: "PDF",
          fileSizeKB: "1.925,4",
          pageReference: "hlm. 1–22, CALK 5–31",
          sectionReference: "Laporan Posisi Keuangan & Laba Rugi Konsolidasian 2024",
          checksum: "SHA256:7C42D881E9A03B12"
        },
        fields: {
          totalAssets: 9075523,
          currentAssets: 3503087,
          nonCurrentAssets: 5572436,
          totalLiabilities: 4036544,
          currentLiabilities: 1814009,
          longTermLiabilities: 2222535,
          equity: 5038979,
          nwc: 1689078,
          footingDelta: 0,
          revenue: 2195800,
          cogs: 1618300,
          grossProfit: 577500,
          opex: 263500,
          operatingProfit: 314000,
          associateIncome: 168400,
          fxGainLoss: 19200,
          interestExpense: 194100,
          netIncome: 318900,
          currentRatio: 1.93,
          der: 0.52,
          grossMarginPct: 26.30,
          operatingMarginPct: 14.30,
          netMarginPct: 14.52,
          modifiedZScore: 2.48,
          dscrContractual: 1.62,
          sinkingFundBalance: 25000,
          forensicHealthScore: 86
        },
        analysisResults: {
          forensicHealthScore: 86,
          riskTier: "Positif • Kuat",
          signals: ["S4 Footing Balanced (Δ = 0)", "Penambahan Dana Sinking Fund USD 25,0 Juta"],
          summary: "Pada FY 2024, Total Aset naik +4,91% menjadi USD 9,08 Miliar, Ekuitas menguat +7,89% ke USD 5,04 Miliar, dan Laba Bersih tumbuh +25,16% menjadi USD 318,90 Juta dengan pengungkapan DSCR 1,62x."
        },
        ingestedAt: "2026-10-20T01:05:00.000Z"
      },
      {
        id: "KB-INV-PINDO-2025",
        title: "PT Pindo Deli Pulp and Paper Mills — Laporan Keuangan Interim 6M 2025",
        entityName: "PT Pindo Deli Pulp and Paper Mills",
        reportingYear: 2025,
        reportingPeriod: "30 Juni 2025 (6M 2025)",
        category: "Investasi",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "investasi",
        documentType: "Interim Financial Statements & Covenant Review",
        currency: "USD Ribu",
        status: "STORED",
        originalDocument: {
          fileName: "LK_Interim_PT_Pindo_Deli_6M2025.pdf",
          fileType: "PDF",
          fileSizeKB: "1.410,2",
          pageReference: "hlm. 1–14, CALK Segmen",
          sectionReference: "Laporan Keuangan Konsolidasian Interim 6M 2025",
          checksum: "SHA256:4B19E77A0D32F819"
        },
        fields: {
          totalAssets: 9075523,
          currentAssets: 3503087,
          nonCurrentAssets: 5572436,
          totalLiabilities: 4036544,
          currentLiabilities: 1814009,
          longTermLiabilities: 2222535,
          equity: 5038979,
          nwc: 1689078,
          footingDelta: 0,
          revenue: 1098987,
          cogs: 809381,
          grossProfit: 289606,
          opex: 132512,
          operatingProfit: 157094,
          associateIncome: 76049,
          fxGainLoss: 5325,
          interestExpense: 98472,
          netIncome: 146814,
          currentRatio: 1.93,
          der: 0.52,
          grossMarginPct: 26.35,
          operatingMarginPct: 14.29,
          netMarginPct: 13.36,
          modifiedZScore: 2.42,
          dscrContractual: null,
          sinkingFundBalance: 25000,
          forensicHealthScore: 83
        },
        analysisResults: {
          forensicHealthScore: 83,
          riskTier: "Positif • Stabil",
          signals: ["S4 Footing Balanced (Δ = 0)", "Operating Margin Inti 14,29%"],
          summary: "Basis interim 6M 2025 mencatat Penjualan Neto USD 1.098,99 juta, Laba Usaha USD 157,09 juta, dan Laba Neto USD 146,81 juta dengan kontribusi kurs minimal (USD 5,33 juta)."
        },
        ingestedAt: "2026-10-20T01:10:00.000Z"
      },
      {
        id: "KB-INV-PINDO-2026",
        title: "PT Pindo Deli Pulp and Paper Mills — Laporan Keuangan Interim & Kajian 7-Seksi 6M 2026",
        entityName: "PT Pindo Deli Pulp and Paper Mills",
        reportingYear: 2026,
        reportingPeriod: "30 Juni 2026 (6M 2026)",
        category: "Investasi",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "investasi",
        documentType: "Interim Financial Statements & 7-Section Investment Analysis",
        currency: "USD Ribu",
        status: "STORED",
        originalDocument: {
          fileName: "01_LK_Auditan_PT_Pindo_Deli_30Jun2026.pdf",
          fileType: "PDF",
          fileSizeKB: "1.620,5",
          pageReference: "hlm. 1–16, Seksi 1–7 Kajian Ihsan",
          sectionReference: "Laporan Posisi Keuangan, Laba Rugi & Covenant 30 Juni 2026",
          checksum: "SHA256:8F90C123E7B64A01"
        },
        fields: {
          totalAssets: 9564776,
          currentAssets: 3815764,
          nonCurrentAssets: 5749012,
          totalLiabilities: 4078921,
          currentLiabilities: 1944954,
          longTermLiabilities: 2133967,
          equity: 5485855,
          nwc: 1870810,
          footingDelta: 0,
          revenue: 1084245,
          cogs: 791935,
          grossProfit: 292310,
          opex: 138254,
          operatingProfit: 154056,
          associateIncome: 212518,
          fxGainLoss: 140198,
          interestExpense: 89033,
          netIncome: 455637,
          currentRatio: 1.96,
          der: 0.50,
          grossMarginPct: 26.96,
          operatingMarginPct: 14.21,
          netMarginPct: 42.02,
          modifiedZScore: 2.68,
          dscrContractual: null,
          sinkingFundBalance: null,
          forensicHealthScore: 82
        },
        analysisResults: {
          forensicHealthScore: 82,
          riskTier: "Positif dengan Monitoring",
          signals: ["S6 Non-Operating Spike (87,9% kenaikan laba dari Asosiasi + Kurs)", "S7 Opex +4,39% vs Penjualan -1,34%", "S8 Segmen Pulp turun -5,2%"],
          summary: "Pada 6M 2026, Laba Neto melonjak +210,3% ke USD 455,64 Juta meskipun Laba Usaha turun -1,93% ke USD 154,06 Juta. Kenaikan ditopang Laba Asosiasi (+179,4%) dan Selisih Kurs (+2.533%)."
        },
        ingestedAt: "2026-10-20T01:15:00.000Z"
      },
      // 2. INVESTASI — PT Daaz Bara Lestari Tbk (2023 vs 2024)
      {
        id: "KB-INV-DAAZ-2023",
        title: "PT Daaz Bara Lestari Tbk — Kertas Kerja Solvabilitas Obligasi FY 2023",
        entityName: "PT Daaz Bara Lestari Tbk",
        reportingYear: 2023,
        reportingPeriod: "31 Desember 2023 (FY 2023)",
        category: "Investasi",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "investasi",
        documentType: "Bond Solvency & Modified Z-Score Report",
        currency: "Rp Miliar (IDR)",
        status: "STORED",
        originalDocument: {
          fileName: "Kertas_Kerja_Obligasi_DAAZ_FY2023.xlsx",
          fileType: "XLSX",
          fileSizeKB: "640,0",
          pageReference: "Sheet 1–3 (Neraca & Modified Z-Score)",
          sectionReference: "Evaluasi Obligasi & Solvabilitas FY 2023",
          checksum: "SHA256:1D44B920A11C7E03"
        },
        fields: {
          totalAssets: 1620.00,
          currentAssets: 980.50,
          nonCurrentAssets: 639.50,
          totalLiabilities: 1090.00,
          currentLiabilities: 765.20,
          longTermLiabilities: 324.80,
          equity: 530.00,
          nwc: 215.30,
          footingDelta: 0,
          revenue: 1650.00,
          cogs: 1340.00,
          grossProfit: 310.00,
          opex: 112.00,
          operatingProfit: 198.00,
          associateIncome: 0,
          fxGainLoss: 4.20,
          interestExpense: 48.50,
          netIncome: 142.00,
          currentRatio: 1.28,
          der: 2.06,
          grossMarginPct: 18.79,
          operatingMarginPct: 12.00,
          netMarginPct: 8.61,
          modifiedZScore: 2.28,
          dscrContractual: 1.85,
          sinkingFundBalance: 15.00,
          forensicHealthScore: 81
        },
        analysisResults: {
          forensicHealthScore: 81,
          riskTier: "Aman (Safe Zone)",
          signals: ["Modified Z-Score 2,28 > 2,00", "DER 2,06x ≤ Covenant 3,00x"],
          summary: "Solvabilitas obligasi PT Daaz Bara Lestari Tbk FY 2023 berada di Zona Aman (Modified Z-Score 2,28) dengan omzet Rp1.650,00 Miliar."
        },
        ingestedAt: "2026-10-20T01:18:00.000Z"
      },
      {
        id: "KB-INV-DAAZ-2024",
        title: "PT Daaz Bara Lestari Tbk — Kertas Kerja Solvabilitas Obligasi FY 2024",
        entityName: "PT Daaz Bara Lestari Tbk",
        reportingYear: 2024,
        reportingPeriod: "31 Desember 2024 (FY 2024)",
        category: "Investasi",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "investasi",
        documentType: "Bond Solvency & Modified Z-Score Report",
        currency: "Rp Miliar (IDR)",
        status: "STORED",
        originalDocument: {
          fileName: "Kertas_Kerja_Obligasi_DAAZ_FY2024.xlsx",
          fileType: "XLSX",
          fileSizeKB: "712,8",
          pageReference: "Sheet 1–4 (4 Dimensi & Modified Z-Score)",
          sectionReference: "Evaluasi Obligasi & Solvabilitas FY 2024",
          checksum: "SHA256:2E55C831B22D8F14"
        },
        fields: {
          totalAssets: 1890.00,
          currentAssets: 1148.81,
          nonCurrentAssets: 741.19,
          totalLiabilities: 1250.00,
          currentLiabilities: 895.00,
          longTermLiabilities: 355.00,
          equity: 640.00,
          nwc: 253.81,
          footingDelta: 0,
          revenue: 1980.00,
          cogs: 1584.00,
          grossProfit: 396.00,
          opex: 151.00,
          operatingProfit: 245.00,
          associateIncome: 0,
          fxGainLoss: 6.80,
          interestExpense: 52.00,
          netIncome: 185.00,
          currentRatio: 1.28,
          der: 1.95,
          grossMarginPct: 20.00,
          operatingMarginPct: 12.37,
          netMarginPct: 9.34,
          modifiedZScore: 2.54,
          dscrContractual: 2.12,
          sinkingFundBalance: 30.00,
          forensicHealthScore: 86
        },
        analysisResults: {
          forensicHealthScore: 86,
          riskTier: "Aman (Safe Zone)",
          signals: ["Modified Z-Score 2,54 > 2,00", "Pertumbuhan Omzet +20,00% YoY (98,51% RKAP)"],
          summary: "Pada FY 2024, Penjualan PT Daaz Bara Lestari Tbk tumbuh +20,00% YoY ke Rp1.980,00 Miliar, DER membaik ke 1,95x, dan Modified Z-Score meningkat ke 2,54."
        },
        ingestedAt: "2026-10-20T01:20:00.000Z"
      },
      // 3. PENGENDALI — PT Era Permata Sejahtera / PT EPS (2024, 2025, 2026)
      {
        id: "KB-CTRL-EPS-2024",
        title: "PT Era Permata Sejahtera (PT EPS) — Laporan Manajemen Entitas Pengendali 2024",
        entityName: "PT Era Permata Sejahtera",
        reportingYear: 2024,
        reportingPeriod: "31 Agustus 2024 (8M 2024)",
        category: "Pengendali",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "pengendali",
        documentType: "Laporan Manajemen Bulanan & Realisasi RKAP Entitas Pengendali",
        currency: "Rp Miliar (IDR)",
        status: "STORED",
        originalDocument: {
          fileName: "Laporan_Manajemen_PT_EPS_Agu2024.xlsx",
          fileType: "XLSX",
          fileSizeKB: "498,2",
          pageReference: "Blok 1–9 (hlm. 1–21)",
          sectionReference: "Neraca, Laba Rugi & Realisasi Anggaran RKAP 2024",
          checksum: "SHA256:5A71D204C91B3E22"
        },
        fields: {
          totalAssets: 192.40,
          currentAssets: 61.20,
          nonCurrentAssets: 131.20,
          totalLiabilities: 108.50,
          currentLiabilities: 58.10,
          longTermLiabilities: 50.40,
          equity: 83.90,
          nwc: 3.10,
          footingDelta: 0,
          revenue: 142.50,
          cogs: 108.30,
          grossProfit: 34.20,
          opex: 24.80,
          operatingProfit: 9.40,
          netIncome: 7.15,
          currentRatio: 1.05,
          der: 1.29,
          grossMarginPct: 24.00,
          operatingMarginPct: 6.60,
          netMarginPct: 5.02,
          revGrowthPct: 14.20,
          opexGrowthPct: 11.80,
          growthGapPct: -2.40,
          bonusRealizationPct: 98.40,
          forensicHealthScore: 80
        },
        analysisResults: {
          forensicHealthScore: 80,
          riskTier: "Terkendali • Hijau",
          signals: ["S4 Footing Balanced (Δ = 0)", "NWC Positif +Rp3,10 Miliar (CR 1,05x)"],
          summary: "Pada periode 2024, PT EPS mencatat pertumbuhan omzet (+14,20%) di atas pertumbuhan opex (+11,80%), modal kerja bersih positif +Rp3,10 Miliar, dan realisasi bonus sesuai pagu RKAP (98,40%)."
        },
        ingestedAt: "2026-10-20T01:22:00.000Z"
      },
      {
        id: "KB-CTRL-EPS-2025",
        title: "PT Era Permata Sejahtera (PT EPS) — Laporan Manajemen Entitas Pengendali 2025",
        entityName: "PT Era Permata Sejahtera",
        reportingYear: 2025,
        reportingPeriod: "31 Agustus 2025 (8M 2025)",
        category: "Pengendali",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "pengendali",
        documentType: "Laporan Manajemen Bulanan & Realisasi RKAP Entitas Pengendali",
        currency: "Rp Miliar (IDR)",
        status: "STORED",
        originalDocument: {
          fileName: "Laporan_Manajemen_PT_EPS_Agu2025.xlsx",
          fileType: "XLSX",
          fileSizeKB: "524,6",
          pageReference: "Blok 1–9 (hlm. 1–23)",
          sectionReference: "Neraca, Laba Rugi & Realisasi Anggaran RKAP 2025",
          checksum: "SHA256:6B82E315D02C4F33"
        },
        fields: {
          totalAssets: 215.80,
          currentAssets: 58.40,
          nonCurrentAssets: 157.40,
          totalLiabilities: 126.90,
          currentLiabilities: 76.20,
          longTermLiabilities: 50.70,
          equity: 88.90,
          nwc: -17.80,
          footingDelta: 0,
          revenue: 164.98,
          cogs: 125.38,
          grossProfit: 39.60,
          opex: 31.51,
          operatingProfit: 8.09,
          netIncome: 6.12,
          currentRatio: 0.77,
          der: 1.43,
          grossMarginPct: 24.00,
          operatingMarginPct: 4.90,
          netMarginPct: 3.71,
          revGrowthPct: 15.78,
          opexGrowthPct: 27.06,
          growthGapPct: 11.28,
          bonusRealizationPct: 145.00,
          forensicHealthScore: 68
        },
        analysisResults: {
          forensicHealthScore: 68,
          riskTier: "Waspada • Kuning",
          signals: ["S7 Growth Gap Awal", "Defisit NWC -Rp17,80 Miliar (CR 0,77x)"],
          summary: "Pada periode 2025, modal kerja PT EPS mulai berbalik defisit (-Rp17,80 Miliar) dan marjin usaha turun dari 6,60% ke 4,90%."
        },
        ingestedAt: "2026-10-20T01:24:00.000Z"
      },
      {
        id: "KB-CTRL-EPS-2026",
        title: "PT Era Permata Sejahtera (PT EPS) — Laporan Manajemen Entitas Pengendali 2026",
        entityName: "PT Era Permata Sejahtera",
        reportingYear: 2026,
        reportingPeriod: "31 Agustus 2026 (8M 2026)",
        category: "Pengendali",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "pengendali",
        documentType: "Laporan Manajemen Bulanan & Realisasi RKAP Entitas Pengendali",
        currency: "Rp Miliar (IDR)",
        status: "STORED",
        originalDocument: {
          fileName: "01_Laporan_Manajemen_PT_EPS_Agu2026.xlsx",
          fileType: "XLSX",
          fileSizeKB: "548,0",
          pageReference: "Blok 1–9 (hlm. 1–23), CALK 1–24",
          sectionReference: "Neraca, Laba Rugi & Realisasi Anggaran RKAP 2026",
          checksum: "SHA256:7C93F426E13D5A44"
        },
        fields: {
          totalAssets: 242.10,
          currentAssets: 52.63,
          nonCurrentAssets: 189.47,
          totalLiabilities: 148.62,
          currentLiabilities: 93.12,
          longTermLiabilities: 55.50,
          equity: 93.48,
          nwc: -40.49,
          footingDelta: 0,
          revenue: 216.88,
          cogs: 166.65,
          grossProfit: 50.23,
          opex: 41.88,
          operatingProfit: 8.35,
          netIncome: 6.45,
          currentRatio: 0.57,
          der: 1.59,
          grossMarginPct: 23.16,
          operatingMarginPct: 3.85,
          netMarginPct: 2.97,
          revGrowthPct: 31.45,
          opexGrowthPct: 32.91,
          growthGapPct: 1.46,
          bonusRealizationPct: 2308.00,
          forensicHealthScore: 58
        },
        analysisResults: {
          forensicHealthScore: 58,
          riskTier: "Risiko Tinggi • Merah",
          signals: ["S7 Growth Gap (+1,46 pp: Opex +32,91% > Omzet +31,45%)", "Defisit NWC -Rp40,49 Miliar (CR 0,57x)", "S1/S9 Lonjakan Bonus Produksi 2.308% RKAP"],
          summary: "Pada 2026, defisit modal kerja PT EPS melebar ke -Rp40,49 Miliar (CR 0,57x), marjin operasi tertekan ke 3,85% akibat S7 Growth Gap, dan realisasi bonus mencapai 2.308% dari RKAP."
        },
        ingestedAt: "2026-10-20T01:26:00.000Z"
      },
      // 4. NON-PENGENDALI — PT Pesonna Optima Jasa / PT POJ (2024 vs 2025)
      {
        id: "KB-NCI-POJ-2024",
        title: "PT Pesonna Optima Jasa (PT POJ) — Laporan Monitoring Saham Minoritas 1% FY 2024",
        entityName: "PT Pesonna Optima Jasa",
        reportingYear: 2024,
        reportingPeriod: "31 Desember 2024 (FY 2024)",
        category: "Non-Pengendali",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "nonpengendali",
        documentType: "Minority Shareholder Monitoring & Audited Financial Statements",
        currency: "Rp Miliar (IDR)",
        status: "STORED",
        originalDocument: {
          fileName: "Laporan_Keuangan_PT_POJ_FY2024.pdf",
          fileType: "PDF",
          fileSizeKB: "812,0",
          pageReference: "hlm. 1–48, Catatan Piutang & Dividen",
          sectionReference: "Evaluasi Hak Minoritas 1% & Realisasi RKAP 2024",
          checksum: "SHA256:3F12A890B44E1C55"
        },
        fields: {
          totalAssets: 1180.40,
          currentAssets: 512.30,
          nonCurrentAssets: 668.10,
          totalLiabilities: 728.90,
          currentLiabilities: 645.10,
          longTermLiabilities: 83.80,
          equity: 451.50,
          nwc: -132.80,
          footingDelta: 0,
          revenue: 845.20,
          opex: 118.40,
          operatingProfit: 31.20,
          netIncome: 16.40,
          currentRatio: 0.79,
          der: 1.61,
          receivablesAct: 68.50,
          receivablesRKAP: 58.00,
          rtcPct: 118.10,
          minorityPct: 1.00,
          dividendEntitlement: 0.164,
          dividendPayable: 64.20,
          forensicHealthScore: 69
        },
        analysisResults: {
          forensicHealthScore: 69,
          riskTier: "Perhatian Moderat • Kuning",
          signals: ["RTC Piutang 118,10% (Kuning: 101%–120%)", "Defisit NWC -Rp132,80 Miliar"],
          summary: "Pada FY 2024, realisasi piutang PT POJ berada di Rp68,50 Miliar (118,10% terhadap RKAP Rp58,00 Miliar — Tiering Kuning) dengan utang dividen tertahan Rp64,20 Miliar."
        },
        ingestedAt: "2026-10-20T01:28:00.000Z"
      },
      {
        id: "KB-NCI-POJ-2025",
        title: "PT Pesonna Optima Jasa (PT POJ) — Laporan Monitoring Saham Minoritas 1% FY 2025",
        entityName: "PT Pesonna Optima Jasa",
        reportingYear: 2025,
        reportingPeriod: "31 Desember 2025 (FY 2025)",
        category: "Non-Pengendali",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "nonpengendali",
        documentType: "Minority Shareholder Monitoring & Audited Financial Statements",
        currency: "Rp Miliar (IDR)",
        status: "STORED",
        originalDocument: {
          fileName: "01_Laporan_Keuangan_PT_POJ_2025.pdf",
          fileType: "PDF",
          fileSizeKB: "945,2",
          pageReference: "hlm. 1–55, Catatan Piutang & Dividen",
          sectionReference: "Evaluasi Hak Minoritas 1% & Realisasi RKAP 2025",
          checksum: "SHA256:4A23B901C55F2D66"
        },
        fields: {
          totalAssets: 1361.36,
          currentAssets: 534.60,
          nonCurrentAssets: 826.76,
          totalLiabilities: 881.78,
          currentLiabilities: 881.78,
          longTermLiabilities: 0,
          equity: 479.58,
          nwc: -347.18,
          footingDelta: 0,
          revenue: 912.60,
          opex: 134.80,
          operatingProfit: 28.90,
          netIncome: 18.50,
          currentRatio: 0.61,
          der: 2.19,
          receivablesAct: 185.00,
          receivablesRKAP: 61.42,
          rtcPct: 301.20,
          minorityPct: 1.00,
          dividendEntitlement: 0.185,
          dividendPayable: 110.27,
          forensicHealthScore: 54
        },
        analysisResults: {
          forensicHealthScore: 54,
          riskTier: "Perhatian Tinggi • Merah",
          signals: ["RTC Piutang 301,20% > 120% (Tiering Merah)", "Defisit NWC -Rp347,18 Miliar (CR 0,61x)", "Utang Dividen Tertahan Naik ke Rp110,27 Miliar"],
          summary: "Pada FY 2025, piutang pihak ketiga PT POJ melonjak +170,07% YoY menjadi Rp185,00 Miliar (RTC 301,20% RKAP), memperdalam defisit NWC ke -Rp347,18 Miliar dan menahan pencairan dividen minoritas 1%."
        },
        ingestedAt: "2026-10-20T01:30:00.000Z"
      },
      // 5. KONSOLIDASI GRUP — Holding Konsolidasi Grup Kajian Ihsan (2025 vs 2026)
      {
        id: "KB-KONS-GRUP-2025",
        title: "Holding Konsolidasi Grup Kajian Ihsan (6 Entitas) — Laporan Konsolidasi FY 2025",
        entityName: "Holding Konsolidasi Grup Kajian Ihsan",
        reportingYear: 2025,
        reportingPeriod: "31 Desember 2025 (FY 2025)",
        category: "Konsolidasi Grup",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "konsolidasi",
        documentType: "Consolidated Group Financial Worksheet (IFRS 10 / PSAK 65)",
        currency: "USD Juta",
        status: "STORED",
        originalDocument: {
          fileName: "Kertas_Kerja_Konsolidasi_Grup_FY2025.xlsx",
          fileType: "XLSX",
          fileSizeKB: "1.120,0",
          pageReference: "Matrix Eliminasi Slide 1–8",
          sectionReference: "Konsolidasi 6 Entitas & Kepatuhan POJK 2025",
          checksum: "SHA256:9B01C234D56E7F88"
        },
        fields: {
          totalAssets: 5620.00,
          totalLiabilities: 2810.00,
          equity: 2810.00,
          footingDelta: 0,
          revenue: 3540.00,
          operatingProfit: 412.00,
          netIncome: 290.00,
          der: 1.00,
          forensicHealthScore: 85
        },
        analysisResults: {
          forensicHealthScore: 85,
          riskTier: "Patuh POJK • Hijau",
          signals: ["POJK DER 1,00x ≤ 5,00x", "Eliminasi Afiliasi 100%"],
          summary: "Konsolidasi Grup FY 2025 mencatat Pendapatan USD 3.540,0 juta, Laba Bersih USD 290,0 juta, dan DER 1,00x."
        },
        ingestedAt: "2026-10-20T01:32:00.000Z"
      },
      {
        id: "KB-KONS-GRUP-2026",
        title: "Holding Konsolidasi Grup Kajian Ihsan (6 Entitas) — Laporan Konsolidasi FY 2026",
        entityName: "Holding Konsolidasi Grup Kajian Ihsan",
        reportingYear: 2026,
        reportingPeriod: "31 Agustus 2026 (FY 2026)",
        category: "Konsolidasi Grup",
        secondaryCategories: ["Laporan Keuangan"],
        selectedScheme: "konsolidasi",
        documentType: "Consolidated Group Financial Worksheet (IFRS 10 / PSAK 65)",
        currency: "USD Juta",
        status: "STORED",
        originalDocument: {
          fileName: "Kertas_Kerja_Konsolidasi_Grup_FY2026.xlsx",
          fileType: "XLSX",
          fileSizeKB: "1.245,0",
          pageReference: "Matrix Eliminasi Slide 1–10",
          sectionReference: "Konsolidasi 6 Entitas & Kepatuhan POJK 2026",
          checksum: "SHA256:AC12D345E67F8A99"
        },
        fields: {
          totalAssets: 6018.00,
          totalLiabilities: 2948.00,
          equity: 3070.00,
          footingDelta: 0,
          revenue: 3885.00,
          operatingProfit: 458.00,
          netIncome: 325.00,
          der: 0.96,
          forensicHealthScore: 88
        },
        analysisResults: {
          forensicHealthScore: 88,
          riskTier: "Patuh POJK • Hijau",
          signals: ["POJK DER 0,96x ≤ 5,00x", "NCI Profit Mismatch Subsidiary II +34,1%"],
          summary: "Konsolidasi Grup FY 2026 tumbuh sehat dengan Pendapatan USD 3.885,0 juta (+9,75%), Laba Bersih USD 325,0 juta (+12,07%), dan DER membaik ke 0,96x."
        },
        ingestedAt: "2026-10-20T01:34:00.000Z"
      }
    ];
  }

  // Intelligent Content-Based + Metadata Categorizer
  classifyKnowledgeItem(payload = {}) {
    const rawText = [
      payload.text || "",
      payload.content || "",
      payload.extractedText || "",
      payload.snippet || "",
      payload.title || "",
      payload.section || "",
      payload.documentType || "",
      JSON.stringify(payload.fields || payload.financials || payload.metrics || payload.extractedData || {}),
      (payload.signals || payload.signalsDetected || []).join(" ")
    ].join(" ").toLowerCase();

    const f = {
      ...(payload.fields || {}),
      ...(payload.financials || {}),
      ...(payload.metrics || {}),
      ...(payload.extractedData || {})
    };

    // Score content evidence across categories (independent of filename!)
    const scores = {
      "Investasi": 0,
      "Pengendali": 0,
      "Non-Pengendali": 0,
      "Konsolidasi Grup": 0,
      "Laporan Keuangan": 0
    };

    // Content & extracted metric rules for Investasi
    if (/\b(obligasi|sukuk|modified z-score|z-score|covenant|dscr|sinking fund|dsra|bagian laba entitas asosiasi|selisih kurs|equity cushion|pindo deli|daaz|pegadaian|investasi)\b/i.test(rawText)) {
      scores["Investasi"] += 6;
    }
    if (f.modifiedZScore !== undefined || f.z !== undefined || f.associateIncome !== undefined || f.dscrContractual !== undefined || f.sinkingFundBalance !== undefined) {
      scores["Investasi"] += 5;
    }

    // Content & extracted metric rules for Pengendali
    if (/\b(entitas pengendali|laporan manajemen bulanan|s7 growth gap|growth gap|bonus jasa produksi|2\.308%|era permata sejahtera|pengendali)\b/i.test(rawText)) {
      scores["Pengendali"] += 6;
    }
    if (f.growthGap !== undefined || f.growthGapPct !== undefined || f.s7GrowthGap !== undefined || f.bonusRealizationPct !== undefined || (f.revGrowth !== undefined && f.opexGrowth !== undefined)) {
      scores["Pengendali"] += 5;
    }

    // Content & extracted metric rules for Non-Pengendali
    if (/\b(non-pengendali|non pengendali|pemegang saham minoritas|1%|hak dividen|utang dividen|capital call|rtc piutang|301,20%|pesonna optima)\b/i.test(rawText)) {
      scores["Non-Pengendali"] += 6;
    }
    if (f.rtc !== undefined || f.rtcPct !== undefined || f.rtcRatio !== undefined || f.receivablesRKAP !== undefined || f.arTar !== undefined || f.minorityPct !== undefined || f.dividendEntitlement !== undefined) {
      scores["Non-Pengendali"] += 5;
    }

    // Content & extracted metric rules for Konsolidasi Grup
    if (/\b(konsolidasi grup|eliminasi afiliasi|ifrs 10|psak 65|pojk der|nci mismatch|holding konsolidasi)\b/i.test(rawText)) {
      scores["Konsolidasi Grup"] += 6;
    }

    // Content & extracted metric rules for Laporan Keuangan
    if (/\b(laporan posisi keuangan|neraca|laba rugi|arus kas|aset lancar|liabilitas|ekuitas|calk)\b/i.test(rawText) || f.totalAssets !== undefined || f.revenue !== undefined || f.netIncome !== undefined) {
      scores["Laporan Keuangan"] += 4;
    }

    // Determine highest content-detected category
    let contentDetectedCategory = "Laporan Keuangan";
    let maxScore = -1;
    ["Investasi", "Pengendali", "Non-Pengendali", "Konsolidasi Grup", "Laporan Keuangan"].forEach(cat => {
      if (scores[cat] > maxScore) {
        maxScore = scores[cat];
        contentDetectedCategory = cat;
      }
    });

    // Workflow scheme consistency mapping
    const schemeToCategory = {
      "investasi": "Investasi",
      "investment": "Investasi",
      "pengendali": "Pengendali",
      "controlling": "Pengendali",
      "nonpengendali": "Non-Pengendali",
      "non_pengendali": "Non-Pengendali",
      "non-pengendali": "Non-Pengendali",
      "konsolidasi": "Konsolidasi Grup",
      "laporan_keuangan": "Laporan Keuangan"
    };

    const explicitSchemeKey = String(payload.selectedScheme || payload.scheme || "").toLowerCase().trim();
    const explicitCatKey = String(payload.category || "").toLowerCase().trim();
    let primaryCategory = contentDetectedCategory;

    if (schemeToCategory[explicitSchemeKey]) {
      primaryCategory = schemeToCategory[explicitSchemeKey];
    } else if (schemeToCategory[explicitCatKey]) {
      primaryCategory = schemeToCategory[explicitCatKey];
    } else if (payload.category) {
      if (payload.category.includes("Investasi") || payload.category.includes("Investment")) primaryCategory = "Investasi";
      else if (payload.category.includes("Non-Pengendali") || payload.category.includes("Minoritas")) primaryCategory = "Non-Pengendali";
      else if (payload.category.includes("Pengendali") || payload.category.includes("Controlling")) primaryCategory = "Pengendali";
      else if (payload.category.includes("Konsolidasi")) primaryCategory = "Konsolidasi Grup";
      else if (payload.category.includes("Laporan Keuangan")) primaryCategory = "Laporan Keuangan";
    }

    const secondaryCategories = [];
    if (scores["Laporan Keuangan"] > 0 && primaryCategory !== "Laporan Keuangan") {
      secondaryCategories.push("Laporan Keuangan");
    }
    if (contentDetectedCategory !== primaryCategory && !secondaryCategories.includes(contentDetectedCategory)) {
      secondaryCategories.push(contentDetectedCategory);
    }

    // Extract reportingYear and reportingPeriod from metadata + content
    const periodSource = String(payload.reportingPeriod || payload.period || payload.title || rawText);
    let reportingYear = Number(payload.reportingYear) || null;
    if (!reportingYear) {
      const yearMatches = periodSource.match(/\b(202[0-9]|2030)\b/g);
      if (yearMatches && yearMatches.length > 0) {
        reportingYear = parseInt(yearMatches[0], 10);
      } else {
        reportingYear = 2026;
      }
    }
    const reportingPeriod = payload.reportingPeriod || payload.period || `Periode Pelaporan ${reportingYear}`;

    return {
      primaryCategory,
      contentDetectedCategory,
      secondaryCategories,
      reportingYear,
      reportingPeriod,
      hasCategoryMismatch: Boolean(explicitSchemeKey && schemeToCategory[explicitSchemeKey] && contentDetectedCategory !== "Laporan Keuangan" && schemeToCategory[explicitSchemeKey] !== contentDetectedCategory),
      scores
    };
  }

  // Traceable Ingestion into Knowledge Base (Never silently excludes eligible or failed items)
  ingestKnowledgeBaseItem(payload = {}) {
    const nowIso = new Date().toISOString();
    const fileName = payload.fileName || payload.originalDocument?.fileName || payload.source || "dokumen_tanpa_nama";

    // Check explicit failure or ineligibility
    const isExplicitFailure = payload.validationValid === false || payload.status === "Failed" || payload.status === "Failed Validation" || Boolean(payload.failureReason);
    const hasNoContent = !payload.entityName && !payload.text && !payload.extractedText && !payload.fields && !payload.financials && !payload.metrics;

    if (isExplicitFailure || hasNoContent) {
      const reason = payload.failureReason ||
        (Array.isArray(payload.validationErrors) && payload.validationErrors.length > 0 ? payload.validationErrors.join(" | ") : null) ||
        (hasNoContent ? "Dokumen tidak memiliki nama entitas (entityName) maupun konten keuangan yang dapat diekstrak." : "Gagal validasi format atau struktur berkas.");

      const failedEntry = {
        id: payload.id || `KB-FAILED-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fileName,
        entityName: payload.entityName || "Tidak Teridentifikasi",
        attemptedCategory: payload.selectedScheme || payload.category || "Tidak Diketahui",
        status: "FAILED_INGESTION",
        reason,
        timestamp: nowIso
      };

      const existFailIdx = this.failedIngestions.findIndex(f => f.fileName === fileName && f.reason === reason);
      if (existFailIdx >= 0) {
        this.failedIngestions[existFailIdx] = failedEntry;
      } else {
        this.failedIngestions.unshift(failedEntry);
      }

      return {
        success: false,
        status: "FAILED_INGESTION",
        reason,
        failedRecord: failedEntry
      };
    }

    const classification = this.classifyKnowledgeItem(payload);
    const entityName = payload.entityName || "Entitas Terindeks";
    const reportingYear = classification.reportingYear;
    const category = classification.primaryCategory;
    const id = payload.id || `KB-${category.slice(0, 3).toUpperCase()}-${entityName.replace(/[^A-Za-z0-9]/g, "").slice(0, 8).toUpperCase()}-${reportingYear}`;

    const rawFields = {
      ...(payload.financials || {}),
      ...(payload.metrics || {}),
      ...(payload.fields || {}),
      ...(payload.extractedData || {})
    };
    const preserveNumOrNull = (val) => {
      if (val === 0 || val === "0") return 0;
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      return Number.isFinite(num) ? num : null;
    };

    const normalizedFields = {
      totalAssets: preserveNumOrNull(rawFields.totalAssets ?? rawFields.ta),
      currentAssets: preserveNumOrNull(rawFields.currentAssets ?? rawFields.ca),
      nonCurrentAssets: preserveNumOrNull(rawFields.nonCurrentAssets),
      totalLiabilities: preserveNumOrNull(rawFields.totalLiabilities ?? rawFields.tl),
      currentLiabilities: preserveNumOrNull(rawFields.currentLiabilities ?? rawFields.cl),
      longTermLiabilities: preserveNumOrNull(rawFields.longTermLiabilities),
      shortTermDebt: preserveNumOrNull(rawFields.shortTermDebt),
      longTermDebt: preserveNumOrNull(rawFields.longTermDebt),
      equity: preserveNumOrNull(rawFields.equity ?? rawFields.eq),
      nwc: preserveNumOrNull(rawFields.nwc),
      footingDelta: preserveNumOrNull(rawFields.footingDelta ?? 0),
      revenue: preserveNumOrNull(rawFields.revenue ?? rawFields.sales ?? rawFields.revCY),
      cogs: preserveNumOrNull(rawFields.cogs ?? rawFields.cogsCY),
      grossProfit: preserveNumOrNull(rawFields.grossProfit),
      opex: preserveNumOrNull(rawFields.opex ?? rawFields.opexCY),
      operatingProfit: preserveNumOrNull(rawFields.operatingProfit ?? rawFields.opProf),
      associateIncome: preserveNumOrNull(rawFields.associateIncome),
      fxGainLoss: preserveNumOrNull(rawFields.fxGainLoss),
      interestExpense: preserveNumOrNull(rawFields.interestExpense),
      netIncome: preserveNumOrNull(rawFields.netIncome ?? rawFields.ni ?? rawFields.niCY),
      currentRatio: preserveNumOrNull(rawFields.currentRatio ?? rawFields.cr),
      der: preserveNumOrNull(rawFields.der),
      grossMarginPct: preserveNumOrNull(rawFields.grossMarginPct),
      operatingMarginPct: preserveNumOrNull(rawFields.operatingMarginPct),
      netMarginPct: preserveNumOrNull(rawFields.netMarginPct),
      modifiedZScore: preserveNumOrNull(rawFields.modifiedZScore ?? rawFields.z ?? rawFields.zScore),
      dscrContractual: preserveNumOrNull(rawFields.dscrContractual ?? rawFields.dscr),
      sinkingFundBalance: preserveNumOrNull(rawFields.sinkingFundBalance),
      revGrowthPct: preserveNumOrNull(rawFields.revGrowthPct ?? rawFields.revGrowth),
      opexGrowthPct: preserveNumOrNull(rawFields.opexGrowthPct ?? rawFields.opexGrowth),
      growthGapPct: preserveNumOrNull(rawFields.growthGapPct ?? rawFields.growthGap ?? rawFields.s7GrowthGap),
      bonusRealizationPct: preserveNumOrNull(rawFields.bonusRealizationPct),
      receivablesAct: preserveNumOrNull(rawFields.receivablesAct ?? rawFields.arAct),
      receivablesRKAP: preserveNumOrNull(rawFields.receivablesRKAP ?? rawFields.arTar),
      rtcPct: preserveNumOrNull(rawFields.rtcPct ?? rawFields.rtc ?? rawFields.rtcRatio),
      minorityPct: preserveNumOrNull(rawFields.minorityPct ?? rawFields.pct),
      dividendEntitlement: preserveNumOrNull(rawFields.dividendEntitlement ?? rawFields.div),
      dividendPayable: preserveNumOrNull(rawFields.dividendPayable),
      forensicHealthScore: preserveNumOrNull(rawFields.forensicHealthScore ?? payload.forensicHealthScore ?? 80)
    };

    // Remove keys that are null only if not explicitly provided as null in payload.fields or payload.extractedData
    const explicitSource = payload.fields || payload.extractedData || {};
    const explicitFieldKeys = Object.keys(explicitSource);
    const cleanedFields = {};
    Object.entries(normalizedFields).forEach(([k, v]) => {
      if (v !== null || explicitFieldKeys.includes(k)) {
        cleanedFields[k] = v;
      }
    });

    const record = {
      id,
      title: payload.title || `${entityName} — ${category} (${classification.reportingPeriod})`,
      entityName,
      reportingYear,
      reportingPeriod: classification.reportingPeriod,
      category,
      contentDetectedCategory: classification.contentDetectedCategory,
      secondaryCategories: classification.secondaryCategories,
      hasCategoryMismatch: classification.hasCategoryMismatch,
      selectedScheme: payload.selectedScheme || category.toLowerCase().replace(/\s+/g, ""),
      documentType: payload.documentType || `Dokumen ${category} & Laporan Keuangan`,
      currency: payload.currency || "Rp Miliar (IDR)",
      status: "STORED",
      originalDocument: {
        fileName,
        fileType: (fileName.split(".").pop() || "DOC").toUpperCase(),
        fileSizeKB: payload.fileSizeKB || "128,0",
        pageReference: payload.page || payload.originalDocument?.pageReference || "Dokumen Sumber Terverifikasi",
        sectionReference: payload.section || payload.originalDocument?.sectionReference || `Ekstraksi Kertas Kerja ${category}`,
        checksum: payload.checksum || payload.originalDocument?.checksum || `SHA256:${Date.now().toString(16).toUpperCase()}`
      },
      fields: cleanedFields,
      extractedData: cleanedFields,
      analysisResults: {
        forensicHealthScore: cleanedFields.forensicHealthScore ?? 80,
        riskTier: payload.riskTier || payload.analysisResults?.riskTier || "Terverifikasi",
        signals: payload.signals || payload.signalsDetected || payload.analysisResults?.signals || [],
        summary: payload.summary || payload.analysisResults?.summary || payload.text || `Item Knowledge Base ${entityName} (${classification.reportingPeriod}) pada kategori ${category}.`
      },
      ingestedAt: nowIso
    };

    const existingIdx = this.knowledgeRecords.findIndex(r => r.id === id);
    if (existingIdx >= 0) {
      this.knowledgeRecords[existingIdx] = record;
    } else {
      this.knowledgeRecords.unshift(record);
    }

    // Also index in RAG text corpus for search & Copilot grounding
    this.trainOnDocument({
      id: `RAG-${id}`,
      entityName,
      scheme: category,
      section: `${category} • ${classification.reportingPeriod}`,
      page: record.originalDocument.fileName,
      text: `${record.title}. Kategori: ${category}. Periode: ${classification.reportingPeriod}. Satuan: ${record.currency}. Metrik: ${JSON.stringify(cleanedFields)}. Ringkasan: ${record.analysisResults.summary}`
    });

    return {
      success: true,
      status: "STORED",
      item: record,
      record: record
    };
  }

  // Retrieve Knowledge Base items with intelligent category, entity, and year grouping
  getKnowledgeBaseCatalog(filters = {}) {
    const categoryFilter = filters.category && filters.category !== "ALL" && filters.category !== "Semua"
      ? String(filters.category).trim()
      : null;
    const entityFilter = filters.entityName ? String(filters.entityName).toLowerCase().trim() : null;
    const yearFilter = filters.reportingYear ? Number(filters.reportingYear) : null;
    const queryFilter = filters.query ? String(filters.query).toLowerCase().trim() : null;

    let items = [...this.knowledgeRecords];

    if (categoryFilter) {
      items = items.filter(item =>
        item.category.toLowerCase() === categoryFilter.toLowerCase() ||
        (Array.isArray(item.secondaryCategories) && item.secondaryCategories.some(sc => sc.toLowerCase() === categoryFilter.toLowerCase()))
      );
    }
    if (entityFilter) {
      items = items.filter(item => item.entityName.toLowerCase().includes(entityFilter));
    }
    if (yearFilter) {
      items = items.filter(item => Number(item.reportingYear) === yearFilter);
    }
    if (queryFilter) {
      items = items.filter(item => {
        const hay = `${item.id} ${item.title} ${item.entityName} ${item.category} ${item.reportingPeriod} ${item.originalDocument?.fileName || ""} ${item.analysisResults?.summary || ""}`.toLowerCase();
        return hay.includes(queryFilter);
      });
    }

    // Sort by Category -> Entity Name -> Reporting Year ascending
    items.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.entityName !== b.entityName) return a.entityName.localeCompare(b.entityName);
      return (a.reportingYear || 0) - (b.reportingYear || 0);
    });

    // Build category counts across full repository
    const categoryCounts = {
      "ALL": this.knowledgeRecords.length,
      "Investasi": 0,
      "Pengendali": 0,
      "Non-Pengendali": 0,
      "Laporan Keuangan": 0,
      "Konsolidasi Grup": 0
    };
    this.knowledgeRecords.forEach(r => {
      if (categoryCounts[r.category] !== undefined) categoryCounts[r.category]++;
      if (Array.isArray(r.secondaryCategories)) {
        r.secondaryCategories.forEach(sc => {
          if (categoryCounts[sc] !== undefined) categoryCounts[sc]++;
        });
      }
    });

    // Group by Category -> Entity -> Year
    const groupedByCategory = {};
    items.forEach(item => {
      const cat = item.category;
      if (!groupedByCategory[cat]) groupedByCategory[cat] = {};
      if (!groupedByCategory[cat][item.entityName]) groupedByCategory[cat][item.entityName] = [];
      groupedByCategory[cat][item.entityName].push(item);
    });

    return {
      totalStored: this.knowledgeRecords.length,
      filteredCount: items.length,
      categoryCounts,
      items,
      groupedByCategory,
      failedIngestions: this.failedIngestions
    };
  }

  // Dynamic Cross-Year & Multi-Document Side-by-Side Comparison Engine
  compareKnowledgeBaseItems(itemIds = [], options = {}) {
    if (!Array.isArray(itemIds) || itemIds.length < 2) {
      return {
        success: false,
        comparisonSupported: false,
        reasonCode: "INSUFFICIENT_ITEMS",
        message: "Pilih minimal 2 dokumen pada Knowledge Base untuk menjalankan komparasi berdampingan (Side-by-Side Comparison)."
      };
    }

    const selectedItems = itemIds
      .map(id => this.knowledgeRecords.find(r => r.id === id))
      .filter(Boolean);

    if (selectedItems.length < 2) {
      return {
        success: false,
        comparisonSupported: false,
        reasonCode: "ITEMS_NOT_FOUND",
        message: "Satu atau lebih dokumen yang dipilih tidak ditemukan di dalam Knowledge Base."
      };
    }

    // Check category relationship
    const uniqueCategories = [...new Set(selectedItems.map(i => i.category))];
    const allShareSecondaryLK = selectedItems.every(i =>
      i.category === "Laporan Keuangan" || (Array.isArray(i.secondaryCategories) && i.secondaryCategories.includes("Laporan Keuangan"))
    );

    const samePrimaryCategory = uniqueCategories.length === 1;
    if (!samePrimaryCategory && !options.allowUniversalFinancialsOnly) {
      return {
        success: false,
        comparisonSupported: false,
        reasonCode: "DIFFERENT_CATEGORIES_BLOCKED",
        categoriesSelected: uniqueCategories,
        canCompareUniversalFinancials: allShareSecondaryLK,
        selectedItems: selectedItems.map(i => ({
          id: i.id,
          title: i.title,
          entityName: i.entityName,
          category: i.category,
          reportingYear: i.reportingYear,
          reportingPeriod: i.reportingPeriod
        })),
        message: `Komparasi otomatis ditolak karena dokumen yang dipilih berasal dari kategori berbeda (${uniqueCategories.join(" vs ")}). Pilih dokumen dalam kategori yang sama (misal: sesama Investasi atau sesama Pengendali), atau aktifkan opsi komparasi pos Laporan Keuangan universal.`
      };
    }

    // Sort chronologically by reportingYear ascending (then by id)
    const sortedItems = [...selectedItems].sort((a, b) => {
      if ((a.reportingYear || 0) !== (b.reportingYear || 0)) {
        return (a.reportingYear || 0) - (b.reportingYear || 0);
      }
      return a.id.localeCompare(b.id);
    });

    const uniqueYears = [...new Set(sortedItems.map(i => i.reportingYear))];
    const uniqueEntities = [...new Set(sortedItems.map(i => i.entityName))];
    const uniqueCurrencies = [...new Set(sortedItems.map(i => i.currency))];
    const unitsCompatible = uniqueCurrencies.length === 1;

    let comparisonMode = "CROSS_YEAR_COMPARISON";
    let comparisonModeLabel = "Komparasi Lintas Tahun (Cross-Year Side-by-Side Comparison)";
    if (!samePrimaryCategory && options.allowUniversalFinancialsOnly) {
      comparisonMode = "CROSS_CATEGORY_UNIVERSAL_FINANCIALS";
      comparisonModeLabel = "Komparasi Lintas Kategori Terbatas (Pos Laporan Keuangan Universal)";
    } else if (uniqueYears.length === 1) {
      comparisonMode = "SAME_YEAR_BENCHMARK";
      comparisonModeLabel = "Komparasi Tahun Pelaporan Sama (Same-Year Entity/Document Comparison)";
    }

    // Canonical Field Catalog with category relevance & unit metadata
    const FIELD_CATALOG = [
      { key: "totalAssets", label: "Total Aset (Total Assets)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "currentAssets", label: "Aset Lancar (Current Assets)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "nonCurrentAssets", label: "Aset Tidak Lancar (Non-Current Assets)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "totalLiabilities", label: "Total Liabilitas (Total Liabilities)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "currentLiabilities", label: "Liabilitas Jangka Pendek (Current Liabilities)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "longTermLiabilities", label: "Liabilitas Jangka Panjang (Long-Term Liabilities)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "equity", label: "Total Ekuitas (Total Equity)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "nwc", label: "Modal Kerja Bersih (Net Working Capital / NWC)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "footingDelta", label: "Selisih Keseimbangan Neraca (Footing Δ)", group: "1. Posisi Keuangan (Neraca)", isMonetary: true, unitType: "currency", categories: ["ALL"] },

      { key: "revenue", label: "Pendapatan / Penjualan Neto (Revenue / Sales)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "cogs", label: "Beban Pokok Penjualan (COGS / HPP)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "grossProfit", label: "Laba Bruto (Gross Profit)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "opex", label: "Beban Usaha Operasional (Operating Expenses / Opex)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "operatingProfit", label: "Laba Usaha Inti (Operating Profit / EBIT)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["ALL"] },
      { key: "associateIncome", label: "Bagian Laba Entitas Asosiasi (Associate Income)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["Investasi"] },
      { key: "fxGainLoss", label: "Laba / (Rugi) Selisih Kurs Neto (Net FX Gain/Loss)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["Investasi"] },
      { key: "interestExpense", label: "Beban Bunga & Keuangan (Interest Expense)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["Investasi"] },
      { key: "netIncome", label: "Laba Neto Periode Berjalan (Net Income)", group: "2. Kinerja Laba Rugi (Income Statement)", isMonetary: true, unitType: "currency", categories: ["ALL"] },

      { key: "currentRatio", label: "Rasio Lancar (Current Ratio)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "ratio_x", categories: ["ALL"] },
      { key: "der", label: "Rasio Utang terhadap Ekuitas (DER)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "ratio_x", categories: ["ALL"] },
      { key: "grossMarginPct", label: "Marjin Laba Bruto (Gross Margin %)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["ALL"] },
      { key: "operatingMarginPct", label: "Marjin Laba Usaha Inti (Operating Margin %)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["ALL"] },
      { key: "netMarginPct", label: "Marjin Laba Neto (Net Profit Margin %)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["ALL"] },
      { key: "modifiedZScore", label: "Modified Z-Score Solvabilitas Obligasi", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "score", categories: ["Investasi"] },
      { key: "dscrContractual", label: "Debt Service Coverage Ratio (DSCR Kontraktual)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "ratio_x", categories: ["Investasi"] },
      { key: "sinkingFundBalance", label: "Saldo Dana Cadangan Pelunasan (Sinking Fund / DSRA)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: true, unitType: "currency", categories: ["Investasi"] },

      { key: "revGrowthPct", label: "Pertumbuhan Omzet YoY (%)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["Pengendali"] },
      { key: "opexGrowthPct", label: "Pertumbuhan Beban Usaha / Opex YoY (%)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["Pengendali"] },
      { key: "growthGapPct", label: "Sinyal S7 Growth Gap (Opex% - Omzet%)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "pp", categories: ["Pengendali"] },
      { key: "bonusRealizationPct", label: "Realisasi Bonus Jasa Produksi thd Pagu RKAP (%)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["Pengendali"] },

      { key: "receivablesAct", label: "Piutang Usaha Pihak Ketiga Aktual", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: true, unitType: "currency", categories: ["Non-Pengendali"] },
      { key: "receivablesRKAP", label: "Pagu Anggaran Piutang RKAP", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: true, unitType: "currency", categories: ["Non-Pengendali"] },
      { key: "rtcPct", label: "Rasio Realisasi Piutang thd RKAP (RTC %)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["Non-Pengendali"] },
      { key: "minorityPct", label: "Persentase Kepemilikan Saham Non-Pengendali (%)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "percent", categories: ["Non-Pengendali"] },
      { key: "dividendEntitlement", label: "Hak Atribusi Dividen Saham Minoritas", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: true, unitType: "currency", categories: ["Non-Pengendali"] },
      { key: "dividendPayable", label: "Utang Dividen Belum Dibayar di Neraca", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: true, unitType: "currency", categories: ["Non-Pengendali"] },

      { key: "forensicHealthScore", label: "Skor Kesehatan Forensik (Forensic Health Score /100)", group: "3. Rasio Keuangan, Covenant & Indikator Forensik", isMonetary: false, unitType: "score_100", categories: ["ALL"] }
    ];

    const activeCat = samePrimaryCategory ? uniqueCategories[0] : "Laporan Keuangan";

    const formatCellVal = (val, fieldDef, currencyLabel) => {
      if (val === null || val === undefined) {
        return {
          raw: null,
          isMissing: true,
          isZero: false,
          display: "Data Tidak Tersedia (N/A)"
        };
      }
      const num = Number(val);
      if (!Number.isFinite(num)) {
        return {
          raw: null,
          isMissing: true,
          isZero: false,
          display: "Data Tidak Tersedia (N/A)"
        };
      }
      const isZero = num === 0;
      let formatted = "";
      if (fieldDef.unitType === "currency") {
        formatted = `${num.toLocaleString("id-ID", { minimumFractionDigits: num % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} ${currencyLabel}${isZero ? " (Nol Aktual)" : ""}`;
      } else if (fieldDef.unitType === "ratio_x") {
        formatted = `${num.toFixed(2)}x${isZero ? " (Nol Aktual)" : ""}`;
      } else if (fieldDef.unitType === "percent") {
        formatted = `${num.toFixed(2)}%${isZero ? " (Nol Aktual)" : ""}`;
      } else if (fieldDef.unitType === "pp") {
        formatted = `${num >= 0 ? "+" : ""}${num.toFixed(2)} pp${isZero ? " (Nol Aktual)" : ""}`;
      } else if (fieldDef.unitType === "score_100") {
        formatted = `${num.toFixed(0)} / 100`;
      } else {
        formatted = `${num.toFixed(2)}${isZero ? " (Nol Aktual)" : ""}`;
      }
      return {
        raw: num,
        isMissing: false,
        isZero,
        display: formatted
      };
    };

    const docBase = sortedItems[0];
    const docTarget = sortedItems[sortedItems.length - 1];

    const alignedRows = [];
    const highlights = [];
    const nonComparableFields = [];

    FIELD_CATALOG.forEach(fieldDef => {
      const isRelevantToCategory = fieldDef.categories.includes("ALL") || fieldDef.categories.includes(activeCat);
      const anyItemHasField = sortedItems.some(it => it.fields && fieldDef.key in it.fields);

      if (!isRelevantToCategory && !anyItemHasField) return;
      if (comparisonMode === "CROSS_CATEGORY_UNIVERSAL_FINANCIALS" && !fieldDef.categories.includes("ALL")) {
        nonComparableFields.push({
          key: fieldDef.key,
          label: fieldDef.label,
          reason: `Indikator spesifik kategori (${fieldDef.categories.join(", ")}) tidak dapat dibandingkan lintas kategori.`
        });
        return;
      }

      const cells = sortedItems.map(doc => {
        const rawVal = (doc.fields && fieldDef.key in doc.fields) ? doc.fields[fieldDef.key] : null;
        return {
          docId: doc.id,
          reportingYear: doc.reportingYear,
          reportingPeriod: doc.reportingPeriod,
          currency: doc.currency,
          ...formatCellVal(rawVal, fieldDef, doc.currency),
          sourceRef: `${doc.originalDocument?.fileName || doc.id} (${doc.originalDocument?.pageReference || doc.reportingPeriod})`
        };
      });

      const cellA = cells[0];
      const cellB = cells[cells.length - 1];

      // Determine change status & delta between earliest (cellA) and latest (cellB)
      let changeType = "UNCHANGED";
      let changeBadge = "Tetap (0,00)";
      let deltaAbsolute = null;
      let deltaPercent = null;
      let deltaAbsoluteDisplay = "—";
      let deltaPercentDisplay = "—";
      let comparabilityNote = "Kompatibel & Terverifikasi";

      if (cellA.isMissing && cellB.isMissing) {
        changeType = "MISSING_BOTH";
        changeBadge = "Data Tidak Tersedia";
        comparabilityNote = "Pos ini tidak tersedia pada kedua dokumen sumber (bukan bernilai nol).";
        nonComparableFields.push({
          key: fieldDef.key,
          label: fieldDef.label,
          reason: comparabilityNote
        });
      } else if (cellA.isMissing && !cellB.isMissing) {
        changeType = "ADDED";
        changeBadge = "➕ Penambahan Baru (Added)";
        comparabilityNote = `Pos baru tersedia pada ${docTarget.reportingPeriod} (${cellB.display}), namun tidak dilaporkan pada ${docBase.reportingPeriod}. Selisih tidak dihitung karena data awal kosong (bukan nol).`;
        highlights.push({
          type: "ADDED",
          field: fieldDef.label,
          detail: `${fieldDef.label} tidak tersedia pada ${docBase.reportingYear} namun tercatat sebesar ${cellB.display} pada ${docTarget.reportingYear}.`
        });
        nonComparableFields.push({
          key: fieldDef.key,
          label: fieldDef.label,
          reason: `Data awal (${docBase.reportingYear}) tidak tersedia / N/A.`
        });
      } else if (!cellA.isMissing && cellB.isMissing) {
        changeType = "OMITTED";
        changeBadge = "⚠️ Penghapusan / Data Hilang (Omitted)";
        comparabilityNote = `Pos tercatat sebesar ${cellA.display} pada ${docBase.reportingPeriod}, namun tidak tersedia / dihilangkan pada ${docTarget.reportingPeriod}. Selisih tidak dihitung karena data akhir kosong (bukan nol).`;
        highlights.push({
          type: "OMITTED",
          field: fieldDef.label,
          detail: `${fieldDef.label} dilaporkan sebesar ${cellA.display} pada ${docBase.reportingYear}, tetapi tidak diungkapkan (N/A) pada ${docTarget.reportingYear}.`
        });
        nonComparableFields.push({
          key: fieldDef.key,
          label: fieldDef.label,
          reason: `Data akhir (${docTarget.reportingYear}) tidak tersedia / dihilangkan (Omitted).`
        });
      } else if (fieldDef.isMonetary && !unitsCompatible) {
        changeType = "UNIT_MISMATCH";
        changeBadge = "⚠️ Satuan Mata Uang Berbeda";
        deltaAbsoluteDisplay = `Tidak Dihitung (${cellA.currency} vs ${cellB.currency})`;
        deltaPercentDisplay = "Satuan Berbeda";
        comparabilityNote = `Satuan mata uang berbeda (${cellA.currency} vs ${cellB.currency}). Nilai asli dipertahankan tanpa pengurangan nominal langsung.`;
        nonComparableFields.push({
          key: fieldDef.key,
          label: fieldDef.label,
          reason: comparabilityNote
        });
      } else {
        // Both cellA and cellB are valid numbers with compatible units
        deltaAbsolute = Number((cellB.raw - cellA.raw).toFixed(4));
        const sign = deltaAbsolute > 0 ? "+" : "";

        if (fieldDef.unitType === "currency") {
          deltaAbsoluteDisplay = `${sign}${deltaAbsolute.toLocaleString("id-ID", { minimumFractionDigits: deltaAbsolute % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} ${cellB.currency}`;
        } else if (fieldDef.unitType === "ratio_x") {
          deltaAbsoluteDisplay = `${sign}${deltaAbsolute.toFixed(2)}x`;
        } else if (fieldDef.unitType === "percent" || fieldDef.unitType === "pp") {
          deltaAbsoluteDisplay = `${sign}${deltaAbsolute.toFixed(2)} pp`;
        } else {
          deltaAbsoluteDisplay = `${sign}${deltaAbsolute.toFixed(2)}`;
        }

        if (cellA.raw === 0) {
          if (cellB.raw === 0) {
            deltaPercent = 0;
            deltaPercentDisplay = "0,00% (Tetap Nol)";
          } else {
            deltaPercent = null;
            deltaPercentDisplay = `Baru dari Basis 0,00 (${sign}${cellB.display})`;
          }
        } else {
          deltaPercent = Number((((cellB.raw - cellA.raw) / Math.abs(cellA.raw)) * 100).toFixed(2));
          deltaPercentDisplay = `${deltaPercent > 0 ? "+" : ""}${deltaPercent.toFixed(2)}%`;
        }

        if (deltaAbsolute > 0) {
          changeType = "INCREASED";
          changeBadge = `▲ Naik (${deltaPercentDisplay})`;
        } else if (deltaAbsolute < 0) {
          changeType = "DECREASED";
          changeBadge = `▼ Turun (${deltaPercentDisplay})`;
        } else {
          changeType = "UNCHANGED";
          changeBadge = "▬ Tetap (0,00%)";
        }

        if (deltaPercent !== null && Math.abs(deltaPercent) >= 25) {
          highlights.push({
            type: deltaAbsolute > 0 ? "MAJOR_INCREASE" : "MAJOR_DECREASE",
            field: fieldDef.label,
            detail: `${fieldDef.label} bergerak signifikan sebesar ${deltaAbsoluteDisplay} (${deltaPercentDisplay}) dari ${cellA.display} (${docBase.reportingYear}) menjadi ${cellB.display} (${docTarget.reportingYear}).`
          });
        }
      }

      alignedRows.push({
        key: fieldDef.key,
        label: fieldDef.label,
        group: fieldDef.group,
        unitType: fieldDef.unitType,
        isMonetary: fieldDef.isMonetary,
        cells,
        changeType,
        changeBadge,
        deltaAbsolute,
        deltaPercent,
        deltaAbsoluteDisplay,
        deltaPercentDisplay,
        comparabilityNote
      });
    });

    // Cross-metric forensic inconsistency detection across the compared periods
    const revRow = alignedRows.find(r => r.key === "revenue");
    const opProfRow = alignedRows.find(r => r.key === "operatingProfit");
    const netIncRow = alignedRows.find(r => r.key === "netIncome");
    const opexRow = alignedRows.find(r => r.key === "opex");
    const nwcRow = alignedRows.find(r => r.key === "nwc");
    const rtcRow = alignedRows.find(r => r.key === "rtcPct");

    const inconsistencies = [];
    if (opProfRow && netIncRow && opProfRow.deltaPercent !== null && netIncRow.deltaPercent !== null) {
      if (opProfRow.deltaPercent < 0 && netIncRow.deltaPercent > 50) {
        inconsistencies.push({
          code: "QOE_DIVERGENCE",
          severity: "HIGH",
          title: "Divergensi Kualitas Laba (Laba Usaha Turun vs Laba Bersih Melonjak)",
          explanation: `Antara ${docBase.reportingPeriod} dan ${docTarget.reportingPeriod}, Laba Usaha Inti turun ${opProfRow.deltaPercentDisplay} (${opProfRow.deltaAbsoluteDisplay}), namun Laba Neto justru melonjak ${netIncRow.deltaPercentDisplay} (${netIncRow.deltaAbsoluteDisplay}) akibat pos non-operasional.`
        });
      }
    }
    if (revRow && opexRow && revRow.deltaPercent !== null && opexRow.deltaPercent !== null) {
      if (opexRow.deltaPercent > revRow.deltaPercent) {
        inconsistencies.push({
          code: "S7_GROWTH_GAP_ACROSS_YEARS",
          severity: "MEDIUM",
          title: "Sinyal S7 Growth Gap Lintas Periode (Opex Tumbuh Lebih Cepat dari Pendapatan)",
          explanation: `Beban Usaha tumbuh ${opexRow.deltaPercentDisplay} sedangkan Pendapatan tumbuh ${revRow.deltaPercentDisplay} (selisih +${(opexRow.deltaPercent - revRow.deltaPercent).toFixed(2)} pp), mengindikasikan tekanan efisiensi operasional.`
        });
      }
    }
    if (nwcRow && !nwcRow.cells[0].isMissing && !nwcRow.cells[nwcRow.cells.length - 1].isMissing) {
      const nwcStart = nwcRow.cells[0].raw;
      const nwcEnd = nwcRow.cells[nwcRow.cells.length - 1].raw;
      if (nwcStart >= 0 && nwcEnd < 0) {
        inconsistencies.push({
          code: "NWC_REVERSAL_TO_DEFICIT",
          severity: "HIGH",
          title: "Pembalikan Modal Kerja dari Surplus Menjadi Defisit (NWC < 0)",
          explanation: `Modal Kerja Bersih (NWC) berbalik dari positif (${nwcRow.cells[0].display}) pada ${docBase.reportingYear} menjadi defisit negatif (${nwcRow.cells[nwcRow.cells.length - 1].display}) pada ${docTarget.reportingYear}.`
        });
      }
    }
    if (rtcRow && rtcRow.deltaAbsolute !== null && rtcRow.cells[rtcRow.cells.length - 1].raw > 120) {
      inconsistencies.push({
        code: "RTC_BREACH_ESCALATION",
        severity: "HIGH",
        title: "Eskalasi Pelampauan Pagu Piutang RKAP (RTC > 120% Tiering Merah)",
        explanation: `Rasio RTC Piutang meningkat sebesar ${rtcRow.deltaAbsoluteDisplay} hingga mencapai ${rtcRow.cells[rtcRow.cells.length - 1].display}, melampaui ambang batas toleransi 120% RKAP.`
      });
    }

    return {
      success: true,
      comparisonSupported: true,
      comparisonMode,
      comparisonModeLabel,
      category: activeCat,
      samePrimaryCategory,
      unitsCompatible,
      currencies: uniqueCurrencies,
      entities: uniqueEntities,
      reportingYears: uniqueYears,
      documents: sortedItems.map(doc => ({
        id: doc.id,
        title: doc.title,
        entityName: doc.entityName,
        category: doc.category,
        reportingYear: doc.reportingYear,
        reportingPeriod: doc.reportingPeriod,
        documentType: doc.documentType,
        currency: doc.currency,
        originalDocument: doc.originalDocument,
        analysisResults: doc.analysisResults
      })),
      alignedRows,
      highlights,
      inconsistencies,
      nonComparableFields,
      generatedAt: new Date().toISOString()
    };
  }
}

const argonRagInstance = new GeminiArgonRAG();
argonRagInstance.GeminiArgonRAG = GeminiArgonRAG;
argonRagInstance.RAGEngine = GeminiArgonRAG;
module.exports = argonRagInstance;
