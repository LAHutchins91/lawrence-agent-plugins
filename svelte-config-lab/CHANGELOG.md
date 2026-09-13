# Changelog

All notable changes to **svelte-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `svelte_preprocess_list` for `preprocess: […]` / `vitePreprocess()` → `{nameOrCall}`.
- Add `svelte_kit_adapter_hint` for `kit.adapter` → `{adapterCall?, notes}`.
- Add `svelte_vite_plugins_hint` for `vite.plugins` / `kit.vite.plugins` heuristics → `{nameOrCall}`.
- Add `svelte_lint_lite` for missing `kit.adapter` (SvelteKit), empty preprocess, csrf/checkOrigin notes if present, and alias hints.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no svelte/vite binary for tool logic. Lite JS/TS config scanner (`svelte.config.*` / `const config` / module.exports / export default); ~1MB input cap. Document limits. FREE MIT.
