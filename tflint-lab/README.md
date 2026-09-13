# TFLint Lab

Zero-auth **local** MCP tools for **TFLint** `.tflint.hcl` *heuristics*: rule block inventory, plugin hints (name / source / version), config block extraction, and educational lite lint. **String/regex** heuristics only — no tflint CLI, no terraform, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **TFLint config** workflows — rule enable/disable inventory, plugin source/version hints, `config` block fields, plus quick smell heuristics without installing TFLint or talking to a registry.

## Tools

| Tool | Purpose |
|------|---------|
| `tflint_rules_list` | HCL text → `{ rules: [{name?, enabled?}], count }` |
| `tflint_plugins_hint` | Text → `{ plugins: [{name?, source?, version?}], count }` |
| `tflint_config_hint` | Text → `{ config: object, count }` |
| `tflint_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL string analysis only** — never runs `tflint` / `terraform`, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- Not a TFLint engine — nested blocks, complex expressions, and custom rule sources may be under-parsed.
- Lint rules are educational heuristics (empty, missing plugin aws/terraform, all rules disabled tip, outdated plugin version tip) — **not** an exploit guide.

## Start

```bash
node /workspace/tflint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/tflint-lab`

## Skills

- **tflint-rules-plugins** — rule block inventory + plugin name/source/version hints
- **tflint-config-lint** — config block extraction + lite lint

## License

MIT © Lawrence Hutchins
