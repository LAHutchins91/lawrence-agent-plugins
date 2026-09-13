# Changelog

All notable changes to **graphql-sdl-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `sdl_parse_types` for SDL → `{kind, name, implements?}`.
- Add `sdl_list_fields` for object/interface/input field lists with args.
- Add `sdl_find_type` for type block summary lookup.
- Add `sdl_lint_lite` for Query/Mutation roots, duplicates, empty bodies, reserved-name clashes.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network. Lite SDL scanner (not a full GraphQL spec parser); ~1MB input cap. Document limits.
