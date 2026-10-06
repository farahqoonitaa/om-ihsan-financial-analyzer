# Unified AI Financial Statement Analysis Platform (Om Ihsan / YKPP)

Platform Terpadu AI Analisis Laporan Keuangan berbasis web dengan 3 alur analisis deterministik, konsolidasi multi-entitas, kepatuhan regulasi POJK DER ≤ 5,0x & IFRS 10 / PSAK 65, serta asisten AI Financial Forensic Copilot dengan mesin Retrieval-Augmented Generation (RAG).

## 📊 3 Alur Analisis Utama

1. **Input Pengendali (Controlling Entity):**
   - Analisis vertikal (COGS, Opex, Laba Bersih) & horizontal (Pertumbuhan YoY vs RKAP).
   - Uji keseimbangan neraca (*Footing Check*).
   - Deteksi sinyal S7 *Growth Gap* (Pertumbuhan Opex melampaui Pertumbuhan Omzet).
   - Draf otomatis Nota Dinas hasil audit.

2. **Input Non-Pengendali (Non-Controlling Entity):**
   - Perspektif pemegang saham minoritas (*Non-Controlling Interests / NCI*).
   - Analisis realisasi piutang pihak ketiga terhadap pagu anggaran (*RTC Bands*).
   - Tiering risiko perhatian (Merah > 120%, Kuning, Hijau).
   - Proteksi hak dividen minoritas dan pencegahan *capital call*.

3. **Input Skema Investasi (Investment Scheme):**
   - Portofolio obligasi & sukuk korporasi.
   - Komparasi 4 dimensi baku (MoM, YoY, YoY%, RTC%).
   - Evaluasi solvabilitas *Modified Altman Z-Score* dengan pengali anualisasi semesteran (Safe Zone ≥ 2,0x).
   - Simulasi stres agunan (*Risk Overlay*).

4. **Konsolidasi Akhir Grup (Multi-Entitas):**
   - Agregasi menyeluruh neraca & laba rugi holding multi-entitas.
   - Eliminasi 100% transaksi resiprokal afiliasi antar-anak usaha.
   - Rekonsiliasi atribusi ekuitas hak non-pengendali sesuai IFRS 10 / PSAK 65.
   - Verifikasi kepatuhan batas legal solvabilitas POJK (DER ≤ 5,0x).

## 🤖 Fitur AI Forensic Copilot (RAG Engine)

- **Antigravity-Style Thinking Process:** Menampilkan langkah penalaran visual bertahap dengan *live duration timer*.
- **Lampiran Dokumen di Chat (`📎`):** Unggah dokumen keuangan (`.xlsx`, `.xls`, `.pdf`, `.json`) langsung di drawer chat dengan auto-klasifikasi tipe entitas.
- **Audit Trail & Provenance:** Pencatatan stempel audit kriptografis (SHA-256) pada setiap respon dengan prinsip *Zero-Persistence* murni di memori RAM peramban. Modal log sesi interaktif dan ekspor log CSV.
- **Bilingual Support:** Pengalihan instan Bahasa Indonesia (`ID`) dan Bahasa Inggris (`EN`).

## 🚀 Menjalankan Aplikasi

```bash
# Jalankan server lokal
PORT=3005 node server.js
```

Buka peramban di:
```
http://localhost:3005
```

## 🧪 Menjalankan Pengujian

```bash
node scripts/test_calculation_modules.mjs && node scripts/verify_system.js
```
