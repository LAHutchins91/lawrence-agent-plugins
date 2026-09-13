import { extractPlugins, parsePostcssConfigText, } from "../lib/postcss_config.js";
export function postcssPluginsList(input) {
    const doc = parsePostcssConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractPlugins(doc.raw, doc.source);
}
