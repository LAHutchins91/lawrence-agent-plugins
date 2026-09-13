# Frontmatter Lab

Zero-auth **local** MCP tools for Markdown / text YAML frontmatter: extract, merge keys, validate required/forbidden keys, and strip. No network — pasted document text only. Uses a lightweight YAML subset (`yaml` package) for scalars, simple nested maps, and arrays of scalars.

## Why novel

A focused frontmatter companion for agents editing Markdown docs, Hugo/Jekyll posts, and skill files — split `---` blocks, patch metadata, and gate required keys without leaving the editor.

## Tools

| Tool | Purpose |
|------|---------|
| `fm_extract` | Document → `{frontmatter, body, rawFm, hasFrontmatter}` |
| `fm_merge` | Document + patch object → new document with FM keys merged |
| `fm_validate_keys` | Document + `required[]` + `forbidden[]` → `{ok, missing[], forbiddenPresent[], extra?}` |
| `fm_strip` | Remove frontmatter → `{body, hadFrontmatter}` |

## Limits

- Max document size: **512 KiB** UTF-8.
- Max frontmatter block: **64 KiB**.
- YAML subset: maps, scalars (string/number/boolean/null), arrays of scalars; nested maps OK. Avoid anchors, tags, multi-doc streams, and complex custom types.
- Opening delimiter must be the first non-empty line starting with `---` (standard Markdown FM). Closing `---` ends the block.

## Start

```bash
node /workspace/frontmatter-lab/dist/bundle.js
```

## Skills

- **fm-extract** — extract or strip YAML frontmatter from Markdown
- **fm-validate** — merge patches and validate required/forbidden keys

## License

MIT © Lawrence Hutchins — FREE
