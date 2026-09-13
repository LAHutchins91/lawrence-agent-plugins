---
name: deprecatedapiban-scan
description: Use when scanning for DeprecatedApiBan issues.
---
# DeprecatedApiBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on url.parse / new Buffer / createCipher / etc.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
