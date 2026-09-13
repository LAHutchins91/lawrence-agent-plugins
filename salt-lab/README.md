# Salt Lab

Zero-auth **local** MCP tools for **Salt** state/pillar YAML text: state ID/module inventory, pillar key hints, grain-ref detection, and educational lite lint. **YAML/string** heuristics only — no salt CLI, no minion/master, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Salt SLS/pillar** workflows — state IDs and modules (`pkg.installed`, `service.running`, `file.managed`, `cmd.run`), pillar keys / `{% pillar %}` / `pillar.get` with secret/password/token *key-name* flags, grain refs (`grains[...]`, `grains.get`, `salt['grains.get']`), and quick smell heuristics without installing Salt or talking to a master/minion.

## Tools

| Tool | Purpose |
|------|---------|
| `salt_states_list` | SLS text → `{ states: [{id?, module?, fun?}], count }` |
| `salt_pillars_hint` | Pillar/SLS text → `{ pillars: string[], secretKeyNames?, count }` |
| `salt_grains_hint` | Text → `{ grains: string[], count }` |
| `salt_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **YAML/string analysis only** — never runs `salt` / `salt-call` / `salt-run`, never talks to a master or minion, never opens paths on disk, never evaluates Jinja/Python, never talks to a network.
- Not a Salt renderer — complex Jinja, requisites graphs, and dynamic `state.apply` may be under-parsed.
- States: top-level state IDs mapped to `module.function` declarations (e.g. `pkg.installed`).
- Pillars: YAML keys + Jinja/`pillar.get` refs; secret/password/token flags are **key-name heuristics only** (never values).
- Grains: `grains[...]`, `grains.get`, `salt['grains.get']`, Jinja grain refs.
- Lint rules are educational heuristics (empty, missing state module, plaintext password tips, `cmd.run` without `unless`/`creates`, `pkg.latest` tip) — **not** an exploit guide.

## Start

```bash
node /workspace/salt-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/salt-lab`

## Skills

- **salt-states-pillars** — state ID/module inventory + pillar key hints
- **salt-grains-lint** — grain-ref hints + lite lint

## License

MIT © Lawrence Hutchins
