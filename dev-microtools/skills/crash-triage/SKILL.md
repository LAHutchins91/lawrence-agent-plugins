---
name: crash-triage
description: >
  Triage a pasted stack trace: detect language, normalize frames with stack_parse,
  then hypothesize root cause and next debugging steps.
version: 1.0.0
tags: [debugging, stacktrace, crash, triage]
---

# Crash triage

When the user pastes a stack trace or crash log:

1. Call **`stack_parse`** on the raw text.
2. Use `languageHints` and `frames` to identify the top application frames (skip noisy framework internals when possible).
3. Produce a short triage:
   - Likely language/runtime
   - Top frame (file:line / function)
   - Probable failure mode (null deref, assert, timeout, etc. from message + frames)
   - Concrete next steps (open file, add logging, reproduce command)
4. If a JWT or env mismatch is implicated, optionally use **`jwt_inspect`** or **`env_key_diff`** — never echo secrets.

## Example prompts

- "What does this stack mean?"
- "Triage this Node traceback"
