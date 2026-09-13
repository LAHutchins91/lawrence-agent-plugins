---
name: cv-nested-lint
description: "Extract @ValidateNested / @Type nested DTO hints and run educational heuristic lite lint on class-validator TypeScript with the local zero-auth class-validator-lab MCP. No runtime, no network."
version: 1.0.0
tags: [class-validator, nested, lint, class-transformer, developer-tools]
---

# Nested DTOs & lite lint

When the user wants nested/`@Type` inventory or a smell-check of pasted DTO source:

1. **`cv_nested_hint`** — `{ text }` → `{ nested: [{dto?, property?, type?, each?}], count }` from `@ValidateNested` / `@Type(() => Foo)`.
2. **`cv_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, ValidateNested without Type, missing whitelist tip,
     IsOptional on required-looking fields, array `each: true`, etc. Not an exploit guide.

## Example prompts

- "Does this nested DTO need @Type?"
- "Lite-lint these class-validator DTOs"
- "Any ValidateNested / whitelist smells?"
