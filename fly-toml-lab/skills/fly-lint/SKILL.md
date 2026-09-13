---
name: fly-lint
description: >
  Lite-lint pasted fly.toml for missing app, missing [[services]] /
  [http_service], force_https = false note, and VM size present (info).
  Local only, no flyctl for tool logic, no fetch.
version: 1.0.0
tags: [fly, fly-toml, lint, services, https, vm, local]
---

# Fly TOML lint

Use **`fly_lint_lite`** with `toml` on pasted fly.toml (do not fetch URLs or run `flyctl` for analysis):

- Missing top-level `app` (error)
- Missing `[[services]]` and `[http_service]` / `[[http_service]]` (warning)
- `force_https = false` on http_service or services.ports (warning)
- VM size / resources present (info)

Heuristic only — not flyctl / not schema validation. Lite TOML scanner.

## Example prompts

- "Lint this fly.toml for missing app."
- "Does this fly.toml force HTTPS?"
- "Is a VM size declared?"
