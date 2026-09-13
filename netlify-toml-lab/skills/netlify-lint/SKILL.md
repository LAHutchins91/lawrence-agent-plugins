---
name: netlify-lint
description: "Lite-lint pasted netlify.toml for missing [build].publish, SPA redirect /* → /index.html note, empty redirects, and plugins present (info). Local only, no Netlify CLI for tool logic, no fetch."
version: 1.0.0
tags: [netlify, netlify-toml, lint, redirects, build, plugins, local]
---

# Netlify TOML lint

Use **`netlify_lint_lite`** with `toml` on pasted netlify.toml (do not fetch URLs or run `netlify` for analysis):

- Missing `[build].publish` (warning)
- Empty / absent `[[redirects]]` (warning)
- SPA-style redirect `/*` → `/index.html` present (info)
- `[[plugins]]` / plugins key present (info)

Heuristic only — not Netlify CLI / not schema validation. Lite TOML scanner.

## Example prompts

- "Lint this netlify.toml for missing publish."
- "Does this netlify.toml have an SPA redirect?"
- "Are Netlify plugins declared? Any empty redirects?"
