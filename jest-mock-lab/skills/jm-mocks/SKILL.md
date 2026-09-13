---
name: jm-mocks
description: "List jest.mock( / jest.doMock( / jest.unstable_mockModule( sites and jest.spyOn( / jest.fn( counts from pasted Jest JS/TS. Local only — never runs Jest, no fetch."
version: 1.0.0
tags: [jest, mock, spy, local]
---

# Jest mocks & spies

Use these tools when the user pastes Jest mock JS/TS text (never fetch a remote file, never run Jest):

1. **`jm_mocks_list`** with `source` — → `{mocks: [{module?, kind}], count}`.
2. **`jm_spies_hint`** with `source` — → `{spies: [{method, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not the Jest runtime; no network).

## Example prompts

- "Which modules does this file jest.mock?"
- "How many jest.spyOn vs jest.fn calls are in this file?"
- "List jest.doMock and unstable_mockModule usage."
