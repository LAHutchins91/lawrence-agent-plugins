---
name: nock-lint
description: "Count nock .persist/.times/.once/.twice hints and lite-lint for missing nock.cleanAll/restore, persist without times caution, empty intercepts, and reply without status. Local only, never activates interceptors, no fetch."
version: 1.0.0
tags: [nock, http-mock, lint, local]
---

# Nock persist & lite lint

Use these tools on pasted nock JS/TS (do not fetch URLs or activate nock interceptors):

1. **`nock_persist_hint`** with `source` — → `{methods: [{method, count}], count}`.
2. **`nock_lint_lite`** with `source` — findings:
   - Missing nock.cleanAll / restore (warning)
   - Persist without times caution (info)
   - Empty intercepts (warning)
   - Reply without status (warning)

Heuristic only — not nock HTTP mocking runtime. Lite JS/TS scanner.

## Example prompts

- "Does this nock file call cleanAll or restore?"
- "Any .persist without .times?"
- "Lint this nock usage for reply without status."
