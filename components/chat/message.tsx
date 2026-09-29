"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Message } from "@/lib/types";
import { Markdown } from "./markdown";
import { Skeleton } from "@/components/ui/skeleton";

function useTypewriter(text: string, enabled: boolean, onTick?: () => void) {
  const [n, setN] = useState(enabled ? 0 : text.length);
  useEffect(() => {
    if (!enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(text.length); return; }
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) { clearInterval(id); return v; }
        return Math.min(text.length, v + 8);
      });
      onTick?.();
    }, 14);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled]);
  return text.slice(0, n);
}

export function MessageView({ message, onTick }: { message: Message; onTick?: () => void }) {
  const isUser = message.role === "user";
  const shown = useTypewriter(message.content, !isUser && !!message.animate, onTick);

  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-3 text-[15px] leading-7">{message.content}</div>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary"><Sparkles className="h-4 w-4" /></div>
      <div className="min-w-0 max-w-[92%] flex-1">
        <Markdown>{shown}</Markdown>
      </div>
    </motion.div>
  );
}

export function LoadingMessage() {
  return (
    <div className="flex gap-3" aria-label="Nugen Copilot is thinking">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary"><Sparkles className="h-4 w-4 animate-pulse" /></div>
      <div className="flex-1 space-y-2 pt-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></div>
    </div>
  );
}
