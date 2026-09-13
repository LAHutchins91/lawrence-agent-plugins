---
name: pointerlab-scan
description: Use when scanning for PointerLab issues.
---
# PointerLab scan

1. Locate relevant configs/source.
2. Apply heuristics: JSON Pointer get/assert for API payloads. Pull fields from response fixtures with RFC 6901 pointers and gate CI on assert suites so contract drift never ships silently.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
