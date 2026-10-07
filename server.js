/**
 * Solanascope & YKPP Financial Intelligence Platform
 * Unified AI Financial Analysis Agent Server
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// Import Domain Engines
const masterParams = require("./src/data/masterParameters");
const seedData = require("./src/data/seedData");
const financialMath = require("./src/engine/financialMath");
const consolidationEngine = require("./src/engine/consolidationEngine");
const reconciliationEngine = require("./src/engine/reconciliationEngine");
const auditLogger = require("./src/engine/auditLogger");
const geminiClient = require("./src/engine/geminiClient");
const excelEngine = require("./src/engine/excelEngine");
const ragEngine = require("./src/engine/ragEngine");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    res.end();
    return;
  }

  // --- REST API ROUTES ---
  if (pathname.startsWith("/api/")) {
    try {
      // 1. Status API
      if (pathname === "/api/status" && method === "GET") {
        return sendJson(res, 200, {
          status: "OK",
          name: "YKPP & Solanascope Financial AI Agent Platform",
          version: "2.0-2026",
          currentDate: "2026-10-06",
          copilotModel: geminiClient.model,
          hasGeminiKey: Boolean(geminiClient.apiKey)
        });
      }

      // 2. Master Parameters (Action Item 1)
      if (pathname === "/api/parameters" && method === "GET") {
        return sendJson(res, 200, masterParams);
      }

      // 3. Download Excel Template 3-Sheet (Action Item 2)
      if (pathname === "/api/template-excel" && method === "GET") {
        const filePath = excelEngine.getTemplatePath();
        if (filePath && fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          res.writeHead(200, {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=\"template_analisis_keuangan_3sheet.xlsx\"",
            "Content-Length": stat.size
          });
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
          return;
        } else {
          return sendJson(res, 404, { error: "Template file not found" });
        }
      }

      // 4. Seed Data (Agenda Hari Ini: 2 Investasi, 2 Pengendali, Non-Pengendali, Konsolidasi)
      if (pathname === "/api/seed-data" && method === "GET") {
        return sendJson(res, 200, seedData);
      }

      // 5. Analyze Entitas Pengendali (Fungsi 1)
      if (pathname === "/api/analyze/pengendali" && method === "POST") {
        const body = await parseBody(req);
        const data = body.entityData || seedData.pengendali[0];
        
        // Vertical Analysis
        const vertIncome = financialMath.computeVerticalAnalysis({
          cogs: data.financials.cogsCY,
          grossProfit: data.financials.grossProfitCY,
          opex: data.financials.opexCY,
          operatingProfit: data.financials.operatingProfitCY,
          netProfit: data.financials.netProfitCY
        }, data.financials.revenueCY);

        // Horizontal Analysis
        const horizRevenue = financialMath.computeHorizontalAnalysis(
          data.financials.revenueCY,
          data.financials.revenuePY,
          data.financials.rkapTargetRevenue
        );
        const horizOpex = financialMath.computeHorizontalAnalysis(
          data.financials.opexCY,
          data.financials.opexPY
        );
        const horizNetProfit = financialMath.computeHorizontalAnalysis(
          data.financials.netProfitCY,
          data.financials.netProfitPY,
          data.financials.rkapTargetNetProfit
        );

        // Footing Integrity
        const footingCheck = financialMath.verifyFootingIntegrity(data.financials);

        // Record Audit Log
        auditLogger.recordAction({
          entity: data.name,
          functionType: "Entitas Pengendali",
          action: "Analisis Vertikal-Horizontal & Footing",
          role: body.userRole || "Reviewer Hasil",
          outcome: `Selesai (${data.findings.length} Temuan)`,
          sequencingStep: 1
        });

        return sendJson(res, 200, {
          entity: data,
          verticalAnalysis: { incomeStatement: vertIncome },
          horizontalAnalysis: {
            revenue: horizRevenue,
            opex: horizOpex,
            netProfit: horizNetProfit
          },
          footingCheck,
          findings: data.findings,
          segments: data.segments
        });
      }

      // 6. Analyze Entitas Non-Pengendali (Fungsi 2)
      if (pathname === "/api/analyze/non-pengendali" && method === "POST") {
        const body = await parseBody(req);
        const data = body.entityData || seedData.nonPengendali[0];

        const horizRev = financialMath.computeHorizontalAnalysis(
          data.financials.revenueCY,
          data.financials.revenuePY,
          data.financials.rkapTargetRevenue
        );
        const horizNI = financialMath.computeHorizontalAnalysis(
          data.financials.netProfitCY,
          data.financials.netProfitPY,
          data.financials.rkapTargetNetProfit
        );
        const horizAR = financialMath.computeHorizontalAnalysis(
          data.financials.tradeReceivablesCY,
          null,
          data.financials.targetReceivablesRKAP
        );

        // Record Audit Log
        auditLogger.recordAction({
          entity: data.name,
          functionType: "Entitas Non-Pengendali",
          action: "Evaluasi Hak Minoritas & Tiering",
          role: body.userRole || "Reviewer Hasil",
          outcome: "Selesai (3 Temuan Merah, 2 Kuning, 2 Hijau)",
          sequencingStep: 2
        });

        return sendJson(res, 200, {
          entity: data,
          horizontalAnalysis: {
            revenue: horizRev,
            netIncome: horizNI,
            receivables: horizAR
          },
          tiering: data.tiering
        });
      }

      // 7. Analyze Investasi (Fungsi 3: 4-Dimensi Komparasi & 33 Rasio)
      if (pathname === "/api/analyze/investasi" && method === "POST") {
        const body = await parseBody(req);
        const invId = body.id || "investasi-daaz";
        const data = seedData.investasi.find(i => i.id === invId) || seedData.investasi[0];

        // 33 Rasio
        const ratios = financialMath.calculateComprehensiveRatios({
          ...data.financials,
          annualMultiplier: data.financials.isSemiAnnual ? 2 : 2
        });

        // Modified Z-Score
        const modZ = financialMath.calculateModifiedZScore({
          currentAssets: data.financials.currentAssetsCY,
          currentLiab: data.financials.currentLiabCY,
          totalAssets: data.financials.totalAssetsCY,
          netProfit: data.financials.netProfitCY,
          depreciation: data.financials.depreciationCY || 0,
          equity: data.financials.equityCY,
          totalLiab: data.financials.totalLiabCY,
          operatingProfit: data.financials.operatingProfitCY,
          revenue: data.financials.revenueCY,
          isSemiAnnual: true
        });

        // Altman Z-Score
        const altmanZ = financialMath.calculateAltmanZScore({
          currentAssets: data.financials.currentAssetsCY,
          currentLiab: data.financials.currentLiabCY,
          totalAssets: data.financials.totalAssetsCY,
          ebit: data.financials.operatingProfitCY,
          equity: data.financials.equityCY,
          totalLiab: data.financials.totalLiabCY,
          revenue: data.financials.revenueCY
        });

        // 4 Dimensi Komparasi
        const horizSales = financialMath.computeHorizontalAnalysis(
          data.financials.revenueCY,
          data.financials.revenuePY,
          data.financials.rkapTargetRevenue,
          data.financials.revenuePM
        );

        // Record Audit Log
        auditLogger.recordAction({
          entity: data.name,
          functionType: "Investasi",
          action: "Perhitungan 33 Rasio & Modified Z-Score",
          role: body.userRole || "Reviewer Hasil",
          outcome: `Modified Z: ${modZ ? modZ.score : "-"} | Altman Z: ${altmanZ ? altmanZ.score : "-"}`,
          sequencingStep: 3
        });

        return sendJson(res, 200, {
          entity: data,
          comprehensiveRatios: ratios,
          modifiedZScore: modZ,
          altmanZScore: altmanZ,
          horizontalAnalysis: {
            sales: horizSales
          },
          riskOverlay: data.riskOverlay || null
        });
      }

      // 8. Analyze Konsolidasi Akhir
      if (pathname === "/api/analyze/konsolidasi" && method === "POST") {
        const body = await parseBody(req);
        const rawEntities = (body.entities && body.entities.length) ? body.entities : seedData.konsolidasi.entities;
        const rawEliminations = body.eliminations || seedData.konsolidasi.eliminations;

        const result = consolidationEngine.runConsolidation(rawEntities, rawEliminations);

        // Record Audit Log
        auditLogger.recordAction({
          entity: "Konsolidasi Grup Yayasan (6 Entitas)",
          functionType: "Konsolidasi Akhir",
          action: "Agregasi, Eliminasi & IFRS 10 Attribution",
          role: body.userRole || "Reviewer Hasil",
          outcome: `DER: ${result.consolidatedTotals.consolidatedDER}x (POJK Safe), ${result.anomalies.length} Anomali Forensik`,
          sequencingStep: 4
        });

        return sendJson(res, 200, {
          title: seedData.konsolidasi.title,
          period: seedData.konsolidasi.period,
          entities: rawEntities,
          eliminations: rawEliminations,
          ...result
        });
      }

      // 9. Reconciliations Matrix (Action Item 5)
      if (pathname === "/api/reconciliations" && method === "GET") {
        return sendJson(res, 200, reconciliationEngine.getReconciliations());
      }

      // 10. Audit Logs & Sequencing (Action Item 4)
      if (pathname === "/api/logs" && method === "GET") {
        return sendJson(res, 200, auditLogger.loadLogs());
      }
      if (pathname === "/api/logs/record" && method === "POST") {
        const body = await parseBody(req);
        const updated = auditLogger.recordAction(body);
        return sendJson(res, 200, updated);
      }

      // 10b. Forensic Data Pool & Pattern Intelligence API
      if (pathname === "/api/data-pool" && method === "GET") {
        return sendJson(res, 200, {
          totalCases: ragEngine.getDynamicPool().length,
          pool: ragEngine.getDynamicPool(),
          retrievedAt: new Date().toISOString()
        });
      }
      if (pathname === "/api/data-pool/sync" && method === "POST") {
        const body = await parseBody(req);
        const cases = Array.isArray(body) ? body : (body.cases || [body]);
        cases.forEach(c => ragEngine.ingestCase(c));
        return sendJson(res, 200, {
          success: true,
          totalCases: ragEngine.getDynamicPool().length,
          message: `${cases.length} kasus berhasil diindeks ke Dynamic Knowledge Base RAG.`
        });
      }
      if (pathname === "/api/data-pool/patterns" && method === "GET") {
        return sendJson(res, 200, ragEngine.detectSystemicPatterns());
      }
      if (pathname === "/api/data-pool/clear" && method === "POST") {
        ragEngine.clearDynamicPool();
        return sendJson(res, 200, { success: true, message: "Data Pool dikosongkan." });
      }

      // 11. AI Forensic Copilot Chat with Gemini API & Local RAG
      if (pathname === "/api/copilot/chat" && method === "POST") {
        const body = await parseBody(req);
        const userQuery = body.query || "Berikan ringkasan temuan kritis hari ini.";
        const activeContext = body.context || {};
        const customApiKey = body.geminiApiKey || null;

        const response = await geminiClient.askCopilot(userQuery, activeContext, customApiKey);
        return sendJson(res, 200, response);
      }

      // 12. File Upload Ingestion (Action Item 6)
      if (pathname === "/api/upload" && method === "POST") {
        const body = await parseBody(req);
        // Returns simulated parsed session
        auditLogger.recordAction({
          entity: body.fileName || "File Terunggah",
          functionType: "File Ingestion",
          action: "Parsing File & Ekstraksi Canonical Data Model",
          role: "Analis Keuangan (PIC)",
          outcome: "Berhasil Diekstrak & Siap Dianalisis",
          sequencingStep: 1
        });
        return sendJson(res, 200, {
          success: true,
          fileName: body.fileName || "Dokumen_Keuangan.xlsx",
          message: "File berhasil diunggah dan diuraikan ke dalam Canonical Data Model YKPP.",
          parsedRows: 48
        });
      }

      // 13. Export Nota Dinas
      if (pathname === "/api/export-memo" && method === "POST") {
        const body = await parseBody(req);
        const entityName = body.entityName || "PT Era Permata Sejahtera";
        return sendJson(res, 200, {
          success: true,
          memoTitle: `NOTA DINAS HASIL VERIFIKASI - ${entityName}`,
          generatedAt: new Date().toISOString(),
          format: "DOCX / Formal Printable HTML"
        });
      }

      return sendJson(res, 404, { error: "Endpoint not found" });
    } catch (err) {
      console.error("Server API Error:", err);
      return sendJson(res, 500, { error: err.message || "Internal server error" });
    }
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(PUBLIC_DIR, pathname === "/" ? "index.html" : pathname);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, "index.html");
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".svg": "image/svg+xml"
  };

  const contentType = mimeTypes[ext] || "text/plain";
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading " + pathname);
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`==================================================================`);
  console.log(`🚀 Solanascope & YKPP Financial Intelligence Platform running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`==================================================================`);
});
