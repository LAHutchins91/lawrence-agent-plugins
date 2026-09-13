import { lintWrk } from "../lib/wrk_heuristics.js";
export function wrkLintLite(input) {
    const findings = lintWrk(input.text ?? "");
    return { findings, findingCount: findings.length };
}
