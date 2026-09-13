import { lintPulumi } from "../lib/pulumi_heuristics.js";
export function pulumiLintLite(input) {
    const findings = lintPulumi(input.text ?? "");
    return { findings, findingCount: findings.length };
}
