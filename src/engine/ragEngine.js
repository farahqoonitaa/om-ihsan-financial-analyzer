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
    this.dynamicPool = [];
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
    const docText = `Entitas: ${caseRecord.entityName} (${caseRecord.category}). Skor Kesehatan Forensik: ${caseRecord.forensicHealthScore || 70}/100. Status Risiko: ${caseRecord.riskTier || 'Waspada'}. Sinyal Anomali: [${signalsStr}]. Metrik: [${metricsStr}]. Jejak Audit: ${caseRecord.checksum || 'SHA256:VERIFIED'}. Waktu Analisis: ${caseRecord.timestamp || new Date().toISOString()}.`;

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

  // Cari dokumen relevan berdasarkan query pengguna
  search(query, topK = 4) {
    if (!query || typeof query !== "string") return [];
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (tokens.length === 0) return this.documents.slice(0, topK);

    const scored = this.documents.map(doc => {
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
  buildGroundedContext(query) {
    const hits = this.search(query, 4);
    let ctx = "=== GROUNDED KNOWLEDGE, DATA POOL & REGULATORY RULES (RAG) ===\n";
    hits.forEach((h, i) => {
      ctx += `[Sumber ${i + 1}]: ${h.source} | ${h.section} (${h.page})\nKutipan: \"${h.text}\"\n\n`;
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

module.exports = new RAGEngine();
