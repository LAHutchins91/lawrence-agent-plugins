---
name: htaccess-redirect-lint
description: >
  List redirects and run heuristic .htaccess lint (RewriteEngine Off with rules,
  missing L loop smells, bare RewriteBase, duplicates) with the local zero-auth
  htaccess-lab MCP. String-only — no Apache exec or FS.
version: 1.0.0
tags: [htaccess, redirect, lint, apache, developer-tools]
---

# Htaccess redirects & lint

When the user wants redirect inventory or quick `.htaccess` smells from **text**:

1. **`htaccess_redirect_list`** — `{ text }` → `{ redirects: [{type, code?, from, to, line}] }`.
2. **`htaccess_lint`** — `{ text }` → `{ findings, findingCount }`.
   - Rules: rewriteengine_off_with_rules, missing_l_flag_loop_smell,
     bare_rewritebase, duplicate_rule, allowoverride_noise, etc.

## Example prompts

- "List all redirects in this .htaccess"
- "Lint this .htaccess for common mistakes"
- "Will these RewriteRules loop without [L]?"
