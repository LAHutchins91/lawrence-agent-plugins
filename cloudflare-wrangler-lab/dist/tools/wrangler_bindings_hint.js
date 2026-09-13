import { extractBindingsHint, parseWranglerTomlText, } from "../lib/wrangler_toml.js";
export function wranglerBindingsHint(input) {
    const doc = parseWranglerTomlText(input.text ?? "");
    return extractBindingsHint(doc.raw, doc.source);
}
