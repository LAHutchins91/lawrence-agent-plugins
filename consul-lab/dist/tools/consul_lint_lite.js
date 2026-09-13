import { lintConsul } from "../lib/consul_heuristics.js";
export function consulLintLite(input) {
    const findings = lintConsul(input.text ?? "");
    return { findings, findingCount: findings.length };
}
