# Color Hex Lab

Zero-auth **local** MCP tools for hex ↔ RGB, CSS color parsing (hex / rgb / hsl), WCAG contrast ratios, and HSL lighten/darken. No network — pure TypeScript.

## Why novel

A compact color companion for accessibility and design tweaks: convert hex forms, parse CSS colors into normalized hex/rgb/hsl, check WCAG AA/AAA contrast correctly (relative luminance), and nudge lightness without leaving the editor.

## Tools

| Tool | Purpose |
|------|---------|
| `hex_to_rgb` | `#RGB` / `#RRGGBB` / `#RRGGBBAA` → `{r,g,b,a?}` |
| `rgb_to_hex` | `r,g,b[,a]` → `#RRGGBB` or `#RRGGBBAA` |
| `color_contrast` | Two colors → WCAG ratio + AA/AAA normal/large |
| `parse_css_color` | hex / `rgb()` / `rgba()` / `hsl()` / `hsla()` → `{hex, rgb, hsl}` |
| `lighten_darken` | color + amount (−100..100 or −1..1) → `{resultHex, resultHsl}` |

## Start

```bash
node /workspace/color-hex-lab/dist/bundle.js
```

## Skills

- **color-contrast** — WCAG contrast checks between two colors
- **css-color-parse** — parse/convert CSS colors + lighten/darken

## License

MIT © Lawrence Hutchins
