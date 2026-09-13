# SAM Lab

Zero-auth **local** MCP tools for **AWS SAM** `template.yaml` text: function inventory, event hints, Globals/Transform/Parameters extraction, and educational lite lint. **YAML string** heuristics only — no SAM CLI, no AWS deploy, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **AWS SAM template** workflows — `AWS::Serverless::Function` / `AWS::Lambda::Function` Runtime/Handler/Timeout/MemorySize, Events (Api, HttpApi, S3, SNS, SQS, Schedule, DynamoDB, …), Globals / Transform / Parameters, and quick smell heuristics without installing the SAM CLI or talking to AWS.

## Tools

| Tool | Purpose |
|------|---------|
| `sam_functions_list` | Template text → `{ functions: [{id?, runtime?, handler?, timeout?, memory?}], count }` |
| `sam_events_hint` | Template text → `{ events: [{function?, type?, properties?}], count }` |
| `sam_globals_hint` | Template text → `{ globals?, transform?, parameters?, count }` |
| `sam_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **YAML string analysis only** — never runs `sam` / AWS CLI, never opens paths on disk, never evaluates code, never talks to a network.
- Not a SAM/CloudFormation engine — nested intrinsic functions (`!Ref`, `!GetAtt`, `Fn::`) and macros may be under-parsed.
- Functions: `AWS::Serverless::Function` and `AWS::Lambda::Function` logical IDs with Runtime/Handler/Timeout/MemorySize.
- Lint rules are educational heuristics (empty, missing Transform `AWS::Serverless-2016-10-31`, `:latest` image, plaintext secrets in env, public Access policies tip, missing Runtime) — **not** an exploit guide.

## Start

```bash
node /workspace/sam-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/sam-lab`

## Skills

- **sam-functions-events** — function inventory + event hints
- **sam-globals-lint** — Globals/Transform/Parameters + lite lint

## License

MIT © Lawrence Hutchins
