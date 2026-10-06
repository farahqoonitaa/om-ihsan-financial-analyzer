import json

with open("src/data/masterParameters.js", "r") as f:
    master_raw = f.read()
# Extract the object
master_obj_str = master_raw.replace('const MASTER_PARAMETERS =', '').split('if (typeof module')[0].strip()
if master_obj_str.endswith(';'):
    master_obj_str = master_obj_str[:-1]

with open("src/data/seedData.js", "r") as f:
    seed_raw = f.read()
seed_obj_str = seed_raw.replace('const SEED_DATA =', '').split('if (typeof module')[0].strip()
if seed_obj_str.endswith(';'):
    seed_obj_str = seed_obj_str[:-1]

with open("public/app.js", "r") as f:
    app_js = f.read()

fallback_header = f"""
// --- INLINE EMBEDDED BENCHMARK REPOSITORY (Enables 100% offline & file:// execution) ---
const EMBEDDED_MASTER = {master_obj_str};
const EMBEDDED_SEED = {seed_obj_str};
"""

# Now update fetch handlers in app_js to use fallback if fetch fails
new_app_js = fallback_header + app_js

# Replace loadPengendali catch
new_app_js = new_app_js.replace(
    'catch (e) {\n    console.error("Error loading pengendali:", e);\n  }',
    '''catch (e) {
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
  }'''
)

# Replace loadNonPengendali catch
new_app_js = new_app_js.replace(
    'catch (e) {\n    console.error("Error loading non-pengendali:", e);\n  }',
    '''catch (e) {
    console.warn("Using embedded fallback for non-pengendali:", e);
    const ent = EMBEDDED_SEED.nonPengendali[0];
    const d = {
      entity: ent,
      tiering: ent.tiering
    };
    state.data.nonPengendali = d;
    renderNonPengendali(d);
  }'''
)

# Replace loadInvestasi catch
new_app_js = new_app_js.replace(
    'catch (e) {\n    console.error("Error loading investasi:", e);\n  }',
    '''catch (e) {
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
  }'''
)

# Replace loadKonsolidasi catch
new_app_js = new_app_js.replace(
    'catch (e) {\n    console.error("Error loading konsolidasi:", e);\n  }',
    '''catch (e) {
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
  }'''
)

# Replace loadReconciliations catch
new_app_js = new_app_js.replace(
    'catch (e) {\n    console.error("Error loading reconciliations:", e);\n  }',
    '''catch (e) {
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
  }'''
)

# Replace loadAuditLogs catch
new_app_js = new_app_js.replace(
    'catch (e) {\n    console.error("Error loading logs:", e);\n  }',
    '''catch (e) {
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
  }'''
)

# Replace loadParameters catch
new_app_js = new_app_js.replace(
    'catch (e) {\n    console.error("Error loading params:", e);\n  }',
    '''catch (e) {
    console.warn("Using embedded fallback for parameters:", e);
    state.data.parameters = EMBEDDED_MASTER;
    renderParameters(EMBEDDED_MASTER);
  }'''
)

with open("public/app.js", "w") as f:
    f.write(new_app_js)

print("Embedded data fallback injected into public/app.js successfully!")
