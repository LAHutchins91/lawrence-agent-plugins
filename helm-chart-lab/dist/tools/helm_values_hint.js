import { analyzeValues, parseYamlObject, } from "../lib/helm_heuristics.js";
export function helmValuesHint(input) {
    const text = input.text ?? "";
    const trimmed = text.trim();
    if (!trimmed) {
        return { keys: [], hints: [], count: 0 };
    }
    const raw = parseYamlObject(trimmed);
    const { keys, hints, secretKeyNames } = analyzeValues(raw);
    const out = {
        keys,
        hints,
        count: keys.length,
    };
    if (secretKeyNames.length > 0) {
        out.secretKeyNames = secretKeyNames;
    }
    return out;
}
