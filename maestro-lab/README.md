# Maestro Lab

Zero-auth **local** MCP tools for **Maestro YAML flow text**: top-level flow meta + ordered steps, command frequency hints, selector hints (`id` / `text` / `point`), and heuristic lite lint. No Maestro CLI. No device/emulator. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Maestro** flow workflows — listing `appId`/`name`/`tags` and ordered commands, selector forms on `tapOn`/`assertVisible`, and educational smell heuristics without launching a device.

## Tools

| Tool | Purpose |
|------|---------|
| `ma_flows_list` | flow YAML text → `{ appId?, name?, tags?, steps, count }` |
| `ma_commands_hint` | flow YAML text → `{ commands: [{name, count}], total }` |
| `ma_selectors_hint` | flow YAML text → `{ selectors: [{kind, value?}], count }` |
| `ma_lint_lite` | flow YAML text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports Maestro runtime, never opens files on disk or over the network, never talks to a device/emulator, never evaluates `evalScript` bodies.
- Uses the `yaml` npm package (YAML 1.2) for parse — best-effort heuristics on common Maestro flow shapes (`appId` + `---` + command list). Not a full Maestro schema validator.
- Lint rules are educational heuristics (empty, missing `appId`, hardcoded coordinates tip, missing assert after navigation tip, `evalScript` overuse, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/maestro-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/maestro-lab`

## Skills

- **ma-flows-commands** — flow meta/steps list + command frequency
- **ma-selectors-lint** — selector hints + lite lint

## License

MIT © Lawrence Hutchins
