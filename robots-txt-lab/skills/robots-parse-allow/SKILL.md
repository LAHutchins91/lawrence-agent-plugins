---
name: robots-parse-allow
description: >
  Parse robots.txt User-agent groups and check path allow/disallow with the
  local zero-auth robots-txt-lab MCP. String-level only — no HTTP fetch.
version: 1.0.0
tags: [robots.txt, parse, allow, disallow, developer-tools]
---

# Robots parse & allow checks

When the user pastes robots.txt **text** and needs structure or path checks:

1. **`robots_parse`** — `{ text }` → `{ groups, sitemaps, unmatched? }`.
   - Groups with `userAgents`, `allow`, `disallow`.
   - Does **not** fetch the file or Sitemap URLs.
2. **`robots_allows`** — `{ text, userAgent, path }` → `{ allowed, matchedRule?, group? }`.
   - Longest-match / standard precedence (Allow wins equal-length ties).

## Example prompts

- "Parse this robots.txt into groups"
- "Is /private/page allowed for Googlebot?"
- "Which Disallow rule matches this path?"
