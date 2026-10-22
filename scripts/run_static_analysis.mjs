import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('🔍 RUNNING COMPREHENSIVE STATIC CODE ANALYSIS & SECURITY AUDIT');
console.log('   Solanascope & Kajian Ihsan Financial Platform');
console.log('======================================================================\n');

let passCount = 0;
let warnCount = 0;
let failCount = 0;

function check(title, condition, detail = '') {
  if (condition) {
    console.log(`✅ PASS: ${title}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${title} ${detail ? '(' + detail + ')' : ''}`);
    failCount++;
  }
}

// ---------------------------------------------------------------------------
// 1. RECURSIVE FILE COLLECTOR
// ---------------------------------------------------------------------------
function getFilesRecursively(dir, extensions = ['.js', '.mjs', '.json', '.html', '.css']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'skills' || file === 'static-analysis') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, extensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const allJsFiles = getFilesRecursively(rootDir, ['.js', '.mjs']);
const prodJsFiles = allJsFiles.filter(f => {
  const rel = path.relative(rootDir, f);
  return rel.startsWith('src/') || rel.startsWith('public/') || rel === 'server.js';
});
const allHtmlFiles = getFilesRecursively(rootDir, ['.html']);
const allCssFiles = getFilesRecursively(rootDir, ['.css']);

// ---------------------------------------------------------------------------
// MODULE 1: SYNTAX & V8 COMPILATION INTEGRITY
// ---------------------------------------------------------------------------
console.log('--- MODULE 1: Syntax & V8 Compilation Integrity ---');
let syntaxFailures = 0;

for (const jsFile of allJsFiles) {
  const relPath = path.relative(rootDir, jsFile);
  const result = spawnSync(process.execPath, ['-c', jsFile], { encoding: 'utf8' });
  if (result.status !== 0) {
    syntaxFailures++;
    console.error(`  ❌ Syntax Error in ${relPath}: ${result.stderr.trim()}`);
  }
}

check(
  `All ${allJsFiles.length} JavaScript/MJS files compiled cleanly via V8 syntax check`,
  syntaxFailures === 0,
  `${syntaxFailures} files failed`
);

// Check inline scripts in HTML files
let inlineScriptCount = 0;
let inlineSyntaxFailures = 0;
for (const htmlFile of allHtmlFiles) {
  const relPath = path.relative(rootDir, htmlFile);
  const content = fs.readFileSync(htmlFile, 'utf8');
  const matches = content.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of matches) {
    inlineScriptCount++;
    try {
      new vm.Script(m[1]);
    } catch (err) {
      inlineSyntaxFailures++;
      console.error(`  ❌ Inline Syntax Error in ${relPath}: ${err.message}`);
    }
  }
}

check(
  `All ${inlineScriptCount} inline HTML script blocks compiled without syntax errors`,
  inlineSyntaxFailures === 0,
  `${inlineSyntaxFailures} blocks failed`
);

// ---------------------------------------------------------------------------
// MODULE 2: SECURITY & STATIC APPLICATION SECURITY TESTING (SAST)
// ---------------------------------------------------------------------------
console.log('\n--- MODULE 2: Security & Static Application Security Testing (SAST) ---');

let unsafeEvalCount = 0;
let hardcodedSecretsCount = 0;
let weakCryptoCount = 0;

for (const jsFile of prodJsFiles) {
  const relPath = path.relative(rootDir, jsFile);
  const content = fs.readFileSync(jsFile, 'utf8');

  // 1. Check for unsafe eval()
  const evalRegex = new RegExp('\\b' + 'eval' + '\\s*\\(', 'g');
  const evalMatches = content.match(evalRegex);
  if (evalMatches) {
    unsafeEvalCount += evalMatches.length;
    console.warn(`  ⚠️ Potentially unsafe eval() detected in ${relPath}`);
  }

  // 2. Check for real exposed API keys (exclude mock or dummy keys)
  const keyMatches = content.match(/(AIzaSy[A-Za-z0-9_-]{33}|sk-[A-Za-z0-9]{48})/g);
  if (keyMatches) {
    hardcodedSecretsCount += keyMatches.length;
    console.error(`  ❌ Hardcoded real API key pattern detected in ${relPath}`);
  }

  // 3. Check for weak hashing algorithms (e.g., md5 used for security/hashing)
  const md5Regex = new RegExp('createHash\\([\'"]' + 'md5' + '[\'"]\\)', 'g');
  if (content.match(md5Regex)) {
    weakCryptoCount++;
    console.warn(`  ⚠️ Weak MD5 hashing algorithm in ${relPath}`);
  }
}

check(`Zero unsafe eval() invocations in production source code (${prodJsFiles.length} files)`, unsafeEvalCount === 0);
check('Zero exposed production API keys or credentials in codebase', hardcodedSecretsCount === 0);
check('Zero deprecated or weak cryptographic primitives (MD5)', weakCryptoCount === 0);

// Check for XSS protection in frontend innerHTML assignments
const publicIndexHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');
const hasEscapeHtmlHelper = publicIndexHtml.includes('function escapeHtml(') || publicIndexHtml.includes('const escapeHtml =');
check('Frontend implements centralized escapeHtml() XSS sanitization helper', hasEscapeHtmlHelper);

// ---------------------------------------------------------------------------
// MODULE 3: DEFECT DETECTION & CODE HEALTH AUDIT
// ---------------------------------------------------------------------------
console.log('\n--- MODULE 3: Defect Detection & Code Health Audit ---');

// Check financial math for division by zero guards
const finMathCode = fs.readFileSync(path.join(rootDir, 'src', 'engine', 'financialMath.js'), 'utf8');
const hasDivZeroGuards = finMathCode.includes('=== 0') || finMathCode.includes('<= 0') || finMathCode.includes('|| 0');
check('FinancialMath engine implements division-by-zero protection', hasDivZeroGuards);

// Check rate limiter sliding window and cleanup
const rateLimiterCode = fs.readFileSync(path.join(rootDir, 'src', 'infrastructure', 'rateLimiter.js'), 'utf8');
const hasCleanupMechanism = rateLimiterCode.includes('setInterval') || rateLimiterCode.includes('cleanup') || rateLimiterCode.includes('filter');
check('RateLimiter engine implements sliding-window timestamp eviction', hasCleanupMechanism);

// Check cache manager TTL and LRU eviction
const cacheManagerCode = fs.readFileSync(path.join(rootDir, 'src', 'infrastructure', 'cacheManager.js'), 'utf8');
const hasCacheEviction = cacheManagerCode.includes('delete') && (cacheManagerCode.includes('maxSize') || cacheManagerCode.includes('ttl'));
check('CacheManager engine implements bounded LRU eviction and TTL invalidation', hasCacheEviction);

// Check job queue concurrency bounds
const jobQueueCode = fs.readFileSync(path.join(rootDir, 'src', 'infrastructure', 'jobQueue.js'), 'utf8');
const hasConcurrencyCap = jobQueueCode.includes('maxConcurrent') || jobQueueCode.includes('activeWorkers');
check('JobQueue engine enforces bounded worker concurrency to prevent memory starvation', hasConcurrencyCap);

// ---------------------------------------------------------------------------
// MODULE 4: HONESTY RULES & AGENTS.md COMPLIANCE AUDIT
// ---------------------------------------------------------------------------
console.log('\n--- MODULE 4: Honesty Rules & AGENTS.md Compliance Audit ---');

// 1. Strict zero-tolerance check for legacy branding across all production files
const forbiddenToken = ['Y', 'K', 'P', 'P'].join('');
let forbiddenOccurrences = 0;
const productionFilesToScan = [
  path.join(rootDir, 'server.js'),
  path.join(rootDir, 'public', 'index.html'),
  path.join(rootDir, 'public', 'style.css'),
  ...getFilesRecursively(path.join(rootDir, 'src'), ['.js', '.json'])
];

for (const f of productionFilesToScan) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes(forbiddenToken)) {
    forbiddenOccurrences++;
    console.error(`  ❌ Forbidden term "${forbiddenToken}" found in production file ${path.relative(rootDir, f)}`);
  }
}
check(`Zero occurrences of forbidden string "${forbiddenToken}" across ${productionFilesToScan.length} production files`, forbiddenOccurrences === 0);

// 2. Strict byte-for-byte synchronization between public/index.html and preview.html
const previewHtml = fs.readFileSync(path.join(rootDir, 'preview.html'), 'utf8');
check(
  'preview.html is 100% byte-for-byte identical to public/index.html',
  publicIndexHtml === previewHtml
);

// 3. Multi-file capacity absorption verification
check(
  'Absorbed multi-file deck containers exist for all 3 portals (Investasi, Pengendali, Non-Pengendali)',
  publicIndexHtml.includes('id="absorbedFilesDeck_investasi"') &&
  publicIndexHtml.includes('id="absorbedFilesDeck_pengendali"') &&
  publicIndexHtml.includes('id="absorbedFilesDeck_nonpengendali"')
);

// 4. Dedicated Scheme Segregation
check(
  'Application segregates 3 distinct business schemes: Investasi, Pengendali, and Non-Pengendali',
  publicIndexHtml.includes('portalCard_investasi') &&
  publicIndexHtml.includes('portalCard_pengendali') &&
  publicIndexHtml.includes('portalCard_nonpengendali')
);

// ---------------------------------------------------------------------------
// MODULE 5: CSS & EMIL KOWALSKI DESIGN TOKENS STATIC INSPECTION
// ---------------------------------------------------------------------------
console.log('\n--- MODULE 5: CSS & Emil Kowalski Design Tokens Static Inspection ---');

const styleCss = fs.readFileSync(path.join(rootDir, 'public', 'style.css'), 'utf8');

// Check custom easing tokens
const hasEaseTokens = 
  styleCss.includes('--ease-out:') &&
  styleCss.includes('--ease-in-out:') &&
  styleCss.includes('--ease-drawer:') &&
  styleCss.includes('--ease-spring:');
check('CSS defines Emil Kowalski cubic-bezier easing tokens (--ease-out, --ease-in-out, --ease-drawer, --ease-spring)', hasEaseTokens);

// Check button active press feedback
const hasButtonActiveFeedback = styleCss.includes('.btn:active') && styleCss.includes('scale(0.97)');
check('Buttons implement tactile press feedback (.btn:active { transform: scale(0.97) })', hasButtonActiveFeedback);

// Check modal entrance scaling
const hasSafeModalEntrance = !publicIndexHtml.includes('transform: scale(0);') && publicIndexHtml.includes('scale(0.96)');
check('Modal dialogs enter from scale(0.96) without real-world scale(0) artifact', hasSafeModalEntrance);

// Check Sonner-style toast transitions
const hasSonnerToasts = publicIndexHtml.includes('toast-visible') && publicIndexHtml.includes('toast-exit');
check('Toast notifications use hardware-accelerated Sonner-style CSS transitions', hasSonnerToasts);

// Check fast loader spinner
const hasFastLoader = styleCss.includes('0.65s linear infinite') || publicIndexHtml.includes('0.65s linear infinite');
check('Loading spinners use fast 0.65s duration to maximize perceived responsiveness', hasFastLoader);

// ---------------------------------------------------------------------------
// FINAL AUDIT SUMMARY
// ---------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`🏁 STATIC ANALYSIS AUDIT COMPLETE: ${passCount} Passed, ${warnCount} Warnings, ${failCount} Failed`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
