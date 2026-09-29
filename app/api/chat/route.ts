import { NextResponse } from "next/server";
import { askNugen, NugenError } from "@/lib/nugen";
import type { ChatTurn } from "@/lib/types";

export const runtime = "nodejs";

const fail = (status: number, code: string, message: string) =>
  NextResponse.json({ error: { code, message } }, { status });

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return fail(400, "INVALID_JSON", "Request body must be valid JSON."); }

  const { message, history } = (body ?? {}) as { message?: unknown; history?: unknown };
  if (typeof message !== "string" || !message.trim()) return fail(400, "INVALID_MESSAGE", "Enter a message to send.");
  if (message.length > 4000) return fail(400, "MESSAGE_TOO_LONG", "Messages are limited to 4,000 characters.");

  const turns: ChatTurn[] = Array.isArray(history)
    ? history
        .filter((t): t is ChatTurn => !!t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
        .slice(-20)
    : [];

  try {
    return NextResponse.json(await askNugen(message.trim(), turns));
  } catch (err) {
    if (err instanceof NugenError) return fail(err.status, err.code, err.message);
    console.error("[api/chat] unexpected", err);
    return fail(500, "INTERNAL", "Something went wrong. Try again.");
  }
}
