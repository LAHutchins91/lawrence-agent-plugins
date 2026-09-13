import { lintSam } from "../lib/sam_heuristics.js";
export function samLintLite(input) {
    const findings = lintSam(input.text ?? "");
    return { findings, findingCount: findings.length };
}
