import { lintSalt } from "../lib/salt_heuristics.js";
export function saltLintLite(input) {
    const findings = lintSalt(input.text ?? "");
    return { findings, findingCount: findings.length };
}
