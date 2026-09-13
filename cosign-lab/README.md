# Cosign Lab

Zero-auth **local** MCP tools for scanning pasted **Cosign** config and CI snippets: sign listings (`sign` / `sign-blob` / `dockerfile`), verify hints (`verify` / `verify-blob` / `--certificate-identity` / `--certificate-oidc-issuer` / `--key`), attest hints (`attest` / `attach` / `predicate` / `--type` / `slsaprovenance` / `spdx` / `cyclonedx`), and lite lint. Lite scanner (same family as syft-lab / grype-lab) — **never runs cosign CLI**, no network.

This is **not** the Cosign CLI or Sigstore. Documented heuristics only. Users may paste source that references cosign — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `cosign_signs_list` | sign / sign-blob / dockerfile refs from config/CI → `[{kind?, target?}]` |
| `cosign_verify_hint` | verify / verify_blob / certificate_identity / certificate_oidc_issuer / key → `[{method, count}]` |
| `cosign_attest_hint` | attest / attach / predicate / type / slsaprovenance / spdx / cyclonedx → `[{method, count}]` |
| `cosign_lint_lite` | sign without verify, insecure registry, empty file, keyless without issuer, private key in repo → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or cosign CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped for flag / keyword counts; simple `'/"/` string literals; common Cosign sign / verify / attest keywords. Sign kinds and type names like `spdx` are also read from comments. Not supported / incomplete: type system, official signing, remote verify / `cosign sign`.
- Does not run cosign CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/cosign-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cosign-lab`

## Skills

- **cosign-signs** — list sign / sign-blob / dockerfile refs and verify/attest method counts from pasted config/CI
- **cosign-lint** — lite heuristic findings for Cosign signing / verify smells

## License

MIT © Lawrence Hutchins — FREE
