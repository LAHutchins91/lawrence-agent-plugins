import { lintCdktf } from "../lib/cdktf_heuristics.js";
export function cdktfLintLite(input) {
    const findings = lintCdktf(input.text ?? "");
    return { findings, findingCount: findings.length };
}
