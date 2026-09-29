"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-4 pt-6">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-card p-2 focus-within:border-primary/60">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          disabled={disabled}
          maxLength={4000}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Ask Nugen Copilot..."
          className="max-h-[200px] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-muted disabled:opacity-60"
        />
        <Button variant="primary" size="icon" onClick={submit} disabled={disabled || !value.trim()} aria-label="Send message"><ArrowUp className="h-4 w-4" /></Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted">Enter to send, Shift+Enter for a new line</p>
    </div>
  );
}
