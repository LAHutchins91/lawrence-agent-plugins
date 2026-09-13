/**
 * Best-effort Maestro YAML flow text heuristics.
 * Uses `yaml` package. No Maestro / device runtime, no network, no filesystem follow, no eval.
 */
import { parseAllDocuments } from "yaml";
const SELECTOR_COMMANDS = new Set([
    "tapOn",
    "doubleTapOn",
    "longPressOn",
    "assertVisible",
    "assertNotVisible",
    "copyTextFrom",
    "scrollUntilVisible",
]);
const NAV_COMMANDS = new Set([
    "launchApp",
    "openLink",
    "runFlow",
    "back",
    "pressBack",
]);
const ASSERT_COMMANDS = new Set([
    "assertVisible",
    "assertNotVisible",
    "assertTrue",
]);
export function isPlainObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
}
function asString(v) {
    if (typeof v === "string" && v.trim())
        return v;
    if (typeof v === "number" || typeof v === "boolean")
        return String(v);
    return undefined;
}
function asStringList(v) {
    if (!Array.isArray(v))
        return undefined;
    const out = [];
    for (const item of v) {
        const s = asString(item);
        if (s !== undefined)
            out.push(s);
    }
    return out.length ? out : undefined;
}
/** Extract Maestro command name from a list item (string or single-key map). */
export function commandNameFromStep(step) {
    if (typeof step === "string") {
        const name = step.trim();
        return name.length ? name : undefined;
    }
    if (!isPlainObject(step))
        return undefined;
    const keys = Object.keys(step);
    if (keys.length === 0)
        return undefined;
    // Prefer the first key that looks like a Maestro command (not optional/label/etc.)
    const metaKeys = new Set([
        "optional",
        "label",
        "id",
        "text",
        "point",
        "enabled",
        "timeout",
    ]);
    for (const k of keys) {
        if (!metaKeys.has(k))
            return k;
    }
    return keys[0];
}
function nestedCommandsLists(value) {
    const lists = [];
    if (!isPlainObject(value))
        return lists;
    for (const key of ["commands", "then", "else", "runFlow"]) {
        const v = value[key];
        if (Array.isArray(v))
            lists.push(v);
    }
    // runFlow can be a string path or { file, commands?, env? }
    if (isPlainObject(value.runFlow) && Array.isArray(value.runFlow.commands)) {
        lists.push(value.runFlow.commands);
    }
    // repeat: { times, commands: [...] }
    if (isPlainObject(value) && Array.isArray(value.commands)) {
        // already covered
    }
    return lists;
}
function walkSteps(steps, onCommand) {
    for (const step of steps) {
        const name = commandNameFromStep(step);
        if (name)
            onCommand(name, step);
        if (typeof step === "string")
            continue;
        if (!isPlainObject(step))
            continue;
        // Value under the command key may hold nested commands
        const cmdVal = name ? step[name] : undefined;
        for (const list of nestedCommandsLists(cmdVal)) {
            walkSteps(list, onCommand);
        }
        // Also check top-level nested lists on the step object (rare)
        for (const list of nestedCommandsLists(step)) {
            walkSteps(list, onCommand);
        }
    }
}
function selectorFromCommandValue(cmdName, value) {
    if (!SELECTOR_COMMANDS.has(cmdName))
        return [];
    const out = [];
    if (typeof value === "string" || typeof value === "number") {
        out.push({ kind: "text", value: String(value) });
        return out;
    }
    if (!isPlainObject(value))
        return out;
    if (Object.prototype.hasOwnProperty.call(value, "id")) {
        const id = asString(value.id) ?? (value.id !== undefined ? String(value.id) : undefined);
        out.push(id !== undefined ? { kind: "id", value: id } : { kind: "id" });
    }
    if (Object.prototype.hasOwnProperty.call(value, "text")) {
        const text = asString(value.text) ??
            (value.text !== undefined ? String(value.text) : undefined);
        out.push(text !== undefined ? { kind: "text", value: text } : { kind: "text" });
    }
    if (Object.prototype.hasOwnProperty.call(value, "point")) {
        const point = value.point;
        let pointVal;
        if (typeof point === "string" || typeof point === "number") {
            pointVal = String(point);
        }
        else if (Array.isArray(point)) {
            pointVal = point.map(String).join(",");
        }
        else if (isPlainObject(point)) {
            const x = point.x ?? point[0];
            const y = point.y ?? point[1];
            if (x !== undefined && y !== undefined)
                pointVal = `${x},${y}`;
            else
                pointVal = JSON.stringify(point);
        }
        else if (point !== undefined && point !== null) {
            pointVal = String(point);
        }
        out.push(pointVal !== undefined ? { kind: "point", value: pointVal } : { kind: "point" });
    }
    // CSS / below / above / leftOf / rightOf / containsChild — capture as kind
    for (const kind of [
        "css",
        "below",
        "above",
        "leftOf",
        "rightOf",
        "containsChild",
        "containsDescendants",
    ]) {
        if (Object.prototype.hasOwnProperty.call(value, kind)) {
            const v = value[kind];
            if (typeof v === "string" || typeof v === "number") {
                out.push({ kind, value: String(v) });
            }
            else if (isPlainObject(v) && (v.id !== undefined || v.text !== undefined)) {
                // relative selector — record kind only, or flatten id/text
                if (v.id !== undefined)
                    out.push({ kind, value: `id:${String(v.id)}` });
                else if (v.text !== undefined)
                    out.push({ kind, value: `text:${String(v.text)}` });
                else
                    out.push({ kind });
            }
            else {
                out.push({ kind });
            }
        }
    }
    // If object had no known selector keys but was used with tapOn, treat as opaque
    if (out.length === 0 &&
        (Object.prototype.hasOwnProperty.call(value, "width") ||
            Object.prototype.hasOwnProperty.call(value, "height") ||
            Object.prototype.hasOwnProperty.call(value, "enabled") ||
            Object.prototype.hasOwnProperty.call(value, "checked") ||
            Object.prototype.hasOwnProperty.call(value, "selected"))) {
        // traits-only selector — skip
    }
    return out;
}
function extractSelectorsFromStep(step) {
    if (!isPlainObject(step))
        return [];
    const name = commandNameFromStep(step);
    if (!name || !SELECTOR_COMMANDS.has(name))
        return [];
    return selectorFromCommandValue(name, step[name]);
}
/**
 * Parse Maestro flow YAML text into meta + steps + selectors.
 */
export function parseMaestroFlow(text) {
    const raw = (text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const result = {
        steps: [],
        allCommands: [],
        selectors: [],
    };
    if (!raw.trim())
        return result;
    let docs;
    try {
        docs = parseAllDocuments(raw, { uniqueKeys: false });
    }
    catch (err) {
        result.parseError = err instanceof Error ? err.message : String(err);
        return result;
    }
    const errors = docs
        .map((d) => d.errors)
        .flat()
        .filter(Boolean);
    if (errors.length > 0) {
        // Soft-fail: still try to read what we can
        const msg = errors[0]?.message ?? String(errors[0]);
        result.parseError = msg;
    }
    const roots = [];
    for (const doc of docs) {
        try {
            if (doc.errors?.length && doc.contents == null)
                continue;
            roots.push(doc.toJSON());
        }
        catch (err) {
            result.parseError =
                (result.parseError ? result.parseError + "; " : "") +
                    (err instanceof Error ? err.message : String(err));
        }
    }
    const stepLists = [];
    for (const root of roots) {
        if (root === null || root === undefined)
            continue;
        if (Array.isArray(root)) {
            stepLists.push(root);
            continue;
        }
        if (!isPlainObject(root))
            continue;
        // Meta fields
        if (result.appId === undefined) {
            const appId = asString(root.appId) ?? asString(root.app_id);
            if (appId)
                result.appId = appId;
        }
        if (result.name === undefined) {
            const name = asString(root.name);
            if (name)
                result.name = name;
        }
        if (result.tags === undefined) {
            const tags = asStringList(root.tags);
            if (tags)
                result.tags = tags;
        }
        // Some flows embed steps under `commands:` or mix meta + trailing list (invalid) —
        // also accept `steps:` / `flow:` keys if present.
        for (const key of ["commands", "steps", "flow"]) {
            if (Array.isArray(root[key]))
                stepLists.push(root[key]);
        }
    }
    // Top-level ordered steps = concatenation of sequence documents (Maestro style)
    for (const list of stepLists) {
        for (const step of list) {
            const name = commandNameFromStep(step);
            if (name)
                result.steps.push(name);
        }
    }
    // All commands including nested + selectors
    for (const list of stepLists) {
        walkSteps(list, (name, step) => {
            result.allCommands.push(name);
            for (const sel of extractSelectorsFromStep(step)) {
                result.selectors.push(sel);
            }
        });
    }
    return result;
}
export function listFlows(text) {
    const parsed = parseMaestroFlow(text ?? "");
    const out = {
        steps: parsed.steps,
        count: parsed.steps.length,
    };
    if (parsed.appId !== undefined)
        out.appId = parsed.appId;
    if (parsed.name !== undefined)
        out.name = parsed.name;
    if (parsed.tags !== undefined)
        out.tags = parsed.tags;
    return out;
}
export function listCommands(text) {
    const parsed = parseMaestroFlow(text ?? "");
    const freq = new Map();
    for (const name of parsed.allCommands) {
        freq.set(name, (freq.get(name) ?? 0) + 1);
    }
    const commands = [...freq.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return { commands, total: parsed.allCommands.length };
}
export function listSelectors(text) {
    const parsed = parseMaestroFlow(text ?? "");
    return { selectors: parsed.selectors, count: parsed.selectors.length };
}
export function lintMaestro(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste a Maestro flow YAML (e.g. `appId: com.example` then `---` then a list of `- launchApp` / `- tapOn:` / `- assertVisible:` commands).",
        });
        return findings;
    }
    const parsed = parseMaestroFlow(raw);
    if (parsed.parseError) {
        findings.push({
            severity: "warn",
            rule: "yaml_parse_issue",
            advice: `YAML parse reported an issue (best-effort results may be incomplete): ${parsed.parseError}`,
        });
    }
    const hasMaestroSignal = parsed.appId !== undefined ||
        parsed.name !== undefined ||
        (parsed.tags?.length ?? 0) > 0 ||
        parsed.steps.length > 0 ||
        parsed.allCommands.length > 0 ||
        /\bappId\s*:/.test(raw) ||
        /\b(?:launchApp|tapOn|assertVisible|inputText|runFlow|evalScript)\b/.test(raw);
    if (!hasMaestroSignal) {
        findings.push({
            severity: "warn",
            rule: "no_maestro_detected",
            advice: "No Maestro flow signals detected (`appId`, `launchApp` / `tapOn` / `assertVisible` / `inputText`, or a YAML command list). Confirm this is Maestro flow YAML (not Appium/Espresso — use those labs for that).",
        });
    }
    if (hasMaestroSignal && parsed.appId === undefined && !/\bappId\s*:/.test(raw)) {
        findings.push({
            severity: "warn",
            rule: "missing_appId",
            advice: "No top-level `appId` found. Maestro flows usually declare `appId: com.example.app` (or use a `config.yaml` / `-p` override). Add `appId` so the flow targets the correct package/bundle.",
        });
    }
    if (hasMaestroSignal && parsed.steps.length === 0 && parsed.allCommands.length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_steps",
            advice: "No command steps found after the flow header. Maestro flows typically use a `---` document separator followed by a YAML list (`- launchApp`, `- tapOn: ...`).",
        });
    }
    const pointSelectors = parsed.selectors.filter((s) => s.kind === "point");
    if (pointSelectors.length >= 1) {
        findings.push({
            severity: "info",
            rule: "hardcoded_coordinates_tip",
            advice: `Found ${pointSelectors.length}× \`point\` selector(s). Prefer \`id\` / \`text\` (or accessibility) selectors when possible — hardcoded coordinates are brittle across devices, orientations, and UI changes.`,
        });
    }
    const hasNav = parsed.allCommands.some((c) => NAV_COMMANDS.has(c));
    const hasAssert = parsed.allCommands.some((c) => ASSERT_COMMANDS.has(c));
    if (hasNav && !hasAssert && parsed.allCommands.length >= 2) {
        findings.push({
            severity: "info",
            rule: "missing_assert_after_navigation_tip",
            advice: "Navigation-like commands (`launchApp` / `openLink` / `runFlow` / `back`) without `assertVisible` / `assertNotVisible` / `assertTrue` in this flow. Add assertions after navigation so failures surface at the right step.",
        });
    }
    const evalCount = parsed.allCommands.filter((c) => c === "evalScript").length;
    if (evalCount >= 2) {
        findings.push({
            severity: "warn",
            rule: "evalScript_overuse",
            advice: `Found ${evalCount}× \`evalScript\`. Prefer built-in Maestro commands and \`runFlow\` composition when possible — heavy scripting makes flows harder to read and debug. Reserve \`evalScript\` for small glue (output vars, conditionals).`,
        });
    }
    else if (evalCount === 1) {
        findings.push({
            severity: "info",
            rule: "evalScript_present",
            advice: "`evalScript` present — fine for small glue, but keep scripts short and avoid embedding large test logic that belongs in `runFlow` / native commands.",
        });
    }
    // inputText without prior tapOn / focus hint
    const hasInput = parsed.allCommands.some((c) => c === "inputText");
    const hasTap = parsed.allCommands.some((c) => ["tapOn", "doubleTapOn", "longPressOn"].includes(c));
    if (hasInput && !hasTap) {
        findings.push({
            severity: "info",
            rule: "inputText_without_tap_tip",
            advice: "`inputText` without a preceding `tapOn` / focus step in this text. Ensure the target field is focused (or use `tapOn` + `inputText`), otherwise input may go to the wrong element.",
        });
    }
    // Very long flows tip
    if (parsed.steps.length >= 40) {
        findings.push({
            severity: "info",
            rule: "long_flow_tip",
            advice: `Flow has ${parsed.steps.length} top-level steps. Consider splitting with \`runFlow\` into smaller reusable flows for readability and reuse.`,
        });
    }
    return findings;
}
