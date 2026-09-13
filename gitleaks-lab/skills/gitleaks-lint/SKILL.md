---
name: gitleaks-lint
description: >
  Lite-lint pasted .gitleaks.toml for rules without id (warning), overly
  broad allowlist paths=["**"] or regex .*, empty file, config without
  rules, and entropy-only rules. Local only, never runs gitleaks CLI,
  never returns secret values, no fetch.
version: 1.0.0
tags: [gitleaks, secrets, lint, local]
---

# Gitleaks lite lint

Use this tool on pasted `.gitleaks.toml` (do not fetch URLs, run gitleaks CLI, or echo secrets):

1. **`gitleaks_lint_lite`** with `source` — findings:
   - rule_without_id (warning)
   - allowlist_too_broad (warning)
   - empty_file (warning)
   - no_rules (warning)
   - entropy_only (info)

Disclaimer only — not the gitleaks CLI. Never returns secret values. Lite scanner.

## Example prompts

- "Do any [[rules]] lack an id?"
- "Is the allowlist too broad (paths ** or regex .*)?"
- "Lint this .gitleaks.toml for entropy-only rules"
