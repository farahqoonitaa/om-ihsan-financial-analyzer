/**
 * Reconciliation Engine (Action Item 5: Rekonsiliasi Selisih Angka Antar Sumber & Dokumentasi Penyebab)
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_RECONCILIATIONS = [
  {
    id: "REC-01",
    entity: "PT Daaz Bara Lestari Tbk",
    metric: "Modified Z-Score",
    sourceExcel: 0.33,
    sourceKajian: 2.54,
    sourceAI: 2.541,
    delta: "+2.21 (Antara Excel Mentah vs Model Anualisasi)",
    rootCauseCategory: "Metodologi Anualisasi",
    rootCauseExplanation: "Excel mentah menggunakan angka 6 bulan interim tanpa pengali x2 pada Laba Bersih, Laba Operasi, dan Penjualan. Kajian Ihsan dan AI menerapkan formula standar anualisasi (x2 untuk interim semesteran) sehingga menghasilkan skor 2,54.",
    reconciliationAction: "Gunakan angka anualisasi 2,54 sebagai standar baku untuk emiten dengan LK interim semester I."
  },
  {
    id: "REC-02",
    entity: "PT Pesonna Optima Jasa",
    metric: "Pertumbuhan Omzet YoY",
    sourceExcel: "+42,40%",
    sourceKajian: "+28,15%",
    sourceAI: "+42,40% (Flagged Period Mismatch)",
    delta: "+14,25 pp (Selisih distorsi periode pembanding)",
    rootCauseCategory: "Period Mismatch (Salah Tanding Periode)",
    rootCauseExplanation: "Memo dan Excel Agustus membandingkan YTD 8 bulan 2026 (Rp1.512 M) dengan YTD 7 bulan Juli 2025 (Rp1.062 M) sehingga pertumbuhan tampak menggembung +42,4%. Kajian Ihsan mengidentifikasi pembanding yang benar adalah Juli-on-July (+28,15%).",
    reconciliationAction: "Dokumentasikan di Nota Dinas bahwa perbandingan menggunakan basis periode yang setara untuk menghindari distorsi optimisme semu."
  },
  {
    id: "REC-03",
    entity: "PT Era Permata Sejahtera",
    metric: "Hutang Pajak (CALK vs Neraca)",
    sourceExcel: "Rp4.499.425.447",
    sourceKajian: "Rp4.499.425.442",
    sourceAI: "Rp4.499.425.447 (CALK Break +Rp5)",
    delta: "Rp5 (Trivial)",
    rootCauseCategory: "Rounding / Footing Inconsistency",
    rootCauseExplanation: "Selisih Rp5 timbul dari pembulatan pecahan desimal pada subsistem PPh pasal 21/23 yang diagregasi ke Note 12 CALK.",
    reconciliationAction: "Catat dalam audit log sebagai varians pembulatan (non-material, tidak memerlukan koreksi jurnal)."
  },
  {
    id: "REC-04",
    entity: "PT Era Permata Sejahtera",
    metric: "Beban Kantor Pusat Tak Teralokasi",
    sourceExcel: "Rp7,66 Miliar",
    sourceKajian: "Rp6,57 Miliar (Dialokasi)",
    sourceAI: "Rp1,09 Miliar (Selisih Unallocated)",
    delta: "Rp1,09 Miliar",
    rootCauseCategory: "Alokasi Pembebanan Biaya Segmen",
    rootCauseExplanation: "Total beban kantor pusat sebesar Rp7,66 M hanya dialokasikan sebesar Rp6,57 M ke unit bisnis outsourcing dan non-outsourcing, meninggalkan sisa beban tak teralokasi Rp1,09 M yang menekan laba bersih kantor pusat.",
    reconciliationAction: "Wajibkan unit akuntansi menyajikan formula kunci alokasi (cost driver) yang konsisten 100% terserap."
  },
  {
    id: "REC-05",
    entity: "PT Pegadaian",
    metric: "Status Risiko Default September 2026",
    sourceExcel: "GREEN (Z-Score 6,35)",
    sourceKajian: "YELLOW (Enhanced Monitoring)",
    sourceAI: "YELLOW (Risk Overlay Rp20T / Loss Rp2T)",
    delta: "Perbedaan Model Statis vs Forward-Looking Stress Overlay",
    rootCauseCategory: "Risk Overlay & Kualitas Aset",
    rootCauseExplanation: "Excel hanya membaca neraca historis 30 Juni 2026. Kajian Ihsan & AI memasukkan risk overlay September 2026 berupa exposure agunan Rp20 Triliun dengan asumsi stress loss Rp2 Triliun yang berpotensi mengikis buffer Modified Z-Score yang berada di posisi 0,33.",
    reconciliationAction: "Tetapkan status resmi pada YELLOW - Enhanced Monitoring hingga laporan keuangan September definitif tersedia."
  }
];

function getReconciliations() {
  return DEFAULT_RECONCILIATIONS;
}

module.exports = {
  getReconciliations
};
