---
name: chai-chains
description: >
  Count expect( / assert. / should style call sites and .to.equal /
  .deep.equal / .include / .throw / .eventually chain hints from pasted
  Chai JS/TS. Local only — never executes assertions, no fetch.
version: 1.0.0
tags: [chai, assert, expect, chains, local]
---

# Chai asserts & chains

Use these tools when the user pastes Chai JS/TS text (never fetch a remote file, never execute assertions):

1. **`chai_asserts_list`** with `source` — → `{styles: [{style, count}], count}`.
2. **`chai_chains_hint`** with `source` — → `{chains: [{chain, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not the Chai runtime; no network).

## Example prompts

- "How many expect( vs assert. styles are in this file?"
- "What .to.equal / .throw chain counts do we have?"
- "List Chai assertion style usage."
