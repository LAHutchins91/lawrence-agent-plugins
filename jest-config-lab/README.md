# Jest Config Lab

Zero-auth **local** MCP tools for **Jest config text**: extract `testMatch` / `testRegex`, summarize coverage options, list `projects`, and heuristic lite lint. No `jest` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Jest config text** workflows — matcher inventory, coverage option summaries, multi-project lists, and quick educational smell heuristics without invoking Jest.

## Tools

| Tool | Purpose |
|------|---------|
| `jest_test_match` | Jest config text → `{ testMatch?, testRegex?, testPathIgnorePatterns?, roots? }` |
| `jest_coverage_summary` | Jest config text → `{ collectCoverage?, coverageDirectory?, coverageThreshold?, collectCoverageFrom?, coverageReporters? }` |
| `jest_projects_list` | Jest config text → `{ projects, count }` |
| `jest_lint_lite` | Jest config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `jest`, never opens files on disk or over the network.
- Prefer **JSON/JSONC** (`.jestrc*`, `jest.config.json`). `jest.config.js` / `jest.config.ts`-like text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, and `require()` are not resolved.
- Unwraps `package.json` `"jest"` key when package hints (`name`, `scripts`, deps) are present.
- Lint rules are educational heuristics (empty config, missing matchers, `coverageThreshold` without `collectCoverage`, deprecated keys like `testURL` / `setupTestFrameworkScriptFile`, `transformIgnorePatterns` tips, JS heuristic limits) — **not** an exploit guide.

## Start

```bash
node /workspace/jest-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/jest-config-lab`

## Skills

- **jest-test-match-coverage** — testMatch / coverage summary
- **jest-projects-lint** — projects list + lite lint

## License

MIT © Lawrence Hutchins
