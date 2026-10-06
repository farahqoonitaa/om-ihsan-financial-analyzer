/**
 * Local RAG Engine (Retrieval-Augmented Generation)
 * Indexes PRDs, Kajian Ihsan guidelines, financial taxonomy, and reference cases.
 * Provides grounded context with document names, section numbers, and exact page citations.
 */

const fs = require("fs");
const path = require("path");

class RAGEngine {
  constructor() {
    this.documents = [];
    this.initKnowledgeBase();
  }

  initKnowledgeBase() {
    // Grounded knowledge chunks from PRD and Kajian Ihsan
    this.documents = [
      {
        id: "DOC-PRD-EPS-01",
        source: "PRD Pengendali YKPP × PT EPS (Laporan Manajemen → Nota Dinas)",
        section: "Bagian 1: Karakteristik Input & Output",
        page: "hlm. 1-3",
        text: "Input entitas pengendali adalah Laporan Manajemen bulanan (23 halaman) yang terdiri dari 9 blok: Cover, Surat Pengantar, Neraca, Laba Rugi Komprehensif, Arus Kas, Perubahan Ekuitas, CALK Notes 1-24, Realisasi Anggaran RKAP, dan Laba Rugi per Unit Bisnis. Output adalah Nota Dinas Hasil Verifikasi berstruktur 19 bagian dengan stance verifikator: temuan adalah indikasi yang memerlukan klarifikasi, bukan opini audit."
      },
      {
        id: "DOC-PRD-EPS-02",
        source: "PRD Pengendali YKPP × PT EPS (Signal Library)",
        section: "Sinyal Forensik S1 - S10",
        page: "hlm. 8-10",
        text: "10 Sinyal Forensik: S1 Movement (|Δ%| ≥ 50%), S2 Static Balance (Δ = 0 pada akun yang seharusnya bergerak seperti cadangan), S3 Anomalous Sign (cadangan tujuan bernilai negatif), S4 Footing / Cross-Check Breaks (selisih neraca vs CALK), S5 Policy / Tax Rate Breaks (perubahan tarif pajak efektif 22% vs 25%), S6 Non-Operating Spikes, S7 Growth Gap (Opex tumbuh lebih cepat dari omzet, opex +32,91% vs omzet +31,45%), S8 Segment Decline (penurunan pendapatan lini usaha > 10% atau rugi unit), S9 Budget Pacing (lonjakan tunjangan bonus jasa produksi 2.308% dari RKAP), S10 Related Party Concentration."
      },
      {
        id: "DOC-PRD-POJ-01",
        source: "PRD Non-Pengendali YKPP × PT POJ (55 hlm LK Juli/Agustus 2026)",
        section: "Minority Shareholder Stance & Governance",
        page: "hlm. 16-19",
        text: "YKPP berkedudukan sebagai pemegang saham non-pengendali pada PT POJ dengan kepemilikan 1.000 lembar (1,00%). Monitoring YKPP difokuskan pada perlindungan hak ekonomi, kepastian dividen, risiko refinancing, capital call, dan kualitas laba. Hasil analisis dikelompokkan dalam tingkat perhatian Merah, Kuning, dan Hijau."
      },
      {
        id: "DOC-PRD-POJ-02",
        source: "PRD Non-Pengendali YKPP × PT POJ",
        section: "Temuan Kritis & Pertanyaan Kritis",
        page: "hlm. 27-29",
        text: "Temuan Merah PT POJ meliputi: 1. Likuiditas & Defisit Modal Kerja: Current ratio 0,52x, NWC negatif -Rp347,18 Miliar, serta utang dividen Rp110,27 Miliar di liabilitas lancar. 2. Leverage & Pinjaman: Total pinjaman Rp727,97 Miliar vs ekuitas Rp479,58 Miliar (DER 2,19x). 3. Lonjakan Piutang Pihak Ketiga Mencapai 301,20% terhadap target RKAP (realisasi Rp91,18 M vs target Rp30,27 M). Setiap temuan Merah wajib menyertakan rumusan Pertanyaan Kritis terstruktur untuk manajemen."
      },
      {
        id: "DOC-OBLIGASI-01",
        source: "Skema Analisis Obligasi & Modified Z-Score (Kajian Ihsan)",
        section: "Formula Modified Z-Score & Batas Covenant",
        page: "hlm. 4 & 15",
        text: "Formula Modified Z-Score anualisasi: Z = -3,337 + 0,736*WK_TA + 6,95*CASHPROF_TA + 0,864*SOLVR + 7,554*OPPROF_TA + 1,544*SALES_TA. Pada interim semester I, komponen laba riil, laba operasional, dan penjualan dikalikan 2. Batas: Z > 0 Aman / kemungkinan gagal bayar rendah; -0,5 s/d 0 Cukup Aman; -1,0 s/d -0,5 Butuh Peninjauan; < -1,0 Tidak Aman. PT Daaz Bara Lestari Tbk menghasilkan skor 2,54 (Aman)."
      },
      {
        id: "DOC-OBLIGASI-02",
        source: "Kajian Risiko PT Pegadaian (Posisi Dasar Juni dengan Risk Overlay September 2026)",
        section: "Risk Overlay & Collateral Realization",
        page: "hlm. 1-4",
        text: "PT Pegadaian mencatat Altman Z-Score 6,35 dan Modified Z-Score 0,33 per 30 Juni 2026. Namun terdapat Risk Overlay September 2026 berupa exposure agunan Rp20 Triliun yang memerlukan realisasi jaminan dengan asumsi stress loss Rp2 Triliun (loss severity 10%, recovery 90%). Karena buffer Modified Z-Score tipis (0,33) dan piutang mencapai 88,05% dari aset lancar, kesimpulan ditempatkan pada YELLOW - Enhanced Monitoring hingga laporan September definitif terbit."
      },
      {
        id: "DOC-KONSOLIDASI-01",
        source: "Arsitektur Konsolidasi Grup Yayasan (Presentasi Pak Ihsan)",
        section: "Atribusi NCI IFRS 10 & Aturan Forensik",
        page: "Slide 4-8",
        text: "Konsolidasi Grup 6 entitas menghasilkan pendapatan konsolidasi $3.885,0 M dan laba bersih konsolidasi $325,0 M (Parent Attributable $279,7 M / 86,1%, NCI Minority $45,3 M / 13,9%). Konsolidasi DER 0,96x berada jauh di bawah batas maksimum regulasi POJK 5,0x. Konsolidasi ROA 5,4% berada di atas rata-rata industri microfinance (3,5% - 5,2%). Terdeteksi NCI profit mismatch pada Subsidiary II sebesar +34,1% (melebihi toleransi 8%) dan lonjakan piutang berelasi +158,8% (melebihi ambang batas 30%)."
      },
      {
        id: "DOC-MOM-01",
        source: "MOM: Analisis Laporan Keuangan (Draft Terstruktur)",
        section: "Alur Terpadu 3 Fungsi, Definisi RTC & 8 Action Items",
        page: "Notulensi",
        text: "MOM menyepakati 3 alur analisis dalam 1 platform terpadu: 1. Entitas Pengendali (Kajian Ihsan) -> Analisis vertikal dan horizontal; 2. Entitas Non-Pengendali (Kajian Ihsan) -> Analisis vertikal dan horizontal; 3. Investasi (Kajian docs) -> Analisis komparasi 4 periode: Tahun lalu, Bulan lalu, YoY %, dan RTC (Realisasi Terhadap Cita-cita / RKAP %). Agenda hari ini: analisis untuk 2 investasi dan 2 entitas pengendali, lalu ditutup dengan analisis akhir (konsolidasi). RTC didefinisikan sebagai Realisasi Terhadap Cita-cita (Realisasi Aktual / Target RKAP)."
      }
    ];
  }

  // Cari dokumen relevan berdasarkan query pengguna
  search(query, topK = 3) {
    if (!query || typeof query !== "string") return [];
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (tokens.length === 0) return this.documents.slice(0, topK);

    const scored = this.documents.map(doc => {
      let score = 0;
      const hay = (doc.source + " " + doc.section + " " + doc.text).toLowerCase();
      tokens.forEach(token => {
        if (hay.includes(token)) score += 2;
        // Bobot lebih untuk kata kunci keuangan kunci
        if (["nci", "der", "pojk", "z-score", "rtc", "rkap", "piutang", "eps", "poj", "daaz", "pegadaian"].includes(token) && hay.includes(token)) {
          score += 5;
        }
      });
      return { ...doc, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  // Buat context string terformat untuk prompt AI
  buildGroundedContext(query) {
    const hits = this.search(query, 3);
    let ctx = "=== GROUNDED KNOWLEDGE & REGULATORY RULES (RAG) ===\n";
    hits.forEach((h, i) => {
      ctx += `[Sumber ${i + 1}]: ${h.source} | ${h.section} (${h.page})\nKutipan: \"${h.text}\"\n\n`;
    });
    return ctx;
  }
}

module.exports = new RAGEngine();
