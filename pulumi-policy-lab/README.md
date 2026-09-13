# Pulumi Policy Lab

Zero-auth **local** MCP tools for scanning pasted **Pulumi Policy as Code** (TypeScript / JavaScript / Python): policy listings (`name` + `kind`), rule hints (`validateResource` / `validateStack` / `ResourceValidationPolicy` / `StackValidationPolicy` / `enforcementLevel` / `advisory` / `mandatory`), pack hints (`PolicyPack` / `policyPackArgs` / `policies:` / `name:` / `enforcementLevel:` / `displayName`), and lite lint. Lite scanner (same family as bicep-lab / cloudformation-lab) — **never runs Pulumi CLI**, no network.

This is **not** the Pulumi CLI, Policy Pack runner, or CrossGuard engine. Documented heuristics only. Users may paste source that references Pulumi — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `ppol_policies_list` | PolicyPack / policies array names → `[{name?, kind?}]` |
| `ppol_rules_hint` | validateResource / validateStack / ResourceValidationPolicy / StackValidationPolicy / enforcementLevel / advisory / mandatory → `[{method, count}]` |
| `ppol_packs_hint` | PolicyPack / policyPackArgs / policies: / name: / enforcementLevel: / displayName → `[{method, count}]` |
| `ppol_lint_lite` | missing PolicyPack, no enforcementLevel, empty policies, empty file, mandatory without message → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or Pulumi CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full TypeScript/Python AST. Supported loosely: `//` / `#` / `/* */` comments stripped; simple `'/"/` string literals; common Pulumi Policy keywords. Not supported / incomplete: type system, symbolic evaluation, remote pack publish / validate.
- Does not run Pulumi CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/pulumi-policy-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/pulumi-policy-lab`

## Skills

- **ppol-policies** — list policy names/kinds and rule method counts from pasted Pulumi Policy as Code
- **ppol-lint** — pack keyword listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
