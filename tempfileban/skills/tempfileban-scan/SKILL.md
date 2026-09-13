---
name: tempfileban-scan
description: Use when scanning for TempFileBan issues.
---
# TempFileBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on insecure /tmp writes, predictable tmpdir names, mktemp without XXXXXX.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
