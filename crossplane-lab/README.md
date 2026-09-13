# Crossplane Lab

Zero-auth **local** MCP tools for scanning pasted **Crossplane** YAML: Composition / CompositeResourceDefinition (XRD) listings, Provider hints (`Provider` / `ProviderConfig` / `ControllerConfig` / `DeploymentRuntimeConfig` / `package:` / `pkg.crossplane.io`), claim hints (`claimNames` / `compositeRef` / `resourceRef` / `connectionSecretRef` / `writeConnectionSecretToRef` / `compositionRef` / `compositionSelector`), and lite lint. Lite scanner (same family as flux-lab / argocd-lab) — **never runs crossplane or kubectl, never fetches remote packages**, no network.

This is **not** a crossplane CLI or kubectl. Documented heuristics only. Users may paste source that references Crossplane — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `xp_composites_list` | Composition / CompositeResourceDefinition → `[{kind?, name?}]` |
| `xp_providers_hint` | Provider / ProviderConfig / ControllerConfig / DeploymentRuntimeConfig / package: / pkg.crossplane.io → `[{method, count}]` |
| `xp_claims_hint` | claimNames / compositeRef / resourceRef / connectionSecretRef / writeConnectionSecretToRef / compositionRef / compositionSelector → `[{method, count}]` |
| `xp_lint_lite` | missing compositionRef/compositionSelector, XRD without claimNames, Provider without ProviderConfig, empty file, insecure `package: http://` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, crossplane execution, or kubectl for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped; simple `'/"/` string literals; common Crossplane YAML keys. Not supported / incomplete: anchors/aliases, full multi-doc merge, remote package fetch.
- Does not run crossplane/kubectl or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/crossplane-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/crossplane-lab`

## Skills

- **xp-composites** — list Composition/XRD and Provider hints from pasted Crossplane YAML
- **xp-lint** — claim listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
