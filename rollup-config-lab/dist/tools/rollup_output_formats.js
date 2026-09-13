import { extractOutputs, parseRollupConfigText, } from "../lib/rollup_config.js";
export function rollupOutputFormats(input) {
    const doc = parseRollupConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractOutputs(doc.raw);
}
