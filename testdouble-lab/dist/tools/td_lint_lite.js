import { lintTestdouble } from "../lib/testdouble_heuristics.js";
export function tdLintLite(input) {
    const findings = lintTestdouble(input.text ?? "");
    return { findings, findingCount: findings.length };
}
