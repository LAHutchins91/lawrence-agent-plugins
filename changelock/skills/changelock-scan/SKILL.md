---
name: changelock-scan
description: Use when scanning for ChangeLock issues.
---
# ChangeLock scan

1. Locate relevant configs/source.
2. Apply heuristics: Require CHANGELOG entries for version bumps — lock `package.json` version to a CHANGELOG heading before the tag ships.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
