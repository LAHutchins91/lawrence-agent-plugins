---
name: ma-selectors-lint
description: "Extract Maestro tapOn/assertVisible selectors (id/text/point) and run educational heuristic lite lint on YAML flow text with the local zero-auth maestro-lab MCP. No Maestro/device runtime, no network."
version: 1.0.0
tags: [maestro, yaml, selectors, lint, developer-tools]
---

# Maestro selectors & lite lint

When the user wants selector inventory or a smell-check of pasted Maestro YAML:

1. **`ma_selectors_hint`** — `{ text }` → `{ selectors: [{kind, value?}], count }` from `tapOn` / `assertVisible` string or `{id:}` / `{text:}` / `{point:}` forms.
2. **`ma_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `appId`, hardcoded coordinates tip,
     missing assert after navigation tip, `evalScript` overuse, etc. Not an exploit guide.

## Example prompts

- "Which selectors does this Maestro flow use?"
- "Lite-lint this Maestro YAML"
- "Any hardcoded point coordinates or missing asserts?"
