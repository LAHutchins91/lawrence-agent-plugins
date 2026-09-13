import { extractLoaders, parseWebpackConfigText, } from "../lib/webpack_config.js";
export function wpLoadersSummary(input) {
    const doc = parseWebpackConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractLoaders(doc.raw);
}
