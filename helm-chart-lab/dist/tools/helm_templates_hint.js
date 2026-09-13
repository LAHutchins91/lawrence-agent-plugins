import { analyzeTemplates } from "../lib/helm_heuristics.js";
export function helmTemplatesHint(input) {
    const text = input.text ?? "";
    const { kinds, valuesRefs, helpers } = analyzeTemplates(text);
    return {
        kinds,
        valuesRefs,
        helpers,
        count: kinds.length + valuesRefs.length + helpers.length,
    };
}
