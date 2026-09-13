/**
 * Best-effort Espresso Java/Kotlin test text heuristics.
 * No Android / Espresso runtime, no network, no filesystem follow, no eval / no compiler.
 */
/** Strip // and /* * / comments; leave strings roughly intact (Java/Kotlin). */
export function stripComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let quote = "";
    let inRaw = false; // Kotlin """ or Java text blocks """ roughly
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        const next2 = i + 2 < n ? src[i + 2] : "";
        if (inRaw) {
            out += ch;
            if (ch === '"' && next === '"' && next2 === '"') {
                out += '""';
                inRaw = false;
                i += 3;
                continue;
            }
            i++;
            continue;
        }
        if (inString) {
            out += ch;
            if (ch === "\\" && i + 1 < n) {
                out += src[i + 1];
                i += 2;
                continue;
            }
            if (ch === quote)
                inString = false;
            i++;
            continue;
        }
        // Kotlin/Java text block """
        if (ch === '"' && next === '"' && next2 === '"') {
            inRaw = true;
            out += '"""';
            i += 3;
            continue;
        }
        if (ch === '"' || ch === "'") {
            inString = true;
            quote = ch;
            out += ch;
            i++;
            continue;
        }
        if (ch === "/" && next === "/") {
            i += 2;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
        if (ch === "/" && next === "*") {
            i += 2;
            while (i + 1 < n && !(src[i] === "*" && src[i + 1] === "/"))
                i++;
            i = Math.min(n, i + 2);
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
const MATCHER_NAMES = [
    "withId",
    "withText",
    "withContentDescription",
    "withClassName",
    "withHint",
    "withTagKey",
    "withTagValue",
    "withParent",
    "withChild",
    "withSibling",
    "withEffectiveVisibility",
    "withResourceName",
    "withSubstring",
    "withSpinnerText",
    "withInputType",
    "isDisplayed",
    "isCompletelyDisplayed",
    "isDisplayingAtLeast",
    "isEnabled",
    "isClickable",
    "isChecked",
    "isNotChecked",
    "isSelected",
    "isFocused",
    "isFocusable",
    "isJavascriptEnabled",
    "isRoot",
    "isAssignableFrom",
    "hasDescendant",
    "hasSibling",
    "hasChildCount",
    "hasMinimumChildCount",
    "hasFocus",
    "hasErrorText",
    "hasLinks",
    "hasImeAction",
    "supportsInputMethods",
    "doesNotExist",
    "doesNotHaveFocus",
    "matches",
    "doesNotMatch",
    "allOf",
    "anyOf",
    "not",
    "is",
    "equalTo",
    "containsString",
    "startsWith",
    "endsWith",
    "instanceOf",
];
/**
 * List Espresso / Hamcrest ViewMatchers (and common combinators) from test text.
 */
export function listMatchers(text) {
    const cleaned = stripComments(text ?? "");
    const matchers = [];
    const seen = new Set();
    const push = (name, index) => {
        const key = `${name}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        matchers.push({ name });
    };
    // ViewMatchers.withId / ViewMatchers.isDisplayed
    const vmRe = /\bViewMatchers\s*\.\s*([A-Za-z_][\w]*)\s*\(/g;
    let m;
    while ((m = vmRe.exec(cleaned))) {
        push(m[1], m.index);
    }
    // static imports / bare calls: withId(, withText(, isDisplayed(, allOf(, anyOf(
    for (const name of MATCHER_NAMES) {
        const re = new RegExp(String.raw `(?<![\w.])${name}\s*\(`, "g");
        while ((m = re.exec(cleaned))) {
            // Skip if already captured via ViewMatchers. prefix immediately before
            const before = cleaned.slice(Math.max(0, m.index - 20), m.index);
            if (/\bViewMatchers\s*\.\s*$/.test(before))
                continue;
            push(name, m.index);
        }
    }
    // onView( ... ) presence doesn't add a matcher name by itself
    return { matchers, count: matchers.length };
}
const ACTION_NAMES = [
    "click",
    "doubleClick",
    "longClick",
    "typeText",
    "typeTextIntoFocusedView",
    "replaceText",
    "clearText",
    "scrollTo",
    "swipeLeft",
    "swipeRight",
    "swipeUp",
    "swipeDown",
    "pressBack",
    "pressBackUnconditionally",
    "pressImeActionButton",
    "pressKey",
    "pressMenuKey",
    "closeSoftKeyboard",
    "openLink",
    "openLinkWithText",
    "openLinkWithUri",
    "scrollToPosition",
    "actionWithAssertions",
    "repeatedlyUntil",
    "slowlySwipeLeft",
];
/**
 * List Espresso ViewActions / onView(...).perform( signals.
 */
export function listActions(text) {
    const cleaned = stripComments(text ?? "");
    const actions = [];
    const seen = new Set();
    const push = (name, index) => {
        const key = `${name}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        actions.push({ name });
    };
    // ViewActions.click / ViewActions.typeText
    const vaRe = /\bViewActions\s*\.\s*([A-Za-z_][\w]*)\s*\(/g;
    let m;
    while ((m = vaRe.exec(cleaned))) {
        push(m[1], m.index);
    }
    // .perform( — record as perform when onView(...).perform( or ViewInteraction.perform
    const performRe = /\.perform\s*\(/g;
    while ((m = performRe.exec(cleaned))) {
        const before = cleaned.slice(Math.max(0, m.index - 80), m.index);
        if (/\bonView\s*\([^)]*\)\s*$/.test(before.replace(/\s+/g, " ")) ||
            /\bonView\b/.test(before) ||
            /\bViewInteraction\b/.test(before) ||
            /\)\s*$/.test(before.trimEnd())) {
            push("perform", m.index);
        }
    }
    // onView( as a signal action entry? Spec says from click()/typeText/.../onView(...).perform(
    // We already handle perform. Also capture bare onView( as "onView" for inventory.
    const onViewRe = /\bonView\s*\(/g;
    while ((m = onViewRe.exec(cleaned))) {
        push("onView", m.index);
    }
    // Bare / static-import actions: click(), typeText(, replaceText(, scrollTo(, swipeLeft(
    for (const name of ACTION_NAMES) {
        const re = new RegExp(String.raw `(?<![\w.])${name}\s*\(`, "g");
        while ((m = re.exec(cleaned))) {
            const before = cleaned.slice(Math.max(0, m.index - 20), m.index);
            if (/\bViewActions\s*\.\s*$/.test(before))
                continue;
            // Avoid matching Hamcrest/assert click-like noise; Espresso click() is typically
            // ViewActions.click() or imported click() inside perform(...).
            // Accept when near perform/onView/ViewActions or Espresso signal in file.
            push(name, m.index);
        }
    }
    return { actions, count: actions.length };
}
/**
 * List IdlingResource-related kinds from test text.
 */
export function listIdling(text) {
    const cleaned = stripComments(text ?? "");
    const idling = [];
    const seen = new Set();
    const push = (kind, index) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        idling.push({ kind });
    };
    const patterns = [
        {
            re: /\bCountingIdlingResource\b/g,
            kind: "CountingIdlingResource",
        },
        {
            re: /\bIdlingRegistry\b/g,
            kind: "IdlingRegistry",
        },
        {
            re: /\bEspressoIdlingResource\b/g,
            kind: "EspressoIdlingResource",
        },
        {
            re: /\bregisterIdlingResources\s*\(/g,
            kind: "registerIdlingResources",
        },
        {
            re: /\bunregisterIdlingResources\s*\(/g,
            kind: "unregisterIdlingResources",
        },
        {
            re: /\bIdlingResource\.ResourceCallback\b|\bResourceCallback\b/g,
            kind: "ResourceCallback",
        },
        // plain IdlingResource — after CountingIdlingResource / EspressoIdlingResource
        {
            re: /\bIdlingResource\b/g,
            kind: "IdlingResource",
        },
        {
            re: /\bEspresso\s*\.\s*registerIdlingResources\s*\(/g,
            kind: "registerIdlingResources",
        },
        {
            re: /\bEspresso\s*\.\s*unregisterIdlingResources\s*\(/g,
            kind: "unregisterIdlingResources",
        },
        {
            re: /\.register\s*\(\s*[^)]*Idling/g,
            kind: "IdlingRegistry.register",
        },
    ];
    for (const { re, kind } of patterns) {
        const r = new RegExp(re.source, "g");
        let m;
        while ((m = r.exec(cleaned))) {
            // Dedup: if CountingIdlingResource matched, don't also push IdlingResource at same span
            if (kind === "IdlingResource") {
                const slice = cleaned.slice(m.index, m.index + m[0].length + 5);
                if (/CountingIdlingResource|EspressoIdlingResource/.test(cleaned.slice(Math.max(0, m.index - 20), m.index + m[0].length))) {
                    // If the match is the suffix of CountingIdlingResource / EspressoIdlingResource, skip
                    const pre = cleaned.slice(Math.max(0, m.index - 16), m.index);
                    if (/Counting$|Espresso$/.test(pre))
                        continue;
                }
                void slice;
            }
            push(kind, m.index);
        }
    }
    return { idling, count: idling.length };
}
function hasEspressoSignal(cleaned) {
    return (/\bandroidx\.test\.espresso\b/.test(cleaned) ||
        /\bandroid\.support\.test\.espresso\b/.test(cleaned) ||
        /\bViewMatchers\b/.test(cleaned) ||
        /\bViewActions\b/.test(cleaned) ||
        /\bonView\s*\(/.test(cleaned) ||
        /\bEspresso\b/.test(cleaned) ||
        /\bIdlingResource\b/.test(cleaned) ||
        /\bCountingIdlingResource\b/.test(cleaned) ||
        /\bIdlingRegistry\b/.test(cleaned) ||
        listMatchers(cleaned).count > 0 ||
        listActions(cleaned).count > 0);
}
export function lintEspresso(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Espresso Java/Kotlin (e.g. onView(withId(...)).perform(click()), ViewMatchers / ViewActions, IdlingResource registration).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { matchers } = listMatchers(cleaned);
    const { actions } = listActions(cleaned);
    const { idling } = listIdling(cleaned);
    if (!hasEspressoSignal(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "no_espresso_detected",
            advice: "No Espresso signals detected (`onView`, `ViewMatchers`/`ViewActions`, `withId`/`withText`, IdlingResource, or `androidx.test.espresso`). Confirm this is Espresso UI-test source (not Compose/`composeTestRule` alone — those APIs differ).",
        });
    }
    // Thread.sleep antipattern
    const sleepCount = countOccurrences(cleaned, /\bThread\s*\.\s*sleep\s*\(/g) +
        countOccurrences(cleaned, /\bSystemClock\s*\.\s*sleep\s*\(/g) +
        countOccurrences(cleaned, /\bdelay\s*\(\s*\d+/g); // kotlinx delay(ms) sometimes abused in tests
    if (sleepCount >= 1) {
        findings.push({
            severity: "warn",
            rule: "thread_sleep_antipattern",
            advice: `Found ${sleepCount}× \`Thread.sleep\` / \`SystemClock.sleep\` / fixed \`delay\`. Prefer IdlingResource / CountingIdlingResource / IdlingRegistry so Espresso waits on app idle instead of arbitrary sleeps.`,
        });
    }
    // missing IdlingResource tip when async-ish patterns without idling
    const looksAsync = /\bAsyncTask\b/.test(cleaned) ||
        /\bOkHttp\b/.test(cleaned) ||
        /\bRetrofit\b/.test(cleaned) ||
        /\bLiveData\b/.test(cleaned) ||
        /\bCoroutine\b/i.test(cleaned) ||
        /\bExecutor\b/.test(cleaned) ||
        /\bHandler\s*\(/.test(cleaned) ||
        sleepCount >= 1;
    const hasIdling = idling.length > 0 ||
        /\bIdlingResource\b/.test(cleaned) ||
        /\bIdlingRegistry\b/.test(cleaned) ||
        /\bregisterIdlingResources\b/.test(cleaned);
    if (looksAsync && !hasIdling) {
        findings.push({
            severity: "info",
            rule: "missing_idling_resource_tip",
            advice: "Async / network / sleep signals without IdlingResource / IdlingRegistry / registerIdlingResources in this text. Register a CountingIdlingResource (or equivalent) around background work so Espresso synchronizes reliably.",
        });
    }
    // withId overuse tip
    const withIdCount = matchers.filter((x) => x.name === "withId").length;
    const withTextCount = matchers.filter((x) => x.name === "withText").length;
    const withDescCount = matchers.filter((x) => x.name === "withContentDescription").length;
    const totalMatchers = matchers.length;
    if (withIdCount >= 3 &&
        withIdCount / Math.max(1, totalMatchers) >= 0.5 &&
        withTextCount + withDescCount === 0) {
        findings.push({
            severity: "info",
            rule: "withId_overuse_tip",
            advice: `Found ${withIdCount}× \`withId\` and little/no \`withText\` / \`withContentDescription\`. Prefer content-description or text matchers for accessibility-friendly, less brittle assertions when R.id churns; keep withId for unique stable ids.`,
        });
    }
    // onView without perform / check
    const onViewCount = countOccurrences(cleaned, /\bonView\s*\(/g);
    const performCount = countOccurrences(cleaned, /\.perform\s*\(/g);
    const checkCount = countOccurrences(cleaned, /\.check\s*\(/g);
    if (onViewCount >= 2 && performCount + checkCount === 0) {
        findings.push({
            severity: "info",
            rule: "onView_without_perform_or_check_tip",
            advice: "`onView(...)` calls without `.perform(` or `.check(` in this text. Espresso interactions usually chain `.perform(ViewActions...)` and assertions via `.check(matches(...))`.",
        });
    }
    // matches(isDisplayed()) leftover without assert style — informational
    const hasIsDisplayed = matchers.some((x) => x.name === "isDisplayed");
    if (onViewCount >= 1 &&
        performCount >= 1 &&
        checkCount === 0 &&
        !hasIsDisplayed) {
        findings.push({
            severity: "info",
            rule: "missing_visibility_assert_tip",
            advice: "Actions (`.perform`) without `.check(matches(isDisplayed()))` (or similar) in this text. Add visibility/state assertions so failures surface intent, not only action exceptions.",
        });
    }
    // ActivityTestRule / ActivityScenario Rule tip
    if (/\bActivityTestRule\b/.test(cleaned) &&
        !/\bActivityScenario\b/.test(cleaned) &&
        !/\bActivityScenarioRule\b/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "activity_test_rule_legacy_tip",
            advice: "`ActivityTestRule` detected. Prefer `ActivityScenario` / `ActivityScenarioRule` (AndroidX) for modern lifecycle control in Espresso tests.",
        });
    }
    // Thread.sleep already covered; also flag bare sleep in Kotlin Thread.sleep
    void actions;
    return findings;
}
