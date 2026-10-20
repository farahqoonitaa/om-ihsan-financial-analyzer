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
    this.initKnowledgeBase();
    this.initDeepDiveTree();
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
}

const argonRagInstance = new GeminiArgonRAG();
argonRagInstance.GeminiArgonRAG = GeminiArgonRAG;
argonRagInstance.RAGEngine = GeminiArgonRAG;
module.exports = argonRagInstance;
