"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { ApiError, Message, NugenReply } from "@/lib/types";
import { extractEndpoints, uid } from "@/lib/utils";
import { ChatInput } from "./chat-input";
import { EmptyState } from "./empty-state";
import { LoadingMessage, MessageView } from "./message";

export function Copilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const toast = useToast();

  const scrollDown = useCallback(() => bottomRef.current?.scrollIntoView({ block: "end" }), []);
  useEffect(() => {
    scrollDown();
  }, [messages, loading, scrollDown]);

  const send = useCallback(async (text: string) => {
    if (loading) return;
    const history = messagesRef.current.map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { id: uid(), role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history }) });
      const data: NugenReply | ApiError = await res.json().catch(() => ({ error: { code: "BAD_RESPONSE", message: "Unexpected response from the server." } }));
      if (!res.ok || "error" in data) throw new Error("error" in data ? data.error.message : "Request failed.");
      setMessages((m) => [...m, {
        id: uid(), role: "assistant", content: data.reply, animate: true, source: data.source,
        endpoints: data.endpoints.length ? data.endpoints : extractEndpoints(data.reply), docs: data.docs,
      }]);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, toast]);

  const clear = () => { setMessages([]); toast("Chat cleared"); };

  return (
    <div className="h-dvh">
      <main className="flex h-full min-h-0 flex-col">
        <header className="border-b border-border px-4 py-3">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-semibold leading-tight">Nugen Copilot</h1>
              <p className="text-xs text-muted">Powered by an aligned Nugen model</p>
            </div>
            <Button variant="ghost" size="sm" onClick={clear}><Plus className="h-4 w-4" />New chat</Button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {messages.length === 0 && !loading ? (
            <EmptyState />
          ) : (
            <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
              {messages.map((m) => <MessageView key={m.id} message={m} onTick={scrollDown} />)}
              {loading && <LoadingMessage />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
        <ChatInput onSend={send} disabled={loading} />
      </main>
    </div>
  );
}
