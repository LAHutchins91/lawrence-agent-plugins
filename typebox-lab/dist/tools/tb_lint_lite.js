import { lintTypeBox } from "../lib/typebox_schema.js";
export function tbLintLite(input) {
    const findings = lintTypeBox(input.text ?? "");
    return { findings, findingCount: findings.length };
}
