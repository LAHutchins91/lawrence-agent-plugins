# ARM Template Lab

Zero-auth **local** MCP tools for **Azure ARM** template JSON text: resource inventory, parameter/output hints, and educational lite lint. **JSON string** heuristics only — no az CLI, no deploy, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Azure ARM template** workflows — `resources[]` type/name/apiVersion/location, parameters (type / defaultValue / secureString), outputs, and quick smell heuristics without installing the Azure CLI or talking to Azure.

## Tools

| Tool | Purpose |
|------|---------|
| `arm_resources_list` | Template text → `{ resources: [{type?, name?, apiVersion?, location?}], count }` |
| `arm_parameters_hint` | Template text → `{ parameters: [{name, type?, hasDefault?, secure?}], count }` |
| `arm_outputs_hint` | Template text → `{ outputs: [{name, type?}], count }` |
| `arm_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **JSON string analysis only** — never runs `az` / Azure CLI, never opens paths on disk, never evaluates expressions, never talks to a network.
- Not an ARM deployment engine — nested expressions (`[parameters(...)]`, `copy`, nested templates) may be under-parsed.
- Resources: array entries with type / name / apiVersion / location.
- Lint rules are educational heuristics (empty, missing `$schema`/`contentVersion`, plaintext secrets in variables, wildcard `*` actions in roleAssignments tip, missing apiVersion) — **not** an exploit guide.
- Bicep-ish text: empty / missing `$schema`/`contentVersion` tips only when easy; primary target is ARM JSON.

## Start

```bash
node /workspace/arm-template-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/arm-template-lab`

## Skills

- **arm-resources-parameters** — resource inventory + parameter hints
- **arm-outputs-lint** — outputs + lite lint

## License

MIT © Lawrence Hutchins
