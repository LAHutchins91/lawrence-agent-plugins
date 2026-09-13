import { lintMaestro } from "../lib/maestro_heuristics.js";
export function maLintLite(input) {
    const findings = lintMaestro(input.text ?? "");
    return { findings, findingCount: findings.length };
}
