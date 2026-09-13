import { lintGrpcurl } from "../lib/gc_heuristics.js";
export function gcLintLite(input) {
    const findings = lintGrpcurl(input.text ?? "");
    return { findings, findingCount: findings.length };
}
