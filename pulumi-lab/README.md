# Pulumi Lab

Zero-auth **local** MCP tools for **Pulumi.yaml** / program text: project/stack inventory, resource constructor hints, config key extraction, and educational lite lint. **YAML/string/regex** heuristics only — no Pulumi CLI, no cloud, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Pulumi project text** workflows — `Pulumi.yaml` name/runtime/main/backend, `new aws.` / `new azure.` / CustomResource / YAML `type:` resources, `pulumi.Config` / `config.require` keys, and quick smell heuristics without installing the Pulumi CLI or talking to a backend.

## Tools

| Tool | Purpose |
|------|---------|
| `pulumi_stacks_list` | Project text → `{ stacks: [{name?, runtime?, description?, main?, backend?}], count }` |
| `pulumi_resources_hint` | Program text → `{ resources: [{type?, name?}], count }` |
| `pulumi_config_hint` | Project/program text → `{ configKeys: string[], secretKeys?: string[], count }` |
| `pulumi_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **YAML/string/regex analysis only** — never runs `pulumi`, never talks to a cloud backend, never opens paths on disk, never evaluates code.
- Not a Pulumi engine — nested/complex expressions and dynamic resource types may be under-parsed.
- Resources: `new aws.` / `new azure.` / `new gcp.` / provider constructors, `pulumi.CustomResource`, component resources, YAML `type:` resources.
- Lint rules are educational heuristics (empty, missing name/runtime, plaintext secret in config, `:latest` image tags, hardcoded AKIA/api keys tip, missing backend tip) — **not** an exploit guide.

## Start

```bash
node /workspace/pulumi-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/pulumi-lab`

## Skills

- **pulumi-stacks-resources** — project/stack inventory + resource constructor hints
- **pulumi-config-lint** — config key extraction + lite lint

## License

MIT © Lawrence Hutchins
