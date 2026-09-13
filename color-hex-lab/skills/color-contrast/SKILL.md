---
name: color-contrast
description: >
  Check WCAG 2.x contrast ratio between two colors (hex or rgb) with AA/AAA
  pass for normal and large text — zero-auth, local relative luminance.
version: 1.0.0
tags: [color, contrast, wcag, a11y, hex, local]
---

# Color contrast (WCAG)

When the user asks whether text/background colors meet WCAG, what the contrast ratio is, or AA/AAA pass/fail:

1. Call **`color_contrast`** with `color1` and `color2` (hex strings or `{r,g,b}`) → `{ratio, ratioFormatted, luminance1, luminance2, aa, aaa, passes}`.
2. Report the ratio (e.g. `4.52:1`) and which of AA/AAA normal (≥4.5 / ≥7) and large (≥3 / ≥4.5) pass.
3. Optionally use **`hex_to_rgb`** / **`parse_css_color`** if they need channel breakdown first.

## Example prompts

- "Does #333 on #fff pass WCAG AA?"
- "Contrast ratio of rgb(0,0,0) vs #0af"
- "AA and AAA for this button text color"
