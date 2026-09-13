import { extractNameMain, parseWranglerTomlText, } from "../lib/wrangler_toml.js";
export function wranglerNameMain(input) {
    const doc = parseWranglerTomlText(input.text ?? "");
    return extractNameMain(doc.raw, doc.source);
}
