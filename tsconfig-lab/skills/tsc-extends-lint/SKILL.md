---
name: tsc-extends-lint
description: >
  List declared extends refs (no file fetch) and run educational heuristic
  lite lint on tsconfig.json / JSONC text with the local zero-auth
  tsconfig-lab MCP. No tsc exec.
version: 1.0.0
tags: [tsconfig, typescript, extends, lint, developer-tools]
---

# TSConfig extends & lite lint

When the user wants extends inventory or quick smell checks from **tsconfig text**:

1. **`tsc_extends_chain`** — `{ text }` → `{ extends, chain }`.
   - Reports `extends` as declared `string | string[] | null`.
   - `chain` is the shallow list of those declared strings only — **does not** read parent files.
2. **`tsc_lint_lite`** — `{ text }` → `{ findings, findingCount }`.
   - Educational heuristics: `strict: false`, `skipLibCheck`, module/moduleResolution
     conflicts, paths without baseUrl, allowJs without checkJs, noEmit+emitDeclarationOnly, etc.
     Not an exploit guide.

## Example prompts

- "What does this tsconfig extend?"
- "Lite-lint this tsconfig for common smells"
- "Any paths without baseUrl or strict:false?"
