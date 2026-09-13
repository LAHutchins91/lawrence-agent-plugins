import { lintSkaffold } from "../lib/skaffold_heuristics.js";
export function skLintLite(input) {
    const findings = lintSkaffold(input.text ?? "");
    return { findings, findingCount: findings.length };
}
