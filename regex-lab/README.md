# Regex Lab

Zero-auth **local** MCP tools for JavaScript RegExp: test matches, plain-English explain, replace preview, and catastrophic-backtracking lint heuristics. No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog combines safe regex test + heuristic explain + multi-sample replace preview + ReDoS smell lint in one lightweight plugin.

## Tools

| Tool | Purpose |
|------|---------|
| `regex_test` | Match `pattern` against `sample` (optional `flags` / `global`); return matchCount + matches |
| `regex_explain` | Tokenize pattern into plain-English meanings (local heuristics, no SaaS) |
| `regex_replace_preview` | Preview replace on each string in `samples` |
| `regex_lint` | Heuristic findings: nested quantifiers, overlapping alts, unused captures, empty alts, etc. |

## Start

```bash
node /workspace/regex-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/regex-lab`

## Skills

- **regex-debug** — test and explain patterns against samples
- **regex-harden** — lint for ReDoS smells and unused captures, then preview safer replaces

## License

MIT © Lawrence Hutchins
