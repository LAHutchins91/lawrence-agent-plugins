# Terraform HCL Lab

Zero-auth **local** MCP tools for scanning pasted Terraform HCL text: list resources, list modules, look up variables, and lite lint. String / regex scanner only — no `terraform` binary, no network.

This is **not a full HCL parser**: `#` / `//` / `/* */` comments are stripped loosely; common `resource` / `module` / `variable` / `terraform` blocks with simple attributes are supported. No heredoc fidelity, no expression AST, no provider schema, no `terraform validate` / plan / apply.

## Tools

| Tool | Purpose |
|------|---------|
| `tf_list_resources` | HCL text → `{resources: [{type, name}]}` from `resource "type" "name"` |
| `tf_list_modules` | → `{modules: [{name, source?}]}` from `module "name"` |
| `tf_var_lookup` | hcl + name → `{name, type?, default?, description?}` when simple attrs present |
| `tf_lint_lite` | duplicate resource addresses, missing `required_providers` hint, empty module source, suspicious hardcoded secrets → `{findings[]}` |

## Limits

- Pasted HCL text you already have. No sockets, DNS, remote fetches, or `terraform` CLI.
- Input capped at ~1MB (`1048576` characters).
- **Not** a full HCL/terraform parser: no expression evaluation, no nested object deep-walk, no count/for_each expansion, no state/backend awareness.
- Secret findings are **heuristic** (attribute key names like password/secret/token with non-reference string values) — not a secret scanner.
- Common Terraform HCL only. Lite regex/scanner.

## Start

```bash
node /workspace/terraform-hcl-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/terraform-hcl-lab`

## Skills

- **tf-list** — list resources / modules / look up variables from pasted HCL
- **tf-lint** — lite heuristic findings on pasted HCL

## License

MIT © Lawrence Hutchins — FREE
