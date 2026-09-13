# Sentinel Lab

Zero-auth **local** MCP tools for scanning pasted **HashiCorp Sentinel** policy: policy listings (`main` / named rules), import hints (`tfplan/v2` / `tfconfig` / `tfrun` / `http` / `decimal` / `strings` / `types`), param keyword hints (`param` / `default` / `filter` / `rule` / `when` / `as` / `else`), and lite lint. Lite scanner (same family as opa-lab / pulumi-policy-lab) — **never runs Sentinel CLI**, no network.

This is **not** the Sentinel CLI, `sentinel apply`, or Terraform Cloud policy checks. Documented heuristics only. Users may paste source that references Sentinel — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `sen_policies_list` | policy rule names / `main =` / policy identifiers → `[{name?}]` |
| `sen_imports_hint` | tfplan/v2 / tfconfig / tfrun / http / decimal / strings / types → `[{method, count}]` |
| `sen_params_hint` | param / default / filter / rule / when / as / else → `[{method, count}]` |
| `sen_lint_lite` | missing main, unused import, empty file, print leftover, param without default → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or Sentinel CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full Sentinel AST. Supported loosely: `#` and `//` comments stripped; simple `'/"/` string literals; common Sentinel keywords. Not supported / incomplete: type system, full evaluation, remote policy set fetch / `sentinel apply`.
- Does not run Sentinel CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/sentinel-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/sentinel-lab`

## Skills

- **sen-policies** — list policy rule names and import method counts from pasted Sentinel
- **sen-lint** — param keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
