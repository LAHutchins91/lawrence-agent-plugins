# Capacitor Config Lab

Zero-auth **local** MCP tools for **capacitor.config text**: appId / appName / webDir, plugins inventory, server URL / schemes, and heuristic lite lint. No `capacitor` / `cap` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Capacitor config text** workflows — JSON or JS/TS `capacitor.config` — covering app identity, plugin keys, live-reload server hints, and educational smell heuristics without invoking the Capacitor CLI.

## Tools

| Tool | Purpose |
|------|---------|
| `cap_app_id` | config text → `{ appId?, appName?, webDir?, bundledWebRuntime? }` |
| `cap_plugins_list` | config text → `{ plugins, count, pluginConfig? }` |
| `cap_server_url_hint` | config text → `{ server?, androidScheme?, iosScheme? }` |
| `cap_lint_lite` | config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Capacitor, never opens files on disk or over the network.
- `capacitor.config.ts` / `.js` text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, dynamic imports, and function-returned configs are not fully resolved.
- Lint rules are educational heuristics (empty, missing appId/webDir, cleartext tip, localhost server smell, JS no-eval limits) — **not** an exploit guide.

## Start

```bash
node /workspace/capacitor-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/capacitor-config-lab`

## Skills

- **cap-app-plugins** — appId/webDir + plugins list
- **cap-server-lint** — server/schemes + lite lint

## License

MIT © Lawrence Hutchins
