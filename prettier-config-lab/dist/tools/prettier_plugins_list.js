import { extractPlugins, parsePrettierConfigText, } from "../lib/prettier_config.js";
export function prettierPluginsList(input) {
    const doc = parsePrettierConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    const plugins = extractPlugins(doc.raw);
    return { plugins, count: plugins.length };
}
