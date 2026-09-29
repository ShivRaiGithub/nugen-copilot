"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { copyText } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  async function onCopy() {
    try {
      await copyText(code);
      setCopied(true);
      toast("Code copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast("Couldn't copy. Check clipboard permissions.", "error");
    }
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border bg-[#0D0D10]">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs text-violet-300">{language || "text"}</span>
        <button onClick={onCopy} className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground" aria-label="Copy code">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: "16px", background: "transparent", fontSize: "13px", lineHeight: 1.6 }}
        codeTagProps={{ style: { fontFamily: "var(--font-geist-mono), monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
