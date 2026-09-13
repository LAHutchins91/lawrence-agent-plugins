# Ansible Lab

Zero-auth **local** MCP tools for **Ansible** playbook/role YAML text: play inventory, role hints, vars/secret-key-name extraction, and educational lite lint. **YAML string** heuristics only — no ansible CLI, no SSH, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Ansible playbook** workflows — play `name`/`hosts`/`become`/`gather_facts`, roles via `roles:` / `import_role` / `include_role`, vars / `vars_files` / `set_fact` key names (flagging secret/password/token *names* only), and quick smell heuristics without installing Ansible or opening SSH.

## Tools

| Tool | Purpose |
|------|---------|
| `ansible_plays_list` | Playbook text → `{ plays: [{name?, hosts?, become?, gatherFacts?}], count }` |
| `ansible_roles_hint` | Playbook text → `{ roles: string[], count }` |
| `ansible_vars_hint` | Playbook text → `{ vars: string[], secretKeyNames?, varsFiles?, count }` |
| `ansible_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **YAML string analysis only** — never runs `ansible` / `ansible-playbook`, never opens SSH, never opens paths on disk, never evaluates code, never talks to a network.
- Not an Ansible engine — Jinja2 templating, vault, dynamic inventories, and complex nested includes may be under-parsed.
- Roles: `roles:` list entries, `import_role` / `include_role` task modules, and `role:` name fields.
- Vars: key names from `vars` / `vars_files` / `set_fact`; secret/password/token flags are **key-name heuristics only** (never values).
- Lint rules are educational heuristics (empty, missing hosts, shell/command without `creates`, plaintext password tips, become without become_user tip, hosts `all` with dangerous modules tip) — **not** an exploit guide.

## Start

```bash
node /workspace/ansible-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/ansible-lab`

## Skills

- **ansible-plays-roles** — play inventory + role hints
- **ansible-vars-lint** — vars/secret-key-name hints + lite lint

## License

MIT © Lawrence Hutchins
