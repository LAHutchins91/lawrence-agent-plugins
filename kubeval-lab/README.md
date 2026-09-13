# Kubeval Lab

Zero-auth **local** MCP tools for **kubeval** CLI-flags / config *heuristics*: schema-location inventory, strict / ignore-missing-schemas / quiet / force-color hints, kubernetes / OpenShift version hints, and educational lite lint. **String / YAML / flag** analysis only — no kubeval CLI, no network schema fetch, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **kubeval flags/config** workflows — `--schema-location`, `--kubernetes-version` / `-v`, `--openshift`, `--strict` / `--quiet`, plus quick smell heuristics without installing kubeval or fetching schemas. Distinct from kubeconform-oriented tooling.

## Tools

| Tool | Purpose |
|------|---------|
| `kubeval_schemas_list` | Text → `{ schemas: [{location?}], count }` |
| `kubeval_strict_hint` | Text → `{ strict?: boolean, ignoreMissingSchemas?: boolean, quiet?: boolean }` |
| `kubeval_versions_hint` | Text → `{ kubernetesVersion?, openshift?: boolean }` |
| `kubeval_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML / flag heuristics only** — never runs `kubeval`, never opens paths on disk, never fetches schemas, never evaluates expressions, never talks to a cluster or network.
- Not a kubeval engine — nested / partial YAML and exotic flag quoting may be under-parsed.
- Lint rules are educational heuristics (empty, missing schema location, missing k8s version tip, plaintext token in schema URL tip) — **not** an exploit guide.
- Never invents credentials or attack steps.

## Start

```bash
node /workspace/kubeval-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/kubeval-lab`

## Skills

- **kubeval-schemas-versions** — schema-location inventory + kubernetes / OpenShift version hints
- **kubeval-strict-lint** — strict / quiet / ignore-missing-schemas hints + lite lint

## License

MIT © Lawrence Hutchins
