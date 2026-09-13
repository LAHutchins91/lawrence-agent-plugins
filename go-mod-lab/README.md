# Go Mod Lab

Zero-auth **local** MCP tools for scanning pasted `go.mod` text: extract module path + Go version, list require / replace directives, and lite lint. Lite line/block parser only — no `go` CLI, no network.

This is **not** `golang.org/x/mod/modfile` and **not** the `go` command: common `module` / `go` / `require` / `replace` / `retract` lines and parenthesized blocks are supported. MVS, `go.sum`, toolchain semantics, and `go mod tidy` are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `gomod_module_path` | go.mod text → `{module, go?}` from `module` + `go` directives |
| `gomod_require_list` | → `{requires: [{path, version, indirect?}]}` from `require` / `require()` |
| `gomod_replace_list` | → `{replaces: [{old, new, version?}]}` from `replace` directives |
| `gomod_lint_lite` | missing module, missing go directive, duplicate requires, replace without version notes, retract presence → `{findings[]}` |

## Limits

- Pasted `go.mod` text you already have. No sockets, DNS, remote fetches, or `go` CLI (`go list`, `go mod tidy`, `go mod download`, …).
- Input capped at ~1MB (`1048576` characters).
- **Lite line/block parser**: `module`, `go`, `toolchain` (recorded, unused), single-line and parenthesized `require` / `replace` / `exclude` / `retract`, `//` comments, `// indirect`, simple `"quoted"` paths, `=>` in replace. Not a full official grammar.
- No escaped newlines, limited quote/escape handling, no module-path validation, no MVS / `go.sum` / checksums.
- `godebug` / `ignore` directives are skipped. Retract intervals are recorded as raw text for presence only.
- Replace `version` is the **right-hand** (replacement) version when present; local `./` / `../` paths typically have none.

## Start

```bash
node /workspace/go-mod-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/go-mod-lab`

## Skills

- **gomod-require** — list module/go, requires, and replaces from pasted go.mod
- **gomod-lint** — lite heuristic findings on pasted go.mod

## License

MIT © Lawrence Hutchins — FREE
