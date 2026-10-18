/**
 * src/infrastructure/metricsCollector.js
 * Enterprise Observability & Prometheus Metrics Engine
 * Collects runtime performance metrics, latency histograms, and system health.
 */

const os = require("os");

class MetricsCollector {
  constructor() {
    this.startTime = Date.now();
    this.requestsTotal = 0;
    this.requestsByStatus = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
    this.requestsByRoute = new Map();
    this.latencies = [];
    this.maxLatencySamples = 1000;
    this.documentParsesTotal = 0;
  }

  recordRequest(method, pathname, statusCode, durationMs) {
    this.requestsTotal++;

    // Track status class
    const statusGroup = `${Math.floor(statusCode / 100)}xx`;
    if (this.requestsByStatus[statusGroup] !== undefined) {
      this.requestsByStatus[statusGroup]++;
    }

    // Track route
    const routeKey = `${method} ${pathname}`;
    const curr = this.requestsByRoute.get(routeKey) || 0;
    this.requestsByRoute.set(routeKey, curr + 1);

    // Track latency sample
    if (this.latencies.length >= this.maxLatencySamples) {
      this.latencies.shift();
    }
    this.latencies.push(durationMs);
  }

  recordDocumentParse() {
    this.documentParsesTotal++;
  }

  getLatencyPercentiles() {
    if (this.latencies.length === 0) return { p50: 0, p90: 0, p95: 0, p99: 0 };
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const getP = (p) => {
      const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
      return Number(sorted[idx].toFixed(2));
    };
    return {
      p50: getP(50),
      p90: getP(90),
      p95: getP(95),
      p99: getP(99)
    };
  }

  getMetricsJson() {
    const mem = process.memoryUsage();
    const uptimeSec = Math.floor((Date.now() - this.startTime) / 1000);

    return {
      uptimeSeconds: uptimeSec,
      totalRequests: this.requestsTotal,
      requestsByStatus: this.requestsByStatus,
      latenciesMs: this.getLatencyPercentiles(),
      documentParses: this.documentParsesTotal,
      memory: {
        rssMB: (mem.rss / 1024 / 1024).toFixed(2),
        heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMB: (mem.heapTotal / 1024 / 1024).toFixed(2)
      },
      system: {
        cpus: os.cpus().length,
        freeMemMB: (os.freemem() / 1024 / 1024).toFixed(2),
        totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(2),
        loadAvg: os.loadavg()
      }
    };
  }

  /**
   * Exports in standard Prometheus text format.
   */
  getPrometheusText() {
    const mem = process.memoryUsage();
    const uptimeSec = Math.floor((Date.now() - this.startTime) / 1000);
    const lat = this.getLatencyPercentiles();

    let lines = [
      `# HELP app_uptime_seconds Application uptime in seconds`,
      `# TYPE app_uptime_seconds gauge`,
      `app_uptime_seconds ${uptimeSec}`,
      ``,
      `# HELP http_requests_total Total number of HTTP requests processed`,
      `# TYPE http_requests_total counter`,
      `http_requests_total ${this.requestsTotal}`,
      `http_requests_status_total{group="2xx"} ${this.requestsByStatus["2xx"]}`,
      `http_requests_status_total{group="3xx"} ${this.requestsByStatus["3xx"]}`,
      `http_requests_status_total{group="4xx"} ${this.requestsByStatus["4xx"]}`,
      `http_requests_status_total{group="5xx"} ${this.requestsByStatus["5xx"]}`,
      ``,
      `# HELP http_request_latency_ms HTTP request latency percentiles`,
      `# TYPE http_request_latency_ms gauge`,
      `http_request_latency_ms{quantile="0.50"} ${lat.p50}`,
      `http_request_latency_ms{quantile="0.90"} ${lat.p90}`,
      `http_request_latency_ms{quantile="0.95"} ${lat.p95}`,
      `http_request_latency_ms{quantile="0.99"} ${lat.p99}`,
      ``,
      `# HELP document_parses_total Total financial documents parsed`,
      `# TYPE document_parses_total counter`,
      `document_parses_total ${this.documentParsesTotal}`,
      ``,
      `# HELP node_memory_heap_used_bytes Node.js memory heap used`,
      `# TYPE node_memory_heap_used_bytes gauge`,
      `node_memory_heap_used_bytes ${mem.heapUsed}`,
      `node_memory_rss_bytes ${mem.rss}`
    ];

    return lines.join("\n") + "\n";
  }
}

module.exports = new MetricsCollector();
