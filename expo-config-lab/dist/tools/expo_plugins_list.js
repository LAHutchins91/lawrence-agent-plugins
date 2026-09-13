import { extractPluginsList, parseExpoConfigText, } from "../lib/expo_config.js";
export function expoPluginsList(input) {
    const doc = parseExpoConfigText(input.text ?? "");
    return extractPluginsList(doc.expo, doc.source);
}
