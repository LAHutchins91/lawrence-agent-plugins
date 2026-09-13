# Packer Lab

Zero-auth **local** MCP tools for **Packer** HCL/JSON text: build/source inventory, source label hints, provisioner/post-processor extraction, and educational lite lint. **String/regex** heuristics only — no packer CLI, no build/deploy, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Packer** template workflows — `source`/`build` blocks (amazon-ebs, docker, qemu, …), source label hints (`ami_name`, `image`, `iso_url`), provisioners (shell, ansible, file, powershell) and post-processors, plus quick smell heuristics without installing Packer or building images.

## Tools

| Tool | Purpose |
|------|---------|
| `packer_builds_list` | HCL/JSON text → `{ builds: [{name?, type?, sources?}], count }` |
| `packer_sources_hint` | Text → `{ sources: [{type?, name?, labels?}], count }` |
| `packer_provisioners_hint` | Text → `{ provisioners: [{type?, only?}], postProcessors?, count }` |
| `packer_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL/JSON string analysis only** — never runs `packer`, never builds or deploys images, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- Not a Packer engine — complex nested blocks, dynamic sources, and plugins may be under-parsed.
- Builds: HCL2 `source`/`build` blocks and legacy JSON `builders`.
- Sources: type/name plus label hints (`ami_name`, `image`, `iso_url`, …).
- Provisioners: `provisioner "type"` and `post-processor "type"` (plus JSON equivalents).
- Lint rules are educational heuristics (empty, missing source/build, plaintext password tips, insecure communicator tip, `:latest` tags) — **not** an exploit guide.

## Start

```bash
node /workspace/packer-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/packer-lab`

## Skills

- **packer-builds-sources** — build/source inventory + source label hints
- **packer-provisioners-lint** — provisioner/post-processor hints + lite lint

## License

MIT © Lawrence Hutchins
