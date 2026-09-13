import { lintKubb } from "../lib/kb_heuristics.js";
export function kbLintLite(input) {
    const findings = lintKubb(input.text ?? "");
    return { findings, findingCount: findings.length };
}
