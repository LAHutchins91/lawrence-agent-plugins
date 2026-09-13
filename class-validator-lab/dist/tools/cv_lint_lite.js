import { lintCv } from "../lib/cv_schema.js";
export function cvLintLite(input) {
    const findings = lintCv(input.text ?? "");
    return { findings, findingCount: findings.length };
}
