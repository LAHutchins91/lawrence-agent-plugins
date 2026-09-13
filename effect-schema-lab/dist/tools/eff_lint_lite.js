import { lintEffect } from "../lib/effect_schema.js";
export function effLintLite(input) {
    const findings = lintEffect(input.text ?? "");
    return { findings, findingCount: findings.length };
}
