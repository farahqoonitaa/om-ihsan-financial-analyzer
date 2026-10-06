/**
 * Main Application Orchestrator & In-Memory State Manager
 * Zero Persistence: No DB, No localStorage, No sessionStorage.
 * All state lives in memory for the current session only.
 * 
 * Features:
 * 1. Entry RAG Knowledge Assistant Modal with quick cross-verify tester
 * 2. Main Menu with 3 Primary Entry Point Cards + 1-Click Auto-Calculate from Files
 * 3. Dedicated Mode A (Pendanaan), Mode B (Non-Pendanaan), Mode C (Skema Investasi) Pages
 * 4. Multi-Entity Auto-Calculated Dashboard
 * 5. Interactive AI Chatbot RAG Copilot with Cross-Verification against PRD & POJK rules
 */

import { renderRagModal } from "./components/ragModal.js";
import { renderHeader } from "./components/navigation.js";
import { renderCopilotDrawer, openCopilotWithQuery, toggleDrawer } from "./components/aiCopilotDrawer.js";
import { renderUploadModal } from "./components/uploadModal.js";
import { renderMainMenu } from "./pages/mainMenu.js";
import { renderAutoCalculatedDashboard } from "./pages/autoCalculatedDashboard.js";
import { renderPendanaanInput, renderPendanaanResult } from "./pages/pendanaanPage.js";
import { renderNonPendanaanInput, renderNonPendanaanResult } from "./pages/nonPendanaanPage.js";
import { renderInvestasiInput, renderInvestasiResult } from "./pages/investasiPage.js";

// Pure In-Memory Session State
const memoryState = {
  currentView: "rag_entry", // rag_entry | main_menu | auto_dashboard | pendanaan_* | nonpendanaan_* | investasi_*
  pendanaan: {
    inputs: null,
    result: null
  },
  nonPendanaan: {
    inputs: null,
    result: null
  },
  investasi: {
    inputs: null,
    result: null
  },
  autoCalculatedData: null,
  sourceFileName: "Benchmark Terpadu YKPP"
};

// Clear any accidental storage from previous apps
try {
  localStorage.clear();
  sessionStorage.clear();
} catch (e) {}

document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("navContainer");
  const mainContainer = document.getElementById("mainAppContainer");

  // Helper: Return current state context for AI Copilot cross-verification
  function getActiveContext() {
    return {
      currentView: memoryState.currentView,
      pendanaan: memoryState.pendanaan,
      nonPendanaan: memoryState.nonPendanaan,
      investasi: memoryState.investasi,
      autoCalculatedSummary: memoryState.autoCalculatedData ? {
        source: memoryState.sourceFileName,
        hasPengendali: Boolean(memoryState.autoCalculatedData.pengendali),
        hasNonPengendali: Boolean(memoryState.autoCalculatedData.nonPengendali),
        hasInvestasi: Boolean(memoryState.autoCalculatedData.investasi),
        hasKonsolidasi: Boolean(memoryState.autoCalculatedData.konsolidasi)
      } : null
    };
  }

  // Mount persistent Copilot Drawer
  renderCopilotDrawer(document.body, getActiveContext);

  function navigateTo(view) {
    memoryState.currentView = view;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Trigger File Upload Modal
  function openUpload() {
    renderUploadModal((parsedData, fileName) => {
      memoryState.autoCalculatedData = parsedData;
      memoryState.sourceFileName = fileName;
      navigateTo("auto_dashboard");
    });
  }

  // Trigger 1-Click Auto-Calculate from Benchmark
  async function runAutoCalculate() {
    try {
      const res = await fetch("/api/seed-data");
      const data = await res.json();
      memoryState.autoCalculatedData = data;
      memoryState.sourceFileName = "Benchmark Riil (PT EPS, PT POJ, PT Daaz & Konsolidasi)";
      navigateTo("auto_dashboard");
    } catch (err) {
      alert("Gagal memuat data auto-calculate: " + err.message);
    }
  }

  // Trigger AI Copilot
  function openCopilot(query) {
    if (query && typeof query === "string") {
      openCopilotWithQuery(query, getActiveContext);
    } else {
      toggleDrawer(true, getActiveContext);
    }
  }

  function render() {
    // 1. Render Header
    renderHeader(
      navContainer,
      memoryState.currentView,
      (targetView) => navigateTo(targetView),
      openUpload,
      runAutoCalculate,
      openCopilot
    );

    // 2. Render Main View Area
    mainContainer.innerHTML = "";

    switch (memoryState.currentView) {
      case "main_menu":
        renderMainMenu(
          mainContainer,
          (mode) => {
            if (mode === "pendanaan") navigateTo("pendanaan_input");
            else if (mode === "nonpendanaan") navigateTo("nonpendanaan_input");
            else if (mode === "investasi") navigateTo("investasi_input");
          },
          openUpload,
          runAutoCalculate,
          openCopilot
        );
        break;

      // Auto-Calculated Multi-Entity Dashboard
      case "auto_dashboard":
        renderAutoCalculatedDashboard(
          mainContainer,
          memoryState.autoCalculatedData,
          memoryState.sourceFileName,
          (mode, prefillInputs) => {
            if (mode === "pendanaan") {
              memoryState.pendanaan.inputs = prefillInputs;
              navigateTo("pendanaan_input");
            } else if (mode === "nonpendanaan") {
              memoryState.nonPendanaan.inputs = prefillInputs;
              navigateTo("nonpendanaan_input");
            } else if (mode === "investasi") {
              memoryState.investasi.inputs = prefillInputs;
              navigateTo("investasi_input");
            }
          },
          () => navigateTo("main_menu")
        );
        break;

      // Mode A: Pendanaan
      case "pendanaan_input":
        renderPendanaanInput(
          mainContainer,
          (inputs, result) => {
            memoryState.pendanaan.inputs = inputs;
            memoryState.pendanaan.result = result;
            navigateTo("pendanaan_result");
          },
          () => navigateTo("main_menu"),
          memoryState.pendanaan.inputs
        );
        break;

      case "pendanaan_result":
        renderPendanaanResult(
          mainContainer,
          memoryState.pendanaan.inputs,
          memoryState.pendanaan.result,
          () => navigateTo("pendanaan_input"),
          () => navigateTo("main_menu")
        );
        break;

      // Mode B: Non-Pendanaan
      case "nonpendanaan_input":
        renderNonPendanaanInput(
          mainContainer,
          (inputs, result) => {
            memoryState.nonPendanaan.inputs = inputs;
            memoryState.nonPendanaan.result = result;
            navigateTo("nonpendanaan_result");
          },
          () => navigateTo("main_menu"),
          memoryState.nonPendanaan.inputs
        );
        break;

      case "nonpendanaan_result":
        renderNonPendanaanResult(
          mainContainer,
          memoryState.nonPendanaan.inputs,
          memoryState.nonPendanaan.result,
          () => navigateTo("nonpendanaan_input"),
          () => navigateTo("main_menu")
        );
        break;

      // Mode C: Skema Investasi
      case "investasi_input":
        renderInvestasiInput(
          mainContainer,
          (inputs, result) => {
            memoryState.investasi.inputs = inputs;
            memoryState.investasi.result = result;
            navigateTo("investasi_result");
          },
          () => navigateTo("main_menu"),
          memoryState.investasi.inputs
        );
        break;

      case "investasi_result":
        renderInvestasiResult(
          mainContainer,
          memoryState.investasi.inputs,
          memoryState.investasi.result,
          () => navigateTo("investasi_input"),
          () => navigateTo("main_menu")
        );
        break;

      default:
        navigateTo("main_menu");
        break;
    }
  }

  // --- Initial Launch Flow ---
  // Show RAG Knowledge Assistant popup first as requested
  renderRagModal(
    () => {
      // Once user closes or continues from RAG modal, show Main Menu
      navigateTo("main_menu");
    },
    (query) => {
      // If user clicked quick cross-verify query in modal
      navigateTo("main_menu");
      openCopilot(query);
    }
  );
});
