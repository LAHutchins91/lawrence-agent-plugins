import { lintCdk8s } from "../lib/cdk8s_heuristics.js";
export function cdk8sLintLite(input) {
    const findings = lintCdk8s(input.text ?? "");
    return { findings, findingCount: findings.length };
}
