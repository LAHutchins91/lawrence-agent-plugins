import { lintProtoc } from "../lib/pc_heuristics.js";
export function pcLintLite(input) {
    const findings = lintProtoc(input.text ?? "");
    return { findings, findingCount: findings.length };
}
