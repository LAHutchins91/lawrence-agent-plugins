import { extractGlobalsHint } from "../lib/sam_heuristics.js";
export function samGlobalsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { count: 0 };
    }
    const hint = extractGlobalsHint(text);
    const out = { count: hint.count };
    if (hint.globals)
        out.globals = hint.globals;
    if (hint.transform !== undefined)
        out.transform = hint.transform;
    if (hint.description)
        out.description = hint.description;
    if (hint.parameters && hint.parameters.length > 0) {
        out.parameters = hint.parameters;
    }
    return out;
}
