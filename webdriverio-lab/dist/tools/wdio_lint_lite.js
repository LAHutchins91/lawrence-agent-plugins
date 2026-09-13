import { lintWdio } from "../lib/wdio_heuristics.js";
export function wdioLintLite(input) {
    const findings = lintWdio(input.text ?? "");
    return { findings, findingCount: findings.length };
}
