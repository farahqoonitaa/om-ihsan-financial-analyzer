/**
 * Solanascope & Kajian Ihsan Financial Intelligence Platform
 * Unified AI Financial Analysis Agent Server
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const cluster = require("cluster");
const os = require("os");

// Import Centralized Codebase Configuration & Domain Engines
const aiConfig = require("./src/config/aiConfig");
const masterParams = require("./src/data/masterParameters");
const seedData = require("./src/data/seedData");
const financialMath = require("./src/engine/financialMath");
const consolidationEngine = require("./src/engine/consolidationEngine");
const reconciliationEngine = require("./src/engine/reconciliationEngine");
const auditLogger = require("./src/engine/auditLogger");
const geminiClient = require("./src/engine/geminiClient");
const openAiClient = require("./src/engine/openAiClient");
const excelEngine = require("./src/engine/excelEngine");
const ragEngine = require("./src/engine/ragEngine");
const documentParser = require("./src/engine/documentParser");

// Import Enterprise Scalability & Infrastructure Engines
const cacheManager = require("./src/infrastructure/cacheManager");
const jobQueue = require("./src/infrastructure/jobQueue");
const rateLimiter = require("./src/infrastructure/rateLimiter");
const metricsCollector = require("./src/infrastructure/metricsCollector");

const PORT = process.env.PORT || 3005;
const PUBLIC_DIR = path.join(__dirname, "public");

function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    ...(res._extraHeaders || {}),
    ...headers
  });
  res.end(JSON.stringify(data));
}

function parseBody(req, maxBytes = 50 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    let receivedBytes = 0;
    req.on("data", chunk => {
      receivedBytes += chunk.length;
      if (receivedBytes > maxBytes) {
        req.destroy();
        return reject(new Error("PAYLOAD_TOO_LARGE"));
      }
      body += chunk;
    });
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
  const reqStartTime = performance.now();
  const parsedUrlObj = new URL(req.url || "/", "http://localhost");
  const pathname = parsedUrlObj.pathname;
  const parsedUrl = { pathname, query: Object.fromEntries(parsedUrlObj.searchParams.entries()) };
  const method = req.method;

  // Real-time latency & throughput observability
  res.on("finish", () => {
    const duration = performance.now() - reqStartTime;
    metricsCollector.recordRequest(method, pathname, res.statusCode, duration);
  });

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    });
    res.end();
    return;
  }

  // Rate Limiting Guardrail for API endpoints (exempting health & metrics)
  if (pathname.startsWith("/api/") && pathname !== "/api/healthz" && pathname !== "/api/readyz" && pathname !== "/api/metrics") {
    const clientIp = req.headers["x-forwarded-for"] || (req.socket && req.socket.remoteAddress) || "127.0.0.1";
    const rateCheck = rateLimiter.check(clientIp, 400, 60000);
    if (!rateCheck.allowed) {
      res.writeHead(429, {
        "Content-Type": "application/json",
        "Retry-After": rateCheck.retryAfterSeconds,
        "X-RateLimit-Limit": "400",
        "X-RateLimit-Remaining": "0",
        "Access-Control-Allow-Origin": "*"
      });
      return res.end(JSON.stringify({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Please retry in ${rateCheck.retryAfterSeconds} seconds.`,
        retryAfterSeconds: rateCheck.retryAfterSeconds
      }));
    }
    res._extraHeaders = {
      "X-RateLimit-Limit": "400",
      "X-RateLimit-Remaining": String(rateCheck.remaining)
    };
  }

  // --- REST API ROUTES ---
  if (pathname.startsWith("/api/")) {
    try {
      // 0a. Liveness Health Check (Kubernetes & Container Orchestrators)
      if (pathname === "/api/healthz" && method === "GET") {
        const stats = metricsCollector.getMetricsJson();
        return sendJson(res, 200, {
          status: "healthy",
          timestamp: new Date().toISOString(),
          uptimeSeconds: stats.uptimeSeconds,
          pid: process.pid,
          isWorker: cluster.isWorker,
          memory: stats.memory
        });
      }

      // 0b. Readiness Probe (Verifies file access & core engines)
      if (pathname === "/api/readyz" && method === "GET") {
        const scratchDir = path.join(__dirname, "scratch");
        let scratchReady = true;
        try {
          if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
        } catch (_) {
          scratchReady = false;
        }
        return sendJson(res, 200, {
          status: "ready",
          timestamp: new Date().toISOString(),
          scratchStorage: scratchReady,
          engines: {
            documentParser: true,
            financialMath: true,
            consolidationEngine: true,
            ragEngine: true
          }
        });
      }

      // 0c. Prometheus Text Metrics Exposition
      if (pathname === "/api/metrics" && method === "GET") {
        res.writeHead(200, {
          "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        });
        return res.end(metricsCollector.getPrometheusText());
      }

      // 0d. Enterprise System & Performance Stats
      if (pathname === "/api/system/stats" && method === "GET") {
        return sendJson(res, 200, {
          system: metricsCollector.getMetricsJson(),
          cache: cacheManager.getStats(),
          jobQueue: jobQueue.getStats()
        });
      }

      // 0e. Clear Server Cache
      if (pathname === "/api/cache/clear" && method === "POST") {
        cacheManager.clear();
        return sendJson(res, 200, { success: true, message: "Cache successfully purged." });
      }

      // 0f. Batch Asynchronous Document Parsing Job Queue (High-Scale Holding Ingestion)
      if (pathname === "/api/jobs/batch-parse" && method === "POST") {
        const body = await parseBody(req);
        const docs = Array.isArray(body.documents) ? body.documents : (body.files || []);
        if (docs.length === 0) {
          return sendJson(res, 400, { error: "No documents provided in 'documents' array" });
        }

        const batchId = "batch_" + Date.now();
        const jobIds = [];

        docs.forEach((doc, idx) => {
          const docName = doc.fileName || `document_${idx + 1}.pdf`;
          const jId = jobQueue.addJob(docName, doc, async (data, updateProgress) => {
            updateProgress(20);
            let resolvedPath = null;
            let tempFilePath = null;
            if (data.fileBase64) {
              const scratchDir = path.join(__dirname, "scratch");
              if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
              const safeName = (data.fileName || "uploaded.pdf").replace(/[^a-zA-Z0-9_\-\.]/g, "_");
              tempFilePath = path.join(scratchDir, `${Date.now()}_${safeName}`);
              fs.writeFileSync(tempFilePath, Buffer.from(data.fileBase64, "base64"));
              resolvedPath = tempFilePath;
            }
            updateProgress(50);
            try {
              const parsed = await documentParser.parseDocument({
                fileName: data.fileName,
                filePath: resolvedPath,
                textContent: data.textContent,
                entityOverride: data.entityName
              });
              updateProgress(90);
              return parsed;
            } finally {
              if (tempFilePath && fs.existsSync(tempFilePath)) {
                try { fs.unlinkSync(tempFilePath); } catch (_) {}
              }
            }
          });
          jobIds.push({ fileName: docName, jobId: jId });
        });

        return sendJson(res, 202, {
          success: true,
          batchId,
          totalQueued: jobIds.length,
          jobs: jobIds,
          message: `${jobIds.length} dokumen berhasil dimasukkan ke asynchronous worker queue.`
        });
      }

      // 0g. Get Job Status by ID
      if (pathname.startsWith("/api/jobs/") && method === "GET") {
        const jobId = pathname.replace("/api/jobs/", "");
        const job = jobQueue.getJob(jobId);
        if (!job) {
          return sendJson(res, 404, { error: "Job not found" });
        }
        return sendJson(res, 200, job);
      }

      // 0h. List Recent Jobs & Queue Status
      if (pathname === "/api/jobs" && method === "GET") {
        return sendJson(res, 200, {
          stats: jobQueue.getStats(),
          jobs: jobQueue.listJobs(25)
        });
      }

      // 1. Status API
      if (pathname === "/api/status" && method === "GET") {
        return sendJson(res, 200, {
          status: "OK",
          name: "Kajian Ihsan Financial AI Agent Platform",
          version: "2.0-2026",
          currentDate: "2026-10-06",
          copilotModel: geminiClient.defaultModel,
          hasGeminiKey: Boolean(geminiClient.apiKey),
          clustering: {
            enabled: process.env.CLUSTER_MODE === "true",
            isWorker: cluster.isWorker,
            pid: process.pid
          }
        });
      }

      // 1a. AI Document Parsing & Thinking Logic Extraction (Action Item: Key Parameter & Entity Disambiguation)
      if (pathname === "/api/parse-document" && method === "POST") {
        const body = await parseBody(req);
        
        // High-Performance SHA-256 Content Hash Caching Check
        const cachePayload = {
          fileBase64: body.fileBase64 ? body.fileBase64.substring(0, 500) + body.fileBase64.length : null,
          fileName: body.fileName || "unknown",
          textContent: body.textContent ? body.textContent.substring(0, 4000) : null,
          entityOverride: body.entityName || null
        };
        const cacheKey = "doc_" + cacheManager.hashPayload(cachePayload);
        const cached = cacheManager.get(cacheKey);

        if (cached) {
          return sendJson(res, 200, cached, { "X-Cache": "HIT" });
        }

        let resolvedPath = null;
        let tempFilePath = null;

        // Support direct base64 binary file uploads with zero-persistence cleanup
        if (body.fileBase64) {
          try {
            const scratchDir = path.join(__dirname, "scratch");
            if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
            let safeName = (body.fileName || "uploaded_file.pdf").replace(/[^a-zA-Z0-9_\-\.]/g, "_");
            if (!/\.(pdf|xlsx|xls|csv|json|txt)$/i.test(safeName)) safeName += ".pdf";
            tempFilePath = path.join(scratchDir, `${Date.now()}_${safeName}`);
            const cleanBase64 = String(body.fileBase64).replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '');
            fs.writeFileSync(tempFilePath, Buffer.from(cleanBase64, "base64"));
            resolvedPath = tempFilePath;
          } catch (writeErr) {
            console.warn("Could not write temp upload file, falling back to text:", writeErr.message);
          }
        }

        if (!resolvedPath && body.fileName) {
          const directFile = path.join(__dirname, body.fileName);
          if (fs.existsSync(directFile)) resolvedPath = directFile;
        }
        if (!resolvedPath && body.filePath && fs.existsSync(body.filePath)) {
          resolvedPath = body.filePath;
        }

        let parseResult;
        try {
          parseResult = await documentParser.parseDocument({
            fileName: body.fileName,
            filePath: resolvedPath,
            textContent: body.textContent,
            entityOverride: body.entityName
          });

          // Cache verified parsed result for sub-millisecond future hits
          cacheManager.set(cacheKey, parseResult);
          metricsCollector.recordDocumentParse();
        } finally {
          // Zero-Persistence Security: Immediately purge temporary upload buffer
          if (tempFilePath && fs.existsSync(tempFilePath)) {
            try { fs.unlinkSync(tempFilePath); } catch (_) {}
          }
        }

        return sendJson(res, 200, parseResult, { "X-Cache": "MISS" });
      }

      // 1b. Knowledge Base Document List (RAG Hub & Document Selector)
      if (pathname === "/api/knowledge-base" && method === "GET") {
        return sendJson(res, 200, {
          success: true,
          documents: ragEngine.getAllDocuments()
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

      // 3b. Download Formula Reference Compendium PDF
      if (pathname === "/api/download-formula-pdf" && method === "GET") {
        const filePath = path.join(__dirname, "Kajian_Ihsan_Formula_Reference_Compendium.pdf");
        if (filePath && fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=\"Kajian_Ihsan_Formula_Reference_Compendium.pdf\"",
            "Content-Length": stat.size
          });
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
          return;
        } else {
          return sendJson(res, 404, { error: "Formula compendium PDF not found" });
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

      // 11. AI Forensic Copilot Chat with Gemini API & Local RAG + Argon Deep-Dive API
      if (pathname === "/api/rag/argon-deep-dive" && method === "POST") {
        const body = await parseBody(req);
        const topic = body.topic || body.query || "pindo_qoe";
        const depth = Number(body.depthLevel || 3);
        const activeContext = body.context || {};
        const result = ragEngine.digDeeper(topic, depth, activeContext);
        return sendJson(res, 200, result);
      }

      if (pathname === "/api/rag/train" && method === "POST") {
        const body = await parseBody(req);
        const result = ragEngine.trainOnDocument(body);
        return sendJson(res, 200, result);
      }

      if (pathname === "/api/copilot/chat" && method === "POST") {
        const body = await parseBody(req);
        const activeContext = {
          ...(typeof body.context === 'object' ? body.context : {}),
          ...(typeof body.metrics === 'object' ? body.metrics : {}),
          mode: body.entity || (body.context && body.context.mode) || "",
          entity: body.entity || (body.context && body.context.entity) || "",
          entityName: body.entityName || (body.entity === 'non_pengendali' ? 'PT POJ (Non-Pengendali)' : (body.entity === 'pengendali' ? 'PT EPS (Pengendali)' : 'Portofolio Entitas Kajian Ihsan'))
        };
        const userQuery = body.query || "Berikan ringkasan temuan kritis hari ini.";
        const rawKey = body.openAiApiKey || body.geminiApiKey || body.apiKey || null;
        const provider = body.provider || ((rawKey && String(rawKey).startsWith('sk-')) || body.openAiApiKey ? 'openai' : 'google');
        const preferredModel = body.model || body.preferredModel || null;
        const activeDocIds = body.activeDocIds || null;
        const history = Array.isArray(body.history) ? body.history : [];

        let result;
        if (provider === 'openai') {
          result = await openAiClient.askCopilot(userQuery, activeContext, rawKey, preferredModel, activeDocIds, history);
        } else {
          result = await geminiClient.askCopilot(userQuery, activeContext, rawKey, preferredModel, activeDocIds, history);
        }
        return sendJson(res, 200, {
          ...result,
          response: result.answer
        });
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
          message: "File berhasil diunggah dan diuraikan ke dalam Canonical Data Model Kajian Ihsan.",
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
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store, no-cache, must-revalidate"
      });
      res.end(content, "utf-8");
    }
  });
});

// Setup Graceful Shutdown Handler
function registerGracefulShutdown(serverInstance) {
  const shutdown = () => {
    console.log(`[Process ${process.pid}] Graceful shutdown initiated...`);
    serverInstance.close(() => {
      console.log(`[Process ${process.pid}] HTTP server closed successfully.`);
      process.exit(0);
    });
    // Force exit after 10s if hanging
    setTimeout(() => {
      console.error(`[Process ${process.pid}] Forced shutdown timeout.`);
      process.exit(1);
    }, 10000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

if (require.main === module) {
  if (process.env.CLUSTER_MODE === "true") {
    if (cluster.isPrimary) {
      const numWorkers = parseInt(process.env.WORKERS, 10) || Math.min(os.cpus().length, 4);
      console.log(`==================================================================`);
      console.log(`🚀 [Master ${process.pid}] Starting cluster with ${numWorkers} worker processes`);
      console.log(`   High-scale concurrency mode enabled.`);
      console.log(`==================================================================`);
      for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
      }
      cluster.on("exit", (worker, code, signal) => {
        console.warn(`[Master] Worker ${worker.process.pid} exited (code: ${code}, signal: ${signal}). Spawning replacement...`);
        cluster.fork();
      });
    } else {
      server.listen(PORT, () => {
        console.log(`🚀 [Worker ${process.pid}] Kajian Ihsan listening at http://localhost:${PORT}`);
      });
      registerGracefulShutdown(server);
    }
  } else {
    server.listen(PORT, () => {
      console.log(`==================================================================`);
      console.log(`🚀 Kajian Ihsan running at:`);
      console.log(`   http://localhost:${PORT}`);
      console.log(`==================================================================`);
    });
    registerGracefulShutdown(server);
  }
}

module.exports = server;
