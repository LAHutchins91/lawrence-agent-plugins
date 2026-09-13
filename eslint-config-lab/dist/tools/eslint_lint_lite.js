import { lintEslintConfig, parseEslintConfigText, } from "../lib/eslint_config.js";
export function eslintLintLite(input) {
    const doc = parseEslintConfigText(input.text ?? "");
    const findings = lintEslintConfig(doc.raw, doc.parseError, doc.format);
    return { findings, findingCount: findings.length };
}
