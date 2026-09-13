# Changelog

All notable changes to **gemfile-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `gemfile_gems_list` for Gemfile text → `{name, version?, groups?, require?, git?, path?}` from `gem` calls.
- Add `gemfile_groups` for `group :x, :y do … end` → `{name, gems[]}`.
- Add `gemfile_sources` for `source 'url'` lines → `{url}`.
- Add `gemfile_lint_lite` for missing source, git gems without ref/tag/branch notes, duplicate gem names, and ruby version directive presence info.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no bundler, no ruby. Lite Ruby DSL line scanner (not Bundler / not Ruby eval); ~1MB input cap. Document limits.
