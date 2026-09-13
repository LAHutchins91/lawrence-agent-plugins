# Markdown TOC Lint

Zero-auth **local** MCP tools for Markdown: generate a GitHub-ish TOC, detect TOC drift, lint ATX headings, and scan links for risky hrefs. No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog combines TOC generate + marker/list drift check + heading structure lint + link safety flags in one lightweight plugin.

## Tools

| Tool | Purpose |
|------|---------|
| `md_toc_generate` | Build nested TOC + heading/slug list from ATX headings |
| `md_toc_check` | Detect TOC drift vs `<!-- toc -->` markers or top link list |
| `md_heading_lint` | Empty / duplicate / skip-level / trailing `#` findings |
| `md_link_scan` | List markdown links; flag empty, `javascript:`, bare `#` |

## Start

```bash
node /workspace/markdown-toc-lint/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/markdown-toc-lint`

## Skills

- **md-toc-workflow** — generate and verify table of contents
- **md-heading-link-lint** — heading structure and link safety

## License

MIT © Lawrence Hutchins
