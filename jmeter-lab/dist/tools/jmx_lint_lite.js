import { lintJmeter } from "../lib/jmeter_heuristics.js";
export function jmxLintLite(input) {
    const findings = lintJmeter(input.text ?? "");
    return { findings, findingCount: findings.length };
}
