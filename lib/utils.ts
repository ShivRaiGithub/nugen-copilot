import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CodeSnippet, EndpointRef } from "./types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const uid = () => Math.random().toString(36).slice(2, 10);

export function extractCodeBlocks(markdown: string): CodeSnippet[] {
  const out: CodeSnippet[] = [];
  for (const m of markdown.matchAll(/```(\w*)\n([\s\S]*?)```/g)) {
    out.push({ language: m[1] || "text", code: m[2].trimEnd() });
  }
  return out;
}

export function extractEndpoints(markdown: string): EndpointRef[] {
  const seen = new Set<string>();
  const out: EndpointRef[] = [];
  for (const m of markdown.matchAll(/\b(GET|POST|PUT|PATCH|DELETE)\s+(\/[\w\-./{}:]+)/g)) {
    const key = `${m[1]} ${m[2]}`;
    if (!seen.has(key)) { seen.add(key); out.push({ method: m[1], path: m[2] }); }
  }
  return out;
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}
