# Semver Range Lab

Zero-auth **local** MCP tools for npm-style semver: version satisfies range, range intersection, minimum satisfying candidate, and dependency-range risk heuristics. No SaaS product, no API keys — everything runs on stdio via Node (bundled `semver`).

## Why novel

No zero-auth local MCP in the catalog combines satisfies + intersect + min-from-candidates + package.json dep-range risk scoring in one lightweight plugin.

## Tools

| Tool | Purpose |
|------|---------|
| `semver_satisfies` | Does `version` satisfy `range`? |
| `semver_intersect` | Intersection of two ranges (or empty) |
| `semver_expand_min` | Minimum satisfying version from `candidates` (semver sort) |
| `dep_range_risk` | Heuristic risk for package.json-style dependency ranges |

## Start

```bash
node /workspace/semver-range-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/semver-range-lab`

## Skills

- **semver-debug** — satisfies, intersect, and expand-min against candidate lists
- **dep-risk-audit** — score dependency ranges (`*`, `^0.x`, bare caret, `>=`, pins)

## License

MIT © Lawrence Hutchins
