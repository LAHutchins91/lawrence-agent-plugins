import { lintArm } from "../lib/arm_heuristics.js";
export function armLintLite(input) {
    const findings = lintArm(input.text ?? "");
    return { findings, findingCount: findings.length };
}
