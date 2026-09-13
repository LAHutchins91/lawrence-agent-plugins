---
name: deepequalban-scan
description: Use when scanning for DeepEqualBan issues.
---
# DeepEqualBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI when lodash.isEqual / deep-equal / JSON.stringify compare patterns appear in hot paths or exceed count.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
