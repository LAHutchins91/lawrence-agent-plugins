import { lintChef } from "../lib/chef_heuristics.js";
export function chefLintLite(input) {
    const findings = lintChef(input.text ?? "");
    return { findings, findingCount: findings.length };
}
