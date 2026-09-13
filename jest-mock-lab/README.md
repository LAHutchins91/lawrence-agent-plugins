# Jest Mock Lab

Zero-auth **local** MCP tools for scanning pasted **Jest** mock JS/TS: `jest.mock(` / `jest.doMock(` / `jest.unstable_mockModule(` listings, spy/fn counts (`jest.spyOn(` / `jest.fn(`), timer counts (`jest.useFakeTimers(` / `advanceTimersByTime(` / `runAllTimers(`), and lite lint. Lite JS/TS scanner (same family as chai-assert-lab) — **never runs Jest**, no Jest runtime, no network.

This is **not** the Jest test runner. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `jm_mocks_list` | `jest.mock(` / `jest.doMock(` / `jest.unstable_mockModule(` → `[{module?, kind}]` |
| `jm_spies_hint` | `jest.spyOn(` / `jest.fn(` → `[{method, count}]` |
| `jm_timers_hint` | `jest.useFakeTimers(` / `advanceTimersByTime(` / `runAllTimers(` → `[{method, count}]` |
| `jm_lint_lite` | mock without clearAllMocks/restoreAllMocks, spy without mockRestore, empty file, requireActual missing when partial mock → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or Jest execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `jest.mock(` / `jest.spyOn(` / timer usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Jest or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/jest-mock-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/jest-mock-lab`

## Skills

- **jm-mocks** — list jest.mock/doMock/unstable_mockModule sites and spy/fn counts from pasted Jest source
- **jm-lint** — timer counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
