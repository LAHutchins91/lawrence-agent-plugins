import { lintOpenApi } from "../lib/openapi_zod.js";
export function ozLintLite(input) {
    const findings = lintOpenApi(input.text ?? "");
    return { findings, findingCount: findings.length };
}
