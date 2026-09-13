# Buf Lab

Zero-auth **local** MCP tools for scanning pasted **buf** config (`buf.yaml` / `buf.work.yaml` / `buf.gen.yaml`): module listings (`name:` / `path:` / `modules:`), deps hints (`buf.build/...`), lint config counts (`use:` / `except:` / `ignore:` / `enum_zero_value_suffix` / `rpc_allow_same_request_response` / `SERVICE_SUFFIX` / breaking), and lite lint. Lite scanner (same family as ghz-lab / fortio-lab / protobuf-lite-lab) — **never runs the buf CLI or fetches modules**, no network.

This is **not** the buf CLI or a remote module client. Documented heuristics only. Users may paste source that references `buf` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `buf_modules_list` | `name:` / `path:` / `modules:` → `[{name?, path?}]` |
| `buf_deps_hint` | `deps:` (`buf.build/...`) → `[{module?}]` |
| `buf_lint_cfg_hint` | `use:` / `except:` / `ignore:` / rule tokens / `breaking` → `[{method, count}]` |
| `buf_lint_lite` | missing `name:`, deps without `buf.lock`, many `except:`, empty file, `buf.gen.yaml` without `plugins:` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, buf execution, or module downloads for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full YAML AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common buf.yaml / buf.gen.yaml keys. Not supported / incomplete: anchors/aliases merged, multi-doc merge, remote module resolution.
- Does not run buf or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/buf-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/buf-lab`

## Skills

- **buf-modules** — list module name/path and deps hints from pasted buf source
- **buf-lint** — lint config listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
