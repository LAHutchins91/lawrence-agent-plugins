# Babel Config Lab

Zero-auth **local** MCP tools for **babel config text**: list presets, plugins, env/targets, and heuristic lite lint. No `@babel/core` / `babel` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Babel config text** workflows — preset/plugin inventory, `@babel/preset-env` targets / `env` blocks, and quick educational smell heuristics without invoking Babel.

## Tools

| Tool | Purpose |
|------|---------|
| `babel_presets_list` | babel config text → `{ presets, names, count }` |
| `babel_plugins_list` | babel config text → `{ plugins, names, count }` |
| `babel_env_targets` | babel config text → `{ targets?, browserslist?, env?, envKeys }` |
| `babel_lint_lite` | babel config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Babel, never opens files on disk or over the network.
- Prefer **JSON/JSONC** (`.babelrc`, `babel.config.json`). `babel.config.js` / `.babelrc.js` / `.mjs` / `.cjs` text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, `require()` resolution, and function-returned dynamic configs are not fully resolved.
- Preset/plugin names come from strings, `[name, options]` tuples, and call/require heuristics inside `presets` / `plugins` arrays.
- If paste is a full `package.json`, the `"babel"` key is unwrapped when present.
- Lint rules are educational heuristics (empty, missing presets, duplicate plugins, stage-0 legacy, `modules: false` tips, package.json unwrap, JS no-eval limits) — **not** an exploit guide.

## Start

```bash
node /workspace/babel-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/babel-config-lab`

## Skills

- **babel-presets-plugins** — presets + plugins lists
- **babel-env-lint** — env/targets + lite lint

## License

MIT © Lawrence Hutchins
