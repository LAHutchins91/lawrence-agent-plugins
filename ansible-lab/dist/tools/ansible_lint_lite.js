import { lintAnsible } from "../lib/ansible_heuristics.js";
export function ansibleLintLite(input) {
    const findings = lintAnsible(input.text ?? "");
    return { findings, findingCount: findings.length };
}
