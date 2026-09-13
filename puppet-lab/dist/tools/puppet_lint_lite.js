import { lintPuppet } from "../lib/puppet_heuristics.js";
export function puppetLintLite(input) {
    const findings = lintPuppet(input.text ?? "");
    return { findings, findingCount: findings.length };
}
