import { extractEnv, parseCypressConfigText, } from "../lib/cypress_config.js";
export function cyEnvKeys(input) {
    const doc = parseCypressConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractEnv(doc.raw, true);
}
