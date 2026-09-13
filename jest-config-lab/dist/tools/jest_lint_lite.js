import { lintJestConfig, parseJestConfigText, } from "../lib/jest_config.js";
export function jestLintLite(input) {
    const doc = parseJestConfigText(input.text ?? "");
    const findings = lintJestConfig(doc.raw, doc.parseError, doc.format, doc.fromPackageJson);
    return { findings, findingCount: findings.length };
}
