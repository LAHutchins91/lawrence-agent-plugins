import { lintGatling } from "../lib/gatling_heuristics.js";
export function gatLintLite(input) {
    const findings = lintGatling(input.text ?? "");
    return { findings, findingCount: findings.length };
}
