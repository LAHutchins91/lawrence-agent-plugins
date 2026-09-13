# EditorConfig Lab

Zero-auth **local** MCP tools for **.editorconfig text**: parse INI-like sections, resolve properties for a path (best-effort EditorConfig globs), diff two configs, and heuristic lite lint. No network. No disk walk beyond the pasted text. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **.editorconfig text** workflows — section parse, path property resolution, config diffs, and quick educational smell heuristics without touching the filesystem.

## Tools

| Tool | Purpose |
|------|---------|
| `ec_parse` | config text → `{ root?, sections, sectionCount }` |
| `ec_resolve_for_path` | `{ text, path }` → `{ matched, properties, path }` |
| `ec_diff_sections` | `{ textA, textB }` → `{ onlyA, onlyB, changed, sectionDiffs }` |
| `ec_lint_lite` | config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never opens `.editorconfig` on disk or over the network; never walks directories.
- Glob matching is **best-effort** (`*`, `**`, `?`, `[]`, `{a,b}`, `{1..3}`) — not a full libeditorconfig port.
- Later matching sections override earlier for the same keys (EditorConfig cascade within one file).
- Lint rules are educational heuristics — **not** an exploit guide.

## Start

```bash
node /workspace/editorconfig-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/editorconfig-lab`

## Skills

- **ec-parse-resolve** — parse sections + resolve path properties
- **ec-diff-lint** — diff two configs + lite lint

## License

MIT © Lawrence Hutchins
