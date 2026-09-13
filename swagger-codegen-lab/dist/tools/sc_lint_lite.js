import { lintSwaggerCodegen } from "../lib/sc_heuristics.js";
export function scLintLite(input) {
    const findings = lintSwaggerCodegen(input.text ?? "");
    return { findings, findingCount: findings.length };
}
