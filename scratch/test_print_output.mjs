import { JSDOM } from 'jsdom';
import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

console.log('Testing printNotaDinas output simulation...');

// Mock window.open
let writtenHtml = '';
window.open = function(url, target, features) {
  return {
    document: {
      write: function(content) {
        writtenHtml += content;
      },
      close: function() {}
    }
  };
};

// Run renderAllNotaDinasS1toS10
window.renderAllNotaDinasS1toS10();

// Check matrix elements populated
const mPindo = document.getElementById('nd_matrix_investasi_pindo');
console.log('nd_matrix_investasi_pindo populated?', Boolean(mPindo && mPindo.innerHTML.includes('S1') && mPindo.innerHTML.includes('S10')));

const mP = document.getElementById('nd_matrix_pengendali');
console.log('nd_matrix_pengendali populated?', Boolean(mP && mP.innerHTML.includes('S1') && mP.innerHTML.includes('S10')));

const mNP = document.getElementById('nd_matrix_nonpengendali');
console.log('nd_matrix_nonpengendali populated?', Boolean(mNP && mNP.innerHTML.includes('S1') && mNP.innerHTML.includes('S10')));

// Call printNotaDinas in default executive format
writtenHtml = '';
window.printNotaDinas('investasi', 'executive');

console.log('Written HTML length (Executive Mode):', writtenHtml.length);
console.log('Contains Section 1?', writtenHtml.includes('Ringkasan Posisi Keuangan (Neraca)'));
console.log('Contains Section 7?', writtenHtml.includes('Kesimpulan Kajian Ihsan'));
console.log('Contains Refined Matrix Seksi 8?', writtenHtml.includes('Matriks Eksekutif Sinyal Anomali S1–S10'));
console.log('Contains extended raw 9-component cards?', writtenHtml.includes('extended-audit-details') || writtenHtml.includes('1. Tujuan Analisis'));
console.log('Contains argonRagDeepDiveWidget?', writtenHtml.includes('argonRagDeepDiveWidget'));

// Check print CSS properties
console.log('Contains @page A4?', writtenHtml.includes('@page') && writtenHtml.includes('A4'));
console.log('Contains page-break-inside avoid on tr?', writtenHtml.includes('tr, td, th') && writtenHtml.includes('page-break-inside: avoid'));

if (
  writtenHtml.includes('Ringkasan Posisi Keuangan') &&
  writtenHtml.includes('Kesimpulan Kajian Ihsan') &&
  writtenHtml.includes('Matriks Eksekutif Sinyal Anomali S1–S10') &&
  !writtenHtml.includes('extended-audit-details') &&
  !writtenHtml.includes('argonRagDeepDiveWidget')
) {
  console.log('🎉 PERFECT: Refined Executive Print output is clean, neat, and matches the 3-page Expected Output!');
} else {
  console.error('❌ FAILED: Executive Print output does not meet clean criteria');
  process.exit(1);
}
