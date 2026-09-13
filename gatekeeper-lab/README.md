# Gatekeeper Lab

Zero-auth **local** MCP tools for **OPA Gatekeeper** ConstraintTemplate / Constraint *heuristics*: constraint inventory (kind, name, enforcementAction), template hints (CRD kind, targets/rego presence), violation/status sample parsing, and educational lite lint. **YAML text** analysis only — no gatekeeper CLI, no OPA runtime, no cluster, no network, no filesystem follow, no eval. No SaaS. Distinct from opa-lab (Rego packages/rules).

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Gatekeeper** workflows — Constraint / ConstraintTemplate inventory, violation status hints, plus quick smell heuristics without installing Gatekeeper or OPA.

## Tools

| Tool | Purpose |
|------|---------|
| `gatekeeper_constraints_list` | Text → `{ constraints: [{kind?, name?, enforcementAction?}], count }` |
| `gatekeeper_templates_hint` | Text → `{ templates: [{name?, crdKind?, hasRego?}], count }` |
| `gatekeeper_violations_hint` | Text → `{ violations: [{resource?, message?}], count }` |
| `gatekeeper_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML heuristics only** — never runs `gatekeeper` / `gator` / OPA, never opens paths on disk, never evaluates Rego, never talks to a cluster or network.
- Not a Gatekeeper / OPA engine — nested / partial YAML and full Rego analysis are out of scope (`hasRego` is presence-only).
- Lint rules are educational heuristics (empty, missing template, dryrun-only tip, overly broad match) — **not** an exploit guide.
- Never invents credentials or attack steps.

## Start

```bash
node /workspace/gatekeeper-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/gatekeeper-lab`

## Skills

- **gatekeeper-constraints-templates** — constraint inventory + ConstraintTemplate hints
- **gatekeeper-violations-lint** — violation/status hints + lite lint

## License

MIT © Lawrence Hutchins
