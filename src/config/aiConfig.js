/**
 * src/config/aiConfig.js
 * Centralized Codebase Configuration for AI Providers, API Keys, Security & System Capacity.
 *
 * Configure API keys and model preferences directly in this file or via environment variables
 * (GEMINI_API_KEY, OPENAI_API_KEY, AI_PROVIDER). End-user UI API key inputs and toggles are
 * disabled to keep the user experience clean and prevent client-side credential exposure.
 */

const AI_CONFIG = {
  // Active AI provider: "local" | "google" | "openai"
  // Automatically upgrades to "google" or "openai" if a key is configured below or in env.
  provider: process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? "google" : (process.env.OPENAI_API_KEY ? "openai" : "local")),

  // Google Gemini Configuration (Codebase / Server Environment Only)
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "", // Set GEMINI_API_KEY in environment or paste key here for local dev
    defaultModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    fallbackModels: ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
    timeoutMs: 25000,
    temperature: 0.25,
    maxOutputTokens: 2500
  },

  // OpenAI ChatGPT Configuration (Codebase / Server Environment Only)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "", // Set OPENAI_API_KEY in environment or paste key here for local dev
    defaultModel: process.env.OPENAI_MODEL || "gpt-4o",
    fallbackModels: ["gpt-4o", "gpt-4o-mini", "o3-mini", "gpt-4-turbo"],
    timeoutMs: 25000,
    temperature: 0.25,
    maxTokens: 2500
  },

  // Security & System Capacity Parameters
  securityAndCapacity: {
    zeroPersistence: true,
    uiApiKeyInputEnabled: false, // API keys are configured strictly in the codebase / server environment
    maxUploadFiles: 10,
    maxSingleFileSizeMB: 25,
    maxHttpPayloadBytes: 50 * 1024 * 1024, // 50 MB
    rateLimitPerMinutePerIp: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 400,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    lruCacheMaxItems: 500,
    lruCacheTtlMs: Number(process.env.CACHE_TTL_MS) || 3600000, // 1 hour
    jobQueueConcurrency: Number(process.env.MAX_QUEUE_CONCURRENCY) || 4
  }
};

module.exports = AI_CONFIG;
