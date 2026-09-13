import { lintVitestMocks } from "../lib/vitest_mocks.js";
export function vmLintLite(input) {
    const findings = lintVitestMocks(input.text ?? "");
    return { findings, findingCount: findings.length };
}
