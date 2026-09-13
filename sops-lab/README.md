# SOPS Lab

Zero-auth **local** MCP tools for scanning pasted **SOPS** config and encrypted YAML/JSON: encrypted file markers (`sops:` / `ENC[...]`), key-type hints (`pgp` / `age` / `kms` / `gcp_kms` / `azure_kv` / `hc_vault`), creation_rules hints (`creation_rules` / `path_regex` / `encrypted_regex` / `mac` / `lastmodified` / `version`), and lite lint. Lite scanner (same family as cosign-lab / syft-lab) — **never runs sops CLI**, **never decrypts**, **never returns secret values**, no network.

This is **not** the SOPS CLI or Mozilla SOPS decrypt. Documented heuristics only. Users may paste source that references sops — this plugin does not depend on or execute those binaries, and never outputs decrypted secret values.

## Tools

| Tool | Purpose |
|------|---------|
| `sops_files_list` | sops-encrypted file markers / path hints → `[{path?, format?}]` |
| `sops_keys_hint` | pgp / age / kms / gcp_kms / azure_kv / hc_vault → `[{method, count}]` |
| `sops_rules_hint` | creation_rules / path_regex / encrypted_regex / mac / lastmodified / version → `[{method, count}]` |
| `sops_lint_lite` | plaintext_secretish, missing_creation_rules, empty_file, age_and_pgp_mixed, path_regex_too_broad → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, sops CLI execution, or decryption for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML/JSON AST. Supported loosely: `#` comments stripped for flag / keyword counts; simple `'/"/` string literals; common SOPS metadata / key-type / creation_rules keywords. Never returns decrypted or plaintext secret *values* in tool output (structure/metadata only; long key material redacted to short prefixes).
- Does not run sops CLI, does not decrypt, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/sops-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/sops-lab`

## Skills

- **sops-files** — list encrypted file markers / path hints and key/rules method counts from pasted config
- **sops-lint** — lite heuristic findings for SOPS config / encryption smells

## License

MIT © Lawrence Hutchins — FREE
