# Conftest Lab

Zero-auth **local** MCP tools for scanning pasted **Conftest Rego** policy: policy listings (`package` / `deny` / `violation`), namespace hints (`package main` / `package namespaces` / `package namespaces.xxx`), input hints (`input.` / `input[` / `with input as` / `conf.test`), and lite lint. Lite scanner (same family as opa-lab / sentinel-lab) — **never runs conftest or OPA CLI**, no network.

This is **not** the conftest CLI, `opa test`, or OPA. Documented heuristics only. Users may paste source that references Conftest — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `ct_policies_list` | package / deny / violation identifiers → `[{name?, kind?}]` |
| `ct_namespaces_hint` | package_main / package_namespaces / package_namespaces_sub → `[{method, count}]` |
| `ct_inputs_hint` | input_dot / input_bracket / with_input_as / conf_test → `[{method, count}]` |
| `ct_lint_lite` | missing package, deny without msg, empty file, non-main package (needs `-n`), violation+deny mixed → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or conftest/OPA CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full Rego AST. Supported loosely: `#` comments stripped; simple `'/"/` string literals; common Conftest/Rego keywords. Not supported / incomplete: type system, symbolic evaluation, remote policy fetch / `conftest test`.
- Does not run conftest or OPA CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/conftest-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/conftest-lab`

## Skills

- **ct-policies** — list policy identifiers and namespace method counts from pasted Conftest Rego
- **ct-lint** — input keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
