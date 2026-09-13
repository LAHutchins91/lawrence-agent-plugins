# Changelog

All notable changes to **nuxt-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `nuxt_modules_list` for `modules: […]` → `{nameOrPath}` (string or `[path, options]` tuples).
- Add `nuxt_runtime_config_keys` for `runtimeConfig` / `runtimeConfig.public` keys → `{key, scope: public|private}`.
- Add `nuxt_route_rules_hint` for `routeRules` object keys → `{path, ruleKeys[]}`.
- Add `nuxt_lint_lite` for `ssr: false` note, empty modules, missing `runtimeConfig.public`, and nitro preset hints if present.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Nuxt binary for tool logic. Lite JS/TS config scanner (`nuxt.config.*` / `defineNuxtConfig` / module.exports / export default); ~1MB input cap. Document limits. FREE MIT.
