import { lintZod } from "../lib/zod_schema.js";
export function zodLintLite(input) {
    const findings = lintZod(input.text ?? "");
    return { findings, findingCount: findings.length };
}
