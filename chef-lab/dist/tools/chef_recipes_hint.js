import { extractRecipes } from "../lib/chef_heuristics.js";
export function chefRecipesHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { resources: [], count: 0 };
    }
    const hint = extractRecipes(text);
    const out = {
        resources: hint.resources,
        count: hint.resources.length,
    };
    if (hint.includes.length)
        out.includes = hint.includes;
    return out;
}
