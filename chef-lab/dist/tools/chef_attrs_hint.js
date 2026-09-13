import { extractAttrs } from "../lib/chef_heuristics.js";
export function chefAttrsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { attrs: [], count: 0 };
    }
    const hint = extractAttrs(text);
    const out = {
        attrs: hint.attrs,
        count: hint.attrs.length,
    };
    if (hint.secretKeyNames.length)
        out.secretKeyNames = hint.secretKeyNames;
    return out;
}
