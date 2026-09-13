import { extractPluginsList, parseCapacitorConfigText, } from "../lib/capacitor_config.js";
export function capPluginsList(input) {
    const doc = parseCapacitorConfigText(input.text ?? "");
    return extractPluginsList(doc.raw, doc.source);
}
