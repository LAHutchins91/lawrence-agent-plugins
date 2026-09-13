import { lintNomad } from "../lib/nomad_heuristics.js";
export function nomadLintLite(input) {
    const findings = lintNomad(input.text ?? "");
    return { findings, findingCount: findings.length };
}
