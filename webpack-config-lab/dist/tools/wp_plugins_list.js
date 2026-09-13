import { extractPlugins, parseWebpackConfigText, } from "../lib/webpack_config.js";
export function wpPluginsList(input) {
    const doc = parseWebpackConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractPlugins(doc.raw, doc.source);
}
