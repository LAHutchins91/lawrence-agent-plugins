import { lintEspresso } from "../lib/espresso_heuristics.js";
export function esLintLite(input) {
    const findings = lintEspresso(input.text ?? "");
    return { findings, findingCount: findings.length };
}
