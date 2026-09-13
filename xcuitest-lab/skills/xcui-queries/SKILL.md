---
name: xcui-queries
description: "List XCUITest buttons / staticTexts / textFields / otherElements / cells / tables / navigationBars / element(matching:) / descendants(matching:) / identifier / label / value query call sites and tap / doubleTap / press / swipeLeft / swipeRight / swipeUp / swipeDown / typeText / clearText / adjustToPickerWheelValue / pinch / rotate action counts from pasted XCUITest Swift/ObjC-ish source. Local only — never runs XCUITest or launches Xcode/simulator, no fetch."
version: 1.0.0
tags: [xcuitest, ios, queries, local]
---

# XCUITest queries & actions

Use these tools when the user pastes XCUITest Swift/ObjC-ish text (never fetch a remote file, never run XCUITest/Xcode/simulator):

1. **`xcui_queries_list`** with `source` — → `{queries: [{method, arg?}], count}`.
2. **`xcui_actions_hint`** with `source` — → `{actions: [{method, count}], count}`.

Lite Swift/ObjC-ish scanner. Input cap ~1MB. Documented limitations apply (not XCUITest runtime; no Xcode/simulator; no network).

## Example prompts

- "Which buttons / staticTexts queries does this file use?"
- "How many tap vs typeText calls are in this file?"
- "List query call sites from this XCUITest spec."
