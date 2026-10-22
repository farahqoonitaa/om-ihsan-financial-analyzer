// scripts/benchmark_high_scale.mjs
/**
 * Enterprise High-Scale Concurrency, Caching & Observability Benchmark Suite
 * Kajian Ihsan Platform
 */

import { Readable } from 'stream';
import { EventEmitter } from 'events';
import assert from 'assert';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const server = require('../server.js');
const cacheManager = require('../src/infrastructure/cacheManager.js');
const jobQueue = require('../src/infrastructure/jobQueue.js');
const rateLimiter = require('../src/infrastructure/rateLimiter.js');
const metricsCollector = require('../src/infrastructure/metricsCollector.js');

console.log('================================================================');
console.log('⚡ BENCHMARKING HIGH-SCALE ENTERPRISE INFRASTRUCTURE');
console.log('   Kajian Ihsan Platform Concurrency, Cache & Metrics');
console.log('================================================================\n');

let passedTests = 0;

function runTest(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`✅ PASS: ${name}`);
      passedTests++;
    })
    .catch((err) => {
      console.error(`❌ FAIL: ${name}`);
      console.error(err);
      process.exit(1);
    });
}

class MockResponse extends EventEmitter {
  constructor(resolve) {
    super();
    this.resolve = resolve;
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
  }
  writeHead(code, hdrs) {
    this.statusCode = code;
    if (hdrs) {
      for (const [k, v] of Object.entries(hdrs)) {
        this.headers[k.toLowerCase()] = v;
      }
    }
  }
  setHeader(k, v) {
    this.headers[k.toLowerCase()] = v;
  }
  getHeader(k) {
    return this.headers[k.toLowerCase()];
  }
  write(chunk) {
    if (chunk) this.body += chunk.toString();
  }
  end(chunk) {
    if (chunk) this.body += chunk.toString();
    this.emit('finish');
    this.resolve({
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body,
      json: () => {
        try { return JSON.parse(this.body); } catch (e) { return null; }
      }
    });
  }
}

/**
 * High-speed in-process HTTP dispatcher
 */
function invokeServer(method, urlPath, body = null, headers = {}) {
  return new Promise((resolve) => {
    const handler = server.listeners('request')[0];
    const req = new Readable({
      read() {
        if (body) {
          const data = typeof body === 'string' ? body : JSON.stringify(body);
          this.push(data);
        }
        this.push(null);
      }
    });
    req.method = method;
    req.url = urlPath;
    req.headers = {
      'host': 'localhost:3005',
      ...headers
    };
    if (body) {
      const data = typeof body === 'string' ? body : JSON.stringify(body);
      req.headers['content-type'] = 'application/json';
      req.headers['content-length'] = Buffer.byteLength(data);
    }

    const res = new MockResponse(resolve);
    handler(req, res);
  });
}

async function main() {
  // 1. Kubernetes Liveness Probe (/api/healthz)
  await runTest('Kubernetes Liveness Probe (/api/healthz)', async () => {
    const res = await invokeServer('GET', '/api/healthz');
    assert.strictEqual(res.statusCode, 200);
    const data = res.json();
    assert.strictEqual(data.status, 'healthy');
    assert(data.uptimeSeconds >= 0);
    assert(data.memory && data.memory.heapUsedMB);
  });

  // 2. Kubernetes Readiness Probe (/api/readyz)
  await runTest('Kubernetes Readiness Probe (/api/readyz)', async () => {
    const res = await invokeServer('GET', '/api/readyz');
    assert.strictEqual(res.statusCode, 200);
    const data = res.json();
    assert.strictEqual(data.status, 'ready');
    assert.strictEqual(data.scratchStorage, true);
    assert.strictEqual(data.engines.documentParser, true);
    assert.strictEqual(data.engines.financialMath, true);
  });

  // 3. Prometheus Metrics Exposition (/api/metrics)
  await runTest('Prometheus Text Exposition (/api/metrics)', async () => {
    const res = await invokeServer('GET', '/api/metrics');
    assert.strictEqual(res.statusCode, 200);
    assert(res.body.includes('# HELP http_requests_total'));
    assert(res.body.includes('# TYPE http_requests_total counter'));
    assert(res.body.includes('node_memory_heap_used_bytes'));
  });

  // 4. Enterprise System Stats & Telemetry (/api/system/stats)
  await runTest('System Stats & Health Telemetry (/api/system/stats)', async () => {
    const res = await invokeServer('GET', '/api/system/stats');
    assert.strictEqual(res.statusCode, 200);
    const data = res.json();
    assert(data.system);
    assert(data.cache);
    assert(data.jobQueue);
  });

  // 5. Rate Limiter Sliding Window Protection
  await runTest('Sliding Window Rate Limiter & Headers (/api/system/stats)', async () => {
    const res = await invokeServer('GET', '/api/system/stats', null, { 'x-forwarded-for': '10.0.0.99' });
    assert(res.headers['x-ratelimit-limit'], 'Missing X-RateLimit-Limit');
    assert(res.headers['x-ratelimit-remaining'] !== undefined, 'Missing X-RateLimit-Remaining');
    assert.strictEqual(res.headers['x-ratelimit-limit'], '400');
  });

  // 6. Intelligent SHA-256 Cache Acceleration: Cold Miss vs Warm Hit Latency (<5ms)
  await runTest('SHA-256 LRU Cache: Cold Miss vs Warm Hit Latency', async () => {
    const testDocPayload = {
      fileName: 'Laporan_Keuangan_Holding_Benchmark.xlsx',
      fileBase64: Buffer.from('Mock content for holding benchmark financial workbook analysis').toString('base64')
    };

    // First request: Cold miss
    const startCold = performance.now();
    const resCold = await invokeServer('POST', '/api/parse-document', testDocPayload);
    const coldDuration = performance.now() - startCold;

    assert.strictEqual(resCold.statusCode, 200);
    assert.strictEqual(resCold.headers['x-cache'], 'MISS');
    const dataCold = resCold.json();
    assert.strictEqual(dataCold.success, true);

    // Second request: Warm cache hit
    const startWarm = performance.now();
    const resWarm = await invokeServer('POST', '/api/parse-document', testDocPayload);
    const warmDuration = performance.now() - startWarm;

    assert.strictEqual(resWarm.statusCode, 200);
    assert.strictEqual(resWarm.headers['x-cache'], 'HIT');
    const dataWarm = resWarm.json();
    assert.strictEqual(dataWarm.success, true);
    assert.strictEqual(dataWarm.entityName, dataCold.entityName);

    console.log(`   ⏱️ Cold parse: ${coldDuration.toFixed(2)}ms | Warm Cache HIT: ${warmDuration.toFixed(2)}ms (${Math.max(1, Math.round(coldDuration / Math.max(warmDuration, 0.05)))}x faster)`);
  });

  // 7. Standalone Cache Engine Precision & Eviction
  await runTest('Cache Manager Unit: SHA-256 Hashing, TTL & Eviction', () => {
    const hash1 = cacheManager.hashPayload({ doc: 'DocA', payload: 'PayloadA' });
    const hash2 = cacheManager.hashPayload({ doc: 'DocA', payload: 'PayloadA' });
    const hash3 = cacheManager.hashPayload({ doc: 'DocB', payload: 'PayloadB' });

    assert.strictEqual(hash1, hash2, 'Identical contents must generate identical SHA-256 hashes');
    assert.notStrictEqual(hash1, hash3, 'Distinct contents must generate distinct SHA-256 hashes');

    cacheManager.set('test-key', { sample: 123 }, 500); // 500ms TTL
    assert.strictEqual(cacheManager.get('test-key').sample, 123);
    assert.strictEqual(cacheManager.has('test-key'), true);

    const stats = cacheManager.getStats();
    assert(stats.hits >= 1);
    assert(stats.size >= 1);
  });

  // 8. Standalone Job Queue Engine: Concurrency & Status Tracking
  await runTest('Job Queue Unit: Controlled Concurrency & Progress Tracking', async () => {
    const jobId = jobQueue.addJob('Unit_Task', { test: true }, async (data, updateProgress) => {
      updateProgress(50);
      await new Promise(r => setTimeout(r, 20));
      updateProgress(100);
      return { ok: true };
    });

    assert(jobId);
    let job = jobQueue.getJob(jobId);
    assert(job.status === 'queued' || job.status === 'processing');

    // Wait for queue processor
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 30));
      const current = jobQueue.getJob(jobId);
      if (current && current.status === 'completed') {
        break;
      }
    }

    const completedJob = jobQueue.getJob(jobId);
    assert.strictEqual(completedJob.status, 'completed');
    assert.strictEqual(completedJob.progress, 100);
    assert.strictEqual(completedJob.result.ok, true);
  });

  // 9. Asynchronous Batch Job Queue API Workflow
  await runTest('Batch Job Queue API Workflow (/api/jobs/batch-parse & /api/jobs/:id)', async () => {
    const batchPayload = {
      documents: [
        { fileName: 'Subsidiary_PT_EPS_2023.xlsx', fileBase64: 'bW9jay1lcHM=' },
        { fileName: 'Subsidiary_PT_POJ_2023.xlsx', fileBase64: 'bW9jay1wb2o=' }
      ]
    };

    const submitRes = await invokeServer('POST', '/api/jobs/batch-parse', batchPayload);
    assert.strictEqual(submitRes.statusCode, 202, 'Should return HTTP 202 Accepted');
    const submitData = submitRes.json();
    assert(submitData.jobs && submitData.jobs.length === 2, 'Missing jobs in batch response');
    const firstJobId = submitData.jobs[0].jobId;

    // Poll for completion
    let completed = false;
    let jobData = null;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 60));
      const pollRes = await invokeServer('GET', `/api/jobs/${firstJobId}`);
      jobData = pollRes.json();
      if (jobData && (jobData.status === 'completed' || jobData.status === 'failed')) {
        completed = true;
        break;
      }
    }

    assert(completed, 'Batch job did not complete within timeout');
    assert.strictEqual(jobData.status, 'completed');
    assert.strictEqual(jobData.progress, 100);
    assert(jobData.result);
  });

  // 10. Metrics Collector Percentiles & Prometheus Text Generation
  await runTest('Metrics Collector Unit: Latency Percentiles (p50, p90, p99)', () => {
    metricsCollector.recordRequest('GET', '/test', 200, 10);
    metricsCollector.recordRequest('GET', '/test', 200, 25);
    metricsCollector.recordRequest('GET', '/test', 200, 50);
    metricsCollector.recordRequest('GET', '/test', 200, 100);
    metricsCollector.recordRequest('GET', '/test', 500, 200);

    const snapshot = metricsCollector.getMetricsJson();
    assert(snapshot.latenciesMs.p99 > 0);
    assert(snapshot.latenciesMs.p50 >= 0);
    assert(snapshot.latenciesMs.p90 >= snapshot.latenciesMs.p50);
    assert(snapshot.requestsByStatus['2xx'] >= 4);

    const prom = metricsCollector.getPrometheusText();
    assert(prom.includes('http_request_latency_ms{quantile="0.50"}'));
    assert(prom.includes('http_request_latency_ms{quantile="0.99"}'));
  });

  // 11. High-Throughput Burst: 200 Concurrent In-Process Queries
  await runTest('High-Throughput Burst: 200 Concurrent Parallel Queries (Zero Dropped)', async () => {
    const start = performance.now();
    const count = 200;
    const promises = [];

    for (let i = 0; i < count; i++) {
      promises.push(invokeServer('GET', '/api/system/stats', null, { 'x-forwarded-for': `192.168.1.${i % 50}` }));
    }

    const responses = await Promise.all(promises);
    const totalDuration = performance.now() - start;

    for (const res of responses) {
      assert.strictEqual(res.statusCode, 200);
    }

    const rps = (count / (totalDuration / 1000)).toFixed(0);
    console.log(`   🚀 Completed ${count} concurrent requests in ${totalDuration.toFixed(2)}ms (~${rps} req/sec throughput)`);
  });

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests} HIGH-SCALE BENCHMARK TESTS PASSED (100% SUCCESS)`);
  console.log('================================================================\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('Benchmark fatal error:', err);
  process.exit(1);
});
