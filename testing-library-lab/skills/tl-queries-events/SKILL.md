---
name: tl-queries-events
description: >
  Extract Testing Library queries (getBy*/queryBy*/findBy*/screen.*) and
  userEvent/fireEvent hints from JS/TS text with the local zero-auth
  testing-library-lab MCP. No DOM/@testing-library runtime, no network.
version: 1.0.0
tags: [testing-library, queries, user-event, developer-tools]
---

# Testing Library queries & events

When the user pastes **Testing Library** test source and needs query/event inventory:

1. **`tl_queries_list`** — `{ text }` → `{ queries: [{name, variant?}], count }` from `screen.getByRole` / `getByText` / `findBy*` / `queryBy*` / destructured render helpers.
2. **`tl_events_hint`** — `{ text }` → `{ events: [{kind}], count }` from `userEvent.` / `fireEvent.`.

## Example prompts

- "List getBy*/findBy* queries in this test"
- "Any userEvent or fireEvent here?"
- "What Testing Library queries are used?"
