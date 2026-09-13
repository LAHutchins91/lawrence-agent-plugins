# Puppet Lab

Zero-auth **local** MCP tools for **Puppet** manifest/module text: class/define inventory, module-ref hints, parameter/secret-key-name extraction, and educational lite lint. **Manifest string** heuristics only — no Puppet CLI, no agent/apply, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Puppet manifest** workflows — `class` / `define` names, module refs (`include` / `require` / `contain`, `class { 'foo': }`, metadata.json, Puppetfile `mod`), class parameters with `$facts`/`$trusted` and secret/password/token *key-name* flags, and quick smell heuristics without installing Puppet or running agent/apply.

## Tools

| Tool | Purpose |
|------|---------|
| `puppet_classes_list` | Manifest text → `{ classes: [{name, kind?}], count }` |
| `puppet_modules_hint` | Manifest / Puppetfile / metadata.json → `{ modules: string[], count }` |
| `puppet_params_hint` | Class/define text → `{ params: string[], secretKeyNames?, count }` |
| `puppet_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **Manifest string analysis only** — never runs `puppet` / `puppet apply` / agent, never opens paths on disk, never evaluates Puppet DSL, never talks to a network.
- Not a Puppet parser — complex lambdas, EPP, and dynamic titles may be under-parsed.
- Classes: `class` / `define` name + kind heuristics.
- Modules: `include`/`require`/`contain`, resource-style `class { }`, Puppetfile `mod`, metadata.json name/dependencies.
- Params: signature `$param` names + `$facts`/`$trusted` usage; secret/password/token flags are **key-name heuristics only** (never values).
- Lint rules are educational heuristics (empty, missing class, plaintext password tips, `exec` without guards, `ensure => latest` package tip) — **not** an exploit guide.

## Start

```bash
node /workspace/puppet-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/puppet-lab`

## Skills

- **puppet-classes-modules** — class/define inventory + module-ref hints
- **puppet-params-lint** — parameter/secret-key-name hints + lite lint

## License

MIT © Lawrence Hutchins
