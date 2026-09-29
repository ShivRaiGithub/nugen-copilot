# Nugen Copilot

> Build with Nugen faster.

Nugen Copilot is a development assistant for the Nugen platform. The model is trained on Nugen documentation and cookbook material, so the app is designed to help developers find the right API usage, understand documented workflows, troubleshoot integration problems, and adapt cookbook examples into their own code.

The chat UI is only the interaction surface; the product is focused on grounded Nugen development help rather than general-purpose conversation.


## Features
- Single-column chat layout with a New chat action that clears the current conversation
- Markdown answers with tables, lists, inline code and highlighted code blocks
- Typing animation, loading state, toast notifications, and automatic scrolling
- Conversation history kept in memory for the current page session

## Requirements

- Node.js 18.18 or newer
- A Nugen API key
- A Nugen model ID for the model trained on Nugen docs and cookbook material

## Setup
```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

| Variable | Description |
| --- | --- |
| `NUGEN_API_URL` | Full URL of the Nugen inference endpoint |
| `NUGEN_MODEL_ID` | Nugen model ID sent with each development request |
| `NUGEN_API_KEY` | API key, server-side only |

Both variables are required. If either is missing, the API returns a `NUGEN_NOT_CONFIGURED` error.
