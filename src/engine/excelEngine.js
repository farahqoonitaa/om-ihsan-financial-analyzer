/**
 * Excel Engine & File Ingestion Parser
 */

const fs = require("fs");
const path = require("path");

const TEMPLATE_PATH = path.join(__dirname, "../../data/templates/template_analisis_keuangan_3sheet.xlsx");

function getTemplatePath() {
  if (fs.existsSync(TEMPLATE_PATH)) {
    return TEMPLATE_PATH;
  }
  return null;
}

function parseJsonPayload(payload) {
  try {
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

module.exports = {
  getTemplatePath,
  parseJsonPayload
};
