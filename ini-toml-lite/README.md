# INI TOML Lite

Zero-auth **local** MCP tools for pasted INI / TOML-lite configs, flat key diffs, and secret-key redaction. No network — paste text only.

## Why novel

Config-paste companion: parse common INI and a documented TOML subset, then diff flat key maps or redact password/secret/token/key/credential values without auth or remotes. Not a full TOML 1.0 implementation.

## Tools

| Tool | Purpose |
|------|---------|
| `ini_parse` | INI text → `{ok, data}` nested or flat section maps (comments `#;` + basic quotes) |
| `toml_parse_lite` | Lite TOML → `{ok, data, limitationsNote?}` (keys, strings, numbers, bools, tables, array-tables) |
| `config_key_diff` | Two flat key maps → `onlyInA`, `onlyInB`, `shared`, `valueChanged` |
| `config_redact` | Mask values whose keys match password\|secret\|token\|key\|credential\|api_key |

## Start

```bash
node /workspace/ini-toml-lite/dist/bundle.js
```

## Skills

- **ini-toml-parse** — INI + TOML-lite parse
- **config-redact** — secret-key redaction + flat key diff

## License

MIT © Lawrence Hutchins
