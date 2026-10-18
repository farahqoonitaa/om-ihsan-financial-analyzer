/**
 * src/infrastructure/jobQueue.js
 * Asynchronous In-Memory Job Queue with Controlled Concurrency
 * Designed for high-scale enterprise holding batch reports ingestion and parsing.
 */

const crypto = require("crypto");

class JobQueue {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 4;
    this.jobs = new Map();
    this.queue = [];
    this.activeWorkers = 0;
  }

  /**
   * Enqueues an async task and returns a unique Job ID immediately.
   */
  addJob(name, data, handler) {
    const id = "job_" + Date.now() + "_" + crypto.randomBytes(4).toString("hex");
    const job = {
      id,
      name,
      data,
      handler,
      status: "queued",
      progress: 0,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      result: null,
      error: null
    };

    this.jobs.set(id, job);
    this.queue.push(id);
    this._processNext();

    return id;
  }

  /**
   * Retrieves current job status & result.
   */
  getJob(id) {
    const job = this.jobs.get(id);
    if (!job) return null;
    // Omit the handler function in response
    const { handler, ...publicJob } = job;
    return publicJob;
  }

  listJobs(limit = 20) {
    const all = Array.from(this.jobs.values()).slice(-limit);
    return all.map(({ handler, ...j }) => j);
  }

  async _processNext() {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const jobId = this.queue.shift();
    const job = this.jobs.get(jobId);
    if (!job) return;

    this.activeWorkers++;
    job.status = "processing";
    job.startedAt = new Date().toISOString();
    job.progress = 10;

    try {
      // Progress updater callback passed to handler
      const updateProgress = (pct) => {
        job.progress = Math.min(100, Math.max(0, pct));
      };

      const result = await job.handler(job.data, updateProgress);
      job.status = "completed";
      job.progress = 100;
      job.completedAt = new Date().toISOString();
      job.result = result;
    } catch (err) {
      job.status = "failed";
      job.completedAt = new Date().toISOString();
      job.error = err.message || String(err);
    } finally {
      this.activeWorkers--;
      this._processNext();
    }
  }

  getStats() {
    let queued = 0, processing = 0, completed = 0, failed = 0;
    for (const job of this.jobs.values()) {
      if (job.status === "queued") queued++;
      else if (job.status === "processing") processing++;
      else if (job.status === "completed") completed++;
      else if (job.status === "failed") failed++;
    }
    return {
      activeWorkers: this.activeWorkers,
      concurrencyLimit: this.concurrency,
      queued,
      processing,
      completed,
      failed,
      total: this.jobs.size
    };
  }
}

module.exports = new JobQueue();
