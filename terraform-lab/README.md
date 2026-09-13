# Terraform Lab

Zero-auth **local** MCP tools for **Terraform** HCL *heuristics*: top-level block inventory, required_providers / provider hints, module source/version hints, and educational lite lint. **String/regex** heuristics only — no terraform CLI, no plan/apply, no network, no filesystem follow, no eval. No SaaS.

Distinct from **terraform-cdk-lab** (CDKTF) — this plugin analyzes classic Terraform HCL text only.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Terraform HCL** workflows — block inventory (`resource` / `data` / `variable` / `output` / `module` / …), provider + `required_providers` hints, module `source`/`version`, plus quick smell heuristics without installing Terraform or talking to a backend.

## Tools

| Tool | Purpose |
|------|---------|
| `terraform_blocks_list` | HCL text → `{ blocks: [{type, name?, labels?}], count }` |
| `terraform_providers_hint` | Text → `{ providers: [{name?, source?, version?}], count }` |
| `terraform_modules_hint` | Text → `{ modules: [{name?, source?, version?}], count }` |
| `terraform_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL string analysis only** — never runs `terraform`, never plans/applies, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- **Never invents or decodes credentials** — flags key *names* / smell patterns only, never secret values.
- Not a Terraform engine — complex nested modules, `for_each` / dynamic blocks, and remote state may be under-parsed.
- Lint rules are educational heuristics (empty, missing `required_version`, plaintext secrets in variables, `0.0.0.0/0` ingress tip, unconstrained provider versions) — **not** an exploit guide.

## Start

```bash
node /workspace/terraform-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/terraform-lab`

## Skills

- **terraform-blocks-providers** — top-level block inventory + provider / required_providers hints
- **terraform-modules-lint** — module source/version hints + lite lint

## License

MIT © Lawrence Hutchins
