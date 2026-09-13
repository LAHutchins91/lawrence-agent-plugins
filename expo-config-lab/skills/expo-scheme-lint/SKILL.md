---
name: expo-scheme-lint
description: "Extract deep-link schemes / iOS bundle id / Android package and run educational heuristic lite lint on Expo app.json / app.config text with the local zero-auth expo-config-lab MCP. No expo binary, no network."
version: 1.0.0
tags: [expo, app.json, scheme, deep-link, lint, developer-tools]
---

# Expo schemes & lite lint

When the user wants deep-link / native id inventory or a smell-check of pasted Expo config text:

1. **`expo_scheme_list`** — `{ text }` → `{ scheme?, schemes, iosBundleId?, androidPackage? }`.
2. **`expo_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing slug/name, privacy/permissions tips,
     JS app.config no-eval limits, expo.extra secrets smell. Not an exploit guide.

## Example prompts

- "What URL scheme and bundle ids are in this Expo config?"
- "Lite-lint this app.json"
- "Any secrets in expo.extra?"
