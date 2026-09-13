import { extractParams } from "../lib/puppet_heuristics.js";
export function puppetParamsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { params: [], count: 0 };
    }
    const hint = extractParams(text);
    const out = {
        params: hint.params,
        count: hint.params.length,
    };
    if (hint.secretKeyNames.length)
        out.secretKeyNames = hint.secretKeyNames;
    return out;
}
