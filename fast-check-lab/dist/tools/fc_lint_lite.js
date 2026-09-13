import { lintFastCheck } from "../lib/fast_check.js";
export function fcLintLite(input) {
    const findings = lintFastCheck(input.text ?? "");
    return { findings, findingCount: findings.length };
}
