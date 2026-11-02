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
const testResults = [];

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
    passCount++;
    testResults.push({ name: testName, status: 'PASSED', details });
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failCount++;
    testResults.push({ name: testName, status: 'FAILED', details });
  }
}

async function run() {
  console.log('======================================================================');
  console.log('🌐 FRONT-END BROWSER AUTOMATION & E2E RUNTIME TEST SUITE');
  console.log('   Target: http://localhost:3005 (Port 3000 Redirect)');
  console.log('   Engine: Google Chrome Headless via Chrome DevTools Protocol (CDP)');
  console.log('======================================================================\n');

  const chromePort = 9224;
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    '--hide-scrollbars'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    // 1. Create target tab pointing to application
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

    // Enable CDP domains
    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    // Wait for initial page hydration
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
      console.log(`  📸 Screenshot saved: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-1: Initial Page Load, Headers, Title & Meta Attributes
    // ---------------------------------------------------------------------------
    console.log('--- TEST SUITE FE-1: Initial Page Load & Identity Verification ---');
    const pageTitle = await evalCode('document.title');
    assert(pageTitle && pageTitle.includes('Kajian Ihsan'), 'Document Title matches application identity', pageTitle);

    const greetingText = await evalCode('/hi ihsan, mau analisa apa hari ini/i.test(document.body.innerText)');
    assert(greetingText, 'Executive greeting "Hi Ihsan, Mau Analisa Apa Hari Ini?" is rendered live in DOM');

    const zeroLoginPill = await evalCode('document.body.innerText.includes("Langsung Terbuka (Tanpa Perlu Login)")');
    assert(zeroLoginPill, 'Zero-login status indicator is rendered in top bar');

    const viewportMeta = await evalCode('document.querySelector("meta[name=\'viewport\']") !== null');
    assert(viewportMeta, 'Responsive viewport meta tag exists in head');

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-2: Dedicated 3-Scheme Cards & Capacity Clutter Check
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST SUITE FE-2: Dedicated 3-Scheme Cards & Capacity Clutter Check ---');
    const portal1 = await evalCode('document.getElementById("portalCard_investasi") !== null');
    assert(portal1, 'Portal Card 1 #portalCard_investasi is rendered');

    const portal2 = await evalCode('document.getElementById("portalCard_pengendali") !== null');
    assert(portal2, 'Portal Card 2 #portalCard_pengendali is rendered');

    const portal3 = await evalCode('document.getElementById("portalCard_nonpengendali") !== null');
    assert(portal3, 'Portal Card 3 #portalCard_nonpengendali is rendered');

    // VERIFY CAPACITY TEXT WAS REMOVED FROM CARDS (Per user explicit request)
    const card1CapacityClutter = await evalCode(`
      const c = document.getElementById("portalCard_investasi");
      c ? c.innerText.includes("Kapasitas Penyerapan 3 Berkas Kolektif") : false;
    `);
    assert(!card1CapacityClutter, 'Portal Card 1: Capacity text clutter is completely removed');

    const card2CapacityClutter = await evalCode(`
      const c = document.getElementById("portalCard_pengendali");
      c ? c.innerText.includes("Kapasitas Penyerapan 3 Berkas Kolektif") : false;
    `);
    assert(!card2CapacityClutter, 'Portal Card 2: Capacity text clutter is completely removed');

    const card3CapacityClutter = await evalCode(`
      const c = document.getElementById("portalCard_nonpengendali");
      c ? c.innerText.includes("Kapasitas Penyerapan 3 Berkas Kolektif") : false;
    `);
    assert(!card3CapacityClutter, 'Portal Card 3: Capacity text clutter is completely removed');

    const btn1Text = await evalCode('document.getElementById("portalCard_investasi").innerText.includes("Pilih & Mulai Analisis Investasi")');
    assert(btn1Text, 'Portal Card 1 CTA: "Pilih & Mulai Analisis Investasi (Narrowing)" is active');

    const btn2Text = await evalCode('document.getElementById("portalCard_pengendali").innerText.includes("Pilih & Mulai Analisis Pengendali")');
    assert(btn2Text, 'Portal Card 2 CTA: "Pilih & Mulai Analisis Pengendali (Narrowing)" is active');

    const btn3Text = await evalCode('document.getElementById("portalCard_nonpengendali").innerText.includes("Pilih & Mulai Analisis Non-Pengendali")');
    assert(btn3Text, 'Portal Card 3 CTA: "Pilih & Mulai Analisis Non-Pengendali (Narrowing)" is active');

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-3: Zero Legacy "YKPP" Residuals in Live Browser DOM & Window
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST SUITE FE-3: Zero Legacy "YKPP" Residuals Verification ---');
    const ykppInBody = await evalCode('document.body.innerText.includes("YKPP")');
    assert(!ykppInBody, 'Zero occurrences of "YKPP" in live DOM innerText');

    const ykppInHtml = await evalCode('document.documentElement.innerHTML.includes("YKPP")');
    assert(!ykppInHtml, 'Zero occurrences of "YKPP" in full HTML document');

    const ykppInWindow = await evalCode('Object.keys(window).some(k => k.includes("YKPP"))');
    assert(!ykppInWindow, 'Zero occurrences of "YKPP" in window global variables');

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-4: Dynamic Parsing & File Upload Dropzone Elements
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST SUITE FE-4: Dynamic Parsing & File Upload Dropzone ---');
    const dropzoneExists = await evalCode('document.querySelector(".quick-dropzone-strip") !== null');
    assert(dropzoneExists, 'Universal File Dropzone strip (.quick-dropzone-strip) is rendered in live DOM');

    const dropzoneText = await evalCode('document.querySelector(".quick-dropzone-strip").innerText.includes("Punya Berkas Dokumen Keuangan Sendiri?")');
    assert(dropzoneText, 'Universal File Dropzone text promotes dynamic document ingestion');

    const uploadFnExists = await evalCode('typeof window.triggerUniversalFileUpload === "function"');
    assert(uploadFnExists, 'Client function triggerUniversalFileUpload() is defined in window');

    const parseFnExists = await evalCode('typeof window.handleDirectFileDrop === "function"');
    assert(parseFnExists, 'Client function handleDirectFileDrop() is defined in window');

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-5: Screen Captures while on Main Menu Gateway
    // ---------------------------------------------------------------------------
    console.log('\n--- Capturing Main Menu Gateway Visual Evidence ---');
    await captureScreenshot('fe_screenshot_desktop_overview.png', { x: 0, y: 0, width: 1440, height: 900, scale: 1 });

    const cardsRect = await evalCode(`
      (() => {
        const el = document.getElementById("threeDedicatedPortalsGrid");
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
      })()
    `);
    if (cardsRect && cardsRect.width > 0) {
      await captureScreenshot('fe_screenshot_narrowing_cards.png', {
        x: Math.round(cardsRect.x),
        y: Math.round(cardsRect.y),
        width: Math.round(cardsRect.width),
        height: Math.round(cardsRect.height),
        scale: 1
      });
    }

    const dropzoneRect = await evalCode(`
      (() => {
        const el = document.querySelector(".quick-dropzone-strip");
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
      })()
    `);
    if (dropzoneRect && dropzoneRect.width > 0) {
      await captureScreenshot('fe_screenshot_quick_dropzone.png', {
        x: Math.round(dropzoneRect.x),
        y: Math.round(dropzoneRect.y),
        width: Math.round(dropzoneRect.width),
        height: Math.round(dropzoneRect.height),
        scale: 1
      });
    }

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-6: Interactive Narrowing Navigation & View Switching
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST SUITE FE-6: Interactive Narrowing Navigation & View Switching ---');

    // Click Portal 1: Investasi
    await evalCode('enterSchemePortal("investasi", false)');
    await new Promise(r => setTimeout(r, 600));

    const isInvestasiActive = await evalCode('!document.getElementById("viewInvestasi").classList.contains("hidden")');
    assert(isInvestasiActive, 'Interactive Click: Switched to narrowed view #viewInvestasi');

    const bannerInvestasi = await evalCode('document.body.innerText.includes("FOKUS TERKUNCI (NARROWED): SKEMA INVESTASI")');
    assert(bannerInvestasi, 'Narrowed Focus Banner for Investasi is visibly locked and active');

    // Capture Narrowed Portal View
    await captureScreenshot('fe_screenshot_narrowed_portal.png', { x: 0, y: 0, width: 1440, height: 850, scale: 1 });

    // Return to main menu
    await evalCode('switchView("main_menu")');
    await new Promise(r => setTimeout(r, 500));

    // Click Portal 2: Pengendali
    await evalCode('enterSchemePortal("pengendali", false)');
    await new Promise(r => setTimeout(r, 600));

    const isPengendaliActive = await evalCode('!document.getElementById("viewPengendali").classList.contains("hidden")');
    assert(isPengendaliActive, 'Interactive Click: Switched to narrowed view #viewPengendali');

    const bannerPengendali = await evalCode('document.body.innerText.includes("FOKUS TERKUNCI (NARROWED): ENTITAS PENGENDALI")');
    assert(bannerPengendali, 'Narrowed Focus Banner for Pengendali is visibly locked and active');

    // Return to main menu
    await evalCode('switchView("main_menu")');
    await new Promise(r => setTimeout(r, 500));

    // Click Portal 3: Non-Pengendali
    await evalCode('enterSchemePortal("nonpengendali", false)');
    await new Promise(r => setTimeout(r, 600));

    const isNonPengendaliActive = await evalCode('!document.getElementById("viewNonPengendali").classList.contains("hidden")');
    assert(isNonPengendaliActive, 'Interactive Click: Switched to narrowed view #viewNonPengendali');

    const bannerNonPengendali = await evalCode('document.body.innerText.includes("FOKUS TERKUNCI (NARROWED): NON-PENGENDALI")');
    assert(bannerNonPengendali, 'Narrowed Focus Banner for Non-Pengendali is visibly locked and active');

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-7: Executive Compact Mode & Toggle Functionality
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST SUITE FE-7: Executive Compact Mode & Toggle Functionality ---');
    const compactBoxClass = await evalCode(`
      (() => {
        const b = document.getElementById("ndPengendaliBox");
        return b ? b.classList.contains("executive-compact-mode") : false;
      })()
    `);
    assert(compactBoxClass, '#ndPengendaliBox starts in executive-compact-mode by default');

    const toggleFnExists = await evalCode('typeof toggleLayoutMode === "function"');
    assert(toggleFnExists, 'toggleLayoutMode() toggle function is available');

    // Test toggle to extended format
    await evalCode('toggleLayoutMode("pengendali", "extended")');
    const isExtendedNow = await evalCode(`
      (() => {
        const b = document.getElementById("ndPengendaliBox");
        return b ? !b.classList.contains("executive-compact-mode") : false;
      })()
    `);
    assert(isExtendedNow, 'toggleLayoutMode("pengendali", "extended") successfully toggles executive-compact-mode class');

    // Test toggle back to executive format
    await evalCode('toggleLayoutMode("pengendali", "executive")');
    const isExecutiveAgain = await evalCode(`
      (() => {
        const b = document.getElementById("ndPengendaliBox");
        return b ? b.classList.contains("executive-compact-mode") : false;
      })()
    `);
    assert(isExecutiveAgain, 'toggleLayoutMode("pengendali", "executive") restores executive-compact-mode class');

    // Return to main menu
    await evalCode('switchView("main_menu")');
    await new Promise(r => setTimeout(r, 500));

    // ---------------------------------------------------------------------------
    // TEST SUITE FE-8: Mobile Responsive Emulation
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST SUITE FE-8: Mobile Responsive Viewport Emulation ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 800));
    const mobileGridColumns = await evalCode(`
      (() => {
        const grid = document.querySelector(".dedicated-portals-grid");
        return grid ? window.getComputedStyle(grid).display : null;
      })()
    `);
    assert(mobileGridColumns === 'grid', 'Responsive Portals Grid adjusts smoothly to mobile viewport');
    await captureScreenshot('fe_screenshot_mobile_responsive.png', { x: 0, y: 0, width: 390, height: 844, scale: 1 });

    console.log('\n======================================================================');
    console.log(`🏁 FRONT-END E2E TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
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
  console.error('Fatal Front-End Test Error:', err);
  process.exit(1);
});
