"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-[15px] leading-7 text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code({ className, children }) {
            const text = String(children).replace(/\n$/, "");
            const lang = /language-(\w+)/.exec(className || "")?.[1];
            if (lang || text.includes("\n")) return <CodeBlock language={lang ?? "text"} code={text} />;
            return <code className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-violet-200">{children}</code>;
          },
          h1: (p) => <h1 className="mt-2 text-xl font-semibold" {...p} />,
          h2: (p) => <h2 className="mt-4 text-lg font-semibold" {...p} />,
          h3: (p) => <h3 className="mt-3 text-base font-semibold" {...p} />,
          ul: (p) => <ul className="list-disc space-y-1 pl-6 marker:text-muted" {...p} />,
          ol: (p) => <ol className="list-decimal space-y-1 pl-6 marker:text-muted" {...p} />,
          a: (p) => <a className="text-violet-300 underline underline-offset-2 hover:text-violet-200" target="_blank" rel="noreferrer" {...p} />,
          table: (p) => <div className="my-3 overflow-x-auto rounded-xl border border-border"><table className="w-full text-left text-sm" {...p} /></div>,
          th: (p) => <th className="border-b border-border bg-card px-4 py-2 font-medium" {...p} />,
          td: (p) => <td className="border-b border-border/60 px-4 py-2 last:border-0" {...p} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
