# SSH Config Lab

Zero-auth **local** MCP tools for OpenSSH config parse, host-pattern resolve, lint, and redact. Config **text** analysis only — no SSH execution, sockets, DNS, filesystem walks, or private-key reads. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical OpenSSH `ssh_config` text work — parse Host blocks, apply `*` / `?` / `!negation` with first-value-wins, lint ordering and `StrictHostKeyChecking no`, and redact ProxyCommand credentials without touching the network.

## Tools

| Tool | Purpose |
|------|---------|
| `ssh_config_parse` | Config text → `{ globals, hosts, count }` |
| `ssh_host_resolve` | `{ text, host }` → `{ host, resolved, matchedBlocks }` (no connect) |
| `ssh_config_lint` | Config text → `{ findings, findingCount }` |
| `ssh_config_redact` | Config text → `{ text, redacted }` |

## Caps & caveats

- **Text analysis only** — no `ssh`, sockets, DNS, `Include` file reads, or private-key / identity-file I/O.
- Keywords are case-insensitive; comments and blank lines are ignored.
- Host matching follows OpenSSH: any positive pattern, abort on `!` negation. `Match` sections are **not** evaluated.
- First-value-wins: globals and earlier matching blocks shadow later ones. Multi-value keys such as `IdentityFile` accumulate.
- If `HostName` is unset after matching, resolve fills it with the requested host (OpenSSH default).
- Identity paths are reported in lint findings but **never opened**.
- Redaction is heuristic (ProxyCommand flags, URL userinfo, credential-like keywords/values). Harmless `HostName` / `User` / `Port` are left intact unless they look like secrets.
- This is not a substitute for `ssh -G` and does not implement every `Match` criterion.

## Start

```bash
node /workspace/ssh-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/ssh-config-lab`

## Skills

- **ssh-parse-resolve** — Parse ssh_config text and resolve Host patterns
- **ssh-lint-redact** — Lint ordering / StrictHostKeyChecking and redact ProxyCommand secrets

## License

MIT © Lawrence Hutchins
