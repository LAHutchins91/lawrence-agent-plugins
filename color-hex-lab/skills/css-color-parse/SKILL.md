---
name: css-color-parse
description: >
  Parse CSS colors (hex / rgb / hsl), convert hex↔rgb, and lighten/darken via
  HSL — zero-auth, pure local TypeScript.
version: 1.0.0
tags: [color, css, hex, rgb, hsl, local]
---

# CSS color parse / convert / lighten

When the user asks to parse a CSS color, convert hex↔rgb, normalize to hsl, or lighten/darken:

1. Call **`parse_css_color`** with `color` → `{hex, rgb, hsl}`.
2. Call **`hex_to_rgb`** or **`rgb_to_hex`** for direct channel conversions.
3. Call **`lighten_darken`** with `color` + `amount` (−1..1 fraction or −100..100 L points) → `{resultHex, resultHsl}`.

## Example prompts

- "Parse hsl(210, 50%, 40%) to hex"
- "Convert #0af to rgb"
- "Lighten #336699 by 15%"
- "What is rgba(255,0,0,0.5) as hex?"
