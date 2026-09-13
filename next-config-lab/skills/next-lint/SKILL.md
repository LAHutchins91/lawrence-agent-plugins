---
name: next-lint
description: "Lite-lint pasted next.config.* for reactStrictMode missing/false, images.unoptimized true note, experimental flags present (info), and empty rewrites. Local only, no Next binary for tool logic, no fetch."
version: 1.0.0
tags: [next, nextjs, lint, reactStrictMode, images, experimental, rewrites, local]
---

# Next lint

Use **`next_lint_lite`** with `configText` on pasted Next.js config (do not fetch URLs or run Next for analysis):

- `reactStrictMode` missing or explicitly `false` (warning)
- `images.unoptimized: true` note (info)
- `experimental` flags present (info)
- Empty `rewrites: []` or async rewrites returning `[]` (warning)

Heuristic only — not Next.js CLI / not a full AST. Lite JS config scanner. Async functions may only partially extract.

## Example prompts

- "Lint this next.config.js for missing reactStrictMode."
- "Is images.unoptimized set in this pasted Next config?"
- "Are there experimental flags or empty rewrites here?"
