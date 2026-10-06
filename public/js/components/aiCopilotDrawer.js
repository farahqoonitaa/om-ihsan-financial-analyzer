/**
 * AI Chatbot RAG & Cross-Verification Copilot Drawer
 * Provides an interactive AI agent that cross-verifies financial calculations
 * against PRD rules, Kajian Ihsan benchmarks, and POJK regulatory ceilings.
 */

let isDrawerOpen = false;
let geminiApiKeyInMemory = "";
let chatHistory = [];

export function renderCopilotDrawer(container, getActiveContext) {
  // Check if drawer already exists
  let drawer = document.getElementById("aiCopilotDrawer");
  if (!drawer) {
    drawer = document.createElement("div");
    drawer.id = "aiCopilotDrawer";
    drawer.className = "copilot-drawer";
    document.body.appendChild(drawer);
  }

  // Floating trigger badge on bottom-right
  let floatingBtn = document.getElementById("floatingCopilotBtn");
  if (!floatingBtn) {
    floatingBtn = document.createElement("button");
    floatingBtn.id = "floatingCopilotBtn";
    floatingBtn.className = "floating-copilot-btn";
    floatingBtn.innerHTML = `
      <span class="copilot-btn-icon">🤖</span>
      <span class="copilot-btn-label">AI Chatbot RAG (Cross-Verify)</span>
    `;
    floatingBtn.addEventListener("click", () => toggleDrawer(true, getActiveContext));
    document.body.appendChild(floatingBtn);
  }

  renderDrawerContent(drawer, getActiveContext);
}

function renderDrawerContent(drawer, getActiveContext) {
  drawer.innerHTML = `
    <div class="copilot-drawer-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <div class="copilot-avatar">🤖</div>
        <div>
          <h3 style="font-size:15px; margin:0; color:var(--forest-deep);">AI Copilot RAG & Cross-Verifier</h3>
          <p style="font-size:11px; color:var(--ink-secondary); margin:0;">Verifikasi silang angka terhadap PRD, Kajian Ihsan & POJK</p>
        </div>
      </div>
      <button id="btnCloseCopilot" class="btn-icon" title="Tutup">✕</button>
    </div>

    <!-- Quick Cross-Verification Prompts -->
    <div class="copilot-quick-bar">
      <span style="font-size:11px; font-weight:600; color:var(--forest); display:block; margin-bottom:6px;">⚡ Verifikasi Silang Cepat:</span>
      <div class="copilot-chips-wrap">
        <button class="copilot-chip" data-query="Cross-Verify Mode A: Periksa kelayakan pinjaman, beban bunga ICR/DSCR, dan batas plafon POJK DER 5.0x.">
          🔍 Verify Mode A (Pendanaan)
        </button>
        <button class="copilot-chip" data-query="Cross-Verify Mode B: Periksa defisit modal kerja NWC, Growth Gap S7 (Opex vs Omzet), dan lonjakan piutang RTC 301.20% PT POJ.">
          🔍 Verify Mode B (Non-Pendanaan)
        </button>
        <button class="copilot-chip" data-query="Cross-Verify Mode C: Periksa formula Modified Z-Score anualisasi PT Daaz Bara Lestari terhadap patokan Kajian Ihsan hlm. 15 (Z = 2.5415) dan stress loss agunan.">
          🔍 Verify Mode C (Investasi)
        </button>
        <button class="copilot-chip" data-query="Cross-Verify Konsolidasi: Periksa eliminasi transaksi afiliasi, batas DER grup 0.96x, dan disparitas hak minoritas NCI (+34.1%) Subsidiary II di bawah IFRS 10.">
          🔍 Verify Konsolidasi & NCI
        </button>
        <button class="copilot-chip" data-query="Uji Integritas Footing: Periksa konsistensi matematis neraca dan laba rugi.">
          ⚖️ Uji Footing Integrity
        </button>
      </div>
    </div>

    <!-- Chat Messages Container -->
    <div id="copilotChatMessages" class="copilot-messages-container">
      <!-- Default Greeting -->
      <div class="chat-bubble agent">
        <div class="bubble-header">
          <span class="bubble-sender">AI Forensic Copilot</span>
          <span class="bubble-time">RAG Grounded</span>
        </div>
        <div class="bubble-body">
          <p>Halo! Saya <strong>AI Financial Forensic Copilot</strong> dengan basis pengetahuan <em>Retrieval-Augmented Generation (RAG)</em>.</p>
          <p style="margin-top:6px;">
            Saya siap memverifikasi silang (<strong>cross-verify</strong>) angka kalkulasi sesi aktif Anda terhadap aturan regulasi <strong>POJK</strong>, metodologi <strong>Kajian Ihsan hlm. 15</strong>, ambang batas <strong>RTC</strong>, dan standar <strong>IFRS 10</strong>.
          </p>
          <p style="margin-top:6px; font-size:11.5px; color:var(--ink-secondary);">
            Silakan klik tombol verifikasi di atas atau ketik pertanyaan/angka laporan keuangan di bawah ini.
          </p>
        </div>
      </div>
    </div>

    <!-- API Key Option Drawer Footer -->
    <div class="copilot-api-key-bar">
      <details>
        <summary style="font-size:11px; cursor:pointer; color:var(--ink-secondary);">⚙️ Opsi: Sambungkan Google Gemini API Key (Opsional)</summary>
        <div style="display:flex; gap:6px; margin-top:6px;">
          <input type="password" id="inputGeminiKey" placeholder="Tempel Gemini API Key (AIza...)" value="${geminiApiKeyInMemory}" style="flex:1; font-size:11px; padding:4px 8px; border:1px solid var(--line); border-radius:4px;">
          <button id="btnSaveGeminiKey" class="btn btn-secondary btn-sm" style="font-size:11px; padding:4px 8px;">Simpan</button>
        </div>
        <span style="font-size:10px; color:var(--ink-muted); display:block; margin-top:3px;">
          *Tanpa API Key, bot tetap berjalan 100% menggunakan Mesin RAG Deterministik Lokal.
        </span>
      </details>
    </div>

    <!-- Chat Input Form -->
    <div class="copilot-input-area">
      <form id="copilotChatForm" style="display:flex; gap:8px;">
        <input type="text" id="copilotInputText" placeholder="Tanyakan analisis atau minta verifikasi angka..." autocomplete="off" required>
        <button type="submit" id="btnSendCopilot" class="btn btn-primary" style="padding:8px 16px;">
          Kirim
        </button>
      </form>
    </div>
  `;

  // Attach Event Listeners
  drawer.querySelector("#btnCloseCopilot").addEventListener("click", () => toggleDrawer(false));

  drawer.querySelectorAll(".copilot-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-query");
      submitQuery(q, getActiveContext);
    });
  });

  const form = drawer.querySelector("#copilotChatForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = drawer.querySelector("#copilotInputText");
    const q = input.value.trim();
    if (q) {
      input.value = "";
      submitQuery(q, getActiveContext);
    }
  });

  const btnKey = drawer.querySelector("#btnSaveGeminiKey");
  if (btnKey) {
    btnKey.addEventListener("click", () => {
      const val = drawer.querySelector("#inputGeminiKey").value.trim();
      geminiApiKeyInMemory = val;
      alert(val ? "Gemini API Key tersimpan di memori sesi aktif." : "Gemini API Key dikosongkan. Kembali ke RAG lokal.");
    });
  }
}

export function toggleDrawer(open, getActiveContext) {
  const drawer = document.getElementById("aiCopilotDrawer");
  if (!drawer) return;
  isDrawerOpen = typeof open === "boolean" ? open : !isDrawerOpen;
  drawer.classList.toggle("open", isDrawerOpen);
  if (isDrawerOpen) {
    const input = drawer.querySelector("#copilotInputText");
    if (input) input.focus();
  }
}

export function openCopilotWithQuery(query, getActiveContext) {
  toggleDrawer(true, getActiveContext);
  setTimeout(() => {
    submitQuery(query, getActiveContext);
  }, 150);
}

// Global hook for outside callers
window.openCopilotWithQuery = openCopilotWithQuery;

async function submitQuery(queryText, getActiveContext) {
  const messagesContainer = document.getElementById("copilotChatMessages");
  if (!messagesContainer) return;

  // 1. Add User Message Bubble
  const userDiv = document.createElement("div");
  userDiv.className = "chat-bubble user";
  userDiv.innerHTML = `
    <div class="bubble-header">
      <span class="bubble-sender">Anda (Auditor / Analis)</span>
      <span class="bubble-time">Sesi Aktif</span>
    </div>
    <div class="bubble-body">
      <p>${escapeHtml(queryText)}</p>
    </div>
  `;
  messagesContainer.appendChild(userDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // 2. Add Loading Indicator Bubble
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "chat-bubble agent loading";
  loadingDiv.innerHTML = `
    <div class="bubble-header">
      <span class="bubble-sender">AI Forensic Copilot</span>
      <span class="bubble-time">Sedang Menganalisis & Cross-Verifying...</span>
    </div>
    <div class="bubble-body">
      <div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>
    </div>
  `;
  messagesContainer.appendChild(loadingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // 3. Collect active context from app state
  const activeContext = getActiveContext ? getActiveContext() : {};

  try {
    const res = await fetch("/api/copilot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: queryText,
        context: activeContext,
        geminiApiKey: geminiApiKeyInMemory
      })
    });

    const data = await res.json();
    loadingDiv.remove();

    // 4. Render Agent Response Bubble
    const agentDiv = document.createElement("div");
    agentDiv.className = "chat-bubble agent";

    const formattedAnswer = formatMarkdownToHtml(data.answer || "Maaf, respon tidak dapat diproses.");
    const citationsHtml = (data.ragCitations && data.ragCitations.length)
      ? `
        <div class="rag-citation-box">
          <strong style="color:var(--forest); font-size:10.5px;">📖 Rujukan Dokumen Grounded (RAG Citations):</strong>
          <ul style="margin:4px 0 0 14px; padding:0; font-size:10.5px; color:var(--ink-secondary);">
            ${data.ragCitations.map(c => `<li><strong>${c.title}</strong> (${c.category}) — Skor: ${c.score}</li>`).join("")}
          </ul>
        </div>
      `
      : "";

    agentDiv.innerHTML = `
      <div class="bubble-header">
        <span class="bubble-sender">AI Forensic Copilot</span>
        <span class="bubble-time">${data.source || "Grounded Engine"}</span>
      </div>
      <div class="bubble-body">
        ${formattedAnswer}
        ${citationsHtml}
      </div>
    `;

    messagesContainer.appendChild(agentDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  } catch (err) {
    loadingDiv.remove();
    const errorDiv = document.createElement("div");
    errorDiv.className = "chat-bubble agent error";
    errorDiv.innerHTML = `
      <div class="bubble-body">
        <p style="color:var(--red);">Gagal menghubungi Copilot: ${err.message}. Pastikan server lokal aktif.</p>
      </div>
    `;
    messagesContainer.appendChild(errorDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatMarkdownToHtml(md) {
  let html = md
    .replace(/^### (.*$)/gim, '<h4 style="color:var(--forest); font-size:13px; font-weight:700; margin:10px 0 4px 0;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="color:var(--forest-deep); font-size:14px; font-weight:700; margin:12px 0 6px 0;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:var(--forest-soft); padding:1px 4px; border-radius:3px; font-size:11px; font-family:var(--font-mono);">$1</code>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left:14px; font-size:12px; margin-bottom:3px;">$1</li>')
    .replace(/\n\n/g, '<p style="margin-bottom:8px;"></p>');
  return html;
}
