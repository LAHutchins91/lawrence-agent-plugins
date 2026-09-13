---
name: disposition-forwarded
description: >
  Parse Content-Disposition (filename / filename*) and RFC 7239 Forwarded
  plus X-Forwarded-For / Proto / Host with the local zero-auth
  http-header-lab MCP. String analysis only — no network I/O.
version: 1.0.0
tags: [http, content-disposition, forwarded, x-forwarded-for, developer-tools]
---

# Content-Disposition & Forwarded

When the user needs filenames from Content-Disposition or hop data from proxies:

1. **`content_disposition_parse`** — `{ value }` → `{ type, filename?, filenameStar?, params }`.
   - `type` is `inline`, `attachment`, or `other`. Decodes RFC 5987 `filename*`.
2. **`forwarded_parse`** — `{ forwarded?, xForwardedFor?, xForwardedProto?, xForwardedHost? }` → `{ hops?, for?, proto?, host?, notes }`.
   - Prefers RFC 7239 `Forwarded`; synthesizes hops from X-Forwarded-For when needed.

## Example prompts

- "What's the download filename in this Content-Disposition?"
- "Parse `Forwarded: for=192.0.2.60;proto=https;host=app.example.com`"
- "Compare X-Forwarded-For with the Forwarded header"
