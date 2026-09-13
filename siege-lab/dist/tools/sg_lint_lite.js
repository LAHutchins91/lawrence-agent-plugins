import { lintSiege } from "../lib/sg_heuristics.js";
export function sgLintLite(input) {
    const findings = lintSiege(input.text ?? "");
    return { findings, findingCount: findings.length };
}
