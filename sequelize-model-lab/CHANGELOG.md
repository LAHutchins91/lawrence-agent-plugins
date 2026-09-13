# Changelog

All notable changes to **sequelize-model-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `sequelize_models_list` for `sequelize.define("Name", …)` / `class X extends Model` / `X.init(` → `[{name}]`.
- Add `sequelize_associations_hint` for `hasMany` / `belongsTo` / `hasOne` / `belongsToMany` → `[{type, source?, target?}]`.
- Add `sequelize_columns_hint` for attributes object keys / `DataTypes.*` fields → `[{model?, columns[]}]`.
- Add `sequelize_lint_lite` for missing primaryKey, timestamps false note, underscored mixed, and duplicate model names.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no sequelize CLI. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
