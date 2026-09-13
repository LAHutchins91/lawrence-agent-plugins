---
name: robots-sitemap-lint
description: "List Sitemap directives and run heuristic robots.txt lint (empty Disallow, missing User-agent, duplicate sitemaps, non-rooted paths) with the local zero-auth robots-txt-lab MCP. String-only — no HTTP fetch."
version: 1.0.0
tags: [robots.txt, sitemap, lint, developer-tools]
---

# Robots sitemap & lint

When the user wants sitemap inventory or quick robots.txt smells from **text**:

1. **`sitemaps_list`** — `{ text }` → `{ sitemaps: string[] }`.
2. **`robots_lint`** — `{ text }` → `{ findings, findingCount }`.
   - Rules: empty_disallow, missing_user_agent, duplicate_sitemap,
     non_rooted_path, blocks_all, sitemap_not_absolute, unmatched_lines, etc.

## Example prompts

- "List sitemaps declared in this robots.txt"
- "Lint this robots.txt for common mistakes"
- "Are any Disallow paths missing a leading slash?"
