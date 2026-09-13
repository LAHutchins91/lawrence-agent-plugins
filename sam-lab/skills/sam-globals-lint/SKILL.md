---
name: sam-globals-lint
description: "Extract AWS SAM Globals / Transform / Description / Parameters keys and educational lite lint with the local zero-auth sam-lab MCP. No SAM CLI, AWS deploy, or network."
version: 1.0.0
tags: [aws-sam, sam, globals, lint, mcp, developer-tools]
---

# SAM globals & lite lint

When the user pastes **SAM** template text or wants a smell-check:

1. **`sam_globals_hint`** — `{ text }` → `{ globals?, transform?, parameters?, count }`.
2. **`sam_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing Transform `AWS::Serverless-2016-10-31`,
     `:latest` image, plaintext secrets in env, public Access policies tip,
     missing Runtime.
   - Not an exploit guide.

## Example prompts

- "What Globals and Transform does this SAM template declare?"
- "Lint this template.yaml for missing Transform or Runtime"
- "Any plaintext secrets or :latest image tips in this SAM paste?"
