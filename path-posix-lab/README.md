# Path POSIX Lab

Zero-auth **local** MCP tools for POSIX path join, normalize (`.` / `..`), basename/dirname/ext, and relative paths. Uses Node `path.posix` **in-memory only** — no `fs.*`, no resolve against real disk.

## Why novel

No zero-auth local MCP in the catalog focuses on POSIX string-only path algebra (join / normalize / split / relative) without touching the filesystem.

## Tools

| Tool | Purpose |
|------|---------|
| `path_join` | POSIX join of `parts[]` → `{ path }` |
| `path_normalize` | Resolve `.` and `..` POSIX-style → `{ path }` |
| `path_basename_dirname_ext` | Split → `{ basename, dirname, ext }` |
| `path_relative` | POSIX relative from→to → `{ relative }` |

## Hard rules

- String operations only — never reads or writes the filesystem
- `path.posix` only (forward slashes); not Windows `path.win32`
- Does not call `fs.*` or `path.resolve` against `process.cwd()` / real disk

## Start

```bash
node /workspace/path-posix-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/path-posix-lab`

## Skills

- **path-join-normalize** — Join segments and normalize `.` / `..`
- **path-parts-relative** — Basename/dirname/ext and relative paths

## License

MIT © Lawrence Hutchins
