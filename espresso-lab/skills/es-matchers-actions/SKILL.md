---
name: es-matchers-actions
description: "Extract Espresso ViewMatchers (withId/withText/isDisplayed/allOf/…) and ViewActions / onView(...).perform( signals from Java/Kotlin test text with the local zero-auth espresso-lab MCP. No Android/Espresso runtime, no network."
version: 1.0.0
tags: [espresso, android, matchers, actions, developer-tools]
---

# Espresso matchers & actions

When the user pastes **Espresso** Java/Kotlin UI-test source and needs matcher/action inventory:

1. **`es_matchers_list`** — `{ text }` → `{ matchers: [{name}], count }` from `withId` / `withText` / `withContentDescription` / `isDisplayed` / `allOf` / `anyOf` / `ViewMatchers.` etc.
2. **`es_actions_hint`** — `{ text }` → `{ actions: [{name}], count }` from `click()` / `typeText` / `replaceText` / `scrollTo` / `swipeLeft` / `ViewActions.` / `onView(...).perform(`.

## Example prompts

- "Which ViewMatchers does this Espresso test use?"
- "List click/typeText/scrollTo actions in this Kotlin test"
- "What does onView(...).perform(...) call here?"
