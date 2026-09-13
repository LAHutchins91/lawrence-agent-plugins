---
name: engineguard-scan
description: Use when scanning for EngineGuard issues.
---
# EngineGuard scan

1. Locate relevant configs/source.
2. Apply heuristics: Enforce `package.json` `engines.node` vs `.nvmrc` / CI — catch Node version drift before “works on my machine” hits CI.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
