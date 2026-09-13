import { extractPlugins, parseRollupConfigText, } from "../lib/rollup_config.js";
export function rollupPluginsList(input) {
    const doc = parseRollupConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractPlugins(doc.raw, doc.source);
}
