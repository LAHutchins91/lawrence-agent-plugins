---
name: wrk-options-lint
description: "Extract wrk/wrk2 CLI flags (-c / -d / -t / -R / -s) from shell lines and run educational heuristic lite lint on wrk Lua + CLI text with the local zero-auth wrk-lab MCP. No wrk runtime, no network."
version: 1.0.0
tags: [wrk, wrk2, cli, lint, load-test, developer-tools]
---

# Wrk CLI options & lite lint

When the user wants CLI option inventory or a smell-check of pasted wrk/wrk2 text:

1. **`wrk_options_hint`** — `{ text }` → `{ options: [{flag, value?}], count }` for `-c` / `-d` / `-t` / `-R` / `-s` / etc.
2. **`wrk_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `-c`/`-t` tip, unbounded duration tip,
     no script tip, etc. Not an exploit guide.

## Example prompts

- "What flags does this wrk command use?"
- "Lite-lint this wrk2 line for missing -R and unbounded duration"
- "Any hardcoded Authorization headers in this wrk script?"
