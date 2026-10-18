/**
 * src/infrastructure/rateLimiter.js
 * Sliding Window In-Memory Rate Limiter with Automatic Stale Key Pruning
 * Protects enterprise API endpoints from burst traffic and resource exhaustion.
 */

class RateLimiter {
  constructor(options = {}) {
    this.defaultLimit = options.defaultLimit || 120; // 120 reqs
    this.defaultWindowMs = options.defaultWindowMs || 60 * 1000; // 1 minute
    this.clients = new Map();

    // Auto cleanup stale IP buckets every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  /**
   * Checks if an IP or Client identifier is within rate limits.
   */
  check(clientId = "unknown", customLimit, customWindowMs) {
    const limit = customLimit || this.defaultLimit;
    const windowMs = customWindowMs || this.defaultWindowMs;
    const now = Date.now();

    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, []);
    }

    const timestamps = this.clients.get(clientId);
    // Remove timestamps outside the active sliding window
    const windowStart = now - windowMs;
    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift();
    }

    if (timestamps.length >= limit) {
      const oldest = timestamps[0];
      const resetMs = oldest + windowMs - now;
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetMs,
        retryAfterSeconds: Math.ceil(resetMs / 1000)
      };
    }

    timestamps.push(now);
    return {
      allowed: true,
      limit,
      remaining: limit - timestamps.length,
      resetMs: windowMs
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [clientId, timestamps] of this.clients.entries()) {
      const windowStart = now - this.defaultWindowMs;
      while (timestamps.length > 0 && timestamps[0] <= windowStart) {
        timestamps.shift();
      }
      if (timestamps.length === 0) {
        this.clients.delete(clientId);
      }
    }
  }

  reset() {
    this.clients.clear();
  }
}

module.exports = new RateLimiter();
