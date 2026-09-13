import { extractComponent, parseCypressConfigText, } from "../lib/cypress_config.js";
export function cyComponentSummary(input) {
    const doc = parseCypressConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractComponent(doc.raw);
}
