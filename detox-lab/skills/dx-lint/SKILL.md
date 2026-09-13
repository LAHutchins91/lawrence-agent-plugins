---
name: dx-lint
description: >
  Count Detox waitFor / whileElement / withTimeout / toBeVisible /
  toExist / toHaveText / toHaveValue / detox.device.reloadReactNative /
  device.launchApp sync hints and lite-lint for hard sleeps, missing
  waitFor around tap/typeText, text-matcher-heavy usage, empty file,
  and reloadReactNative in tests. Local only, never runs Detox/device,
  no fetch.
version: 1.0.0
tags: [detox, mobile, lint, local]
---

# Detox sync & lite lint

Use these tools on pasted Detox JS/TS (do not fetch URLs or run Detox/device/emulator):

1. **`dx_sync_hint`** with `source` — → `{sync: [{method, count}], count}`.
2. **`dx_lint_lite`** with `source` — findings:
   - Hard sleep / setTimeout-as-sync / huge withTimeout (warning)
   - tap/typeText without nearby waitFor/toBeVisible (warning)
   - Many by.text vs by.id (info/warning)
   - Empty file (warning)
   - reloadReactNative in tests (info)

Heuristic only — not the Detox CLI or device runtime. Lite JS/TS scanner.

## Example prompts

- "Any hard sleep / huge withTimeout calls?"
- "Are taps guarded by waitFor/toBeVisible?"
- "Lint this Detox file for text-matcher-heavy or reloadReactNative usage."
