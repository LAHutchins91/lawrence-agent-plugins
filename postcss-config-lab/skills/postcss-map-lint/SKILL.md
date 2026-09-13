---
name: postcss-map-lint
description: "Extract PostCSS source-map / from / to options and run educational heuristic lite lint with the local zero-auth postcss-config-lab MCP. No postcss binary, no network."
version: 1.0.0
tags: [postcss, postcss-config, sourcemap, lint, developer-tools]
---

# PostCSS map options & lite lint

When the user wants source-map / from / to fields or a smell-check of pasted postcss config text:

1. **`postcss_map_options`** — `{ text }` → `{ map?, from?, to? }` (`map` is boolean or object).
2. **`postcss_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing plugins, autoprefixer without
     browserslist tip, deprecated plugins, JS no-eval limits, package.json
     `"postcss"` unwrap. Not an exploit guide.

## Example prompts

- "Is source map enabled in this postcss config?"
- "Lite-lint this postcss.config.json"
- "Does this still use postcss-cssnext?"
