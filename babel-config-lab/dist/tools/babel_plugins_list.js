import { extractPlugins, parseBabelConfigText, } from "../lib/babel_config.js";
export function babelPluginsList(input) {
    const doc = parseBabelConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractPlugins(doc.raw, doc.source);
}
