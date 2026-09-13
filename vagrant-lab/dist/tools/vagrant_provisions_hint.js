import { extractProvisions, } from "../lib/vagrant_heuristics.js";
export function vagrantProvisionsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { provisions: [], count: 0 };
    }
    const provisions = extractProvisions(text);
    return { provisions, count: provisions.length };
}
