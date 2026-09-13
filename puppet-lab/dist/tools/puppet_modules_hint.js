import { extractModules } from "../lib/puppet_heuristics.js";
export function puppetModulesHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { modules: [], count: 0 };
    }
    const modules = extractModules(text);
    return { modules, count: modules.length };
}
