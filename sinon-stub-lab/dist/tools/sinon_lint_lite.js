import { lintSinon } from "../lib/sinon_stubs.js";
export function sinonLintLite(input) {
    const findings = lintSinon(input.text ?? "");
    return { findings, findingCount: findings.length };
}
