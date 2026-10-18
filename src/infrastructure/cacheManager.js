/**
 * src/infrastructure/cacheManager.js
 * High-Performance In-Memory LRU Cache with SHA-256 Content Hashing & TTL
 * Provides sub-millisecond response for recurring financial document audits.
 */

const crypto = require("crypto");

class CacheManager {
  constructor(options = {}) {
    this.maxItems = options.maxItems || 500;
    this.defaultTTL = options.defaultTTL || 1000 * 60 * 60; // 1 hour default
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generates a deterministic SHA-256 hash from string, buffer, or object payload.
   */
  hashPayload(payload) {
    if (!payload) return "null_payload";
    const hasher = crypto.createHash("sha256");
    if (Buffer.isBuffer(payload)) {
      hasher.update(payload);
    } else if (typeof payload === "object") {
      hasher.update(JSON.stringify(payload));
    } else {
      hasher.update(String(payload));
    }
    return hasher.digest("hex");
  }

  /**
   * Retrieves an item from cache if exists and not expired.
   */
  get(key) {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }

    const entry = this.cache.get(key);
    const now = Date.now();

    if (entry.expiresAt && now > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh LRU position by re-inserting
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value;
  }

  /**
   * Stores an item with optional custom TTL.
   */
  set(key, value, customTTL) {
    const ttl = customTTL !== undefined ? customTTL : this.defaultTTL;
    const expiresAt = ttl > 0 ? Date.now() + ttl : null;

    // Evict oldest if reaching capacity
    if (this.cache.size >= this.maxItems && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });

    return true;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    return {
      size: this.cache.size,
      maxItems: this.maxItems,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate.toFixed(1)}%`
    };
  }
}

// Export singleton instance with default configs
module.exports = new CacheManager();
