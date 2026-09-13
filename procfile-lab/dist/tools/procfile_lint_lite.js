import { lintProcfile } from "../lib/procfile.js";
export function procfileLintLite(input) {
    const findings = lintProcfile(input.text ?? "");
    return { findings, findingCount: findings.length };
}
