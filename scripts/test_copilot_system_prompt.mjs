/**
 * Comprehensive Test Suite for AI Financial Forensic Copilot
 * Validates Institutional System Prompt, 8-Step Reasoning Workflow,
 * Multi-turn Conversational Memory, and Non-Fraud Professional Standards.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('\n================================================================');
  console.log('🧪 RUNNING: AI FINANCIAL FORENSIC COPILOT INSTITUTIONAL TEST SUITE');
  console.log('================================================================\n');

  // --- SECTION 1: System Prompt Canonical Module Integrity ---
  console.log('--- SECTION 1: Canonical System Prompt Module (`src/engine/copilotSystemPrompt.js`) ---');
  const promptModule = await import('../src/engine/copilotSystemPrompt.js');
  const { COPILOT_SYSTEM_PROMPT, buildCopilotPrompt } = promptModule;

  assert(typeof COPILOT_SYSTEM_PROMPT === 'string' && COPILOT_SYSTEM_PROMPT.length > 5000, 
    'COPILOT_SYSTEM_PROMPT exists and has institutional depth (> 5000 chars)');
  assert(COPILOT_SYSTEM_PROMPT.includes('AI Financial Forensic Copilot'), 
    'Prompt establishes role as AI Financial Forensic Copilot');
  assert(COPILOT_SYSTEM_PROMPT.includes('Understand first. Retrieve evidence. Validate. Calculate. Conclude.'), 
    'Prompt enforces core principle: Understand first. Retrieve evidence. Validate. Calculate. Conclude.');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 1 — DETECT USER INTENT'), 
    'Prompt defines Step 1: Detect User Intent');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 2 — RESOLVE CONVERSATION CONTEXT'), 
    'Prompt defines Step 2: Resolve Conversation Context');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 3 — IDENTIFY THE SUBJECT AND SCOPE'), 
    'Prompt defines Step 3: Identify Subject and Scope');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 4 — RETRIEVE EVIDENCE FROM RAG'), 
    'Prompt defines Step 4: Retrieve Evidence from RAG');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 5 — VERIFY AND RECONCILE THE EVIDENCE'), 
    'Prompt defines Step 5: Verify and Reconcile Evidence');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 6 — PERFORM FINANCIAL REASONING AND CALCULATIONS'), 
    'Prompt defines Step 6: Perform Financial Reasoning and Calculations');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 7 — DISTINGUISH FINDING, RISK, AND CONCLUSION'), 
    'Prompt defines Step 7: Distinguish Finding, Risk, and Conclusion');
  assert(COPILOT_SYSTEM_PROMPT.includes('STEP 8 — GENERATE A CONTEXTUAL ANSWER'), 
    'Prompt defines Step 8: Generate Contextual Answer');
  assert(COPILOT_SYSTEM_PROMPT.includes('Growth Gap = Growth Opex − Growth Revenue'), 
    'Prompt contains exact Growth Gap formula');
  assert(COPILOT_SYSTEM_PROMPT.includes('bukan bukti otomatis bahwa terjadi pelanggaran atau fraud'), 
    'Prompt explicitly instructs that anomalies are investigatory signals, not automatic proof of fraud');
  assert(COPILOT_SYSTEM_PROMPT.includes('Jangan membuat SHA256, audit trail, timestamp verifikasi, atau identitas auditor seolah-olah merupakan hasil proses nyata'), 
    'Prompt strictly forbids fabricated SHA-256 checksums or fake auditor validations');

  // Test buildCopilotPrompt helper
  const builtPrompt = buildCopilotPrompt(
    "Kenapa margin turun?",
    { mode: "pengendali", opexGrowth: 32.91, revGrowth: 31.45 },
    "Dokumen RAG: Laporan Keuangan PT EPS TW III 2026",
    [{ role: "user", text: "Halo" }, { role: "assistant", text: "Halo! Saya siap membantu..." }]
  );
  assert(builtPrompt.includes('=== USER INQUIRY ===') && builtPrompt.includes('Kenapa margin turun?'), 
    'buildCopilotPrompt formats user inquiry correctly');
  assert(builtPrompt.includes('=== ACTIVE AUDIT SESSION CONTEXT ===') && builtPrompt.includes('32.91'), 
    'buildCopilotPrompt embeds active session context metrics');
  assert(builtPrompt.includes('=== SOURCE EVIDENCE & RAG RETRIEVAL (KNOWLEDGE BASE) ==='), 
    'buildCopilotPrompt embeds grounded RAG evidence block');
  assert(builtPrompt.includes('=== RECENT CONVERSATIONAL HISTORY ===') && builtPrompt.includes('Halo! Saya siap membantu...'), 
    'buildCopilotPrompt formats recent multi-turn conversation history');

  // --- SECTION 2: Gemini Client 8-Step Reasoning & Intent Handling ---
  console.log('\n--- SECTION 2: Gemini Client Deterministic Engine (`src/engine/geminiClient.js`) ---');
  const geminiClient = (await import('../src/engine/geminiClient.js')).default;

  // 1. Greeting Intent
  const greetingResp1 = geminiClient.generateDeterministicResponse("hi", {});
  assert(greetingResp1 === "Halo! Saya siap membantu analisis laporan keuangan, verifikasi angka, atau penelusuran temuan forensik. Mau mulai dari entitas atau dokumen mana?", 
    'Greeting "hi" returns natural conversational response without running premature analysis');
  const greetingResp2 = geminiClient.generateDeterministicResponse("Selamat pagi", {});
  assert(greetingResp2.includes("Halo! Saya siap membantu"), 
    'Greeting "Selamat pagi" returns natural conversational response');

  // 2. Ambiguous Numerical Intent ("Kenapa 6%?")
  const sixPctResp = geminiClient.generateDeterministicResponse("Kenapa 6%?", {});
  assert(sixPctResp === "Angka 6% yang Anda maksud adalah persentase pada bagian mana—margin, pertumbuhan, anggaran, atau ketentuan dividen? Saya ingin memastikan dasar perhitungannya tepat.", 
    'Ambiguous question "Kenapa 6%?" asks for clarification per Step 8 instructions');

  // 3. Ambiguous Generic Intent ("Kenapa angka itu?")
  const genericResp = geminiClient.generateDeterministicResponse("kenapa angka itu?", {});
  assert(genericResp.includes("Angka mana yang sedang Anda telusuri secara spesifik"), 
    'Generic question "kenapa angka itu?" clarifies scope rather than guessing');

  // 4. Detailed 3 Findings with 5 Mandatory Sections (Non-Pengendali / PT POJ)
  const findingsRespPOJ = geminiClient.generateDeterministicResponse("Rincikan 3 temuan utamanya", { mode: "non_pengendali" });
  assert(findingsRespPOJ.includes("Rincian 3 Temuan Forensik Prioritas — PT Pesonna Optima Jasa"), 
    '3 findings response identifies entity PT POJ');
  assert(findingsRespPOJ.includes("Bukti Angka & Sumber") && findingsRespPOJ.includes("Perhitungan & Dasar Analisis"), 
    '3 findings include Evidence & Calculation sections');
  assert(findingsRespPOJ.includes("Dampak & Risiko Relevan") && findingsRespPOJ.includes("Tingkat Kepastian & Pemeriksaan Lanjutan"), 
    '3 findings include Risk & Next Steps sections');
  assert(findingsRespPOJ.includes("301,20%") && findingsRespPOJ.includes("-Rp347,18 Miliar") && findingsRespPOJ.includes("Rp185 Juta"), 
    '3 findings include verified numbers: RTC 301.20%, NWC -347.18 B, Dividend 185 M');

  // 5. Detailed 3 Findings with 5 Mandatory Sections (Pengendali / PT EPS)
  const findingsRespEPS = geminiClient.generateDeterministicResponse("rincikan 3 temuan", { mode: "pengendali" });
  assert(findingsRespEPS.includes("Rincian 3 Temuan Forensik Prioritas — PT Era Permata Sejahtera"), 
    '3 findings response identifies entity PT EPS');
  assert(findingsRespEPS.includes("Growth Gap") && findingsRespEPS.includes("+1,46") && findingsRespEPS.includes("2.308%"), 
    'EPS findings contain Growth Gap +1.46 pp and Bonus Overrun 2,308%');

  // 6. Follow-up on Finding 2 Danger
  const followUpFinding2 = geminiClient.generateDeterministicResponse("Kenapa temuan kedua berbahaya?", { mode: "non_pengendali" });
  assert(followUpFinding2.includes("Mengapa Temuan Kedua (Defisit Modal Kerja Bersih) Berbahaya?"), 
    'Follow-up correctly identifies Finding 2 as Net Working Capital Deficit');
  assert(followUpFinding2.includes("Akar Bahaya Finansial & Likuiditas") && followUpFinding2.includes("debt rollover risk"), 
    'Finding 2 danger response details immediate illiquidity and debt rollover risk');

  // 7. Red Tiering Methodology & Non-Fraud Stance
  const redTierResp = geminiClient.generateDeterministicResponse("Kenapa masuk tiering merah?", { mode: "non_pengendali" });
  assert(redTierResp.includes("Dasar Metodologi & Threshold Pagu RKAP"), 
    'Red tiering response explains RKAP thresholds (Hijau <= 105%, Kuning 105-120%, Merah > 120%)');
  assert(redTierResp.includes("BUKAN kesimpulan otomatis adanya fraud atau kecurangan hukum"), 
    'Red tiering explicitly affirms it is a high-risk exposure signal, NOT automatic evidence of fraud');

  // 8. Root-cause Mitigation
  const mitigasiResp = geminiClient.generateDeterministicResponse("Bagaimana mitigasi piutangnya?", { mode: "non_pengendali" });
  assert(mitigasiResp.includes("SA 505") && mitigasiResp.includes("PSAK 71"), 
    'Mitigation includes independent circularization (SA 505) and credit loss provisioning (CKPN PSAK 71)');
  assert(mitigasiResp.includes("Restrukturisasi Modal Kerja") && mitigasiResp.includes("Gugus Tugas Penagihan"), 
    'Mitigation includes working capital debt restructuring and collection task force');

  // 9. Dividend 1% Legal & Liquidity Analysis
  const divResp = geminiClient.generateDeterministicResponse("Apakah dividen 1% wajib dibayarkan?", { mode: "non_pengendali" });
  assert(divResp.includes("UUPT No. 40/2007 Pasal 71") && divResp.includes("PSAK 65 / IFRS 10"), 
    'Dividend response cites UUPT No. 40/2007 Article 71 and PSAK 65 / IFRS 10');
  assert(divResp.includes("kas riil belum masuk") || divResp.includes("tersandera"), 
    'Dividend response explains cash settlement liquidity impediment despite legal entitlement');

  // 10. Growth Gap S7 Calculation & Interpretation
  const growthGapResp = geminiClient.generateDeterministicResponse("jelaskan growth gap opex", { mode: "pengendali" });
  assert(growthGapResp.includes("+1,46 percentage points") || growthGapResp.includes("+1,46 pp"), 
    'Growth gap calculates +1.46 percentage points');
  assert(growthGapResp.includes("sinyal analitis untuk investigasi lanjutan") && growthGapResp.includes("BUKAN bukti otomatis adanya kecurangan atau fraud"), 
    'Growth gap explicitly designated as an investigatory signal, not proof of fraud');

  // 11. Simulation / What-If Engine
  const simResp = geminiClient.generateDeterministicResponse("kalo rtc 70% gmn?", { mode: "non_pengendali" });
  assert(simResp.includes("Jika RTC Piutang = 70%") && simResp.includes("Tiering Hijau"), 
    'Simulation computes RTC 70% transition into Tiering Hijau');

  // --- SECTION 3: OpenAI Client Fallback & History Support ---
  console.log('\n--- SECTION 3: OpenAI Client (`src/engine/openAiClient.js`) ---');
  const openAiClient = (await import('../src/engine/openAiClient.js')).default;
  const openAiAskResult = await openAiClient.askCopilot("hi", { mode: "non_pengendali" }, "dummy_invalid_key", null, null, []);
  assert(openAiAskResult.answer.includes("Halo! Saya siap membantu"), 
    'OpenAI client fallbacks cleanly to deterministic engine and honors greeting intent');

  // --- SECTION 4: Frontend HTML Files Verification ---
  console.log('\n--- SECTION 4: Frontend HTML Files (`public/index.html` & `preview.html`) ---');
  const indexPath = path.join(ROOT_DIR, 'public/index.html');
  const previewPath = path.join(ROOT_DIR, 'preview.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const previewContent = fs.readFileSync(previewPath, 'utf8');

  assert(indexContent.includes('const COPILOT_SYSTEM_PROMPT ='), 
    'public/index.html embeds canonical COPILOT_SYSTEM_PROMPT');
  assert(previewContent.includes('const COPILOT_SYSTEM_PROMPT ='), 
    'preview.html embeds canonical COPILOT_SYSTEM_PROMPT');
  assert(indexContent.includes('TraceID:'), 
    'public/index.html uses TraceID instead of fake SHA256 claim');
  assert(!indexContent.includes('SHA256:VERIFIED'), 
    'public/index.html does not contain fake SHA256:VERIFIED claims');
  assert(indexContent.includes('Halo! Saya siap membantu analisis laporan keuangan'), 
    'public/index.html local engine implements greeting intent detection');
  assert(indexContent.includes('Angka 6% yang Anda maksud adalah persentase pada bagian mana'), 
    'public/index.html local engine implements ambiguous 6% clarification');
  assert(indexContent.includes('Mengapa Temuan Kedua (Defisit Modal Kerja Bersih) Berbahaya?'), 
    'public/index.html local engine implements Finding 2 danger explanation');
  assert(indexContent.includes('BUKAN kesimpulan otomatis adanya fraud atau kecurangan hukum'), 
    'public/index.html local engine implements non-fraud red tiering explanation');
  assert(indexContent === previewContent, 
    'preview.html is perfectly identical to public/index.html');

  // --- Summary ---
  console.log('\n================================================================');
  console.log(`🏁 COPILOT TEST SUMMARY: ${passedTests} Passed, ${failedTests} Failed (Total: ${totalTests})`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
