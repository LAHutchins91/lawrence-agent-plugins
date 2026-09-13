import { extractCoreOptions, parsePrettierConfigText, } from "../lib/prettier_config.js";
export function prettierOptionsSummary(input) {
    const doc = parsePrettierConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    const options = extractCoreOptions(doc.raw);
    const keys = Object.keys(options).sort();
    return { options, keys };
}
