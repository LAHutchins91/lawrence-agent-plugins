import { extractPresets, parseBabelConfigText, } from "../lib/babel_config.js";
export function babelPresetsList(input) {
    const doc = parseBabelConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractPresets(doc.raw);
}
