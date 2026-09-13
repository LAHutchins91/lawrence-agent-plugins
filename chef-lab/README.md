# Chef Lab

Zero-auth **local** MCP tools for **Chef** cookbook/recipe Ruby DSL text: cookbook inventory, recipe resource hints, attribute/secret-key-name extraction, and educational lite lint. **Ruby DSL string** heuristics only — no Chef CLI, no knife, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Chef cookbook** workflows — `metadata.rb` / Policyfile / Berksfile name/version/depends/supports, recipe resources (`package`, `service`, `template`, `file`, `directory`, `execute`, `include_recipe`), attributes (`default[...]` / `node[...]`) with secret/password/token *key-name* flags, and quick smell heuristics without installing Chef or calling knife.

## Tools

| Tool | Purpose |
|------|---------|
| `chef_cookbooks_list` | Metadata/Policyfile/Berksfile text → `{ cookbooks: [{name?, version?, depends?}], count }` |
| `chef_recipes_hint` | Recipe text → `{ resources: [{type?, name?}], includes?: string[], count }` |
| `chef_attrs_hint` | Attributes text → `{ attrs: string[], secretKeyNames?, count }` |
| `chef_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **Ruby DSL string analysis only** — never runs `chef` / `knife` / `chef-client`, never opens paths on disk, never evaluates Ruby, never talks to a network.
- Not a Ruby interpreter — complex metaprogramming, libraries, and dynamic resource names may be under-parsed.
- Cookbooks: `name` / `version` / `depends` / `supports` from metadata-style text; `cookbook` lines from Berksfile/Policyfile.
- Recipes: common resources + `include_recipe`; custom LWRP-ish `foo_bar 'name' do` lightly detected.
- Attrs: key paths from `default`/`override`/`normal`/`node[...]`; secret/password/token flags are **key-name heuristics only** (never values).
- Lint rules are educational heuristics (empty, missing metadata name/version, plaintext password tips, `execute` without guards, `:latest` package tip) — **not** an exploit guide.

## Start

```bash
node /workspace/chef-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/chef-lab`

## Skills

- **chef-cookbooks-recipes** — cookbook inventory + recipe resource hints
- **chef-attrs-lint** — attribute/secret-key-name hints + lite lint

## License

MIT © Lawrence Hutchins
