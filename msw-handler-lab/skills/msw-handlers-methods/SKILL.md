---
name: msw-handlers-methods
description: "Extract MSW http/rest/graphql handlers and method counts from JS/TS text with the local zero-auth msw-handler-lab MCP. No msw runtime, no network."
version: 1.0.0
tags: [msw, mock-service-worker, handlers, developer-tools]
---

# MSW handlers & methods

When the user pastes **MSW** handler source and needs handler inventory or method tallies:

1. **`msw_handlers_list`** — `{ text }` → `{ handlers: [{method, path?, name?}], count }` from `http.get/post/...`, `rest.*`, `graphql.query/mutation`.
2. **`msw_methods_hint`** — `{ text }` → `{ methods: Record<string, number>, total }` counts by HTTP/GraphQL method.

## Example prompts

- "List MSW handlers in this file"
- "How many GET vs POST mocks do we have?"
- "Any graphql.mutation handlers here?"
