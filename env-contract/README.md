# Env Contract

Zero-auth **local** MCP tools for env/config contracts: infer key schemas, required-vs-optional matrices, CI-friendly drift reports, redacted `.env.example` generation, and docker-compose `${VAR}` overlap. Distinct from simple key-only diffs — kinds, secrets masking, and compose awareness included. No SaaS, no API keys — everything runs on stdio via Node.

## Tools

| Tool | Purpose |
|------|---------|
| `env_schema_infer` | Infer contract from `.env` text (kinds, required, secretLikely, masked samples) |
| `env_contract_check` | Drift report: missing required, unexpected keys, kind mismatches |
| `env_example_render` | Safe `.env.example` / compose env placeholders |
| `compose_env_overlap` | `${VAR}` / `env_file` refs vs provided env keys |

**Safety:** tools never return raw secret values — only kinds and masked samples (e.g. `sk-***`).

## Start

```bash
node /workspace/env-contract/dist/bundle.js
```

## Skills

- **env-contract-review** — infer + check + compose overlap brief
- **env-example-sync** — render redacted examples from a contract

## License

MIT © Lawrence Hutchins
