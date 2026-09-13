import { extractAppId, parseCapacitorConfigText, } from "../lib/capacitor_config.js";
export function capAppId(input) {
    const doc = parseCapacitorConfigText(input.text ?? "");
    return extractAppId(doc.raw, doc.source);
}
