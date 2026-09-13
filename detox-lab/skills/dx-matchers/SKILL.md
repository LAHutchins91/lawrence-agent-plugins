---
name: dx-matchers
description: "List Detox by.id / by.text / by.label / by.type / by.traits / element(by. matcher call sites and tap / longPress / multiTap / typeText / replaceText / clearText / scroll / scrollTo / swipe / setColumnToValue / setDatePickerDate action counts from pasted Detox JS/TS. Local only — never runs Detox or launches a device/emulator, no fetch."
version: 1.0.0
tags: [detox, mobile, matchers, local]
---

# Detox matchers & actions

Use these tools when the user pastes Detox JS/TS text (never fetch a remote file, never run Detox/device/emulator):

1. **`dx_matchers_list`** with `source` — → `{matchers: [{method, arg?}], count}`.
2. **`dx_actions_hint`** with `source` — → `{actions: [{method, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not the Detox runtime; no device; no network).

## Example prompts

- "Which by.id / by.text matchers does this file use?"
- "How many tap vs typeText calls are in this file?"
- "List matcher call sites from this Detox spec."
