# TSConfig Lab

Zero-auth **local** MCP tools for **tsconfig.json text**: extract `compilerOptions`, map `paths`/`baseUrl`, list `extends` as declared strings, and heuristic lite lint. **String-level** JSONC analysis only — strips `//` and `/* */` comments before parse; no `tsc` exec, no filesystem extends follow. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **tsconfig.json text** workflows — compilerOptions inventory, path aliases, extends chain as declared strings, and quick educational smell heuristics without invoking the TypeScript compiler.

## Tools

| Tool | Purpose |
|------|---------|
| `tsc_compiler_options` | tsconfig text → `{ compilerOptions, keys }` |
| `tsc_paths_map` | tsconfig text → `{ baseUrl?, paths, aliases }` |
| `tsc_extends_chain` | tsconfig text → `{ extends, chain }` (declared strings only) |
| `tsc_lint_lite` | tsconfig text → `{ findings, findingCount }` |

## Caps & caveats

- **JSONC string analysis only** — never runs `tsc`, never opens extends paths on disk.
- Comment stripping handles `//` line and `/* */` block comments; strings are preserved.
- `tsc_extends_chain` reports `extends` as declared string(s) and builds a shallow chain list — **does not** fetch or merge parent configs.
- Lint rules are educational heuristics (strict false, skipLibCheck, module/moduleResolution conflicts, paths without baseUrl, allowJs without checkJs, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/tsconfig-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/tsconfig-lab`

## Skills

- **tsc-compiler-paths** — compilerOptions + paths/aliases
- **tsc-extends-lint** — extends chain listing + lite lint

## License

MIT © Lawrence Hutchins
