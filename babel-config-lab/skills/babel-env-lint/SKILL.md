---
name: babel-env-lint
description: >
  Extract Babel env/targets and run educational heuristic lite lint with the
  local zero-auth babel-config-lab MCP. No babel binary, no network.
version: 1.0.0
tags: [babel, babel-config, targets, env, lint, developer-tools]
---

# Babel env/targets & lite lint

When the user wants targets/browserslist/`env` blocks or a smell-check of pasted babel config text:

1. **`babel_env_targets`** — `{ text }` → `{ targets?, browserslist?, env?, envKeys: string[] }` from top-level fields and `@babel/preset-env` options.
2. **`babel_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing presets, duplicate plugins, stage-0
     legacy, `modules: false` tips, package.json `"babel"` unwrap, missing
     targets, legacy es201x presets, JS no-eval limits. Not an exploit guide.

## Example prompts

- "What browsers/targets does this babel config use?"
- "Lite-lint this babel.config.json"
- "Does this still use stage-0?"
