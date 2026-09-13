# Terragrunt Lab

Zero-auth **local** MCP tools for **Terragrunt** HCL *heuristics*: top-level block inventory (`terraform` / `remote_state` / `inputs` / `locals` / `generate` / `catalog`), include / `find_in_parent_folders` path hints, dependency / dependencies hints, and educational lite lint. **String/regex** heuristics only — no terragrunt CLI, no terraform apply, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Terragrunt HCL** workflows — block inventory, include / parent-folder path hints, `dependency` / `dependencies` config paths, plus quick smell heuristics without installing Terragrunt or talking to a backend.

## Tools

| Tool | Purpose |
|------|---------|
| `terragrunt_blocks_list` | HCL text → `{ blocks: [{type, name?}], count }` |
| `terragrunt_includes_hint` | Text → `{ includes: [{name?, path?}], count }` |
| `terragrunt_deps_hint` | Text → `{ deps: [{name?, configPath?}], count }` |
| `terragrunt_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL string analysis only** — never runs `terragrunt` / `terraform`, never applies, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- **Never invents or decodes credentials** — flags key *names* / smell patterns only, never secret values.
- Not a Terragrunt engine — nested includes, complex `find_in_parent_folders` args, and dynamic `generate` may be under-parsed.
- Lint rules are educational heuristics (empty, missing terraform source, plaintext secrets in inputs, hard-coded backend tip) — **not** an exploit guide.

## Start

```bash
node /workspace/terragrunt-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/terragrunt-lab`

## Skills

- **terragrunt-blocks-includes** — top-level block inventory + include / find_in_parent_folders path hints
- **terragrunt-deps-lint** — dependency / dependencies hints + lite lint

## License

MIT © Lawrence Hutchins
