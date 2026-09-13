import { extractOverrides, parsePrettierConfigText, } from "../lib/prettier_config.js";
export function prettierOverridesList(input) {
    const doc = parsePrettierConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    const overrides = extractOverrides(doc.raw);
    return { overrides, count: overrides.length };
}
