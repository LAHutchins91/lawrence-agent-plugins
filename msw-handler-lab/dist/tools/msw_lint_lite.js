import { lintMsw } from "../lib/msw_handlers.js";
export function mswLintLite(input) {
    const findings = lintMsw(input.text ?? "");
    return { findings, findingCount: findings.length };
}
