# Vault Lab

Zero-auth **local** MCP tools for **Vault** HCL policy / auth / secrets-engine *config* heuristics: policy path inventory, auth-method hints, secrets-engine mount/type hints, and educational lite lint. **String/regex** heuristics only — no vault CLI, no server, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Vault** policy workflows — `path "..." { capabilities = [...] }`, auth method detection (userpass/approle/kubernetes/github/jwt/oidc/ldap/aws), secrets-engine mounts (kv/kv-v2/database/pki/transit/aws), plus quick smell heuristics without installing Vault or talking to a server.

## Tools

| Tool | Purpose |
|------|---------|
| `vault_policies_list` | HCL text → `{ policies: [{path?, capabilities?}], count }` |
| `vault_auths_hint` | Text → `{ auths: string[], count }` |
| `vault_secrets_hint` | Text → `{ engines: [{type?, path?}], count }` (mount paths/types only) |
| `vault_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL string analysis only** — never runs `vault`, never talks to a server, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- **Never invents or decodes secrets** — flags path/capability patterns and secret-*engine* mount names / key *names* only.
- Not a Vault engine — complex nested Sentinel/ACL, dynamic secrets, and API responses may be under-parsed.
- Lint rules are educational heuristics (empty, missing path block, overly broad `path "*"`, sudo tip, plaintext root token tip, `disable_mlock` tip) — **not** an exploit guide and **does not** teach how to bypass ACLs.

## Start

```bash
node /workspace/vault-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/vault-lab`

## Skills

- **vault-policies-auths** — policy path/capabilities inventory + auth-method hints
- **vault-secrets-lint** — secrets-engine mounts + lite lint

## License

MIT © Lawrence Hutchins
