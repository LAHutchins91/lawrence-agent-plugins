# Gemfile Lab

Zero-auth **local** MCP tools for scanning pasted `Gemfile` text: list gems (name/version/options), groups, sources, and lite lint. Lite Ruby DSL line scanner only — no Bundler, no Ruby eval, no network.

This is **not** Bundler and **not** a Ruby interpreter: common `source` / `ruby` / `gem` / `group do…end` lines are supported. `Gemfile.lock`, `bundle install`, interpolation, and `eval_gemfile` are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `gemfile_gems_list` | Gemfile text → `{gems: [{name, version?, groups?, require?, git?, path?}]}` from `gem` calls |
| `gemfile_groups` | → `{groups: [{name, gems[]}]}` from `group :x, :y do … end` |
| `gemfile_sources` | → `{sources: [{url}]}` from `source 'url'` lines |
| `gemfile_lint_lite` | missing source, git gems without ref/tag/branch, duplicate gem names, ruby version presence → `{findings[]}` |

## Limits

- Pasted `Gemfile` text you already have. No sockets, DNS, remote fetches, Bundler (`bundle install`, `bundle lock`, …), or `ruby` / `eval`.
- Input capped at ~1MB (`1048576` characters).
- **Lite Ruby DSL line scanner**: `source`, `ruby`, `gem 'name'[, 'version']`, keyword args (`require:`, `git:`, `path:`, `github:`, `branch:`, `tag:`, `ref:`), `:hash =>` rockets, `#` comments, simple comma line-continuations, `group :x, :y do … end`, nested `do`/`end` and `if`/`unless` as block counters. Not a full Ruby grammar.
- No interpolation (`#{…}`), `%q` / `%Q` / heredocs, `eval_gemfile`, `gemspec` expansion, `git_source` helpers, `install_if` / platform logic, or `Gemfile.lock`.
- `github: 'user/repo'` is mapped to a `git` URL. Pin notes look for `ref` / `tag` / `branch` (and `commit`) only.

## Start

```bash
node /workspace/gemfile-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/gemfile-lab`

## Skills

- **gemfile-gems** — list gems, groups, and sources from pasted Gemfile
- **gemfile-lint** — lite heuristic findings on pasted Gemfile

## License

MIT © Lawrence Hutchins — FREE
