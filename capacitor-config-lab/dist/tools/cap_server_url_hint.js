import { extractServerUrlHint, parseCapacitorConfigText, } from "../lib/capacitor_config.js";
export function capServerUrlHint(input) {
    const doc = parseCapacitorConfigText(input.text ?? "");
    return extractServerUrlHint(doc.raw, doc.source);
}
