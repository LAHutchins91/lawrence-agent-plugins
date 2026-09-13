# Serverless Lab

Zero-auth **local** MCP tools for scanning pasted **Serverless Framework** YAML/TS (`serverless.yml` / `serverless.ts`): function listings (`name` + `handler`), event hints (`http` / `httpApi` / `schedule` / `sns` / `sqs` / `stream` / `s3` / `websocket` / `alb` / `eventBridge`), resource hints (`resources.Resources` / `provider.iam` / `layers` / `plugins` / `custom` / `package` / `vpc`), and lite lint. Lite scanner (same family as crossplane-lab / flux-lab) — **never runs Serverless Framework CLI or AWS deploy**, no network.

This is **not** a Serverless Framework CLI or AWS deployer. Documented heuristics only. Users may paste source that references Serverless — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `sls_functions_list` | functions → `[{name?, handler?}]` |
| `sls_events_hint` | http / httpApi / schedule / sns / sqs / stream / s3 / websocket / alb / eventBridge → `[{method, count}]` |
| `sls_resources_hint` | resources.Resources / provider.iam / layers / plugins / custom / package / vpc → `[{method, count}]` |
| `sls_lint_lite` | missing service:/provider:, wildcard IAM `*`, empty file, EOL nodejs12.x/nodejs14.x → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Serverless Framework CLI execution, or AWS deploy for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML/TS AST. Supported loosely: `#` / `//` / `/* */` comments stripped; simple `'/"/` string literals; common Serverless keys. Not supported / incomplete: anchors/aliases, full multi-doc merge, remote deploy.
- Does not run serverless CLI or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/serverless-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/serverless-lab`

## Skills

- **sls-functions** — list functions and event hints from pasted serverless.yml / serverless.ts
- **sls-lint** — resource listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
