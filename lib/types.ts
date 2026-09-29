export type Role = "user" | "assistant";

export interface EndpointRef { method: string; path: string; }
export interface DocRef { title: string; url: string; description?: string; }
export interface CodeSnippet { language: string; code: string; }

export interface Message {
  id: string;
  role: Role;
  content: string;
  endpoints?: EndpointRef[];
  docs?: DocRef[];
  /** true only for freshly received replies, drives the typing animation */
  animate?: boolean;
  source?: "nugen";
}

export interface ChatTurn { role: Role; content: string; }

/** What lib/nugen.ts returns and /api/chat sends to the browser. */
export interface NugenReply {
  reply: string;
  endpoints: EndpointRef[];
  docs: DocRef[];
  source: "nugen";
}

export interface ChatRequest { message: string; history?: ChatTurn[]; }
export interface ApiError { error: { code: string; message: string } }
