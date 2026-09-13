# Kyverno Lab

Zero-auth **local** MCP tools for **Kyverno** ClusterPolicy / Policy *heuristics*: policy inventory (kind, name, validationFailureAction), validate-rule hints (pattern / anyPattern / deny / message), mutate-rule hints (patchesJson6902 / patchStrategicMerge / targets), and educational lite lint. **YAML text** analysis only — no kyverno CLI, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Kyverno policy** workflows — ClusterPolicy / Policy inventory, validate & mutate rule extraction, plus quick smell heuristics without installing Kyverno.

## Tools

| Tool | Purpose |
|------|---------|
| `kyverno_policies_list` | Text → `{ policies: [{name?, kind?, action?}], count }` |
| `kyverno_validate_hint` | Text → `{ validates: [{name?, hasPattern?, hasDeny?}], count }` |
| `kyverno_mutate_hint` | Text → `{ mutates: [{name?, style?}], count }` |
| `kyverno_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML heuristics only** — never runs `kyverno`, never opens paths on disk, never evaluates expressions, never talks to a cluster or network.
- Not a Kyverno engine — nested / partial policy YAML and CEL / JMESPath nuances may be under-parsed.
- Lint rules are educational heuristics (empty, missing rules, overly broad match, privileged allow tip) — **not** an exploit guide.
- Never invents credentials or attack steps.

## Start

```bash
node /workspace/kyverno-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/kyverno-lab`

## Skills

- **kyverno-policies-validate** — policy inventory + validate-rule hints
- **kyverno-mutate-lint** — mutate-rule hints + lite lint

## License

MIT © Lawrence Hutchins
