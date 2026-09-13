import { extractEntryPoints, parseWebpackConfigText, } from "../lib/webpack_config.js";
export function wpEntryPoints(input) {
    const doc = parseWebpackConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractEntryPoints(doc.raw);
}
