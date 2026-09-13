# Falco Lab

Zero-auth **local** MCP tools for **Falco** rules YAML *heuristics*: rule inventory (name, priority, enabled), macro / list hints, output / condition presence, and educational lite lint. **YAML text** analysis only — no falco CLI, no kernel/eBPF, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Falco rules** workflows — rule / macro inventory, output structure hints, plus quick smell heuristics without installing Falco or loading kernel modules.

## Tools

| Tool | Purpose |
|------|---------|
| `falco_rules_list` | Text → `{ rules: [{name?, priority?, enabled?}], count }` |
| `falco_macros_hint` | Text → `{ macros: string[], count }` |
| `falco_outputs_hint` | Text → `{ outputs: [{rule?, hasCondition?, hasOutput?}], count }` |
| `falco_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML heuristics only** — never runs `falco`, never opens paths on disk, never follows filesystem events, never talks to a network, never evaluates conditions.
- Not a Falco engine — nested / partial YAML and full condition semantics are out of scope (presence / structure only).
- Lint rules are educational heuristics (empty, missing rule name, disabled-all tip, overly broad condition) — **not** an exploit or evasion guide.
- Never invents attack payloads or evasion steps.

## Start

```bash
node /workspace/falco-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/falco-lab`

## Skills

- **falco-rules-macros** — rule inventory + macro / list hints
- **falco-outputs-lint** — output / condition presence + lite lint

## License

MIT © Lawrence Hutchins
