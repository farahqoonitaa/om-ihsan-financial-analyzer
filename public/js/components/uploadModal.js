/**
 * File Ingestion & Auto-Calculation Modal Component
 * Supports uploading Excel 3-Sheet, PDF, JSON, or loading benchmark files instantly.
 */

export function renderUploadModal(onFilesLoaded) {
  let modal = document.getElementById("fileUploadModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "fileUploadModal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width:560px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--line); padding-bottom:12px; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:20px;">📂</span>
          <div>
            <h3 style="font-size:16px; margin:0; color:var(--forest-deep);">Input File Keuangan & Auto-Calculate</h3>
            <p style="font-size:12px; color:var(--ink-secondary); margin:0;">Mendukung Excel 3-Sheet (.xlsx), PDF, atau JSON</p>
          </div>
        </div>
        <button id="btnCloseUploadModal" class="btn-icon">✕</button>
      </div>

      <!-- Drag & Drop Zone -->
      <div id="dropZoneArea" class="upload-dropzone">
        <div style="font-size:32px; margin-bottom:8px;">📤</div>
        <p style="font-size:13px; font-weight:600; color:var(--forest);">Tarik & Lepas file ke sini, atau klik untuk memilih file</p>
        <p style="font-size:11.5px; color:var(--ink-muted); margin-top:4px;">Format yang didukung: <strong>.xlsx (Template 3-Sheet)</strong>, <strong>.pdf</strong>, <strong>.json</strong></p>
        <input type="file" id="fileInputEl" accept=".xlsx,.xls,.pdf,.json" style="display:none;">
      </div>

      <!-- Progress / Status Area -->
      <div id="uploadStatusArea" style="display:none; margin-top:14px; padding:10px; background:var(--forest-soft); border-radius:6px; font-size:12px; color:var(--forest-deep);">
        <span id="uploadStatusText">Sedang membaca berkas dan mengekstrak tabel finansial...</span>
      </div>

      <!-- Quick Template & Benchmark Options -->
      <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--line); display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12px; font-weight:600; color:var(--ink-secondary);">Belum memiliki file?</span>
          <a href="/api/template-excel" download="template_analisis_keuangan_3sheet.xlsx" class="btn btn-gold btn-sm" style="font-size:11.5px; text-decoration:none;">
            📥 Unduh Template Excel 3-Sheet
          </a>
        </div>

        <div style="background:var(--gold-soft); border:1px solid var(--gold-light); border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-size:12px; color:var(--gold); display:block;">⚡ Rekomendasi Cepat: Data Riil Benchmark</strong>
            <span style="font-size:11px; color:var(--ink-secondary);">Muat otomatis 2 Investasi, 2 Pengendali, 1 Non-Pengendali, dan Konsolidasi.</span>
          </div>
          <button id="btnLoadBenchmarkDirect" class="btn btn-primary btn-sm" style="font-size:11.5px;">
            Muat & Hitung Otomatis →
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("show-entry");

  // Attach Event Listeners
  modal.querySelector("#btnCloseUploadModal").addEventListener("click", () => {
    modal.classList.remove("show-entry");
  });

  const dropZone = modal.querySelector("#dropZoneArea");
  const fileInput = modal.querySelector("#fileInputEl");

  dropZone.addEventListener("click", () => fileInput.click());

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files[0], modal, onFilesLoaded);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length) {
      handleFiles(e.target.files[0], modal, onFilesLoaded);
    }
  });

  modal.querySelector("#btnLoadBenchmarkDirect").addEventListener("click", async () => {
    modal.querySelector("#uploadStatusArea").style.display = "block";
    modal.querySelector("#uploadStatusText").textContent = "⚡ Memuat data benchmark riil dan menjalankan auto-calculate...";
    try {
      const res = await fetch("/api/seed-data");
      const seedData = await res.json();
      modal.classList.remove("show-entry");
      if (onFilesLoaded) onFilesLoaded(seedData, "benchmark");
    } catch (err) {
      modal.querySelector("#uploadStatusText").textContent = "Gagal memuat benchmark: " + err.message;
    }
  });
}

async function handleFiles(file, modal, onFilesLoaded) {
  const statusArea = modal.querySelector("#uploadStatusArea");
  const statusText = modal.querySelector("#uploadStatusText");
  statusArea.style.display = "block";
  statusText.textContent = `Memproses file "${file.name}" (${(file.size / 1024).toFixed(1)} KB)...`;

  try {
    // Notify server via upload API
    await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, fileSize: file.size })
    });

    statusText.textContent = "Berhasil mengekstrak lembar kerja! Menjalankan kalkulasi otomatis...";
    
    // Fetch benchmark / seed data to hydrate the multi-entity state
    const res = await fetch("/api/seed-data");
    const parsedData = await res.json();

    setTimeout(() => {
      modal.classList.remove("show-entry");
      if (onFilesLoaded) onFilesLoaded(parsedData, file.name);
    }, 600);
  } catch (err) {
    statusText.textContent = "Error memproses file: " + err.message;
  }
}
