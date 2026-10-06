/**
 * Mode A: Pendanaan Calculation (Funding & Debt Service Logic)
 * Pure, isolated calculation module without side effects.
 */

import { parseNumber } from "./formatters.js";

export function calculatePendanaan(inputs) {
  const principal = parseNumber(inputs.principal);
  const rateAnnual = parseNumber(inputs.annualRatePercent) / 100;
  const tenor = Math.max(1, Math.round(parseNumber(inputs.tenorYears)));
  const amortType = inputs.amortizationType || "equal_principal"; // equal_principal | annuity | bullet
  const ebit = parseNumber(inputs.annualEbit);
  const ebitda = parseNumber(inputs.annualEbitda);
  const tax = parseNumber(inputs.annualTax);
  const existingEquity = parseNumber(inputs.existingEquity);
  const existingLiab = parseNumber(inputs.existingLiabilities);

  // 1. Build Amortization Schedule
  let schedule = [];
  let currentBalance = principal;
  let totalInterest = 0;
  let totalPrincipalPaid = 0;

  if (amortType === "equal_principal") {
    // Pokok Tetap per Tahun
    const yearlyPrincipal = principal / tenor;
    for (let yr = 1; yr <= tenor; yr++) {
      const interest = currentBalance * rateAnnual;
      const payment = yearlyPrincipal + interest;
      const endingBalance = Math.max(0, currentBalance - yearlyPrincipal);

      schedule.push({
        year: yr,
        beginningBalance: currentBalance,
        principalPayment: yearlyPrincipal,
        interestPayment: interest,
        totalPayment: payment,
        endingBalance
      });

      totalInterest += interest;
      totalPrincipalPaid += yearlyPrincipal;
      currentBalance = endingBalance;
    }
  } else if (amortType === "annuity") {
    // Angsuran Anuitas Tetap
    let yearlyAnnuity = 0;
    if (rateAnnual > 0) {
      yearlyAnnuity = principal * (rateAnnual / (1 - Math.pow(1 + rateAnnual, -tenor)));
    } else {
      yearlyAnnuity = principal / tenor;
    }

    for (let yr = 1; yr <= tenor; yr++) {
      const interest = currentBalance * rateAnnual;
      let princ = yearlyAnnuity - interest;
      if (yr === tenor || princ > currentBalance) princ = currentBalance;
      const payment = princ + interest;
      const endingBalance = Math.max(0, currentBalance - princ);

      schedule.push({
        year: yr,
        beginningBalance: currentBalance,
        principalPayment: princ,
        interestPayment: interest,
        totalPayment: payment,
        endingBalance
      });

      totalInterest += interest;
      totalPrincipalPaid += princ;
      currentBalance = endingBalance;
    }
  } else {
    // Bullet (Pokok di Akhir)
    for (let yr = 1; yr <= tenor; yr++) {
      const interest = currentBalance * rateAnnual;
      const isLast = yr === tenor;
      const princ = isLast ? principal : 0;
      const payment = princ + interest;
      const endingBalance = isLast ? 0 : currentBalance;

      schedule.push({
        year: yr,
        beginningBalance: currentBalance,
        principalPayment: princ,
        interestPayment: interest,
        totalPayment: payment,
        endingBalance
      });

      totalInterest += interest;
      totalPrincipalPaid += princ;
      currentBalance = endingBalance;
    }
  }

  // 2. Year 1 Service Burden
  const yr1 = schedule[0] || { principalPayment: 0, interestPayment: 0, totalPayment: 0 };
  const yr1Interest = yr1.interestPayment;
  const yr1DebtService = yr1.totalPayment;
  const monthlyInstallment = yr1DebtService / 12;

  // 3. Financial Covenants & Metrics
  // ICR = EBIT / Bunga Tahun 1
  let icr = null;
  let icrStatus = "N/A";
  if (yr1Interest > 0) {
    icr = ebit / yr1Interest;
    if (icr >= 3.0) {
      icrStatus = { text: "Aman (≥ 3.0x)", badge: "badge-green" };
    } else if (icr >= 1.5) {
      icrStatus = { text: "Waspada (1.5x - 3.0x)", badge: "badge-yellow" };
    } else {
      icrStatus = { text: "Bahaya (< 1.5x)", badge: "badge-red" };
    }
  }

  // DSCR = (EBITDA - Pajak) / (Pokok + Bunga)
  let dscr = null;
  let dscrStatus = "N/A";
  if (yr1DebtService > 0) {
    const cashAvailable = Math.max(0, ebitda - tax);
    dscr = cashAvailable / yr1DebtService;
    if (dscr >= 1.30) {
      dscrStatus = { text: "Sangat Kuat (≥ 1.30x)", badge: "badge-green" };
    } else if (dscr >= 1.0) {
      dscrStatus = { text: "Ketat (1.0x - 1.29x)", badge: "badge-yellow" };
    } else {
      dscrStatus = { text: "Defisit Arus Kas (< 1.0x)", badge: "badge-red" };
    }
  }

  // Proyeksi DER
  let projectedDer = null;
  let derStatus = "N/A";
  if (existingEquity > 0) {
    projectedDer = (existingLiab + principal) / existingEquity;
    if (projectedDer <= 5.0) {
      derStatus = { text: "Memenuhi Plafon POJK (≤ 5.0x)", badge: "badge-green" };
    } else {
      derStatus = { text: "Melampaui Batas POJK (> 5.0x)", badge: "badge-red" };
    }
  }

  // Cash Flow Burden %
  let cashBurdenPercent = null;
  if (ebitda > 0) {
    cashBurdenPercent = (yr1DebtService / ebitda) * 100;
  }

  return {
    summary: {
      principal,
      totalInterest,
      totalPayments: principal + totalInterest,
      annualDebtServiceYr1: yr1DebtService,
      monthlyInstallmentYr1: monthlyInstallment,
      icr,
      icrStatus,
      dscr,
      dscrStatus,
      projectedDer,
      derStatus,
      cashBurdenPercent,
      tenor,
      rateAnnualPercent: inputs.annualRatePercent,
      amortTypeLabel: amortType === "equal_principal" ? "Pokok Tetap (Equal Principal)" : (amortType === "annuity" ? "Anuitas Tetap" : "Bullet (Pelunasan di Akhir)")
    },
    schedule
  };
}
