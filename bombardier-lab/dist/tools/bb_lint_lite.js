import { lintBombardier } from "../lib/bb_heuristics.js";
export function bbLintLite(input) {
    const findings = lintBombardier(input.text ?? "");
    return { findings, findingCount: findings.length };
}
