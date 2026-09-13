# Dotenv Merge Lab

Zero-auth **local** MCP tools for `.env` parse, merge, key-diff, and redact. **String-level** analysis only — no secret-file reads, filesystem walks, or network I/O. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical dotenv **text** workflows — parse KEY=VALUE with quotes/`export`, merge with last-wins or base-wins, diff keys without dumping secret values, and redact PASSWORD/TOKEN/API_KEY-style values for safe pasting.

## Tools

| Tool | Purpose |
|------|---------|
| `dotenv_parse` | Dotenv text → `{ vars, keys, errors? }` |
| `dotenv_merge` | `{ base, overlay, strategy? }` → `{ text, vars, changedKeys }` |
| `dotenv_diff_keys` | `{ a, b }` → `{ onlyA, onlyB, both, valueChanged }` (keys only) |
| `dotenv_redact` | Dotenv text → `{ text, redactedKeys }` |

## Caps & caveats

- **String analysis only** — never opens `.env` paths, never fetches remote env, never writes secrets to disk beyond caller-provided strings.
- Supports comments (`#`), optional `export` prefix, single/double-quoted values, and duplicate keys (last assignment wins within a single parse).
- Merge default is **last-wins** (overlay overrides base). **base-wins** keeps base values and only adds missing keys.
- `dotenv_diff_keys.valueChanged` lists **keys only** — it does not return secret values.
- Redaction is name-heuristic (PASSWORD, SECRET, TOKEN, KEY, API_KEY, PRIVATE, CREDENTIAL, AUTH, etc.) → `***REDACTED***`. Non-secret keys and comments are preserved.
- Not a substitute for shell `source` / dotenv runtime expansion (`$VAR` interpolation is not expanded).

## Start

```bash
node /workspace/dotenv-merge-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/dotenv-merge-lab`

## Skills

- **dotenv-parse-merge** — Parse dotenv text and merge base/overlay with strategy
- **dotenv-diff-redact** — Diff keys without dumping secrets; redact secret-like values

## License

MIT © Lawrence Hutchins
