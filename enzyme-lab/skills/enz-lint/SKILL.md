---
name: enz-lint
description: "Count Enzyme .setProps( / .setState( / .setContext( / .unmount( / .update( / .dive( / .simulate( lifecycle hints and lite-lint for mount without unmount, simulate without update, empty file, and deprecated enzyme import. Local only, never runs Enzyme/React, no fetch."
version: 1.0.0
tags: [enzyme, mount, lint, local]
---

# Enzyme lifecycle & lite lint

Use these tools on pasted Enzyme JS/TS (do not fetch URLs or run Enzyme/React):

1. **`enz_lifecycle_hint`** with `source` — → `{lifecycle: [{method, count}], count}`.
2. **`enz_lint_lite`** with `source` — findings:
   - Mount without unmount (warning)
   - Shallow without unmount (info)
   - Simulate without update (warning)
   - Empty file (warning)
   - Deprecated enzyme patterns / import (info)

Heuristic only — not the Enzyme runtime. Lite JS/TS scanner.

## Example prompts

- "Does this file call unmount after mount?"
- "Any .simulate without .update?"
- "Lint this Enzyme test for missing cleanup."
