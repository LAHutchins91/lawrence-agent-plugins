# JSON Schema Fixtures

Zero-auth **local** MCP tools for JSON Schema validation, seeded fixture generation, and structural schema diffs. No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog specializes in JSON Schema fixture generation with deterministic seeds plus structural schema contract diffs.

## Tools

| Tool | Purpose |
|------|---------|
| `schema_validate` | Validate a JSON instance against a JSON Schema (Ajv draft-07); return `valid` + structured errors |
| `fixture_generate` | Generate one sample fixture from a schema; optional `seed` for determinism |
| `fixture_generate_n` | Generate N variant fixtures (1–50) with seed+i |
| `schema_diff` | Structural diff of two schemas: added / removed / changed property paths |

## Start

```bash
node /workspace/json-schema-fixtures/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/json-schema-fixtures`

## Skills

- **schema-fixture-gen** — validate + generate fixtures for contract tests
- **schema-contract-diff** — structural schema drift review

## License

MIT © Lawrence Hutchins
