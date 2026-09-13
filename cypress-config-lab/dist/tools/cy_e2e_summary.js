import { extractE2e, parseCypressConfigText, } from "../lib/cypress_config.js";
export function cyE2eSummary(input) {
    const doc = parseCypressConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractE2e(doc.raw);
}
