import { extractCookbooks } from "../lib/chef_heuristics.js";
export function chefCookbooksList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { cookbooks: [], count: 0 };
    }
    const cookbooks = extractCookbooks(text);
    return { cookbooks, count: cookbooks.length };
}
