import { extractSlugName, parseExpoConfigText, } from "../lib/expo_config.js";
export function expoSlugName(input) {
    const doc = parseExpoConfigText(input.text ?? "");
    return extractSlugName(doc.expo, doc.source);
}
