import { extractInputs, parseRollupConfigText, } from "../lib/rollup_config.js";
export function rollupInputList(input) {
    const doc = parseRollupConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractInputs(doc.raw);
}
