---
name: htaccess-parse-rewrite
description: Parse .htaccess directives/rewrites and explain RewriteRule lines with the local zero-auth htaccess-lab MCP. String-level only — no Apache exec or FS.
version: 1.0.0
tags: [htaccess, apache, rewrite, parse, developer-tools]
---

# Htaccess parse & rewrite explain

When the user pastes `.htaccess` **text** and needs structure or RewriteRule meaning:

1. **`htaccess_parse_lite`** — `{ text }` → `{ directives, rewrites, redirects, notes? }`.
   - Common directives: RewriteEngine, RewriteRule, RewriteCond, Redirect, etc.
   - Does **not** run Apache or open files.
2. **`rewrite_rule_explain`** — `{ rule }` or `{ pattern, substitution, flags? }` → `{ explanation, flags, notes }`.
   - Plain-English heuristic for flags (L, R, NC, QSA, …).

## Example prompts

- "Parse this .htaccess into directives and rewrites"
- "Explain RewriteRule ^blog/(.*)$ /index.php?p=$1 [L,QSA]"
- "What does the R=301 flag do on this rule?"
