---
name: zod-refine-lint
description: "Extract Zod refine/transform/pipe/brand chains and run educational heuristic lite lint on schema TS/JS text with the local zero-auth zod-schema-lab MCP. No zod runtime, no network."
version: 1.0.0
tags: [zod, refine, lint, validation, developer-tools]
---

# Zod refinements & lite lint

When the user wants refinement/transform inventory or a smell-check of pasted Zod schema source:

1. **`zod_refine_hint`** — `{ text }` → `{ refinements: [{on?, kind}], count }` for `refine` / `superRefine` / `transform` / `pipe` / `brand`.
2. **`zod_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, any()/unknown() overuse, missing email/url helpers tip,
     passthrough vs strict, deprecated z.record / nonstrict tips, etc. Not an exploit guide.

## Example prompts

- "List .refine / .transform chains on these Zod schemas"
- "Lite-lint this Zod file"
- "Any z.any() overuse or missing .email() smells?"
