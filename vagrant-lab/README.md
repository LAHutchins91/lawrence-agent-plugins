# Vagrant Lab

Zero-auth **local** MCP tools for **Vagrantfile** Ruby DSL text: box/define inventory, provider hints, provisioner extraction, and educational lite lint. **String/regex** heuristics only — no vagrant CLI, no VM start, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Vagrantfile** workflows — `vm.box` / `vm.define` inventory, providers (virtualbox, vmware, libvirt, docker, hyperv), provisioners (shell, ansible, chef, puppet, docker, file), plus quick smell heuristics without installing Vagrant or starting VMs.

## Tools

| Tool | Purpose |
|------|---------|
| `vagrant_boxes_list` | Vagrantfile text → `{ boxes: [{name?, box?, version?}], count }` |
| `vagrant_providers_hint` | Text → `{ providers: string[], count }` |
| `vagrant_provisions_hint` | Text → `{ provisions: [{type?, name?}], count }` |
| `vagrant_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **Ruby DSL string analysis only** — never runs `vagrant`, never starts or destroys VMs, never opens paths on disk, never evaluates Ruby, never talks to a network.
- Not a Ruby interpreter — nested `do...end`, metaprogramming, and dynamic boxes may be under-parsed.
- Boxes: `vm.box` / `vm.box_version` / `vm.define` names (box_url noted in source but not a separate return field).
- Providers: `vm.provider` blocks for virtualbox, vmware, libvirt, docker, hyperv.
- Provisions: `vm.provision` types (shell, ansible, chef, puppet, docker, file) with optional `name:`.
- Lint rules are educational heuristics (empty, missing box, plaintext password tips, private_network tip, synced_folder `.` tip) — **not** an exploit guide.

## Start

```bash
node /workspace/vagrant-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/vagrant-lab`

## Skills

- **vagrant-boxes-providers** — box/define inventory + provider hints
- **vagrant-provisions-lint** — provisioner hints + lite lint

## License

MIT © Lawrence Hutchins
