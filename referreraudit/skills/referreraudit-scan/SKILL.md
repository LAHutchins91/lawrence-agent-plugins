---
name: referreraudit-scan
description: Use when scanning for ReferrerAudit (`referreraudit`) issues.
---
# ReferrerAudit (`referreraudit`) scan

1. Locate relevant configs/source.
2. Apply heuristics: Lint Referrer-Policy for overly leaky values — catch `unsafe-url` and `no-referrer-when-downgrade` in raw headers, nginx `add_header`, Express / helmet configs, and `<meta name="referrer">`.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
