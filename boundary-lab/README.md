# Boundary Lab

Zero-auth **local** MCP tools for **Boundary** HCL/config *heuristics*: scope inventory (global/org/project), auth-method hints (password/oidc/ldap), target/host-set/host extraction, and educational lite lint. **String/regex** heuristics only — no boundary CLI, no controller/worker, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Boundary** config workflows — scopes (global/org/project), auth methods (password/oidc/ldap), targets/hosts (`type = "tcp"`, address/port hints), plus quick smell heuristics without installing Boundary or talking to a controller.

## Tools

| Tool | Purpose |
|------|---------|
| `boundary_scopes_list` | HCL/config text → `{ scopes: [{name?, type?, id?}], count }` |
| `boundary_auths_hint` | Text → `{ auths: string[], count }` |
| `boundary_targets_hint` | Text → `{ targets: [{name?, type?, address?}], count }` |
| `boundary_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL string analysis only** — never runs `boundary`, never talks to a controller/worker, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- **Never invents or decodes credentials** — flags key *names* only (e.g. a `password =` attribute), never secret values.
- Not a Boundary engine — complex nested Terraform modules, dynamic host catalogs, and API responses may be under-parsed.
- Lint rules are educational heuristics (empty, missing scope/target, plaintext password, wildcard address tip, insecure listener tip) — **not** an exploit guide.

## Start

```bash
node /workspace/boundary-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/boundary-lab`

## Skills

- **boundary-scopes-auths** — scope inventory (global/org/project) + auth-method hints
- **boundary-targets-lint** — targets/host sets/hosts + lite lint

## License

MIT © Lawrence Hutchins
