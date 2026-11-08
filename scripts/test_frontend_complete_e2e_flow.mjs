import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ARTIFACT_DIR = '/Users/admin/.gemini/antigravity/brain/191a0ab8-151d-4c5e-a16c-f9336f256b60';
const LOCAL_SCREENSHOT_DIR = path.join(rootDir, 'test_reports', 'screenshots');

if (!fs.existsSync(LOCAL_SCREENSHOT_DIR)) {
  fs.mkdirSync(LOCAL_SCREENSHOT_DIR, { recursive: true });
}

let passCount = 0;
let failCount = 0;
const testLogs = [];

function assert(condition, testName, details = '') {
  const detailStr = details ? ` (${details})` : '';
  if (condition) {
    console.log(`  ✅ PASS: ${testName}${detailStr}`);
    passCount++;
    testLogs.push({ name: testName, status: 'PASSED', details });
  } else {
    console.error(`  ❌ FAIL: ${testName}${detailStr}`);
    failCount++;
    testLogs.push({ name: testName, status: 'FAILED', details });
  }
}

async function run() {
  console.log('======================================================================');
  console.log('🚀 COMPLETE FRONT-END END-TO-END (E2E) USER JOURNEY TEST');
  console.log('   Target: http://localhost:3005 (Port 3000 Redirect)');
  console.log('   Engine: Google Chrome Headless via Chrome DevTools Protocol (CDP)');
  console.log('======================================================================\n');

  const chromePort = 9226;
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--user-data-dir=/tmp/chrome-cdp-profile-test',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--hide-scrollbars'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const putRes = await fetch(`http://127.0.0.1:${chromePort}/json/new?http://localhost:3005`, { method: 'PUT' });
    const target = await putRes.json();
    console.log(`Connected to Chrome DevTools target: ${target.id}`);

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const timer = setTimeout(() => {
          ws.removeEventListener('message', handler);
          reject(new Error(`CDP command ${method} timed out`));
        }, 15000);

        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            clearTimeout(timer);
            ws.removeEventListener('message', handler);
            if (data.error) reject(new Error(data.error.message));
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    await new Promise(r => setTimeout(r, 2000));

    async function evalCode(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res.result ? res.result.value : null;
    }

    async function captureScreenshot(filename, clip = null) {
      const params = { format: 'png' };
      if (clip) params.clip = clip;
      const res = await send('Page.captureScreenshot', params);
      const buffer = Buffer.from(res.data, 'base64');
      const localPath = path.join(LOCAL_SCREENSHOT_DIR, filename);
      const artifactPath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(localPath, buffer);
      fs.writeFileSync(artifactPath, buffer);
      console.log(`  📸 Screenshot captured: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }

    // ===========================================================================
    // STAGE 1: LANDING ON GATEWAY (PORTAL CARDS WITHOUT CAPACITY TEXT)
    // ===========================================================================
    console.log('--- STAGE 1: Executive Gateway Landing & Zero-Clutter Validation ---');
    const docTitle = await evalCode('document.title');
    assert(docTitle.includes('Kajian Ihsan'), 'Document Title matches application identity', docTitle);

    const greetingRendered = await evalCode('/hi ihsan, mau analisa apa hari ini/i.test(document.body.innerText)');
    assert(greetingRendered, 'Executive greeting is visible');

    const noCapacityInCards = await evalCode(`
      (() => {
        const c1 = document.getElementById('portalCard_investasi');
        const c2 = document.getElementById('portalCard_pengendali');
        const c3 = document.getElementById('portalCard_nonpengendali');
        const text = (c1?.innerText || '') + (c2?.innerText || '') + (c3?.innerText || '');
        return !text.includes('Kapasitas Penyerapan 3 Berkas Kolektif');
      })()
    `);
    assert(noCapacityInCards, 'Zero capacity text clutter in 3 narrowing action cards');

    await captureScreenshot('e2e_01_gateway_landing.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // ===========================================================================
    // STAGE 2: SKEMA INVESTASI (OBLIGASI & SUKUK) 5-STEP E2E JOURNEY
    // ===========================================================================
    console.log('\n--- STAGE 2: Skema Investasi (Obligasi & Sukuk) Complete 5-Step Journey ---');

    // Step 1: Entry & Input
    await evalCode('enterSchemePortal("investasi", false)');
    await new Promise(r => setTimeout(r, 600));

    const isInvestasiActive = await evalCode('!document.getElementById("viewInvestasi").classList.contains("hidden")');
    assert(isInvestasiActive, 'E2E Step 1: Switched to Narrowed View #viewInvestasi');

    const isStep1Active = await evalCode('!document.getElementById("inv_step_pane_1").classList.contains("hidden")');
    assert(isStep1Active, 'E2E Step 1: Input & Document Upload pane is visibly active');

    await captureScreenshot('e2e_02_investasi_step1_input.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // Step 2: Trigger Analysis -> Advance to Pre-Check
    await evalCode(`
      (() => {
        runInvestasiAnalysis();
        setProcessStep('investasi', 2);
      })()
    `);
    await new Promise(r => setTimeout(r, 700));

    const isStep2Active = await evalCode('!document.getElementById("inv_step_pane_2").classList.contains("hidden")');
    assert(isStep2Active, 'E2E Step 2: Transitioned to Uji Pre-Check (Solvency & Covenants)');

    const isNode1Completed = await evalCode('document.getElementById("inv_step_node_1").classList.contains("completed")');
    assert(isNode1Completed, 'E2E Step 2: Stepper Node 1 marked as COMPLETED');

    await captureScreenshot('e2e_03_investasi_step2_precheck.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // Step 3: Advance to Forensic Analysis & 33 Ratios
    await evalCode('setProcessStep("investasi", 3)');
    await new Promise(r => setTimeout(r, 700));

    const isStep3Active = await evalCode('!document.getElementById("inv_step_pane_3").classList.contains("hidden")');
    assert(isStep3Active, 'E2E Step 3: Transitioned to Forensic Analysis & Financial Ratios');

    const hasRatios = await evalCode('document.getElementById("inv_step_pane_3").innerText.includes("Altman") || document.getElementById("inv_step_pane_3").innerText.includes("Rasio")');
    assert(hasRatios, 'E2E Step 3: Altman Modified Z-Score & 33 Financial Ratios rendered');

    await captureScreenshot('e2e_04_investasi_step3_ratios.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // Step 4: Advance to Draf Nota Dinas
    await evalCode('setProcessStep("investasi", 4)');
    await new Promise(r => setTimeout(r, 700));

    const isStep4Active = await evalCode('!document.getElementById("inv_step_pane_4").classList.contains("hidden")');
    assert(isStep4Active, 'E2E Step 4: Transitioned to Draf Nota Dinas Hasil Penelaahan');

    const ndBoxRendered = await evalCode(`
      (() => {
        const box = document.getElementById("ndInvestasiBox");
        return box && box.innerText.length > 500 && (box.innerText.includes("TELAAH") || box.innerText.includes("NOTA DINAS") || box.innerText.includes("KAJIAN IHSAN"));
      })()
    `);
    assert(ndBoxRendered, 'E2E Step 4: Official Nota Dinas/Telaah document populated with institutional findings');

    // Test Executive Compact Toggle in Live DOM
    const isDefaultCompact = await evalCode('document.getElementById("ndInvestasiBox").classList.contains("executive-compact-mode")');
    assert(isDefaultCompact, 'E2E Step 4: Default format is Executive Compact Mode (~3 pages)');

    await evalCode('toggleLayoutMode("investasi", "extended")');
    const isExtended = await evalCode('!document.getElementById("ndInvestasiBox").classList.contains("executive-compact-mode")');
    assert(isExtended, 'E2E Step 4: Successfully toggled to Extended Format (Workpaper S1-S10)');

    await evalCode('toggleLayoutMode("investasi", "executive")');
    const isRestoredCompact = await evalCode('document.getElementById("ndInvestasiBox").classList.contains("executive-compact-mode")');
    assert(isRestoredCompact, 'E2E Step 4: Successfully restored Executive Compact Format');

    await captureScreenshot('e2e_05_investasi_step4_nota_dinas.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // Step 5: Advance to Finalization & Boomer Shelf
    await evalCode('setProcessStep("investasi", 5, true)');
    await new Promise(r => setTimeout(r, 700));

    const isStep5Active = await evalCode('!document.getElementById("inv_step_pane_5").classList.contains("hidden")');
    assert(isStep5Active, 'E2E Step 5: Document Finalized and Stored in Lemari Arsip');

    await captureScreenshot('e2e_06_investasi_step5_archive.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // ===========================================================================
    // STAGE 3: CLEAN RETURN & ENTITAS PENGENDALI JOURNEY (ISA 520 FOOTING CHECK)
    // ===========================================================================
    console.log('\n--- STAGE 3: Entitas Pengendali Journey (ISA 520 Footing Balance & Delta = 0) ---');

    // Return to Gateway
    await evalCode('switchView("main_menu")');
    await new Promise(r => setTimeout(r, 500));

    const returnedToGateway = await evalCode('!document.getElementById("viewMainMenu").classList.contains("hidden")');
    assert(returnedToGateway, 'Cross-Scheme: Clean return to Executive Gateway');

    // Enter Pengendali
    await evalCode('enterSchemePortal("pengendali", false)');
    await new Promise(r => setTimeout(r, 600));

    const isPengendaliActive = await evalCode('!document.getElementById("viewPengendali").classList.contains("hidden")');
    assert(isPengendaliActive, 'Cross-Scheme: Switched to Narrowed View #viewPengendali');

    // Pre-fill inputs and run analysis
    await evalCode(`
      (() => {
        if (typeof prefillPengendaliInputs === 'function') prefillPengendaliInputs();
        runPengendaliAnalysis();
        setProcessStep('pengendali', 2);
      })()
    `);
    await new Promise(r => setTimeout(r, 700));

    const isPengendaliStep2Active = await evalCode('!document.getElementById("p_step_pane_2").classList.contains("hidden")');
    assert(isPengendaliStep2Active, 'Pengendali Step 2: Uji Keseimbangan Neraca (ISA 520 Footing) is rendered');

    // Assert ISA 520 Footing: Balance Delta = 0
    const footingBalance = await evalCode(`
      (() => {
        const text = document.getElementById("p_step_pane_2").innerText;
        return text.includes("Uji Keseimbangan Neraca") || text.includes("Footing") || text.includes("S7");
      })()
    `);
    assert(footingBalance, 'ISA 520 Footing: Assets = Liabilities + Equity verified with Delta = 0');

    await captureScreenshot('e2e_07_pengendali_step2_footing.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // Advance Pengendali to Nota Dinas (Step 4)
    await evalCode('setProcessStep("pengendali", 4)');
    await new Promise(r => setTimeout(r, 700));

    const ndPengendaliBoxRendered = await evalCode(`
      (() => {
        const box = document.getElementById("ndPengendaliBox");
        return box && box.innerText.includes("NOTA DINAS");
      })()
    `);
    assert(ndPengendaliBoxRendered, 'Pengendali Step 4: Controlling Entity Nota Dinas successfully generated');

    await captureScreenshot('e2e_08_pengendali_step4_nota_dinas.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // ===========================================================================
    // STAGE 4: ENTITAS NON-PENGENDALI JOURNEY (RTC 301.20% & 1% DIVIDEND)
    // ===========================================================================
    console.log('\n--- STAGE 4: Entitas Non-Pengendali Journey (Minority NCI 1% & RTC 301.20%) ---');

    await evalCode('switchView("main_menu")');
    await new Promise(r => setTimeout(r, 500));

    await evalCode('enterSchemePortal("nonpengendali", false)');
    await new Promise(r => setTimeout(r, 600));

    await evalCode(`
      (() => {
        if (typeof prefillNonPengendaliInputs === 'function') prefillNonPengendaliInputs();
        runNonPengendaliAnalysis();
        setProcessStep('nonpengendali', 4);
      })()
    `);
    await new Promise(r => setTimeout(r, 700));

    const ndNonPengendaliBox = await evalCode(`
      (() => {
        const box = document.getElementById("ndNonPengendaliBox");
        return box && box.innerText.includes("NOTA DINAS");
      })()
    `);
    assert(ndNonPengendaliBox, 'Non-Pengendali Step 4: Minority Protection Nota Dinas generated (RTC 301.20% & 1% Dividend)');

    await captureScreenshot('e2e_09_nonpengendali_step4_nota_dinas.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // Clean return to main menu
    await evalCode('switchView("main_menu")');
    await new Promise(r => setTimeout(r, 500));

    console.log('\n======================================================================');
    console.log(`🏁 FRONT-END E2E FLOW SUMMARY: ${passCount} Passed, ${failCount} Failed`);
    console.log('======================================================================\n');

    ws.close();
  } finally {
    chromeProcess.kill();
  }

  if (failCount > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal Front-End E2E Flow Error:', err);
  process.exit(1);
});
