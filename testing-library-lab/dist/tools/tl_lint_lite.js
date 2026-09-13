import { lintTestingLibrary } from "../lib/testing_library_heuristics.js";
export function tlLintLite(input) {
    const findings = lintTestingLibrary(input.text ?? "");
    return { findings, findingCount: findings.length };
}
