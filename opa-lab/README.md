# OPA Lab

Zero-auth **local** MCP tools for scanning pasted **OPA Rego** policy: package listings (`name`), rule hints (`rule_heads` / `allow` / `deny` / `violation` / `default` / `import`), test hints (`test_rules` / `with` / `mock_data`), and lite lint. Lite scanner (same family as pulumi-policy-lab / bicep-lab) — **never runs OPA CLI**, no network.

This is **not** the OPA CLI, `opa test`, or Conftest. Documented heuristics only. Users may paste source that references OPA — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `opa_packages_list` | package declarations → `[{name?}]` |
| `opa_rules_hint` | rule_heads / allow / deny / violation / default / import → `[{method, count}]` |
| `opa_tests_hint` | test_rules / with / mock_data → `[{method, count}]` |
| `opa_lint_lite` | missing package, bare deny without msg, empty file, import without package, test without package → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or OPA CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full Rego AST. Supported loosely: `#` comments stripped; simple `'/"/` string literals; common Rego keywords. Not supported / incomplete: type system, symbolic evaluation, remote bundle fetch / `opa eval`.
- Does not run OPA CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/opa-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/opa-lab`

## Skills

- **opa-packages** — list package names and rule method counts from pasted Rego
- **opa-lint** — test keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
