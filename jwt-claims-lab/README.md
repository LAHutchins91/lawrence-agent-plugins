# JWT Claims Lab

Zero-auth **local** MCP tools for decoding JWTs (header + payload), explaining common claims, checking `exp`/`nbf` against now, and warning on risky `alg` values. **Decode only** — never verifies signatures, never mints or signs tokens. No SaaS, no API keys.

## Why novel

No zero-auth local MCP in the catalog focuses on JWT claim inspection + educational exp/nbf timing + alg hygiene warnings without any crypto verify/sign surface.

## Tools

| Tool | Purpose |
|------|---------|
| `jwt_decode` | Split + base64url-decode → `{ header, payload, claimsRedacted, note }` |
| `jwt_claims_explain` | Explain common claims from token or raw object |
| `jwt_exp_check` | Compare `exp`/`nbf` to now (ISO or epoch) |
| `jwt_alg_warn` | Educational warnings for `none`, missing alg, HS*, weird algs |

## Hard rules

- No `crypto.verify`, no signing, no key import for verification
- Secret-like claim keys redacted to `[REDACTED]`
- Signature segment is never returned or verified

## Start

```bash
node /workspace/jwt-claims-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/jwt-claims-lab`

## Skills

- **jwt-decode-explain** — Decode JWTs and explain claims
- **jwt-exp-alg-check** — Check exp/nbf and review alg warnings

## License

MIT © Lawrence Hutchins
