# Syft Lab

Zero-auth **local** MCP tools for scanning pasted **Syft** SBOM config and CI snippets: scan listings (`dir` / `image` / `file` / `oci-dir` / `singularity`), format hints (`spdx-json` / `cyclonedx-json` / `syft-json` / `table` / `text` / `--output` / `-o`), scope hints (`squashed` / `all-layers` / `scope` / `--scope` / `catalogers` / `package`), and lite lint. Lite scanner (same family as grype-lab / trivy-lab) — **never runs syft CLI**, no network.

This is **not** the Syft CLI or Anchore. Documented heuristics only. Users may paste source that references syft — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `syft_scans_list` | dir / image / file / oci-dir / singularity scans from config/CI → `[{kind?, target?}]` |
| `syft_formats_hint` | spdx_json / cyclonedx_json / syft_json / table / text / output / o_flag → `[{method, count}]` |
| `syft_scope_hint` | squashed / all_layers / scope / scope_flag / catalogers / package → `[{method, count}]` |
| `syft_lint_lite` | missing output format, table-only CI, empty file, all-layers heavy, stdout-only → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or syft CLI execution for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `#` comments stripped for scope / table / text counts; simple `'/"/` string literals; common Syft scan / format / scope keywords. Scan kinds and format names like `spdx-json` are also read from comments. Not supported / incomplete: type system, official SBOM generation, remote scan / `syft image`.
- Does not run syft CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/syft-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/syft-lab`

## Skills

- **syft-scans** — list dir / image / file / oci-dir / singularity scans and format/scope method counts from pasted config/CI
- **syft-lint** — lite heuristic findings for SBOM output / scope smells

## License

MIT © Lawrence Hutchins — FREE
