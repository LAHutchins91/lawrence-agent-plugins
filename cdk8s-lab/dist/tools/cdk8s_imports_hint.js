import { extractImports } from "../lib/cdk8s_heuristics.js";
export function cdk8sImportsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { imports: [], count: 0 };
    }
    const imports = extractImports(text);
    return { imports, count: imports.length };
}
