# Terraform CDK Lab

Zero-auth **local** MCP tools for **CDKTF** (`cdktf.json` / TypeScript) text: stack/project inventory, provider detection, resource constructor hints, and educational lite lint. **JSON/string/regex** heuristics only — no CDKTF CLI, no Terraform apply, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **CDKTF** workflows — `cdktf.json` language/app/projectId/terraformProviders, `TerraformStack` subclasses, `@cdktf/provider-*` / `AwsProvider`, `new S3Bucket` / `new Instance` / HCL synth paste, and quick smell heuristics without installing the CDKTF CLI or running Terraform.

## Tools

| Tool | Purpose |
|------|---------|
| `cdktf_stacks_list` | cdktf.json / app text → `{ stacks: [{name?, language?, app?}], language?, providers?, count }` |
| `cdktf_providers_hint` | cdktf.json / program → `{ providers: string[], count }` |
| `cdktf_resources_hint` | Program / synth HCL → `{ resources: [{type?, name?}], count }` |
| `cdktf_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **JSON/string/regex analysis only** — never runs `cdktf` / `terraform`, never opens paths on disk, never evaluates code, never talks to a network.
- Not a CDKTF engine — nested/complex expressions and dynamic constructs may be under-parsed.
- Resources: `new S3Bucket` / `new Instance` / `TerraformResource`, plus HCL `resource "type" "name"` in pasted synth.
- Lint rules are educational heuristics (empty, missing language/app, hardcoded secrets/AKIA, `:latest` AMIs/tags, missing backend tip) — **not** an exploit guide.

## Start

```bash
node /workspace/terraform-cdk-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/terraform-cdk-lab`

## Skills

- **cdktf-stacks-providers** — stack/project inventory + provider hints
- **cdktf-resources-lint** — resource constructor hints + lite lint

## License

MIT © Lawrence Hutchins
