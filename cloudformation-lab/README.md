# CloudFormation Lab

Zero-auth **local** MCP tools for scanning pasted **CloudFormation** YAML/JSON templates: resource listings (logical `id` + `Type`), parameter hints (`name` + `Type`), output hints (`Outputs` / `Export` / `Value` / `Description` / `Condition`), and lite lint. Lite scanner (same family as serverless-lab / crossplane-lab) — **never runs AWS CLI or cfn-lint binary**, no network.

This is **not** an AWS CLI, CloudFormation deployer, or cfn-lint. Documented heuristics only. Users may paste source that references AWS — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `cfn_resources_list` | Resources → `[{id?, type?}]` |
| `cfn_parameters_hint` | Parameters → `[{name?, type?}]` |
| `cfn_outputs_hint` | Outputs / Export / Value / Description / Condition → `[{method, count}]` |
| `cfn_lint_lite` | missing Resources:, wildcard IAM `*`, Password/Secret/Token without NoEcho, empty file, hardcoded ami-/account id → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, AWS CLI execution, or cfn-lint binary for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML/JSON AST. Supported loosely: `#` / `//` / `/* */` comments stripped; simple `'/"/` string literals; common CloudFormation keys. Not supported / incomplete: anchors/aliases, full multi-doc merge, remote deploy / validate.
- Does not run AWS CLI or cfn-lint, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/cloudformation-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cloudformation-lab`

## Skills

- **cfn-resources** — list Resources and Parameters from pasted CloudFormation YAML/JSON
- **cfn-lint** — output listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
