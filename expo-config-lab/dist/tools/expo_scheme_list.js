import { extractSchemeList, parseExpoConfigText, } from "../lib/expo_config.js";
export function expoSchemeList(input) {
    const doc = parseExpoConfigText(input.text ?? "");
    return extractSchemeList(doc.expo, doc.source);
}
