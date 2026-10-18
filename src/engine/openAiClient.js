/**
 * OpenAI ChatGPT API Client with RAG Grounding & Deterministic Fallback
 * Calibrated for Institutional Financial Forensic Reasoning (Kajian Ihsan Standard)
 * Supports GPT-4o, GPT-4o-mini, o3-mini, and GPT-4-turbo
 */

const https = require("https");
const ragEngine = require("./ragEngine");
const geminiClient = require("./geminiClient");
const { COPILOT_SYSTEM_PROMPT } = require("./copilotSystemPrompt");

class OpenAIClient {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    this.models = ["gpt-4o", "gpt-4o-mini", "o3-mini", "gpt-4-turbo"];
    this.defaultModel = "gpt-4o";
  }

  setApiKey(key) {
    if (key && typeof key === "string") {
      this.apiKey = key.trim();
    }
  }

  async askCopilot(userQuery, activeContext = {}, customApiKey = null, preferredModel = null, activeDocIds = null, history = []) {
    const key = (customApiKey && customApiKey.trim()) || this.apiKey;
    const ragContext = ragEngine.buildGroundedContext(userQuery, activeDocIds);

    const promptText = `${ragContext}

=== ACTIVE AUDIT SESSION CONTEXT ===
${JSON.stringify(activeContext, null, 2)}

=== USER INQUIRY ===
${userQuery}`;

    if (key && (key.startsWith("sk-") || key.length >= 20)) {
      const modelList = preferredModel 
        ? [preferredModel, ...this.models.filter(m => m !== preferredModel)]
        : [this.defaultModel, ...this.models.filter(m => m !== this.defaultModel)];

      let lastError = null;
      for (const model of modelList) {
        try {
          const rawAnswer = await this.callOpenAiAPI(key, COPILOT_SYSTEM_PROMPT, promptText, model, history);
          return {
            source: `Live OpenAI API (${model}) + Evidence-Based RAG Copilot`,
            model: model,
            provider: "openai",
            answer: rawAnswer,
            ragCitations: ragEngine.search(userQuery, 3, activeDocIds)
          };
        } catch (err) {
          lastError = err;
          console.warn(`[OpenAI Client] Model ${model} failed: ${err.message}. Trying next fallback...`);
        }
      }
      console.warn(`[OpenAI Client] All OpenAI models failed (${lastError?.message}). Falling back to local forensic engine.`);
    }

    // Deterministic Local Fallback (Kajian Ihsan Evidence-Driven Standard)
    return {
      source: "Evidence-Driven Financial Forensic Copilot Engine + Local RAG",
      provider: "local",
      answer: geminiClient.generateDeterministicResponse(userQuery, activeContext, history),
      ragCitations: ragEngine.search(userQuery, 3, activeDocIds)
    };
  }

  callOpenAiAPI(apiKey, systemInstruction, userPrompt, modelName, history = []) {
    return new Promise((resolve, reject) => {
      const model = modelName || this.defaultModel;
      const url = "https://api.openai.com/v1/chat/completions";

      const messages = [{ role: "system", content: systemInstruction }];
      if (history && history.length > 0) {
        history.slice(-6).forEach(h => {
          messages.push({
            role: h.role === "user" ? "user" : "assistant",
            content: h.text || h.content || ""
          });
        });
      }
      messages.push({ role: "user", content: userPrompt });
      const payload = JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.25,
        max_tokens: 2500
      });

      const req = https.request(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
          "Content-Length": Buffer.byteLength(payload)
        },
        timeout: 25000
      }, (res) => {
        let data = "";
        res.on("data", chunk => { data += chunk; });
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              return reject(new Error(json.error.message || `OpenAI API error code ${json.error.code}`));
            }
            const candidate = json.choices && json.choices[0];
            const text = candidate && candidate.message && candidate.message.content;
            if (text) {
              resolve(text);
            } else {
              reject(new Error("No response text returned from OpenAI"));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("OpenAI API request timed out"));
      });

      req.write(payload);
      req.end();
    });
  }
}

module.exports = new OpenAIClient();
