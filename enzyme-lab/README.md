# Enzyme Lab

Zero-auth **local** MCP tools for scanning pasted **Enzyme** JS/TS: `mount(` / `shallow(` / `render(` listings, finder counts (`.find(` / `.findWhere(` / …), lifecycle counts (`.setProps(` / `.unmount(` / `.simulate(` / …), and lite lint. Lite JS/TS scanner (same family as jest-mock-lab) — **never runs Enzyme or React**, no network.

This is **not** the Enzyme test adapter. Documented heuristics only. Enzyme is unmaintained — treat findings as migration hints.

## Tools

| Tool | Purpose |
|------|---------|
| `enz_mounts_list` | `mount(` / `shallow(` / `render(` → `[{kind, component?}]` |
| `enz_finders_hint` | `.find(` / `.findWhere(` / `.findAll(` / `.exists(` / `.contains(` / `.at(` / `.first(` / `.last(` → `[{method, count}]` |
| `enz_lifecycle_hint` | `.setProps(` / `.setState(` / `.setContext(` / `.unmount(` / `.update(` / `.dive(` / `.simulate(` → `[{method, count}]` |
| `enz_lint_lite` | mount without unmount, simulate without update, empty file, deprecated enzyme import → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or Enzyme/React execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `mount(` / `.find(` / lifecycle usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Enzyme or React or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/enzyme-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/enzyme-lab`

## Skills

- **enz-mounts** — list mount/shallow/render sites and finder counts from pasted Enzyme source
- **enz-lint** — lifecycle counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
