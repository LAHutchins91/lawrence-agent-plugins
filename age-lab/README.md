# age Lab

Zero-auth **local** MCP tools for scanning pasted **age** encryption config and scripts: public recipients (`age1…` truncated), identity path hints (`-i` / identity files; `AGE-SECRET-KEY-` markers counted & redacted only), armor / recipients-file / encrypt / decrypt / passphrase rule hints, and lite lint. Lite scanner (same family as sops-lab / cosign-lab) — **never runs age/age-keygen CLI**, **never decrypts**, **never returns private keys or secret values**, no network.

This is **not** the age CLI or FiloSottile/age decrypt. Documented heuristics only. Users may paste source that references age — this plugin does not depend on or execute those binaries, and never outputs private keys or secret values (only truncated public recipient prefixes, identity *file path* hints, and armor headers).

## Tools

| Tool | Purpose |
|------|---------|
| `age_recipients_list` | age1 public recipients / -r flags → `[{prefix?}]` (truncated ~12 chars + …) |
| `age_identities_hint` | identity_flag / identity_file / secret_key_marker (count only) / ssh_recipient → `[{method, count}]` |
| `age_rules_hint` | armor / armor_flag / recipients_file / encrypt / decrypt / passphrase → `[{method, count}]` |
| `age_lint_lite` | private_key_in_paste, encrypt_without_recipient, empty_file, passphrase_flag, decrypt_in_ci → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, age CLI execution, or decryption for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full shell/YAML AST. Supported loosely: `#` comments stripped for flag / keyword counts; simple `'/"/` string literals; common age recipient / identity / rule keywords. Never returns private keys or secret *values* in tool output (structure/metadata only; public `age1…` truncated to short prefixes; `AGE-SECRET-KEY-` counted & redacted only).
- Does not run age/age-keygen CLI, does not decrypt, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/age-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/age-lab`

## Skills

- **age-recipients** — list public recipient prefixes and identity/rules method counts from pasted config
- **age-lint** — lite heuristic findings for age encryption config / script smells

## License

MIT © Lawrence Hutchins — FREE
