import { extractRoutesHint, parseRemixConfigText, } from "../lib/remix_config.js";
export function remixRoutesHint(input) {
    const doc = parseRemixConfigText(input.text ?? "");
    return extractRoutesHint(doc.raw, doc.source);
}
