# Expo Config Lab

Zero-auth **local** MCP tools for **Expo app.json / app.config text**: slug & name metadata, plugins inventory, deep-link schemes / bundle ids, and heuristic lite lint. No `expo` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Expo config text** workflows — nested `expo: {}` or root ExpoConfig — covering slug/name, config plugins, URL schemes, and educational smell heuristics without invoking Expo CLI.

## Tools

| Tool | Purpose |
|------|---------|
| `expo_slug_name` | config text → `{ name?, slug?, version?, orientation?, sdkVersion?, owner? }` |
| `expo_plugins_list` | config text → `{ plugins, names, count }` |
| `expo_scheme_list` | config text → `{ scheme?, schemes, iosBundleId?, androidPackage? }` |
| `expo_lint_lite` | config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Expo, never opens files on disk or over the network.
- `app.config.js` / `.ts` text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, dynamic imports, and function-returned configs are not fully resolved.
- Lint rules are educational heuristics (empty, missing slug/name, privacy/permissions tips, JS no-eval limits, `expo.extra` secrets smell) — **not** an exploit guide.

## Start

```bash
node /workspace/expo-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/expo-config-lab`

## Skills

- **expo-slug-plugins** — slug/name + plugins list
- **expo-scheme-lint** — schemes/bundle ids + lite lint

## License

MIT © Lawrence Hutchins
