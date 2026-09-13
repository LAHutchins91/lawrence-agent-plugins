---
name: sinon-stubs-spies
description: "Extract Sinon stubs and spies from JS/TS text with the local zero-auth sinon-stub-lab MCP. No sinon runtime, no network."
version: 1.0.0
tags: [sinon, stub, spy, developer-tools]
---

# Sinon stubs & spies

When the user pastes **Sinon** test source and needs stub/spy inventory:

1. **`sinon_stubs_list`** — `{ text }` → `{ stubs: [{target?, method?, name?}], count }` from `sinon.stub(` / `sandbox.stub(`.
2. **`sinon_spies_hint`** — `{ text }` → `{ spies: [{target?, method?}], count }` from `sinon.spy(` / `sandbox.spy(`.

## Example prompts

- "List Sinon stubs in this test"
- "Any sandbox.spy calls here?"
- "What methods are stubbed on this object?"
