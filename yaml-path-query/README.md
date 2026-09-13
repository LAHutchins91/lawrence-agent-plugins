# YAML Path Query

Zero-auth **local** MCP tools for pasted YAML text: parse/validate, dot-path gets, nested key diffs, and secret-key redaction. No network, no file I/O beyond stdio — paste text in, get structured JSON out.

## Why novel

No zero-auth local MCP in the catalog specializes in YAML parse diagnostics + dot-path queries + nested key diffs + secret redaction without cloud uploads.

## Tools

| Tool | Purpose |
|------|---------|
| `yaml_parse_check` | YAML paste → `{valid, errors[{line?, message, excerpt?}]}` |
| `yaml_get` | YAML + dot-path (`a.b.0.c`) → `{found, value, type}` or not-found |
| `yaml_diff_keys` | Two YAMLs → `onlyInA` / `onlyInB` / `shared` / `valueChanged` |
| `yaml_redact_secrets` | Mask values under password/secret/token/key/credential keys → redacted YAML + paths (never echoes originals) |

## Start

```bash
node /workspace/yaml-path-query/dist/bundle.js
```

## Skills

- **yaml-path-get** — parse-check + dot-path get workflows
- **yaml-secret-redact** — secret key masking via `yaml_redact_secrets`

## License

MIT © Lawrence Hutchins
