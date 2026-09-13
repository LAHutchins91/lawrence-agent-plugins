---
name: chai-lint
description: "Count Chai chai.use( / chai-as-promised / sinon-chai plugin hints and lite-lint for mixed expect+assert styles, == near expect, empty file, and missing chai import. Local only, never executes assertions, no fetch."
version: 1.0.0
tags: [chai, assert, lint, local]
---

# Chai plugins & lite lint

Use these tools on pasted Chai JS/TS (do not fetch URLs or execute assertions):

1. **`chai_plugins_hint`** with `source` — → `{plugins: [{plugin, count}], count}`.
2. **`chai_lint_lite`** with `source` — findings:
   - Mixed expect+assert styles (warning)
   - Loose == comparisons near expect (warning)
   - Missing chai import (warning)
   - Empty file (warning)

Heuristic only — not the Chai assertion runtime. Lite JS/TS scanner.

## Example prompts

- "Does this file use chai-as-promised?"
- "Any mixed expect and assert styles?"
- "Lint this Chai usage for == near expect or missing imports."
