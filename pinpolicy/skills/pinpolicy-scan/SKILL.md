---
name: pinpolicy-scan
description: Use when scanning for PinPolicy issues.
---
# PinPolicy scan

1. Locate relevant configs/source.
2. Apply heuristics: Require pinned versions vs ranges in package.json — catch `^`, `~`, `*`, `latest`, and open bounds before they float. Pairs with [RangeRisk](https://rangerisk.dev) (range *risk* vs pin *policy*).
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
