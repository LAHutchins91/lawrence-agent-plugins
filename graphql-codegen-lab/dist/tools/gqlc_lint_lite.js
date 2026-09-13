import { lintGraphqlCodegen } from "../lib/gqlc_heuristics.js";
export function gqlcLintLite(input) {
    const findings = lintGraphqlCodegen(input.text ?? "");
    return { findings, findingCount: findings.length };
}
