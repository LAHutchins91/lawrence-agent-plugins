# Vitest Mock Lab

Zero-auth **local** MCP tools for **Vitest vi.mock JS/TS text**: mock inventory (`vi.mock` / `jest.mock`), spy/fn hints, hoist/doMock/unmock/resetModules hints, and heuristic lite lint. No `vitest` runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Vitest** mock workflows — listing mocks/spies/hoist helpers and educational smell heuristics without importing `vitest` or running tests.

## Tools

| Tool | Purpose |
|------|---------|
| `vm_mocks_list` | source text → `{ mocks, count }` |
| `vm_spies_hint` | source text → `{ spies, count }` |
| `vm_hoist_hint` | source text → `{ hoisted, count }` |
| `vm_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports vitest, never opens files on disk or over the network, never evaluates mock/spy code.
- Best-effort regex heuristics on `vi.mock` / `jest.mock` / `vi.spyOn` / `vi.fn` / `vi.hoisted` / `vi.doMock` / `vi.unmock` / `vi.resetModules` (not a full JS/TS AST or vitest runtime).
- Lint rules are educational heuristics (empty, mock without clearAllMocks tip, spy without mockRestore, import order vs hoist tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/vitest-mock-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/vitest-mock-lab`

## Skills

- **vm-mocks-spies** — mock list + spy/fn hints
- **vm-hoist-lint** — hoist/doMock/unmock hints + lite lint

## License

MIT © Lawrence Hutchins
