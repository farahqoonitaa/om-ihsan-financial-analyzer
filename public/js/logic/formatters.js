/**
 * Pure Utility & Formatting Module
 * Handles currency (Rp), percentages, ratios, and input sanitization.
 */

export function parseNumber(val) {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val || typeof val !== "string") return 0;
  
  let cleaned = val.trim();
  // Check if Indonesian format: contains dot as thousand and comma as decimal
  if (cleaned.includes(".") && cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",") && !cleaned.includes(".")) {
    cleaned = cleaned.replace(",", ".");
  }
  // Remove non-numeric characters except minus and dot
  cleaned = cleaned.replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatRupiah(amount, withDecimals = false) {
  if (amount == null || isNaN(amount)) return "Rp 0";
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let formatted = "";
  if (withDecimals) {
    formatted = absAmount.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    formatted = Math.round(absAmount).toLocaleString("id-ID");
  }

  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

export function formatPercent(value, decimals = 2) {
  if (value == null || isNaN(value)) return "0.00%";
  return `${value.toFixed(decimals).replace(".", ",")}%`;
}

export function formatRatio(value, decimals = 2) {
  if (value == null || isNaN(value)) return "0.00x";
  return `${value.toFixed(decimals).replace(".", ",")}x`;
}

export function validateRequired(value, fieldName) {
  if (value == null || String(value).trim() === "") {
    return `${fieldName} wajib diisi.`;
  }
  return null;
}

export function validatePositiveNumber(value, fieldName, allowZero = false) {
  const req = validateRequired(value, fieldName);
  if (req) return req;
  const num = parseNumber(value);
  if (isNaN(num)) return `${fieldName} harus berupa angka yang valid.`;
  if (!allowZero && num <= 0) return `${fieldName} harus bernilai lebih besar dari 0.`;
  if (allowZero && num < 0) return `${fieldName} tidak boleh bernilai negatif.`;
  return null;
}
