# Sequelize Model Lab

Zero-auth **local** MCP tools for scanning pasted Sequelize ORM model JavaScript/TypeScript: model list (`sequelize.define` / `class extends Model` / `.init`), association hints (`hasMany` / `belongsTo` / `hasOne` / `belongsToMany`), column/attribute hints, and lite lint. Lite JS/TS scanner (same family as drizzle-schema-lab) — no sequelize CLI for tool logic, no network.

This is **not** the Sequelize CLI. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `sequelize_models_list` | `sequelize.define("Name"` / `class X extends Model` / `init(` → `[{name}]` |
| `sequelize_associations_hint` | `hasMany` / `belongsTo` / `hasOne` / `belongsToMany` → `[{type, source?, target?}]` |
| `sequelize_columns_hint` | attributes object keys / `DataTypes.*` fields → `[{model?, columns[]}]` |
| `sequelize_lint_lite` | missing primaryKey, timestamps false note, underscored mixed, duplicate model names → `{findings[]}` |

## Limits

- Pasted model source text you already have. No sockets, DNS, remote fetches, or sequelize CLI for tool logic (`sequelize` / `sequelize-cli` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST (no Babel/TypeScript/Oxc). Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; balanced `{}/()/[]` extraction; common `define` / `init` / association calls. Not supported / incomplete: spreads, imported attribute maps, computed keys, `satisfies`/`as` casts, dynamic `require`/`import`, cross-file re-exports, fully evaluating `associate(models)` factories.
- Does not migrate, sync, talk to a database, or execute model modules.
- FREE MIT.

## Start

```bash
node /workspace/sequelize-model-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/sequelize-model-lab`

## Skills

- **sequelize-models** — list models, associations, and column hints from pasted source
- **sequelize-lint** — lite heuristic findings on Sequelize models

## License

MIT © Lawrence Hutchins — FREE
