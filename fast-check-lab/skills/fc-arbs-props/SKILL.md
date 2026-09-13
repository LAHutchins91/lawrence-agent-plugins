---
name: fc-arbs-props
description: >
  Extract fast-check arbitrary assignments and fc.property / fc.assert hints from JS/TS text
  with the local zero-auth fast-check-lab MCP. No fast-check runtime, no network.
version: 1.0.0
tags: [fast-check, arbitrary, property-based-testing, developer-tools]
---

# Fast-check arbitraries & properties

When the user pastes **fast-check** source and needs arbitrary inventory or property/assert mapping:

1. **`fc_arbs_list`** — `{ text }` → `{ arbs: [{name, kind?}], count }` from `const Foo = fc.string` / `fc.integer` / `fc.array` / `fc.record` / `fc.oneof` / `fc.tuple` etc. (`import * as fc from 'fast-check'` or named imports).
2. **`fc_props_hint`** — `{ text }` → `{ properties: [{name?, assert?, async?}], count }` from `fc.assert(fc.property(...))` / `asyncProperty`.

## Example prompts

- "List fast-check arbitraries exported from this file"
- "Which properties are wrapped in fc.assert?"
- "Any asyncProperty usage here?"
