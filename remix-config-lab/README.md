# Remix Config Lab

Zero-auth **local** MCP tools for **remix.config / vite remix({…}) text**: routes & publicPath hints, server build fields, `future` flags, and heuristic lite lint. No `remix` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Remix config text** workflows — classic `AppConfig` and Vite `remix()` / `vitePlugin` options — covering route dirs, server build targets, future flags, and educational smell heuristics without invoking Remix.

## Tools

| Tool | Purpose |
|------|---------|
| `remix_routes_hint` | config text → `{ appDirectory?, routes?, ignoredRouteFiles?, assetsBuildDirectory?, publicPath? }` |
| `remix_server_build_hint` | config text → `{ serverBuildPath?, serverModuleFormat?, serverPlatform?, server?, serverBuildTarget? }` |
| `remix_future_flags` | config text → `{ future, keys }` |
| `remix_lint_lite` | config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Remix, never opens files on disk or over the network.
- `remix.config.js` / `.ts` and Vite `remix({…})` / `vitePlugin({…})` text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, dynamic imports, and function-returned configs are not fully resolved.
- Lint rules are educational heuristics (empty, deprecated classic config, conflicting flags, missing appDirectory, JS no-eval limits) — **not** an exploit guide.

## Start

```bash
node /workspace/remix-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/remix-config-lab`

## Skills

- **remix-routes-server** — routes hint + server build hint
- **remix-future-lint** — future flags + lite lint

## License

MIT © Lawrence Hutchins
