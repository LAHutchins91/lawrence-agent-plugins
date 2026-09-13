import { lintPacker } from "../lib/packer_heuristics.js";
export function packerLintLite(input) {
    const findings = lintPacker(input.text ?? "");
    return { findings, findingCount: findings.length };
}
