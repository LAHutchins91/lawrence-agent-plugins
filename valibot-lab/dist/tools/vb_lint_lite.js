import { lintValibot } from "../lib/valibot_schema.js";
export function vbLintLite(input) {
    const findings = lintValibot(input.text ?? "");
    return { findings, findingCount: findings.length };
}
