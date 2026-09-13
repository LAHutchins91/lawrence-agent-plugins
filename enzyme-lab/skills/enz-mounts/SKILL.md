---
name: enz-mounts
description: "List mount( / shallow( / render( sites and .find( / .findWhere( / .findAll( / .exists( / .contains( / .at( / .first( / .last( counts from pasted Enzyme JS/TS. Local only — never runs Enzyme or React, no fetch."
version: 1.0.0
tags: [enzyme, mount, shallow, local]
---

# Enzyme mounts & finders

Use these tools when the user pastes Enzyme JS/TS text (never fetch a remote file, never run Enzyme/React):

1. **`enz_mounts_list`** with `source` — → `{mounts: [{kind, component?}], count}`.
2. **`enz_finders_hint`** with `source` — → `{finders: [{method, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not the Enzyme runtime; no network).

## Example prompts

- "Which components does this file mount or shallow?"
- "How many .find vs .findWhere calls are in this file?"
- "List mount/shallow/render usage."
