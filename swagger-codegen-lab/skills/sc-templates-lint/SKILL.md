---
name: sc-templates-lint
description: "Extract -t/--template-dir and --library, and run educational heuristic lite lint with the local zero-auth swagger-codegen-lab MCP. No codegen runtime, no network."
version: 1.0.0
tags: [swagger-codegen, openapi-generator, templates, lint, cli, developer-tools]
---

# Swagger/OpenAPI templates & lite lint

When the user wants template/library inventory or a smell-check of pasted generator CLI text:

1. **`sc_templates_hint`** — `{ text }` → `{ templates: [{path?}], library?, count }` for `-t` / `--template-dir` / `--library`.
2. **`sc_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `-i`/`-g` tip, swagger-codegen vs openapi-generator tip, hardcoded apiKey tip, etc. Not an exploit guide.

## Example prompts

- "What template-dir and library does this generate command set?"
- "Lite-lint this openapi-generator line for missing -i and hardcoded apiKey"
- "Is this still on swagger-codegen instead of openapi-generator?"
