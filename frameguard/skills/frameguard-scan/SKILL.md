---
name: frameguard-scan
description: Use when scanning for FrameGuard (`frameguard`) issues.
---
# FrameGuard (`frameguard`) scan

1. Locate relevant configs/source.
2. Apply heuristics: Lint X-Frame-Options / CSP frame-ancestors — catch missing framing protection, `ALLOWALL`, obsolete `ALLOW-FROM`, and `frame-ancestors *` in raw headers, nginx `add_header`, and Express / helmet configs.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
