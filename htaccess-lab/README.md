# Htaccess Lab

Zero-auth **local** MCP tools for `.htaccess` parse, RewriteRule explain, redirect inventory, and heuristic lint. **String-level** analysis only — no Apache execution, filesystem reads, or network I/O. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical `.htaccess` **text** workflows — directive parse, RewriteRule plain-English explain, redirect inventory, and quick lint smells without running Apache or opening files on disk.

## Tools

| Tool | Purpose |
|------|---------|
| `htaccess_parse_lite` | .htaccess text → `{ directives, rewrites, redirects, notes? }` |
| `rewrite_rule_explain` | rule string or `{ pattern, substitution, flags? }` → `{ explanation, flags, notes }` |
| `htaccess_redirect_list` | .htaccess text → `{ redirects }` |
| `htaccess_lint` | .htaccess text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never executes Apache, never opens filesystem paths, never follows includes.
- Line-oriented heuristic parser for common directives (RewriteEngine, RewriteRule, RewriteCond, Redirect, RedirectMatch, ErrorDocument, Options, AllowOverride noise).
- Not a full Apache/mod_rewrite simulator; exotic escaping, nested conditions, and Map lookups may be approximate.
- Lint rules are heuristics (RewriteEngine Off with rules, missing L flag loop smells, bare RewriteBase, duplicate rules, etc.).

## Start

```bash
node /workspace/htaccess-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/htaccess-lab`

## Skills

- **htaccess-parse-rewrite** — Parse .htaccess directives/rewrites and explain RewriteRule
- **htaccess-redirect-lint** — List redirects and run heuristic .htaccess lint

## License

MIT © Lawrence Hutchins
