import { lintJoi } from "../lib/joi_schema.js";
export function joiLintLite(input) {
    const findings = lintJoi(input.text ?? "");
    return { findings, findingCount: findings.length };
}
