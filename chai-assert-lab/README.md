# Chai Assert Lab

Zero-auth **local** MCP tools for scanning pasted **Chai** JS/TS: assert style counts (`expect(` / `assert.` / `should`), chain hints (`.to.equal` / `.deep.equal` / `.include` / `.throw` / `.eventually`), plugin hints (`chai.use(` / `chai-as-promised` / `sinon-chai`), and lite lint. Lite JS/TS scanner (same family as supertest-lab) — **never executes assertions**, no chai assert runtime, no network.

This is **not** the Chai library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `chai_asserts_list` | `expect(` / `assert.` / `should` → `[{style, count}]` |
| `chai_chains_hint` | `.to.equal` / `.deep.equal` / `.include` / `.throw` / `.eventually` → `[{chain, count}]` |
| `chai_plugins_hint` | `chai.use(` / `chai-as-promised` / `sinon-chai` → `[{plugin, count}]` |
| `chai_lint_lite` | mixed expect+assert styles, `==` near expect, empty file, missing chai import → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or assertion execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `expect(` / `assert.` / chain / plugin usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not execute assertions or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/chai-assert-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/chai-assert-lab`

## Skills

- **chai-chains** — list assert styles and chain hints from pasted Chai source
- **chai-lint** — plugin hints + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
