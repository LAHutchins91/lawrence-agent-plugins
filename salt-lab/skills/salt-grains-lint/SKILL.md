---
name: salt-grains-lint
description: "Detect Salt grain refs (grains[...], grains.get, salt['grains.get'], Jinja grains) and educational lite lint with the local zero-auth salt-lab MCP. No salt CLI, minion/master, or network."
version: 1.0.0
tags: [salt, saltstack, grains, lint, mcp, developer-tools]
---

# Salt grains & lite lint

When the user pastes **Salt** SLS/Jinja text or wants a smell-check:

1. **`salt_grains_hint`** — `{ text }` → `{ grains: string[], count }`.
2. **`salt_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing state module, plaintext passwords,
     `cmd.run` without `unless`/`creates`, `pkg.latest` tip.
   - Not an exploit guide.

## Example prompts

- "What grains does this Salt state reference?"
- "Lint this SLS for plaintext passwords or unguarded cmd.run"
- "Any grain refs in this Jinja template?"
