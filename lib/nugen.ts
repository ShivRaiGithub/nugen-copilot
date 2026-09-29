import { SYSTEM_PROMPT } from "./prompts";
import { extractEndpoints } from "./utils";
import type { ChatTurn, NugenReply } from "./types";

export class NugenError extends Error {
  constructor(message: string, public status = 502, public code = "NUGEN_ERROR") { super(message); }
}

const TIMEOUT_MS = 30_000;

/** Server-only. Sends a message to the deployed Nugen model and returns clean text. */
export async function askNugen(message: string, history: ChatTurn[] = []): Promise<NugenReply> {
  const url = process.env.NUGEN_API_URL;
  const model = process.env.NUGEN_MODEL_ID;
  const key = process.env.NUGEN_API_KEY;
  if (!url || !model || !key) throw new NugenError("Nugen API configuration is incomplete", 503, "NUGEN_NOT_CONFIGURED");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: message }],
        stream: false,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[nugen] upstream error", res.status, detail.slice(0, 500));
      const code = res.status === 401 || res.status === 403 ? "UPSTREAM_AUTH" : res.status === 429 ? "RATE_LIMITED" : "UPSTREAM_ERROR";
      throw new NugenError(`Nugen returned ${res.status}`, res.status === 429 ? 429 : 502, code);
    }

    const data = await res.json();
    const reply: unknown = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) throw new NugenError("Nugen returned an empty response", 502, "EMPTY_RESPONSE");

    return { reply: reply.trim(), endpoints: extractEndpoints(reply), docs: Array.isArray(data?.docs) ? data.docs : [], source: "nugen" };
  } catch (err) {
    if (err instanceof NugenError) throw err;
    if (err instanceof Error && err.name === "AbortError") throw new NugenError("Nugen took too long to respond", 504, "TIMEOUT");
    console.error("[nugen] request failed", err);
    throw new NugenError("Could not reach Nugen", 502, "NETWORK");
  } finally {
    clearTimeout(timer);
  }
}
