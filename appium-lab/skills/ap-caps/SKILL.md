---
name: ap-caps
description: >
  List Appium desiredCapabilities / capabilities keys (platformName,
  deviceName, app, appPackage, appActivity, automationName, udid,
  browserName, …) and By.accessibilityId / accessibility id / -ios
  predicate / -android uiautomator / xpath / id / class name / MobileBy /
  findElement / findElements / $` / $$ counts from pasted Appium JS/TS.
  Local only — never runs Appium or launches a device/emulator/WebDriver,
  no fetch.
version: 1.0.0
tags: [appium, mobile, capabilities, local]
---

# Appium capabilities & locators

Use these tools when the user pastes Appium JS/TS/JSON-ish text (never fetch a remote file, never run Appium/device/WebDriver):

1. **`ap_caps_list`** with `source` — → `{caps: [{key, value?}], count}`.
2. **`ap_locators_hint`** with `source` — → `{locators: [{method, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not the Appium runtime; no device; no network).

## Example prompts

- "Which capability keys does this file set?"
- "How many xpath vs accessibilityId calls are in this file?"
- "List platformName / appPackage from these caps."
