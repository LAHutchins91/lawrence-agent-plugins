# Sinon Stub Lab

Zero-auth **local** MCP tools for **Sinon stub/spy JS/TS text**: stub inventory (`sinon.stub` / `sandbox.stub`), spy hints, fake/timers/server/sandbox hints, and heuristic lite lint. No `sinon` runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Sinon** stub/spy workflows — listing stubs/spies/fakes and educational smell heuristics without importing `sinon` or running tests.

## Tools

| Tool | Purpose |
|------|---------|
| `sinon_stubs_list` | source text → `{ stubs, count }` |
| `sinon_spies_hint` | source text → `{ spies, count }` |
| `sinon_fakes_hint` | source text → `{ fakes, count }` |
| `sinon_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports sinon, never opens files on disk or over the network, never evaluates stub/spy code.
- Best-effort regex heuristics on `sinon.stub` / `sandbox.stub` / `sinon.spy` / `sinon.fake` / `useFakeTimers` / `fakeServer` / `createSandbox` (not a full JS/TS AST or sinon runtime).
- Lint rules are educational heuristics (empty, stub without restore/sandbox tip, calledOnce missing assert tip, fake timers without restore, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/sinon-stub-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/sinon-stub-lab`

## Skills

- **sinon-stubs-spies** — stub list + spy hints
- **sinon-fakes-lint** — fake/timers/sandbox hints + lite lint

## License

MIT © Lawrence Hutchins
