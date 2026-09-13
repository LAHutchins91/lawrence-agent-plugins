import { extractServerBuildHint, parseRemixConfigText, } from "../lib/remix_config.js";
export function remixServerBuildHint(input) {
    const doc = parseRemixConfigText(input.text ?? "");
    return extractServerBuildHint(doc.raw, doc.source);
}
