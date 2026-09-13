import { extractRoutes, parseWranglerTomlText, } from "../lib/wrangler_toml.js";
export function wranglerRoutesList(input) {
    const doc = parseWranglerTomlText(input.text ?? "");
    return extractRoutes(doc.raw, doc.source);
}
